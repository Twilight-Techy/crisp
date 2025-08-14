"use client"

import { useRef, useEffect } from "react"
import maplibregl, { Map } from "maplibre-gl"

type Incident = {
    id: string
    latitude: number
    longitude: number
    type: string
    status: string
}

export default function MapLibreMap({
    incidents,
    searchCoords,
}: {
    incidents: Incident[]
    searchCoords?: [number, number] | null
}) {
    const typeColorMap: Record<string, string> = {
        Theft: '#e74c3c',
        Vandalism: '#e67e22',
        Assault: '#c0392b',
        Drug: '#8e44ad',
        Suspicious: '#f1c40f',
        Noise: '#3498db',
        Traffic: '#2ecc71',
        Other: '#95a5a6',
    }

    const mapContainer = useRef<HTMLDivElement>(null)
    const mapRef = useRef<Map>()

    // Initialize map once
    useEffect(() => {
        if (!mapRef.current && mapContainer.current) {
            mapRef.current = new maplibregl.Map({
                container: mapContainer.current,
                style: `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
                center: [-74.0, 40.7],
                zoom: 10,
            })
        }
    }, [])

    // 🔍 Fly to searched location
    useEffect(() => {
        if (searchCoords && mapRef.current) {
            mapRef.current.flyTo({
                center: searchCoords,
                zoom: 13,
                essential: true,
            })
        }
    }, [searchCoords])

    // Whenever incidents change, update markers—but only once the style is ready
    useEffect(() => {
        const map = mapRef.current
        if (!map) return

        const updateLayers = () => {
            const style = map.getStyle()
            // guard: sometimes getStyle() returns {} before load
            if (!style.layers) return

            // remove old incident layers/sources
            style.layers
                .filter((l) => l.id.startsWith("incident-"))
                .forEach((l) => {
                    if (map.getLayer(l.id)) map.removeLayer(l.id)
                    if (map.getSource(l.id)) map.removeSource(l.id)
                })

            // add new ones
            incidents.forEach((inc) => {
                const id = `incident-${inc.id}`
                map.addSource(id, {
                    type: "geojson",
                    data: {
                        type: "Feature",
                        geometry: { type: "Point", coordinates: [inc.longitude, inc.latitude] },
                        properties: { type: inc.type, status: inc.status },
                    },
                })
                map.addLayer({
                    id,
                    type: "circle",
                    source: id,
                    paint: {
                        "circle-radius": 6,
                        "circle-color": typeColorMap[inc.type.toLowerCase()] ?? '#95a5a6',
                    },
                })
            })
        }

        // If style is already loaded, run immediately
        if (map.isStyleLoaded && map.isStyleLoaded()) {
            updateLayers()
        } else {
            // Otherwise wait for the first load event
            map.once("load", updateLayers)
        }
    }, [incidents])

    return <div ref={mapContainer} className="w-full h-full" />
}
