// ===== IMPROVED page.tsx =====
// src/app/(protected)/profile/page.tsx
import ProfileClientPage from "./client";
import { headers } from 'next/headers';

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
export default async function ProfilePage() {
  // Fetch profile data directly from API
  const response = await authenticatedFetch('/api/profile');
  if (!response.ok) {
    throw new Error('Failed to fetch profile data');
  }
  const profile = await response.json();

  // Pass the server-fetched data as props to the client component.
  return <ProfileClientPage profileData={profile} />;
}