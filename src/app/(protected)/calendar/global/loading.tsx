// --- /calendar/global/loading.tsx ---
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function GlobalCalendarLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div><Skeleton className="h-9 w-48 rounded-md" /><Skeleton className="h-4 w-64 mt-3 rounded-md" /></div>
        <div className="flex gap-2"><Skeleton className="h-9 w-24 rounded-md" /><Skeleton className="h-9 w-24 rounded-md" /></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}><CardHeader className="flex flex-row items-center justify-between pb-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-4" /></CardHeader><CardContent><Skeleton className="h-8 w-12 mb-1" /><Skeleton className="h-3 w-24" /></CardContent></Card>
        ))}
      </div>
      <Skeleton className="h-10 w-full rounded-md" />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><Skeleton className="h-80 w-full rounded-md" /></div>
        <div><Skeleton className="h-80 w-full rounded-md" /></div>
      </div>
    </div>
  );
}
