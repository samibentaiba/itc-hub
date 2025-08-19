// src/app/(auth)/login/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import LoginClient from "./client";
import LoginLoading from "./loading";

export const metadata: Metadata = {
  title: "Sign In | ITC Hub",
  description: "Sign in to your ITC Hub account to access your dashboard and manage your tasks.",
  robots: "noindex, nofollow",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginClient />
    </Suspense>
  );
}
