// src/app/(protected)/teams/[teamId]/client.tsx
"use client";

import type { TeamDetail, TeamTicket } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTeamDetailPage } from "./hook";
import { EventDetailsDialog } from "./_components/EventDetailsDialog";
import { RequestEventDialog } from "./_components/RequestEventDialog";

// Main Team Detail Client Component
interface TeamDetailClientPageProps {
  initialTeam: TeamDetail;
  initialTickets: TeamTicket[];
}
import { TeamHeader } from "./_sections/TeamHeader";
import { TicketsTab } from "./_sections/TicketsTab";
import { CalendarTab } from "./_sections/CalendarTab";
import { MembersTab } from "./_sections/MembersTab";

export default function TeamDetailClientPage({
  initialTeam,
  initialTickets,
}: TeamDetailClientPageProps) {
  const page = useTeamDetailPage(initialTeam, initialTickets);
  const {
    showNewEventDialog,
    setShowNewEventDialog,
    createEvent,
    selectedEvent,
    handleEditEvent,
    handleDeleteEvent,
    isCalendarLoading,
    setSelectedEvent,
  } = page;

  return (
    <div className="space-y-6">
      <TeamHeader {...page} />
      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="calendar">Team Calendar</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
          <TicketsTab {...page} />
        </TabsContent>

        <TabsContent value="calendar">
          <CalendarTab {...page} />
        </TabsContent>

        <TabsContent value="members">
          <MembersTab
            {...page}
            handleMemberAction={(member, action) =>
              page.handleMemberAction(action, member)
            }
          />
        </TabsContent>
      </Tabs>

      <RequestEventDialog
        isOpen={showNewEventDialog}
        onClose={() => setShowNewEventDialog(false)}
        onSubmit={createEvent}
        isLoading={isCalendarLoading}
        initialData={selectedEvent}
      />
      <EventDetailsDialog
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}
