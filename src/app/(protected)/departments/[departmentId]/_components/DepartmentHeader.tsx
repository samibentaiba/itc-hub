"use client";

import { Building2, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AuthorizedComponent } from "@/hooks/use-authorization";
import { NewTicketForm } from "@/components/new-ticket-form";
import type { Department, User } from "../types";

interface DepartmentHeaderProps {
  department: Department;
  showNewTicket: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DepartmentHeader({ department, showNewTicket, onOpenChange }: DepartmentHeaderProps) {
  const availableWorkspaces = [
    { id: department.id, name: department.name, type: 'department' as const },
    ...department.teams.map(team => ({ id: team.id, name: team.name, type: 'team' as const }))
  ];

  const formatManagers = (managers: User[]) => {
    if (!managers || managers.length === 0) {
      return null;
    }
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>Managed by:</span>
        <span className="font-medium text-foreground">{managers[0].name}</span>
        {managers.length > 1 && (
          <span className="text-xs text-muted-foreground">+{managers.length - 1} more</span>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6 text-red-500" />
          {department.name}
        </h1>
        <p className="text-muted-foreground">{department.description}</p>
        {formatManagers(department.managers)}
      </div>
      <AuthorizedComponent departmentId={department.id} action="manage">
        <Dialog open={showNewTicket} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-red-800 text-white hover:bg-red-700">
              <Plus className="mr-2 h-4 w-4" />
              New Initiative
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Department Initiative</DialogTitle>
              <DialogDescription>
                Create a new long-term initiative for {department.name}
              </DialogDescription>
            </DialogHeader>
            <NewTicketForm
              contextType="department"
              contextId={department.id}
              availableWorkspaces={availableWorkspaces}
              availableUsers={department.members}
            />
          </DialogContent>
        </Dialog>
      </AuthorizedComponent>
    </div>
  );
}