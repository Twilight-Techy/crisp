"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, UserCog, Mail, Phone, MapPin, Shield, User, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"

export default function EditModeratorPage() {
  const params = useParams()
  const { id } = params
  const router = useRouter()

  // Mock data for a single moderator
  const [moderator, setModerator] = useState({
    id: Number(id),
    name: "Alice Johnson",
    email: "alice.j@crisp.com",
    role: "Moderator",
    contact: "(555) 111-2222",
    area: "Downtown District",
    status: "Active",
  })

  const [fullName, setFullName] = useState(moderator.name)
  const [email, setEmail] = useState(moderator.email)
  const [role, setRole] = useState(moderator.role)
  const [contactNumber, setContactNumber] = useState(moderator.contact)
  const [assignedArea, setAssignedArea] = useState(moderator.area)
  const [isActive, setIsActive] = useState(moderator.status === "Active")
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    // In a real app, fetch moderator data based on ID
    // For demo, we use the mock data directly
    if (Number(id) !== moderator.id) {
      // Simulate fetching different moderator if ID changes
      setModerator({
        id: Number(id),
        name: `Moderator ${id}`,
        email: `mod${id}@crisp.com`,
        role: "Moderator",
        contact: "(555) 000-0000",
        area: "Unknown",
        status: "Active",
      })
    }
  }, [id, moderator.id])

  const handleUpdateModerator = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccessMessage("")
    setErrorMessage("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real app, send updated data to backend
    console.log({
      id: moderator.id,
      fullName,
      email,
      role,
      contactNumber,
      assignedArea,
      status: isActive ? "Active" : "Inactive",
    })

    if (Math.random() > 0.1) {
      // Simulate 90% success rate
      setSuccessMessage("Moderator updated successfully! (Demo)")
      setModerator({
        ...moderator,
        name: fullName,
        email,
        role,
        contact: contactNumber,
        area: assignedArea,
        status: isActive ? "Active" : "Inactive",
      })
    } else {
      setErrorMessage("Failed to update moderator. Please try again. (Demo Error)")
    }
    setIsLoading(false)
  }

  if (!moderator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30 pt-16">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Moderator Not Found</h1>
            <p className="text-muted-foreground mb-8">The moderator you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/admin/moderators">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Manage Moderators
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
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Button variant="outline" asChild className="mb-4 bg-transparent">
                <Link href="/admin/moderators">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Manage Moderators
                </Link>
              </Button>
              <h1 className="text-3xl font-bold">Edit Moderator: {moderator.name}</h1>
              <p className="text-lg text-muted-foreground">Update details for moderator #{moderator.id}</p>
            </div>
          </div>

          {/* Edit Moderator Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCog className="w-5 h-5 text-emerald-600" />
                <span>Moderator Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateModerator} className="space-y-6">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@crisp.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={role} onValueChange={setRole} required>
                      <SelectTrigger className="w-full">
                        <Shield className="w-4 h-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Moderator">Moderator</SelectItem>
                        <SelectItem value="Administrator">Administrator</SelectItem>
                        <SelectItem value="Analyst">Analyst</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number (Optional)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="contactNumber"
                        placeholder="(555) 123-4567"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignedArea">Assigned Area (Optional)</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="assignedArea"
                      placeholder="e.g., Downtown District, North Sector"
                      value={assignedArea}
                      onChange={(e) => setAssignedArea(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="status">Account Status</Label>
                  <Switch id="status" checked={isActive} onCheckedChange={setIsActive} />
                  <span className="text-sm text-muted-foreground">{isActive ? "Active" : "Inactive"}</span>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" type="button" asChild className="bg-transparent">
                    <Link href="/admin/moderators">Cancel</Link>
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
