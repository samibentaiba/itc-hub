// src/app/(legal)/terms/client.tsx
"use client";

import { Scale } from "lucide-react";
import type { TermsContent, Organization } from "@/types/legal";
import LegalPage from "../../../components/legal/legal-page";

interface TermsClientProps {
  content: TermsContent;
  organizationInfo: Organization;
}

export default function TermsClient({
  content,
  organizationInfo,
}: TermsClientProps) {
  return (
    <LegalPage
      content={content}
      organizationInfo={organizationInfo}
      icon={Scale}
      pageType="terms"
      showWarning
      warningContent={
        <>
          <strong>Please read carefully:</strong> By using ITC Hub, you agree to
          be bound by these Terms of Service. If you do not agree to these
          terms, please do not use the platform.
        </>
      }
    />
  );
}
