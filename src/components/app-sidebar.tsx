"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, LayoutDashboard, Users, Ticket, UserRound, Menu, X, Layers, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSidebar } from "./sidebar-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AppSidebar() {
  const { isOpen, toggle, isMobile } = useSidebar()
  const pathname = usePathname()

  const routes = [
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
  ]

  if (!isOpen && isMobile) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden bg-transparent"
        onClick={toggle}
      >
        <Menu className="h-4 w-4" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
    )
  }

  return (
    <div
      className={cn(
        "fixed inset-y-0 z-50 flex flex-col bg-background border-r transition-all duration-300",
        isOpen ? "w-64" : "w-[70px]",
        isMobile && isOpen ? "left-0" : "",
        isMobile && !isOpen ? "-left-full" : "",
      )}
    >
      <div className="flex h-14 items-center px-4 border-b">
        {isOpen ? (
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold">ITC App</span>
            <Button variant="ghost" size="icon" onClick={toggle}>
              {isMobile ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="icon" onClick={toggle} className="mx-auto">
            <Menu className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === route.href ? "bg-accent text-accent-foreground" : "transparent",
                !isOpen && "justify-center px-0",
              )}
            >
              <route.icon className="h-5 w-5" />
              {isOpen && <span>{route.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn("w-full justify-start gap-2", !isOpen && "justify-center px-0")}>
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
              {isOpen && <span>Sami</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserRound className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Layers className="mr-2 h-4 w-4" />
              <span>My Teams</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
