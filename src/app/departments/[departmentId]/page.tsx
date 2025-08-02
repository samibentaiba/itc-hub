"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DepartmentView } from "@/components/department-view"

export default function DepartmentDetailPage() {
  const params = useParams()
  const departmentId = params.departmentId as string
  const [loading, setLoading] = useState(true)
  const [department, setDepartment] = useState<{
    id: string;
    name: string;
    description: string;
    head: {
      name: string;
      avatar: string;
      id: string;
    };
    teamCount: number;
    memberCount: number;
    budget: string;
    status: string;
    createdAt: string;
  } | null>(null)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Mock department data based on departmentId
      const mockDepartment = {
        id: departmentId,
        name: departmentId === "dept-1" ? "Engineering" : departmentId === "dept-2" ? "Design" : "Product",
        description:
          departmentId === "dept-1"
            ? "Software development and technical infrastructure"
            : departmentId === "dept-2"
              ? "User experience and visual design"
              : "Product strategy and management",
        head: {
          name:
            departmentId === "dept-1"
              ? "Sami Al-Rashid"
              : departmentId === "dept-2"
                ? "Yasmine Hassan"
                : "Fatima Al-Zahra",
          avatar: "/placeholder.svg?height=32&width=32",
          id: departmentId === "dept-1" ? "sami" : departmentId === "dept-2" ? "yasmine" : "fatima",
        },
        teamCount: departmentId === "dept-1" ? 3 : 1,
        memberCount: departmentId === "dept-1" ? 18 : departmentId === "dept-2" ? 5 : 4,
        budget: departmentId === "dept-1" ? "$2,400,000" : departmentId === "dept-2" ? "$800,000" : "$600,000",
        status: "active",
        createdAt: "2023-01-15",
      }
      setDepartment(mockDepartment)
      setLoading(false)
    }, 1000)
  }, [departmentId])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/departments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Departments
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

  if (!department) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/departments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Departments
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Department not found</h3>
              <p className="text-muted-foreground">The department you&apos;re looking for doesn&apos;t exist.</p>
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
          <Link href="/departments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Departments
            </Button>
          </Link>

        </div>

      </div>

      {/* Department Details */}
      <DepartmentView
  departmentId={department.id}
  departmentName={department.name}
  derpartmentDescription={department.description}
/>

    </div>
  )
}
