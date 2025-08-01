"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Mail,
  Lock,
  Camera,
  Edit,
  Save,
  X,
  Calendar,
  MapPin,
  Phone,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Users,
  Building2,
  Shield,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProfile } from "./hook"

export default function ProfilePage() {
  const {
    userProfile,
    editForm,
    setEditForm,
    passwordForm,
    setPasswordForm,
    isEditing,
    setIsEditing,
    isLoading,
    showPasswordDialog,
    setShowPasswordDialog,
    handleSaveProfile,
    handleChangePassword,
    handleAvatarUpload,
    getRoleBadgeVariant,
    getPriorityColor,
    getAchievementTypeColor,
  } = useProfile()
  return (
    <div className="container mx-auto p-4 max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <User className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
            My Profile
          </h1>
          <p className="text-muted-foreground">Manage your personal information and view your achievements</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setEditForm({
                    name: userProfile.name,
                    realName: userProfile.realName,
                    description: userProfile.description,
                    phone: userProfile.phone,
                    location: userProfile.location,
                    website: userProfile.website,
                    github: userProfile.github,
                    linkedin: userProfile.linkedin,
                    twitter: userProfile.twitter,
                  })
                }}
                disabled={isLoading}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="work">Current Work</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="teams">Teams & Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your basic profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Display Name</Label>
                          <Input
                            id="name"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            placeholder="Your display name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="realName">Full Name</Label>
                          <Input
                            id="realName"
                            value={editForm.realName}
                            onChange={(e) => setEditForm({ ...editForm, realName: e.target.value })}
                            placeholder="Your full legal name"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Bio</Label>
                        <Textarea
                          id="description"
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          placeholder="Tell us about yourself..."
                          className="min-h-[100px]"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            placeholder="Your phone number"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={editForm.location}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                            placeholder="Your location"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{userProfile.name}</p>
                          <p className="text-sm text-muted-foreground">{userProfile.realName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{userProfile.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{userProfile.phone}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{userProfile.location}</p>
                      </div>
                      <div className="pt-2">
                        <p className="text-sm text-muted-foreground">{userProfile.description}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                  <CardDescription>Your professional and social media profiles</CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="website"
                            value={editForm.website}
                            onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="github">GitHub</Label>
                        <div className="flex items-center gap-2">
                          <Github className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="github"
                            value={editForm.github}
                            onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                            placeholder="your-username"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <div className="flex items-center gap-2">
                          <Linkedin className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="linkedin"
                            value={editForm.linkedin}
                            onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                            placeholder="your-profile"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter</Label>
                        <div className="flex items-center gap-2">
                          <Twitter className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="twitter"
                            value={editForm.twitter}
                            onChange={(e) => setEditForm({ ...editForm, twitter: e.target.value })}
                            placeholder="@your-handle"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {userProfile.website && (
                        <div className="flex items-center gap-3">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={userProfile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {userProfile.website}
                          </a>
                        </div>
                      )}
                      {userProfile.github && (
                        <div className="flex items-center gap-3">
                          <Github className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`https://github.com/${userProfile.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            @{userProfile.github}
                          </a>
                        </div>
                      )}
                      {userProfile.linkedin && (
                        <div className="flex items-center gap-3">
                          <Linkedin className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`https://linkedin.com/in/${userProfile.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {userProfile.linkedin}
                          </a>
                        </div>
                      )}
                      {userProfile.twitter && (
                        <div className="flex items-center gap-3">
                          <Twitter className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`https://twitter.com/${userProfile.twitter.replace("@", "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {userProfile.twitter}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Profile Picture and Stats */}
            <div className="space-y-6">
              {/* Profile Picture */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24 ring-4 ring-red-500/20">
                      <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name} />
                      <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-600 text-white text-2xl">
                        {userProfile.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background"
                      onClick={handleAvatarUpload}
                      disabled={isLoading}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{userProfile.name}</p>
                    <Badge variant={getRoleBadgeVariant(userProfile.role)} className="mt-1">
                      {userProfile.role.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Joined {new Date(userProfile.joinedDate).toLocaleDateString()}</p>
                    <p>Last active {new Date(userProfile.lastActive).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Projects Completed</span>
                    </div>
                    <span className="font-bold text-green-600">{userProfile.stats.projectsCompleted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Teams Led</span>
                    </div>
                    <span className="font-bold text-blue-600">{userProfile.stats.teamsLed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Mentorship Hours</span>
                    </div>
                    <span className="font-bold text-purple-600">{userProfile.stats.mentorshipHours}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">This Month</span>
                    </div>
                    <span className="font-bold text-orange-600">{userProfile.stats.contributionsThisMonth}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {userProfile.skills.map((skill) => (
                    <div key={skill.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{skill.name}</span>
                        <span className="text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Security */}
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Lock className="mr-2 h-4 w-4" />
                        Change Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>Update your account password</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowPasswordDialog(false)} disabled={isLoading}>
                            Cancel
                          </Button>
                          <Button onClick={handleChangePassword} disabled={isLoading}>
                            {isLoading ? "Changing..." : "Change Password"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="work" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Work</CardTitle>
              <CardDescription>Projects and tasks you're currently working on</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userProfile.currentWork.map((work) => (
                <div key={work.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">{work.title}</h3>
                      <p className="text-sm text-muted-foreground">{work.description}</p>
                    </div>
                    <Badge className={cn("text-xs", getPriorityColor(work.priority))}>
                      {work.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{work.progress}%</span>
                    </div>
                    <Progress value={work.progress} className="h-2" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {new Date(work.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Your accomplishments and recognitions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userProfile.achievements.map((achievement) => (
                  <div key={achievement.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1 space-y-1">
                        <h3 className="font-medium">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={cn("text-xs", getAchievementTypeColor(achievement.type))}>
                            {achievement.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(achievement.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Teams */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Teams
                </CardTitle>
                <CardDescription>Teams you're a member of (managed by team leaders)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userProfile.teams.map((team) => (
                  <div key={team.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{team.name}</h3>
                      <Badge variant={team.role === "leader" ? "default" : "secondary"}>{team.role}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Joined: {new Date(team.joinedDate).toLocaleDateString()}</p>
                      <p>{team.members} members</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Departments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-500" />
                  Departments
                </CardTitle>
                <CardDescription>Departments you belong to (managed by super leaders)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userProfile.departments.map((dept) => (
                  <div key={dept.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{dept.name}</h3>
                      <Badge variant={dept.role === "super_leader" ? "destructive" : "default"}>
                        {dept.role.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Joined: {new Date(dept.joinedDate).toLocaleDateString()}</p>
                      <p>{dept.teams} teams</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                Membership Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Team and department memberships are managed by administrators, team leaders,
                  and department super leaders. If you need to join a team or department, please contact the relevant
                  leader or an administrator.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
