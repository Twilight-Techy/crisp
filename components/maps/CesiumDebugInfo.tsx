// Add this component to your map area to see live coordinate debugging
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Viewer } from "cesium"

interface DebugInfoProps {
    searchCoords: [number, number] | null
    mapView: "2d" | "3d"
}

export function CesiumDebugInfo({ searchCoords, mapView }: DebugInfoProps) {
    const [cesiumPosition, setCesiumPosition] = useState<{ lon: number, lat: number, height: number } | null>(null)

    useEffect(() => {
        if (mapView !== "3d") return;

        const interval = setInterval(() => {
            // Try to access the global Cesium viewer
            const cesiumViewer = (window as any).cesiumViewer as Viewer | undefined;

            // <— GUARD: if it’s not there (or not fully initialized), skip this tick
            if (
                !cesiumViewer ||
                !cesiumViewer.camera ||
                !cesiumViewer.scene ||
                !cesiumViewer.camera.positionCartographic
            ) {
                return;
            }

            const pos = cesiumViewer.camera.positionCartographic;
            setCesiumPosition({
                lon: pos.longitude * (180 / Math.PI),
                lat: pos.latitude * (180 / Math.PI),
                height: pos.height,
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [mapView]);

    if (mapView !== "3d") return null

    return (
        <Card className="absolute top-20 right-4 z-50 bg-black/80 text-white text-xs">
            <CardContent className="p-2 space-y-1">
                <div className="font-bold">🐛 Debug Info</div>
                <div>
                    <strong>Search Coords:</strong> {searchCoords ? `${searchCoords[0].toFixed(4)}, ${searchCoords[1].toFixed(4)}` : "None"}
                </div>
                <div>
                    <strong>Camera Position:</strong> {cesiumPosition ? `${cesiumPosition.lon.toFixed(4)}, ${cesiumPosition.lat.toFixed(4)}` : "Loading..."}
                </div>
                <div>
                    <strong>Camera Height:</strong> {cesiumPosition ? `${Math.round(cesiumPosition.height)}m` : "Loading..."}
                </div>
                <div>
                    <strong>Map View:</strong> {mapView}
                </div>
            </CardContent>
        </Card>
    )
}