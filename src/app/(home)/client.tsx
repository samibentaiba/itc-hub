// /app/(home)/client.tsx

"use client";

import { useLandingPage } from "./hook";
import type { LandingPageData } from "./types";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  MessageSquare,
  Clock,
} from "lucide-react";
import { HeaderLogo, FooterLogo } from "@/components/ui/logo";

interface LandingClientPageProps {
  initialData: LandingPageData;
}

/**
 * The main client component for the landing page. It receives pre-fetched
 * data and handles all rendering and user interactions via the useLandingPage hook.
 */
export default function LandingClientPage({ initialData }: LandingClientPageProps) {
  const {
    isLoading,
    showDialog,
    selectedStatCard,
    session,
    setShowDialog,
    handleGoToDashboard,
    handleStayHere,
    handleStatCardClick,
    handleQuickAction,
    getPriorityColor,
    getTrendIcon,
  } = useLandingPage();

  const { stats, achievements, events } = initialData;

  return (
    <div className="min-h-screen bg-background">
      {/* Confirmation Dialog for Logged-in Users */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome back, {session?.user?.name}!</DialogTitle>
            <DialogDescription>
              You are already logged in. Would you like to continue to your
              dashboard or stay on this page?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={handleStayHere}>
              Stay Here
            </Button>
            <Button onClick={handleGoToDashboard}>Go to Dashboard</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <HeaderLogo />
          </Link>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Register</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            Collaborate, Innovate, & <span className="text-primary">Succeed</span>.
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            ITC Hub is the central workspace for the Information Technology
            Community, designed to streamline projects, manage tasks, and foster
            seamless collaboration.
          </p>
          <Button
            size="lg"
            onClick={() => handleQuickAction("Join Community")}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Get Started"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </section>

        {/* Community Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => handleStatCardClick("Active Members")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {selectedStatCard === "Active Members" && isLoading ? "..." : stats.activeMembers.count}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {getTrendIcon(stats.activeMembers.trend)}
                <span>{stats.activeMembers.change}</span>
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
              <div className="text-2xl font-bold text-primary">
                {selectedStatCard === "Active Projects" && isLoading ? "..." : stats.activeProjects.count}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {getTrendIcon(stats.activeProjects.trend)}
                <span>{stats.activeProjects.change}</span>
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
              <div className="text-2xl font-bold text-primary">
                {selectedStatCard === "Completed Tasks" && isLoading ? "..." : stats.completedTasks.count}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {getTrendIcon(stats.completedTasks.trend)}
                <span>{stats.completedTasks.change}</span>
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
              <div className="text-2xl font-bold text-primary">
                {selectedStatCard === "Success Rate" && isLoading ? "..." : `${stats.successRate.count}%`}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {getTrendIcon(stats.successRate.trend)}
                <span>{stats.successRate.change}</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Achievements Section */}
        <section id="achievements">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Our Club&apos;s Achievements</CardTitle>
                    <CardDescription>Celebrating excellence and innovation in our community</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                    {achievements.map((achievement) => (
                        <Card key={achievement.id} className="hover:bg-accent/50 transition-colors flex flex-col">
                        <CardHeader className="pb-3 items-center">
                            <div className="flex items-center justify-center h-16 w-16 mb-4 rounded-lg bg-primary/10">
                            {achievement.category === "innovation" && <Trophy className="h-8 w-8 text-primary" />}
                            {achievement.category === "mentorship" && <Users className="h-8 w-8 text-primary" />}
                            {achievement.category === "excellence" && <Target className="h-8 w-8 text-primary" />}
                            </div>
                            <CardTitle className="text-lg text-center">{achievement.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 flex-grow flex flex-col">
                            <CardDescription className="text-center mb-4 flex-grow">{achievement.description}</CardDescription>
                            <div className="flex justify-center gap-2 mt-auto">
                            <Badge variant="outline">{achievement.type}</Badge>
                            <Badge variant={achievement.status === "completed" ? "default" : "secondary"}>{achievement.status}</Badge>
                            </div>
                        </CardContent>
                        </Card>
                    ))}
                    </div>
                </CardContent>
            </Card>
        </section>

        {/* Upcoming Events */}
        <section id="events">
            <Card>
                <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl">Upcoming Open Events</CardTitle>
                            <CardDescription>Join our community events and expand your knowledge</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleQuickAction("View All Events")} disabled={isLoading}>
                            {isLoading ? "Loading..." : "View All"}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    {events.map((event) => (
                        <div key={event.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors group gap-4">
                        <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                            <div className={`w-2.5 h-2.5 rounded-full ${getPriorityColor(event.priority)} flex-shrink-0`} />
                            <h4 className="font-medium group-hover:text-primary transition-colors">{event.title}</h4>
                            <Badge variant="outline" className="text-xs">{event.type}</Badge>
                            <Badge variant={event.status === "important" ? "destructive" : "secondary"} className="text-xs">{event.status}</Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> Due {new Date(event.dueDate).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {event.location}</span>
                            <span className="flex items-center gap-1.5"><MessageSquare className="h-3 w-3" /> {event.registered} registered</span>
                            </div>
                        </div>
                        <Button size="sm" onClick={() => handleQuickAction(event.type === "deadline" ? "Learn More" : "Register")} disabled={isLoading} className="w-full sm:w-auto">
                            {event.type === "deadline" ? "Learn More" : "Register"}
                        </Button>
                        </div>
                    ))}
                    </div>
                </CardContent>
            </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4">
            <Card className="border-0 shadow-none">
                <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <FooterLogo />
                        </Link>
                        <p className="text-sm text-muted-foreground">Empowering the IT Community through collaboration, innovation, and shared knowledge.</p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-semibold">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                        <li><Link href="#achievements" className="text-muted-foreground hover:text-primary transition-colors">Achievements</Link></li>
                        <li><Link href="#events" className="text-muted-foreground hover:text-primary transition-colors">Upcoming Events</Link></li>
                        <li><Link href="/signup" className="text-muted-foreground hover:text-primary transition-colors">Join Community</Link></li>
                        <li><Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">Member Login</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-semibold">Follow Us</h3>
                        <div className="flex space-x-2">
                        <Button variant="outline" size="icon" asChild><Link href="#"><Twitter className="h-4 w-4" /></Link></Button>
                        <Button variant="outline" size="icon" asChild><Link href="#"><Github className="h-4 w-4" /></Link></Button>
                        <Button variant="outline" size="icon" asChild><Link href="#"><Linkedin className="h-4 w-4" /></Link></Button>
                        </div>
                    </div>
                    </div>
                    <Separator className="my-6" />
                    <div className="text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} ITC Hub. All rights reserved.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </footer>
    </div>
  );
}
