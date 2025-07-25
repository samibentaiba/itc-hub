"use client"

import { useState, useEffect } from "react"
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
import { Search, Bell, Plus, Clock, CheckCircle, AlertTriangle, Menu } from "lucide-react"
import { useWorkspace } from "./workspace-provider"
import { NewTicketForm } from "./new-ticket-form"
import { getNotifications } from "@/services/notificationService";

export function WorkspaceHeader() {
  const { user } = useWorkspace()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true)
      const data = await getNotifications()
      setNotifications(data)
      setLoading(false)
    }
    fetchNotifications()
  }, [])

  // Search results stub (real search would require backend implementation)
  const searchResults: any[] = []

  const getPageTitle = () => {
    if (pathname === "/") return "Dashboard"
    if (pathname.includes("/teams/")) return "Team Workspace"
    if (pathname.includes("/departments/")) return "Department Workspace"
    if (pathname.includes("/tickets/")) return "Ticket Discussion"
    if (pathname.includes("/admin")) return "Admin Panel"
    if (pathname.includes("/calendar/global")) return "Global Calendar"
    return "ITC Hub"
  }

  const getPageDescription = () => {
    if (pathname === "/") return "Your personalized workspace overview"
    if (pathname.includes("/teams/")) return "Collaborate with your team members"
    if (pathname.includes("/departments/")) return "Manage department-wide initiatives"
    if (pathname.includes("/tickets/")) return "Ticket conversation and updates"
    if (pathname.includes("/admin")) return "System administration and management"
    if (pathname.includes("/calendar/global")) return "ITC club-wide events and schedules"
    return ""
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ASSIGNMENT":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "VERIFICATION":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "REMINDER":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const unreadCount = notifications.filter((n) => n.unread).length

  if (loading) return <div>Loading header...</div>

  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 gap-4">
        {/* Left side - Title (hidden on mobile to save space) */}
        <div className="hidden sm:block min-w-0 flex-1">
          <h1 className="text-base sm:text-lg font-semibold truncate">{getPageTitle()}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">{getPageDescription()}</p>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 sm:flex-none justify-end">
          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8"
          >
            <Menu className="h-4 w-4 " />
          </Button>
          <Popover open={showSearch} onOpenChange={setShowSearch}>
            <PopoverTrigger asChild>
              <div className="relative flex-1 sm:flex-none max-w-xs">
                <Search className="absolute left-2 sm:left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="w-full pl-8 sm:pl-10 pr-4 h-8 sm:h-10 text-xs sm:text-sm sm:w-64"
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
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{result.title}</div>
                          <div className="text-xs text-muted-foreground truncate">
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
              <Button variant="ghost" size="icon" className="relative h-8 w-8 sm:h-10 sm:w-10">
                <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 text-xs bg-red-500 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 sm:w-80">
              <div className="p-2 border-b">
                <h3 className="font-semibold text-sm sm:text-base">Notifications</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{unreadCount} unread</p>
              </div>
              <div className="max-h-64 overflow-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer">
                    <div className="flex gap-3 w-full">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-medium text-sm ${notification.unread ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {notification.title}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">{notification.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">{notification.time}</div>
                      </div>
                      {notification.unread && <div className="w-2 h-2 bg-red-500 rounded-full mt-1 flex-shrink-0" />}
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>


        </div>
      </div>
    </header>
  )
}
