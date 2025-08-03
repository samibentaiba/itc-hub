"use client";

import type React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Provider } from "@/components/provider";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect to login
  }

  if (!session?.user) {
    return null;
  }

  return <>        <Provider>
  {children}
</Provider></>;
}
