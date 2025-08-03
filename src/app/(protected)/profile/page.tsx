"use client"

import { useState, useEffect } from "react"
import {
  Camera,
  Edit,
  Save,
  X,
  Lock,
  Github,
  Linkedin,
  Twitter,
  Globe,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Layers,
  Building2,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

interface Profile {
  id: string
  name: string
  email: string
  phone?: string
  title?: string
  department?: {
    id: string
    name: string
  }
  location?: string
  bio?: string
  avatar?: string
  socialLinks?: {
    github?: string
    linkedin?: string
    twitter?: string
    website?: string
  }
  createdAt: string
  updatedAt: string
}

interface ProfileStats {
  projectsCompleted: number
  teamsLed: number
  mentorshipHours: number
  contributions: number
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<Profile | null>(null)
  const [tempData, setTempData] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Load profile data
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true)
        // Get current user's profile
        const response = await api.profile.get()
        setProfileData(response)
        setTempData(response)
      } catch (error) {
        console.error('Error loading profile:', error)
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProfileData()
  }, [])

  const handleEdit = () => {
    setTempData(profileData)
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!tempData) return

    setIsSaving(true)
    try {
      const updatedProfile = await api.profile.update(tempData.id, {
        name: tempData.name,
        email: tempData.email,
        phone: tempData.phone,
        title: tempData.title,
        location: tempData.location,
        bio: tempData.bio,
        socialLinks: tempData.socialLinks,
      })

      setProfileData(updatedProfile)
      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setTempData(profileData)
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    if (!tempData) return
    setTempData({
      ...tempData,
      [field]: value,
    })
  }

  const handleSocialLinkChange = (platform: string, value: string) => {
    if (!tempData) return
    setTempData({
      ...tempData,
      socialLinks: {
        ...tempData.socialLinks,
        [platform]: value,
      },
    })
  }

  // Mock data for other sections (these would come from separate APIs)
  const stats: ProfileStats = {
    projectsCompleted: 47,
    teamsLed: 3,
    mentorshipHours: 120,
    contributions: 234,
  }

  const skills = [
    { name: "React", level: 95 },
    { name: "Node.js", level: 90 },
    { name: "TypeScript", level: 88 },
    { name: "Python", level: 85 },
    { name: "AWS", level: 80 },
    { name: "Docker", level: 75 },
  ]

  const currentProjects = [
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
    {
      id: 3,
      name: "API Modernization",
      role: "Senior Developer",
      progress: 30,
      priority: "Low",
      team: "Backend Team",
    },
  ]

  const achievements = [
    {
      id: 1,
      title: "Innovation Award 2023",
      description: "Outstanding contribution to platform architecture",
      date: "2023-12-01",
      category: "Innovation",
    },
    {
      id: 2,
      title: "Mentor of the Year",
      description: "Exceptional mentorship and knowledge sharing",
      date: "2023-06-15",
      category: "Leadership",
    },
    {
      id: 3,
      title: "Technical Excellence",
      description: "Delivered 5 major projects with zero critical bugs",
      date: "2023-03-20",
      category: "Technical",
    },
  ]

  const teams = [
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
  ]

  const departments = [
    {
      id: 1,
      name: "Engineering",
      role: "Senior Developer",
      isLead: false,
    },
  ]

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
      default:
        return "bg-gray-500"
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading profile...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Profile not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={profileData.avatar || "/placeholder.svg"} alt={profileData.name} />
                    <AvatarFallback className="text-2xl">
                      {profileData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full">
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {isEditing ? (
                  <div className="w-full space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={tempData?.name || ""}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        id="title"
                        value={tempData?.title || ""}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={tempData?.location || ""}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold mb-1">{profileData.name}</h1>
                    <p className="text-muted-foreground mb-2">{profileData.title || "No title set"}</p>
                    {profileData.department && (
                      <Badge variant="secondary" className="mb-4">
                        {profileData.department.name}
                      </Badge>
                    )}

                    <div className="w-full space-y-3 text-sm">
                      {profileData.location && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{profileData.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{profileData.email}</span>
                      </div>
                      {profileData.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{profileData.phone}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <Separator className="my-4" />

                {/* Social Links */}
                {isEditing ? (
                  <div className="w-full space-y-3">
                    <Label>Social Links</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Github className="h-4 w-4" />
                        <Input
                          placeholder="GitHub URL"
                          value={tempData?.socialLinks?.github || ""}
                          onChange={(e) => handleSocialLinkChange("github", e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4" />
                        <Input
                          placeholder="LinkedIn URL"
                          value={tempData?.socialLinks?.linkedin || ""}
                          onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Twitter className="h-4 w-4" />
                        <Input
                          placeholder="Twitter URL"
                          value={tempData?.socialLinks?.twitter || ""}
                          onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <Input
                          placeholder="Website URL"
                          value={tempData?.socialLinks?.website || ""}
                          onChange={(e) => handleSocialLinkChange("website", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    {profileData.socialLinks?.github && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={profileData.socialLinks.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {profileData.socialLinks?.linkedin && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={profileData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {profileData.socialLinks?.twitter && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={profileData.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {profileData.socialLinks?.website && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={profileData.socialLinks.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                )}
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
                <span className="font-semibold">{stats.projectsCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Teams Led</span>
                <span className="font-semibold">{stats.teamsLed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mentorship Hours</span>
                <span className="font-semibold">{stats.mentorshipHours}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contributions</span>
                <span className="font-semibold">{stats.contributions}</span>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Security</CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full gap-2 bg-transparent">
                    <Lock className="h-4 w-4" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>Enter your current password and choose a new one.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Update Password</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                  {isEditing ? (
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={tempData?.bio || ""}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        rows={4}
                        className="mt-2"
                      />
                    </div>
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">
                      {profileData.bio || "No bio available."}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={tempData?.email || ""}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={tempData?.phone || ""}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData.email}</span>
                      </div>
                      {profileData.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{profileData.phone}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {skills.map((skill) => (
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
                  {currentProjects.map((project) => (
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
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="flex gap-4 p-4 border rounded-lg">
                      <div className={`p-2 rounded-lg ${getCategoryColor(achievement.category)}`}>
                        <Calendar className="h-5 w-5 text-white" />
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
                  {teams.map((team) => (
                    <div key={team.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Layers className="h-4 w-4 text-primary" />
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
                  {departments.map((dept) => (
                    <div key={dept.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-secondary/50 rounded-lg">
                          <Building2 className="h-4 w-4 text-secondary-foreground" />
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
