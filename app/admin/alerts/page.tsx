"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Bell,
  PlusCircle,
  Edit,
  Trash2,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function AdminAlertsPage() {
  const [newAlertTitle, setNewAlertTitle] = useState("")
  const [newAlertDescription, setNewAlertDescription] = useState("")
  const [newAlertLocation, setNewAlertLocation] = useState("")
  const [newAlertSeverity, setNewAlertSeverity] = useState("medium")
  const [newAlertCategory, setNewAlertCategory] = useState("community-update")
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [editingAlertId, setEditingAlertId] = useState<number | null>(null)

  // Mock data for alerts
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: "Increased Police Presence - Downtown District",
      description:
        "Additional police patrols have been deployed in the downtown area following recent incidents. Residents are advised to remain vigilant.",
      location: "Downtown District",
      severity: "high",
      category: "police-activity",
      status: "active",
      timestamp: "2024-07-15T14:30:00Z",
    },
    {
      id: 2,
      title: "Suspicious Activity Reported - Park Avenue",
      description:
        "Multiple residents have reported suspicious individuals in the area. Police are investigating. Avoid the area if possible.",
      location: "Park Avenue & 5th Street",
      severity: "medium",
      category: "suspicious-activity",
      status: "investigating",
      timestamp: "2024-07-15T10:00:00Z",
    },
    {
      id: 3,
      title: "Well-Lit Areas Recommended After Dark",
      description:
        "Following recent incidents, residents are advised to use well-lit paths and travel in groups when possible after dark.",
      location: "Residential North",
      severity: "low",
      category: "safety-advisory",
      status: "ongoing",
      timestamp: "2024-07-14T18:00:00Z",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
      case "investigating":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      case "ongoing":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "resolved":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      case "scheduled":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const handleAddOrUpdateAlert = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccessMessage("")
    setErrorMessage("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (editingAlertId) {
      // Update existing alert
      setAlerts(
        alerts.map((alert) =>
          alert.id === editingAlertId
            ? {
                ...alert,
                title: newAlertTitle,
                description: newAlertDescription,
                location: newAlertLocation,
                severity: newAlertSeverity,
                category: newAlertCategory,
                timestamp: new Date().toISOString(),
              }
            : alert,
        ),
      )
      setSuccessMessage("Alert updated successfully! (Demo)")
      setEditingAlertId(null)
    } else {
      // Add new alert
      const newId = alerts.length > 0 ? Math.max(...alerts.map((a) => a.id)) + 1 : 1
      const newAlert = {
        id: newId,
        title: newAlertTitle,
        description: newAlertDescription,
        location: newAlertLocation,
        severity: newAlertSeverity,
        category: newAlertCategory,
        status: "active", // New alerts are active by default
        timestamp: new Date().toISOString(),
      }
      setAlerts([...alerts, newAlert])
      setSuccessMessage("Alert added successfully! (Demo)")
    }

    setNewAlertTitle("")
    setNewAlertDescription("")
    setNewAlertLocation("")
    setNewAlertSeverity("medium")
    setNewAlertCategory("community-update")
    setIsLoading(false)
  }

  const handleEditClick = (alert: (typeof alerts)[0]) => {
    setEditingAlertId(alert.id)
    setNewAlertTitle(alert.title)
    setNewAlertDescription(alert.description)
    setNewAlertLocation(alert.location)
    setNewAlertSeverity(alert.severity)
    setNewAlertCategory(alert.category)
  }

  const handleDeleteAlert = (id: number) => {
    if (window.confirm("Are you sure you want to delete this alert?")) {
      setAlerts(alerts.filter((alert) => alert.id !== id))
      alert("Alert deleted successfully! (Demo)")
    }
  }

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      searchQuery === "" ||
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || alert.category === filterCategory
    const matchesStatus = filterStatus === "all" || alert.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30 pt-16">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Button variant="outline" asChild className="mb-4 bg-transparent">
                <Link href="/admin">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-3xl font-bold">Alert Management</h1>
              <p className="text-lg text-muted-foreground">Create, edit, and manage public safety alerts.</p>
            </div>
          </div>

          {/* Add/Edit Alert Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                <span>{editingAlertId ? "Edit Alert" : "Create New Alert"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddOrUpdateAlert} className="space-y-6">
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

                <div className="space-y-2">
                  <Label htmlFor="alertTitle">Alert Title</Label>
                  <Input
                    id="alertTitle"
                    placeholder="e.g., Road Closure on Main Street"
                    value={newAlertTitle}
                    onChange={(e) => setNewAlertTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alertDescription">Description</Label>
                  <Textarea
                    id="alertDescription"
                    placeholder="Provide details about the alert..."
                    value={newAlertDescription}
                    onChange={(e) => setNewAlertDescription(e.target.value)}
                    className="min-h-[100px]"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="alertLocation">Location</Label>
                    <Input
                      id="alertLocation"
                      placeholder="e.g., Main Street & Oak Avenue"
                      value={newAlertLocation}
                      onChange={(e) => setNewAlertLocation(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alertSeverity">Severity</Label>
                    <Select value={newAlertSeverity} onValueChange={setNewAlertSeverity} required>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alertCategory">Category</Label>
                  <Select value={newAlertCategory} onValueChange={setNewAlertCategory} required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="police-activity">Police Activity</SelectItem>
                      <SelectItem value="suspicious-activity">Suspicious Activity</SelectItem>
                      <SelectItem value="safety-advisory">Safety Advisory</SelectItem>
                      <SelectItem value="theft">Theft/Crime</SelectItem>
                      <SelectItem value="community-update">Community Update</SelectItem>
                      <SelectItem value="road-closure">Road Closure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-3">
                  {editingAlertId && (
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        setEditingAlertId(null)
                        setNewAlertTitle("")
                        setNewAlertDescription("")
                        setNewAlertLocation("")
                        setNewAlertSeverity("medium")
                        setNewAlertCategory("community-update")
                        setErrorMessage("")
                        setSuccessMessage("")
                      }}
                      className="bg-transparent"
                    >
                      Cancel Edit
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? editingAlertId
                        ? "Updating Alert..."
                        : "Creating Alert..."
                      : editingAlertId
                        ? "Update Alert"
                        : "Create Alert"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Alerts List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <Bell className="w-6 h-6 text-emerald-600" />
              <span>Existing Alerts</span>
            </h2>

            {/* Filters and Search */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search alerts..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="police-activity">Police Activity</SelectItem>
                      <SelectItem value="suspicious-activity">Suspicious Activity</SelectItem>
                      <SelectItem value="safety-advisory">Safety Advisory</SelectItem>
                      <SelectItem value="theft">Theft/Crime</SelectItem>
                      <SelectItem value="community-update">Community Update</SelectItem>
                      <SelectItem value="road-closure">Road Closure</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <Calendar className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="investigating">Investigating</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Alerts List */}
            <div className="space-y-4">
              {filteredAlerts.length === 0 ? (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6 text-center text-muted-foreground">
                    No alerts found matching your criteria.
                  </CardContent>
                </Card>
              ) : (
                filteredAlerts.map((alert) => (
                  <Card key={alert.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Alert Header */}
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                              <Badge className={getStatusColor(alert.status)}>{alert.status}</Badge>
                            </div>
                            <h3 className="text-lg font-semibold">{alert.title}</h3>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimestamp(alert.timestamp)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Alert Content */}
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{alert.location}</span>
                            <span>•</span>
                            <span>Category: {alert.category}</span>
                          </div>
                          <p className="text-foreground leading-relaxed line-clamp-2">{alert.description}</p>
                        </div>

                        {/* Alert Actions */}
                        <div className="flex items-center justify-end pt-2 border-t border-border/50 space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent"
                            onClick={() => handleEditClick(alert)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteAlert(alert.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Pagination/Load More */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Button variant="outline" className="bg-transparent">
                  Load More Alerts
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
