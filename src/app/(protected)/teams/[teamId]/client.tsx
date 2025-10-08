// src/app/(protected)/teams/[teamId]/client.tsx
"use client";

import type { TeamDetail, TeamTicket } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTeamView } from "./_hooks/useTeamView";
import { EventDetailsDialog } from "./_components/EventDetailsDialog";
import { RequestEventDialog } from "./_components/RequestEventDialog";

// Main Team Detail Client Component
interface TeamDetailClientPageProps {
  initialTeam: TeamDetail;
  initialTickets: TeamTicket[];
}
import { TeamHeader } from "./_components/TeamHeader";
import { TicketsTab } from "./_sections/TicketsTab";
import { CalendarTab } from "./_sections/CalendarTab";
import { MembersTab } from "./_sections/MembersTab";

export default function TeamDetailClientPage({
  initialTeam,
  initialTickets,
}: TeamDetailClientPageProps) {
  const {
    showEditTeam,
    setShowEditTeam,
    showDeleteAlert,
    setShowDeleteAlert,
    handleUpdateTeam,
    handleDeleteTeam,
    ...calendarProps
  } = useTeamView({
    tickets: initialTickets,
    initialEvents: initialTeam.events,
    teamId: initialTeam.id,
  });

  return (
    <div className="space-y-6">
      <TeamHeader 
        team={initialTeam}
        showEditTeam={showEditTeam}
        onEditOpenChange={setShowEditTeam}
        showDeleteAlert={showDeleteAlert}
        onDeleteOpenChange={setShowDeleteAlert}
        onUpdate={handleUpdateTeam}
        onDelete={handleDeleteTeam}
      />
      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="calendar">Team Calendar</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
          <TicketsTab team={initialTeam} tickets={initialTickets} />
        </TabsContent>

        <TabsContent value="calendar">
          <CalendarTab {...calendarProps} />
        </TabsContent>

        <TabsContent value="members">
          <MembersTab team={initialTeam} handleMemberAction={() => {}} />
        </TabsContent>
      </Tabs>
    </div>
  );
}