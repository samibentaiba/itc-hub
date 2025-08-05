import { Building2, Users, Briefcase, TrendingUp } from "lucide-react"

export interface Department {
  id: string
  name: string
  description: string
  head: {
    name: string
    avatar: string
    id: string
  }
  teamCount: number
  memberCount: number
  budget: string
  teams: Array<{ name: string; memberCount: number }>
  recentActivity: string
  status: string
  color: string
}

export interface DepartmentStat {
  title: string
  value: string
  description: string
  icon: any
  trend: string
}

export const useDepartmentsPage = () => {
  // Mock stats data
  const stats: DepartmentStat[] = [
    {
      title: "Total Departments",
      value: "8",
      description: "Active departments",
      icon: Building2,
      trend: "+1 this quarter",
    },
    {
      title: "Department Heads",
      value: "8",
      description: "Leadership roles",
      icon: Users,
      trend: "All filled",
    },
    {
      title: "Teams per Dept",
      value: "1.5",
      description: "Average teams",
      icon: Briefcase,
      trend: "Optimal structure",
    },
    {
      title: "Cross-Dept Projects",
      value: "12",
      description: "Collaborative work",
      icon: TrendingUp,
      trend: "+3 this month",
    },
  ]

  // Mock departments data
  const departments: Department[] = [
    {
      id: "dept-1",
      name: "Engineering",
      description: "Software development and technical infrastructure",
      head: {
        name: "Sami Al-Rashid",
        avatar: "/placeholder.svg?height=32&width=32",
        id: "sami",
      },
      teamCount: 3,
      memberCount: 18,
      budget: "$2,400,000",
      teams: [
        { name: "Frontend Team", memberCount: 8 },
        { name: "Backend Team", memberCount: 6 },
        { name: "DevOps Team", memberCount: 4 },
      ],
      recentActivity: "Launched new microservices architecture",
      status: "active",
      color: "bg-blue-500",
    },
    {
      id: "dept-2",
      name: "Design",
      description: "User experience and visual design",
      head: {
        name: "Yasmine Hassan",
        avatar: "/placeholder.svg?height=32&width=32",
        id: "yasmine",
      },
      teamCount: 1,
      memberCount: 5,
      budget: "$800,000",
      teams: [{ name: "Design Team", memberCount: 5 }],
      recentActivity: "Completed design system overhaul",
      status: "active",
      color: "bg-purple-500",
    },
    {
      id: "dept-3",
      name: "Product",
      description: "Product strategy and management",
      head: {
        name: "Fatima Al-Zahra",
        avatar: "/placeholder.svg?height=32&width=32",
        id: "fatima",
      },
      teamCount: 1,
      memberCount: 4,
      budget: "$600,000",
      teams: [{ name: "Product Team", memberCount: 4 }],
      recentActivity: "Released Q1 product roadmap",
      status: "active",
      color: "bg-pink-500",
    },
    {
      id: "dept-4",
      name: "Quality Assurance",
      description: "Testing and quality control",
      head: {
        name: "Layla Ibrahim",
        avatar: "/placeholder.svg?height=32&width=32",
        id: "layla",
      },
      teamCount: 1,
      memberCount: 6,
      budget: "$500,000",
      teams: [{ name: "QA Team", memberCount: 6 }],
      recentActivity: "Implemented automated testing suite",
      status: "active",
      color: "bg-orange-500",
    },
    {
      id: "dept-5",
      name: "Infrastructure",
      description: "IT infrastructure and operations",
      head: {
        name: "Ali Mohammed",
        avatar: "/placeholder.svg?height=32&width=32",
        id: "ali",
      },
      teamCount: 1,
      memberCount: 4,
      budget: "$1,200,000",
      teams: [{ name: "DevOps Team", memberCount: 4 }],
      recentActivity: "Migrated to cloud infrastructure",
      status: "active",
      color: "bg-green-500",
    },
    {
      id: "dept-6",
      name: "Marketing",
      description: "Marketing and communications",
      head: {
        name: "Nour Khalil",
        avatar: "/placeholder.svg?height=32&width=32",
        id: "nour",
      },
      teamCount: 2,
      memberCount: 8,
      budget: "$900,000",
      teams: [
        { name: "Digital Marketing", memberCount: 5 },
        { name: "Content Team", memberCount: 3 },
      ],
      recentActivity: "Launched new brand campaign",
      status: "active",
      color: "bg-red-500",
    },
    {
      id: "dept-7",
      name: "Sales",
      description: "Sales and business development",
      head: {
        name: "Ahmed Hassan",
        avatar: "/placeholder.svg?height=32&width=32",
        id: "ahmed",
      },
      teamCount: 2,
      memberCount: 12,
      budget: "$1,500,000",
      teams: [
        { name: "Enterprise Sales", memberCount: 7 },
        { name: "SMB Sales", memberCount: 5 },
      ],
      recentActivity: "Exceeded Q4 sales targets",
      status: "active",
      color: "bg-indigo-500",
    },
    {
      id: "dept-8",
      name: "Human Resources",
      description: "People operations and talent management",
      head: {
        name: "Mona Farid",
        avatar: "/placeholder.svg?height=32&width=32",
        id: "mona",
      },
      teamCount: 1,
      memberCount: 3,
      budget: "$400,000",  
      teams: [{ name: "HR Team", memberCount: 3 }],
      recentActivity: "Implemented new performance review system",
      status: "active",
      color: "bg-teal-500",
    },
  ]

  // Utility functions
  const getDepartmentById = (id: string) => {
    return departments.find(dept => dept.id === id)
  }

  const getTotalMembers = () => {
    return departments.reduce((total, dept) => total + dept.memberCount, 0)
  }

  const getActiveDepartments = () => {
    return departments.filter(dept => dept.status === 'active')
  }

  const getDepartmentsByTeamCount = () => {
    return [...departments].sort((a, b) => b.teamCount - a.teamCount)
  }

  // Future API integration points
  const fetchDepartments = async () => {
    // Placeholder for API call
    // return await api.get('/departments')
    return departments
  }

  const updateDepartment = async (id: string, updates: Partial<Department>) => {
    // Placeholder for API call
    // return await api.patch(`/departments/${id}`, updates)
    console.log(`Updating department ${id}:`, updates)
  }

  const deleteDepartment = async (id: string) => {
    // Placeholder for API call
    // return await api.delete(`/departments/${id}`)
    console.log(`Deleting department ${id}`)
  }

  return {
    // Data
    stats,
    departments,
    
    // Computed values
    totalMembers: getTotalMembers(),
    activeDepartments: getActiveDepartments(),
    departmentsByTeamCount: getDepartmentsByTeamCount(),
    
    // Utility functions
    getDepartmentById,
    getTotalMembers,
    getActiveDepartments,
    getDepartmentsByTeamCount,
    
    // API functions (for future use)
    fetchDepartments,
    updateDepartment,
    deleteDepartment,
  }
}