import { getSettingsData } from "@/lib/data-services";
import SettingsClientPage from "./client";

// This is a Server Component. 
// It fetches data on the server and passes it to the client component.
export default async function SettingsPage() {
  // Fetch settings data using the clean API
  const settings = await getSettingsData();

  // Transform to match expected format
  const userSettings = {
    displayName: settings.profile?.name || '',
    email: settings.profile?.email || '',
    notifications: settings.notifications.email
  };

  // Pass the server-fetched data as props to the client component.
  return <SettingsClientPage initialSettings={userSettings} />;
}
