// components/workspace.tsx

"use client";

// Extend the session user type to include our custom properties
type WorkspaceType = "dashboard" | "team" | "department";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      avatar: string;
    };
  }
}
interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export function Wrapper({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={true}
        storageKey="itc-hub-theme"
      >
        <WorkspaceProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
          <Toaster />
        </WorkspaceProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

function ConditionalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Check if current path is an auth page
  const isAuthPage =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/forget-password") ||
    pathname?.startsWith("/reset-password");

  // Check if user is logged in and on home page
  const isLoggedInOnHome =
    status === "authenticated" && session?.user && pathname === "/";

  // Only show sidebar UI if user is definitely authenticated
  const isAuthenticated = status === "authenticated" && session?.user;

  // For auth pages, don't show the sidebar
  if (isAuthPage) {
    return <>{children}</>;
  }

  // For logged-in users on home page, show without sidebar (clean landing page)
  if (isLoggedInOnHome) {
    return <>{children}</>;
  }

  // For unauthenticated users, don't show sidebar UI
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // Only for authenticated users on protected routes, show the full layout with sidebar
  return (
    <SidebarProvider>
      <AppSidebar />
      <WorkspaceLayout>{children}</WorkspaceLayout>
    </SidebarProvider>
  );
}

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

function WorkspaceHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "New ticket assigned",
      message: "Database connection issue - Priority: High",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      isRead: false,
      link: "/tickets/t2",
    },
    {
      id: "2",
      title: "Team meeting reminder",
      message: "Weekly standup in 30 minutes",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: false,
      link: "/calendar",
    },
    {
      id: "3",
      title: "System maintenance",
      message: "Scheduled downtime tonight at 2 AM",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      isRead: true,
      link: "/admin",
    },
  ]);

  // Mock search data
  const searchData = [
    {
      id: "t1",
      type: "ticket",
      title: "Fix authentication bug",
      url: "/tickets/t1",
    },
    {
      id: "t2",
      type: "ticket",
      title: "Database connection issue",
      url: "/tickets/t2",
    },
    { id: "sami", type: "user", title: "Sami Al-Rashid", url: "/users/sami" },
    { id: "ali", type: "user", title: "Ali Mohammed", url: "/users/ali" },
    {
      id: "frontend",
      type: "team",
      title: "Frontend Team",
      url: "/teams/frontend",
    },
    {
      id: "backend",
      type: "team",
      title: "Backend Team",
      url: "/teams/backend",
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = searchData.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.id.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleResultClick = (result: any) => {
    setShowSearchResults(false);
    setSearchQuery("");
    // Navigate to the result
    window.location.href = result.url;
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Notification functions
  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notification: any) => {
    // Mark as read
    setNotifications(
      notifications.map((n) =>
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    );
    // Navigate to the link
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

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
                    {result.type === "ticket" && (
                      <Ticket className="h-4 w-4 text-blue-500" />
                    )}
                    {result.type === "user" && (
                      <User className="h-4 w-4 text-green-500" />
                    )}
                    {result.type === "team" && (
                      <Users className="h-4 w-4 text-purple-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {result.title}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {result.type}
                    </p>
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
            <Button
              variant="outline"
              size="icon"
              className="relative bg-transparent"
            >
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-900 text-white">
                {notifications.filter((n) => !n.isRead).length}
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
                  className={`p-3 ${!notification.isRead ? "bg-muted/50" : ""}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimeAgo(notification.timestamp)}
                    </p>
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
  );
}

function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get current theme state
  const currentTheme = mounted ? resolvedTheme || theme || "dark" : "dark";
  const isSystem = mounted && theme === "system";

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
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`flex items-center ${
            theme == "light"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : ""
          }`}
        >
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`flex items-center ${
            theme == "dark"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : ""
          }`}
        >
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`flex items-center ${
            theme == "system"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : ""
          }`}
        >
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const { data: session, status } = useSession();

  // Only render workspace layout if user is authenticated
  const isAuthenticated = status === "authenticated" && session?.user;
  if (!isAuthenticated) {
    return <>{children}</>;
  }

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
  );
}

interface WorkspaceContextType {
  currentWorkspace: WorkspaceType;
  currentWorkspaceId: string | null;
  setWorkspace: (type: WorkspaceType, id?: string) => void;
  user: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "super_leader" | "leader" | "member";
    avatar: string;
  };
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [currentWorkspace, setCurrentWorkspace] =
    useState<WorkspaceType>("dashboard");
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(
    null
  );
  const { data: session, status } = useSession();

  // Only provide workspace context if user is authenticated
  const isAuthenticated = status === "authenticated" && session?.user;

  // Use session data or fallback to mock data
  const user =
    isAuthenticated && session?.user
      ? {
          id: session.user.id || "u1",
          name: session.user.name || "User",
          email: session.user.email || "user@itc.com",
          role:
            (session.user.role as
              | "admin"
              | "super_leader"
              | "leader"
              | "member") || "member",
          avatar:
            session.user.avatar ||
            session.user.image ||
            "/placeholder.svg?height=32&width=32",
        }
      : {
          id: "u1",
          name: "Guest",
          email: "guest@itc.com",
          role: "member" as const,
          avatar: "/placeholder.svg?height=32&width=32",
        };

  const setWorkspace = (type: WorkspaceType, id?: string) => {
    setCurrentWorkspace(type);
    setCurrentWorkspaceId(id || null);
  };

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
  );
}

const navigationItems = [
  {
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
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
];
import axios from "axios"; // Make sure to install axios: npm install axios

// Define a type for the user data you expect from the API
interface UserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

function AppSidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  // State to hold user data fetched from the API
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);

    const fetchUserData = async () => {
      try {
        // Fetch user data from the API route
        const response = await axios.get("/api/auth/data");
        if (response.data.userData) {
          setUserData(response.data.userData);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // If the request fails (e.g., 401 Unauthorized), userData will remain null
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Show a loading state or nothing while fetching data or before mounting
  if (isLoading || !mounted) {
    // You can return a skeleton loader here for a better UX
    return null;
  }

  // Only render the sidebar if user data was successfully fetched
  if (!userData) {
    return null;
  }

  const isAdmin = userData.role === "ADMIN";

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-start flex-col gap-2 px-4 py-2">
          <SidebarLogo variant="auto" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navigationItems.map((group, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === item.href
                      : pathname.startsWith(item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
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
                  className={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground
                    flex items-center ${
                      pathname == "/profile" ||
                      pathname == "/settings" ||
                      pathname == "/admin"
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : ""
                    }
                    `}
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={
                        userData.avatar || "/placeholder.svg?height=32&width=32"
                      }
                      alt={userData.name || "User"}
                    />
                    <AvatarFallback className="rounded-lg">
                      {userData.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {userData.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {userData.email}
                    </span>
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
                  <Link
                    href="/profile"
                    className={`flex items-center ${
                      pathname == "/profile"
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : ""
                    }`}
                  >
                    <UserRound className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                {/* Conditionally render the Admin link */}
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/admin"
                      className={`flex items-center ${
                        pathname == "/admin"
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }`}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link
                    href="/settings"
                    className={`flex items-center ${
                      pathname == "/settings"
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : ""
                    }`}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

import type { ReactNode } from "react";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import {
  Sidebar,
  SidebarInset,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarLogo } from "@/components/ui/logo";
import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
  useTheme,
} from "next-themes";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import {} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Users,
  Search,
  Bell,
  Building2,
  Calendar,
  Settings,
  Shield,
  Moon,
  Sun,
  User,
  Ticket,
  LayoutDashboard,
  UserRound,
  Layers,
  Trash2,
} from "lucide-react";
import { Monitor } from "lucide-react";
