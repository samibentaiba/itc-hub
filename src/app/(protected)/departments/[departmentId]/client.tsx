"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DepartmentHeader } from "./_components/DepartmentHeader";
import { TicketsTab } from "./_components/TicketsTab";
import { TeamsTab } from "./_components/TeamsTab";
import { MembersTab } from "./_components/MembersTab";
import { CalendarTab } from "./_components/CalendarTab";
import { useDepartmentView } from "./_hooks/useDepartmentView";
import type { Department } from "./types";

// The main data structure for the department page.
// The API should return an object with this shape.
interface DepartmentViewProps {
  departmentData: Department;
}

/**
 * The main client component for the department page.
 * It fetches data on the server and passes it to this component.
 * This component then uses hooks to manage state and renders the UI.
 * 
 * @param departmentData - The data for the department, fetched on the server.
 *                         The API endpoint should return a `Department` object.
 */
export function DepartmentView({ departmentData }: DepartmentViewProps) {
  // The useDepartmentView hook encapsulates the client-side logic for the page.
  const hookProps = useDepartmentView({
    tickets: departmentData.tickets,
    initialEvents: departmentData.events,
  });

  return (
    <div className="space-y-6">
      {/* The header component displays the department's name, description, and managers. */}
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

        {/* The TicketsTab component displays a list of tickets for the department. */}
        <TabsContent value="tickets">
          <TicketsTab tickets={departmentData.tickets} departmentId={departmentData.id} />
        </TabsContent>

        {/* The CalendarTab component displays the department's calendar and events. */}
        {/* It receives all the props from the useDepartmentView hook. */}
        <TabsContent value="calendar">
          <CalendarTab {...hookProps} />
        </TabsContent>

        {/* The TeamsTab component displays a list of teams in the department. */}
        <TabsContent value="teams">
          <TeamsTab teams={departmentData.teams} />
        </TabsContent>

        {/* The MembersTab component displays a list of members in the department. */}
        <TabsContent value="members">
          <MembersTab members={departmentData.members} />
        </TabsContent>
      </Tabs>
    </div>
  );
}