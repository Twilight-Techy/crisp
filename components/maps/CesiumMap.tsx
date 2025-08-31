"use client"

import { useRef, useEffect, useCallback } from "react"
import {
    Viewer,
    Ion,
    createWorldTerrainAsync,
    Cartesian3,
    Color
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

    useEffect(() => {
      (window as any).CESIUM_BASE_URL = "/cesium/"

      let mounted = true

      async function initCesium() {
          if (!container.current || viewerRef.current || !mounted) return

        try {
          ensureContainerSize()
          await new Promise(resolve => requestAnimationFrame(resolve))
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

    // Add incident entities whenever incidents change
    useEffect(() => {
        const viewer = viewerRef.current
        if (!viewer || !isViewerReady.current) return

      // remove old incident entities (but keep other entities if required)
      // here we will remove entities we created by id (we use inc.id as entity id)
      incidents.forEach((inc) => {
          // remove existing same id if any
          try { viewer.entities.removeById(inc.id) } catch { /* ignore */ }
      })

      incidents.forEach((inc) => {
        const col = rawColorMap[inc.type.toLowerCase()] ?? Color.GRAY
        viewer.entities.add({
            id: inc.id,
            position: Cartesian3.fromDegrees(inc.longitude, inc.latitude, 0),
            point: {
              pixelSize: 12,
              color: col,
              outlineColor: Color.BLACK,
              outlineWidth: 1,
          },
          description: `<div><strong>${inc.type}</strong><div>${inc.location ?? ''}</div><div style="font-size:12px">${inc.reportedAt ? new Date(inc.reportedAt).toLocaleString() : ''}</div></div>`,
      })
    })

      // Optionally zoom to fit incidents if user hasn't chosen a location
      if (!userLocation && incidents.length > 0) {
          const lons = incidents.map(i => i.longitude)
          const lats = incidents.map(i => i.latitude)
          const minLon = Math.min(...lons), maxLon = Math.max(...lons)
          const minLat = Math.min(...lats), maxLat = Math.max(...lats)
          const west = Cartesian3.fromDegrees(minLon, minLat)
          const east = Cartesian3.fromDegrees(maxLon, maxLat)
          // try to set camera to center of bounding box with some offset
          const centerLon = (minLon + maxLon) / 2
          const centerLat = (minLat + maxLat) / 2
          viewer.camera.setView({ destination: Cartesian3.fromDegrees(centerLon, centerLat, 15000) })
      }
  }, [incidents, userLocation])

    // add or update user location entity
    useEffect(() => {
      const viewer = viewerRef.current
      if (!viewer || !isViewerReady.current) return

      // remove old user marker if exists
      try { viewer.entities.removeById('__user_location') } catch { /* ignore */ }

      if (userLocation) {
          const [lon, lat] = userLocation
          viewer.entities.add({
              id: '__user_location',
              position: Cartesian3.fromDegrees(lon, lat, 0),
              point: {
                  pixelSize: 14,
                  color: Color.fromCssColorString('#2b9af3'),
                  outlineColor: Color.WHITE,
                  outlineWidth: 2,
              },
              description: '<div><strong>Your Location</strong></div>',
          })

          // fly to user location
          viewer.camera.flyTo({ destination: Cartesian3.fromDegrees(lon, lat, 8000), duration: 1.3 })
      } else {
          // no user location: nothing to add
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
      return () => { cancelled = true }
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
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
  }, [ensureContainerSize])

    return <div ref={container} className="w-full h-full absolute inset-0" />
}
