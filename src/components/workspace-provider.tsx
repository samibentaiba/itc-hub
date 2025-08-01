"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

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
