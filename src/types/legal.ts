// src/types/legal.ts

export interface Organization {
  name: string;
  shortName: string;
  email: string;
  address: string;
  founded: string;
  website: string;
}

export interface HeroSection {
  title: string;
  subtitle: string;
  lastUpdated?: string;
}

export interface Mission {
  title: string;
  description: string;
}

export interface Story {
  title: string;
  content: string[];
}

export interface Value {
  title: string;
  description: string;
  icon?: string;
}

export interface Event {
  name: string;
  icon: string;
  description: string;
}

export interface Achievement {
  year: string;
  title: string;
  description: string;
}

export interface CallToAction {
  title: string;
  description: string;
  buttonText: string;
  email?: string;
}

export interface Question {
  question: string;
  answer: string;
}

export interface FAQCategory {
  id: string;
  name: string;
  icon: string;
  questions: Question[];
}

export interface LegalSection {
  title: string;
  content?: string[];
  subsections?: {
    subtitle: string;
    content: string[];
  }[];
}

export interface AboutContent {
  hero: HeroSection;
  mission: Mission;
  story: Story;
  values: Value[];
  events: Event[];
  achievements: Achievement[];
  futureGoals: string[];
  cta: CallToAction;
}

export interface FAQContent {
  hero: HeroSection;
  categories: FAQCategory[];
  contactCta: CallToAction;
}

export interface PolicyContent {
  hero: HeroSection;
  sections: LegalSection[];
}

export interface TermsContent {
  hero: HeroSection;
  sections: LegalSection[];
}

export interface LegalContent {
  organization: Organization;
  about: AboutContent;
  faq: FAQContent;
  policy: PolicyContent;
  terms: TermsContent;
}