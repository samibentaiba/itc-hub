import { WorkspaceLayout } from "@/components/workspace-layout"
import { DashboardView } from "@/components/dashboard-view"

export default function HomePage() {
  return (
    <WorkspaceLayout>
      <DashboardView />
    </WorkspaceLayout>
  )
}
