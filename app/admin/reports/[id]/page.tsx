"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  FileText,
  MessageSquare,
  ImageIcon,
  CheckCircle,
  Edit,
  Trash2,
  ExternalLink,
  Info,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { ClipboardList } from "lucide-react" // Import ClipboardList

export default function ReportDetailPage() {
  const params = useParams()
  const { id } = params
  const router = useRouter()

  // Mock data for a single report
  const report = {
    id: Number(id),
    type: "Suspicious Activity",
    location: "Park Avenue & 5th Street, Cityville",
    coordinates: "34.0522° N, 118.2437° W",
    time: "2024-07-15T14:30:00Z",
    status: "pending-review",
    priority: "high",
    description:
      "A group of 3-4 individuals has been observed loitering near the park entrance for the past two hours. They appear to be exchanging small packages discreetly. One individual was seen attempting to open car doors in the adjacent parking lot. They are wearing dark hoodies and seem to be avoiding eye contact with passersby. This behavior is unusual for this area.",
    reporter: "Anonymous User",
    contactInfo: "N/A",
    attachments: [
      { type: "image", url: "/placeholder.svg?height=200&width=300", name: "suspect_photo_1.jpg" },
      { type: "image", url: "/placeholder.svg?height=200&width=300", name: "area_photo_2.jpg" },
      { type: "video", url: "https://example.com/video.mp4", name: "security_footage.mp4" },
      { type: "audio", url: "https://example.com/audio.mp3", name: "witness_statement.mp3" },
    ],
    actionsTaken: [
      {
        timestamp: "2024-07-15T15:00:00Z",
        action: "Report received and assigned to Officer Smith.",
        by: "System",
      },
      {
        timestamp: "2024-07-15T15:30:00Z",
        action: "Officer Smith dispatched to location.",
        by: "Officer Smith",
      },
    ],
    notes:
      "Initial assessment suggests potential drug dealing or car theft attempts. Officer advised to approach with caution.",
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30 pt-16">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Report Not Found</h1>
            <p className="text-muted-foreground mb-8">The report you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/admin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending-review":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "in-progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      case "resolved":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      case "closed":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
      case "high":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

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
              <h1 className="text-3xl font-bold">Report Details: #{report.id.toString().padStart(4, "0")}</h1>
              <p className="text-lg text-muted-foreground">{report.type}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getPriorityColor(report.priority)}>{report.priority} Priority</Badge>
              <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Report Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <span>Incident Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Report ID</Label>
                      <p className="font-medium">CRISP-{report.id.toString().padStart(4, "0")}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Report Type</Label>
                      <p className="font-medium">{report.type}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Location</Label>
                      <p className="font-medium">{report.location}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Coordinates</Label>
                      <p className="font-medium">{report.coordinates}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Time of Incident</Label>
                      <p className="font-medium">{formatTimestamp(report.time)}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Reported By</Label>
                      <p className="font-medium">{report.reporter}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Contact Info</Label>
                      <p className="font-medium">{report.contactInfo}</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <Label className="text-muted-foreground">Description</Label>
                    <p className="leading-relaxed mt-1">{report.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Attachments */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ImageIcon className="w-5 h-5 text-purple-600" /> {/* Updated Image to ImageIcon */}
                    <span>Attachments</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {report.attachments.length === 0 ? (
                    <p className="text-muted-foreground">No attachments provided.</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {report.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="relative group aspect-video rounded-lg overflow-hidden border border-border/50"
                        >
                          {attachment.type === "image" && (
                            <img
                              src={attachment.url || "/placeholder.svg"}
                              alt={attachment.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                          {attachment.type === "video" && (
                            <video controls className="w-full h-full object-cover">
                              <source src={attachment.url} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          )}
                          {attachment.type === "audio" && (
                            <div className="flex items-center justify-center h-full bg-muted">
                              <audio controls className="w-full max-w-[200px]">
                                <source src={attachment.url} type="audio/mpeg" />
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="secondary" size="sm" asChild>
                              <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View
                              </a>
                            </Button>
                          </div>
                          <div className="absolute bottom-2 left-2 right-2 text-white text-xs truncate bg-black/70 px-2 py-1 rounded">
                            {attachment.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions Taken */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <span>Actions Taken</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {report.actionsTaken.length === 0 ? (
                    <p className="text-muted-foreground">No actions recorded yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {report.actionsTaken.map((action, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <Info className="w-4 h-4 text-blue-700 dark:text-blue-300" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium">{action.action}</p>
                            <div className="text-sm text-muted-foreground">
                              {formatTimestamp(action.timestamp)} by {action.by}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Admin Actions */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-emerald-900 dark:text-emerald-100">
                    <Edit className="w-5 h-5" />
                    <span>Admin Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  >
                    <Link href={`/admin/reports/${report.id}/action`}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Update Status / Take Action
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent text-blue-600 hover:text-blue-700 border-blue-200 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Report Details
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Report
                  </Button>
                </CardContent>
              </Card>

              {/* Internal Notes */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-orange-600" />
                    <span>Internal Notes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Add internal notes about this report..."
                    defaultValue={report.notes}
                    className="min-h-[120px]"
                  />
                  <Button size="sm" className="mt-3 w-full bg-orange-600 hover:bg-orange-700">
                    Save Notes
                  </Button>
                </CardContent>
              </Card>

              {/* Related Reports */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ClipboardList className="w-5 h-5 text-gray-600" />
                    <span>Related Reports</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between">
                      <Link href="/admin/reports/2" className="text-sm hover:text-emerald-600">
                        #CRISP-0002 - Vandalism
                      </Link>
                      <Badge className={getStatusColor("in-progress")}>In Progress</Badge>
                    </li>
                    <li className="flex items-center justify-between">
                      <Link href="/admin/reports/5" className="text-sm hover:text-emerald-600">
                        #CRISP-0005 - Missing Person
                      </Link>
                      <Badge className={getStatusColor("pending-review")}>Pending Review</Badge>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
