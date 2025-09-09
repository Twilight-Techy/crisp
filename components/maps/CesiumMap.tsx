"use client"

import { useRef, useEffect, useCallback } from "react"
import {
    Viewer,
    Ion,
    createWorldTerrainAsync,
    Cartesian3,
    Color,
    HeightReference,
    NearFarScalar,
    DistanceDisplayCondition,
    LabelStyle,
    Cartesian2,
    VerticalOrigin,
} from "cesium"
import "cesium/Build/Cesium/Widgets/widgets.css"

type Incident = {
    id: string
    latitude: number
    longitude: number
    type: string
    status: string
    location?: string
    reportedAt?: string
}

export default function CesiumMap({
    incidents,
    searchCoords,
    userLocation,
}: {
        incidents: Incident[]
        searchCoords?: [number, number] | null
        userLocation?: [number, number] | null
}) {
    const container = useRef<HTMLDivElement>(null)
    const viewerRef = useRef<Viewer>()
    const isViewerReady = useRef(false)

    const rawColorMap: Record<string, Color> = {
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

    // helper: generate a small circular PNG data url to use as billboard image
    const createCircleDataUrl = (cesiumColor: Color, diameter = 48) => {
        try {
            const canvas = document.createElement("canvas")
            canvas.width = diameter
            canvas.height = diameter
            const ctx = canvas.getContext("2d")
            if (!ctx) return undefined
            const css = cesiumColor.toCssColorString()
            const r = diameter / 2
            // outer circle (outline)
            ctx.beginPath()
            ctx.arc(r, r, r - 1, 0, Math.PI * 2)
            ctx.fillStyle = "black"
            ctx.fill()
            // inner circle
            ctx.beginPath()
            ctx.arc(r, r, r - 3, 0, Math.PI * 2)
            ctx.fillStyle = css
            ctx.fill()
            return canvas.toDataURL("image/png")
        } catch {
            return undefined
        }
    }

    useEffect(() => {
        ; (window as any).CESIUM_BASE_URL = "/cesium/"

        let mounted = true

        async function initCesium() {
            if (!container.current || viewerRef.current || !mounted) return

            try {
                ensureContainerSize()
                await new Promise((resolve) => requestAnimationFrame(resolve))
                if (!mounted) return

                Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN!

                const terrainProvider = await createWorldTerrainAsync()
                if (!mounted) return

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

                viewerRef.current = viewer
                    ; (window as any).cesiumViewer = viewer

                // Some devices / builds may benefit from depth test against terrain; keep on by default.
                // We still place markers RELATIVE_TO_GROUND with a slight altitude offset so they are visible.
                try {
                    viewer.scene.globe.depthTestAgainstTerrain = true
                } catch (e) {
                  // ignore if not supported
              }

                // wait until canvas has size
                const checkReady = () => {
                    if (!mounted || !viewerRef.current) return
                    const canvas = viewer.scene.canvas
                    if (canvas.clientWidth > 0 && canvas.clientHeight > 0) {
                        viewer.resize()
                        isViewerReady.current = true
                        // center either at user location or a default
                        if (userLocation) {
                            const [lon, lat] = userLocation
                            viewer.camera.setView({
                                destination: Cartesian3.fromDegrees(lon, lat, 15000),
                            })
                        } else {
                            viewer.camera.setView({
                                destination: Cartesian3.fromDegrees(-74.0, 40.7, 15000), // default area
                            })
                        }
                    } else {
                        setTimeout(checkReady, 50)
                    }
                }
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
    }, [ensureContainerSize, userLocation])

    // Add/refresh incident entities whenever incidents change
    useEffect(() => {
        const viewer = viewerRef.current
        if (!viewer || !isViewerReady.current) return

        // Defensive: ignore empty coords or invalid numbers
        const validIncidents = incidents.filter(
            (i) =>
                typeof i.latitude === "number" &&
                typeof i.longitude === "number" &&
                isFinite(i.latitude) &&
                isFinite(i.longitude)
        )

        // Remove any existing entities with same ids (safe id reuse)
        validIncidents.forEach((inc) => {
            try {
                viewer.entities.removeById(inc.id)
            } catch {
                /* ignore */
            }
        })

        // Pre-generate images for each type to avoid creating canvas inside the loop repeatedly
        const imageCache: Record<string, string | undefined> = {}
        for (const [k, col] of Object.entries(rawColorMap)) {
            imageCache[k] = createCircleDataUrl(col, 48)
        }
        // also fallback image for 'other' if needed
        imageCache["other"] = imageCache["other"] ?? createCircleDataUrl(Color.GRAY, 48)

        // Choose scaling rules so points remain visible from far away.
        // scaleByDistance: (nearDist, nearScale, farDist, farScale)
        // We pick nearDist ~ 200 (close) and farDist very large so the marker is still noticeable when zoomed out.
        const scaleScalar = new NearFarScalar(200.0, 1.0, 15_000_000.0, 1.35)
        const distanceDisplay = new DistanceDisplayCondition(0.0, 20_000_000.0)

        validIncidents.forEach((inc) => {
            const col = rawColorMap[inc.type.toLowerCase()] ?? Color.GRAY
            const image = imageCache[inc.type.toLowerCase()] ?? createCircleDataUrl(col, 48)
            const altitudeMeters = 6 // small offset so points sit slightly above terrain

            // Add both a Point (pixel-based) and a Billboard (image-based) for best visibility
            viewer.entities.add({
                id: inc.id,
                position: Cartesian3.fromDegrees(inc.longitude, inc.latitude, altitudeMeters),
                // pixel-based point (fast & crisp)
                point: {
                  pixelSize: 18,
                  color: col,
                  outlineColor: Color.BLACK,
                  outlineWidth: 1,
                  heightReference: HeightReference.RELATIVE_TO_GROUND,
                    // keep or slightly enlarge markers at extreme camera distances
                    scaleByDistance: scaleScalar,
                    // ensure the point is drawable at large distances
                    distanceDisplayCondition: distanceDisplay,
                },
                // billboard stays crisp (uses generated PNG circle). vertical origin anchored at bottom so it sits slightly above ground.
                billboard: image
                    ? {
                        image,
                        verticalOrigin: VerticalOrigin.BOTTOM,
                        heightReference: HeightReference.RELATIVE_TO_GROUND,
                        scaleByDistance: scaleScalar,
                        distanceDisplayCondition: distanceDisplay,
                    }
                    : undefined,
                // small label to show type (optional, can be removed if cluttered)
                label: {
                    text: inc.type,
                    font: "12px sans-serif",
                    style: LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth: 2,
                    eyeOffset: new Cartesian3(0, -20, 0),
                    pixelOffset: new Cartesian2(0, -24),
                    showBackground: true,
                    backgroundColor: Color.WHITE.withAlpha(0.85),
                    fillColor: Color.BLACK,
                    heightReference: HeightReference.RELATIVE_TO_GROUND,
                    distanceDisplayCondition: new DistanceDisplayCondition(0.0, 2000000.0), // hide labels when extremely far
                },
                description: `<div><strong>${inc.type}</strong><div>${inc.location ?? ""}</div><div style="font-size:12px">${inc.reportedAt ? new Date(inc.reportedAt).toLocaleString() : ""}</div></div>`,
            })
        })

        // Force a render to ensure entities appear immediately
        try {
            viewer.scene.requestRender()
        } catch {
            // ignore
        }

        // Optionally zoom to fit incidents if user hasn't chosen a location
        if (!userLocation && validIncidents.length > 0) {
            const lons = validIncidents.map((i) => i.longitude)
            const lats = validIncidents.map((i) => i.latitude)
            const minLon = Math.min(...lons),
                maxLon = Math.max(...lons)
            const minLat = Math.min(...lats),
                maxLat = Math.max(...lats)
            const centerLon = (minLon + maxLon) / 2
            const centerLat = (minLat + maxLat) / 2
            viewer.camera.setView({ destination: Cartesian3.fromDegrees(centerLon, centerLat, 15000) })
        }
    }, [incidents, userLocation])

    // add or update user location entity
    useEffect(() => {
        const viewer = viewerRef.current
        if (!viewer || !isViewerReady.current) return

        try {
            viewer.entities.removeById("__user_location")
        } catch {
            /* ignore */
        }

        if (userLocation) {
            const [lon, lat] = userLocation
            viewer.entities.add({
                id: "__user_location",
                position: Cartesian3.fromDegrees(lon, lat, 10),
                point: {
                    pixelSize: 20,
                    color: Color.fromCssColorString("#2b9af3"),
                    outlineColor: Color.WHITE,
                    outlineWidth: 2,
                    heightReference: HeightReference.RELATIVE_TO_GROUND,
                    scaleByDistance: new NearFarScalar(200.0, 1.0, 15_000_000.0, 1.2),
                },
                description: "<div><strong>Your Location</strong></div>",
            })

            // fly to user location
            viewer.camera.flyTo({ destination: Cartesian3.fromDegrees(lon, lat, 8000), duration: 1.3 })
        } else {
            // nothing to add
        }

        // ensure render
        try {
            viewer.scene.requestRender()
        } catch {
            /* ignore */
        }
    }, [userLocation])

    // fly to search coords when provided
    useEffect(() => {
        if (!searchCoords) return
        let cancelled = false

        const tryFly = async () => {
            if (cancelled) return
            const viewer = viewerRef.current
            if (isViewerReady.current && viewer && !viewer.isDestroyed()) {
                const [lon, lat] = searchCoords
                try {
                    await viewer.camera.flyTo({
                        destination: Cartesian3.fromDegrees(lon, lat, 5000),
                        duration: 1.5,
                    })
                } catch {
                    viewer.camera.setView({ destination: Cartesian3.fromDegrees(lon, lat, 5000) })
                }
            } else {
                setTimeout(tryFly, 100)
            }
        }
        tryFly()
        return () => {
            cancelled = true
        }
    }, [searchCoords])

    // handle resize
    useEffect(() => {
        const handleResize = () => {
            if (isViewerReady.current && viewerRef.current && !viewerRef.current.isDestroyed()) {
                ensureContainerSize()
                requestAnimationFrame(() => {
                    if (viewerRef.current && !viewerRef.current.isDestroyed()) {
                        viewerRef.current.resize()
                    }
                })
            }
        }
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [ensureContainerSize])

    return <div ref={container} className="w-full h-full absolute inset-0" />
}
