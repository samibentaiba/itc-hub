// src/app/(legal)/about/client.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import type { LegalContent } from "@/lib/legal-content";

interface AboutClientProps {
  content: LegalContent["about"];
}

export default function AboutClient({ content }: AboutClientProps) {
  const valueIcons = {
    Innovation: <Lightbulb className="h-6 w-6" />,
    Collaboration: <Users className="h-6 w-6" />,
    Inclusivity: <Heart className="h-6 w-6" />,
    Excellence: <Target className="h-6 w-6" />,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <Badge variant="outline" className="mb-4">
            Est. 2016
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            {content.hero.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {content.hero.subtitle}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Mission Section */}
        <section className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Target className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">{content.mission.title}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {content.mission.description}
          </p>
        </section>

        <Separator />

        {/* Story Section */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                {content.story.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.story.content.map((paragraph, idx) => (
                <p key={idx} className="text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Values Section */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Our Core Values</h2>
            <p className="text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.values.map((value, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    {valueIcons[value.title as keyof typeof valueIcons]}
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Events Section */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Our Signature Events</h2>
            <p className="text-muted-foreground">
              Empowering students through diverse learning experiences
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {content.events.map((event, idx) => (
              <Card key={idx} className="hover:border-primary transition-colors">
                <CardHeader>
                  <div className="text-4xl mb-2">{event.icon}</div>
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

        {/* Achievements Timeline */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Our Journey</h2>
            <p className="text-muted-foreground">
              Key milestones in our history
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            {content.achievements.map((achievement, idx) => (
              <div key={idx} className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-primary bg-background flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {achievement.year.slice(-2)}
                  </div>
                  {idx < content.achievements.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border mt-2" />
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

        {/* Future Goals */}
        <section>
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Rocket className="h-6 w-6 text-primary" />
                Looking Ahead
              </CardTitle>
              <CardDescription>
                Our vision for the future of ITC
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {content.futureGoals.map((goal, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{goal}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center py-12 border rounded-lg bg-gradient-to-b from-background to-muted/30">
          <h2 className="text-3xl font-bold mb-4">{content.cta.title}</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {content.cta.description}
          </p>
          <Button size="lg" asChild>
            <Link href="/register">
              {content.cta.buttonText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
}