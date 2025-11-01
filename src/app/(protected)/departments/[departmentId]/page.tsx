import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DepartmentView } from "./client"; // Import the new client component
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NotAccessible } from "@/components/NotAccessible";

// Helper function for authenticated server-side fetch requests
async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headersList = await headers();
  const cookie = headersList.get("cookie");

  return fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(cookie && { Cookie: cookie }),
      ...options.headers,
    },
  });
}

// Define the props for the page, including params from the URL
interface PageProps {
  params: Promise<{
    departmentId: string;
  }>;
}

/**
 * This is an async Server Component for the department detail page.
 * It fetches data on the server and renders the UI.
 * While data is being fetched, Next.js will automatically show the `loading.tsx` component.
 * @param {PageProps} props - The page props, including URL parameters.
 */
export default async function DepartmentDetailPage(props: PageProps) {
  const session = await getServerSession(authOptions);
  // Fetch data on the server. This will suspend rendering until the data is ready.
  const { departmentId } = await props.params;

  const response = await authenticatedFetch(`/api/departments/${departmentId}`);

  if (response.status === 401 || response.status === 403) {
    return <NotAccessible />;
  }

  let department = null;

  if (response.ok) {
    department = await response.json();
  } else if (response.status !== 404) {
    throw new Error("Failed to fetch department");
  }

  // Handle the case where the department is not found
  if (!department) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/departments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Departments
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Department not found</h3>
              <p className="text-muted-foreground">
                The department you&apos;re looking for doesn&apos;t exist.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isMember = department.members.some(
    (member: { id: string }) => member.id === session?.user?.id
  );
  const isAdmin = session?.user?.role === "ADMIN";

  if (!isMember && !isAdmin) {
    return <NotAccessible />;
  }

  // Render the page with the fetched data
  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/departments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Departments
            </Button>
          </Link>
        </div>
      </div>

      {/* Pass the server-fetched data to the client component */}
      <DepartmentView departmentData={department} />
    </div>
  );
}
