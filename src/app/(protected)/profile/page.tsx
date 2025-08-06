import { fetchProfileData } from "./api";
import ProfileClientPage from "./client";

// This is the Server Component.
// Its only job is to fetch the initial data on the server.
export default async function ProfilePage() {
  // Fetch the complete profile data object.
  const initialData = await fetchProfileData();

  // Pass the fetched data as a single prop to the Client Component.
  return (
    <ProfileClientPage 
      initialData={initialData} 
    />
  );
}
