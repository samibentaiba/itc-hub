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

export function UsersTable() {
  const [users] = useState([
    {
      id: "u1",
      name: "Sami",
      email: "sami@example.com",
      role: "super_leader",
      avatar: "/placeholder.svg?height=32&width=32",
      teams: ["Frontend Team"],
      departments: ["UI/UX Department"],
    },
    {
      id: "u2",
      name: "Yasmine",
      email: "yasmine@example.com",
      role: "leader",
      avatar: "/placeholder.svg?height=32&width=32",
      teams: ["Frontend Team"],
      departments: ["UI/UX Department"],
    },
    {
      id: "u3",
      name: "Ali",
      email: "ali@example.com",
      role: "member",
      avatar: "/placeholder.svg?height=32&width=32",
      teams: ["Frontend Team"],
      departments: ["UI/UX Department"],
    },
  ])

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Teams</TableHead>
            <TableHead>Departments</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={user.role === "super_leader" ? "default" : user.role === "leader" ? "secondary" : "outline"}
                >
                  {user.role === "super_leader" ? "Super Leader" : user.role === "leader" ? "Leader" : "Member"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {user.teams.map((team) => (
                    <Badge key={team} variant="outline">
                      {team}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {user.departments.map((department) => (
                    <Badge key={department} variant="outline">
                      {department}
                    </Badge>
                  ))}
                </div>
              </TableCell>
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
                    <DropdownMenuItem>View profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit user</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Change role</DropdownMenuItem>
                    <DropdownMenuItem>Manage teams</DropdownMenuItem>
                    <DropdownMenuItem>Manage departments</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Delete user</DropdownMenuItem>
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
