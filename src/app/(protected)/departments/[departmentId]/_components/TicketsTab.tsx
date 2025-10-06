"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock } from "lucide-react";
import type { Ticket } from "../types";

interface TicketsTabProps {
  tickets: Ticket[];
  departmentId: string;
}

export function TicketsTab({ tickets, departmentId }: TicketsTabProps) {
  return (
    <div className="grid gap-4">
      {tickets.map((ticket) => (
        <Link key={ticket.id} href={`/tickets/${ticket.id}?from=/departments/${departmentId}`}>
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer p-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium">{ticket.title}</h3>
                    <Badge variant="outline">{ticket.priority}</Badge>
                    <Badge variant={
                      ticket.status === "in_progress" ? "secondary" :
                        ticket.status === "open" ? "outline" :
                          "default"
                    }>
                      {ticket.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    {ticket.assignee && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Assigned to: {ticket.assignee.name}
                      </span>
                    )}
                    {ticket.reporter && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Reporter: {ticket.reporter.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Created: {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                    {ticket.dueDate && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Due: {new Date(ticket.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    <span>Last updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                  </div>
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
}