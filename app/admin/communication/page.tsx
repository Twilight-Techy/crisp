"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Mail, Users, Send, CheckCircle, AlertTriangle, List, Clock } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function CommunicationPage() {
  const [messageType, setMessageType] = useState("email")
  const [recipientGroup, setRecipientGroup] = useState("all-users")
  const [subject, setSubject] = useState("")
  const [messageContent, setMessageContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Mock data for message history
  const [messageHistory, setMessageHistory] = useState([
    {
      id: 1,
      type: "Email",
      recipients: "All Users",
      subject: "CRISP Community Update: New Safety Tips Available",
      timestamp: "2024-07-10T10:00:00Z",
      status: "Sent",
    },
    {
      id: 2,
      type: "SMS",
      recipients: "Downtown Residents",
      subject: "Alert: Increased Police Presence",
      timestamp: "2024-07-08T15:30:00Z",
      status: "Sent",
    },
    {
      id: 3,
      type: "Email",
      recipients: "Moderators",
      subject: "New Report Assignment: #CRISP-0015",
      timestamp: "2024-07-07T09:00:00Z",
      status: "Sent",
    },
  ])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccessMessage("")
    setErrorMessage("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real app, send data to backend
    console.log({ messageType, recipientGroup, subject, messageContent })

    if (Math.random() > 0.2) {
      // Simulate 80% success rate
      setSuccessMessage("Message sent successfully! (Demo)")
      const newId = messageHistory.length > 0 ? Math.max(...messageHistory.map((m) => m.id)) + 1 : 1
      setMessageHistory([
        {
          id: newId,
          type: messageType === "email" ? "Email" : "SMS",
          recipients: recipientGroup === "all-users" ? "All Users" : "Moderators",
          subject: subject,
          timestamp: new Date().toISOString(),
          status: "Sent",
        },
        ...messageHistory,
      ])
      setSubject("")
      setMessageContent("")
    } else {
      setErrorMessage("Failed to send message. Please try again. (Demo Error)")
    }
    setIsLoading(false)
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
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
              <h1 className="text-3xl font-bold">Communication Tools</h1>
              <p className="text-lg text-muted-foreground">
                Send announcements, alerts, and messages to users and moderators.
              </p>
            </div>
          </div>

          {/* Send Message Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="w-5 h-5 text-emerald-600" />
                <span>Send New Message</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendMessage} className="space-y-6">
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
                    <Label htmlFor="messageType">Message Type</Label>
                    <Select value={messageType} onValueChange={setMessageType} required>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS (Text Message)</SelectItem>
                        {/* <SelectItem value="in-app">In-App Notification</SelectItem> */}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipientGroup">Recipient Group</Label>
                    <Select value={recipientGroup} onValueChange={setRecipientGroup} required>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-users">All Public Users</SelectItem>
                        <SelectItem value="moderators">All Moderators</SelectItem>
                        {/* <SelectItem value="specific-users">Specific Users</SelectItem> */}
                        {/* <SelectItem value="area-residents">Residents in Area</SelectItem> */}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Important Safety Update"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="messageContent">Message Content</Label>
                  <Textarea
                    id="messageContent"
                    placeholder="Write your message here..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    className="min-h-[150px]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending Message..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Message History */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <List className="w-6 h-6 text-emerald-600" />
              <span>Message History</span>
            </h2>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                {messageHistory.length === 0 ? (
                  <p className="text-center text-muted-foreground">No messages sent yet.</p>
                ) : (
                  <div className="space-y-4">
                    {messageHistory.map((message) => (
                      <div key={message.id} className="border-b pb-4 last:pb-0 last:border-b-0">
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <h3 className="font-semibold">{message.subject}</h3>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              <span>Type: {message.type}</span>
                              <Users className="w-4 h-4 ml-2" />
                              <span>To: {message.recipients}</span>
                            </div>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimestamp(message.timestamp)}</span>
                            </div>
                            <Badge className="mt-1">{message.status}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
