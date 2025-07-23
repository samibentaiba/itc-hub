"use client"

import { useState } from "react"
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

export function TicketsTable() {
  const [tickets] = useState([
    {
      id: "t1",
      title: "Fix login bug",
      description: "Resolve session persistence issue",
      type: "task",
      team: "Frontend Team",
      department: null,
      assignee: {
        name: "Ali",
        email: "ali@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdBy: {
        name: "Yasmine",
        email: "yasmine@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      status: "verified",
      duration: "3 days",
    },
    {
      id: "t2",
      title: "Weekly Standup",
      description: "Discuss weekly progress",
      type: "event",
      team: "Frontend Team",
      department: null,
      assignee: null,
      createdBy: {
        name: "Yasmine",
        email: "yasmine@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      status: "scheduled",
      duration: "1 hour",
    },
    {
      id: "t3",
      title: "Design Review",
      description: "Review new component designs",
      type: "meeting",
      team: null,
      department: "UI/UX Department",
      assignee: null,
      createdBy: {
        name: "Sami",
        email: "sami@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      status: "in_progress",
      duration: "2 days",
    },
    {
      id: "t4",
      title: "Create landing page",
      description: "Design and structure the homepage layout",
      type: "task",
      team: null,
      department: "UI/UX Department",
      assignee: {
        name: "Ali",
        email: "ali@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdBy: {
        name: "Yasmine",
        email: "yasmine@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      status: "in_progress",
      duration: "1 week",
    },
  ])

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Team/Department</TableHead>
            <TableHead>Duration</TableHead>
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
                <Badge
                  variant={
                    ticket.status === "verified" ? "default" : ticket.status === "in_progress" ? "secondary" : "outline"
                  }
                >
                  {ticket.status === "verified"
                    ? "Verified"
                    : ticket.status === "in_progress"
                      ? "In Progress"
                      : "Scheduled"}
                </Badge>
              </TableCell>
              <TableCell>{ticket.team || ticket.department || "N/A"}</TableCell>
              <TableCell>{ticket.duration}</TableCell>
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
  )
}
