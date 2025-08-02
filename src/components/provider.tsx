// components/workspace.tsx

"use client"
import Image from "next/image"
import type { ReactNode } from "react"
import { createContext, useContext, useState } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Sidebar, SidebarInset, SidebarTrigger, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail } from "@/components/ui/sidebar"
import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'
import { useToast } from "@/hooks/use-toast"
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
  Ticket, LayoutDashboard, UserRound, Layers
} from "lucide-react"

export function Provider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <WorkspaceProvider>
        <SidebarProvider>
          <AppSidebar />
          <WorkspaceLayout>{children}</WorkspaceLayout>
        </SidebarProvider>
        <Toaster />
      </WorkspaceProvider>
    </ThemeProvider>
  )
}


export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}


export function WorkspaceHeader() {
  return (
    <div className="flex items-center justify-between w-full px-4">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 z-1 text-muted-foreground" />
          <Input
            placeholder="Search tickets, users, teams..."
            className="pl-8 bg-background/50 backdrop-blur-sm border-border/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative bg-transparent">
              <Bell className="h-4 w-4" />
              <Badge
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-900 text-white"
              >
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">New ticket assigned</p>
                <p className="text-xs text-muted-foreground">Database connection issue - Priority: High</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Team meeting reminder</p>
                <p className="text-xs text-muted-foreground">Weekly standup in 30 minutes</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">System maintenance</p>
                <p className="text-xs text-muted-foreground">Scheduled downtime tonight at 2 AM</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
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

  // Mock user data - in real app this would come from auth
  // Changed role to "admin" to show admin panel access
  const user = {
    id: "u1",
    name: "Sami",
    email: "sami@itc.com",
    role: "admin" as const,
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
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showNewTeam, setShowNewTeam] = useState(false)
  const [showNewDepartment, setShowNewDepartment] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

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
      // Simulate logout process
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Clear user data and redirect
      localStorage.removeItem("user-session")

      toast({
        title: "Logged out successfully",
        description: "You have been logged out of ITC Hub.",
      })

      // Redirect to login page
      router.push("/login")
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      })
    } finally {
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
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-sm">
                  ITC
                </div>
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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-sm">
                ITC
              </div>
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
  const [settings, setSettings] = useState({
    displayName: "Sami",
    email: "sami@itc.com",
    notifications: true,
    darkMode: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

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

  const toggleTheme = () => {
    const newDarkMode = !settings.darkMode
    setSettings({ ...settings, darkMode: newDarkMode })

    // Apply theme immediately
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
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
      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
        <div className="flex items-center gap-3">
          {settings.darkMode ? (
            <Moon className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Sun className="h-4 w-4 text-muted-foreground" />
          )}
          <Label htmlFor="darkMode" className="text-sm font-medium">
            Dark Mode
          </Label>
        </div>
        <Button
          variant={settings.darkMode ? "default" : "outline"}
          size="sm"
          onClick={toggleTheme}
          className="text-xs"
          disabled={isLoading}
        >
          {settings.darkMode ? "Dark" : "Light"}
        </Button>
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

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-start flex-col gap-2 px-4 py-2">
          <Image
            src="/ITC HUB Logo.svg"
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
