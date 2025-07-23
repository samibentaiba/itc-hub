"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  ChevronDown,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  UserPlus,
  Shield,
  Menu,
  X,
} from "lucide-react"
import { useWorkspace } from "./workspace-provider"
import { useToast } from "@/hooks/use-toast"

export function WorkspaceSidebar() {
  const { user, currentWorkspace, setWorkspace } = useWorkspace()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showNewTeam, setShowNewTeam] = useState(false)
  const [showNewDepartment, setShowNewDepartment] = useState(false)
  const { toast } = useToast()

  // Mock data - in real app this would come from API
  const teams = [
    { id: "team-1", name: "Frontend Team", role: "leader", ticketCount: 3 },
    { id: "team-2", name: "Backend Team", role: "member", ticketCount: 1 },
  ]

  const departments = [
    { id: "dept-1", name: "Development", role: "super_leader", ticketCount: 5 },
    { id: "dept-2", name: "Design", role: "leader", ticketCount: 2 },
  ]

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

  const handleCreateTeam = (formData: any) => {
    toast({
      title: "Team created successfully!",
      description: `"${formData.name}" team has been created.`,
    })
    setShowNewTeam(false)
  }

  const handleCreateDepartment = (formData: any) => {
    toast({
      title: "Department created successfully!",
      description: `"${formData.name}" department has been created.`,
    })
    setShowNewDepartment(false)
  }

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of ITC Workspace.",
    })
  }

  const SidebarContent = () => (
    <div
      className={cn("flex flex-col bg-card border-r transition-all duration-300 h-full", isCollapsed ? "w-16" : "w-80")}
    >
      {/* Header */}
      <div className="p-3 sm:p-4 border-b">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-red-500 truncate">ITC Workspace</h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Information Technology Community</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto h-8 w-8 sm:h-10 sm:w-10 hidden lg:flex"
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform", isCollapsed ? "rotate-90" : "rotate-0")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(false)}
            className="ml-auto h-8 w-8 lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-3 sm:p-4 border-b">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 sm:gap-3 h-auto p-2">
              <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 text-left min-w-0">
                  <div className="font-medium text-sm sm:text-base truncate">{user.name}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground truncate">{user.email}</div>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 sm:w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowSettings(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            {user.role === "admin" && (
              <DropdownMenuItem asChild>
                <Link href="/admin">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Panel
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {!isCollapsed && (
          <div className="mt-2">
            <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
              {user.role.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Dashboard */}
        <div>
          <Link href="/" onClick={() => setIsMobileOpen(false)}>
            <Button
              variant={pathname === "/" ? "default" : "ghost"}
              className={cn("w-full justify-start gap-2 sm:gap-3 text-sm", isCollapsed && "justify-center")}
            >
              <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && "Dashboard"}
            </Button>
          </Link>
        </div>

        <Separator />

        {/* Teams */}
        <div>
          {!isCollapsed && (
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">TEAMS</h3>
              <Dialog open={showNewTeam} onOpenChange={setShowNewTeam}>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-5 w-5 sm:h-6 sm:w-6">
                    <Plus className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Team</DialogTitle>
                    <DialogDescription>Create a new team workspace for collaboration</DialogDescription>
                  </DialogHeader>
                  <CreateTeamForm onSubmit={handleCreateTeam} />
                </DialogContent>
              </Dialog>
            </div>
          )}
          <div className="space-y-1">
            {teams.map((team) => (
              <ContextMenu key={team.id}>
                <ContextMenuTrigger>
                  <Link href={`/teams/${team.id}`} onClick={() => setIsMobileOpen(false)}>
                    <Button
                      variant={pathname.includes(`/teams/${team.id}`) ? "default" : "ghost"}
                      className={cn("w-full justify-start gap-2 sm:gap-3 text-sm", isCollapsed && "justify-center")}
                    >
                      <Users className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className="truncate">{team.name}</span>
                          {team.ticketCount > 0 && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {team.ticketCount}
                            </Badge>
                          )}
                        </div>
                      )}
                    </Button>
                  </Link>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Team
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Member
                  </ContextMenuItem>
                  <ContextMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Team
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
        </div>

        <Separator />

        {/* Departments */}
        <div>
          {!isCollapsed && (
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">DEPARTMENTS</h3>
              <Dialog open={showNewDepartment} onOpenChange={setShowNewDepartment}>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-5 w-5 sm:h-6 sm:w-6">
                    <Plus className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Department</DialogTitle>
                    <DialogDescription>Create a new department for organizational oversight</DialogDescription>
                  </DialogHeader>
                  <CreateDepartmentForm onSubmit={handleCreateDepartment} />
                </DialogContent>
              </Dialog>
            </div>
          )}
          <div className="space-y-1">
            {departments.map((dept) => (
              <ContextMenu key={dept.id}>
                <ContextMenuTrigger>
                  <Link href={`/departments/${dept.id}`} onClick={() => setIsMobileOpen(false)}>
                    <Button
                      variant={pathname.includes(`/departments/${dept.id}`) ? "default" : "ghost"}
                      className={cn("w-full justify-start gap-2 sm:gap-3 text-sm", isCollapsed && "justify-center")}
                    >
                      <Building2 className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className="truncate">{dept.name}</span>
                          {dept.ticketCount > 0 && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {dept.ticketCount}
                            </Badge>
                          )}
                        </div>
                      )}
                    </Button>
                  </Link>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Department
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Leader
                  </ContextMenuItem>
                  <ContextMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Department
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
        </div>

        <Separator />

        {/* Global Calendar - Fixed Navigation */}
        <div>
          <Link href="/calendar/global" onClick={() => setIsMobileOpen(false)}>
            <Button
              variant={pathname === "/calendar/global" ? "default" : "ghost"}
              className={cn("w-full justify-start gap-2 sm:gap-3 text-sm", isCollapsed && "justify-center")}
            >
              <Calendar className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && "Global Calendar"}
            </Button>
          </Link>
        </div>
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
    </div>
  )

  return (
    <>
      {/* Mobile Trigger */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 lg:hidden h-8 w-8">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SidebarContent />
      </div>
    </>
  )
}

