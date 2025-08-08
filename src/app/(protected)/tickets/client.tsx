"use client"

import Link from "next/link"
import { Search, MoreHorizontal, Eye, Edit, Trash2, MessageSquare } from "lucide-react"
import { useTicketsPage} from "./hook"
import { Ticket, Stat } from "./types"

// UI Components
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface TicketsClientPageProps {
  initialTickets: Ticket[]
  initialStats: Stat[]
}

// This is the Client Component that handles user interactions
export default function TicketsClientPage({ initialTickets, initialStats }: TicketsClientPageProps) {
  const {
    searchTerm,
    statusFilter,
    priorityFilter,
    typeFilter,
    stats,
    filteredTickets,
    setSearchTerm,
    setStatusFilter,
    setPriorityFilter,
    setTypeFilter,
    getStatusColor,
    getPriorityColor,
    formatStatus,
  } = useTicketsPage(initialTickets, initialStats);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tickets</h1>
          <p className="text-muted-foreground">Manage and track support tickets</p>
        </div>
      </div>

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
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
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
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Task">Task</SelectItem>
                <SelectItem value="Bug">Bug</SelectItem>
                <SelectItem value="Feature">Feature</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Tickets</CardTitle>
          <CardDescription>A list of all support tickets and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          <TicketsTable 
            tickets={filteredTickets} 
            getStatusColor={getStatusColor} 
            getPriorityColor={getPriorityColor} 
            formatStatus={formatStatus} 
          />
        </CardContent>
      </Card>
    </div>
  )
}

interface TicketsTableProps {
  tickets: Ticket[];
  getStatusColor: (status: Ticket['status']) => "destructive" | "default" | "secondary" | "outline";
  getPriorityColor: (priority: Ticket['priority']) => "destructive" | "default" | "secondary" | "outline";
  formatStatus: (status: string) => string;
}


function TicketsTable({ tickets, getStatusColor, getPriorityColor, formatStatus }: TicketsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticket</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>From</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Due Date</TableHead>
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
                  {ticket.comments > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      {ticket.comments}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(ticket.status)}>{formatStatus(ticket.status)}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getPriorityColor(ticket.priority)}>
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{ticket.type}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{ticket.from}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={ticket.assignee.avatar || "/placeholder.svg"} alt={ticket.assignee.name} />
                    <AvatarFallback className="text-xs">
                      {ticket.assignee.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Link href={`/users/${ticket.assignee.id}`} className="text-sm hover:underline">
                    {ticket.assignee.name}
                  </Link>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {new Date(ticket.dueDate).toLocaleDateString()}
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
      {tickets.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No tickets found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
