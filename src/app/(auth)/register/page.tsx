// src/app/(auth)/register/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import RegisterClient from "./client";
import RegisterLoading from "./loading";

export const metadata: Metadata = {
  title: "Create Account | ITC Hub",
  description: "Join the Information Technology Community. Create your account to get started with ITC Hub.",
  robots: "noindex, nofollow",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterLoading />}>
      <RegisterClient />
    </Suspense>
  );
}
