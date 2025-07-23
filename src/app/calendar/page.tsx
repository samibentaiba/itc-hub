import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { CalendarView } from "@/components/calendar-view"

export default function CalendarPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Calendar" text="View and manage your schedule." />
      <CalendarView />
    </DashboardShell>
  )
}
