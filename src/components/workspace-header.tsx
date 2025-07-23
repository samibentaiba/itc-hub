"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Bell, Plus, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { useWorkspace } from "./workspace-provider"
import { NewTicketForm } from "./new-ticket-form"

export function WorkspaceHeader() {
  const { user } = useWorkspace()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)

  // Mock notifications
  const notifications = [
    {
      id: "n1",
      title: "Ticket assigned to you",
      description: "Fix authentication bug - Frontend Team",
      time: "5 minutes ago",
      type: "assignment",
      unread: true,
    },
    {
      id: "n2",
      title: "Ticket verified",
      description: "Design system review has been completed",
      time: "1 hour ago",
      type: "verification",
      unread: true,
    },
    {
      id: "n3",
      title: "New team member",
      description: "Sara joined Frontend Team",
      time: "2 hours ago",
      type: "team",
      unread: false,
    },
    {
      id: "n4",
      title: "Meeting reminder",
      description: "Weekly standup in 30 minutes",
      time: "3 hours ago",
      type: "reminder",
      unread: false,
    },
  ]

  // Mock search results
  const searchResults = [
    { id: "s1", title: "Fix authentication bug", type: "ticket", workspace: "Frontend Team" },
    { id: "s2", title: "Design Review Meeting", type: "ticket", workspace: "Design Department" },
    { id: "s3", title: "Frontend Team", type: "team", workspace: null },
    { id: "s4", title: "Backend Development", type: "department", workspace: null },
  ].filter((item) => searchQuery && item.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const getPageTitle = () => {
    if (pathname === "/") return "Dashboard"
    if (pathname.includes("/teams/")) return "Team Workspace"
    if (pathname.includes("/departments/")) return "Department Workspace"
    if (pathname.includes("/tickets/")) return "Ticket Discussion"
    return "ITC Workspace"
  }

  const getPageDescription = () => {
    if (pathname === "/") return "Your personalized workspace overview"
    if (pathname.includes("/teams/")) return "Collaborate with your team members"
    if (pathname.includes("/departments/")) return "Manage department-wide initiatives"
    if (pathname.includes("/tickets/")) return "Ticket conversation and updates"
    return ""
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "verification":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "reminder":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
            <p className="text-sm text-muted-foreground">{getPageDescription()}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <Popover open={showSearch} onOpenChange={setShowSearch}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search tickets, teams..."
                  className="w-64 pl-10"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSearch(e.target.value.length > 0)
                  }}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="end">
              <div className="max-h-64 overflow-auto">
                {searchResults.length > 0 ? (
                  <div className="p-2">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm">{result.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {result.type} {result.workspace && `• ${result.workspace}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">No results found</div>
                ) : null}
              </div>
            </PopoverContent>
          </Popover>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-2 border-b">
                <h3 className="font-semibold">Notifications</h3>
                <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
              </div>
              <div className="max-h-64 overflow-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer">
                    <div className="flex gap-3 w-full">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <div
                          className={`font-medium text-sm ${notification.unread ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {notification.title}
                        </div>
                        <div className="text-xs text-muted-foreground">{notification.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">{notification.time}</div>
                      </div>
                      {notification.unread && <div className="w-2 h-2 bg-red-500 rounded-full mt-1" />}
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* New Ticket Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="mr-2 h-4 w-4" />
                New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Ticket</DialogTitle>
                <DialogDescription>Create a new ticket in your current workspace</DialogDescription>
              </DialogHeader>
              <NewTicketForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  )
}
