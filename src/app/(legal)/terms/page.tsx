// src/app/(legal)/terms/page.tsx
import TermsClient from "./client";
import { legalContent } from "@/lib/legal-content";

export const metadata = {
  title: "Terms of Service - ITC Hub",
  description: "Read the terms and conditions for using ITC Hub platform.",
};

export default function TermsPage() {
  return (
    <TermsClient 
      content={legalContent.terms} 
      organizationInfo={legalContent.organization}
    />
  );
}