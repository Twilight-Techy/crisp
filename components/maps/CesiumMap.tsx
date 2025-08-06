"use client"

import { useRef, useEffect, useCallback } from "react"
import {
    Viewer,
    Ion,
    createWorldTerrainAsync,
    Cartesian3,
    SceneMode,
    Color
} from "cesium"
import "cesium/Build/Cesium/Widgets/widgets.css"

type Incident = {
    id: string
    latitude: number
    longitude: number
    type: string
    status: string
}

export default function CesiumMap({
    incidents,
    searchCoords,
}: {
    incidents: Incident[]
    searchCoords?: [number, number] | null
}) {
    const container = useRef<HTMLDivElement>(null)
    const viewerRef = useRef<Viewer>()
    const isViewerReady = useRef(false)

    const colorMap: Record<string, Color> = {
        theft: Color.RED,
        vandalism: Color.ORANGE,
        assault: Color.DARKRED,
        drug: Color.PURPLE,
        suspicious: Color.YELLOW,
        noise: Color.BLUE,
        traffic: Color.GREEN,
        other: Color.GRAY,
    }

    // Force container to have explicit dimensions
    const ensureContainerSize = useCallback(() => {
        if (container.current) {
            const parent = container.current.parentElement
            if (parent) {
                const rect = parent.getBoundingClientRect()
                container.current.style.width = `${Math.max(rect.width, 400)}px`
                container.current.style.height = `${Math.max(rect.height, 300)}px`
            }
        }
    }, [])

    useEffect(() => {
        // Tell Cesium where to load its static assets
        (window as any).CESIUM_BASE_URL = "/cesium/"

        let mounted = true

        async function initCesium() {
            if (!container.current || viewerRef.current || !mounted) return

            try {
                // Ensure container has explicit dimensions
                ensureContainerSize()

                // Wait a frame to ensure DOM is updated
                await new Promise(resolve => requestAnimationFrame(resolve))

                if (!mounted) return

                // 1) Set your Ion token
                Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN!

                // 2) Create terrain provider
                const terrainProvider = await createWorldTerrainAsync()

                if (!mounted) return

                // 3) Instantiate the viewer with full controls restored
                const viewer = new Viewer(container.current, {
                    terrainProvider,
                    baseLayerPicker: true,
                    geocoder: true,
                    homeButton: false,
                    sceneModePicker: false,
                    timeline: false,
                    animation: false,
                    fullscreenButton: true,
                    vrButton: false,
                    navigationHelpButton: true,
                    navigationInstructionsInitiallyVisible: false,
                })

                if (!mounted) {
                    viewer.destroy()
                    return
                }

                // 4) Set up error handling
                viewer.scene.renderError.addEventListener((scene, error) => {
                    console.error("❌ Cesium render error:", error)
                })

                viewerRef.current = viewer

                    // Expose viewer globally for debugging
                    ; (window as any).cesiumViewer = viewer

                // 5) Wait for first successful render
                const checkReady = () => {
                    if (!mounted || !viewerRef.current) return

                    const canvas = viewer.scene.canvas
                    if (canvas.clientWidth > 0 && canvas.clientHeight > 0) {
                        // Force a resize to ensure proper canvas dimensions
                        viewer.resize()
                        isViewerReady.current = true

                        console.log("✅ Cesium viewer is ready")

                        // Set default view to show a nice area (you can customize this)
                        viewer.camera.setView({
                            destination: Cartesian3.fromDegrees(-74.0, 40.7, 15000), // NYC area as default
                        })

                    } else {
                        // Keep checking until ready
                        setTimeout(checkReady, 50)
                    }
                }

                // Start checking for readiness
                setTimeout(checkReady, 100)

            } catch (error) {
                console.error("Failed to initialize Cesium:", error)
                isViewerReady.current = false
            }
        }

        initCesium()

        return () => {
            mounted = false
            isViewerReady.current = false
            if (viewerRef.current && !viewerRef.current.isDestroyed()) {
                try {
                    viewerRef.current.destroy()
                } catch (e) {
                    console.warn("Error destroying Cesium viewer:", e)
                }
            }
            viewerRef.current = undefined
        }
    }, [incidents, ensureContainerSize])

    useEffect(() => {
        const viewer = viewerRef.current
        if (!viewer || !isViewerReady.current) return

        // ➋ Remove any existing incident entities
        viewer.entities.removeAll()

        // ➌ Add each incident back in, colored by type
        incidents.forEach((inc) => {
            const color = colorMap[inc.type.toLowerCase()] ?? Color.GRAY
            viewer.entities.add({
                id: inc.id,
                position: Cartesian3.fromDegrees(inc.longitude, inc.latitude, 0),
                point: {
                    pixelSize: 10,
                    color,
                    outlineColor: Color.BLACK,
                    outlineWidth: 1,
                },
                // optional: attach a label if you like
                // label: { text: inc.type, font: '12px sans-serif' }
            })
        })
    }, [incidents])

    // Handle search coordinates - FIXED WITH MULTIPLE APPROACHES
    useEffect(() => {
        if (!searchCoords) return;

        let cancelled = false;

        // Try to fly every 100ms until the viewer is ready.
        const tryFly = async () => {
            if (cancelled) return;

            const viewer = viewerRef.current;
            if (isViewerReady.current && viewer && !viewer.isDestroyed()) {
                const [lon, lat] = searchCoords;
                try {
                    await viewer.camera.flyTo({
                        destination: Cartesian3.fromDegrees(lon, lat, 5000),
                        duration: 2.0,
                    });
                } catch {
                    // fallback to setView if flyTo fails
                    viewer.camera.setView({
                        destination: Cartesian3.fromDegrees(lon, lat, 5000),
                    });
                }
            } else {
                // not ready yet—try again shortly
                setTimeout(tryFly, 100);
            }
        };

        tryFly();

        return () => { cancelled = true; };
    }, [searchCoords]); // Only depend on searchCoords

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (isViewerReady.current && viewerRef.current && !viewerRef.current.isDestroyed()) {
                ensureContainerSize()
                // Wait a frame then resize
                requestAnimationFrame(() => {
                    if (viewerRef.current && !viewerRef.current.isDestroyed()) {
                        viewerRef.current.resize()
                    }
                })
            }
        }

        window.addEventListener('resize', handleResize)

        // Also handle when the sidebar toggles (which changes the map container size)
        const resizeObserver = new ResizeObserver(() => {
            handleResize()
        })

        if (container.current?.parentElement) {
            resizeObserver.observe(container.current.parentElement)
        }

        return () => {
            window.removeEventListener('resize', handleResize)
            resizeObserver.disconnect()
        }
    }, [ensureContainerSize])

    return <div ref={container} className="w-full h-full absolute inset-0" />
}