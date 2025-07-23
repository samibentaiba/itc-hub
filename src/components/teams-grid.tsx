"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, Ticket, Users } from "lucide-react"

export function TeamsGrid() {
  const [teams] = useState([
    {
      id: "team-dev",
      name: "Frontend Team",
      superLeader: {
        id: "u1",
        name: "Sami",
        email: "sami@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      leaders: [
        {
          id: "u2",
          name: "Yasmine",
          email: "yasmine@example.com",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      ],
      members: [
        {
          id: "u3",
          name: "Ali",
          email: "ali@example.com",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      ],
      tickets: 2,
    },
  ])

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => (
        <Card key={team.id}>
          <CardHeader>
            <CardTitle>{team.name}</CardTitle>
            <CardDescription>{team.members.length + team.leaders.length + 1} team members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Super Leader</h4>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={team.superLeader.avatar || "/placeholder.svg"} alt={team.superLeader.name} />
                  <AvatarFallback>{team.superLeader.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div>{team.superLeader.name}</div>
                  <div className="text-muted-foreground">{team.superLeader.email}</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Leaders</h4>
              <div className="space-y-2">
                {team.leaders.map((leader) => (
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
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Members</h4>
              <div className="space-y-2">
                {team.members.map((member) => (
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
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <Ticket className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{team.tickets} tickets</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Team calendar</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{team.members.length + team.leaders.length + 1} members</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">View Details</Button>
            <Button>Manage Team</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
