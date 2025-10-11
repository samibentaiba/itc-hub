import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";

export function RequestsTable({ pendingEvents, handleRejectEvent, handleAcceptEvent, loadingAction }: RequestsTableProps) {
  if (pendingEvents.length === 0) {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
              No pending event requests.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader><TableRow><TableHead>Event Title</TableHead><TableHead>Submitted By</TableHead><TableHead>Date & Time</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
      <TableBody>
        {pendingEvents.map((event: PendingEvent) => (
          <TableRow key={event.id}>
            <TableCell>
              <div className="font-medium">{event.title}</div>
              <div className="text-xs text-muted-foreground truncate">{event.description}</div>
            </TableCell>
            <TableCell><Badge variant={event.submittedByType === "team" ? "secondary" : "outline"}>{event.submittedBy}</Badge></TableCell>
            <TableCell>
              <div>{new Date(event.date).toLocaleDateString()}</div>
              <div className="text-xs text-muted-foreground">{event.time}</div>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm" className="mr-2" onClick={() => handleRejectEvent(event)} disabled={!!loadingAction}><X className="h-4 w-4 mr-1" />Reject</Button>
              <Button size="sm" onClick={() => handleAcceptEvent(event)} disabled={!!loadingAction}><Check className="h-4 w-4 mr-1" />Accept</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}