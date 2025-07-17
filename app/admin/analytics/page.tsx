"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  BarChart,
  LineChart,
  PieChart,
  MapPin,
  Clock,
  Users,
  Shield,
  TrendingUp,
  Filter,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("last7days")
  const [reportTypeFilter, setReportTypeFilter] = useState("all")

  // Mock data for charts and stats
  const incidentData = {
    last7days: [
      { date: "Jul 10", count: 5 },
      { date: "Jul 11", count: 8 },
      { date: "Jul 12", count: 6 },
      { date: "Jul 13", count: 10 },
      { date: "Jul 14", count: 7 },
      { date: "Jul 15", count: 12 },
      { date: "Jul 16", count: 9 },
    ],
    last30days: [
      { date: "Jun 17", count: 4 },
      { date: "Jun 24", count: 7 },
      { date: "Jul 1", count: 9 },
      { date: "Jul 8", count: 11 },
      { date: "Jul 15", count: 12 },
    ],
    last90days: [
      { date: "Apr 17", count: 15 },
      { date: "May 17", count: 22 },
      { date: "Jun 17", count: 30 },
      { date: "Jul 17", count: 35 },
    ],
  }

  const reportTypeDistribution = {
    "Suspicious Activity": 30,
    Vandalism: 20,
    Theft: 25,
    "Noise Complaint": 15,
    "Missing Person": 10,
  }

  const topLocations = [
    { name: "Downtown District", count: 45 },
    { name: "Park Avenue", count: 30 },
    { name: "Residential North", count: 25 },
    { name: "Shopping Center", count: 18 },
    { name: "Community Center", count: 12 },
  ]

  const currentIncidentData = incidentData[timeRange as keyof typeof incidentData]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30 pt-16">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Button variant="outline" asChild className="mb-4 bg-transparent">
                <Link href="/admin">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-3xl font-bold">Analytics & Statistics</h1>
              <p className="text-lg text-muted-foreground">Gain insights into incident trends and platform activity.</p>
            </div>
          </div>

          {/* Filters */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-48">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last7days">Last 7 Days</SelectItem>
                    <SelectItem value="last30days">Last 30 Days</SelectItem>
                    <SelectItem value="last90days">Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={reportTypeFilter} onValueChange={setReportTypeFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by Report Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Report Types</SelectItem>
                    <SelectItem value="Suspicious Activity">Suspicious Activity</SelectItem>
                    <SelectItem value="Vandalism">Vandalism</SelectItem>
                    <SelectItem value="Theft">Theft</SelectItem>
                    <SelectItem value="Noise Complaint">Noise Complaint</SelectItem>
                    <SelectItem value="Missing Person">Missing Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center space-y-2">
                <BarChart className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="text-2xl font-bold">
                  {currentIncidentData.reduce((sum, data) => sum + data.count, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Incidents</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center space-y-2">
                <TrendingUp className="w-8 h-8 text-blue-600 mx-auto" />
                <div className="text-2xl font-bold">+15%</div>
                <div className="text-sm text-muted-foreground">Incidents Change</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center space-y-2">
                <Users className="w-8 h-8 text-purple-600 mx-auto" />
                <div className="text-2xl font-bold">85%</div>
                <div className="text-sm text-muted-foreground">Resolution Rate</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center space-y-2">
                <Clock className="w-8 h-8 text-orange-600 mx-auto" />
                <div className="text-2xl font-bold">2.5 hrs</div>
                <div className="text-sm text-muted-foreground">Avg. Response Time</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Incidents Over Time */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LineChart className="w-5 h-5 text-emerald-600" />
                  <span>Incidents Over Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  {/* Placeholder for a Line Chart */}
                  <p>Line Chart Placeholder (e.g., using Recharts or Nivo)</p>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-4">
                  {currentIncidentData.map((data, index) => (
                    <div key={index} className="text-center">
                      <div>{data.date}</div>
                      <div className="font-semibold text-foreground">{data.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Report Type Distribution */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5 text-blue-600" />
                  <span>Report Type Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  {/* Placeholder for a Pie Chart */}
                  <p>Pie Chart Placeholder (e.g., using Recharts or Nivo)</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mt-4">
                  {Object.entries(reportTypeDistribution).map(([type, percentage], index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                      />
                      <span>
                        {type} ({percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Locations */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                <span>Top Incident Locations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {topLocations.map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{location.name}</span>
                    </div>
                    <Badge variant="secondary">{location.count} Incidents</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Analytics (Placeholders) */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Resolution Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Analyze how incidents are resolved over time.</p>
                <Button asChild variant="outline" className="mt-4 w-full bg-transparent">
                  <Link href="/admin/analytics/resolution">View Resolution Trends</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-cyan-600" />
                  <span>User Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Monitor moderator and admin activity.</p>
                <Button asChild variant="outline" className="mt-4 w-full bg-transparent">
                  <Link href="/admin/analytics/user-activity">View User Activity</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
