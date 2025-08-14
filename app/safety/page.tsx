"use client"

import { Separator } from "@/components/ui/separator"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Shield,
  Search,
  Lightbulb,
  Home,
  Car,
  User,
  ExternalLink,
  Phone,
  MapPin,
  Clock,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function SafetyResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const safetyTips = [
    {
      id: "stay-alert",
      category: "personal-safety",
      title: "Stay Alert in Public",
      description: "Learn how to maintain situational awareness and avoid distractions in public spaces.",
      icon: User,
    },
    {
      id: "secure-entry-points",
      category: "home-security",
      title: "Secure All Entry Points",
      description: "Tips for reinforcing doors, windows, and other access points in your home.",
      icon: Home,
    },
    {
      id: "lock-vehicle",
      category: "vehicle-safety",
      title: "Always Lock Your Vehicle",
      description: "Simple habits to prevent vehicle theft and break-ins.",
      icon: Car,
    },
    {
      id: "trust-instincts",
      category: "personal-safety",
      title: "Trust Your Instincts",
      description: "Understand and act on your gut feelings to enhance personal safety.",
      icon: Lightbulb,
    },
    {
      id: "emergency-plan",
      category: "home-security",
      title: "Create a Family Emergency Plan",
      description: "Develop a plan for various emergencies, including natural disasters and home invasions.",
      icon: Shield,
    },
    {
      id: "safe-driving",
      category: "vehicle-safety",
      title: "Practice Safe Driving Habits",
      description: "Tips for defensive driving and avoiding road hazards.",
      icon: Car,
    },
  ]

  const filteredTips = safetyTips.filter(
    (tip) =>
      tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const emergencyContacts = [
    { name: "Emergency Services", number: "911", description: "Police, Fire, Medical", icon: Phone, color: "red" },
    {
      name: "Non-Emergency Police",
      number: "(555) 123-4567",
      description: "General inquiries",
      icon: Phone,
      color: "blue",
    },
  ]

  const recentAlerts = [
    {
      id: 1,
      title: "Increased Police Presence - Downtown",
      location: "Downtown District",
      time: "2 hours ago",
      severity: "high",
    },
    {
      id: 2,
      title: "Suspicious Activity - Park Avenue",
      location: "Park Avenue & 5th Street",
      time: "4 hours ago",
      severity: "medium",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30 pt-16">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Safety Hub & Resources</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Empower yourself with knowledge. Explore safety tips, emergency contacts, and community alerts.
            </p>
          </div>

          {/* Search Bar */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search safety tips or resources..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content - Safety Tips */}
            <div className="lg:col-span-3 space-y-6">
              <h2 className="text-2xl font-bold flex items-center space-x-2">
                <Lightbulb className="w-6 h-6 text-emerald-600" />
                <span>Safety Tips & Guides</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {filteredTips.length === 0 ? (
                  <Card className="border-0 shadow-lg md:col-span-2">
                    <CardContent className="p-6 text-center text-muted-foreground">
                      No safety tips found matching your search.
                    </CardContent>
                  </Card>
                ) : (
                  filteredTips.map((tip) => (
                    <Card key={tip.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                            <tip.icon className="w-5 h-5 text-emerald-600" />
                          </div>
                          <h3 className="text-lg font-semibold">{tip.title}</h3>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{tip.description}</p>
                        <Button asChild variant="outline" className="w-full bg-transparent">
                          <Link href={`/safety/tips/${tip.category}/${tip.id}`}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Learn More
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Button variant="outline" className="bg-transparent">
                    Load More Tips
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Emergency Contacts */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-red-600" />
                    <span>Emergency Contacts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {emergencyContacts.map((contact, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={`w-full justify-start text-left h-auto py-3 ${contact.color === "red"
                          ? "bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                          : "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <contact.icon className={`w-5 h-5 ${getSeverityColor(contact.color)} flex-shrink-0`} />
                        <div className="text-left">
                          <div className="font-semibold">{contact.name}</div>
                          <div className="text-xs text-muted-foreground">{contact.number}</div>
                          <div className="text-xs text-muted-foreground">{contact.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Alerts */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <span>Recent Community Alerts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentAlerts.map((alert, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className={`w-4 h-4 ${getSeverityColor(alert.severity)}`} />
                        <h4 className="font-semibold text-sm">{alert.title}</h4>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{alert.location}</span>
                        <Clock className="w-3 h-3 ml-2" />
                        <span>{alert.time}</span>
                      </div>
                      <Separator />
                    </div>
                  ))}
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/alerts">View All Alerts</Link>
                  </Button>
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
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  >
                    <Link href="/report">Report Incident</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
