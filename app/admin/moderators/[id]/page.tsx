"use client"

import type React from "react"

import { useEffect, useState } from "react"
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

  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  // form state
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("Moderator") // friendly label
  const [contactNumber, setContactNumber] = useState("")
  const [assignedArea, setAssignedArea] = useState("")
  const [isActive, setIsActive] = useState(true) // UI-only (not persisted because schema lacks a status field)

  useEffect(() => {
    if (!id) return
    fetchModerator()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function fetchModerator() {
    setLoading(true)
    setErrorMessage("")
    try {
      const res = await fetch(`/api/admin/moderators/${id}`, { cache: "no-store" })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setErrorMessage(err?.error || `Failed to load (status ${res.status})`)
        setLoading(false)
        return
      }
      const data = await res.json()
      const admin = data?.admin
      if (!admin) {
        setErrorMessage("Moderator not found")
        setLoading(false)
        return
      }

      setFullName(admin.fullName ?? "")
      setEmail(admin.email ?? "")
      // map enum role -> friendly label
      const friendlyRole = admin.role === "ADMIN" ? "Administrator" : admin.role === "ANALYST" ? "Analyst" : "Moderator"
      setRole(friendlyRole)
      setContactNumber(admin.contactNumber ?? "")
      setAssignedArea(admin.assignedArea ?? "")
      // keep isActive true by default (schema has no field)
      setIsActive(true)
    } catch (err) {
      console.error("Failed to fetch moderator", err)
      setErrorMessage("Failed to fetch moderator")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateModerator = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccessMessage("")
    setErrorMessage("")

    // basic client validation
    if (!fullName.trim() || !email.trim()) {
      setErrorMessage("Full name and email are required.")
      setIsSubmitting(false)
      return
    }

    try {
      // map friendly role -> server enum-friendly value (server maps strings but do this for clarity)
      const payloadRole = role === "Administrator" ? "Administrator" : role === "Analyst" ? "Analyst" : "Moderator"

      const payload: any = {
        fullName: fullName.trim(),
        email: email.trim(),
        role: payloadRole,
        contactNumber: contactNumber || null,
        assignedArea: assignedArea || null,
        // NOTE: isActive is a UI-only switch (not persisted because DB doesn't have it). If you add isActive to schema later, include it here.
      }

      const res = await fetch(`/api/admin/moderators/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setErrorMessage(data?.error || `Failed to update moderator (status ${res.status})`)
        setIsSubmitting(false)
        return
      }

      setSuccessMessage("Moderator updated successfully.")
      // keep the UI state updated
      // optionally redirect back to list after a short delay
      setTimeout(() => {
        router.push("/admin/moderators")
      }, 800)
    } catch (err) {
      console.error("Update failed", err)
      setErrorMessage("Failed to update moderator.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30 pt-16">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-muted-foreground">Loading moderator...</p>
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
              <h1 className="text-3xl font-bold">Edit Moderator</h1>
              <p className="text-lg text-muted-foreground">Update details for moderator #{id}</p>
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
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Save Changes"}
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
