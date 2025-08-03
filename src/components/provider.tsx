// components/workspace.tsx

"use client"
import Image from "next/image"
import type { ReactNode } from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Sidebar, SidebarInset, SidebarTrigger, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail } from "@/components/ui/sidebar"
import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
  useTheme,
} from 'next-themes'
import { useToast } from "@/hooks/use-toast"
import { SessionProvider, useSession, signOut } from "next-auth/react"
import { } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Users,
  Search, Bell,
  Building2,
  Calendar,
  Settings,
  LogOut,
  Shield,
  Menu,
  Moon,
  Sun,
  User,
  ChevronUp,
  Home,
  Ticket, LayoutDashboard, UserRound, Layers, Trash2
} from "lucide-react"

export function Provider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true} storageKey="itc-hub-theme">
        <WorkspaceProvider>
          <SidebarProvider>
            <AppSidebar />
            <WorkspaceLayout>{children}</WorkspaceLayout>
          </SidebarProvider>
          <Toaster />
        </WorkspaceProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}


export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}


export function WorkspaceHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "New ticket assigned",
      message: "Database connection issue - Priority: High",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      isRead: false,
      link: "/tickets/t2"
    },
    {
      id: "2",
      title: "Team meeting reminder",
      message: "Weekly standup in 30 minutes",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: false,
      link: "/calendar"
    },
    {
      id: "3",
      title: "System maintenance",
      message: "Scheduled downtime tonight at 2 AM",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      isRead: true,
      link: "/admin"
    }
  ])

  // Mock search data
  const searchData = [
    { id: "t1", type: "ticket", title: "Fix authentication bug", url: "/tickets/t1" },
    { id: "t2", type: "ticket", title: "Database connection issue", url: "/tickets/t2" },
    { id: "sami", type: "user", title: "Sami Al-Rashid", url: "/users/sami" },
    { id: "ali", type: "user", title: "Ali Mohammed", url: "/users/ali" },
    { id: "frontend", type: "team", title: "Frontend Team", url: "/teams/frontend" },
    { id: "backend", type: "team", title: "Backend Team", url: "/teams/backend" },
  ]

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const filtered = searchData.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.id.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(filtered)
      setShowSearchResults(true)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }

  const handleResultClick = (result: any) => {
    setShowSearchResults(false)
    setSearchQuery("")
    // Navigate to the result
    window.location.href = result.url
  }

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Notification functions
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })))
  }

  const handleNotificationClick = (notification: any) => {
    // Mark as read
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, isRead: true } : n
    ))
    // Navigate to the link
    if (notification.link) {
      window.location.href = notification.link
    }
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <div className="flex items-center justify-between w-full px-4">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative flex-1" ref={searchRef}>
          <Search className="absolute left-2 top-2.5 h-4 w-4 z-1 text-muted-foreground" />
          <Input
            placeholder="Search tickets, users, teams..."
            className="pl-8 bg-background/50 backdrop-blur-sm border-border/50"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
          />
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex-shrink-0">
                    {result.type === "ticket" && <Ticket className="h-4 w-4 text-blue-500" />}
                    {result.type === "user" && <User className="h-4 w-4 text-green-500" />}
                    {result.type === "team" && <Users className="h-4 w-4 text-purple-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{result.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{result.type}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
      <ThemeSwitcher />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative bg-transparent">
              <Bell className="h-4 w-4" />
              <Badge
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-900 text-white"
              >
                {notifications.filter(n => !n.isRead).length}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between p-2">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsRead()}
                className="h-6 px-2 text-xs"
              >
                Mark all read
              </Button>
            </div>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`p-3 ${!notification.isRead ? 'bg-muted/50' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{notification.title}</p>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{formatTimeAgo(notification.timestamp)}</p>
                  </div>
                </DropdownMenuItem>
              ))
            )}
            {notifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => clearAllNotifications()}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear all notifications
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}


import { Monitor } from "lucide-react"

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get current theme state
  const currentTheme = mounted ? (resolvedTheme || theme || "dark") : "dark"
  const isSystem = mounted && theme === "system"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {isSystem ? (
            <Monitor className="h-[1.2rem] w-[1.2rem]" />
          ) : currentTheme === "dark" ? (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


interface WorkspaceLayoutProps {
  children: React.ReactNode
}

export function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
        </div>
        <div className="flex-1">
          <WorkspaceHeader />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
    </SidebarInset>
  )
}


type WorkspaceType = "dashboard" | "team" | "department"

interface WorkspaceContextType {
  currentWorkspace: WorkspaceType
  currentWorkspaceId: string | null
  setWorkspace: (type: WorkspaceType, id?: string) => void
  user: {
    id: string
    name: string
    email: string
    role: "admin" | "super_leader" | "leader" | "member"
    avatar: string
  }
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceType>("dashboard")
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null)
  const { data: session } = useSession()

  // Use session data or fallback to mock data
  const user = session?.user ? {
    id: session.user.id || "u1",
    name: session.user.name || "User",
    email: session.user.email || "user@itc.com",
    role: (session.user.role as "admin" | "super_leader" | "leader" | "member") || "member",
    avatar: session.user.avatar || "/placeholder.svg?height=32&width=32",
  } : {
    id: "u1",
    name: "Guest",
    email: "guest@itc.com",
    role: "member" as const,
    avatar: "/placeholder.svg?height=32&width=32",
  }

  const setWorkspace = (type: WorkspaceType, id?: string) => {
    setCurrentWorkspace(type)
    setCurrentWorkspaceId(id || null)
  }

  return (
    <WorkspaceContext.Provider
      value={{
        currentWorkspace,
        currentWorkspaceId,
        setWorkspace,
        user,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider")
  }
  return context
}


const navigation = [
  {
    title: "Overview",
    items: [{ name: "Dashboard", href: "/", icon: Home }],
  },
  {
    title: "Management",
    items: [
      { name: "Tickets", href: "/tickets", icon: Ticket },
      { name: "Teams", href: "/teams", icon: Users },
      { name: "Departments", href: "/departments", icon: Building2 },
      { name: "Users", href: "/users", icon: Users },
    ],
  },
  {
    title: "Organization",
    items: [
      { name: "Calendar", href: "/calendar", icon: Calendar },
      { name: "Global Calendar", href: "/calendar/global", icon: Calendar },
    ],
  },
]

export function WorkspaceSidebar() {
  const { user } = useWorkspace()
  const pathname = usePathname()
  const router = useRouter()
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showNewTeam, setShowNewTeam] = useState(false)
  const [showNewDepartment, setShowNewDepartment] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get the appropriate logo based on theme
  const getLogoSrc = () => {
    if (!mounted) return "/ITC HUB Logo.svg" // Default during SSR
    const currentTheme = resolvedTheme || theme || "dark"
    return currentTheme === "light" ? "/ITC HUB Logo Light.svg" : "/ITC HUB Logo Dark.svg"
  }

  // Mock data - in real app this would come from API
  const [teams, setTeams] = useState([
    { id: "team-1", name: "Frontend Team", role: "leader", ticketCount: 3 },
    { id: "team-2", name: "Backend Team", role: "member", ticketCount: 1 },
  ])

  const [departments, setDepartments] = useState([
    { id: "dept-1", name: "Development", role: "super_leader", ticketCount: 5 },
    { id: "dept-2", name: "Design", role: "leader", ticketCount: 2 },
  ])

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "super_leader":
        return "destructive"
      case "leader":
        return "default"
      default:
        return "secondary"
    }
  }

  const handleCreateTeam = async (formData: {
    name: string;
  }) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newTeam = {
        id: `team-${teams.length + 1}`,
        name: formData.name,
        role: "leader",
        ticketCount: 0,
      }

      setTeams([...teams, newTeam])

      toast({
        title: "Team created successfully!",
        description: `"${formData.name}" team has been created.`,
      })
      setShowNewTeam(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create team. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateDepartment = async (formData: {
    name: string;
  }) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newDepartment = {
        id: `dept-${departments.length + 1}`,
        name: formData.name,
        role: "leader",
        ticketCount: 0,
      }

      setDepartments([...departments, newDepartment])

      toast({
        title: "Department created successfully!",
        description: `"${formData.name}" department has been created.`,
      })
      setShowNewDepartment(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create department. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await signOut({ 
        callbackUrl: "/login",
        redirect: true 
      })
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleTeamAction = async (action: string, teamId: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const team = teams.find((t) => t.id === teamId)

      switch (action) {
        case "Edit Team":
          // Navigate to edit page or open edit modal
          router.push(`/teams/${teamId}/edit`)
          break
        case "Add Member":
          // Open add member modal or navigate to member management
          toast({
            title: "Add Member",
            description: `Opening member management for ${team?.name}`,
          })
          break
        case "Delete Team":
          // Show confirmation and delete
          if (confirm(`Are you sure you want to delete ${team?.name}?`)) {
            setTeams(teams.filter((t) => t.id !== teamId))
            toast({
              title: "Team Deleted",
              description: `${team?.name} has been deleted successfully.`,
            })
          }
          break
        default:
          toast({
            title: action,
            description: `Performing ${action} on ${team?.name}`,
          })
      }
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Failed to perform action. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDepartmentAction = async (action: string, deptId: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const dept = departments.find((d) => d.id === deptId)

      switch (action) {
        case "Edit Department":
          router.push(`/departments/${deptId}/edit`)
          break
        case "Add Leader":
          toast({
            title: "Add Leader",
            description: `Opening leader management for ${dept?.name}`,
          })
          break
        case "Delete Department":
          if (confirm(`Are you sure you want to delete ${dept?.name}?`)) {
            setDepartments(departments.filter((d) => d.id !== deptId))
            toast({
              title: "Department Deleted",
              description: `${dept?.name} has been deleted successfully.`,
            })
          }
          break
        default:
          toast({
            title: action,
            description: `Performing ${action} on ${dept?.name}`,
          })
      }
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Failed to perform action. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Mobile Trigger */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 lg:hidden h-10 w-10 bg-background/80 backdrop-blur-sm border shadow-md hover:bg-red-500/10"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80">
          <Sidebar variant="inset" className="border-r">
            <SidebarHeader className="border-b px-6 py-4">
              <div className="flex items-center gap-3">
                <Image
                  src={getLogoSrc()}
                  alt="ITC Hub"
                  width={90}
                  height={40}
                />
                <div>
                  <h2 className="font-semibold text-lg">ITC Hub</h2>
                  <p className="text-xs text-muted-foreground">Workspace</p>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent className="px-4">
              {navigation.map((section) => (
                <SidebarGroup key={section.title}>
                  <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {section.title}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {section.items.map((item) => (
                        <SidebarMenuItem key={item.name}>
                          <SidebarMenuButton asChild isActive={pathname === item.href} className="w-full justify-start">
                            <Link href={item.href}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.name}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>

            <SidebarFooter className="border-t p-4">
              <SidebarMenu>
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                      >
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">{user.name}</span>
                          <span className="truncate text-xs">{user.email}</span>
                        </div>
                        <ChevronUp className="ml-auto size-4" />
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                      side="bottom"
                      align="end"
                      sideOffset={4}
                    >
                      <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                          <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{user.name}</span>
                            <span className="truncate text-xs">{user.email}</span>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowSettings(true)}>
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                      </DropdownMenuItem>
                      {user.role === "super_leader" && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin">
                            <Shield className="h-4 w-4 mr-2" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        {isLoading ? "Logging out..." : "Log out"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
          </Sidebar>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar variant="inset" className="border-r">
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <Image
                src={getLogoSrc()}
                alt="ITC Hub"
                width={90}
                height={40}
              />
              <div>
                <h2 className="font-semibold text-lg">ITC Hub</h2>
                <p className="text-xs text-muted-foreground">Workspace</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-4">
            {navigation.map((section) => (
              <SidebarGroup key={section.title}>
                <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={pathname === item.href} className="w-full justify-start">
                          <Link href={item.href}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{user.name}</span>
                        <span className="truncate text-xs">{user.email}</span>
                      </div>
                      <ChevronUp className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">{user.name}</span>
                          <span className="truncate text-xs">{user.email}</span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowSettings(true)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </DropdownMenuItem>
                    {user.role === "super_leader" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Shield className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      {isLoading ? "Logging out..." : "Log out"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Manage your account and preferences</DialogDescription>
          </DialogHeader>
          <UserSettingsForm />
        </DialogContent>
      </Dialog>
    </>
  )
}

// User Settings Form Component
function UserSettingsForm() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState({
    displayName: "Sami",
    email: "sami@itc.com",
    notifications: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get current theme state
  const currentTheme = mounted ? (resolvedTheme || theme || "dark") : "dark"

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Save settings to localStorage or API
      localStorage.setItem("user-settings", JSON.stringify(settings))

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Save Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="displayName" className="text-sm font-medium">
          Display Name
        </Label>
        <Input
          id="displayName"
          value={settings.displayName}
          onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
          className="text-sm border-border/50 focus:border-red-500 focus:ring-red-500/20"
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={settings.email}
          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
          className="text-sm border-border/50 focus:border-red-500 focus:ring-red-500/20"
          disabled={isLoading}
        />
      </div>
      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
        <div className="flex items-center gap-3">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="notifications" className="text-sm font-medium">
            Email Notifications
          </Label>
        </div>
        <Button
          variant={settings.notifications ? "default" : "outline"}
          size="sm"
          onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
          className="text-xs"
          disabled={isLoading}
        >
          {settings.notifications ? "On" : "Off"}
        </Button>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Theme</Label>
        <div className="flex gap-2">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme("light")}
            className="text-xs flex-1"
            disabled={isLoading}
          >
            <Sun className="mr-2 h-4 w-4" />
            Light
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme("dark")}
            className="text-xs flex-1"
            disabled={isLoading}
          >
            <Moon className="mr-2 h-4 w-4" />
            Dark
          </Button>
          <Button
            variant={theme === "system" ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme("system")}
            className="text-xs flex-1"
            disabled={isLoading}
          >
            <Monitor className="mr-2 h-4 w-4" />
            System
          </Button>
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSave}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-sm w-full sm:w-auto shadow-md"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}

const navigationItems = [
  {

    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
      },
      {
        label: "Teams",
        icon: Layers,
        href: "/teams",
      },
      {
        label: "Departments",
        icon: Building2,
        href: "/departments",
      },
      {
        label: "Tickets",
        icon: Ticket,
        href: "/tickets",
      },
      {
        label: "Calendar",
        icon: Calendar,
        href: "/calendar",  
      },
      {
        label: "Users",
        icon: Users,
        href: "/users",
      },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get the appropriate logo based on theme
  const getLogoSrc = () => {
    if (!mounted) return "/ITC HUB Logo.svg" // Default during SSR
    const currentTheme = resolvedTheme || theme || "dark"
    return currentTheme === "light" ? "/ITC HUB Logo Light.svg" : "/ITC HUB Logo Dark.svg"
  }

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-start flex-col gap-2 px-4 py-2">
          <Image
            src={getLogoSrc()}
            alt="ITC Hub"
            width={90}
            height={40}
          />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate text-[0.6rem] text-muted-foreground">Information Technology Community</span>
            <span className="truncate text-[0.6rem] text-muted-foreground">HUB</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navigationItems.map((group, index) => (
          <SidebarGroup key={index} >
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href}>
                        <Link href={item.href}>
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Sami" />
                    <AvatarFallback className="rounded-lg">S</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Sami</span>
                    <span className="truncate text-xs text-muted-foreground">sami@itchub.com</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >


                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserRound className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin">
                    <Shield className="mr-2 h-4 w-4" />
                    admin
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
