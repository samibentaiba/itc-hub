import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { DepartmentsGrid } from "@/components/departments-grid"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function DepartmentsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Departments" text="Manage your departments and members.">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Department
        </Button>
      </DashboardHeader>
      <DepartmentsGrid />
    </DashboardShell>
  )
}
