"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TicketsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  // Mock stats
  const stats = [
    {
      title: "Total Tickets",
      value: "142",
      description: "All time tickets",
      trend: "+12% from last month",
    },
    {
      title: "Open Tickets",
      value: "23",
      description: "Currently active",
      trend: "-5% from last week",
    },
    {
      title: "In Progress",
      value: "18",
      description: "Being worked on",
      trend: "+8% from last week",
    },
    {
      title: "Resolved",
      value: "101",
      description: "Successfully closed",
      trend: "+15% from last month",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tickets</h1>
          <p className="text-muted-foreground">Manage and track support tickets</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tickets</CardTitle>
          <CardDescription>A list of all support tickets and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          <TicketsTable searchTerm={searchTerm} statusFilter={statusFilter} priorityFilter={priorityFilter} />
        </CardContent>
      </Card>
    </div>
  )
}


import Link from "next/link"
import { MoreHorizontal, Eye, Edit, Trash2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface TicketsTableProps {
  searchTerm: string
  statusFilter: string
  priorityFilter: string
}

const mockTickets = [
  {
    id: "T-001",
    title: "Login page not responsive on mobile",
    description: "The login form breaks on mobile devices below 768px width",
    status: "open",
    priority: "high",
    assignee: {
      name: "Sami Al-Rashid",
      avatar: "/placeholder.svg?height=32&width=32",
      id: "sami",
    },
    reporter: {
      name: "Yasmine Hassan",
      avatar: "/placeholder.svg?height=32&width=32",
      id: "yasmine",
    },
    createdAt: "2024-01-15",
    updatedAt: "2024-01-16",
    comments: 3,
    team: "Frontend Team",
  },
  {
    id: "T-002",
    title: "Database connection timeout",
    description: "API endpoints are timing out due to database connection issues",
    status: "in-progress",
    priority: "urgent",
    assignee: {
      name: "Ali Mohammed",
      avatar: "/placeholder.svg?height=32&width=32",
      id: "ali",
    },
    reporter: {
      name: "Sami Al-Rashid",
      avatar: "/placeholder.svg?height=32&width=32",
      id: "sami",
    },
    createdAt: "2024-01-14",
    updatedAt: "2024-01-16",
    comments: 8,
    team: "Backend Team",
  },
  {
    id: "T-003",
    title: "Update user profile design",
    description: "Redesign the user profile page according to new design system",
    status: "resolved",
    priority: "medium",
    assignee: {
      name: "Yasmine Hassan",
      avatar: "/placeholder.svg?height=32&width=32",
      id: "yasmine",
    },
    reporter: {
      name: "Fatima Al-Zahra",
      avatar: "/placeholder.svg?height=32&width=32",
      id: "fatima",
    },
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15",
    comments: 5,
    team: "Design Team",
  },
  {
    id: "T-004",
    title: "Add dark mode toggle",
    description: "Implement dark mode functionality across the application",
    status: "open",
    priority: "low",
    assignee: {
      name: "Omar Khaled",
      avatar: "/placeholder.svg?height=32&width=32",
      id: "omar",
    },
    reporter: {
      name: "Layla Ibrahim",
      avatar: "/placeholder.svg?height=32&width=32",
      id: "layla",
    },
    createdAt: "2024-01-12",
    updatedAt: "2024-01-13",
    comments: 2,
    team: "Frontend Team",
  },
  {
    id: "T-005",
    title: "Performance optimization needed",
    description: "Page load times are slow, need to optimize bundle size and API calls",
    status: "in-progress",
    priority: "high",
    assignee: {
      name: "Sami Al-Rashid",
      avatar: "/placeholder.svg?height=32&width=32",
      id: "sami",
    },
    reporter: {
      name: "Ali Mohammed",
      avatar: "/placeholder.svg?height=32&width=32",
      id: "ali",
    },
    createdAt: "2024-01-11",
    updatedAt: "2024-01-16",
    comments: 12,
    team: "Performance Team",
  },
]

export function TicketsTable({ searchTerm, statusFilter, priorityFilter }: TicketsTableProps) {
  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "destructive"
      case "in-progress":
        return "default"
      case "resolved":
        return "secondary"
      case "closed":
        return "outline"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const formatStatus = (status: string) => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticket</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Reporter</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>
                <div className="space-y-1">
                  <Link href={`/tickets/${ticket.id}`} className="font-medium hover:underline">
                    {ticket.id}
                  </Link>
                  <div className="text-sm text-muted-foreground">{ticket.title}</div>
                  {ticket.comments > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      {ticket.comments}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(ticket.status) as "default" | "secondary" | "destructive" | "outline"}>{formatStatus(ticket.status)}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getPriorityColor(ticket.priority) as "default" | "secondary" | "destructive" | "outline"}>
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={ticket.assignee.avatar || "/placeholder.svg"} alt={ticket.assignee.name} />
                    <AvatarFallback className="text-xs">
                      {ticket.assignee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Link href={`/users/${ticket.assignee.id}`} className="text-sm hover:underline">
                    {ticket.assignee.name}
                  </Link>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={ticket.reporter.avatar || "/placeholder.svg"} alt={ticket.reporter.name} />
                    <AvatarFallback className="text-xs">
                      {ticket.reporter.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Link href={`/users/${ticket.reporter.id}`} className="text-sm hover:underline">
                    {ticket.reporter.name}
                  </Link>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{ticket.team}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {new Date(ticket.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/tickets/${ticket.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit ticket
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete ticket
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredTickets.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No tickets found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

