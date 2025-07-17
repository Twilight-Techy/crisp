"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import {
  Shield,
  MapPin,
  Bell,
  Users,
  Eye,
  Zap,
  ArrowRight,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  Globe,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function LandingPage() {
  const features = [
    {
      icon: Shield,
      title: "Anonymous Reporting",
      description:
        "Report incidents safely and securely without revealing your identity. Complete privacy protection guaranteed.",
      color: "from-emerald-500 to-green-600",
    },
    {
      icon: MapPin,
      title: "Interactive Crime Map",
      description: "Visualize crime patterns in your area with detailed maps, heat zones, and trend analysis.",
      color: "from-teal-500 to-cyan-600",
    },
    {
      icon: Bell,
      title: "Real-time Alerts",
      description: "Stay informed with instant notifications about incidents and safety updates in your neighborhood.",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Users,
      title: "Community Network",
      description: "Connect with local residents, law enforcement, and community leaders for collective safety.",
      color: "from-lime-500 to-green-500",
    },
  ]

  const recentActivity = [
    { type: "Theft", location: "Downtown District", time: "3 minutes ago", status: "verified", severity: "medium" },
    { type: "Vandalism", location: "Park Avenue", time: "18 minutes ago", status: "under review", severity: "low" },
    {
      type: "Suspicious Activity",
      location: "Shopping Center",
      time: "1 hour ago",
      status: "resolved",
      severity: "low",
    },
    { type: "Break-in", location: "Residential Area", time: "2 hours ago", status: "investigating", severity: "high" },
  ]

  const stats = [
    { number: "75,000+", label: "Reports Processed", icon: TrendingUp },
    { number: "24/7", label: "Active Monitoring", icon: Clock },
    { number: "99.2%", label: "Response Rate", icon: CheckCircle },
    { number: "850+", label: "Communities Served", icon: Users },
  ]

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30 dark:to-green-950/20">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 px-4 py-2">
                  <Zap className="w-4 h-4 mr-2" />
                  Advanced Crime Intelligence System
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-foreground">Safer Communities</span>
                  <br />
                  <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                    Start Here
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                  CRISP empowers communities with comprehensive crime reporting, real-time mapping, and intelligent
                  safety alerts. Together, we build stronger, safer neighborhoods.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  asChild
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8"
                >
                  <Link href="/report">
                    <Shield className="w-5 h-5 mr-2" />
                    Report an Incident
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 px-8 bg-transparent"
                >
                  <Link href="/map">
                    <MapPin className="w-5 h-5 mr-2" />
                    Explore Crime Map
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>100% Anonymous</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Secure & Encrypted</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>24/7 Monitoring</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=600&h=500&fit=crop"
                  alt="Community Safety and Security"
                  width={600}
                  height={500}
                  className="rounded-3xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/10 to-transparent rounded-3xl"></div>
              </div>

              {/* Floating Status Cards */}
              <div className="absolute -top-6 -right-6 z-20">
                <Card className="bg-background/90 backdrop-blur-xl border-emerald-200 dark:border-emerald-800 shadow-xl">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                      <div>
                        <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                          System Active
                        </div>
                        <div className="text-xs text-muted-foreground">Real-time monitoring</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="absolute -bottom-6 -left-6 z-20">
                <Card className="bg-background/90 backdrop-blur-xl border-green-200 dark:border-green-800 shadow-xl">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="text-sm font-semibold">Fully Anonymous</div>
                        <div className="text-xs text-muted-foreground">Privacy guaranteed</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-400/10 rounded-full blur-3xl -z-10 scale-110"></div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-12 border-t border-border/50">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-xl flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground">{stat.number}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800 px-4 py-2">
              <Eye className="w-4 h-4 mr-2" />
              Platform Capabilities
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold max-w-3xl mx-auto">
              Comprehensive tools for
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                {" "}
                community safety
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced features designed to enhance public safety through community engagement, real-time intelligence,
              and proactive crime prevention.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-background to-muted/50 hover:-translate-y-2"
              >
                <CardContent className="p-8 space-y-6">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                  <div className="flex items-center text-emerald-600 group-hover:text-emerald-700 transition-colors">
                    <span className="font-semibold">Learn more</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live Activity Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 border-teal-200 dark:border-teal-800 px-4 py-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse mr-2"></div>
                  Live Activity Dashboard
                </Badge>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                  Real-time insights from your
                  <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                    {" "}
                    community
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Monitor live incident reports, track resolution progress, and stay connected with community safety
                  initiatives happening in your neighborhood.
                </p>
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <Card
                    key={index}
                    className="bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-300 hover:shadow-lg"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                          <div className="space-y-1">
                            <div className="font-semibold text-foreground">{activity.type}</div>
                            <div className="text-sm text-muted-foreground">
                              {activity.location} • {activity.time}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getSeverityColor(activity.severity)}>{activity.severity}</Badge>
                          <Badge variant="outline">{activity.status}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full bg-transparent hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
              >
                View Complete Activity Feed
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=500&fit=crop"
                alt="Community Safety Dashboard"
                width={600}
                height={500}
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-600/10 to-transparent rounded-3xl"></div>

              {/* Floating Alert */}
              <div className="absolute top-6 right-6">
                <Card className="bg-background/95 backdrop-blur-xl shadow-xl animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      <div>
                        <div className="text-sm font-semibold">New Alert</div>
                        <div className="text-xs text-muted-foreground">Downtown area</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Ready to enhance your community's
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                {" "}
                safety?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Join thousands of residents, community leaders, and law enforcement professionals who trust CRISP to keep
              their neighborhoods safe and informed.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8"
            >
              <Link href="/report">
                <Shield className="w-5 h-5 mr-2" />
                Start Reporting Today
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 px-8 bg-transparent"
            >
              <Link href="/map">
                <MapPin className="w-5 h-5 mr-2" />
                Explore the Platform
              </Link>
            </Button>
          </div>

          <div className="pt-8 space-y-4">
            <p className="text-sm text-muted-foreground">
              Trusted by 850+ communities worldwide • 100% anonymous reporting • Enterprise-grade security
            </p>
            <div className="flex justify-center space-x-8 text-xs text-muted-foreground">
              <span>✓ GDPR Compliant</span>
              <span>✓ SOC 2 Certified</span>
              <span>✓ 99.9% Uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
                    CRISP
                  </span>
                  <div className="text-xs text-muted-foreground -mt-1">Crime Intelligence Platform</div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                Empowering communities worldwide with advanced crime reporting, real-time intelligence, and
                collaborative safety solutions.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm" className="w-10 h-10 p-0 bg-transparent">
                  <Globe className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-10 h-10 p-0 bg-transparent">
                  <Mail className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-10 h-10 p-0 bg-transparent">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Platform</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <Link href="/report" className="hover:text-emerald-600 transition-colors">
                    Report Crime
                  </Link>
                </div>
                <div>
                  <Link href="/map" className="hover:text-emerald-600 transition-colors">
                    Crime Map
                  </Link>
                </div>
                <div>
                  <Link href="/alerts" className="hover:text-emerald-600 transition-colors">
                    Safety Alerts
                  </Link>
                </div>
                <div>
                  <Link href="/safety" className="hover:text-emerald-600 transition-colors">
                    Community Hub
                  </Link>
                </div>
                <div>
                  <Link href="/admin" className="hover:text-emerald-600 transition-colors">
                    Analytics
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Resources</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <Link href="/safety" className="hover:text-emerald-600 transition-colors">
                    Safety Guidelines
                  </Link>
                </div>
                <div>
                  <a href="#" className="hover:text-emerald-600 transition-colors">
                    Help Center
                  </a>
                </div>
                <div>
                  <a href="#" className="hover:text-emerald-600 transition-colors">
                    API Documentation
                  </a>
                </div>
                <div>
                  <Link href="/safety" className="hover:text-emerald-600 transition-colors">
                    Training Materials
                  </Link>
                </div>
                <div>
                  <Link href="/safety" className="hover:text-emerald-600 transition-colors">
                    Best Practices
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Legal & Support</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <a href="#" className="hover:text-emerald-600 transition-colors">
                    Privacy Policy
                  </a>
                </div>
                <div>
                  <a href="#" className="hover:text-emerald-600 transition-colors">
                    Terms of Service
                  </a>
                </div>
                <div>
                  <a href="#" className="hover:text-emerald-600 transition-colors">
                    Data Protection
                  </a>
                </div>
                <div>
                  <a href="#" className="hover:text-emerald-600 transition-colors">
                    Contact Support
                  </a>
                </div>
                <div>
                  <Link href="/safety" className="hover:text-emerald-600 transition-colors">
                    Emergency Contacts
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              &copy; 2024 CRISP Platform. All rights reserved. Building safer communities through technology.
            </p>
            <div className="flex items-center space-x-6 text-xs text-muted-foreground">
              <span>🔒 Enterprise Security</span>
              <span>🌍 Global Coverage</span>
              <span>⚡ 24/7 Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
