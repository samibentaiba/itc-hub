// src/app/(legal)/about/client.tsx
"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Lightbulb, 
  Users, 
  Heart, 
  Target, 
  Calendar,
  ArrowRight,
  Rocket,
  CheckCircle2,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import type { AboutContent } from "@/types/legal";

interface AboutClientProps {
  content: AboutContent;
}

const VALUE_ICONS: Record<string, LucideIcon> = {
  Innovation: Lightbulb,
  Collaboration: Users,
  Inclusivity: Heart,
  Excellence: Target,
};

const HeroSection = memo(({ title, subtitle }: { title: string; subtitle: string }) => (
  <section className="border-b ">
    <div className="container mx-auto px-4 py-16 text-center">
      <Badge variant="outline" className="mb-4">
        Est. 2016
      </Badge>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
        {title}
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  </section>
));
HeroSection.displayName = "HeroSection";

const MissionSection = memo(({ title, description }: { title: string; description: string }) => (
  <section className="text-center max-w-3xl mx-auto" aria-labelledby="mission-heading">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6" aria-hidden="true">
      <Target className="h-8 w-8 text-primary" />
    </div>
    <h2 id="mission-heading" className="text-3xl font-bold mb-4">{title}</h2>
    <p className="text-lg text-muted-foreground leading-relaxed">
      {description}
    </p>
  </section>
));
MissionSection.displayName = "MissionSection";

const StorySection = memo(({ title, content }: { title: string; content: string[] }) => (
  <section aria-labelledby="story-heading">
    <Card>
      <CardHeader>
        <CardTitle id="story-heading" className="text-2xl flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" aria-hidden="true" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {content.map((paragraph, idx) => (
          <p key={idx} className="text-muted-foreground leading-relaxed">
            {paragraph}
          </p>
        ))}
      </CardContent>
    </Card>
  </section>
));
StorySection.displayName = "StorySection";

const ValuesSection = memo(({ values }: { values: AboutContent["values"] }) => (
  <section aria-labelledby="values-heading">
    <div className="text-center mb-8">
      <h2 id="values-heading" className="text-3xl font-bold mb-2">Our Core Values</h2>
      <p className="text-muted-foreground">
        The principles that guide everything we do
      </p>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {values.map((value) => {
        const IconComponent = VALUE_ICONS[value.title] || Target;
        return (
          <Card key={value.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4" aria-hidden="true">
                <IconComponent className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">{value.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {value.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  </section>
));
ValuesSection.displayName = "ValuesSection";

const EventsSection = memo(({ events }: { events: AboutContent["events"] }) => (
  <section aria-labelledby="events-heading">
    <div className="text-center mb-8">
      <h2 id="events-heading" className="text-3xl font-bold mb-2">Our Signature Events</h2>
      <p className="text-muted-foreground">
        Empowering students through diverse learning experiences
      </p>
    </div>
    <div className="grid md:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.name} className="hover:border-primary transition-colors">
          <CardHeader>
            <div className="text-4xl mb-2" aria-hidden="true">{event.icon}</div>
            <CardTitle className="text-xl">{event.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {event.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
));
EventsSection.displayName = "EventsSection";

const AchievementsTimeline = memo(({ achievements }: { achievements: AboutContent["achievements"] }) => (
  <section aria-labelledby="journey-heading">
    <div className="text-center mb-8">
      <h2 id="journey-heading" className="text-3xl font-bold mb-2">Our Journey</h2>
      <p className="text-muted-foreground">
        Key milestones in our history
      </p>
    </div>
    <div className="max-w-3xl mx-auto space-y-6">
      {achievements.map((achievement, idx) => (
        <div key={achievement.year} className="flex gap-6 group">
          <div className="flex flex-col items-center">
            <div 
              className="w-12 h-12 rounded-full border-2 border-primary bg-background flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              aria-label={achievement.year}
            >
              {achievement.year.slice(-2)}
            </div>
            {idx < achievements.length - 1 && (
              <div className="w-0.5 flex-1 bg-border mt-2" aria-hidden="true" />
            )}
          </div>
          <Card className="flex-1 mb-6 group-hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{achievement.title}</CardTitle>
                <Badge variant="outline">{achievement.year}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {achievement.description}
              </p>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  </section>
));
AchievementsTimeline.displayName = "AchievementsTimeline";

const FutureGoalsSection = memo(({ goals }: { goals: string[] }) => (
  <section aria-labelledby="future-heading">
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <CardTitle id="future-heading" className="text-2xl flex items-center gap-2">
          <Rocket className="h-6 w-6 text-primary" aria-hidden="true" />
          Looking Ahead
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Our vision for the future of ITC
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3" role="list">
          {goals.map((goal, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-muted-foreground">{goal}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  </section>
));
FutureGoalsSection.displayName = "FutureGoalsSection";

const CTASection = memo(({ title, description, buttonText }: { 
  title: string; 
  description: string; 
  buttonText: string;
}) => (
  <section className="text-center py-12 border rounded-lg bg-gradient-to-b from-background to-muted/30">
    <h2 className="text-3xl font-bold mb-4">{title}</h2>
    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
      {description}
    </p>
    <Button size="lg" asChild>
      <Link href="/register">
        {buttonText}
        <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
      </Link>
    </Button>
  </section>
));
CTASection.displayName = "CTASection";

export default function AboutClient({ content }: AboutClientProps) {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection title={content.hero.title} subtitle={content.hero.subtitle} />
      
      <div className="container mx-auto px-4 py-12 space-y-16">
        <MissionSection title={content.mission.title} description={content.mission.description} />
        
        <Separator />
        
        <StorySection title={content.story.title} content={content.story.content} />
        
        <ValuesSection values={content.values} />
        
        <Separator />
        
        <EventsSection events={content.events} />
        
        <AchievementsTimeline achievements={content.achievements} />
        
        <FutureGoalsSection goals={content.futureGoals} />
        
        <CTASection 
          title={content.cta.title} 
          description={content.cta.description} 
          buttonText={content.cta.buttonText}
        />
      </div>
    </div>
  );
}