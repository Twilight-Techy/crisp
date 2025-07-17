"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Settings,
  Bell,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Globe,
  Database,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function SystemSettingsPage() {
  const [notificationEmail, setNotificationEmail] = useState("alerts@crisp.com")
  const [defaultMapZoom, setDefaultMapZoom] = useState("12")
  const [incidentRetentionDays, setIncidentRetentionDays] = useState("365")
  const [enablePublicReporting, setEnablePublicReporting] = useState(true)
  const [welcomeMessage, setWelcomeMessage] = useState("Welcome to CRISP! Your community safety platform.")
  const [alertThreshold, setAlertThreshold] = useState("5")
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccessMessage("")
    setErrorMessage("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real app, send data to backend
    console.log({
      notificationEmail,
      defaultMapZoom,
      incidentRetentionDays,
      enablePublicReporting,
      welcomeMessage,
      alertThreshold,
    })

    if (Math.random() > 0.1) {
      // Simulate 90% success rate
      setSuccessMessage("System settings updated successfully! (Demo)")
    } else {
      setErrorMessage("Failed to update settings. Please try again. (Demo Error)")
    }
    setIsLoading(false)
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
                <Link href="/admin">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-3xl font-bold">System Settings</h1>
              <p className="text-lg text-muted-foreground">Configure core functionalities and parameters of CRISP.</p>
            </div>
          </div>

          {/* Settings Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-emerald-600" />
                <span>General Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSettings} className="space-y-6">
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
                  <Label htmlFor="notificationEmail">Notification Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="notificationEmail"
                      type="email"
                      placeholder="notifications@crisp.com"
                      value={notificationEmail}
                      onChange={(e) => setNotificationEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Email address for system-generated notifications.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage">Welcome Message (Homepage)</Label>
                  <Textarea
                    id="welcomeMessage"
                    placeholder="Enter the welcome message for the homepage..."
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    className="min-h-[80px]"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    This message will be displayed prominently on the landing page.
                  </p>
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="enablePublicReporting">Enable Public Incident Reporting</Label>
                  <Switch
                    id="enablePublicReporting"
                    checked={enablePublicReporting}
                    onCheckedChange={setEnablePublicReporting}
                  />
                  <span className="text-sm text-muted-foreground">
                    {enablePublicReporting ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground -mt-2">Allow anonymous users to submit incident reports.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultMapZoom">Default Map Zoom Level</Label>
                    <Select value={defaultMapZoom} onValueChange={setDefaultMapZoom} required>
                      <SelectTrigger className="w-full">
                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Select zoom level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8">Region (8)</SelectItem>
                        <SelectItem value="10">City (10)</SelectItem>
                        <SelectItem value="12">Neighborhood (12)</SelectItem>
                        <SelectItem value="14">Street (14)</SelectItem>
                        <SelectItem value="16">Building (16)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">Initial zoom level for the interactive map.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alertThreshold">High Alert Threshold</Label>
                    <div className="relative">
                      <Bell className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="alertThreshold"
                        type="number"
                        placeholder="5"
                        value={alertThreshold}
                        onChange={(e) => setAlertThreshold(e.target.value)}
                        className="pl-10"
                        min="1"
                        required
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Number of incidents in an area to trigger a high alert.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="incidentRetentionDays">Incident Data Retention (Days)</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="incidentRetentionDays"
                      type="number"
                      placeholder="365"
                      value={incidentRetentionDays}
                      onChange={(e) => setIncidentRetentionDays(e.target.value)}
                      className="pl-10"
                      min="30"
                      required
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Number of days to retain incident data before archiving or deletion.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving Settings..." : "Save Settings"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Other Settings Sections (Placeholders) */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span>Localization Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Manage language and regional formats.</p>
                <Button asChild variant="outline" className="mt-4 w-full bg-transparent">
                  <Link href="/admin/settings/localization">Configure Localization</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-purple-600" />
                  <span>Database Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Backup, restore, and optimize database.</p>
                <Button asChild variant="outline" className="mt-4 w-full bg-transparent">
                  <Link href="/admin/settings/database">Manage Database</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-orange-600" />
                  <span>Security & Audit Logs</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Review security logs and access controls.</p>
                <Button asChild variant="outline" className="mt-4 w-full bg-transparent">
                  <Link href="/admin/settings/security">Security Settings</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
