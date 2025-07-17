"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Filter, Search, Download, Eye, EyeOff, Navigation, Clock, TrendingUp } from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function MapPage() {
  const [showFilters, setShowFilters] = useState(true)
  const [selectedIncident, setSelectedIncident] = useState<any>(null)
  const [mapView, setMapView] = useState("standard")
  const [filters, setFilters] = useState({
    crimeTypes: [] as string[],
    dateRange: "7days",
    severity: "all",
    status: "all",
  })

  const crimeTypes = [
    { id: "theft", label: "Theft/Burglary", count: 23, color: "bg-red-500" },
    { id: "vandalism", label: "Vandalism", count: 15, color: "bg-orange-500" },
    { id: "assault", label: "Assault", count: 8, color: "bg-red-600" },
    { id: "drug", label: "Drug Activity", count: 12, color: "bg-purple-500" },
    { id: "suspicious", label: "Suspicious Activity", count: 31, color: "bg-yellow-500" },
    { id: "noise", label: "Noise Complaint", count: 19, color: "bg-blue-500" },
    { id: "traffic", label: "Traffic Violation", count: 27, color: "bg-green-500" },
  ]

  const recentIncidents = [
    {
      id: 1,
      type: "Theft",
      location: "Main St & 5th Ave",
      time: "2 hours ago",
      severity: "medium",
      status: "investigating",
      description: "Bicycle theft reported outside shopping center",
    },
    {
      id: 2,
      type: "Vandalism",
      location: "Park Avenue",
      time: "4 hours ago",
      severity: "low",
      status: "verified",
      description: "Graffiti on public property",
    },
    {
      id: 3,
      type: "Suspicious Activity",
      location: "Residential District",
      time: "6 hours ago",
      severity: "medium",
      status: "under review",
      description: "Unusual activity reported by multiple residents",
    },
  ]

  const mapStats = {
    totalIncidents: 135,
    activeAlerts: 7,
    resolvedToday: 12,
    responseTime: "8 min",
  }

  const toggleCrimeType = (typeId: string) => {
    const newTypes = filters.crimeTypes.includes(typeId)
      ? filters.crimeTypes.filter((id) => id !== typeId)
      : [...filters.crimeTypes, typeId]
    setFilters({ ...filters, crimeTypes: newTypes })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30">
      <Navbar />

      <div className="flex h-[calc(100vh-80px)] pt-20">
        {" "}
        {/* Added pt-20 here */}
        {/* Sidebar */}
        <div
          className={`${showFilters ? "w-80" : "w-0"} transition-all duration-300 overflow-hidden border-r border-border/50 bg-background/50 backdrop-blur-xl`}
        >
          <div className="p-6 space-y-6 h-full overflow-y-auto">
            {/* Search */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Search & Filter</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
                  {showFilters ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search location..." className="pl-10" />
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

            {/* Crime Types Filter */}
            <div className="space-y-4">
              <h4 className="font-semibold">Crime Types</h4>
              <div className="space-y-2">
                {crimeTypes.map((type) => (
                  <div key={type.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={type.id}
                        checked={filters.crimeTypes.includes(type.id)}
                        onCheckedChange={() => toggleCrimeType(type.id)}
                      />
                      <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                      <Label htmlFor={type.id} className="text-sm">
                        {type.label}
                      </Label>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {type.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-4">
              <h4 className="font-semibold">Time Period</h4>
              <Select value={filters.dateRange} onValueChange={(value) => setFilters({ ...filters, dateRange: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24hours">Last 24 Hours</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 3 Months</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Severity Filter */}
            <div className="space-y-4">
              <h4 className="font-semibold">Severity Level</h4>
              <Select value={filters.severity} onValueChange={(value) => setFilters({ ...filters, severity: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Recent Activity */}
            <div className="space-y-4">
              <h4 className="font-semibold">Recent Activity</h4>
              <div className="space-y-3">
                {recentIncidents.map((incident) => (
                  <Card key={incident.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{incident.type}</span>
                          <Badge className={getSeverityColor(incident.severity)}>{incident.severity}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{incident.location}</span>
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{incident.time}</span>
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
        <div className="flex-1 relative">
          {/* Map Controls */}
          <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-background/80 backdrop-blur-sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
            <Select value={mapView} onValueChange={setMapView}>
              <SelectTrigger className="w-40 bg-background/80 backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard View</SelectItem>
                <SelectItem value="satellite">Satellite View</SelectItem>
                <SelectItem value="heatmap">Heat Map</SelectItem>
                <SelectItem value="clusters">Cluster View</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Map Export Controls */}
          <div className="absolute top-4 right-4 z-10 flex space-x-2">
            <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm">
              <Navigation className="w-4 h-4 mr-2" />
              My Location
            </Button>
          </div>

          {/* Map Placeholder */}
          <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/30 flex items-center justify-center">
            <Card className="max-w-md mx-4 bg-background/90 backdrop-blur-xl shadow-2xl">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Interactive Crime Map</h3>
                  <p className="text-muted-foreground">
                    This is where the interactive map will be displayed, showing crime incidents, heat zones, and
                    real-time data visualization.
                  </p>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>High Priority Incidents</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Medium Priority Incidents</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Low Priority Incidents</span>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Real-time Updates
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-10">
            <Card className="bg-background/90 backdrop-blur-sm">
              <CardContent className="p-4">
                <h4 className="font-semibold text-sm mb-3">Map Legend</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Theft/Burglary</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>Vandalism</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Suspicious Activity</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Other Incidents</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
