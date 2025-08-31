"use client"

import { useState, useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  MapPin,
  Filter,
  Search,
  Download,
  Eye,
  EyeOff,
  Navigation,
  Clock,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { formatDistanceToNow } from "date-fns"

// dynamic import so MapLibre & Cesium only load in the browser:
const MapLibreMap = dynamic(() => import("@/components/maps/MapLibreMap"), { ssr: false })
const CesiumMap = dynamic(() => import("@/components/maps/CesiumMap"), { ssr: false })

type Incident = {
  id: string
  latitude: number
  longitude: number
  type: string      // e.g. "Theft", "Vandalism", ...
  status: string    // e.g. "RECEIVED", "UNDER_INVESTIGATION", "RESOLVED"
  location: string
  reportedAt: string  // ISO timestamp
  resolvedAt?: string // ISO timestamp, optional if not resolved
}

const KNOWN_CRIME_TYPES = [
  { id: "Theft", label: "Theft/Burglary", color: "bg-red-500" },
  { id: "Vandalism", label: "Vandalism", color: "bg-orange-500" },
  { id: "Assault", label: "Assault", color: "bg-red-600" },
  { id: "Drug", label: "Drug Activity", color: "bg-purple-500" },
  { id: "Suspicious", label: "Suspicious", color: "bg-yellow-500" },
  { id: "Noise", label: "Noise Complaint", color: "bg-blue-500" },
  { id: "Traffic", label: "Traffic Violation", color: "bg-green-500" },
  { id: "Other", label: "Other", color: "bg-gray-500" },
]

export default function MapPage() {
  // UI state
  const [showFilters, setShowFilters] = useState(true)
  const [mapView, setMapView] = useState<"2d" | "3d">("2d")
  const [filters, setFilters] = useState({
    crimeTypes: [] as string[],
    dateRange: "30days",
    status: "all",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [searchCoords, setSearchCoords] = useState<[number, number] | null>(null)
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null) // [lon, lat]

  // ask for user location on mount (center maps to user by default if allowed)
  useEffect(() => {
    if (!("geolocation" in navigator)) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude
        setUserLocation([lon, lat])
      },
      (err) => {
        console.info("User denied geolocation or it failed:", err)
      },
      { timeout: 5000 }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 1️⃣ Fetch from your incidents API whenever `filters` change
  useEffect(() => {
    const qs = new URLSearchParams()
    filters.crimeTypes.forEach(t => qs.append("type", t))
    qs.set("since", filters.dateRange)

    if (filters.status && filters.status !== "all") {
      qs.set("status", filters.status)
    }

    fetch(`/api/incidents?${qs.toString()}`)
      .then(r => r.json())
      .then(({ incidents }) => {
        // normalize types (trim) and ensure coordinates are numbers
        const normalized = (incidents || []).map((i: any) => ({
          ...i,
          type: String(i.type || "Other").trim(),
          latitude: Number(i.latitude),
          longitude: Number(i.longitude),
          reportedAt: i.reportedAt,
          resolvedAt: i.resolvedAt,
        })).filter((i: any) => !Number.isNaN(i.latitude) && !Number.isNaN(i.longitude))
        setIncidents(normalized)
      })
      .catch((e) => {
        console.error("Failed to fetch incidents", e)
      })
  }, [filters])

  // 2️⃣ Derive sidebar data from `incidents`
  const crimeTypesWithCounts = useMemo(() => {
    // count per type case-insensitively
    const counts: Record<string, number> = {}
    incidents.forEach(i => {
      const key = (i.type || "Other").toString().trim()
      counts[key] = (counts[key] || 0) + 1
    })

    return KNOWN_CRIME_TYPES.map(t => ({
      id: t.id,
      label: t.label,
      color: t.color,
      count: counts[t.id] || 0,
    }))
  }, [incidents])

  const mapStats = useMemo(() => ({
    totalIncidents: incidents.length,
    activeAlerts: incidents.filter(i => i.status !== "RESOLVED").length,
    resolvedToday: incidents.filter(i => {
      if (i.status !== "RESOLVED" || !i.resolvedAt) return false
      const d = new Date(i.resolvedAt)
      const today = new Date()
      return d.toDateString() === today.toDateString()
    }).length,
    responseTime: "8 min", // placeholder; derive if you have timestamps
  }), [incidents])

  const statusLabels: Record<string, string> = {
    RECEIVED: "Received",
    UNDER_INVESTIGATION: "Under Investigation",
    RESOLVED: "Resolved",
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RECEIVED":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "UNDER_INVESTIGATION":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      case "RESOLVED":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const recentIncidents = useMemo(() => {
    return [...incidents]
      .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
      .slice(0, 3)
      .map(i => {
        const typeMapping = KNOWN_CRIME_TYPES.find(ct => ct.id.toLowerCase() === i.type.toLowerCase())
        return {
          id: i.id,
          type: typeMapping?.label ?? i.type,
          location: i.location,
          time: formatDistanceToNow(new Date(i.reportedAt), { addSuffix: true }),
          status: statusLabels[i.status] ?? i.status,
          statusColor: getStatusColor(i.status),
        }
      })
  }, [incidents])

  const toggleCrimeType = (id: string) =>
    setFilters(f => ({
      ...f,
      crimeTypes: f.crimeTypes.includes(id)
        ? f.crimeTypes.filter(t => t !== id)
        : [...f.crimeTypes, id],
    }))

  // Geocode search via MapTiler
  const handleSearch = async () => {
    if (!searchQuery) return

    try {
      const res = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(searchQuery)}.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`
      )
      const data = await res.json()
      const coords = data.features?.[0]?.center
      if (coords && coords.length >= 2) {
        const lon = Number(coords[0])
        const lat = Number(coords[1])
        if (!isNaN(lon) && !isNaN(lat)) {
          // Map components expect [lon, lat]
          setSearchCoords([lon, lat])
        } else {
          alert("Location not found.")
        }
      } else {
        alert("Location not found.")
      }
    } catch (error) {
      console.error("Geocoding error:", error)
      alert("Error searching for location.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30">
      <Navbar />

      <div className="flex h-screen pt-20 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`transition-all duration-300 border-r border-border/50 bg-background/50 backdrop-blur-xl
            ${showFilters ? "w-80 min-w-[20rem]" : "w-0 min-w-0"}
          `}
        >
          <div className="p-6 space-y-6 h-full overflow-y-auto">
            {/* Search & Filter Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Search & Filter</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters((v) => !v)}>
                  {showFilters ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch()
                    }
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-200 dark:border-emerald-800">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">{mapStats.totalIncidents}</div>
                    <div className="text-xs text-muted-foreground">Total Reports</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-600">{mapStats.activeAlerts}</div>
                    <div className="text-xs text-muted-foreground">Active Alerts</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{mapStats.resolvedToday}</div>
                    <div className="text-xs text-muted-foreground">Resolved Today</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{mapStats.responseTime}</div>
                    <div className="text-xs text-muted-foreground">Avg Response</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Crime Types */}
            <div className="space-y-4">
              <h4 className="font-semibold">Crime Types</h4>
              <div className="space-y-2">
                {crimeTypesWithCounts.map((type) => (
                  <div key={type.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={type.id}
                        checked={filters.crimeTypes.includes(type.id)}
                        onCheckedChange={() => toggleCrimeType(type.id)}
                      />
                      <div className={`w-3 h-3 rounded-full ${type.color}`} />
                      <Label htmlFor={type.id} className="text-sm">{type.label}</Label>
                    </div>
                    <Badge variant="secondary" className="text-xs">{type.count}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-4">
              <h4 className="font-semibold">Time Period</h4>
              <Select
                value={filters.dateRange}
                onValueChange={(v) => setFilters((f) => ({ ...f, dateRange: v }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="24hours">Last 24 Hours</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 3 Months</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h4 className="font-semibold">Status</h4>
              <Select
                value={filters.status}
                onValueChange={(v) => setFilters((f) => ({ ...f, status: v }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="RECEIVED">Received</SelectItem>
                  <SelectItem value="UNDER_INVESTIGATION">Under Investigation</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Recent Activity */}
            <div className="space-y-4">
              <h4 className="font-semibold">Recent Activity</h4>
              <div className="space-y-3">
                {recentIncidents.map((inc) => (
                  <Card key={inc.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{inc.type}</span>
                          <Badge variant="outline" className={inc.statusColor}>{inc.status}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" /><span>{inc.location}</span>
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <Clock className="w-3 h-3" /><span>{inc.time}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative map-container" style={{ minHeight: '400px', minWidth: '400px' }}>
          {/* Map Controls */}
          <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters((v) => !v)}
              className="bg-background/80 backdrop-blur-sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? "Hide" : "Show"} Filters
            </Button>

            <Select value={mapView} onValueChange={(v) => setMapView(v as "2d" | "3d")}>
              <SelectTrigger className="w-40 bg-background/80 backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2d">2D (MapLibre)</SelectItem>
                <SelectItem value="3d">3D (Cesium)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Export & My Location */}
          <div className="absolute top-16 right-4 z-10 flex space-x-2">
            <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm">
              <Download className="w-4 h-4 mr-2" /> Export Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-background/80 backdrop-blur-sm"
              onClick={() => {
                if (userLocation) {
                  setSearchCoords(userLocation) // center map to user location
                } else {
                  if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(
                      (pos) => setUserLocation([pos.coords.longitude, pos.coords.latitude]),
                      () => alert("Unable to determine your location.")
                    )
                  }
                }
              }}
            >
              <Navigation className="w-4 h-4 mr-2" /> My Location
            </Button>
          </div>

          {/* Map Instance - with better container */}
          <div className="absolute inset-0" style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
            {mapView === "2d" ? (
              <MapLibreMap incidents={incidents} searchCoords={searchCoords} userLocation={userLocation} />
            ) : (
                <CesiumMap incidents={incidents} searchCoords={searchCoords} userLocation={userLocation} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
