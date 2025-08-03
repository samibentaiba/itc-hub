"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Mail,
  MessageCircle,
  MapPin,
  Calendar,
  Award,
  Users,
  Briefcase,
  Star,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

// Type definitions
type UserSkill = {
  name: string;
  level: number;
}

type UserProject = {
  id: number;
  name: string;
  role: string;
  progress: number;
  priority: string;
  team: string;
}

type UserAchievement = {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

type UserTeam = {
  id: number;
  name: string;
  role: string;
  members: number;
  isLead: boolean;
}

type UserDepartment = {
  id: number;
  name: string;
  role: string;
  isLead: boolean;
}

type UserStats = {
  projectsCompleted: number;
  teamsLed: number;
  mentorshipHours: number;
  contributions: number;
}

type UserSocialLinks = {
  github?: string;
  linkedin: string;
  twitter?: string;
}

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string;
  department: string;
  location: string;
  joinDate: string;
  bio: string;
  stats: UserStats;
  skills: UserSkill[];
  socialLinks: UserSocialLinks;
  currentProjects: UserProject[];
  achievements: UserAchievement[];
  teams: UserTeam[];
  departments: UserDepartment[];
}

// Mock user data - in a real app, this would come from an API
const mockUsers = {
  sami: {
    id: "sami",
    name: "Sami Al-Rashid",
    email: "sami@itchub.com",
    avatar: "/placeholder.svg?height=128&width=128",
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "Dubai, UAE",
    joinDate: "2022-03-15",
    bio: "Passionate full-stack developer with 8+ years of experience building scalable web applications. Love mentoring junior developers and contributing to open source projects.",
    stats: {
      projectsCompleted: 47,
      teamsLed: 3,
      mentorshipHours: 120,
      contributions: 234,
    },
    skills: [
      { name: "React", level: 95 },
      { name: "Node.js", level: 90 },
      { name: "TypeScript", level: 88 },
      { name: "Python", level: 85 },
      { name: "AWS", level: 80 },
      { name: "Docker", level: 75 },
    ],
    socialLinks: {
      github: "https://github.com/sami",
      linkedin: "https://linkedin.com/in/sami",
      twitter: "https://twitter.com/sami",
    },
    currentProjects: [
      {
        id: 1,
        name: "ITC Hub Platform",
        role: "Lead Developer",
        progress: 85,
        priority: "High",
        team: "Core Engineering",
      },
      {
        id: 2,
        name: "Mobile App Development",
        role: "Technical Advisor",
        progress: 60,
        priority: "Medium",
        team: "Mobile Team",
      },
    ],
    achievements: [
      {
        id: 1,
        title: "Innovation Award 2023",
        description: "Outstanding contribution to platform architecture",
        date: "2023-12-01",
        category: "Innovation",
        icon: Award,
      },
      {
        id: 2,
        title: "Mentor of the Year",
        description: "Exceptional mentorship and knowledge sharing",
        date: "2023-06-15",
        category: "Leadership",
        icon: Users,
      },
      {
        id: 3,
        title: "Technical Excellence",
        description: "Delivered 5 major projects with zero critical bugs",
        date: "2023-03-20",
        category: "Technical",
        icon: Star,
      },
    ],
    teams: [
      {
        id: 1,
        name: "Core Engineering",
        role: "Team Lead",
        members: 8,
        isLead: true,
      },
      {
        id: 2,
        name: "Architecture Committee",
        role: "Senior Member",
        members: 5,
        isLead: false,
      },
    ],
    departments: [
      {
        id: 1,
        name: "Engineering",
        role: "Senior Developer",
        isLead: false,
      },
    ],
  },
  yasmine: {
    id: "yasmine",
    name: "Yasmine Hassan",
    email: "yasmine@itchub.com",
    avatar: "/placeholder.svg?height=128&width=128",
    title: "UX/UI Designer",
    department: "Design",
    location: "Cairo, Egypt",
    joinDate: "2021-08-20",
    bio: "Creative UX/UI designer focused on creating intuitive and beautiful user experiences. Passionate about accessibility and inclusive design.",
    stats: {
      projectsCompleted: 32,
      teamsLed: 2,
      mentorshipHours: 85,
      contributions: 156,
    },
    skills: [
      { name: "Figma", level: 98 },
      { name: "Adobe XD", level: 92 },
      { name: "User Research", level: 88 },
      { name: "Prototyping", level: 90 },
      { name: "HTML/CSS", level: 75 },
      { name: "Design Systems", level: 85 },
    ],
    socialLinks: {
      linkedin: "https://linkedin.com/in/yasmine",
      twitter: "https://twitter.com/yasmine",
    },
    currentProjects: [
      {
        id: 1,
        name: "Design System Overhaul",
        role: "Lead Designer",
        progress: 70,
        priority: "High",
        team: "Design Team",
      },
    ],
    achievements: [
      {
        id: 1,
        title: "Design Excellence Award",
        description: "Outstanding user experience design",
        date: "2023-09-15",
        category: "Design",
        icon: Award,
      },
    ],
    teams: [
      {
        id: 3,
        name: "Design Team",
        role: "Senior Designer",
        members: 6,
        isLead: false,
      },
    ],
    departments: [
      {
        id: 2,
        name: "Design",
        role: "Senior Designer",
        isLead: false,
      },
    ],
  },
  ali: {
    id: "ali",
    name: "Ali Mohammed",
    email: "ali@itchub.com",
    avatar: "/placeholder.svg?height=128&width=128",
    title: "DevOps Engineer",
    department: "Infrastructure",
    location: "Riyadh, Saudi Arabia",
    joinDate: "2020-11-10",
    bio: "DevOps engineer specializing in cloud infrastructure and automation. Expert in containerization and CI/CD pipelines.",
    stats: {
      projectsCompleted: 28,
      teamsLed: 1,
      mentorshipHours: 95,
      contributions: 189,
    },
    skills: [
      { name: "AWS", level: 95 },
      { name: "Docker", level: 92 },
      { name: "Kubernetes", level: 88 },
      { name: "Terraform", level: 85 },
      { name: "Jenkins", level: 80 },
      { name: "Python", level: 78 },
    ],
    socialLinks: {
      github: "https://github.com/ali",
      linkedin: "https://linkedin.com/in/ali",
    },
    currentProjects: [
      {
        id: 1,
        name: "Infrastructure Modernization",
        role: "Lead DevOps",
        progress: 45,
        priority: "High",
        team: "Infrastructure Team",
      },
    ],
    achievements: [
      {
        id: 1,
        title: "Infrastructure Hero",
        description: "Reduced deployment time by 80%",
        date: "2023-07-10",
        category: "Technical",
        icon: Award,
      },
    ],
    teams: [
      {
        id: 4,
        name: "Infrastructure Team",
        role: "Senior DevOps",
        members: 4,
        isLead: false,
      },
    ],
    departments: [
      {
        id: 3,
        name: "Infrastructure",
        role: "Senior Engineer",
        isLead: false,
      },
    ],
  },
}

