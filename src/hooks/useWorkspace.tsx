"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { getUsers } from "@/services/userService";

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
  } | null
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceType>("dashboard")
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchUser() {
      setLoading(true)
      // Type guard: only fetch if session.user and session.user.id exist
      if (!session?.user || typeof (session.user as any).id !== "string") {
        setUser(null)
        setLoading(false)
        return
      }
      // Fetch the current user by id
      const users = await getUsers();
      const res = users.find((u: any) => u.id === (session.user as any).id);
      if (res) {
        setUser(res);
      } else {
        setUser(null);
      }
      setLoading(false)
    }
    fetchUser()
  }, [session?.user])

  const setWorkspace = (type: WorkspaceType, id?: string) => {
    setCurrentWorkspace(type)
    setCurrentWorkspaceId(id || null)
  }

  // Only show loading if session is loading and user is required
  if (status === "loading") return <div>Loading user...</div>

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
