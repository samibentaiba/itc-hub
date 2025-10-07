import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserTab } from "./UserTab";
import { TeamTab } from "./TeamTab";
import { DepartmentTab } from "./DepartmentTab";
import { CalendarTab } from "./CalendarTab";
import { RequestTab } from "./RequestTab";

/**
 * @component AdminTabs
 * @description Renders the main tabbed interface for the admin dashboard, delegating content rendering to specialized child components.
 * @param {object} props - The component props.
 * @returns {JSX.Element} - The rendered tabs component.
 */
export function AdminTabs({
  userData,
  teamData,
  departmentData,
  eventRequestData,
  calendarData,
  onSetModal,
  loadingAction,
}: any) {
  return (
    <Tabs defaultValue="users" className="space-y-4">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="teams">Teams</TabsTrigger>
        <TabsTrigger value="departments">Departments</TabsTrigger>
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
        <TabsTrigger value="requests">Event Requests</TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="space-y-4">
        <UserTab userData={userData} onSetModal={onSetModal} />
      </TabsContent>

      <TabsContent value="teams" className="space-y-4">
        <TeamTab teamData={teamData} onSetModal={onSetModal} />
      </TabsContent>

      <TabsContent value="departments" className="space-y-4">
        <DepartmentTab departmentData={departmentData} onSetModal={onSetModal} />
      </TabsContent>

      <TabsContent value="calendar" className="space-y-4">
        <CalendarTab calendarData={calendarData} />
      </TabsContent>

      <TabsContent value="requests" className="space-y-4">
        <RequestTab eventRequestData={eventRequestData} loadingAction={loadingAction} />
      </TabsContent>
    </Tabs>
  );
}