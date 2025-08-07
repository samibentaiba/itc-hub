// /app/(home)/loading.tsx

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * A skeleton loader for the landing page. This is automatically displayed
 * by Next.js Suspense while the server-side data fetching in page.tsx
 * is in progress, providing a better user experience.
 */
export default function LandingPageLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between py-4 border-b">
        <Skeleton className="h-10 w-28 rounded-md" />
        <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-20 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="text-center space-y-4 py-12">
        <Skeleton className="h-16 w-3/4 mx-auto rounded-md" />
        <Skeleton className="h-6 w-1/2 mx-auto mt-4 rounded-md" />
        <Skeleton className="h-12 w-40 mx-auto mt-6 rounded-md" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12 mb-2 rounded-md" />
              <Skeleton className="h-3 w-24 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievements Section Skeleton */}
       <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3 rounded-md" />
          <Skeleton className="h-4 w-2/3 mt-2 rounded-md" />
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
            <Skeleton className="h-56 w-full rounded-lg" />
            <Skeleton className="h-56 w-full rounded-lg" />
            <Skeleton className="h-56 w-full rounded-lg" />
        </CardContent>
      </Card>

      {/* Events Section Skeleton */}
      <Card>
        <CardHeader>
             <Skeleton className="h-6 w-1/3 rounded-md" />
             <Skeleton className="h-4 w-2/3 mt-2 rounded-md" />
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  );
}
