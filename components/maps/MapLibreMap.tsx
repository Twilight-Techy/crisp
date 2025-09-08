"use client"

import { useRef, useEffect, useState } from "react"
import maplibregl, { Map } from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

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
    // modal state for clicked incident
    const [selectedIncident, setSelectedIncident] = useState<(Incident & { coords?: [number, number] }) | null>(null)

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
          const matchExpr: any = ['match', ['get', 'type']]
          Object.entries(typeColorMap).forEach(([k, color]) => {
              const capitalized = k.charAt(0).toUpperCase() + k.slice(1)
              matchExpr.push(capitalized, color)
          })
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

      // click handler: open modal with incident details
      // keep a stable reference to remove it later
      const onClick = (e: any) => {
          const features = map.queryRenderedFeatures(e.point, { layers: ['incidents-circle'] })
          if (!features || features.length === 0) return
          const f = features[0]
        // properties might be a stringified JSON in some builds, so handle both
        let props: any = f.properties ?? {}
        if (typeof props === 'string') {
            try {
                props = JSON.parse(props)
            } catch {
                // ignore parse error
            }
        }
        const coords: [number, number] =
            (f.geometry && (f.geometry as any).coordinates) ?? [props.longitude ?? 0, props.latitude ?? 0]

        // construct an Incident-like object (cast types where appropriate)
        const clicked: Incident & { coords?: [number, number] } = {
            id: props.id ?? props.ID ?? props.markerId ?? String(Math.random()),
            type: props.type ?? props.Type ?? 'Unknown',
            status: props.status ?? props.Status ?? 'Unknown',
            location: props.location ?? props.LOCATION ?? '',
            reportedAt: props.reportedAt ?? props.reported_at ?? props.reportedAt ?? '',
            longitude: Number(coords[0]),
            latitude: Number(coords[1]),
            coords,
        }

        // center map a little toward the marker for better modal-context (optional)
        try {
            map.easeTo({ center: coords, offset: [0, -100] })
        } catch {
            // ignore
        }

        setSelectedIncident(clicked)
    }

      // handle pointer cursor on hover
      const onMove = (e: any) => {
          const features = map.queryRenderedFeatures(e.point, { layers: ['incidents-circle'] })
          map.getCanvas().style.cursor = features && features.length ? 'pointer' : ''
      }

      if (map && map.isStyleLoaded && map.isStyleLoaded()) {
        map.off('click', onClick) // safe: removes only if same reference is attached
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
            const coordsArr = features.map((f) => f.geometry.coordinates)
            const lons = coordsArr.map((c: any) => c[0])
            const lats = coordsArr.map((c: any) => c[1])
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

    // update user location source and center if provided
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

    // Render a small modal when an incident is selected
    // minimal, accessible, tailwind-based modal
    return (
        <>
            <div ref={mapContainer} className="w-full h-full" />

            {selectedIncident && (
                // overlay
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    onClick={() => setSelectedIncident(null)} // click outside closes
                >
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                    {/* stop propagation to prevent immediate close when modal content is clicked */}
                    <div
                        className="relative z-10 max-w-lg w-full mx-4 bg-white dark:bg-zinc-800 rounded-lg shadow-xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">{selectedIncident.type}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{selectedIncident.location}</p>
                                </div>
                                <div>
                                    <button
                                        aria-label="Close"
                                        onClick={() => setSelectedIncident(null)}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2 text-sm text-foreground">
                                <div>
                                    <strong>Status:</strong> {selectedIncident.status}
                                </div>
                                <div>
                                    <strong>Reported:</strong>{' '}
                                    {selectedIncident.reportedAt ? new Date(selectedIncident.reportedAt).toLocaleString() : '—'}
                                </div>
                                <div>
                                    <strong>Coordinates:</strong>{' '}
                                    {selectedIncident.coords ? `${selectedIncident.coords[1].toFixed(6)}, ${selectedIncident.coords[0].toFixed(6)}` : `${selectedIncident.latitude}, ${selectedIncident.longitude}`}
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-2">
                                <button
                                    onClick={() => {
                                        // center map on the selected point (if map exists)
                                        const map = mapRef.current
                                        if (map && selectedIncident.coords) {
                                            map.flyTo({ center: selectedIncident.coords, zoom: 15, essential: true })
                                        }
                                        setSelectedIncident(null)
                                    }}
                                    className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                                >
                                    Zoom to location
                                </button>
                                <button onClick={() => setSelectedIncident(null)} className="px-4 py-2 rounded-md border">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
