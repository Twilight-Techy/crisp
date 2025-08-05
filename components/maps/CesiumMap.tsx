"use client"

import { useRef, useEffect } from "react"
import {
    Viewer,
    Ion,
    createWorldTerrainAsync
} from "cesium"
import "cesium/Build/Cesium/Widgets/widgets.css"

type Incident = {
    id: string
    latitude: number
    longitude: number
    type: string
    status: string
}

export default function CesiumMap({ incidents }: { incidents: Incident[] }) {
    const container = useRef<HTMLDivElement>(null)
    const viewerRef = useRef<Viewer>()

    useEffect(() => {
        // Tell Cesium where to load its static assets
        // (These should be copied into your /public/cesium folder at build time)
        ; (window as any).CESIUM_BASE_URL = "/cesium/"

        async function initCesium() {
            if (!container.current || viewerRef.current) return

            // 1) Set your Ion token
            Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN!

            // 2) Wait for terrain provider to load
            const terrainProvider = await createWorldTerrainAsync()

            // 3) Instantiate the viewer
            const viewer = new Viewer(container.current, {
                terrainProvider,
                baseLayerPicker: true,
                geocoder: false,
                homeButton: false,
                sceneModePicker: false,
                timeline: false,
                animation: false,
            })

            // 4) Catch rendering errors
            viewer.scene.renderError.addEventListener((err) => {
                console.error("❌ Cesium render error:", err)
                alert("Cesium encountered a rendering error; see console for details.")
            })

            viewerRef.current = viewer

            // 5) Optionally fly home or fit to your incidents
            if (incidents.length > 0) {
                viewer.camera.flyHome(1.5)
            }
        }

        initCesium()

        return () => {
            // clean up
            viewerRef.current?.destroy()
            viewerRef.current = undefined
        }
    }, [incidents])

    return (
        <div
            ref={container}
            className="w-full h-full"
            style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
        />
    )
}
