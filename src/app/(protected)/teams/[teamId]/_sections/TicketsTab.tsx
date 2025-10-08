// src/app/(protected)/teams/[teamId]/_sections/TicketsTab.tsx
"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageSquare, Users } from "lucide-react";
import { TeamDetail as Team, TeamTicket as Ticket } from "../types";
import { TabsContent } from "@/components/ui/tabs";

interface TicketsTabProps {
  team: Team;
  tickets: Ticket[];
}
export function TicketsTab({ team, tickets }:TicketsTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <Link key={ticket.id} href={`/tickets/${ticket.id}?from=/teams/${team.id}`}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer p-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{ticket.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {ticket.type}
                      </Badge>
                      <Badge
                        variant={
                          ticket.status === "verified"
                            ? "default"
                            : ticket.status === "in_progress"
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-xs"
                      >
                        {ticket.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {ticket.assignee && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {ticket.assignee}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Due {new Date(ticket.dueDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {ticket.messages} messages
                      </span>
                      <span>Last activity: {ticket.lastActivity}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {tickets.length === 0 && (
          <p className="text-muted-foreground text-center py-8">No tickets found for this team.</p>
        )}
      </div>
    </div>
  );
}
