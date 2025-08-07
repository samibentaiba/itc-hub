// /calendar/global/page.tsx

import Link from "next/link";
import { fetchGlobalEvents } from "./api";
import GlobalCalendarClientPage from "./client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

/**
 * The main server component for the /calendar/global route.
 * Its only job is to fetch data on the server, which allows for
 * efficient data loading and enables the use of Suspense for a

 * better loading experience.
 */
export default async function GlobalCalendarPage() {
  // Fetch the initial data. The `loading.tsx` component will be shown
  // while this data is being fetched.
  const initialGlobalEvents = await fetchGlobalEvents();

  // Pass the server-fetched data as props to the Client Component.
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/calendar">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Personal calendar
          </Button>
        </Link>
      </div>
      <GlobalCalendarClientPage initialGlobalEvents={initialGlobalEvents} />
    </div>
  );
}
