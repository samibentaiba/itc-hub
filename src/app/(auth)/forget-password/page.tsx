// src/app/(auth)/forget-password/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import ForgetPasswordClient from "./client";
import ForgetPasswordLoading from "./loading";

export const metadata: Metadata = {
  title: "Forgot Password | ITC Hub",
  description: "Reset your password to regain access to your ITC Hub account.",
  robots: "noindex, nofollow",
};

export default function ForgetPasswordPage() {
  return (
    <Suspense fallback={<ForgetPasswordLoading />}>
      <ForgetPasswordClient />
    </Suspense>
  );
}
