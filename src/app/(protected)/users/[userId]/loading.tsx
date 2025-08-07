
/*
================================================================================
|                                 loading.tsx                                  |
================================================================================
| Description:                                                                 |
| This is the skeleton loader for the user profile page. It's a Server         |
| Component that Next.js automatically displays while the `page.tsx` is        |
| fetching data. This provides an immediate, responsive feel to the user.      |
================================================================================
*/
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function UserProfileLoading() {
  return (
    <div className="container mx-auto p-4 sm:p-6 animate-pulse">
      {/* Back Button Skeleton */}
      <Skeleton className="h-9 w-36 mb-6 rounded-md" />

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {/* Profile Sidebar Skeleton */}
        <div className="md:col-span-1 lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <Skeleton className="h-32 w-32 rounded-full mb-4" />
              <Skeleton className="h-7 w-40 mb-2 rounded-md" />
              <Skeleton className="h-4 w-48 mb-3 rounded-md" />
              <Skeleton className="h-6 w-24 mb-6 rounded-md" />
              <div className="flex gap-2 w-full">
                <Skeleton className="h-9 flex-1 rounded-md" />
                <Skeleton className="h-9 flex-1 rounded-md" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-28 rounded-md" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Skeleton */}
        <div className="md:col-span-2 lg:col-span-3">
            <div className="flex border-b mb-6">
                <Skeleton className="h-10 w-24 mr-2 rounded-t-md" />
                <Skeleton className="h-10 w-24 mr-2 rounded-t-md" />
                <Skeleton className="h-10 w-24 mr-2 rounded-t-md" />
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader><Skeleton className="h-6 w-24 rounded-md" /></CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-full rounded-md" />
                        <Skeleton className="h-4 w-full rounded-md" />
                        <Skeleton className="h-4 w-11/12 rounded-md" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><Skeleton className="h-6 w-32 rounded-md" /></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2"><Skeleton className="h-4 w-20 rounded-md" /><Skeleton className="h-2 w-full rounded-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-4 w-20 rounded-md" /><Skeleton className="h-2 w-full rounded-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-4 w-20 rounded-md" /><Skeleton className="h-2 w-full rounded-full" /></div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
