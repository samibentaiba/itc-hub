// /dashboard/loading.tsx

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * A skeleton loader for the dashboard page.
 * This component is displayed automatically via Next.js Suspense
 * while the server-side data fetching in page.tsx is in progress.
 */
export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div>
        <Skeleton className="h-9 w-48 rounded-md" />
        <Skeleton className="h-4 w-3/4 mt-3 rounded-md" />
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

      {/* Tickets List Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Skeleton className="h-6 w-1/3 rounded-md" />
              <Skeleton className="h-4 w-2/3 mt-2 rounded-md" />
            </div>
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-2 flex-1 mr-4">
                <Skeleton className="h-5 w-1/2 rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
              </div>
              <Skeleton className="h-5 w-5 rounded-md" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
