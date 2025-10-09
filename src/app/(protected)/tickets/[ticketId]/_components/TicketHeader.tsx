"use client";

import type React from "react";

import {
  CheckCircle,
  Clock,
  Users,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Ticket } from "../types";

// Interface for TicketHeader props
interface TicketHeaderProps {
  ticket: Ticket;
  onVerify: () => void;
  getStatusColor: (
    status: Ticket["status"]
  ) => "destructive" | "default" | "secondary" | "outline";
  getPriorityColor: (
    priority: Ticket["priority"]
  ) => "destructive" | "default" | "secondary" | "outline";
  formatStatus: (status: string) => string;
}

// TicketHeader component
export const TicketHeader = ({
  ticket,
  onVerify,
  getStatusColor,
  getPriorityColor,
  formatStatus,
}: TicketHeaderProps) => {
  const ticketSource = ticket.team?.name || ticket.department.name; // Derive the source

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle>{ticket.title}</CardTitle>
              <Badge variant="outline">{ticket.type}</Badge>
              <Badge variant={getStatusColor(ticket.status)}>
                {formatStatus(ticket.status)}
              </Badge>
              <Badge variant={getPriorityColor(ticket.priority)}>
                {ticket.priority.charAt(0).toUpperCase() +
                  ticket.priority.slice(1)}
              </Badge>
            </div>
            <CardDescription>{ticket.description}</CardDescription>
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                {(ticketSource || "").includes("Team") ? ( // Use ticketSource here
                  <Users className="h-3 w-3" />
                ) : (
                  <Building2 className="h-3 w-3" />
                )}
                {ticketSource} {/* Use ticketSource here */}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Due {new Date(ticket.dueDate).toLocaleDateString()}
              </span>
              <span>
                Created {new Date(ticket.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {ticket.status !== "resolved" && (
              <Button
                variant="outline"
                size="sm"
                onClick={onVerify}
                className="bg-green-600 hover:bg-green-700 text-white border-green-600"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Resolved
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
