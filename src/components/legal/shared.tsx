// src/components/legal/shared.tsx
"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, FileText, ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { Organization, LegalSection } from "@/types/legal";

interface LegalHeroProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  lastUpdated?: string;
}

export const LegalHero = memo(({ icon: Icon, title, subtitle, lastUpdated }: LegalHeroProps) => (
  <header className="border-b ">
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6" aria-hidden="true">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          {subtitle}
        </p>
        {lastUpdated && (
          <p className="text-sm text-muted-foreground">
            <time dateTime={lastUpdated}>Last Updated: {lastUpdated}</time>
          </p>
        )}
      </div>
    </div>
  </header>
));
LegalHero.displayName = "LegalHero";

interface TableOfContentsProps {
  sections: LegalSection[];
  activeSection: string | null;
  onSectionClick: (index: number) => void;
}

export const TableOfContents = memo(({ sections, activeSection, onSectionClick }: TableOfContentsProps) => (
  <aside className="lg:col-span-1" aria-label="Table of contents">
    <div className="sticky top-4 space-y-2">
      <h2 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
        Table of Contents
      </h2>
      <nav>
        <ul className="space-y-1">
          {sections.map((section, idx) => (
            <li key={idx}>
              <Button
                variant="ghost"
                className={`w-full justify-start text-left h-auto py-2 px-3 ${
                  activeSection === `section-${idx}` ? "bg-accent" : ""
                }`}
                onClick={() => onSectionClick(idx)}
              >
                <ChevronRight className="h-4 w-4 mr-2 shrink-0" aria-hidden="true" />
                <span className="text-sm truncate">{section.title}</span>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </aside>
));
TableOfContents.displayName = "TableOfContents";

interface LegalSectionCardProps {
  section: LegalSection;
  sectionId: string;
}

export const LegalSectionCard = memo(({ section, sectionId }: LegalSectionCardProps) => (
  <Card id={sectionId} className="scroll-mt-4">
    <CardHeader>
      <CardTitle className="text-2xl flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
        {section.title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {section.content?.map((paragraph, pIdx) => (
        <p key={pIdx} className="text-muted-foreground leading-relaxed">
          {paragraph}
        </p>
      ))}

      {section.subsections && (
        <div className="space-y-6 mt-6">
          {section.subsections.map((subsection, sIdx) => (
            <article key={sIdx} className="pl-4 border-l-2 border-primary/20">
              <h3 className="font-semibold text-lg mb-3">
                {subsection.subtitle}
              </h3>
              <div className="space-y-2">
                {subsection.content.map((item, iIdx) => (
                  <p key={iIdx} className="text-muted-foreground leading-relaxed">
                    {item}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
));
LegalSectionCard.displayName = "LegalSectionCard";

interface ContactCardProps {
  organizationInfo: Organization;
}

export const ContactCard = memo(({ organizationInfo }: ContactCardProps) => (
  <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
    <CardContent className="py-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-full bg-primary/10" aria-hidden="true">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">
            Questions About Your Privacy?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            If you have any concerns or questions about how we handle your data, 
            we&apos;re here to help.
          </p>
          <dl className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <dt><Badge variant="outline">Email</Badge></dt>
              <dd>
                <Link 
                  href={`mailto:${organizationInfo.email}`}
                  className="text-primary hover:underline"
                >
                  {organizationInfo.email}
                </Link>
              </dd>
            </div>
            <div className="flex items-start gap-2">
              <dt><Badge variant="outline">Address</Badge></dt>
              <dd className="text-muted-foreground">
                {organizationInfo.address}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </CardContent>
  </Card>
));
ContactCard.displayName = "ContactCard";

interface RelatedLinksProps {
  links: Array<{ href: string; label: string }>;
}

export const RelatedLinks = memo(({ links }: RelatedLinksProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">Related Documents</CardTitle>
    </CardHeader>
    <CardContent>
      <nav>
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link href={link.href}>
                  {link.label}
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </CardContent>
  </Card>
));
RelatedLinks.displayName = "RelatedLinks";