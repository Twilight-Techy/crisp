"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Shield,
  Search,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  FileText,
  Bell,
  Calendar,
  MapPin,
  User,
} from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function TrackPage() {
  const [trackingCode, setTrackingCode] = useState("")
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Mock report data
  const mockReport = {
    id: "CRISP-ABC123XYZ",
    type: "Theft",
    location: "Downtown District, Main St & 5th Ave",
    submittedAt: "2024-01-15T14:30:00Z",
    status: "investigating",
    priority: "medium",
    updates: [
      {
        date: "2024-01-15T14:30:00Z",
        status: "submitted",
        message: "Report received and assigned tracking code",
        officer: "System",
      },
      {
        date: "2024-01-15T15:45:00Z",
        status: "under_review",
        message: "Report is being reviewed by our moderation team",
        officer: "Moderation Team",
      },
      {
        date: "2024-01-15T16:20:00Z",
        status: "verified",
        message: "Report has been verified and forwarded to local authorities",
        officer: "Officer Johnson",
      },
      {
        date: "2024-01-16T09:15:00Z",
        status: "investigating",
        message: "Investigation is underway. Additional patrols have been assigned to the area",
        officer: "Detective Smith",
      },
    ],
    description: "Bicycle theft reported outside shopping center",
    anonymous: true,
  }

  const handleSearch = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/track/${trackingCode.trim()}`)
      if (!res.ok) {
        setReportData(null)
      } else {
        const data = await res.json()
        setReportData({
          ...data,
          id: data.trackingCode,
          type: data.type,
          location: data.location,
          submittedAt: data.reportedAt,
          status: data.status.toLowerCase(),
          priority: data.priority || "medium",
          updates: data.timelineUpdates.map((u: any) => ({
            date: u.timestamp,
            status: u.status?.toLowerCase() || "pending",
            message: u.description,
            officer: u.officer || "System",
          })),
          description: data.description,
          anonymous: data.isAnonymous,
        })
      }
    } catch (err) {
      console.error("Tracking error:", err)
      setReportData(null)
    }
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      case "under_review":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "verified":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      case "investigating":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
      case "resolved":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
      case "closed":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <FileText className="w-4 h-4" />
      case "under_review":
        return <Eye className="w-4 h-4" />
      case "verified":
        return <CheckCircle className="w-4 h-4" />
      case "investigating":
        return <Search className="w-4 h-4" />
      case "resolved":
        return <CheckCircle className="w-4 h-4" />
      case "closed":
        return <FileText className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30">
      <Navbar />

      <div className="container mx-auto px-4 py-8 pt-20">
        {" "}
        {/* Added pt-20 here */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Search Section */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Track Your Report</CardTitle>
              <p className="text-muted-foreground">Enter your tracking code to check the status of your crime report</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tracking-code">Tracking Code</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="tracking-code"
                      placeholder="Enter your tracking code (e.g., CRISP-ABC123XYZ)"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSearch}
                      disabled={!trackingCode || loading}
                      className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                    >
                      {loading ? <Clock className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                      {loading ? "Searching..." : "Track Report"}
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    Your tracking code was provided when you submitted your report. It starts with "CRISP-" followed by
                    a unique identifier.
                  </p>
                </div>
              </div>

              {/* Sample Tracking Code */}
              <Card className="bg-muted/30 border-dashed">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">Try a sample tracking code:</h4>
                      <code className="text-sm text-emerald-600 font-mono">CRISP-ABC123XYZ</code>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTrackingCode("CRISP-ABC123XYZ")}
                      className="bg-transparent"
                    >
                      Use Sample
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Report Details */}
          {reportData && (
            <div className="space-y-6">
              {/* Report Summary */}
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Report Details</CardTitle>
                    <Badge className={getStatusColor(reportData.status)}>
                      {getStatusIcon(reportData.status)}
                      <span className="ml-2 capitalize">{reportData.status.replace("_", " ")}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Tracking Code</Label>
                        <div className="font-mono text-lg">{reportData.id}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Incident Type</Label>
                        <div className="text-lg">{reportData.type}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Priority Level</Label>
                        <Badge className={getStatusColor(reportData.priority)}>
                          {reportData.priority.charAt(0).toUpperCase() + reportData.priority.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-4 h-4 text-emerald-600 mt-1" />
                          <div>{reportData.location}</div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Submitted</Label>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-emerald-600" />
                          <div>{formatDate(reportData.submittedAt)}</div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Report Type</Label>
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-emerald-600" />
                          <div>{reportData.anonymous ? "Anonymous" : "Identified"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                    <div className="mt-2 p-4 bg-muted/30 rounded-lg">{reportData.description}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Status Timeline */}
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl">Status Timeline</CardTitle>
                  <p className="text-muted-foreground">Track the progress of your report</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {reportData.updates.map((update: any, index: number) => (
                      <div key={index} className="flex space-x-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              index === reportData.updates.length - 1
                                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {getStatusIcon(update.status)}
                          </div>
                          {index < reportData.updates.length - 1 && <div className="w-0.5 h-12 bg-muted mt-2"></div>}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge className={getStatusColor(update.status)}>
                              {update.status.replace("_", " ").charAt(0).toUpperCase() +
                                update.status.replace("_", " ").slice(1)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{formatDate(update.date)}</span>
                          </div>
                          <p className="text-foreground">{update.message}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <User className="w-3 h-3" />
                            <span>Updated by: {update.officer}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline" className="bg-transparent">
                      <Bell className="w-4 h-4 mr-2" />
                      Subscribe to Updates
                    </Button>
                    <Button variant="outline" className="bg-transparent">
                      <FileText className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-transparent"
                      onClick={() => {
                        setReportData(null)
                        setTrackingCode("")
                      }}
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Track Another Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* No Results */}
          {trackingCode && !loading && !reportData && trackingCode.length > 0 && (
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8 text-center space-y-4">
                <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Report Not Found</h3>
                  <p className="text-muted-foreground">
                    We couldn't find a report with the tracking code "{trackingCode}". Please check the code and try
                    again.
                  </p>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Make sure your tracking code:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Starts with "CRISP-"</li>
                    <li>Is exactly as provided when you submitted your report</li>
                    <li>Doesn't contain any extra spaces</li>
                  </ul>
                </div>
                <Button variant="outline" onClick={() => setTrackingCode("")} className="bg-transparent">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
