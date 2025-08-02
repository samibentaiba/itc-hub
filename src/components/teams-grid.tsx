"use client"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"


const mockTeams = [
  {
    id: "team-1",
    name: "Frontend Team",
    description: "Responsible for user interface development and user experience",
    department: "Engineering",
    memberCount: 8,
    activeProjects: 5,
    lead: {
      name: "Sami Al-Rashid",
      avatar: "/placeholder.svg?height=32&width=32",
      id: "sami",
    },
    members: [
      { name: "Yasmine Hassan", avatar: "/placeholder.svg?height=24&width=24", id: "yasmine" },
      { name: "Omar Khaled", avatar: "/placeholder.svg?height=24&width=24", id: "omar" },
      { name: "Layla Ibrahim", avatar: "/placeholder.svg?height=24&width=24", id: "layla" },
    ],
    recentActivity: "Updated design system components",
    status: "active",
  },
  {
    id: "team-2",
    name: "Backend Team",
    description: "Server-side development and API management",
    department: "Engineering",
    memberCount: 6,
    activeProjects: 3,
    lead: {
      name: "Ali Mohammed",
      avatar: "/placeholder.svg?height=32&width=32",
      id: "ali",
    },
    members: [
      { name: "Ahmed Hassan", avatar: "/placeholder.svg?height=24&width=24", id: "ahmed" },
      { name: "Nour Khalil", avatar: "/placeholder.svg?height=24&width=24", id: "nour" },
      { name: "Rami Saad", avatar: "/placeholder.svg?height=24&width=24", id: "rami" },
    ],
    recentActivity: "Deployed new API endpoints",
    status: "active",
  },
  {
    id: "team-3",
    name: "Design Team",
    description: "User experience and visual design",
    department: "Design",
    memberCount: 5,
    activeProjects: 4,
    lead: {
      name: "Yasmine Hassan",
      avatar: "/placeholder.svg?height=32&width=32",
      id: "yasmine",
    },
    members: [
      { name: "Mona Farid", avatar: "/placeholder.svg?height=24&width=24", id: "mona" },
      { name: "Sara Ahmed", avatar: "/placeholder.svg?height=24&width=24", id: "sara" },
      { name: "Dina Mahmoud", avatar: "/placeholder.svg?height=24&width=24", id: "dina" },
    ],
    recentActivity: "Completed mobile app wireframes",
    status: "active",
  },
  {
    id: "team-4",
    name: "DevOps Team",
    description: "Infrastructure and deployment automation",
    department: "Infrastructure",
    memberCount: 4,
    activeProjects: 2,
    lead: {
      name: "Khaled Nasser",
      avatar: "/placeholder.svg?height=32&width=32",
      id: "khaled",
    },
    members: [
      { name: "Tamer Ali", avatar: "/placeholder.svg?height=24&width=24", id: "tamer" },
      { name: "Hany Mostafa", avatar: "/placeholder.svg?height=24&width=24", id: "hany" },
    ],
    recentActivity: "Optimized CI/CD pipeline",
    status: "active",
  },
  {
    id: "team-5",
    name: "QA Team",
    description: "Quality assurance and testing",
    department: "Quality Assurance",
    memberCount: 6,
    activeProjects: 6,
    lead: {
      name: "Layla Ibrahim",
      avatar: "/placeholder.svg?height=32&width=32",
      id: "layla",
    },
    members: [
      { name: "Amira Zaki", avatar: "/placeholder.svg?height=24&width=24", id: "amira" },
      { name: "Rana Hosni", avatar: "/placeholder.svg?height=24&width=24", id: "rana" },
      { name: "Salma Farouk", avatar: "/placeholder.svg?height=24&width=24", id: "salma" },
    ],
    recentActivity: "Completed regression testing",
    status: "active",
  },
  {
    id: "team-6",
    name: "Product Team",
    description: "Product strategy and management",
    department: "Product",
    memberCount: 4,
    activeProjects: 3,
    lead: {
      name: "Fatima Al-Zahra",
      avatar: "/placeholder.svg?height=32&width=32",
      id: "fatima",
    },
    members: [
      { name: "Mariam Youssef", avatar: "/placeholder.svg?height=24&width=24", id: "mariam" },
      { name: "Nada Sherif", avatar: "/placeholder.svg?height=24&width=24", id: "nada" },
    ],
    recentActivity: "Launched new feature roadmap",
    status: "active",
  },
]

export function TeamsGrid() {
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

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {mockTeams.map((team) => (
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
              <div className={`w-3 h-3 rounded-full ${getDepartmentColor(team.department)}`} />
              <Badge variant="outline" className="text-xs">
                {team.department}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Team Lead */}
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={team.lead.avatar || "/placeholder.svg"} alt={team.lead.name} />
                <AvatarFallback className="text-xs">
                  {team.lead.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <Link href={`/users/${team.lead.id}`} className="text-sm font-medium hover:underline">
                  {team.lead.name}
                </Link>
                <p className="text-xs text-muted-foreground">Team Lead</p>
              </div>
            </div>

            {/* Team Members Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Members</span>
                <span className="text-xs text-muted-foreground">{team.memberCount} total</span>
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
                {team.memberCount > 4 && (
                  <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                    <span className="text-xs font-medium">+{team.memberCount - 4}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">{team.activeProjects}</div>
                <div className="text-xs text-muted-foreground">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {team.status === "active" ? "Active" : "Inactive"}
                </div>
                <div className="text-xs text-muted-foreground">Status</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Recent:</span> {team.recentActivity}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
