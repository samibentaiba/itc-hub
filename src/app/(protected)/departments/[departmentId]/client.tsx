// src/app/(protected)/departments/[departmentId]/client.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDepartmentView } from "./hook";
import { TransformedDepartmentDetail } from "../../types";

// Import all the tab components
import { DepartmentHeader } from "./_components/department_header";
import { TicketsTab } from "./_components/tickets_tab";
import { TeamsTab } from "./_components/teams_tab";
import { MembersTab } from "./_components/members_tab";
import { CalendarTab } from "./_components/calendar_tab";

interface DepartmentViewProps {
  departmentData: TransformedDepartmentDetail;
}

export function DepartmentView({ departmentData }: DepartmentViewProps) {
  // Call the hook once and get all state and functions in a single object.
  // This fixes the "hookProps is not defined" error.
  const hookProps = useDepartmentView({
    tickets: departmentData.tickets,
    initialEvents: departmentData.events,
  });

  return (
    <div className="space-y-6">
      <DepartmentHeader
        department={departmentData}
        showNewTicket={hookProps.showNewTicket}
        onOpenChange={hookProps.setShowNewTicket}
      />

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Long-term Tickets</TabsTrigger>
          <TabsTrigger value="calendar">Department Calendar</TabsTrigger>
          <TabsTrigger value="teams">Supervised Teams</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
          <TicketsTab tickets={departmentData.tickets} departmentId={departmentData.id} />
        </TabsContent>

        <TabsContent value="calendar">
          {/* Pass all the props from the hook to the CalendarTab component */}
          <CalendarTab {...hookProps} />
        </TabsContent>

        <TabsContent value="teams">
          <TeamsTab teams={departmentData.teams} />
        </TabsContent>
        
        <TabsContent value="members">
          <MembersTab members={departmentData.members} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
