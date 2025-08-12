/**
 * components/department/TicketsTab.tsx
 *
 * This component renders the content for the "Long-term Tickets" tab.
 * It maps over the tickets data and displays each one in a Card.
 */
import Link from "next/link";
import { Clock, MessageSquare, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TransformedDepartmentDetail } from "../../types";

// Define local type for Ticket
type Ticket = TransformedDepartmentDetail['tickets'][0];

interface TicketsTabProps {
  tickets: Ticket[];
  departmentId: string;
}

export const TicketsTab = ({ tickets , departmentId }: TicketsTabProps) => (
  <div className="grid gap-4">
    {tickets.map((ticket) => (
      <Link key={ticket.id} href={`/tickets/${ticket.id}?from=/departments/${departmentId}`}>
        <Card className="hover:bg-accent/50 transition-colors cursor-pointer p-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                {/* Ticket Title and Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium">{ticket.title}</h3>
                  <Badge variant="outline">{ticket.type}</Badge>
                  {ticket.collaborative && <Badge variant="secondary">Collaborative</Badge>}
                  <Badge variant={ticket.status === "in_progress" ? "secondary" : ticket.status === "scheduled" ? "outline" : "destructive"}>
                    {ticket.status.replace("_", " ")}
                  </Badge>
                </div>
                {/* Ticket Metadata */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  {ticket.assignee && (
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{ticket.assignee}</span>
                  )}
                  {ticket.collaborative && ticket.collaborators.length > 0 && (
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{ticket.collaborators.join(", ")}</span>
                  )}
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Duration: {ticket.duration}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{ticket.messages} messages</span>
                  <span>Last activity: {ticket.lastActivity}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    ))}
  </div>
);