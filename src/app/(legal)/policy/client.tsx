// src/app/(legal)/policy/client.tsx
"use client";

import { Shield } from "lucide-react";
import type { PolicyContent, Organization } from "@/types/legal";
import LegalPage from "../../../components/legal/legal-page";

interface PolicyClientProps {
  content: PolicyContent;
  organizationInfo: Organization;
}

export default function PolicyClient({
  content,
  organizationInfo,
}: PolicyClientProps) {
  return (
    <LegalPage
      content={content}
      organizationInfo={organizationInfo}
      icon={Shield}
      pageType="policy"
    />
  );
}
