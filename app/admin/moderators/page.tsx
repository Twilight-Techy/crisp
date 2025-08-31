"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, PlusCircle, Edit, Trash2, Mail, Phone, MapPin, Shield, User } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

type Moderator = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  contactNumber?: string | null;
  assignedArea?: string | null;
  createdAt?: string;
}

export default function ManageModeratorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [moderators, setModerators] = useState<Moderator[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState<number | null>(null)
  const mounted = useRef(true)

  const [page, setPage] = useState(1)
  const limit = 10

  useEffect(() => {
    mounted.current = true
    // initial load
    fetchModerators(1, false)
    return () => { mounted.current = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // debounce search: reset to page 1 and fetch fresh results
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1)
      fetchModerators(1, false)
    }, 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  async function fetchModerators(pageToFetch = 1, append = false) {
    setLoading(true)
    try {
      const qs = new URLSearchParams()
      if (searchQuery) qs.set("search", searchQuery)
      qs.set("limit", String(limit))
      qs.set("page", String(pageToFetch))

      const res = await fetch(`/api/admin/moderators?${qs.toString()}`, { cache: "no-store" })
      if (!res.ok) {
        console.error("Failed to fetch moderators", res.status)
        if (!append) setModerators([])
        setTotal(null)
        return
      }
      const data = await res.json()
      const incoming: Moderator[] = (data.moderators || []).map((m: any) => ({
        id: m.id,
        fullName: m.fullName,
        email: m.email,
        role: m.role === "ADMIN" ? "Administrator" : m.role === "ANALYST" ? "Analyst" : "Moderator",
        contactNumber: m.contactNumber ?? "",
        assignedArea: m.assignedArea ?? "",
        createdAt: m.createdAt,
      }))

      if (append) {
        setModerators((prev) => {
          const ids = new Set(prev.map((p) => p.id))
          const deduped = incoming.filter((i) => !ids.has(i.id))
          return [...prev, ...deduped]
        })
      } else {
        setModerators(incoming)
      }

      setTotal(typeof data.total === "number" ? data.total : null)
    } catch (err) {
      console.error("Failed to fetch moderators", err)
      if (!append) setModerators([])
      setTotal(null)
    } finally {
      if (mounted.current) setLoading(false)
    }
  }

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

  const handleDeleteModerator = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this moderator? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/admin/moderators/${id}`, { method: "DELETE" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        console.error("Delete failed", data)
        alert(data?.error || `Failed to delete moderator (status ${res.status})`)
        return
      }

      // remove locally
      setModerators((prev) => prev.filter((m) => m.id !== id))
      alert("Moderator deleted successfully.")
    } catch (err) {
      console.error("Delete failed", err)
      alert("Failed to delete moderator.")
    }
  }

  const handleLoadMore = () => {
    if (total !== null && moderators.length >= total) return
    const next = page + 1
    setPage(next)
    fetchModerators(next, true)
  }

  const canLoadMore = total !== null && moderators.length < total

  // client-side filtered view (keeps the UI responsive if API returns a broader set)
  const filteredModerators = moderators.filter((mod) =>
    mod.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mod.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mod.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (mod.assignedArea ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            {(!filteredModerators || filteredModerators.length === 0) ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center text-muted-foreground">
                  {loading ? "Loading moderators..." : "No moderators found matching your criteria."}
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
                            <h3 className="text-lg font-semibold">{mod.fullName}</h3>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              <span>{mod.email}</span>
                              <Phone className="w-3 h-3 ml-2" />
                              <span>{mod.contactNumber ?? "-"}</span>
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
                            {mod.assignedArea ?? "—"}
                          </Badge>
                          <Badge className={getStatusColor("Active")}>Active</Badge>
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
              <Button
                variant="outline"
                className="bg-transparent"
                onClick={handleLoadMore}
                disabled={!canLoadMore || loading}
              >
                {loading ? "Loading..." : canLoadMore ? "Load More Moderators" : "No more moderators"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
