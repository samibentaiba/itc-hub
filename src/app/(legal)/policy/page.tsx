// ============================================================

// src/app/(legal)/policy/page.tsx
import PolicyClient from "./client";
import { legalContent } from "@/lib/legal-content";

export const metadata = {
  title: "Privacy Policy - ITC Hub",
  description: "Learn how ITC Hub collects, uses, and protects your personal information.",
};

export default function PolicyPage() {
  return (
    <PolicyClient 
      content={legalContent.policy} 
      organizationInfo={legalContent.organization}
    />
  );
}