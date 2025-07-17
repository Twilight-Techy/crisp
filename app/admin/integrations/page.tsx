"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Plug,
  CheckCircle,
  AlertTriangle,
  Globe,
  Mail,
  MessageSquare,
  Cloud,
  Database,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function IntegrationsPage() {
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState("YOUR_GOOGLE_MAPS_API_KEY")
  const [smsGatewayEnabled, setSmsGatewayEnabled] = useState(true)
  const [smsApiKey, setSmsApiKey] = useState("YOUR_SMS_GATEWAY_API_KEY")
  const [emailServiceEnabled, setEmailServiceEnabled] = useState(true)
  const [emailApiKey, setEmailApiKey] = useState("YOUR_EMAIL_SERVICE_API_KEY")
  const [cloudStorageEnabled, setCloudStorageEnabled] = useState(true)
  const [cloudStorageBucket, setCloudStorageBucket] = useState("crisp-attachments-prod")
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSaveIntegrations = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccessMessage("")
    setErrorMessage("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real app, send data to backend
    console.log({
      googleMapsApiKey,
      smsGatewayEnabled,
      smsApiKey,
      emailServiceEnabled,
      emailApiKey,
      cloudStorageEnabled,
      cloudStorageBucket,
    })

    if (Math.random() > 0.1) {
      // Simulate 90% success rate
      setSuccessMessage("Integration settings updated successfully! (Demo)")
    } else {
      setErrorMessage("Failed to update integration settings. Please try again. (Demo Error)")
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
              <h1 className="text-3xl font-bold">API Integrations</h1>
              <p className="text-lg text-muted-foreground">Manage connections with third-party services.</p>
            </div>
          </div>

          {/* Integrations Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plug className="w-5 h-5 text-emerald-600" />
                <span>Configure Integrations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveIntegrations} className="space-y-6">
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

                {/* Google Maps */}
                <div className="space-y-2">
                  <Label htmlFor="googleMapsApiKey">Google Maps API Key</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="googleMapsApiKey"
                      type="password"
                      placeholder="Enter Google Maps API Key"
                      value={googleMapsApiKey}
                      onChange={(e) => setGoogleMapsApiKey(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Required for interactive map functionalities.</p>
                </div>

                {/* SMS Gateway */}
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="smsGatewayEnabled">Enable SMS Gateway</Label>
                  <Switch id="smsGatewayEnabled" checked={smsGatewayEnabled} onCheckedChange={setSmsGatewayEnabled} />
                  <span className="text-sm text-muted-foreground">{smsGatewayEnabled ? "Enabled" : "Disabled"}</span>
                </div>
                {smsGatewayEnabled && (
                  <div className="space-y-2 pl-8">
                    <Label htmlFor="smsApiKey">SMS Gateway API Key</Label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="smsApiKey"
                        type="password"
                        placeholder="Enter SMS Gateway API Key"
                        value={smsApiKey}
                        onChange={(e) => setSmsApiKey(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">Used for sending text message alerts.</p>
                  </div>
                )}

                {/* Email Service */}
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="emailServiceEnabled">Enable Email Service</Label>
                  <Switch
                    id="emailServiceEnabled"
                    checked={emailServiceEnabled}
                    onCheckedChange={setEmailServiceEnabled}
                  />
                  <span className="text-sm text-muted-foreground">{emailServiceEnabled ? "Enabled" : "Disabled"}</span>
                </div>
                {emailServiceEnabled && (
                  <div className="space-y-2 pl-8">
                    <Label htmlFor="emailApiKey">Email Service API Key</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="emailApiKey"
                        type="password"
                        placeholder="Enter Email Service API Key"
                        value={emailApiKey}
                        onChange={(e) => setEmailApiKey(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">Used for sending email notifications and reports.</p>
                  </div>
                )}

                {/* Cloud Storage */}
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="cloudStorageEnabled">Enable Cloud Storage</Label>
                  <Switch
                    id="cloudStorageEnabled"
                    checked={cloudStorageEnabled}
                    onCheckedChange={setCloudStorageEnabled}
                  />
                  <span className="text-sm text-muted-foreground">{cloudStorageEnabled ? "Enabled" : "Disabled"}</span>
                </div>
                {cloudStorageEnabled && (
                  <div className="space-y-2 pl-8">
                    <Label htmlFor="cloudStorageBucket">Cloud Storage Bucket Name</Label>
                    <div className="relative">
                      <Cloud className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="cloudStorageBucket"
                        placeholder="e.g., crisp-attachments-prod"
                        value={cloudStorageBucket}
                        onChange={(e) => setCloudStorageBucket(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Bucket for storing report attachments (images, videos).
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving Integrations..." : "Save Integrations"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Other Integration Sections (Placeholders) */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  <span>Database Connections</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Configure database connection strings.</p>
                <Button asChild variant="outline" className="mt-4 w-full bg-transparent">
                  <Link href="/admin/integrations/database">Manage Database Connections</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-orange-600" />
                  <span>Authentication Providers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Set up external authentication (e.g., OAuth).</p>
                <Button asChild variant="outline" className="mt-4 w-full bg-transparent">
                  <Link href="/admin/integrations/auth">Configure Auth Providers</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
