"use client"

import type React from "react"

import { WorkspaceSidebar } from "./workspace-sidebar"
import { WorkspaceHeader } from "./workspace-header"

interface WorkspaceLayoutProps {
  children: React.ReactNode
}

export function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkspaceSidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <WorkspaceHeader />
        <main className="flex-1 overflow-auto">
          <div className="h-full w-full p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
