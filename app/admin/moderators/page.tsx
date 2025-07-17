"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, PlusCircle, Edit, Trash2, Mail, Phone, MapPin, Shield, User } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function ManageModeratorsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for moderators
  const [moderators, setModerators] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.j@crisp.com",
      role: "Moderator",
      contact: "(555) 111-2222",
      area: "Downtown District",
      status: "Active",
    },
    {
      id: 2,
      name: "Bob Williams",
      email: "bob.w@crisp.com",
      role: "Analyst",
      contact: "(555) 333-4444",
      area: "North Sector",
      status: "Active",
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie.b@crisp.com",
      role: "Administrator",
      contact: "(555) 555-6666",
      area: "All",
      status: "Active",
    },
    {
      id: 4,
      name: "Diana Prince",
      email: "diana.p@crisp.com",
      role: "Moderator",
      contact: "(555) 777-8888",
      area: "South Sector",
      status: "Inactive",
    },
  ])

  const filteredModerators = moderators.filter(
    (mod) =>
      mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.area.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      case "Inactive":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const handleDeleteModerator = (id: number) => {
    if (window.confirm("Are you sure you want to delete this moderator? This action cannot be undone.")) {
      setModerators(moderators.filter((mod) => mod.id !== id))
      alert("Moderator deleted successfully! (Demo)")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30 pt-16">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Button variant="outline" asChild className="mb-4 bg-transparent">
                <Link href="/admin">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-3xl font-bold">Manage Moderators</h1>
              <p className="text-lg text-muted-foreground">View, edit, and remove CRISP team members.</p>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
            >
              <Link href="/admin/moderators/add">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add New Moderator
              </Link>
            </Button>
          </div>

          {/* Search Bar */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search moderators by name, email, role, or area..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Moderators List */}
          <div className="space-y-4">
            {filteredModerators.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center text-muted-foreground">
                  No moderators found matching your criteria.
                </CardContent>
              </Card>
            ) : (
              filteredModerators.map((mod) => (
                <Card key={mod.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <User className="w-6 h-6 text-emerald-600" />
                          <div>
                            <h3 className="text-lg font-semibold">{mod.name}</h3>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              <span>{mod.email}</span>
                              <Phone className="w-3 h-3 ml-2" />
                              <span>{mod.contact}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Badge
                            variant="outline"
                            className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          >
                            <Shield className="w-3 h-3 mr-1" />
                            {mod.role}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            <MapPin className="w-3 h-3 mr-1" />
                            {mod.area}
                          </Badge>
                          <Badge className={getStatusColor(mod.status)}>{mod.status}</Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button asChild variant="outline" size="sm" className="bg-transparent">
                          <Link href={`/admin/moderators/${mod.id}`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Link>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteModerator(mod.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Pagination/Load More */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Button variant="outline" className="bg-transparent">
                Load More Moderators
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
