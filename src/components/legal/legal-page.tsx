// src/app/(legal)/legal-page.tsx
"use client";

import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

import { useState, useCallback, memo, type ReactNode, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, AlertTriangle, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { PolicyContent, TermsContent, Organization } from "@/types/legal";
import {
  LegalHero,
  TableOfContents,
  LegalSectionCard,
  RelatedLinks,
} from "@/components/legal/shared";

type LegalPageContent = PolicyContent | TermsContent;

interface LegalPageProps {
  content: LegalPageContent;
  organizationInfo: Organization;
  icon: LucideIcon;
  pageType: "policy" | "terms";
  showWarning?: boolean;
  warningContent?: ReactNode;
  contactCardContent?: {
    title: string;
    description: string;
  };
}

interface QuickLink {
  href: string;
  label: string;
}

const ImportantNotice = memo(({ content }: { content: ReactNode }) => (
  <Alert className="mb-8 max-w-4xl mx-auto border-amber-500/50 bg-amber-500/10">
    <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden="true" />
    <AlertDescription className="text-sm">{content}</AlertDescription>
  </Alert>
));
ImportantNotice.displayName = "ImportantNotice";

const QuickLinksSection = memo(({ links }: { links: QuickLink[] }) => (
  <div className="pt-6 mt-6 border-t">
    <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
      Quick Links
    </h3>
    <nav>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm"
              asChild
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  </div>
));
QuickLinksSection.displayName = "QuickLinksSection";

const ContactInfoCard = memo(
  ({
    organizationInfo,
    title,
    description,
  }: {
    organizationInfo: Organization;
    title: string;
    description: string;
  }) => (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardContent className="py-8">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-primary/10" aria-hidden="true">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            <dl className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <dt>
                  <Badge variant="outline" className="mt-0.5">
                    Email
                  </Badge>
                </dt>
                <dd>
                  <Link
                    href={`mailto:${organizationInfo.email}`}
                    className="text-primary hover:underline flex-1"
                  >
                    {organizationInfo.email}
                  </Link>
                </dd>
              </div>
              <div className="flex items-start gap-3">
                <dt>
                  <Badge variant="outline" className="mt-0.5">
                    Address
                  </Badge>
                </dt>
                <dd className="text-muted-foreground flex-1">
                  {organizationInfo.address}
                </dd>
              </div>
              <div className="flex items-start gap-3">
                <dt>
                  <Badge variant="outline" className="mt-0.5">
                    Organization
                  </Badge>
                </dt>
                <dd className="text-muted-foreground flex-1">
                  {organizationInfo.name}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  )
);
ContactInfoCard.displayName = "ContactInfoCard";

const getQuickLinks = (pageType: "policy" | "terms"): QuickLink[] => {
  const baseLinks: QuickLink[] = [
    { href: "/faq", label: "FAQ" },
    { href: "/about", label: "About" },
  ];

  if (pageType === "policy") {
    return [{ href: "/terms", label: "Terms of Service" }, ...baseLinks];
  } else {
    return [{ href: "/policy", label: "Privacy Policy" }, ...baseLinks];
  }
};

const getRelatedLinks = (pageType: "policy" | "terms"): QuickLink[] => {
  if (pageType === "policy") {
    return [
      { href: "/terms", label: "Terms of Service" },
      { href: "/faq", label: "Frequently Asked Questions" },
      { href: "/about", label: "About ITC Hub" },
    ];
  } else {
    return [
      { href: "/policy", label: "Privacy Policy" },
      { href: "/faq", label: "Frequently Asked Questions" },
      { href: "/about", label: "About ITC Hub" },
    ];
  }
};

const getContactContent = (pageType: "policy" | "terms") => {
  if (pageType === "policy") {
    return {
      title: "Questions About Your Privacy?",
      description:
        "If you have any concerns or questions about how we handle your data, we're here to help.",
    };
  } else {
    return {
      title: "Questions About Terms of Service?",
      description:
        "For questions, concerns, or complaints regarding these Terms of Service, please contact us.",
    };
  }
};

export default function LegalPage({
  content,
  organizationInfo,
  icon,
  pageType,
  showWarning = false,
  warningContent,
}: LegalPageProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isLastSection, setIsLastSection] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const sectionIds = content.sections.map((_, idx) => `section-${idx}`);

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const offset = 500;

      let currentSection: string | null = null;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const sectionTop = element.offsetTop;
          if (scrollPosition >= sectionTop - offset) {
            currentSection = id;
          }
        }
      }

      setActiveSection(currentSection);
      setIsLastSection(currentSection === sectionIds[sectionIds.length - 1]);
      setHasLoaded(true); // activate after first scroll check
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // run one time after mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [content.sections]);

  const scrollToSection = useCallback((index: number) => {
    const sectionId = `section-${index}`;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionId);
    }
  }, []);

  const quickLinks = getQuickLinks(pageType);
  const relatedLinks = getRelatedLinks(pageType);
  const contactContent = getContactContent(pageType);

  return (
    <LayoutGroup>
      <div className="min-h-screen bg-background">
        <LegalHero
          icon={icon}
          title={content.hero.title}
          subtitle={content.hero.subtitle}
          lastUpdated={content.hero.lastUpdated}
        />

        <main className="container mx-auto px-4 py-12">
          {showWarning && warningContent && (
            <ImportantNotice content={warningContent} />
          )}

          <div className="grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* ======= SIDEBAR ======= */}
            <aside className="lg:col-span-1" aria-label="Sidebar navigation">
              <div className="sticky top-4 space-y-2">
                <TableOfContents
                  sections={content.sections}
                  activeSection={activeSection}
                  onSectionClick={scrollToSection}
                />
                {hasLoaded ? (
                  <AnimatePresence mode="wait">
                    {!isLastSection && (
                      <motion.div
                        key="quick-links"
                        layoutId="shared-links"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      >
                        <QuickLinksSection links={quickLinks} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                ) : (
                  <QuickLinksSection links={quickLinks} />
                )}
              </div>
            </aside>

            {/* ======= MAIN CONTENT ======= */}
            <div className="lg:col-span-3 space-y-8">
              {content.sections.map((section, idx) => (
                <LegalSectionCard
                  key={idx}
                  section={section}
                  sectionId={`section-${idx}`}
                />
              ))}

              <ContactInfoCard
                organizationInfo={organizationInfo}
                title={contactContent.title}
                description={contactContent.description}
              />

              {/* This is where Quick Links "lands" */}
              <motion.div layoutId="shared-links">
                {isLastSection && (
                  <motion.div
                    key="related-docs"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <RelatedLinks links={relatedLinks} />
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </LayoutGroup>
  );
}
