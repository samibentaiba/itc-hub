"use client";

import { Building2, Plus, Users, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AuthorizedComponent } from "@/hooks/use-authorization";
import { NewTicketForm } from "@/components/new-ticket-form";
import { EditDepartmentDialog } from "./EditDepartmentDialog";
import type { Department, User } from "../types";

interface DepartmentHeaderProps {
  department: Department;
  showNewTicket: boolean;
  onOpenChange: (open: boolean) => void;
  showEditDepartment: boolean;
  onEditOpenChange: (open: boolean) => void;
  showDeleteAlert: boolean;
  onDeleteOpenChange: (open: boolean) => void;
  onUpdate: (data: any) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function DepartmentHeader({ 
  department, 
  showNewTicket, 
  onOpenChange, 
  showEditDepartment, 
  onEditOpenChange, 
  showDeleteAlert, 
  onDeleteOpenChange, 
  onUpdate, 
  onDelete 
}: DepartmentHeaderProps) {
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
      <AuthorizedComponent requiresAdmin={true}>
        <div className="flex gap-2">
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

          <Button variant="outline" onClick={() => onEditOpenChange(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>

          <Button variant="destructive" onClick={() => onDeleteOpenChange(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </AuthorizedComponent>

      <EditDepartmentDialog 
        department={department} 
        open={showEditDepartment} 
        onOpenChange={onEditOpenChange} 
        onUpdate={onUpdate} 
      />

      <AlertDialog open={showDeleteAlert} onOpenChange={onDeleteOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the department and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete()}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}