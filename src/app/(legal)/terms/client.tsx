// src/app/(legal)/terms/client.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Scale, Calendar, Mail, FileText, ChevronRight, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { LegalContent } from "@/lib/legal-content";

interface TermsClientProps {
  content: LegalContent["terms"];
  organizationInfo: LegalContent["organization"];
}

export default function TermsClient({ content, organizationInfo }: TermsClientProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const scrollToSection = (index: number) => {
    const element = document.getElementById(`section-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(`section-${index}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Scale className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              {content.hero.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {content.hero.subtitle}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Last Updated: {content.hero.lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Important Notice */}
        <Alert className="mb-8 max-w-4xl mx-auto border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <AlertDescription className="text-sm">
            <strong>Please read carefully:</strong> By using ITC Hub, you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use the platform.
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="sticky top-4 space-y-2">
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                Table of Contents
              </h3>
              <nav className="space-y-1">
                {content.sections.map((section, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    className={`w-full justify-start text-left h-auto py-2 px-3 ${
                      activeSection === `section-${idx}` ? "bg-accent" : ""
                    }`}
                    onClick={() => scrollToSection(idx)}
                  >
                    <ChevronRight className="h-4 w-4 mr-2 shrink-0" />
                    <span className="text-sm truncate">{section.title}</span>
                  </Button>
                ))}
              </nav>

              {/* Quick Links */}
              <div className="pt-6 mt-6 border-t">
                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                  Quick Links
                </h3>
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start text-sm" asChild>
                    <Link href="/policy">Privacy Policy</Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm" asChild>
                    <Link href="/faq">FAQ</Link>
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {content.sections.map((section, idx) => (
              <Card key={idx} id={`section-${idx}`} className="scroll-mt-4">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.content && section.content.map((paragraph, pIdx) => (
                    <p key={pIdx} className="text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}

                  {section.subsections && (
                    <div className="space-y-6 mt-6">
                      {section.subsections.map((subsection, sIdx) => (
                        <div key={sIdx} className="pl-4 border-l-2 border-primary/20">
                          <h4 className="font-semibold text-lg mb-3">
                            {subsection.subtitle}
                          </h4>
                          <div className="space-y-2">
                            {subsection.content.map((item, iIdx) => (
                              <p key={iIdx} className="text-muted-foreground leading-relaxed">
                                {item}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Acceptance Card */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="py-8">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <Scale className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">
                      By Using ITC Hub, You Agree
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                      Your continued use of ITC Hub constitutes acceptance of these Terms of Service 
                      and our Privacy Policy. If you have questions or concerns, please contact us 
                      before using the platform.
                    </p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href={`mailto:${organizationInfo.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Us
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  For questions, concerns, or complaints regarding these Terms of Service:
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5">Email</Badge>
                    <Link 
                      href={`mailto:${organizationInfo.email}`}
                      className="text-primary hover:underline flex-1"
                    >
                      {organizationInfo.email}
                    </Link>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5">Address</Badge>
                    <span className="text-muted-foreground flex-1">
                      {organizationInfo.address}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5">Organization</Badge>
                    <span className="text-muted-foreground flex-1">
                      {organizationInfo.name}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-between" asChild>
                  <Link href="/policy">
                    Privacy Policy
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-between" asChild>
                  <Link href="/faq">
                    Frequently Asked Questions
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-between" asChild>
                  <Link href="/about">
                    About ITC Hub
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}