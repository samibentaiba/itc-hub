import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDepartmentById } from "@/lib/data-services";
import { DepartmentView } from "./client"; // Import the new client component

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
  const { departmentId } = await props.params;
  
  let department;
  try {
    department = await getDepartmentById(departmentId);
  } catch (error) {
    // Handle authorization errors
    if (error instanceof Error && error.message.includes('Forbidden')) {
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
                <h3 className="text-lg font-semibold">Access Denied</h3>
                <p className="text-muted-foreground">
                  You don&apos;t have permission to view this department.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    // Handle other errors
    throw error;
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
