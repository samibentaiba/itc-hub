"use client";

import { Camera, Edit, Save, X, Lock, Github, Linkedin, Twitter, Globe, MapPin, Calendar, Mail, Phone, Layers, Building2 } from "lucide-react";
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useProfilePage } from "./hook";
import type { ProfileData } from "./types";

interface ProfileClientPageProps {
  initialData: ProfileData;
}

export default function ProfileClientPage({ initialData }: ProfileClientPageProps) {
  const {
    isEditing,
    profileData,
    tempData,
    stats,
    skills,
    projects,
    achievements,
    teams,
    departments,
    handleEdit,
    handleSave,
    handleCancel,
    handleInputChange,
    handleSocialLinkChange,
    getPriorityColor,
    getCategoryColor,
  } = useProfilePage(initialData);

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
              <Button variant="outline" onClick={handleCancel}><X className="h-4 w-4 mr-2" />Cancel</Button>
              <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" />Save Changes</Button>
            </>
          ) : (
            <Button onClick={handleEdit}><Edit className="h-4 w-4 mr-2" />Edit Profile</Button>
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
                    <AvatarImage src={profileData.avatar} alt={profileData.name} />
                    <AvatarFallback className="text-2xl">{profileData.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  {isEditing && (<Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full"><Camera className="h-4 w-4" /></Button>)}
                </div>

                {isEditing ? (
                  <div className="w-full space-y-4">
                    <div><Label htmlFor="name">Full Name</Label><Input id="name" value={tempData.name} onChange={(e) => handleInputChange("name", e.target.value)} /></div>
                    <div><Label htmlFor="title">Job Title</Label><Input id="title" value={tempData.title} onChange={(e) => handleInputChange("title", e.target.value)} /></div>
                    <div><Label htmlFor="location">Location</Label><Input id="location" value={tempData.location} onChange={(e) => handleInputChange("location", e.target.value)} /></div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold mb-1">{profileData.name}</h1>
                    <p className="text-muted-foreground mb-2">{profileData.title}</p>
                    <Badge variant="secondary" className="mb-4">{profileData.department}</Badge>
                    <div className="w-full space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /><span>{profileData.location}</span></div>
                      <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /><span>{profileData.email}</span></div>
                      <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /><span>{profileData.phone}</span></div>
                    </div>
                  </>
                )}

                <Separator className="my-4" />

                {/* Social Links */}
                {isEditing ? (
                  <div className="w-full space-y-3">
                    <Label>Social Links</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2"><Github className="h-4 w-4" /><Input placeholder="GitHub URL" value={tempData.socialLinks.github} onChange={(e) => handleSocialLinkChange("github", e.target.value)} /></div>
                      <div className="flex items-center gap-2"><Linkedin className="h-4 w-4" /><Input placeholder="LinkedIn URL" value={tempData.socialLinks.linkedin} onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)} /></div>
                      <div className="flex items-center gap-2"><Twitter className="h-4 w-4" /><Input placeholder="Twitter URL" value={tempData.socialLinks.twitter} onChange={(e) => handleSocialLinkChange("twitter", e.target.value)} /></div>
                      <div className="flex items-center gap-2"><Globe className="h-4 w-4" /><Input placeholder="Website URL" value={tempData.socialLinks.website} onChange={(e) => handleSocialLinkChange("website", e.target.value)} /></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    {profileData.socialLinks.github && (<Button variant="outline" size="icon" asChild><a href={profileData.socialLinks.github} target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4" /></a></Button>)}
                    {profileData.socialLinks.linkedin && (<Button variant="outline" size="icon" asChild><a href={profileData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="h-4 w-4" /></a></Button>)}
                    {profileData.socialLinks.twitter && (<Button variant="outline" size="icon" asChild><a href={profileData.socialLinks.twitter} target="_blank" rel="noopener noreferrer"><Twitter className="h-4 w-4" /></a></Button>)}
                    {profileData.socialLinks.website && (<Button variant="outline" size="icon" asChild><a href={profileData.socialLinks.website} target="_blank" rel="noopener noreferrer"><Globe className="h-4 w-4" /></a></Button>)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats & Security Cards... */}
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
              <Card><CardHeader><CardTitle>About</CardTitle></CardHeader><CardContent>{isEditing ? (<div><Label htmlFor="bio">Bio</Label><Textarea id="bio" value={tempData.bio} onChange={(e) => handleInputChange("bio", e.target.value)} rows={4} className="mt-2" /></div>) : (<p className="text-muted-foreground leading-relaxed">{profileData.bio}</p>)}</CardContent></Card>
              <Card><CardHeader><CardTitle>Skills & Expertise</CardTitle></CardHeader><CardContent className="space-y-4">{skills.map((skill) => (<div key={skill.name} className="space-y-2"><div className="flex justify-between text-sm"><span className="font-medium">{skill.name}</span><span className="text-muted-foreground">{skill.level}%</span></div><Progress value={skill.level} className="h-2" /></div>))}</CardContent></Card>
            </TabsContent>
            {/* Other Tabs Content... */}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
