import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { TicketsTable } from "@/components/tickets-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function TicketsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Tickets" text="Manage your tickets and tasks.">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </DashboardHeader>
      <TicketsTable />
    </DashboardShell>
  )
}
