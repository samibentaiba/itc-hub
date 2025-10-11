import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { RequestsTable } from "./RequestsTable";

export function RequestTab({ eventRequestData, loadingAction }: RequestTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Requests</CardTitle>
        <CardDescription>Review and approve event submissions from teams and departments.</CardDescription>
      </CardHeader>
      <CardContent>
        <RequestsTable 
          pendingEvents={eventRequestData.pendingEvents}
          handleRejectEvent={eventRequestData.handleRejectEvent}
          handleAcceptEvent={eventRequestData.handleAcceptEvent}
          loadingAction={loadingAction}
        />
      </CardContent>
    </Card>
  );
}