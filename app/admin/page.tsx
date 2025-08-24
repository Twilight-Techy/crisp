"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  Clock,
  Search,
  Filter,
  FileText,
  UserPlus,
  UserCog,
  Settings,
  LogOut,
  CheckCircle,
  Eye,
  ClipboardList,
  List,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Report = {
  id: string;
  title?: string;
  type: string;
  location: string;
  description: string;
  status: "RECEIVED" | "UNDER_INVESTIGATION" | "RESOLVED" | string;
  reportedAt: string;
  resolvedAt?: string | null;
  reporterName?: string | null;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10; // show 10 reports at a time

  const statusLabels: Record<string, string> = {
    RECEIVED: "Received",
    UNDER_INVESTIGATION: "Under Investigation",
    RESOLVED: "Resolved",
  };

  const statusUiToEnum: Record<string, string | undefined> = {
    "pending-review": "RECEIVED",
    "in-progress": "UNDER_INVESTIGATION",
    "resolved": "RESOLVED",
    "closed": "RESOLVED", // map closed -> resolved (adjust if you want different)
    all: undefined,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RECEIVED":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "UNDER_INVESTIGATION":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      case "RESOLVED":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  useEffect(() => {
    // whenever filter/status/page change, fetch server-side (page reset handled in handlers)
    fetchReports(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter, selectedStatus, page]);

  async function fetchReports(pageToFetch = 1) {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (selectedFilter !== "all") qs.set("type", selectedFilter);
      const mappedStatus = statusUiToEnum[selectedStatus];
      if (mappedStatus) qs.set("status", mappedStatus);
      if (searchQuery) qs.set("search", searchQuery);
      qs.set("limit", String(limit));
      qs.set("page", String(pageToFetch));

      const res = await fetch(`/api/admin/reports?${qs.toString()}`, { cache: 'no-store' });
      const data = await res.json();
      const incoming: Report[] = data.reports || [];
      const incomingTotal: number = data.total ?? 0;

      if (pageToFetch === 1) {
        // replace
        setReports(incoming);
      } else {
        // append (avoid duplicates)
        setReports((prev) => {
          const ids = new Set(prev.map(r => r.id));
          const deduped = incoming.filter(r => !ids.has(r.id));
          return [...prev, ...deduped];
        });
      }
      setTotal(incomingTotal);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = async () => {
    // reset to page 1 and fetch — use effect by updating page
    if (page !== 1) {
      setPage(1);
      // effect will fetch page 1
    } else {
      // already at page 1 — trigger fetch directly
      fetchReports(1);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        // update locally for snappy UI
        setReports((prev) => prev.map(r => r.id === id ? { ...r, status: data.updated.status, resolvedAt: data.updated.resolvedAt } : r));
      } else {
        console.error("Update failed", data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Client-side fallback filtering (kept, but uses same mapping for status comparison)
  const mappedSelectedStatus = statusUiToEnum[selectedStatus];

  const filteredReports = reports.filter((report) => {
    const matchesFilter = selectedFilter === "all" || report.type.toLowerCase().includes(selectedFilter.toLowerCase())
    const matchesStatus = selectedStatus === "all" || report.status === mappedSelectedStatus
    const matchesSearch =
      searchQuery === "" ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reporterName?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesStatus && matchesSearch
  })

  const handleLogout = () => {
    localStorage.removeItem("crisp_admin_auth")
    router.push("/admin/login")
  }

  const handleLoadMore = () => {
    // only load more if we don't already have all reports
    if (reports.length >= total) return;
    setPage(prev => prev + 1);
  }

  const formatTimestamp = (iso?: string) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    } catch {
      return iso;
    }
  }

  const canLoadMore = reports.length < total;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30 pt-16">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-lg text-muted-foreground">Manage reports, users, and system settings.</p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                <FileText className="w-10 h-10 text-emerald-600" />
                <h3 className="font-semibold text-lg">New Report</h3>
                <p className="text-sm text-muted-foreground">Submit a new incident report.</p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                >
                  <Link href="/report">Create Report</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                <UserPlus className="w-10 h-10 text-blue-600" />
                <h3 className="font-semibold text-lg">Add Moderator</h3>
                <p className="text-sm text-muted-foreground">Grant access to new team members.</p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Link href="/admin/moderators/add">Add Moderator</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                <UserCog className="w-10 h-10 text-purple-600" />
                <h3 className="font-semibold text-lg">Manage Moderators</h3>
                <p className="text-sm text-muted-foreground">Edit or remove existing moderators.</p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  <Link href="/admin/moderators">Manage Moderators</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                <Settings className="w-10 h-10 text-gray-600" />
                <h3 className="font-semibold text-lg">System Settings</h3>
                <p className="text-sm text-muted-foreground">Configure application-wide parameters.</p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700"
                >
                  <Link href="/admin/settings">System Settings</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Reports Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <ClipboardList className="w-6 h-6 text-emerald-600" />
              <span>Recent Reports</span>
            </h2>

            {/* Filters and Search */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reports..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                    />
                  </div>
                  <Select value={selectedFilter} onValueChange={(val) => { setSelectedFilter(val); setPage(1); }}>
                    <SelectTrigger className="w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Suspicious activity">Suspicious Activity</SelectItem>
                      <SelectItem value="Vandalism">Vandalism</SelectItem>
                      <SelectItem value="Theft">Theft</SelectItem>
                      <SelectItem value="Noise complaint">Noise Complaint</SelectItem>
                      <SelectItem value="missing person">Missing Person</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={(val) => { setSelectedStatus(val); setPage(1); }}>
                    <SelectTrigger className="w-40">
                      <List className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending-review">Pending Review</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Reports List */}
            <div className="space-y-4">
              {filteredReports.length === 0 ? (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6 text-center text-muted-foreground">
                    No reports found matching your criteria.
                  </CardContent>
                </Card>
              ) : (
                filteredReports.map((report) => (
                  <Card key={report.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Report Header */}
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(report.status)}>
                                {statusLabels[report.status as keyof typeof statusLabels] ?? report.status}
                              </Badge>
                            </div>
                            <h3 className="text-lg font-semibold">{report.type}</h3>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimestamp(report.reportedAt)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Report Content */}
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{report.location}</span>
                            <span>•</span>
                            <span>Reported by: {report.reporterName || "Anonymous"}</span>
                          </div>
                          <p className="text-foreground leading-relaxed line-clamp-2">{report.description}</p>
                        </div>

                        {/* Report Actions */}
                        <div className="flex items-center justify-end pt-2 border-t border-border/50 space-x-2">
                          <Button asChild variant="outline" size="sm" className="bg-transparent">
                            <Link href={`/admin/reports/${report.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              Review
                            </Link>
                          </Button>
                          <Button
                            asChild
                            size="sm"
                            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                          >
                            <Link href={`/admin/reports/${report.id}/action`}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Take Action
                            </Link>
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
                  {loading ? "Loading..." : canLoadMore ? "Load More Reports" : "No more reports"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
