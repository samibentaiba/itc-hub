// hook.ts

import { Users, TrendingUp, Clock } from "lucide-react"

export interface Team {
  id: string
  name: string
  description: string
  department: string
  memberCount: number
  activeProjects: number
  lead: {
    name: string
    avatar: string
    id: string
  }
  members: {
    name: string
    avatar: string
    id: string
  }[]
  recentActivity: string
  status: "active" | "inactive"
}

export function useTeamsPage() {
  const stats = [
    {
      title: "Total Teams",
      value: "12",
      description: "Active teams",
      icon: Users,
      trend: "+2 this month",
    },
    {
      title: "Total Members",
      value: "89",
      description: "Across all teams",
      icon: Users,
      trend: "+12 this month",
    },
    {
      title: "Active Projects",
      value: "34",
      description: "In progress",
      icon: TrendingUp,
      trend: "+8 this week",
    },
    {
      title: "Avg Team Size",
      value: "7.4",
      description: "Members per team",
      icon: Clock,
      trend: "Optimal size",
    },
  ]

  const teams: Team[] = [
    {
      id: "team-1",
      name: "Frontend Team",
      description: "Responsible for user interface development and user experience",
      department: "Engineering",
      memberCount: 8,
      activeProjects: 5,
      lead: {
        name: "Sami Al-Rashid",
        avatar: "/placeholder.svg",
        id: "sami",
      },
      members: [
        { name: "Yasmine Hassan", avatar: "/placeholder.svg", id: "yasmine" },
        { name: "Omar Khaled", avatar: "/placeholder.svg", id: "omar" },
        { name: "Layla Ibrahim", avatar: "/placeholder.svg", id: "layla" },
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
        avatar: "/placeholder.svg",
        id: "ali",
      },
      members: [
        { name: "Ahmed Hassan", avatar: "/placeholder.svg", id: "ahmed" },
        { name: "Nour Khalil", avatar: "/placeholder.svg", id: "nour" },
        { name: "Rami Saad", avatar: "/placeholder.svg", id: "rami" },
      ],
      recentActivity: "Deployed new API endpoints",
      status: "active",
    },
  ]

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

  return {
    stats,
    teams,
    getDepartmentColor,
  }
}
