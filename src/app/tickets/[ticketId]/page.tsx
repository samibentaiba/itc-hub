"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TicketChatView } from "@/components/ticket-chat-view"

export default function TicketDetailPage() {
  const params = useParams()
  const ticketId = params.ticketId as string
  const [loading, setLoading] = useState(true)
  const [ticket, setTicket] = useState<any>(null)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Mock ticket data based on ticketId
      const mockTicket = {
        id: ticketId,
        title: ticketId === "T-001" ? "Login page not responsive on mobile" : "Database connection timeout",
        description:
          ticketId === "T-001"
            ? "The login form breaks on mobile devices below 768px width. Users are unable to complete the login process on their phones."
            : "API endpoints are timing out due to database connection issues. This is affecting user experience across the platform.",
        status: ticketId === "T-001" ? "open" : "in-progress",
        priority: ticketId === "T-001" ? "high" : "urgent",
        assignee: {
          name: ticketId === "T-001" ? "Sami Al-Rashid" : "Ali Mohammed",
          avatar: "/placeholder.svg?height=32&width=32",
          id: ticketId === "T-001" ? "sami" : "ali",
        },
        reporter: {
          name: ticketId === "T-001" ? "Yasmine Hassan" : "Sami Al-Rashid",
          avatar: "/placeholder.svg?height=32&width=32",
          id: ticketId === "T-001" ? "yasmine" : "sami",
        },
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-16T14:20:00Z",
        team: ticketId === "T-001" ? "Frontend Team" : "Backend Team",
        labels: ticketId === "T-001" ? ["bug", "mobile", "ui"] : ["bug", "database", "urgent"],
      }
      setTicket(mockTicket)
      setLoading(false)
    }, 1000)
  }, [ticketId])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/tickets">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tickets
            </Button>
          </Link>
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/tickets">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tickets
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Ticket not found</h3>
              <p className="text-muted-foreground">The ticket you're looking for doesn't exist.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/tickets">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tickets
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{ticket.id}</h1>
            <p className="text-muted-foreground">{ticket.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" className="text-destructive bg-transparent">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Ticket Details */}
      <TicketChatView ticket={ticket} />
    </div>
  )
}
