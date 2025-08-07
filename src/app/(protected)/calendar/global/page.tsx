// /calendar/global/page.tsx

import { fetchGlobalEvents } from "./api";
import GlobalCalendarClientPage from "./client";

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
    <GlobalCalendarClientPage initialGlobalEvents={initialGlobalEvents} />
  );
}
