"use client"

import { useRef, useEffect } from "react"
import maplibregl, { Map, Popup } from "maplibre-gl"

type Incident = {
    id: string
    latitude: number
    longitude: number
    type: string
    status: string
    location?: string
    reportedAt?: string
}

export default function MapLibreMap({
    incidents,
    searchCoords,
    userLocation,
}: {
        incidents: Incident[]
        searchCoords?: [number, number] | null
        userLocation?: [number, number] | null
}) {
    const typeColorMap: Record<string, string> = {
        theft: '#e74c3c',
        vandalism: '#e67e22',
        assault: '#c0392b',
        drug: '#8e44ad',
        suspicious: '#f1c40f',
        noise: '#3498db',
        traffic: '#2ecc71',
        other: '#95a5a6',
    }

    const mapContainer = useRef<HTMLDivElement>(null)
    const mapRef = useRef<Map | null>(null)
    const popupRef = useRef<Popup | null>(null)

    // Initialize map once
    useEffect(() => {
        if (!mapRef.current && mapContainer.current) {
            mapRef.current = new maplibregl.Map({
                container: mapContainer.current,
                style: `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
                center: userLocation ?? [-74.0, 40.7],
                zoom: 12,
            })

            // add navigation control
            mapRef.current.addControl(new maplibregl.NavigationControl())

            // create empty incidents source and layer on load
            mapRef.current.on('load', () => {
                const map = mapRef.current!
                if (!map.getSource('incidents')) {
                    map.addSource('incidents', {
                        type: 'geojson',
                        data: { type: 'FeatureCollection', features: [] },
                    })
        }

                // build match expression for colors
                // minimal change: type the expression as `any` so TS accepts it for the paint property
                const matchExpr: any = ['match', ['get', 'type']]
                // push each known type/value and color
                Object.entries(typeColorMap).forEach(([k, color]) => {
                    const capitalized = k.charAt(0).toUpperCase() + k.slice(1)
                    matchExpr.push(capitalized, color)
                })
                // default color
                matchExpr.push('#95a5a6')

                // add circle layer for incidents
                if (!map.getLayer('incidents-circle')) {
                    map.addLayer({
                        id: 'incidents-circle',
                        type: 'circle',
                        source: 'incidents',
                        paint: {
                            'circle-radius': 6,
                            'circle-stroke-width': 1,
                            'circle-stroke-color': '#000',
                            // `matchExpr` is typed `any` above -> satisfies TS for paint value
                            'circle-color': matchExpr,
                        },
                    })
                }

                // user location source/layer
                if (!map.getSource('user-location')) {
                    map.addSource('user-location', {
                        type: 'geojson',
                        data: { type: 'FeatureCollection', features: [] },
                    })
                }
                if (!map.getLayer('user-location-layer')) {
                    map.addLayer({
                        id: 'user-location-layer',
                        type: 'circle',
                        source: 'user-location',
                        paint: {
                            'circle-radius': 8,
                            'circle-color': '#2b9af3',
                            'circle-stroke-color': '#fff',
                            'circle-stroke-width': 2,
                        },
                    })
                }

                // popup ref
                popupRef.current = new maplibregl.Popup({ offset: 10 })
            })
        }
        // cleanup on unmount
        return () => {
            if (mapRef.current) {
                try {
                    mapRef.current.remove()
                } catch (e) {
                    // ignore
                }
                mapRef.current = null
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Fly to search coords
    useEffect(() => {
        if (searchCoords && mapRef.current) {
            mapRef.current.flyTo({
                center: searchCoords,
                zoom: 13,
                essential: true,
            })
        }
    }, [searchCoords])

    // update incidents source whenever incidents change
    useEffect(() => {
        const map = mapRef.current
        if (!map) return

        const features = (incidents || []).map((inc) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [inc.longitude, inc.latitude] },
            properties: {
                id: inc.id,
                type: inc.type,
                status: inc.status,
                location: inc.location,
                reportedAt: inc.reportedAt,
            },
        }))

        const setIncidentsOnSource = () => {
            const src = map.getSource('incidents') as any
            if (src) {
                src.setData({
                    type: 'FeatureCollection',
                    features,
                })
            }
        }

        // If the source exists now, set it. Otherwise wait for the map to load and then set it.
        if (map.getSource && map.getSource('incidents')) {
            setIncidentsOnSource()
        } else {
            // ensure we apply the data once style finishes loading/creates sources
            map.once('load', () => {
                setIncidentsOnSource()
            })
        }

        // set popup click handler
        const onClick = (e: any) => {
            const features = map.queryRenderedFeatures(e.point, { layers: ['incidents-circle'] })
            if (!features || features.length === 0) return
            const f = features[0]
            const props = f.properties || {}
            const html = `<div style="min-width:160px">
        <strong>${props.type}</strong><div style="font-size:12px">${props.location ?? ''}</div>
        <div style="font-size:11px;color:#666">${props.reportedAt ? new Date(props.reportedAt).toLocaleString() : ''}</div>
      </div>`
            if (popupRef.current) popupRef.current.setLngLat((f.geometry as any).coordinates).setHTML(html).addTo(map)
        }

        // handle pointer cursor on hover
        const onMove = (e: any) => {
            const features = map.queryRenderedFeatures(e.point, { layers: ['incidents-circle'] })
            map.getCanvas().style.cursor = features && features.length ? 'pointer' : ''
        }

        if (map && map.isStyleLoaded && map.isStyleLoaded()) {
            // unregister the exact listener (safe) before re-registering
            map.off('click', onClick)
            map.on('click', onClick)
            map.off('mousemove', onMove)
            map.on('mousemove', onMove)
        } else {
            map.once('load', () => {
                map.on('click', onClick)
                map.on('mousemove', onMove)
            })
        }

        // center map to bounds if there are incidents and user not found
        if (features.length > 0 && map) {
            if (!userLocation) {
                const coords = features.map((f) => f.geometry.coordinates)
                const lons = coords.map((c: any) => c[0])
                const lats = coords.map((c: any) => c[1])
                const minLon = Math.min(...lons)
                const maxLon = Math.max(...lons)
                const minLat = Math.min(...lats)
                const maxLat = Math.max(...lats)
                if (isFinite(minLon) && isFinite(minLat) && isFinite(maxLon) && isFinite(maxLat)) {
                    map.fitBounds([[minLon, minLat], [maxLon, maxLat]], { padding: 60, maxZoom: 14 })
                }
            }
        }

        return () => {
            if (map) {
                // remove the specific listeners we added above
                map.off('click', onClick)
                map.off('mousemove', onMove)
            }
        }
    }, [incidents, userLocation])

    // update user location marker and center if provided
    useEffect(() => {
        const map = mapRef.current
        if (!map) return

        const applyUserLocationToSource = () => {
            const src = map.getSource('user-location') as any
            if (!src) return
            if (userLocation) {
                const [lon, lat] = userLocation
                src.setData({
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            geometry: { type: 'Point', coordinates: [lon, lat] },
                            properties: {},
                        },
                    ],
                })
                // center on user
                map.flyTo({ center: userLocation, zoom: 13 })
            } else {
                src.setData({
                    type: 'FeatureCollection',
                    features: [],
                })
            }
        }

        if (map.getSource && map.getSource('user-location')) {
            applyUserLocationToSource()
        } else {
            map.once('load', () => {
                applyUserLocationToSource()
            })
        }
    }, [userLocation])

    return <div ref={mapContainer} className="w-full h-full" />
}
