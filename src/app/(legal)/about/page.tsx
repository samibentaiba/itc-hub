// src/app/(legal)/about/page.tsx
import AboutClient from "./client";
import { legalContent } from "@/lib/legal-content";

export const metadata = {
  title: "About Us - ITC Hub",
  description: "Learn about the Information Technology Community and our mission to empower students at BLIDA 01 University.",
};

export default function AboutPage() {
  return <AboutClient content={legalContent.about} />;
}