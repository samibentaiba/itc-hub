"use client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { WorkspaceProvider } from "@/hooks/useWorkspace";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
        <WorkspaceProvider>
          {children}
          <Toaster />
        </WorkspaceProvider>
    </SessionProvider>
  );
}
