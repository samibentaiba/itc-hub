"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TeamView } from "@/components/team-view"

export default function TeamDetailPage() {
  const params = useParams()
  const teamId = params.teamId as string
  const [loading, setLoading] = useState(true)
  const [team, setTeam] = useState<any>(null)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Mock team data based on teamId
      const mockTeam = {
        id: teamId,
        name: teamId === "team-1" ? "Frontend Team" : teamId === "team-2" ? "Backend Team" : "Design Team",
        description:
          teamId === "team-1"
            ? "Responsible for user interface development and user experience"
            : teamId === "team-2"
              ? "Server-side development and API management"
              : "User experience and visual design",
        department: teamId === "team-1" || teamId === "team-2" ? "Engineering" : "Design",
        memberCount: teamId === "team-1" ? 8 : teamId === "team-2" ? 6 : 5,
        activeProjects: teamId === "team-1" ? 5 : teamId === "team-2" ? 3 : 4,
        lead: {
          name: teamId === "team-1" ? "Sami Al-Rashid" : teamId === "team-2" ? "Ali Mohammed" : "Yasmine Hassan",
          avatar: "/placeholder.svg?height=32&width=32",
          id: teamId === "team-1" ? "sami" : teamId === "team-2" ? "ali" : "yasmine",
        },
        status: "active",
        createdAt: "2023-01-15",
      }
      setTeam(mockTeam)
      setLoading(false)
    }, 1000)
  }, [teamId])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/teams">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Teams
            </Button>
          </Link>
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/teams">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Teams
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Team not found</h3>
              <p className="text-muted-foreground">The team you're looking for doesn't exist.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/teams">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Teams
            </Button>
          </Link>

        </div>

      </div>

      {/* Team Details */}
      <TeamView teamId={team.id} teamDescription={team.description} teamName={team.name} />
    </div>
  )
}
