"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Ticket, Users } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useDepartments } from "./hook"

export default function DepartmentsPage() {
  const { departments, loading, getDepartmentMembersByRole } = useDepartments();

  if (loading) return <div>Loading departments...</div>

  return (
    <DashboardShell>
      <DashboardHeader heading="Departments" text="Manage your departments and members.">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Department
        </Button>
      </DashboardHeader>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {departments.map((department) => {
        const { leaders, members, memberCount, ticketCount } = getDepartmentMembersByRole(department);
        
        return (
          <Card key={department.id}>
            <CardHeader>
              <CardTitle>{department.name}</CardTitle>
              <CardDescription>
                {memberCount} department members
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Leaders</h4>
                <div className="space-y-2">
                  {leaders.length > 0 ? leaders.map((leader: any) => (
                    <div key={leader.id} className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={leader.avatar || "/placeholder.svg"} alt={leader.name} />
                        <AvatarFallback>{leader.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <div>{leader.name}</div>
                        <div className="text-muted-foreground">{leader.email}</div>
                      </div>
                    </div>
                  )) : <div className="text-muted-foreground text-sm">None</div>}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Members</h4>
                <div className="space-y-2">
                  {members.length > 0 ? members.map((member: any) => (
                    <div key={member.id} className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <div>{member.name}</div>
                        <div className="text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                  )) : <div className="text-muted-foreground text-sm">None</div>}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{ticketCount} tickets</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Department calendar</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{memberCount} members</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">View Details</Button>
              <Button>Manage Department</Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>

    </DashboardShell>
  )
}
