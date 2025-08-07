/**
 * client.tsx
 *
 * This is the main client component for the department view. It has been refactored
 * to be a "container" component. Its primary responsibilities are to manage state
 * via the `useDepartmentView` hook and to compose the UI by rendering smaller,
 * more focused presentational components.
 */
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDepartmentView } from "./hook";
import { Department } from "./types";
import { DepartmentHeader } from "./_components/department_header";
import { TicketsTab } from "./_components/tickets_tab";
import { CalendarTab } from "./_components/calendar_tab";
import { TeamsTab } from "./_components/teams_tab";

interface DepartmentViewProps {
  departmentData: Department;
}

export function DepartmentView({ departmentData }: DepartmentViewProps) {
  // Use the custom hook to get all the necessary state and event handlers
  const {
    date,
    setDate,
    showNewTicket,
    setShowNewTicket,
    tickets,
    selectedDateTickets,
    calendarEvents,
    goToPreviousDay,
    goToNextDay,
  } = useDepartmentView({
    departmentName: departmentData.name,
  });

  // Render the layout and pass props down to the child components
  return (
    <div className="space-y-6">
      <DepartmentHeader
        department={departmentData}
        showNewTicket={showNewTicket}
        onOpenChange={setShowNewTicket}
      />

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Long-term Tickets</TabsTrigger>
          <TabsTrigger value="calendar">Department Calendar</TabsTrigger>
          <TabsTrigger value="teams">Supervised Teams</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
          <TicketsTab tickets={tickets} />
        </TabsContent>

        <TabsContent value="calendar">
          <CalendarTab
            date={date}
            setDate={setDate}
            calendarEvents={calendarEvents}
            selectedDateTickets={selectedDateTickets}
            goToPreviousDay={goToPreviousDay}
            goToNextDay={goToNextDay}
          />
        </TabsContent>

        <TabsContent value="teams">
          <TeamsTab teams={departmentData.teams} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
