import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { UsersTable } from "@/components/users-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function UsersPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Users" text="Manage your team members.">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New User
        </Button>
      </DashboardHeader>
      <UsersTable />
    </DashboardShell>
  )
}
