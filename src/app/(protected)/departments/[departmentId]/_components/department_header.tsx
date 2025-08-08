/**
 * components/department/DepartmentHeader.tsx
 *
 * This component is responsible for rendering the main header section
 * of the department page, including the title, description, and the
 * "New Initiative" button with its associated dialog.
 */
import { Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NewTicketForm } from "@/components/new-ticket-form";
import { Department } from "../types";

interface DepartmentHeaderProps {
  department: Department;
  showNewTicket: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DepartmentHeader = ({ department, showNewTicket, onOpenChange }: DepartmentHeaderProps) => {
  // Create a list of available workspaces, including the department itself and its teams.
  const availableWorkspaces = [
    { id: department.id, name: department.name, type: 'department' as const },
    ...department.teams.map(team => ({ id: team.id, name: team.name, type: 'team' as const }))
  ];

  return (
    <div className="flex items-center justify-between">
      {/* Department Title and Description */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6 text-red-500" />
          {department.name}
        </h1>
        <p className="text-muted-foreground">{department.description}</p>
      </div>

      {/* New Initiative Dialog */}
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
    </div>
  );
};
