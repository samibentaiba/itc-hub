import SettingsClientPage from "./client";
import { headers } from 'next/headers';
import type { SettingsData } from "../types";

// Helper function for authenticated server-side fetch requests
async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headersList = await headers();
  const cookie = headersList.get('cookie');
  
  return fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(cookie && { Cookie: cookie }),
      ...options.headers,
    },
  });
}

// This is a Server Component. 
// It fetches data on the server and passes it to the client component.
export default async function SettingsPage() {
  // Fetch settings data directly from API
  const response = await authenticatedFetch('/api/settings');
  if (!response.ok) {
    throw new Error('Failed to fetch settings data');
  }
  const settings = await response.json();

  // Transform to match expected format
  const userSettings: SettingsData = {
    profile: settings.profile,
    notifications: settings.notifications,
    theme: settings.theme,
  };

  // Pass the server-fetched data as props to the client component.
  return <SettingsClientPage initialSettings={userSettings} />;
}
