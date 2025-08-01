"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Users, ArrowUpRight, CalendarDays, Video, Coffee } from "lucide-react"

export function UpcomingEvents() {
  const events = [
    {
      id: "E-001",
      title: "Weekly Frontend Standup",
      description: "Sprint review and planning for the upcoming week",
      date: "Today",
      time: "2:00 PM - 3:00 PM",
      location: "Conference Room A",
      type: "meeting",
      attendees: 8,
      organizer: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SC",
      },
      team: "Frontend Team",
      isVirtual: false,
      priority: "high",
    },
    {
      id: "E-002",
      title: "React Best Practices Workshop",
      description: "Learn advanced React patterns and performance optimization",
      date: "Tomorrow",
      time: "10:00 AM - 12:00 PM",
      location: "Main Auditorium",
      type: "workshop",
      attendees: 25,
      organizer: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MJ",
      },
      team: "ITC Hub",
      isVirtual: false,
      priority: "medium",
    },
    {
      id: "E-003",
      title: "Design System Review",
      description: "Monthly review of design components and guidelines",
      date: "Friday",
      time: "3:00 PM - 4:30 PM",
      location: "Design Studio",
      type: "review",
      attendees: 12,
      organizer: {
        name: "Emma Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "EW",
      },
      team: "Design Team",
      isVirtual: false,
      priority: "medium",
    },
    {
      id: "E-004",
      title: "ITC Hub Monthly All-Hands",
      description: "Company updates, achievements, and upcoming initiatives",
      date: "Next Monday",
      time: "9:00 AM - 10:00 AM",
      location: "Virtual Meeting",
      type: "all-hands",
      attendees: 150,
      organizer: {
        name: "Alex Rodriguez",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AR",
      },
      team: "Leadership",
      isVirtual: true,
      priority: "high",
    },
  ]

  const getEventTypeConfig = (type: string) => {
    switch (type) {
      case "meeting":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <Users className="h-3 w-3" />,
          bgGradient: "from-blue-500/10 to-blue-600/10",
          borderColor: "border-blue-500/20",
        }
      case "workshop":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: <Coffee className="h-3 w-3" />,
          bgGradient: "from-green-500/10 to-green-600/10",
          borderColor: "border-green-500/20",
        }
      case "review":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: <CalendarDays className="h-3 w-3" />,
          bgGradient: "from-yellow-500/10 to-yellow-600/10",
          borderColor: "border-yellow-500/20",
        }
      case "all-hands":
        return {
          color: "bg-purple-100 text-purple-800 border-purple-200",
          icon: <Video className="h-3 w-3" />,
          bgGradient: "from-purple-500/10 to-purple-600/10",
          borderColor: "border-purple-500/20",
        }
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <Calendar className="h-3 w-3" />,
          bgGradient: "from-gray-500/10 to-gray-600/10",
          borderColor: "border-gray-500/20",
        }
    }
  }

  const getDateColor = (date: string) => {
    if (date === "Today") return "text-red-600 font-semibold bg-red-100 px-2 py-1 rounded-full"
    if (date === "Tomorrow") return "text-orange-600 font-semibold bg-orange-100 px-2 py-1 rounded-full"
    return "text-muted-foreground bg-muted px-2 py-1 rounded-full"
  }

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="bg-gradient-to-r from-background to-muted/30 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg border border-green-500/20">
              <CalendarDays className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Upcoming Events</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Your scheduled meetings and events</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-green-500/5 hover:text-green-600 hover:border-green-500/20 bg-transparent"
          >
            View Calendar
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {events.map((event) => {
            const typeConfig = getEventTypeConfig(event.type)

            return (
              <div
                key={event.id}
                className={`p-5 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer group bg-gradient-to-r ${typeConfig.bgGradient} border-border/30 hover:${typeConfig.borderColor}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={`${typeConfig.color} flex items-center gap-1`}>
                        {typeConfig.icon}
                        {event.type.replace("-", " ")}
                      </Badge>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground font-medium">{event.team}</span>
                      <div className={`w-2 h-2 rounded-full ${getPriorityIndicator(event.priority)}`}></div>
                      {event.isVirtual && (
                        <Badge variant="outline" className="text-xs">
                          <Video className="h-3 w-3 mr-1" />
                          Virtual
                        </Badge>
                      )}
                    </div>

                    <h4 className="font-semibold text-sm mb-2 truncate group-hover:text-green-600 transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className={`text-xs font-medium ${getDateColor(event.date)}`}>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{event.attendees} attendees</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-background shadow-md">
                      <AvatarImage src={event.organizer.avatar || "/placeholder.svg"} alt={event.organizer.name} />
                      <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-green-500 to-green-600 text-white">
                        {event.organizer.initials}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs hover:bg-green-500/10 hover:text-green-600 hover:border-green-500/20 bg-transparent"
                    >
                      Join
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
