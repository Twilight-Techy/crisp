"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, UserCog, CheckCircle, Mail, Phone, MapPin, Shield, User, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"

export default function ModeratorActionPage() {
  const params = useParams()
  const { id } = params
  const router = useRouter()

  // Mock data for a single moderator
  const moderator = {
    id: Number(id),
    name: "Alice Johnson",
    email: "alice.j@crisp.com",
    role: "Moderator",
    contact: "(555) 111-2222",
    area: "Downtown District",
    status: "Active",
  }

  const [actionType, setActionType] = useState("change-role")
  const [newRole, setNewRole] = useState(moderator.role)
  const [newStatus, setNewStatus] = useState(moderator.status)
  const [actionReason, setActionReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  if (!moderator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30 pt-16">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Moderator Not Found</h1>
            <p className="text-muted-foreground mb-8">The moderator you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href={`/admin/moderators/${id}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Moderator Details
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handlePerformAction = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccessMessage("")
    setErrorMessage("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real app, send data to backend based on actionType
    console.log("Performing action:", {
      moderatorId: moderator.id,
      actionType,
      newRole: actionType === "change-role" ? newRole : undefined,
      newStatus: actionType === "change-status" ? newStatus : undefined,
      actionReason,
    })

    if (Math.random() > 0.2) {
      // Simulate 80% success rate
      setSuccessMessage(`Action '${actionType}' performed successfully! (Demo)`)
      // Update local state for demo purposes
      if (actionType === "change-role") {
        moderator.role = newRole
      } else if (actionType === "change-status") {
        moderator.status = newStatus
      }
      setActionReason("")
    } else {
      setErrorMessage("Failed to perform action. Please try again. (Demo Error)")
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
                <Link href={`/admin/moderators/${id}`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Moderator Details
                </Link>
              </Button>
              <h1 className="text-3xl font-bold">Perform Action on {moderator.name}</h1>
              <p className="text-lg text-muted-foreground">
                Manage roles, status, or other actions for this moderator.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Moderator Summary */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-emerald-600" />
                    <span>Moderator Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{moderator.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{moderator.contact}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span>Role: {moderator.role}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>Area: {moderator.area}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-muted-foreground" />
                    <span>Status: {moderator.status}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Form */}
            <Card className="lg:col-span-2 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserCog className="w-5 h-5 text-emerald-600" />
                  <span>Select Action</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePerformAction} className="space-y-6">
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
                    <Label htmlFor="actionType">Action Type</Label>
                    <Select value={actionType} onValueChange={setActionType} required>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="change-role">Change Role</SelectItem>
                        <SelectItem value="change-status">Change Status (Active/Inactive)</SelectItem>
                        <SelectItem value="reset-password">Reset Password (Admin Only)</SelectItem>
                        <SelectItem value="suspend-account">Suspend Account</SelectItem>
                        <SelectItem value="delete-account">Delete Account</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {actionType === "change-role" && (
                    <div className="space-y-2">
                      <Label htmlFor="newRole">New Role</Label>
                      <Select value={newRole} onValueChange={setNewRole} required>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select new role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Moderator">Moderator</SelectItem>
                          <SelectItem value="Administrator">Administrator</SelectItem>
                          <SelectItem value="Analyst">Analyst</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {actionType === "change-status" && (
                    <div className="space-y-2">
                      <Label htmlFor="newStatus">New Status</Label>
                      <Select value={newStatus} onValueChange={setNewStatus} required>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select new status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="actionReason">Reason for Action</Label>
                    <Textarea
                      id="actionReason"
                      placeholder="Provide a brief reason for this action..."
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" type="button" asChild className="bg-transparent">
                      <Link href={`/admin/moderators/${id}`}>Cancel</Link>
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Performing Action..." : "Perform Action"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
