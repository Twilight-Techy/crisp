"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Filter, Clock, User, Mail, CheckCircle, Reply, Archive } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function FeedbackPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [replyContent, setReplyContent] = useState("")
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Mock data for feedback
  const [feedbackItems, setFeedbackItems] = useState([
    {
      id: 1,
      type: "Bug Report",
      subject: "Map not loading correctly on mobile",
      message: "The interactive map page shows a blank screen when accessed from my iPhone 13. Works fine on desktop.",
      user: "Mobile User",
      email: "mobileuser@example.com",
      timestamp: "2024-07-14T09:00:00Z",
      status: "New",
      replies: [],
    },
    {
      id: 2,
      type: "Feature Request",
      subject: "Ability to subscribe to alerts via email",
      message:
        "It would be great if I could get email notifications for new alerts in my area without needing to check the website constantly.",
      user: "Community Member",
      email: "community@example.com",
      timestamp: "2024-07-13T14:00:00Z",
      status: "Open",
      replies: [
        {
          by: "Admin",
          timestamp: "2024-07-13T16:00:00Z",
          content: "Thank you for your suggestion! We are actively considering email subscriptions for future updates.",
        },
      ],
    },
    {
      id: 3,
      type: "General Inquiry",
      subject: "Question about anonymous reporting",
      message: "How truly anonymous is the reporting process? Are there any ways my identity could be traced?",
      user: "Concerned Citizen",
      email: "citizen@example.com",
      timestamp: "2024-07-12T11:00:00Z",
      status: "Resolved",
      replies: [
        {
          by: "Admin",
          timestamp: "2024-07-12T13:00:00Z",
          content:
            "Our anonymous reporting system is designed with privacy in mind. We do not collect personal identifying information unless explicitly provided. For more details, please refer to our privacy policy.",
        },
      ],
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      case "Open":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "Resolved":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      case "Archived":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const handleReply = (feedbackId: number) => {
    setSelectedFeedbackId(feedbackId)
    setReplyContent("") // Clear previous reply content
  }

  const sendReply = async () => {
    if (!selectedFeedbackId || !replyContent.trim()) {
      alert("Reply content cannot be empty.")
      return
    }

    setIsLoading(true)
    setSuccessMessage("")
    setErrorMessage("")

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setFeedbackItems(
      feedbackItems.map((item) =>
        item.id === selectedFeedbackId
          ? {
              ...item,
              status: "Open", // Mark as open if replying
              replies: [
                ...item.replies,
                {
                  by: "Admin",
                  timestamp: new Date().toISOString(),
                  content: replyContent,
                },
              ],
            }
          : item,
      ),
    )
    setSuccessMessage("Reply sent successfully! (Demo)")
    setReplyContent("")
    setSelectedFeedbackId(null)
    setIsLoading(false)
  }

  const handleMarkAsResolved = (id: number) => {
    setFeedbackItems(feedbackItems.map((item) => (item.id === id ? { ...item, status: "Resolved" } : item)))
    alert("Feedback marked as resolved! (Demo)")
  }

  const handleArchive = (id: number) => {
    setFeedbackItems(feedbackItems.map((item) => (item.id === id ? { ...item, status: "Archived" } : item)))
    alert("Feedback archived! (Demo)")
  }

  const filteredFeedback = feedbackItems.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || item.status === filterStatus
    const matchesType = filterType === "all" || item.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

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
              <h1 className="text-3xl font-bold">Feedback & Support</h1>
              <p className="text-lg text-muted-foreground">Review user feedback, bug reports, and feature requests.</p>
            </div>
          </div>

          {/* Filters and Search */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search feedback..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Bug Report">Bug Report</SelectItem>
                    <SelectItem value="Feature Request">Feature Request</SelectItem>
                    <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Feedback List */}
          <div className="space-y-4">
            {filteredFeedback.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center text-muted-foreground">
                  No feedback found matching your criteria.
                </CardContent>
              </Card>
            ) : (
              filteredFeedback.map((item) => (
                <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Feedback Header */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{item.type}</Badge>
                            <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                          </div>
                          <h3 className="text-lg font-semibold">{item.subject}</h3>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimestamp(item.timestamp)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Feedback Content */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>{item.user}</span>
                          <Mail className="w-4 h-4 ml-2" />
                          <span>{item.email}</span>
                        </div>
                        <p className="text-foreground leading-relaxed">{item.message}</p>
                      </div>

                      {/* Replies */}
                      {item.replies.length > 0 && (
                        <div className="space-y-3 border-t border-border/50 pt-4 mt-4">
                          <h4 className="font-semibold text-sm">Replies:</h4>
                          {item.replies.map((reply, index) => (
                            <div key={index} className="bg-muted/30 p-3 rounded-md text-sm">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium">{reply.by}</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatTimestamp(reply.timestamp)}
                                </span>
                              </div>
                              <p className="text-muted-foreground">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Form */}
                      {selectedFeedbackId === item.id && (
                        <div className="space-y-3 border-t border-border/50 pt-4 mt-4">
                          <div htmlFor={`reply-content-${item.id}`}>Your Reply</div>
                          <Textarea
                            id={`reply-content-${item.id}`}
                            placeholder="Type your reply here..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="min-h-[80px]"
                          />
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-transparent"
                              onClick={() => setSelectedFeedbackId(null)}
                            >
                              Cancel
                            </Button>
                            <Button size="sm" onClick={sendReply} disabled={isLoading || !replyContent.trim()}>
                              {isLoading ? "Sending..." : "Send Reply"}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Feedback Actions */}
                      <div className="flex items-center justify-end pt-2 border-t border-border/50 space-x-2">
                        {item.status !== "Archived" && (
                          <>
                            {item.status !== "Resolved" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-transparent"
                                onClick={() => handleMarkAsResolved(item.id)}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark as Resolved
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-transparent"
                              onClick={() => handleReply(item.id)}
                            >
                              <Reply className="w-4 h-4 mr-2" />
                              Reply
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-transparent"
                              onClick={() => handleArchive(item.id)}
                            >
                              <Archive className="w-4 h-4 mr-2" />
                              Archive
                            </Button>
                          </>
                        )}
                        {item.status === "Archived" && (
                          <Badge
                            variant="outline"
                            className="bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
                          >
                            Archived
                          </Badge>
                        )}
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
                Load More Feedback
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
