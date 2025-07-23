import type React from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-provider"

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({ children, className, ...props }: DashboardShellProps) {
  const { isOpen, isMobile } = useSidebar()

  return (
    <div
      className={cn(
        "flex min-h-screen flex-col gap-8 p-4 pt-6 md:p-8",
        isOpen && !isMobile ? "md:ml-64" : "md:ml-[70px]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
