"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  User,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Award,
  Briefcase,
  Users,
  Building2,
  Clock,
  Target,
  MessageCircle,
  UserPlus,
} from "lucide-react"
import { useUserProfile } from "./hook"

export default function UserProfilePage() {

  const { loading, user } = useUserProfile();
  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="lg:col-span-2">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">User not found</h3>
              <p className="text-muted-foreground">The user you're looking for doesn't exist.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{user.name}'s Profile</h1>
          <p className="text-muted-foreground">View public profile information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
          </Button>
          <Button variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Connect
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-lg text-muted-foreground">{user.realName}</p>
                  <Badge
                    variant={
                      user.role === "super_leader" ? "default" : user.role === "leader" ? "secondary" : "outline"
                    }
                    className="mt-2"
                  >
                    {user.role === "super_leader" ? "Super Leader" : user.role === "leader" ? "Leader" : "Member"}
                  </Badge>
                </div>

                {user.description && <p className="text-sm text-muted-foreground">{user.description}</p>}
              </div>

              <Separator className="my-4" />

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{user.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Social Links */}
              {(user.website || user.github || user.linkedin || user.twitter) && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Social Links</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.website && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={user.website} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {user.github && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={user.github} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {user.linkedin && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {user.twitter && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={user.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{user.stats.projectsCompleted}</div>
                  <div className="text-xs text-muted-foreground">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{user.stats.teamsLed}</div>
                  <div className="text-xs text-muted-foreground">Teams Led</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{user.stats.mentorshipHours}</div>
                  <div className="text-xs text-muted-foreground">Mentor Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{user.stats.codeReviews}</div>
                  <div className="text-xs text-muted-foreground">Code Reviews</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Info */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="work" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="work">Current Work</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="teams">Teams & Departments</TabsTrigger>
            </TabsList>

            {/* Current Work Tab */}
            <TabsContent value="work" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Current Projects
                  </CardTitle>
                  <CardDescription>Projects {user.name} is currently working on</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.currentWork.map((project: any) => (
                    <div key={project.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{project.title}</h4>
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                        </div>
                        <Badge
                          variant={
                            project.priority === "high"
                              ? "destructive"
                              : project.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {project.priority}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Achievements
                  </CardTitle>
                  <CardDescription>{user.name}'s accomplishments and recognitions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.achievements.map((achievement: any) => (
                    <div key={achievement.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <achievement.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{achievement.title}</h4>
                            <Badge variant="outline">{achievement.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(achievement.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Skills & Expertise
                  </CardTitle>
                  <CardDescription>{user.name}'s technical and professional skills</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.skills.map((skill: any) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Teams & Departments Tab */}
            <TabsContent value="teams" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Teams */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Teams
                    </CardTitle>
                    <CardDescription>Teams {user.name} is a member of</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {user.teams.map((team: any) => (
                      <div key={team.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{team.name}</h4>
                          <Badge variant="secondary">{team.role}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Joined: {new Date(team.joinDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Departments */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Departments
                    </CardTitle>
                    <CardDescription>Departments {user.name} belongs to</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {user.departments.map((department: any) => (
                      <div key={department.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{department.name}</h4>
                          <Badge variant="secondary">{department.role}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Joined: {new Date(department.joinDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Team and department memberships are managed by administrators and department leaders.</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
