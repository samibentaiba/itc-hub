"use client";

import React, { useState } from "react";
import { Camera, Edit, Save, X, Github, Linkedin, Twitter, Globe, MapPin, Mail, Phone, Award, Users, Star, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { ProfileDataLocal, UserProfileLocal } from "../types";

interface ProfileClientPageProps {
  profileData: ProfileDataLocal;
}

// Icon mapping for achievements - must be on client side
const achievementIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Innovation: Award,
  Leadership: Users,
  Technical: Star,
  Design: Award,
};

export default function ProfileClientPage({ profileData }: ProfileClientPageProps) {
  const { toast } = useToast();
  
  // State management - simplified from the hook pattern
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfileLocal>(profileData.profile);
  const [tempProfile, setTempProfile] = useState<UserProfileLocal>(profileData.profile);

  // Helper functions - following the user route pattern
  const getPriorityColor = (priority: string): "destructive" | "default" | "secondary" | "outline" => {
    switch (priority.toLowerCase()) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "innovation": return "bg-purple-500";
      case "leadership": return "bg-blue-500";
      case "technical": return "bg-green-500";
      case "design": return "bg-pink-500";
      default: return "bg-gray-500";
    }
  };

  // Simplified event handlers
  const handleEdit = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempProfile(profile);
  };

  const handleInputChange = (field: keyof UserProfileLocal, value: string) => {
    setTempProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialLinkChange = (platform: keyof UserProfileLocal['socialLinks'], value: string) => {
    setTempProfile(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {/* Profile Sidebar */}
        <div className="md:col-span-1 lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback className="text-4xl">
                      {profile.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="absolute bottom-0 right-0 rounded-full"
                    >
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
                        value={tempProfile.name} 
                        onChange={(e) => handleInputChange("name", e.target.value)} 
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Job Title</Label>
                      <Input 
                        id="title" 
                        value={tempProfile.title} 
                        onChange={(e) => handleInputChange("title", e.target.value)} 
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        value={tempProfile.location} 
                        onChange={(e) => handleInputChange("location", e.target.value)} 
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold mb-1">{profile.name}</h1>
                    <p className="text-muted-foreground mb-2">{profile.title}</p>
                    <Badge variant="secondary" className="mb-4">{profile.department}</Badge>
                    
                    <div className="w-full space-y-3 text-sm text-left">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span>{profile.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <span>{profile.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span>{profile.phone}</span>
                      </div>
                    </div>
                  </>
                )}

                <Separator className="my-6" />

                {/* Social Links Section */}
                {isEditing ? (
                  <div className="w-full space-y-3">
                    <Label>Social Links</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Github className="h-4 w-4" />
                        <Input 
                          placeholder="GitHub URL" 
                          value={tempProfile.socialLinks.github || ""} 
                          onChange={(e) => handleSocialLinkChange("github", e.target.value)} 
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4" />
                        <Input 
                          placeholder="LinkedIn URL" 
                          value={tempProfile.socialLinks.linkedin || ""} 
                          onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)} 
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Twitter className="h-4 w-4" />
                        <Input 
                          placeholder="Twitter URL" 
                          value={tempProfile.socialLinks.twitter || ""} 
                          onChange={(e) => handleSocialLinkChange("twitter", e.target.value)} 
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <Input 
                          placeholder="Website URL" 
                          value={tempProfile.socialLinks.website || ""} 
                          onChange={(e) => handleSocialLinkChange("website", e.target.value)} 
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    {profile.socialLinks.github && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {profile.socialLinks.linkedin && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {profile.socialLinks.twitter && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {profile.socialLinks.website && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Projects Completed</span>
                <span className="font-semibold">{profileData.stats.projectsCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Teams Led</span>
                <span className="font-semibold">{profileData.stats.teamsLed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mentorship Hours</span>
                <span className="font-semibold">{profileData.stats.mentorshipHours}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Code Contributions</span>
                <span className="font-semibold">{profileData.stats.contributions}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Tabs */}
        <div className="md:col-span-2 lg:col-span-3">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="work">Current Work</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              {/* About Section */}
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
                        value={tempProfile.bio} 
                        onChange={(e) => handleInputChange("bio", e.target.value)} 
                        rows={4} 
                        className="mt-2" 
                      />
                    </div>
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
                  )}
                </CardContent>
              </Card>

              {/* Skills Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profileData.skills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>{skill.name}</span>
                        <span className="text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="work" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Projects</CardTitle>
                  <CardDescription>Active projects and responsibilities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profileData.projects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{project.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {project.role} • {project.team}
                          </p>
                        </div>
                        <Badge variant={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
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

            <TabsContent value="achievements" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Achievements & Recognition</CardTitle>
                  <CardDescription>Key awards and accomplishments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profileData.achievements.map((achievement) => {
                    const Icon = achievementIconMap[achievement.category] || Star;
                    return (
                      <div key={achievement.id} className="flex gap-4 p-4 border rounded-lg">
                        <div className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg ${getCategoryColor(achievement.category)}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-semibold">{achievement.title}</h4>
                            <Badge variant="outline">{achievement.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(achievement.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long' 
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teams" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Memberships</CardTitle>
                  <CardDescription>Current teams and working groups</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profileData.teams.map((team) => (
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
                        {team.isLead && <Badge variant="outline" className="text-xs">Leader</Badge>}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department Memberships</CardTitle>
                  <CardDescription>Official organizational departments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profileData.departments.map((dept) => (
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
  );
}