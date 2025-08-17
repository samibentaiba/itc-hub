/**
 * components/department/TicketsTab.tsx
 *
 * This component renders the content for the "Long-term Tickets" tab.
 * It maps over the tickets data and displays each one in a Card.
 */
import Link from "next/link";
import { Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "./../types"; // Adjust path as needed

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
                  {/* Use priority instead of type (which doesn't exist in API) */}
                  <Badge variant="outline">{ticket.priority}</Badge>
                  {/* Status badge */}
                  <Badge variant={
                    ticket.status === "in_progress" ? "secondary" : 
                    ticket.status === "open" ? "outline" : 
                    "default"
                  }>
                    {ticket.status.replace("_", " ")}
                  </Badge>
                </div>
                {/* Ticket Metadata */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  {/* Fixed: Render assignee name instead of the whole object */}
                  {ticket.assignee && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Assigned to: {ticket.assignee.name}
                    </span>
                  )}
                  {/* Show reporter information */}
                  {ticket.reporter && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Reporter: {ticket.reporter.name}
                    </span>
                  )}
                  {/* Show created date */}
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Created: {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                  {/* Show due date if available */}
                  {ticket.dueDate && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Due: {new Date(ticket.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  {/* Show last updated */}
                  <span>Last updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                </div>
                {/* Show description if available */}
                {ticket.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                    {ticket.description}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    ))}
  </div>
);