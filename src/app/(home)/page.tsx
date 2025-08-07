// /app/(home)/page.tsx

import { fetchLandingPageData } from "./api";
import LandingClientPage from "./client";

/**
 * This is the main Server Component for the landing page route.
 * Its only job is to fetch data on the server, which allows for
 * efficient data loading and enables the use of Suspense for a
 * better loading experience via loading.tsx.
 */
export default async function ITCHubLandingPage() {
  // Fetch the initial data on the server.
  // The `loading.tsx` component will be shown while this data is being fetched.
  const initialData = await fetchLandingPageData();

  // Pass the server-fetched data as props to the Client Component.
  // This avoids a client-side data fetching waterfall and ensures the page
  // is fully populated with data upon initial load for great performance and SEO.
  return <LandingClientPage initialData={initialData} />;
}
