"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, Ticket, Users } from "lucide-react"
import { getTeams } from "@/services/teamService";

export function TeamsGrid() {
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTeams() {
      setLoading(true)
      const data = await getTeams();
      setTeams(data)
      setLoading(false)
    }
    fetchTeams()
  }, [])

  if (loading) return <div>Loading teams...</div>

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => {
        // Map members by role
        const superLeader = team.members.find((m: any) => m.role === "SUPERLEADER")?.user || null
        const leaders = team.members.filter((m: any) => m.role === "LEADER").map((m: any) => m.user)
        const members = team.members.filter((m: any) => m.role === "MEMBER").map((m: any) => m.user)
        const ticketCount = team.tickets?.length || 0
        const memberCount =  (superLeader ? 1 : 0) + leaders.length + members.length
        return (
          <Card key={team.id}>
            <CardHeader>
              <CardTitle>{team.name}</CardTitle>
              <CardDescription>{memberCount} team members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Super Leader</h4>
                {superLeader ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={superLeader.avatar || "/placeholder.svg"} alt={superLeader.name} />
                      <AvatarFallback>{superLeader.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <div>{superLeader.name}</div>
                      <div className="text-muted-foreground">{superLeader.email}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm">None</div>
                )}
              </div>

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
                  <span className="text-sm">Team calendar</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{memberCount} members</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">View Details</Button>
              <Button>Manage Team</Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
