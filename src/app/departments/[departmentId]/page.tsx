import { WorkspaceLayout } from "@/components/workspace-layout"
import { DepartmentView } from "@/components/department-view"

interface DepartmentPageProps {
  params: {
    departmentId: string
  }
}

export default function DepartmentPage({ params }: DepartmentPageProps) {
  return (
    <WorkspaceLayout>
      <DepartmentView departmentId={params.departmentId} />
    </WorkspaceLayout>
  )
}
