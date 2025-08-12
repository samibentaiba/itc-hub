// ===== IMPROVED page.tsx =====
// src/app/(protected)/profile/page.tsx
import { fetchProfileData } from "../api";
import ProfileClientPage from "./client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default async function ProfilePage() {
  try {
    // Fetch the complete profile data object with error handling
    const profileData = await fetchProfileData();

    // If no profile data is returned, show error state
    if (!profileData) {
      return (
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20">
              <h2 className="text-2xl font-bold mb-2">Profile Not Available</h2>
              <p className="text-muted-foreground mb-6">
                Unable to load your profile data. Please try again later.
              </p>
              <Button asChild>
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Pass the fetched data to the Client Component
    return <ProfileClientPage profileData={profileData} />;
  } catch (error) {
    // Handle any server-side errors
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20">
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-6">
              There was an error loading your profile. Please refresh the page or try again later.
            </p>
            <div className="flex gap-3">
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}