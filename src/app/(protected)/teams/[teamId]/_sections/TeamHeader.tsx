// src/app/(protected)/teams/[teamId]/_sections/TeamHeader.tsx
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, ArrowLeft, Users } from "lucide-react";
import { AuthorizedComponent } from "@/hooks/use-authorization";
import { NewTicketForm } from "@/components/new-ticket-form";

import { TeamDetail as Team } from "../types";

interface TeamHeaderProps {
  team: Team;
  showNewTicket: boolean;
  setShowNewTicket: (value: boolean) => void;
}

export function TeamHeader({ team, showNewTicket, setShowNewTicket }:TeamHeaderProps) {
    
 const formatLeader = (leader: Team["leader"]) => {
  if (!leader) return null;
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Users className="h-4 w-4" />
      <span>Led by:</span>
      <span className="font-medium text-foreground">{leader.name}</span>
    </div>
  );
};


  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <Link href="/teams">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Teams
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{team.name}</h1>
          <p className="text-muted-foreground">{team.description}</p>
          {formatLeader(team.leader)}
        </div>
      </div>
      <AuthorizedComponent teamId={team.id} action="manage">
        <Dialog open={showNewTicket} onOpenChange={setShowNewTicket}>
          <DialogTrigger asChild>
            <Button className="bg-red-800 text-white hover:bg-red-700">
              <Plus className="mr-2 h-4 w-4" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Team Ticket</DialogTitle>
              <DialogDescription>Create a new ticket for {team.name}</DialogDescription>
            </DialogHeader>
            <NewTicketForm contextType="team" contextId={team.id} availableUsers={team.members} />
          </DialogContent>
        </Dialog>
      </AuthorizedComponent>
    </div>
  );
}
