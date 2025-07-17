"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  Clock,
  Search,
  Filter,
  FileText,
  UserPlus,
  UserCog,
  Settings,
  LogOut,
  CheckCircle,
  Eye,
  BarChart,
  Bell,
  Mail,
  Globe,
  Key,
  MessageSquare,
  ClipboardList,
  List,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminDashboardPage() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  // Mock data for reports
  const reports = [
    {
      id: 1,
      type: "Suspicious Activity",
      location: "Park Avenue & 5th Street",
      time: "2 hours ago",
      status: "pending-review",
      priority: "high",
      description: "Group of individuals loitering near the park entrance, observed exchanging suspicious packages.",
      reporter: "Anonymous",
    },
    {
      id: 2,
      type: "Vandalism",
      location: "Community Center Wall",
      time: "4 hours ago",
      status: "in-progress",
      priority: "medium",
      description: "Graffiti found on the north wall of the community center. Needs cleanup and investigation.",
      reporter: "Jane Doe",
    },
    {
      id: 3,
      type: "Theft",
      location: "Main Street Pharmacy",
      time: "1 day ago",
      status: "resolved",
      priority: "medium",
      description: "Shoplifting incident reported. Suspect identified via security footage.",
      reporter: "Anonymous",
    },
    {
      id: 4,
      type: "Noise Complaint",
      location: "Residential Area, Elm Street",
      time: "1 day ago",
      status: "closed",
      priority: "low",
      description: "Loud party late at night. Police dispatched, situation resolved.",
      reporter: "John Smith",
    },
    {
      id: 5,
      type: "Missing Person",
      location: "Forest Park Trails",
      time: "2 days ago",
      status: "pending-review",
      priority: "critical",
      description: "Elderly person reported missing after not returning from a walk.",
      reporter: "Family Member",
    },
  ]

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
      case "critical":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
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

  const filteredReports = reports.filter((report) => {
    const matchesFilter = selectedFilter === "all" || report.type.toLowerCase().includes(selectedFilter.toLowerCase())
    const matchesStatus = selectedStatus === "all" || report.status === selectedStatus
    const matchesSearch =
      searchQuery === "" ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reporter.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesStatus && matchesSearch
  })

  const handleLogout = () => {
    localStorage.removeItem("crisp_admin_auth")
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30 pt-16">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-lg text-muted-foreground">Manage reports, users, and system settings.</p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                <FileText className="w-10 h-10 text-emerald-600" />
                <h3 className="font-semibold text-lg">New Report</h3>
                <p className="text-sm text-muted-foreground">Submit a new incident report.</p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                >
                  <Link href="/report">Create Report</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                <UserPlus className="w-10 h-10 text-blue-600" />
                <h3 className="font-semibold text-lg">Add Moderator</h3>
                <p className="text-sm text-muted-foreground">Grant access to new team members.</p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Link href="/admin/moderators/add">Add Moderator</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                <UserCog className="w-10 h-10 text-purple-600" />
                <h3 className="font-semibold text-lg">Manage Moderators</h3>
                <p className="text-sm text-muted-foreground">Edit or remove existing moderators.</p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  <Link href="/admin/moderators">Manage Moderators</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                <Settings className="w-10 h-10 text-gray-600" />
                <h3 className="font-semibold text-lg">System Settings</h3>
                <p className="text-sm text-muted-foreground">Configure application-wide parameters.</p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700"
                >
                  <Link href="/admin/settings">System Settings</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Reports Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <ClipboardList className="w-6 h-6 text-emerald-600" />
              <span>Recent Reports</span>
            </h2>

            {/* Filters and Search */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reports..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="suspicious activity">Suspicious Activity</SelectItem>
                      <SelectItem value="vandalism">Vandalism</SelectItem>
                      <SelectItem value="theft">Theft</SelectItem>
                      <SelectItem value="noise complaint">Noise Complaint</SelectItem>
                      <SelectItem value="missing person">Missing Person</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-40">
                      <List className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending-review">Pending Review</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Reports List */}
            <div className="space-y-4">
              {filteredReports.length === 0 ? (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6 text-center text-muted-foreground">
                    No reports found matching your criteria.
                  </CardContent>
                </Card>
              ) : (
                filteredReports.map((report) => (
                  <Card key={report.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Report Header */}
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Badge className={getPriorityColor(report.priority)}>{report.priority}</Badge>
                              <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                            </div>
                            <h3 className="text-lg font-semibold">{report.type}</h3>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{report.time}</span>
                            </div>
                          </div>
                        </div>

                        {/* Report Content */}
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{report.location}</span>
                            <span>•</span>
                            <span>Reported by: {report.reporter}</span>
                          </div>
                          <p className="text-foreground leading-relaxed line-clamp-2">{report.description}</p>
                        </div>

                        {/* Report Actions */}
                        <div className="flex items-center justify-end pt-2 border-t border-border/50 space-x-2">
                          <Button asChild variant="outline" size="sm" className="bg-transparent">
                            <Link href={`/admin/reports/${report.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              Review
                            </Link>
                          </Button>
                          <Button
                            asChild
                            size="sm"
                            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                          >
                            <Link href={`/admin/reports/${report.id}/action`}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Take Action
                            </Link>
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
                  Load More Reports
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Other Admin Sections (Placeholders) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart className="w-5 h-5 text-orange-600" />
                  <span>Analytics & Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">View detailed reports and trends.</p>
                <Button asChild variant="outline" className="mt-4 w-full bg-transparent">
                  <Link href="/admin/analytics">Go to Analytics</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-red-600" />
                  <span>Alert Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Manage public safety alerts.</p>
                <Button asChild variant="outline" className="mt-4 w-full bg-transparent">
                  <Link href="/admin/alerts">Manage Alerts</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <span>Communication Tools</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Send mass notifications or individual messages.</p>
                <Button asChild variant="outline" className="mt-4 w-full bg-transparent">
                  <Link href="/admin/communication">Communication</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-green-600" />
                  <span>Map Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Adjust map layers and incident display.</p>
                <Button asChild variant="outline" className="mt-4 w-full bg-transparent">
                  <Link href="/admin/map-config">Map Settings</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="w-5 h-5 text-amber-600" />
                  <span>API Integrations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Manage third-party API connections.</p>
                <Button asChild variant="outline" className="mt-4 w-full bg-transparent">
                  <Link href="/admin/integrations">Integrations</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-cyan-600" />
                  <span>Feedback & Support</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Review user feedback and provide support.</p>
                <Button asChild variant="outline" className="mt-4 w-full bg-transparent">
                  <Link href="/admin/feedback">Feedback</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
