// ============================================================

// src/app/(legal)/faq/page.tsx
import FAQClient from "./client";
import { legalContent } from "@/lib/legal-content";

export const metadata = {
  title: "FAQ - ITC Hub",
  description: "Find answers to frequently asked questions about ITC Hub, accounts, departments, teams, and more.",
};

export default function FAQPage() {
  return <FAQClient content={legalContent.faq} />;
}
