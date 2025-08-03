"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  MapPin,
  Users,
  Building2,
  Trophy,
  Target,
  Twitter,
  Github,
  Linkedin,
  ArrowRight,
  TrendingUp,
  Activity,
  MessageSquare,
  Clock,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { LogoExamples } from "@/components/ui/logo-examples"
import { HeaderLogo, FooterLogo } from "@/components/ui/logo"

export default function ITCHubLanding() {
  const [selectedStatCard, setSelectedStatCard] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Community stats data
  const communityStats = {
    activeMembers: { count: 127, change: "+12 this month", trend: "up" },
    activeProjects: { count: 23, change: "+5 this week", trend: "up" },
    completedTasks: { count: 1247, change: "+89 this week", trend: "up" },
    successRate: { count: 94, change: "+2% from last month", trend: "up" },
  }
  const { data: session, status } = useSession()
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setShowDialog(true)
    }
  }, [status, session])

  const handleStayHere = () => {
    setShowDialog(false)
  }

  const handleGoToDashboard = () => {
    router.push("/dashboard")
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
          <p className="text-sm text-gray-500">Status: {status}</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-lg">Redirecting to login...</p>
          <p className="text-sm text-gray-500">Status: {status}</p>
        </div>
      </div>
    )
  }
  // Achievements data
  const achievements = [
    {
      id: "a1",
      title: "Innovation Award 2023",
      description: "Recognized for an outstanding contribution to platform architecture and system design.",
      type: "achievement",
      status: "completed",
      year: "2023",
      category: "innovation",
    },
    {
      id: "a2",
      title: "Mentor of the Year",
      description: "Awarded for exceptional mentorship and knowledge sharing within the community.",
      type: "recognition",
      status: "completed",
      year: "2023",
      category: "mentorship",
    },
    {
      id: "a3",
      title: "Technical Excellence",
      description: "Delivered 5 major projects with zero critical bugs, showcasing high-quality engineering.",
      type: "milestone",
      status: "ongoing",
      year: "2024",
      category: "excellence",
    },
  ]

  // Events data
  const upcomingEvents = [
    {
      id: "e1",
      title: "Tech Talk: AI in Development",
      type: "event",
      location: "Virtual Event",
      status: "upcoming",
      dueDate: "2025-03-15",
      registered: 12,
      organizer: "Tech Team",
      priority: "high",
    },
    {
      id: "e2",
      title: "Project Showcase Deadline",
      type: "deadline",
      location: "ITC Hub Platform",
      status: "important",
      dueDate: "2025-03-22",
      registered: 8,
      organizer: "Project Team",
      priority: "high",
    },
    {
      id: "e3",
      title: "Workshop: React Best Practices",
      type: "workshop",
      location: "Tech Lab 101",
      status: "upcoming",
      dueDate: "2025-03-29",
      registered: 24,
      organizer: "Frontend Team",
      priority: "medium",
    },
  ]

  const handleStatCardClick = async (cardType: string) => {
    setSelectedStatCard(cardType)
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast({
        title: `${cardType} Overview`,
        description: `Viewing ${cardType.toLowerCase()} statistics and details.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setSelectedStatCard(null)
    }
  }

  const handleQuickAction = async (action: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      switch (action) {
        case "Join Community":
          router.push("/signup")
          break
        case "View All Events":
          toast({
            title: "Events Calendar",
            description: "Opening events calendar...",
          })
          break
        case "Learn More":
          toast({
            title: "More Information",
            description: "Loading additional details...",
          })
          break
        default:
          toast({
            title: `Action: ${action}`,
            description: `Performing ${action.toLowerCase()}...`,
          })
      }
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Failed to perform action. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-500" />
      case "down":
        return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
      default:
        return <Activity className="h-3 w-3 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen">
            {/* Confirmation Dialog for Logged-in Users */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome back, {session?.user?.name}!</DialogTitle>
            <DialogDescription>
              You are already logged in. Would you like to continue to your dashboard or stay on this page?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={handleStayHere}>
              Stay Here
            </Button>
            <Button onClick={handleGoToDashboard}>
              Go to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <HeaderLogo />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-12">
          <h1 className="text-4xl md:text-6xl font-bold">
            Collaborate, Innovate, and <span className="text-red-500">Succeed</span>.
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            ITC Hub is the central workspace for the Information Technology Community, designed to streamline projects,
            manage tasks, and foster seamless collaboration.
          </p>
          <Button size="lg" onClick={() => handleQuickAction("Join Community")} disabled={isLoading}>
            {isLoading ? "Loading..." : "Get Started"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
      </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => handleStatCardClick("Active Members")}
          >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {selectedStatCard === "Active Members" && isLoading ? "..." : communityStats.activeMembers.count}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {getTrendIcon(communityStats.activeMembers.trend)}
                <span>{communityStats.activeMembers.change}</span>
              </div>
          </CardContent>
        </Card>

          <Card
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => handleStatCardClick("Active Projects")}
          >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {selectedStatCard === "Active Projects" && isLoading ? "..." : communityStats.activeProjects.count}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {getTrendIcon(communityStats.activeProjects.trend)}
                <span>{communityStats.activeProjects.change}</span>
              </div>
          </CardContent>
        </Card>

          <Card
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => handleStatCardClick("Completed Tasks")}
          >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {selectedStatCard === "Completed Tasks" && isLoading ? "..." : communityStats.completedTasks.count}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {getTrendIcon(communityStats.completedTasks.trend)}
                <span>{communityStats.completedTasks.change}</span>
              </div>
          </CardContent>
        </Card>

          <Card
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => handleStatCardClick("Success Rate")}
          >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {selectedStatCard === "Success Rate" && isLoading ? "..." : `${communityStats.successRate.count}%`}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {getTrendIcon(communityStats.successRate.trend)}
                <span>{communityStats.successRate.change}</span>
              </div>
          </CardContent>
        </Card>
      </div>

        {/* Achievements Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Our Club's Achievements</CardTitle>
                <CardDescription>Celebrating excellence and innovation in our community</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="hover:bg-accent/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 rounded-lg bg-red-500/10">
                      {achievement.category === "innovation" && <Trophy className="h-8 w-8 text-red-500" />}
                      {achievement.category === "mentorship" && <Users className="h-8 w-8 text-red-500" />}
                      {achievement.category === "excellence" && <Target className="h-8 w-8 text-red-500" />}
                    </div>
                    <CardTitle className="text-lg text-center">{achievement.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-center mb-4">{achievement.description}</CardDescription>
                    <div className="flex justify-center gap-2">
                      <Badge variant="outline">{achievement.type}</Badge>
                      <Badge variant={achievement.status === "completed" ? "default" : "secondary"}>
                        {achievement.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Open Events</CardTitle>
                <CardDescription>Join our community events and expand your knowledge</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction("View All Events")}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "View All"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors group"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(event.priority)}`} />
                      <h4 className="font-medium group-hover:text-red-500 transition-colors">{event.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                      <Badge
                        variant={
                          event.status === "upcoming"
                            ? "default"
                            : event.status === "important"
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {event.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Due {event.dueDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {event.registered} registered
                      </span>
                      <span>by {event.organizer}</span>
              </div>
            </div>
                  <Button
                    size="sm"
                    onClick={() => handleQuickAction(event.type === "deadline" ? "Learn More" : "Register")}
                    disabled={isLoading}
                  >
                    {event.type === "deadline" ? "Learn More" : "Register"}
                  </Button>
              </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Footer */}
        <Card>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Column 1: Logo and About */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <FooterLogo />
                </div>
                <p className="text-sm text-muted-foreground">
                  Empowering the Information Technology Community through collaboration, innovation, and shared
                  knowledge. Join us in building the future of technology.
                </p>
              </div>

              {/* Column 2: Quick Links */}
              <div className="space-y-4">
                <h3 className="font-semibold">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="#achievements" className="text-muted-foreground hover:text-red-500 transition-colors">
                      Our Achievements
                    </Link>
                  </li>
                  <li>
                    <Link href="#events" className="text-muted-foreground hover:text-red-500 transition-colors">
                      Upcoming Events
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup" className="text-muted-foreground hover:text-red-500 transition-colors">
                      Join Community
                    </Link>
                  </li>
                  <li>
                    <Link href="/login" className="text-muted-foreground hover:text-red-500 transition-colors">
                      Member Login
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Social Media */}
              <div className="space-y-4">
                <h3 className="font-semibold">Follow Us</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href="#">
                      <Twitter className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link href="#">
                      <Github className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link href="#">
                      <Linkedin className="h-4 w-4" />
                    </Link>
                  </Button>
            </div>
                <p className="text-sm text-muted-foreground">
                  Stay connected with our community and get the latest updates on projects and events.
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="text-center text-sm text-muted-foreground">
              <p>
                &copy; {new Date().getFullYear()} ITC Hub. All rights reserved. Built with ❤️ by the Information
                Technology Community.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}




