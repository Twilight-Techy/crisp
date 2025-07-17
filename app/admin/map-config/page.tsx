"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, MapPin, Layers, Palette, CheckCircle, AlertTriangle, Globe, Settings } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function MapConfigurationPage() {
  const [defaultCenterLat, setDefaultCenterLat] = useState("34.0522")
  const [defaultCenterLng, setDefaultCenterLng] = useState("-118.2437")
  const [defaultZoom, setDefaultZoom] = useState("12")
  const [enableHeatmap, setEnableHeatmap] = useState(true)
  const [incidentDisplayLimit, setIncidentDisplayLimit] = useState("500")
  const [mapStyle, setMapStyle] = useState("roadmap")
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSaveMapConfig = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccessMessage("")
    setErrorMessage("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real app, send data to backend
    console.log({
      defaultCenterLat,
      defaultCenterLng,
      defaultZoom,
      enableHeatmap,
      incidentDisplayLimit,
      mapStyle,
    })

    if (Math.random() > 0.1) {
      // Simulate 90% success rate
      setSuccessMessage("Map configuration updated successfully! (Demo)")
    } else {
      setErrorMessage("Failed to update map configuration. Please try again. (Demo Error)")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30 pt-16">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Button variant="outline" asChild className="mb-4 bg-transparent">
                <Link href="/admin">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-3xl font-bold">Map Configuration</h1>
              <p className="text-lg text-muted-foreground">Adjust settings for the interactive crime map.</p>
            </div>
          </div>

          {/* Map Settings Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>Map Display Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveMapConfig} className="space-y-6">
                {successMessage && (
                  <div className="bg-green-100 text-green-700 p-3 rounded-md flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>{successMessage}</span>
                  </div>
                )}
                {errorMessage && (
                  <div className="bg-red-100 text-red-700 p-3 rounded-md flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultCenterLat">Default Center Latitude</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="defaultCenterLat"
                        type="number"
                        step="0.0001"
                        placeholder="e.g., 34.0522"
                        value={defaultCenterLat}
                        onChange={(e) => setDefaultCenterLat(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultCenterLng">Default Center Longitude</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="defaultCenterLng"
                        type="number"
                        step="0.0001"
                        placeholder="e.g., -118.2437"
                        value={defaultCenterLng}
                        onChange={(e) => setDefaultCenterLng(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultZoom">Default Zoom Level</Label>
                  <Select value={defaultZoom} onValueChange={setDefaultZoom} required>
                    <SelectTrigger className="w-full">
                      <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Select zoom level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8">Region (8)</SelectItem>
                      <SelectItem value="10">City (10)</SelectItem>
                      <SelectItem value="12">Neighborhood (12)</SelectItem>
                      <SelectItem value="14">Street (14)</SelectItem>
                      <SelectItem value="16">Building (16)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Initial zoom level when the map loads.</p>
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="enableHeatmap">Enable Heatmap Layer</Label>
                  <Switch id="enableHeatmap" checked={enableHeatmap} onCheckedChange={setEnableHeatmap} />
                  <span className="text-sm text-muted-foreground">{enableHeatmap ? "Enabled" : "Disabled"}</span>
                </div>
                <p className="text-sm text-muted-foreground -mt-2">
                  Visualize incident density with a heatmap overlay.
                </p>

                <div className="space-y-2">
                  <Label htmlFor="incidentDisplayLimit">Incident Display Limit</Label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="incidentDisplayLimit"
                      type="number"
                      placeholder="500"
                      value={incidentDisplayLimit}
                      onChange={(e) => setIncidentDisplayLimit(e.target.value)}
                      className="pl-10"
                      min="10"
                      required
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Maximum number of incidents to display on the map at once.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mapStyle">Map Style</Label>
                  <Select value={mapStyle} onValueChange={setMapStyle} required>
                    <SelectTrigger className="w-full">
                      <Palette className="w-4 h-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Select map style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="roadmap">Roadmap</SelectItem>
                      <SelectItem value="satellite">Satellite</SelectItem>
                      <SelectItem value="terrain">Terrain</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Choose the visual style of the map.</p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving Configuration..." : "Save Configuration"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Other Map Related Settings (Placeholders) */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  <span>Incident Icon Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Customize icons for different incident types.</p>
                <Button asChild variant="outline" className="mt-4 w-full bg-transparent">
                  <Link href="/admin/map-config/icons">Manage Icons</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-purple-600" />
                  <span>Custom Map Layers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Add or manage custom data layers on the map.</p>
                <Button asChild variant="outline" className="mt-4 w-full bg-transparent">
                  <Link href="/admin/map-config/layers">Manage Layers</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
