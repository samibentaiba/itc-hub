"use client";

import Link from "next/link";
import { AuthorizedComponent } from "@/hooks/use-authorization";
import { Building2, Plus, Eye, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NewTicketForm } from "@/components/new-ticket-form";

// Import the new, authoritative type from the server
import type { DepartmentDetails } from "@/server/admin/departments";
import { useState } from "react";

// Main Department View Component
interface DepartmentViewProps {
  departmentData: DepartmentDetails;
}

export function DepartmentView({ departmentData }: DepartmentViewProps) {
  const [showNewTicket, setShowNewTicket] = useState(false);

  return (
    <div className="space-y-6">
      <DepartmentHeader
        department={departmentData}
        showNewTicket={showNewTicket}
        onOpenChange={setShowNewTicket}
      />

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          {/* Calendar tab can be added back here */}
        </TabsList>

        <TabsContent value="tickets">
          <TicketsTab tickets={departmentData.tickets} departmentId={departmentData.id} />
        </TabsContent>

        <TabsContent value="teams">
          <TeamsTab teams={departmentData.teams} />
        </TabsContent>

        <TabsContent value="members">
          <MembersTab members={departmentData.members.map(m => m.user)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Department Header Component
interface DepartmentHeaderProps {
  department: DepartmentDetails;
  showNewTicket: boolean;
  onOpenChange: (open: boolean) => void;
}

function DepartmentHeader({ department, showNewTicket, onOpenChange }: DepartmentHeaderProps) {
  const availableWorkspaces = [
    { id: department.id, name: department.name, type: 'department' as const },
    ...department.teams.map(team => ({ id: team.id, name: team.name, type: 'team' as const }))
  ];

  const departmentManagers = department.managers;

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6 text-red-500" />
          {department.name}
        </h1>
        <p className="text-muted-foreground">{department.description}</p>
        {departmentManagers && departmentManagers.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <Users className="h-4 w-4" />
            <span>Managed by:</span>
            <span className="font-medium text-foreground">{departmentManagers[0].name}</span>
            {departmentManagers.length > 1 && (
              <span className="text-xs text-muted-foreground">+{departmentManagers.length - 1} more</span>
            )}
          </div>
        )}
      </div>
      <AuthorizedComponent departmentId={department.id} action="manage">
        <Dialog open={showNewTicket} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-red-800 text-white hover:bg-red-700">
              <Plus className="mr-2 h-4 w-4" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Department Ticket</DialogTitle>
              <DialogDescription>
                Create a new ticket for the {department.name} department.
              </DialogDescription>
            </DialogHeader>
            <NewTicketForm
              contextType="department"
              contextId={department.id}
              availableWorkspaces={availableWorkspaces}
              availableUsers={department.members.map(m => m.user)}
            />
          </DialogContent>
        </Dialog>
      </AuthorizedComponent>
    </div>
  );
}

// Tickets Tab Component
interface TicketsTabProps {
  tickets: DepartmentDetails['tickets'];
  departmentId: string;
}

function TicketsTab({ tickets, departmentId }: TicketsTabProps) {
  if (!tickets || tickets.length === 0) {
    return <p className="text-muted-foreground">No tickets found for this department.</p>;
  }

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
                    <Badge variant={ticket.status === "IN_PROGRESS" ? "secondary" : ticket.status === "OPEN" ? "outline" : "default"}>
                      {ticket.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Created: {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

// Teams Tab Component
interface TeamsTabProps {
  teams: DepartmentDetails['teams'];
}

function TeamsTab({ teams }: TeamsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supervised Teams</CardTitle>
        <CardDescription>Teams under this department's oversight</CardDescription>
      </CardHeader>
      <CardContent>
        {teams.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No teams found in this department</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <Card key={team.id} className="hover:bg-accent/50 transition-colors">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{team.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Users className="h-3 w-3" />
                          {team._count.members} members
                        </p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="pt-2">
                      <Link href={`/teams/${team.id}`}>
                        <Button size="sm" variant="outline" className="w-full">
                          <Eye className="mr-2 h-3 w-3" />
                          View Team
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Members Tab Component
interface MembersTabProps {
  members: { id: string; name: string; avatar: string | null }[];
}

function MembersTab({ members }: MembersTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Members</CardTitle>
        <CardDescription>All members of this department.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={member.avatar || undefined} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{member.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Member</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}