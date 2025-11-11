// src/app/(home)/vlogs/[slug]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function VlogDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <article className="mx-auto max-w-4xl">
        <Skeleton className="h-5 w-32 mb-4 rounded-md" />
        
        <Skeleton className="h-96 w-full mb-8 rounded-lg" />
        
        <Skeleton className="h-12 w-3/4 mb-4 rounded-md" />
        
        <div className="mb-8 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-32 rounded-md" />
          </div>
          <Skeleton className="h-5 w-40 rounded-md" />
        </div>

        <Card className="my-8">
          <CardContent className="p-6">
            <Skeleton className="h-8 w-32 mb-4 rounded-md" />
            <div className="flex gap-4">
              <Skeleton className="h-64 flex-1 rounded-lg" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-4/5 rounded-md" />
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-20 rounded-md" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}