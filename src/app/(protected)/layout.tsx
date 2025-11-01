"use client";

import type React from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [countdown, setCountdown] = useState(3); // State for the 3-second countdown

  useEffect(() => {
    // Handle authenticated users
    if (status === "authenticated" && session?.user) {
      return; // Exit early
    }

    // Handle unauthenticated users with a countdown
    if (status === "unauthenticated") {
      if (countdown === 0) {
        router.push("/login");
        return;
      }

      // Set up a timer to decrement the countdown
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      // Clean up the timer when the component unmounts or dependencies change
      return () => clearTimeout(timer);
    }

    // Explicitly return undefined on all other code paths to satisfy lint/TS rules
    return;
  }, [status, session, countdown, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
          <p className="text-sm text-gray-500">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center text-card-foreground  min-h-screen">
        <Card className="text-center p-8 bg-sidebar-accent rounded-lg shadow-md">
          <p className="text-xl font-semibold ">Access Denied</p>
          <p className="text-md mt-2">
            You must be logged in to access this page.
          </p>
          <p className="text-lg mt-4">
            Redirecting to login in{" "}
            <span className="font-bold text-red-500 w-8 inline-block text-center">
              {countdown}
            </span>{" "}
            seconds...
          </p>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
