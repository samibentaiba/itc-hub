"use client"

import { useState, useEffect } from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Ticket {
  id: string
  title: string
  description: string
  status: string
  priority: string
  type: string
  assignee?: {
    id: string
    name: string
    avatar?: string
  }
  creator?: {
    id: string
    name: string
    avatar?: string
  }
  team?: {
    id: string
    name: string
  }
  department?: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

interface TicketStats {
  total: number
  open: number
  inProgress: number
  resolved: number
}

export default function TicketsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [stats, setStats] = useState<TicketStats>({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const { toast } = useToast()

  // Load tickets and stats
  useEffect(() => {
    const loadTicketsData = async () => {
      try {
        setIsLoading(true)
        
        // Build query parameters
        const params: any = {
          limit: 50,
          page: 1,
        }
        
        if (searchTerm) {
          params.search = searchTerm
        }
        
        if (statusFilter !== "all") {
          params.status = statusFilter
        }
        
        if (priorityFilter !== "all") {
          params.priority = priorityFilter
        }

        const response = await api.tickets.getAll(params)
        setTickets(response.tickets || [])
      } catch (error) {
        console.error('Error loading tickets:', error)
        toast({
          title: "Error",
          description: "Failed to load tickets. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadTicketsData()
  }, [searchTerm, statusFilter, priorityFilter, toast])

  // Load stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoadingStats(true)
        
        // Get total tickets
        const totalResponse = await api.tickets.getAll({ limit: 1 })
        const total = totalResponse.total || 0

        // Get open tickets
        const openResponse = await api.tickets.getAll({ 
          status: "pending,active", 
          limit: 1 
        })
        const open = openResponse.total || 0

        // Get in progress tickets
        const inProgressResponse = await api.tickets.getAll({ 
          status: "in_progress", 
          limit: 1 
        })
        const inProgress = inProgressResponse.total || 0

        // Get resolved tickets
        const resolvedResponse = await api.tickets.getAll({ 
          status: "verified,completed", 
          limit: 1 
        })
        const resolved = resolvedResponse.total || 0

        setStats({
          total,
          open,
          inProgress,
          resolved,
        })
      } catch (error) {
        console.error('Error loading stats:', error)
        toast({
          title: "Error",
          description: "Failed to load ticket statistics.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingStats(false)
      }
    }

    loadStats()
  }, [toast])

  const statsData = [
    {
      title: "Total Tickets",
      value: stats.total.toString(),
      description: "All time tickets",
      trend: "+12% from last month",
    },
    {
      title: "Open Tickets",
      value: stats.open.toString(),
      description: "Currently active",
      trend: "-5% from last week",
    },
    {
      title: "In Progress",
      value: stats.inProgress.toString(),
      description: "Being worked on",
      trend: "+8% from last week",
    },
    {
      title: "Resolved",
      value: stats.resolved.toString(),
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
        {statsData.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {isLoadingStats && <Loader2 className="h-4 w-4 animate-spin" />}
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
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
          <TicketsTable 
            tickets={tickets} 
            isLoading={isLoading}
            searchTerm={searchTerm} 
            statusFilter={statusFilter} 
            priorityFilter={priorityFilter} 
          />
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
  tickets: Ticket[]
  isLoading: boolean
  searchTerm: string
  statusFilter: string
  priorityFilter: string
}

function TicketsTable({ tickets, isLoading, searchTerm, statusFilter, priorityFilter }: TicketsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
      case "active":
        return "destructive"
      case "in_progress":
        return "default"
      case "verified":
      case "completed":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
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
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading tickets...</span>
        </div>
      </div>
    )
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
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>
                <div className="space-y-1">
                  <Link href={`/tickets/${ticket.id}`} className="font-medium hover:underline">
                    {ticket.id}
                  </Link>
                  <div className="text-sm text-muted-foreground">{ticket.title}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {ticket.description}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(ticket.status) as "default" | "secondary" | "destructive" | "outline"}>
                  {formatStatus(ticket.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getPriorityColor(ticket.priority) as "default" | "secondary" | "destructive" | "outline"}>
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                {ticket.assignee ? (
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
                ) : (
                  <span className="text-muted-foreground text-sm">Unassigned</span>
                )}
              </TableCell>
              <TableCell>
                {ticket.creator ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={ticket.creator.avatar || "/placeholder.svg"} alt={ticket.creator.name} />
                      <AvatarFallback className="text-xs">
                        {ticket.creator.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Link href={`/users/${ticket.creator.id}`} className="text-sm hover:underline">
                      {ticket.creator.name}
                    </Link>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">Unknown</span>
                )}
              </TableCell>
              <TableCell>
                {ticket.team ? (
                  <Badge variant="outline">{ticket.team.name}</Badge>
                ) : ticket.department ? (
                  <Badge variant="outline">{ticket.department.name}</Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">No team</span>
                )}
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

      {tickets.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No tickets found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

