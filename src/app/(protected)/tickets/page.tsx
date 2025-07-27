
"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Plus } from "lucide-react"
import { useTickets } from "./hook"

export default function TicketsPage() {
  const { 
    tickets, 
    loading, 
    getStatusBadgeVariant, 
    getStatusDisplayName, 
    formatDueDate, 
    getTeamOrDepartmentName 
  } = useTickets();

  if (loading) return <div>Loading tickets...</div>

  return (
    <DashboardShell>
      <DashboardHeader heading="Tickets" text="Manage your tickets and tasks.">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </DashboardHeader>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Team/Department</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-medium">
                <div>
                  <div>{ticket.title}</div>
                  <div className="text-sm text-muted-foreground">{ticket.description}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{ticket.type}</Badge>
              </TableCell>
              <TableCell>
                {ticket.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={ticket.assignee.avatar || "/placeholder.svg"} alt={ticket.assignee.name} />
                      <AvatarFallback>{ticket.assignee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <div>{ticket.assignee.name}</div>
                      <div className="text-muted-foreground">{ticket.assignee.email}</div>
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground">N/A</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(ticket.status)}>
                  {getStatusDisplayName(ticket.status)}
                </Badge>
              </TableCell>
              <TableCell>{getTeamOrDepartmentName(ticket)}</TableCell>
              <TableCell>{formatDueDate(ticket.dueDate)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Edit ticket</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Change status</DropdownMenuItem>
                    <DropdownMenuItem>Reassign</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Delete ticket</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    </DashboardShell>
  )
}
