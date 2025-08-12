import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDepartmentById, transformDepartmentForDetail } from "../../api"; // Use central API
import { DepartmentView } from "./client"; // Import the new client component

// Define the props for the page, including params from the URL
interface PageProps {
  params: {
    departmentId: string;
  };
}

/**
 * This is an async Server Component for the department detail page.
 * It fetches data on the server and renders the UI.
 * While data is being fetched, Next.js will automatically show the `loading.tsx` component.
 * @param {PageProps} props - The page props, including URL parameters.
 */
export default async function DepartmentDetailPage(props: { params: { departmentId: string } }) {
  // Fetch data on the server. This will suspend rendering until the data is ready.
  const department = await getDepartmentById(props.params.departmentId);

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

  // Transform the department data to match the expected format
  const transformedDepartment = transformDepartmentForDetail(department);

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
      <DepartmentView departmentData={transformedDepartment} />
    </div>
  );
}