// Create Team Form Component
function CreateTeamForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({ name: "", description: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ name: "", description: "" })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="teamName" className="text-sm">
          Team Name
        </Label>
        <Input
          id="teamName"
          placeholder="Enter team name..."
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="text-sm"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="teamDescription" className="text-sm">
          Description
        </Label>
        <Textarea
          id="teamDescription"
          placeholder="Describe the team's purpose..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="text-sm min-h-[80px]"
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setFormData({ name: "", description: "" })}
          className="text-sm"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-red-600 hover:bg-red-700 text-sm">
          Create Team
        </Button>
      </div>
    </form>
  )
}

// Create Department Form Component
function CreateDepartmentForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({ name: "", description: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ name: "", description: "" })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="deptName" className="text-sm">
          Department Name
        </Label>
        <Input
          id="deptName"
          placeholder="Enter department name..."
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="text-sm"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="deptDescription" className="text-sm">
          Description
        </Label>
        <Textarea
          id="deptDescription"
          placeholder="Describe the department's role..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="text-sm min-h-[80px]"
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setFormData({ name: "", description: "" })}
          className="text-sm"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-red-600 hover:bg-red-700 text-sm">
          Create Department
        </Button>
      </div>
    </form>
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

  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="displayName" className="text-sm">
          Display Name
        </Label>
        <Input
          id="displayName"
          value={settings.displayName}
          onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
          className="text-sm"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={settings.email}
          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
          className="text-sm"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="notifications" className="text-sm">
          Email Notifications
        </Label>
        <Button
          variant={settings.notifications ? "default" : "outline"}
          size="sm"
          onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
          className="text-xs"
        >
          {settings.notifications ? "On" : "Off"}
        </Button>
      </div>
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700 text-sm w-full sm:w-auto">
          Save Changes
        </Button>
      </div>
    </div>
  )
}
