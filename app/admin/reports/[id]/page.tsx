"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  ClipboardList,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"

type Attachment = {
  url: string;
  type: "image" | "video" | "audio" | "file";
  fileType?: string;
  name?: string;
  uploadedAt?: string | Date;
};

type ActionTaken = {
  timestamp: string | Date;
  action: string;
  by?: string;
};

type ReportShape = {
  id: string;
  title?: string;
  description: string;
  type: string;
  location: string;
  coordinates?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status: "RECEIVED" | "UNDER_INVESTIGATION" | "RESOLVED" | string;
  reportedAt: string;
  resolvedAt?: string | null;
  reporterName?: string | null;
  reporterEmail?: string | null;
  attachments: Attachment[];
  actionsTaken: ActionTaken[];
  trackingCode?: string;
};

export default function ReportDetailPage() {
  const params = useParams()
  const { id } = params
  const router = useRouter()

  const [report, setReport] = useState<ReportShape | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // delete modal state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!id) return
    fetchReport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function fetchReport() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/reports/${id}`, { cache: "no-store" })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown" }))
        setError(err?.error || `Failed to load (status ${res.status})`)
        setReport(null)
        return
      }
      const data = await res.json()
      // Normalise date fields to ISO strings to keep display consistent
      if (data.reportedAt) data.reportedAt = new Date(data.reportedAt).toISOString()
      if (data.resolvedAt) data.resolvedAt = new Date(data.resolvedAt).toISOString()
      if (Array.isArray(data.actionsTaken)) {
        data.actionsTaken = data.actionsTaken.map((a: any) => ({ ...a, timestamp: new Date(a.timestamp).toISOString() }))
      }
      setReport(data)
    } catch (err) {
      console.error(err)
      setError("Failed to fetch report")
      setReport(null)
    } finally {
      setLoading(false)
    }
  }

  const statusLabels: Record<string, string> = {
    RECEIVED: "Received",
    UNDER_INVESTIGATION: "Under Investigation",
    RESOLVED: "Resolved",
    "pending-review": "Pending Review",
    "in-progress": "In Progress",
    "closed": "Closed",
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RECEIVED":
      case "pending-review":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "UNDER_INVESTIGATION":
      case "in-progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      case "RESOLVED":
      case "resolved":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      case "closed":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const formatTimestamp = (timestamp?: string | Date) => {
    if (!timestamp) return ""
    try {
      const d = new Date(timestamp)
      return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
    } catch {
      return String(timestamp)
    }
  }

  const handleDelete = async () => {
    if (!report) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/reports/${report.id}`, { method: "DELETE" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        console.error("Delete failed", data)
        alert(data?.error || "Failed to delete report")
        setShowDeleteConfirm(false)
        return
      }
      // success — redirect to admin dashboard
      router.push("/admin")
    } catch (err) {
      console.error(err)
      alert("Failed to delete report")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30 pt-16">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-muted-foreground">Loading report...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30 pt-16">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="text-muted-foreground mb-8">{error}</p>
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
              <h1 className="text-3xl font-bold">Report Details: #{report.trackingCode ?? report.id}</h1>
              <p className="text-lg text-muted-foreground">{report.type}</p>
            </div>
            <div className="flex items-center space-x-2">
              {/* Priority badge removed as requested */}
              <Badge className={getStatusColor(report.status)}>
                {statusLabels[report.status] ?? report.status}
              </Badge>
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
                      <p className="font-medium">{report.trackingCode ?? `CRISP-${report.id}`}</p>
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
                      <p className="font-medium">{report.coordinates ?? (report.latitude && report.longitude ? `${report.latitude}, ${report.longitude}` : "N/A")}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Time of Incident</Label>
                      <p className="font-medium">{formatTimestamp(report.reportedAt)}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Reported By</Label>
                      <p className="font-medium">{report.reporterName || "Anonymous"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Contact Info</Label>
                      <p className="font-medium">{report.reporterEmail ?? "N/A"}</p>
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
                    <ImageIcon className="w-5 h-5 text-purple-600" />
                    <span>Attachments</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(!report.attachments || report.attachments.length === 0) ? (
                    <p className="text-muted-foreground">No attachments provided.</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {report.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="relative group aspect-video rounded-lg overflow-hidden border border-border/50"
                        >
                          {attachment.type === "image" && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={attachment.url || "/placeholder.svg"}
                              alt={attachment.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                          {attachment.type === "video" && (
                            <video controls className="w-full h-full object-cover">
                              <source src={attachment.url} />
                              Your browser does not support the video tag.
                            </video>
                          )}
                          {attachment.type === "audio" && (
                            <div className="flex items-center justify-center h-full bg-muted">
                              <audio controls className="w-full max-w-[200px]">
                                <source src={attachment.url} />
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          )}
                          {attachment.type === "file" && (
                            <div className="flex items-center justify-center h-full bg-muted">
                              <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="underline">
                                {attachment.name || "Open file"}
                              </a>
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
                  {(!report.actionsTaken || report.actionsTaken.length === 0) ? (
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
                              {formatTimestamp(action.timestamp)}{action.by ? ` by ${action.by}` : ""}
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
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Report
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
                      <Badge className={getStatusColor("UNDER_INVESTIGATION")}>In Progress</Badge>
                    </li>
                    <li className="flex items-center justify-between">
                      <Link href="/admin/reports/5" className="text-sm hover:text-emerald-600">
                        #CRISP-0005 - Missing Person
                      </Link>
                      <Badge className={getStatusColor("RECEIVED")}>Pending Review</Badge>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
          <div className="fixed inset-0 bg-black/50" onClick={() => { if (!deleting) setShowDeleteConfirm(false) }} />
          <div className="relative max-w-lg w-full bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 z-10">
            <h3 className="text-lg font-medium">Confirm delete</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to permanently delete this report? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>
                Cancel
              </Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2 inline-block" />
                    Delete Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
