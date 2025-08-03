"use client"

import { Users, TrendingUp, Clock, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Team {
  id: string
  name: string
  description: string
  department?: {
    id: string
    name: string
  }
  leader?: {
    id: string
    name: string
    avatar?: string
  }
  members?: Array<{
    id: string
    name: string
    avatar?: string
  }>
  createdAt: string
  updatedAt: string
}

interface TeamStats {
  total: number
  totalMembers: number
  activeProjects: number
  avgTeamSize: number
}

interface TeamViewProps {
  teamId: string
  teamName: string
  teamDescription: string
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [stats, setStats] = useState<TeamStats>({
    total: 0,
    totalMembers: 0,
    activeProjects: 0,
    avgTeamSize: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const { toast } = useToast()

  // Load teams and stats
  useEffect(() => {
    const loadTeamsData = async () => {
      try {
        setIsLoading(true)
        const response = await api.teams.getAll({ limit: 100 })
        setTeams(response.teams || [])
      } catch (error) {
        console.error('Error loading teams:', error)
        toast({
          title: "Error",
          description: "Failed to load teams. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadTeamsData()
  }, [toast])

  // Load stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoadingStats(true)
        
        // Get total teams
        const totalResponse = await api.teams.getAll({ limit: 1 })
        const total = totalResponse.total || 0

        // Calculate total members and average team size
        const allTeams = await api.teams.getAll({ limit: 100 })
        const totalMembers = allTeams.teams?.reduce((sum, team) => sum + (team.members?.length || 0), 0) || 0
        const avgTeamSize = total > 0 ? Math.round((totalMembers / total) * 10) / 10 : 0

        // Estimate active projects (assuming 3 projects per team on average)
        const activeProjects = total * 3

        setStats({
          total,
          totalMembers,
          activeProjects,
          avgTeamSize,
        })
      } catch (error) {
        console.error('Error loading stats:', error)
        toast({
          title: "Error",
          description: "Failed to load team statistics.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingStats(false)
      }
    }

    loadStats()
  }, [toast])

  const statsData = [
    {
      title: "Total Teams",
      value: stats.total.toString(),
      description: "Active teams",
      icon: Users,
      trend: "+2 this month",
    },
    {
      title: "Total Members",
      value: stats.totalMembers.toString(),
      description: "Across all teams",
      icon: Users,
      trend: "+12 this month",
    },
    {
      title: "Active Projects",
      value: stats.activeProjects.toString(),
      description: "In progress",
      icon: TrendingUp,
      trend: "+8 this week",
    },
    {
      title: "Avg Team Size",
      value: stats.avgTeamSize.toString(),
      description: "Members per team",
      icon: Clock,
      trend: "Optimal size",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">Manage teams and their members</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className="flex items-center gap-2">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                {isLoadingStats && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Teams Grid */}
      <TeamsGrid teams={teams} isLoading={isLoading} />
    </div>
  )
}

interface TeamsGridProps {
  teams: Team[]
  isLoading: boolean
}

function TeamsGrid({ teams, isLoading }: TeamsGridProps) {
  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "Engineering":
        return "bg-blue-500"
      case "Design":
        return "bg-purple-500"
      case "Infrastructure":
        return "bg-green-500"
      case "Quality Assurance":
        return "bg-orange-500"
      case "Product":
        return "bg-pink-500"
      default:
        return "bg-gray-500"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading teams...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => (
        <Card key={team.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">
                  <Link href={`/teams/${team.id}`} className="hover:underline">
                    {team.name}
                  </Link>
                </CardTitle>
                <CardDescription className="text-sm">{team.description}</CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              {team.department && (
                <>
                  <div className={`w-3 h-3 rounded-full ${getDepartmentColor(team.department.name)}`} />
                  <Badge variant="outline" className="text-xs">
                    {team.department.name}
                  </Badge>
                </>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Team Lead */}
            {team.leader && (
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={team.leader.avatar || "/placeholder.svg"} alt={team.leader.name} />
                  <AvatarFallback className="text-xs">
                    {team.leader.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Link href={`/users/${team.leader.id}`} className="text-sm font-medium hover:underline">
                    {team.leader.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">Team Lead</p>
                </div>
              </div>
            )}

            {/* Team Members Preview */}
            {team.members && team.members.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Members</span>
                  <span className="text-xs text-muted-foreground">{team.members.length} total</span>
                </div>
                <div className="flex -space-x-2">
                  {team.members.slice(0, 4).map((member) => (
                    <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback className="text-xs">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {team.members.length > 4 && (
                    <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                      <span className="text-xs font-medium">+{team.members.length - 4}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">
                  {Math.floor(Math.random() * 5) + 1} {/* Random active projects */}
                </div>
                <div className="text-xs text-muted-foreground">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">Active</div>
                <div className="text-xs text-muted-foreground">Status</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Recent:</span> Team updated {new Date(team.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}

      {teams.length === 0 && !isLoading && (
        <div className="col-span-full text-center py-8">
          <p className="text-muted-foreground">No teams found.</p>
        </div>
      )}
    </div>
  )
}