export default function UserProfilePage() {
  const params = useParams()
  const userId = params.userId as string
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const userData = mockUsers[userId as keyof typeof mockUsers]
      setUser(userData || null)
      setLoading(false)
    }, 1000)
  }, [userId])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <div className="h-64 bg-muted rounded"></div>
            </div>
            <div className="md:col-span-2">
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
            <p className="text-muted-foreground mb-4">The user profile you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/users">
              <Button>Browse All Users</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "innovation":
        return "bg-purple-500"
      case "leadership":
        return "bg-blue-500"
      case "technical":
        return "bg-green-500"
      case "design":
        return "bg-pink-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/users">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-2xl">
                    {user.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
                <p className="text-muted-foreground mb-2">{user.title}</p>
                <Badge variant="secondary" className="mb-4">
                  {user.department}
                </Badge>

                <div className="flex gap-2 mb-6">
                  <Button size="sm" className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Mail className="h-4 w-4" />
                    Connect
                  </Button>
                </div>

                <div className="w-full space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Social Links */}
                <div className="flex gap-2">
                  {user.socialLinks.github && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {user.socialLinks.linkedin && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {user.socialLinks.twitter && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Projects</span>
                <span className="font-semibold">{user.stats.projectsCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Teams Led</span>
                <span className="font-semibold">{user.stats.teamsLed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mentorship Hours</span>
                <span className="font-semibold">{user.stats.mentorshipHours}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contributions</span>
                <span className="font-semibold">{user.stats.contributions}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="work">Current Work</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Bio */}
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{user.bio}</p>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.skills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="work" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Projects</CardTitle>
                  <CardDescription>Active projects and responsibilities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.currentProjects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{project.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {project.role} • {project.team}
                          </p>
                        </div>
                        <Badge variant={getPriorityColor(project.priority) as "default" | "secondary" | "destructive" | "outline"}>{project.priority}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Achievements & Recognition</CardTitle>
                  <CardDescription>Awards and accomplishments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex gap-4 p-4 border rounded-lg">
                      <div className={`p-2 rounded-lg ${getCategoryColor(achievement.category)}`}>
                        <achievement.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-semibold">{achievement.title}</h4>
                          <Badge variant="outline">{achievement.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teams" className="space-y-6">
              {/* Teams */}
              <Card>
                <CardHeader>
                  <CardTitle>Team Memberships</CardTitle>
                  <CardDescription>Teams and working groups</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {user.teams.map((team) => (
                    <div key={team.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{team.name}</h4>
                          <p className="text-sm text-muted-foreground">{team.members} members</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={team.isLead ? "default" : "secondary"}>{team.role}</Badge>
                        {team.isLead && (
                          <Badge variant="outline" className="text-xs">
                            Leader
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Departments */}
              <Card>
                <CardHeader>
                  <CardTitle>Department Memberships</CardTitle>
                  <CardDescription>Organizational departments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {user.departments.map((dept) => (
                    <div key={dept.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-secondary/50 rounded-lg">
                          <Briefcase className="h-4 w-4 text-secondary-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium">{dept.name}</h4>
                          <p className="text-sm text-muted-foreground">Department</p>
                        </div>
                      </div>
                      <Badge variant="outline">{dept.role}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
