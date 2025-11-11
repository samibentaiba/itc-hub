// src/app/(home)/projects/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function ProjectsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="mb-8">
        <Skeleton className="h-10 w-48 mb-2 rounded-md" />
        <Skeleton className="h-5 w-96 rounded-md" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="p-0">
              <Skeleton className="h-48 w-full rounded-t-lg" />
            </CardHeader>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2 rounded-md" />
              <Skeleton className="h-4 w-full mb-1 rounded-md" />
              <Skeleton className="h-4 w-5/6 mb-3 rounded-md" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-3 w-24 rounded-md" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2 p-4 pt-0">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}