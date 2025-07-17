"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CheckCircle, Clock, User, FileText, MapPin, Info } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"

export default function ReportActionPage() {
  const params = useParams()
  const { id } = params
  const router = useRouter()

  // Mock data for a single report
  const report = {
    id: Number(id),
    type: "Suspicious Activity",
    location: "Park Avenue & 5th Street, Cityville",
    time: "2024-07-15T14:30:00Z",
    status: "pending-review",
    priority: "high",
    description:
      "A group of 3-4 individuals has been observed loitering near the park entrance for the past two hours. They appear to be exchanging small packages discreetly. One individual was seen attempting to open car doors in the adjacent parking lot. They are wearing dark hoodies and seem to be avoiding eye contact with passersby. This behavior is unusual for this area.",
    reporter: "Anonymous User",
    contactInfo: "N/A",
    actionsTaken: [
      {
        timestamp: "2024-07-15T15:00:00Z",
        action: "Report received and assigned to Officer Smith.",
        by: "System",
      },
    ],
    notes:
      "Initial assessment suggests potential drug dealing or car theft attempts. Officer advised to approach with caution.",
  }

  const [newStatus, setNewStatus] = useState(report.status)
  const [actionNote, setActionNote] = useState("")
  const [assignedTo, setAssignedTo] = useState("")
  const [resolutionDetails, setResolutionDetails] = useState("")

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30 pt-16">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Report Not Found</h1>
            <p className="text-muted-foreground mb-8">The report you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href={`/admin/reports/${id}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Report Details
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

  const handleUpdateReport = () => {
    // In a real application, this would send data to a backend API
    console.log("Updating report:", {
      reportId: report.id,
      newStatus,
      actionNote,
      assignedTo,
      resolutionDetails,
    })
    alert("Report updated successfully! (Demo)")
    router.push(`/admin/reports/${id}`) // Redirect back to report details
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
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
                <Link href={`/admin/reports/${id}`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Report Details
                </Link>
              </Button>
              <h1 className="text-3xl font-bold">Take Action on Report #{report.id.toString().padStart(4, "0")}</h1>
              <p className="text-lg text-muted-foreground">{report.type}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getPriorityColor(report.priority)}>{report.priority} Priority</Badge>
              <Badge className={getStatusColor(report.status)}>Current: {report.status}</Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Report Summary */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <span>Report Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{report.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{formatTimestamp(report.time)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{report.reporter}</span>
                  </div>
                  <Separator />
                  <p className="line-clamp-4 text-muted-foreground">{report.description}</p>
                  <Button asChild variant="link" className="p-0 h-auto text-emerald-600">
                    <Link href={`/admin/reports/${id}`}>View Full Details</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Current Actions Taken */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    <span>Recent Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {report.actionsTaken.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No actions recorded yet.</p>
                  ) : (
                    <div className="space-y-3 text-sm">
                      {report.actionsTaken.map((action, index) => (
                        <div key={index} className="space-y-1">
                          <p className="font-medium">{action.action}</p>
                          <div className="text-xs text-muted-foreground">
                            {formatTimestamp(action.timestamp)} by {action.by}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Action Form */}
            <Card className="lg:col-span-2 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>Update Report Status & Add Action</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleUpdateReport()
                  }}
                  className="space-y-6"
                >
                  {/* Status Update */}
                  <div className="space-y-2">
                    <Label htmlFor="status">Update Status</Label>
                    <RadioGroup value={newStatus} onValueChange={setNewStatus} className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pending-review" id="status-pending" />
                        <Label htmlFor="status-pending">Pending Review</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="in-progress" id="status-in-progress" />
                        <Label htmlFor="status-in-progress">In Progress</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="resolved" id="status-resolved" />
                        <Label htmlFor="status-resolved">Resolved</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="closed" id="status-closed" />
                        <Label htmlFor="status-closed">Closed</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Action Note */}
                  <div className="space-y-2">
                    <Label htmlFor="action-note">Action Note</Label>
                    <Textarea
                      id="action-note"
                      placeholder="Describe the action taken or update details..."
                      value={actionNote}
                      onChange={(e) => setActionNote(e.target.value)}
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  {/* Assigned To */}
                  <div className="space-y-2">
                    <Label htmlFor="assigned-to">Assigned To (Optional)</Label>
                    <Input
                      id="assigned-to"
                      placeholder="e.g., Officer Smith, Detective Johnson"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                    />
                  </div>

                  {/* Resolution Details (if status is resolved/closed) */}
                  {(newStatus === "resolved" || newStatus === "closed") && (
                    <div className="space-y-2">
                      <Label htmlFor="resolution-details">Resolution Details</Label>
                      <Textarea
                        id="resolution-details"
                        placeholder="Provide details about how the report was resolved or closed."
                        value={resolutionDetails}
                        onChange={(e) => setResolutionDetails(e.target.value)}
                        className="min-h-[100px]"
                        required
                      />
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" type="button" asChild className="bg-transparent">
                      <Link href={`/admin/reports/${id}`}>Cancel</Link>
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                    >
                      Save Update
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
