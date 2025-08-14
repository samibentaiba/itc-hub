// ===== IMPROVED page.tsx =====
// src/app/(protected)/profile/page.tsx
import ProfileClientPage from "./client";
import { getProfileData } from "@/lib/server-api";

// This is a Server Component. 
// It fetches data on the server and passes it to the client component.
export default async function ProfilePage() {
  // Fetch profile data using the clean API
  const profile = await getProfileData();

  // Pass the server-fetched data as props to the client component.
  return <ProfileClientPage profileData={profile} />;
}