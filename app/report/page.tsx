"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Shield,
  MapPin,
  Camera,
  ArrowLeft,
  ArrowRight,
  Upload,
  CheckCircle,
  AlertTriangle,
  Home,
  FileText,
  Phone,
  Mail,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function ReportPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    incidentType: "",
    location: "",
    address: "",
    description: "",
    dateTime: "",
    anonymous: true,
    contactMethod: "",
    contactInfo: "",
    evidence: [] as File[],
  })
  const [trackingCode, setTrackingCode] = useState("")

  const incidentTypes = [
    { value: "Theft", label: "Theft / Burglary", icon: "🏠" },
    { value: "Vandalism", label: "Vandalism", icon: "🎨" },
    { value: "Assault", label: "Assault / Violence", icon: "⚠️" },
    { value: "Drug", label: "Drug Activity", icon: "💊" },
    { value: "Suspicious", label: "Suspicious Activity", icon: "👁️" },
    { value: "Noise", label: "Noise Complaint", icon: "🔊" },
    { value: "Traffic", label: "Traffic Violation", icon: "🚗" },
    { value: "Other", label: "Other", icon: "📝" },
  ]

  const steps = [
    { number: 1, title: "Incident Type", description: "What happened?" },
    { number: 2, title: "Location", description: "Where did it occur?" },
    { number: 3, title: "Details", description: "Tell us more" },
    { number: 4, title: "Evidence", description: "Upload files (optional)" },
    { number: 5, title: "Contact", description: "How to reach you (optional)" },
  ]

  const handleNext = async () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    } else {
      // Prepare form data
      const body = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "evidence") {
          (value as File[]).forEach(file => body.append("evidence", file))
        } else {
          body.append(key, value as string)
        }
      })

      // Submit to API
      try {
        const res = await fetch("/api/report", {
          method: "POST",
          body,
        })

        const result = await res.json()
        if (result.success) {
          setTrackingCode(result.trackingCode)
          setCurrentStep(6)
        } else {
          alert("Failed to submit report")
        }
      } catch (err) {
        console.error(err)
        alert("An error occurred during submission.")
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData({ ...formData, evidence: [...formData.evidence, ...files] })
  }

  if (currentStep === 6) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30 pt-20">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-background to-green-50/50">
              <CardContent className="p-12 text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold text-foreground">Report Submitted Successfully</h1>
                  <p className="text-lg text-muted-foreground">
                    Thank you for helping make our community safer. Your report has been received and will be reviewed.
                  </p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-6 rounded-xl space-y-3">
                  <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">Your Tracking Code</h3>
                  <div className="text-2xl font-mono font-bold text-emerald-600">{trackingCode}</div>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    Save this code to track your report status
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-gradient-to-r from-emerald-600 to-green-600">
                    <Link href="/track">
                      <FileText className="w-4 h-4 mr-2" />
                      Track Report
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/">
                      <Home className="w-4 h-4 mr-2" />
                      Back to Home
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30">
      <Navbar />

      <div className="container mx-auto px-4 py-8 pt-20">
        {" "}
        {/* Added pt-20 here */}
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      currentStep >= step.number
                        ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-full h-1 mx-4 ${currentStep > step.number ? "bg-emerald-500" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold">{steps[currentStep - 1].title}</h2>
              <p className="text-muted-foreground">{steps[currentStep - 1].description}</p>
            </div>
          </div>

          {/* Form Content */}
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              {/* Step 1: Incident Type */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold">What type of incident would you like to report?</h3>
                    <p className="text-muted-foreground">Select the category that best describes the incident</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {incidentTypes.map((type) => (
                      <Card
                        key={type.value}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          formData.incidentType === type.value
                            ? "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => setFormData({ ...formData, incidentType: type.value })}
                      >
                        <CardContent className="p-6 flex items-center space-x-4">
                          <div className="text-2xl">{type.icon}</div>
                          <div>
                            <h4 className="font-semibold">{type.label}</h4>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Location */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold">Where did the incident occur?</h3>
                    <p className="text-muted-foreground">Provide the location details</p>
                  </div>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input
                          id="address"
                          placeholder="123 Main Street"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Neighborhood/Area</Label>
                        <Input
                          id="location"
                          placeholder="Downtown, Park District, etc."
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                      </div>
                    </div>
                    <Card className="bg-muted/30 border-dashed">
                      <CardContent className="p-6 text-center space-y-4">
                        <MapPin className="w-12 h-12 text-emerald-600 mx-auto" />
                        <div>
                          <h4 className="font-semibold">Interactive Map</h4>
                          <p className="text-sm text-muted-foreground">
                            Click on the map to pinpoint the exact location (Feature coming soon)
                          </p>
                        </div>
                        <Button variant="outline" disabled>
                          <MapPin className="w-4 h-4 mr-2" />
                          Use Map Picker
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Step 3: Details */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold">Tell us what happened</h3>
                    <p className="text-muted-foreground">Provide as much detail as you feel comfortable sharing</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="datetime">When did this occur?</Label>
                      <Input
                        id="datetime"
                        type="datetime-local"
                        value={formData.dateTime}
                        onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description of the incident</Label>
                      <Textarea
                        id="description"
                        placeholder="Please describe what happened, including any relevant details about people, vehicles, or Other important information..."
                        rows={6}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                    <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                      <CardContent className="p-4 flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-amber-800 dark:text-amber-200">Privacy Notice</p>
                          <p className="text-amber-700 dark:text-amber-300">
                            Do not include personal information that could identify you unless you choose to provide
                            contact details in the next steps.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Step 4: Evidence */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold">Upload evidence (optional)</h3>
                    <p className="text-muted-foreground">Photos, videos, or documents that support your report</p>
                  </div>
                  <div className="space-y-4">
                    <Card className="border-dashed border-2 border-muted-foreground/25">
                      <CardContent className="p-8 text-center space-y-4">
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                        <div>
                          <h4 className="font-semibold">Drag and drop files here</h4>
                          <p className="text-sm text-muted-foreground">or click to browse (Max 10MB per file)</p>
                        </div>
                        <Input
                          type="file"
                          multiple
                          accept="image/*,video/*,.pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <Button variant="outline" asChild>
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <Camera className="w-4 h-4 mr-2" />
                            Choose Files
                          </label>
                        </Button>
                      </CardContent>
                    </Card>
                    {formData.evidence.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold">Uploaded Files</h4>
                        {formData.evidence.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Camera className="w-4 h-4 text-emerald-600" />
                              <span className="text-sm">{file.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newFiles = formData.evidence.filter((_, i) => i !== index)
                                setFormData({ ...formData, evidence: newFiles })
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Contact */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold">Contact information (optional)</h3>
                    <p className="text-muted-foreground">Provide contact details if you want updates on your report</p>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="anonymous"
                        checked={formData.anonymous}
                        onCheckedChange={(checked) => setFormData({ ...formData, anonymous: checked as boolean })}
                      />
                      <Label htmlFor="anonymous" className="text-sm">
                        Keep this report completely anonymous (recommended)
                      </Label>
                    </div>
                    {!formData.anonymous && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Preferred contact method</Label>
                          <Select
                            value={formData.contactMethod}
                            onValueChange={(value) => setFormData({ ...formData, contactMethod: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select contact method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="phone">Phone</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {formData.contactMethod && (
                          <div className="space-y-2">
                            <Label htmlFor="contact-info">
                              {formData.contactMethod === "email" ? "Email Address" : "Phone Number"}
                            </Label>
                            <div className="relative">
                              {formData.contactMethod === "email" ? (
                                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                              ) : (
                                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                              )}
                              <Input
                                id="contact-info"
                                type={formData.contactMethod === "email" ? "email" : "tel"}
                                placeholder={
                                  formData.contactMethod === "email" ? "your@email.com" : "+1 (555) 123-4567"
                                }
                                className="pl-10"
                                value={formData.contactInfo}
                                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <Card className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800">
                      <CardContent className="p-4 flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-emerald-600 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-emerald-800 dark:text-emerald-200">Privacy Guarantee</p>
                          <p className="text-emerald-700 dark:text-emerald-300">
                            Your contact information will only be used to provide updates on your report and will never
                            be shared with third parties.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                >
                  {currentStep === 5 ? "Submit Report" : "Next"}
                  {currentStep < 5 && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
