import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { TeamsGrid } from "@/components/teams-grid"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function TeamsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Teams" text="Manage your teams and members.">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Team
        </Button>
      </DashboardHeader>
      <TeamsGrid />
    </DashboardShell>
  )
}
