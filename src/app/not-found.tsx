"use client";

import Link from "next/link";

export default function NotFound() {
  return (
      <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="mb-4 text-2xl font-medium">Page Not Found</h2>
        <p className="mb-8 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="text-primary hover:underline">
          Go back to Home
        </Link>
      </div>
  );
}
