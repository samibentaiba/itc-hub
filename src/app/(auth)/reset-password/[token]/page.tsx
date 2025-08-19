// src/app/(auth)/reset-password/[token]/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import ResetPasswordClient from "./client";
import ResetPasswordLoading from "./loading";

export const metadata: Metadata = {
  title: "Reset Password | ITC Hub",
  description: "Reset your password using the secure reset link sent to your email.",
  robots: "noindex, nofollow",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordClient />
    </Suspense>
  );
}
