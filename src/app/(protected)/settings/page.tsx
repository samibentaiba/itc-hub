import { fetchUserSettings } from "./api";
import SettingsClientPage from "./client";

// This is the Server Component.
// Its only job is to fetch the initial data on the server.
export default async function SettingsPage() {
  // Fetch the initial user settings.
  const initialSettings = await fetchUserSettings();

  // Pass the fetched data as props to the Client Component.
  return (
    <SettingsClientPage 
      initialSettings={initialSettings} 
    />
  );
}
