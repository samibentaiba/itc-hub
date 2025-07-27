"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  ChevronLeft,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  UserPlus,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { getTeams, createTeam } from "@/services/teamService";
import { getDepartments, createDepartment } from "@/services/departmentService";
import { TeamForm } from "@/components/forms/TeamForm";
import { DepartmentForm } from "@/components/forms/DepartmentForm";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Bell, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { getNotifications } from "@/services/notificationService";

import type React from "react"

interface WorkspaceLayoutProps {
  children: React.ReactNode
}

export function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const { user, currentWorkspace, setWorkspace } = useWorkspace();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNewTeam, setShowNewTeam] = useState(false);
  const [showNewDepartment, setShowNewDepartment] = useState(false);
  // Use real user teams/departments if available, otherwise fallback to mock data
  const teams = user && Array.isArray((user as any).teams) && (user as any).teams.length > 0
    ? (user as any).teams.map((t: any) => ({
        id: t.team?.id || t.id,
        name: t.team?.name || t.name,
        role: t.role,
        ticketCount: t.ticketCount || 0,
      }))
    : [
        { id: "team-1", name: "Frontend Team", role: "leader", ticketCount: 3 },
        { id: "team-2", name: "Backend Team", role: "member", ticketCount: 1 },
      ];
  const departments = user && Array.isArray((user as any).departments) && (user as any).departments.length > 0
    ? (user as any).departments.map((d: any) => ({
        id: d.department?.id || d.id,
        name: d.department?.name || d.name,
        role: d.role,
        ticketCount: d.ticketCount || 0,
      }))
    : [
        { id: "dept-1", name: "Development", role: "super_leader", ticketCount: 5 },
        { id: "dept-2", name: "Design", role: "leader", ticketCount: 2 },
      ];
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSidebarData() {
      setLoading(true);
      const [teamsRes, departmentsRes] = await Promise.all([
        getTeams(),
        getDepartments(),
      ]);
      // setTeams(await teamsRes.json()); // Removed setTeams
      // setDepartments(await departmentsRes.json()); // Removed setDepartments
      setLoading(false);
    }
    fetchSidebarData();
  }, []);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "SUPERLEADER":
        return "destructive";
      case "LEADER":
        return "default";
      default:
        return "secondary";
    }
  };

  const handleCreateTeam = async (formData: any) => {
    const newTeam = await createTeam(formData);
    // setTeams((prev) => [...prev, newTeam]); // Removed setTeams
    toast({ title: "Team created successfully!", description: `"${formData.name}" team has been created.` });
    setShowNewTeam(false);
  };

  const handleCreateDepartment = async (formData: any) => {
    const newDept = await createDepartment(formData);
    // setDepartments((prev) => [...prev, newDept]); // Removed setDepartments
    toast({ title: "Department created successfully!", description: `"${formData.name}" department has been created.` });
    setShowNewDepartment(false);
  };

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of ITC Hub.",
    });
  };

  const SidebarContent = () => (
    <div
      className={cn(
        "flex flex-col bg-card border-r transition-all duration-300 h-full",
        isCollapsed ? "w-16" : "w-80"
      )}
    >
      {/* Header */}
      <div className="p-3 sm:p-4 border-b">
        <div className="flex items-center justify-center">
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <Image
                src="/ITC HUB Logo.svg"
                alt="ITC Hub"
                width={100}
                height={100}
                className="mx-4"
              />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto h-8 w-8 sm:h-10 sm:w-10 hidden lg:flex"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                isCollapsed ? "rotate-180" : "rotate-0"
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(false)}
            className="ml-auto h-8 w-8 lg:hidden"
          >
            <X className="h-4 w-4 hidden " />
          </Button>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-3 sm:p-4 border-b flex justify-center items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-center gap-2 sm:gap-3 h-auto px-5"
              
            >
              <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                <AvatarImage
                  src={user?.avatar || "/placeholder.svg"}
                  alt={user?.name}
                />
                <AvatarFallback>{user?.name ? user.name.charAt(0) : "G"}</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 text-left min-w-0">
                  <div className="font-medium text-sm sm:text-base truncate">
                    {user?.name}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground truncate">
                    {user?.email}
                  </div>
                </div>
              )}
              {!isCollapsed && user && (
                <div className="mt-2">
                  <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                    {user.role.replace("_", " ").toUpperCase()}
                  </Badge>
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
            {user?.role === "admin" && (
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

      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Dashboard */}
        <div>
          <Link href="/" onClick={() => setIsMobileOpen(false)}>
            <Button
              variant={pathname === "/" ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-2 sm:gap-3 text-sm",
                isCollapsed && "justify-center"
              )}
            >
              <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && "Dashboard"}
            </Button>
          </Link>
        </div>

        
        {/* Global Calendar - Fixed Navigation */}
        <div>
          <Link href="/calendar/global" onClick={() => setIsMobileOpen(false)}>
            <Button
              variant={pathname === "/calendar/global" ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-2 sm:gap-3 text-sm",
                isCollapsed && "justify-center"
              )}
            >
              <Calendar className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && "Global Calendar"}
            </Button>
          </Link>
        </div>
        <Separator />
        {/* Teams */}
        <div>
          {!isCollapsed && (
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
                TEAMS
              </h3>
              <Dialog open={showNewTeam} onOpenChange={setShowNewTeam}>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-5 w-5 sm:h-6 sm:w-6"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Team</DialogTitle>
                    <DialogDescription>
                      Create a new team workspace for collaboration
                    </DialogDescription>
                  </DialogHeader>
                  <TeamForm onSubmit={handleCreateTeam} submitLabel="Create Team" />
                </DialogContent>
              </Dialog>
            </div>
          )}
          <div className="space-y-1">
            {teams.map((team: any) => (
              <ContextMenu key={team.id}>
                <ContextMenuTrigger>
                  <Link
                    href={`/teams/${team.id}`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <Button
                      variant={
                        pathname.includes(`/teams/${team.id}`)
                          ? "default"
                          : "ghost"
                      }
                      className={cn(
                        "w-full justify-start gap-2 sm:gap-3 text-sm",
                        isCollapsed && "justify-center"
                      )}
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
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
                DEPARTMENTS
              </h3>
              <Dialog
                open={showNewDepartment}
                onOpenChange={setShowNewDepartment}
              >
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-5 w-5 sm:h-6 sm:w-6"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Department</DialogTitle>
                    <DialogDescription>
                      Create a new department for organizational oversight
                    </DialogDescription>
                  </DialogHeader>
                  <DepartmentForm onSubmit={handleCreateDepartment} submitLabel="Create Department" />
                </DialogContent>
              </Dialog>
            </div>
          )}
          <div className="space-y-1">
            {departments.map((dept: any) => (
              <ContextMenu key={dept.id}>
                <ContextMenuTrigger>
                  <Link
                    href={`/departments/${dept.id}`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <Button
                      variant={
                        pathname.includes(`/departments/${dept.id}`)
                          ? "default"
                          : "ghost"
                      }
                      className={cn(
                        "w-full justify-start gap-2 sm:gap-3 text-sm",
                        isCollapsed && "justify-center"
                      )}
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


      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Manage your account and preferences
            </DialogDescription>
          </DialogHeader>
          <UserSettingsForm />
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
          <>
      {/* Mobile Trigger */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 lg:hidden h-8 w-8"
          >
            <Menu className="h-4 w-4 hidden " />
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
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <WorkspaceHeader />
        <main className="flex-1 overflow-auto">
          <div className="h-full w-full p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

// Create Team Form Component
function CreateTeamForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", description: "" });
  };

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
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
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
  );
}

// Create Department Form Component
function CreateDepartmentForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", description: "" });
  };

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
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
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
  );
}

// User Settings Form Component
function UserSettingsForm() {
  const [settings, setSettings] = useState({
    displayName: "Sami",
    email: "sami@itc.com",
    notifications: true,
    darkMode: true,
  });

  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="displayName" className="text-sm">
          Display Name
        </Label>
        <Input
          id="displayName"
          value={settings.displayName}
          onChange={(e) =>
            setSettings({ ...settings, displayName: e.target.value })
          }
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
          onClick={() =>
            setSettings({ ...settings, notifications: !settings.notifications })
          }
          className="text-xs"
        >
          {settings.notifications ? "On" : "Off"}
        </Button>
      </div>
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSave}
          className="bg-red-600 hover:bg-red-700 text-sm w-full sm:w-auto"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}

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
