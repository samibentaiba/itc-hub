
/*
================================================================================
|                                   page.tsx                                   |
================================================================================
| Description:                                                                 |
| This is the main Server Component for the dynamic user profile route         |
| (`/users/[userId]`). Its job is to extract the `userId` from the URL, use it |
| to fetch the specific user's data via the `api.ts` module, and then pass     |
| that data to the `UserProfileClientPage` component. If the user is not       |
| found, it displays a "Not Found" message.                                    |
================================================================================
*/
import { getUserById } from "../../api"; // Updated import from clean API
import UserProfileClientPage from "./client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Define the props for the page, which includes URL parameters.
interface PageProps {
  params: {
    userId: string;
  };
}

// This is the main Server Component for the dynamic route.
export default async function UserProfilePage(props: PageProps) {
  // Extract the userId from the URL parameters.
  const { userId } = props.params;

  // Fetch the specific user's data on the server.
  const user = await getUserById(userId);

  // If no user is found for the given ID, render a "Not Found" state.
  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
            <Button variant="outline" size="sm" asChild>
              <Link href="/users">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Users
              </Link>
            </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20">
            <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
            <p className="text-muted-foreground mb-6">The user profile you're looking for doesn't exist or could not be loaded.</p>
            <Button asChild>
                <Link href="/users">Browse All Users</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If the user is found, render the Client Component and pass the data as a prop.
  return <UserProfileClientPage user={user} />;
}
