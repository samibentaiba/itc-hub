"use client";

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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AuthorizedComponent } from "@/hooks/use-authorization";
import { Building2, Pencil, Plus, Trash2, Users } from "lucide-react";
import { NewTicketForm } from "./new-ticket-form";

interface WorkspaceHeaderProps {
  contextId: string;
  contextType: "department" | "team";
  name: string;
  description: string;
  managers: { id: string; name: string; avatar: string }[];
  showNewTicket: boolean;
  onOpenChange: (open: boolean) => void;
  showEdit: boolean;
  onEditOpenChange: (open: boolean) => void;
  showDeleteAlert: boolean;
  onDeleteOpenChange: (open: boolean) => void;
  onDelete: () => Promise<void>;
  availableWorkspaces: { id: string; name: string; type: "department" | "team" }[];
  availableUsers: { id: string; name: string; avatar: string; role: string }[];
  editDialog: React.ReactNode;
}

export function WorkspaceHeader({
  contextId,
  contextType,
  name,
  description,
  managers,
  showNewTicket,
  onOpenChange,
  onEditOpenChange,
  showDeleteAlert,
  onDeleteOpenChange,
  onDelete,
  availableWorkspaces,
  availableUsers,
  editDialog,
}: WorkspaceHeaderProps) {
  const formatManagers = (managers: { id: string; name: string; avatar: string }[]) => {
    if (!managers || managers.length === 0) {
      return null;
    }
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>{contextType === "department" ? "Managed by:" : "Led by:"}</span>
        <span className="font-medium text-foreground">{managers[0].name}</span>
        {managers.length > 1 && (
          <span className="text-xs text-muted-foreground">
            +{managers.length - 1} more
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {contextType === "department" ? (
            <Building2 className="h-6 w-6 text-red-500" />
          ) : (
            <Users className="h-6 w-6 text-blue-500" />
          )}
          {name}
        </h1>
        <p className="text-muted-foreground">{description}</p>
        {formatManagers(managers)}
      </div>
      <AuthorizedComponent
        departmentId={contextType === "department" ? contextId : undefined}
        teamId={contextType === "team" ? contextId : undefined}
        action="manage"
        requiresManager={true}
        requiresAdmin={true}
      >
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
                <DialogTitle>Create {contextType === "department" ? "Department" : "Team"} Initiative</DialogTitle>
                <DialogDescription>
                  Create a new long-term initiative for {name}
                </DialogDescription>
              </DialogHeader>
              <NewTicketForm
                contextType={contextType}
                contextId={contextId}
                availableWorkspaces={availableWorkspaces}
                availableUsers={availableUsers}
              />
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={() => onEditOpenChange(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>

          <Button
            variant="destructive"
            onClick={() => onDeleteOpenChange(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </AuthorizedComponent>

      {editDialog}

      <AlertDialog open={showDeleteAlert} onOpenChange={onDeleteOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              {contextType} and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete()}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
