"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Shield,
  MapPin,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Calendar,
  ExternalLink,
  Phone,
  Info,
  TrendingUp,
  Users,
} from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function AlertsPage() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedTimeRange, setSelectedTimeRange] = useState("24hours")
  const [searchQuery, setSearchQuery] = useState("")

  const publicAlerts = [
    {
      id: 1,
      type: "High Priority",
      title: "Increased Police Presence - Downtown District",
      location: "Downtown District",
      time: "2 hours ago",
      severity: "high",
      description:
        "Additional police patrols have been deployed in the downtown area following recent incidents. Residents are advised to remain vigilant.",
      category: "police-activity",
      status: "active",
      source: "Metro Police Department",
    },
    {
      id: 2,
      type: "Community Alert",
      title: "Suspicious Activity Reported - Park Avenue",
      location: "Park Avenue & 5th Street",
      time: "4 hours ago",
      severity: "medium",
      description:
        "Multiple residents have reported suspicious individuals in the area. Police are investigating. Avoid the area if possible.",
      category: "suspicious-activity",
      status: "investigating",
      source: "Community Reports",
    },
    {
      id: 3,
      type: "Safety Advisory",
      title: "Well-Lit Areas Recommended After Dark",
      location: "Residential North",
      time: "6 hours ago",
      severity: "low",
      description:
        "Following recent incidents, residents are advised to use well-lit paths and travel in groups when possible after dark.",
      category: "safety-advisory",
      status: "ongoing",
      source: "Safety Committee",
    },
    {
      id: 4,
      type: "Resolved",
      title: "Vehicle Break-ins Investigation Complete",
      location: "Shopping Center Parking",
      time: "1 day ago",
      severity: "medium",
      description:
        "The investigation into recent vehicle break-ins has been completed. Suspect has been apprehended. Increased security measures implemented.",
      category: "theft",
      status: "resolved",
      source: "Metro Police Department",
    },
    {
      id: 5,
      type: "Community Update",
      title: "Neighborhood Watch Meeting Scheduled",
      location: "Community Center",
      time: "2 days ago",
      severity: "low",
      description:
        "Join us for a community safety meeting this Thursday at 7 PM. Discuss recent incidents and safety improvements.",
      category: "community",
      status: "scheduled",
      source: "Neighborhood Watch",
    },
  ]

  const alertStats = {
    activeAlerts: 3,
    resolvedToday: 2,
    totalThisWeek: 12,
    communityReports: 8,
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200"
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "police-activity":
        return "👮"
      case "suspicious-activity":
        return "👁️"
      case "safety-advisory":
        return "⚠️"
      case "theft":
        return "🚗"
      case "community":
        return "👥"
      default:
        return "📢"
    }
  }

  const filteredAlerts = publicAlerts.filter((alert) => {
    const matchesFilter = selectedFilter === "all" || alert.category === selectedFilter
    const matchesSearch =
      searchQuery === "" ||
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30 pt-16">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Community Safety Alerts</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay informed about safety incidents and community updates in your area. No account required.
            </p>
          </div>

          {/* Alert Statistics */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center space-y-2">
                <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
                <div className="text-2xl font-bold text-red-600">{alertStats.activeAlerts}</div>
                <div className="text-sm text-muted-foreground">Active Alerts</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center space-y-2">
                <Shield className="w-8 h-8 text-green-600 mx-auto" />
                <div className="text-2xl font-bold text-green-600">{alertStats.resolvedToday}</div>
                <div className="text-sm text-muted-foreground">Resolved Today</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center space-y-2">
                <TrendingUp className="w-8 h-8 text-blue-600 mx-auto" />
                <div className="text-2xl font-bold text-blue-600">{alertStats.totalThisWeek}</div>
                <div className="text-sm text-muted-foreground">This Week</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center space-y-2">
                <Users className="w-8 h-8 text-purple-600 mx-auto" />
                <div className="text-2xl font-bold text-purple-600">{alertStats.communityReports}</div>
                <div className="text-sm text-muted-foreground">Community Reports</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Alerts Feed */}
            <div className="lg:col-span-3 space-y-6">
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
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                      <SelectTrigger className="w-48">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="police-activity">Police Activity</SelectItem>
                        <SelectItem value="suspicious-activity">Suspicious Activity</SelectItem>
                        <SelectItem value="safety-advisory">Safety Advisory</SelectItem>
                        <SelectItem value="theft">Theft/Crime</SelectItem>
                        <SelectItem value="community">Community Updates</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24hours">Last 24 Hours</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="all">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts List */}
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <Card key={alert.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Alert Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="text-2xl">{getCategoryIcon(alert.category)}</div>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Badge className={getSeverityColor(alert.severity)}>
                                  {alert.severity.toUpperCase()}
                                </Badge>
                                <Badge className={getStatusColor(alert.status)}>{alert.status}</Badge>
                              </div>
                              <h3 className="text-lg font-semibold">{alert.title}</h3>
                            </div>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{alert.time}</span>
                            </div>
                          </div>
                        </div>

                        {/* Alert Content */}
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{alert.location}</span>
                            <span>•</span>
                            <span>Source: {alert.source}</span>
                          </div>
                          <p className="text-foreground leading-relaxed">{alert.description}</p>
                        </div>

                        {/* Alert Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                          <div className="text-xs text-muted-foreground">
                            Alert ID: CRISP-{alert.id.toString().padStart(3, "0")}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <MapPin className="w-4 h-4 mr-2" />
                              View on Map
                            </Button>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Button variant="outline" className="bg-transparent">
                    Load More Alerts
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Emergency Contacts */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-red-600" />
                    <span>Emergency Contacts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left bg-red-50 hover:bg-red-100 border-red-200 text-red-700 h-auto py-3"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">🚨</span>
                        <div className="text-left">
                          <div className="font-semibold">Emergency - 911</div>
                          <div className="text-xs text-red-600">Police, Fire, Medical</div>
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 h-auto py-3"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">👮</span>
                        <div className="text-left">
                          <div className="font-semibold">Police - (555) 123-4567</div>
                          <div className="text-xs text-blue-600">Non-emergency line</div>
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left bg-green-50 hover:bg-green-100 border-green-200 text-green-700 h-auto py-3"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">🏥</span>
                        <div className="text-left">
                          <div className="font-semibold">Non-Emergency - (555) 987-6543</div>
                          <div className="text-xs text-green-600">General inquiries</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Safety Tips */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    <span>Safety Tips</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">💡</span>
                      <p>Stay aware of your surroundings, especially in unfamiliar areas.</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">📱</span>
                      <p>Keep your phone charged and share your location with trusted contacts.</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">👥</span>
                      <p>Travel in groups when possible, especially after dark.</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-lg">🚶</span>
                      <p>Use well-lit paths and avoid shortcuts through isolated areas.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Report Incident CTA */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30">
                <CardContent className="p-6 text-center space-y-4">
                  <Shield className="w-12 h-12 text-emerald-600 mx-auto" />
                  <div>
                    <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">See Something Suspicious?</h3>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-2">
                      Report incidents anonymously to help keep our community safe.
                    </p>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                    Report Incident
                  </Button>
                </CardContent>
              </Card>

              {/* Community Stats */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    <span>Community Impact</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-emerald-600">847</div>
                      <div className="text-xs text-muted-foreground">Total Reports</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-blue-600">94%</div>
                      <div className="text-xs text-muted-foreground">Response Rate</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-purple-600">23%</div>
                      <div className="text-xs text-muted-foreground">Crime Reduction</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-amber-600">1.2k</div>
                      <div className="text-xs text-muted-foreground">Active Users</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
