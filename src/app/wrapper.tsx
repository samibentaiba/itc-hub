// src/app/wrapper.tsx
"use client";

import type { ReactNode } from "react";
import { createContext, useState, useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import {
  Sidebar,
  SidebarInset,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarLogo } from "@/components/ui/logo";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
  useTheme,
} from "next-themes";
import { SessionProvider, useSession, signOut } from "next-auth/react";
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
  Monitor,
  Twitter,
  Github,
  Linkedin,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { FooterLogo, HeaderLogo } from "@/components/ui/logo";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

// Session types are declared in src/types/next-auth.d.ts
type WorkspaceType = "dashboard" | "team" | "department";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

interface SearchResult {
  id: string;
  type: string;
  title: string;
  url: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  link: string;
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

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

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
    pathname?.startsWith("/reset-password") ||
    pathname?.startsWith("/verification-result");

  const isProtectedPage =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/calendar") ||
    pathname?.startsWith("/departments") ||
    pathname?.startsWith("/profile") ||
    pathname?.startsWith("/settings") ||
    pathname?.startsWith("/teams") ||
    pathname?.startsWith("/tickets") ||
    pathname?.startsWith("/users");

  const isOtherPage =
    pathname == "/" ||
    pathname?.startsWith("/about") ||
    pathname?.startsWith("/faq") ||
    pathname?.startsWith("/policy") ||
    pathname?.startsWith("/terms") ||
    pathname?.startsWith("/vlogs") ||
    pathname?.startsWith("/projects");

  // Only show sidebar UI if user is definitely authenticated
  const isAuthenticated =
    status === "authenticated" && session?.user && isProtectedPage;

  // For auth pages, don't show the sidebar
  if (isAuthPage) {
    return <>{children}</>;
  }

  if (isOtherPage || pathname == "/") {
    return <PublicLayout>{children}</PublicLayout>;
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

function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

function WorkspaceHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
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
  const searchData: SearchResult[] = [
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

  const handleResultClick = (result: SearchResult) => {
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

  const handleNotificationClick = (notification: Notification) => {
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

function AppSidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);

    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/auth/data");
        if (response.data.userData) {
          setUserData(response.data.userData);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading || !mounted) {
    return null;
  }

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
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
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

function Header() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && session?.user;
  const pathname = usePathname();
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <HeaderLogo variant="auto" />
        </Link>
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                onClick={() => signOut({ callbackUrl: `/${pathname}` })}
              >
                Log Out
              </Button>
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const pathname = usePathname();
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4">
        <Card className="border-0 shadow-none">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <Link href="/" className="flex items-center space-x-2">
                  <FooterLogo variant="auto" />
                </Link>
                <p className="text-sm text-muted-foreground">
                  Empowering the IT Community through collaboration, innovation,
                  and shared knowledge.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Legal pages</h3>
                <ul className="space-y-2 text-sm">
                  {pathname != "/about" &&(<li>
                    <Link
                      href="/about"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      About Us
                    </Link>
                  </li>)}
                  {pathname != "/faq" && (<li>
                    <Link
                      href="/faq"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      FAQ
                    </Link>
                  </li>)}
                  {pathname != "/policy" && (<li>
                    <Link
                      href="/policy"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>)}
                  {pathname != "/terms" && (<li>
                    <Link
                      href="/terms"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Terms of service
                    </Link>
                  </li>)}
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Others</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/#achievements"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Achievements
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#events"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Upcoming Events
                    </Link>
                    </li>
                  {pathname != "/vlogs" && (
                    <li>
                      <Link
                        href="/vlogs"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        Vlogs
                      </Link>
                    </li>)}
                  {pathname != "p/rojects"  && (
                    <li>
                      <Link
                        href="/projects"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        Projects
                      </Link>
                    </li>)}
                  
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Follow Us</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" asChild>
                    <a href="" aria-label="Twitter">
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href="" aria-label="GitHub">
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href="" aria-label="LinkedIn">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
            <Separator className="my-6" />
            <div className="text-center text-sm text-muted-foreground">
              <p>
                &copy; {new Date().getFullYear()} ITC Hub. All rights reserved.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </footer>
  );
}
