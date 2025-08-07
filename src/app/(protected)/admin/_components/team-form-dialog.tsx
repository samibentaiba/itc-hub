// /admin/_components/TeamFormDialog.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { Team, Department, TeamFormData } from "../types";
import { teamFormSchema } from "../types";

interface TeamFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeamFormData & { id?: string }) => void;
  isLoading: boolean;
  initialData?: Team | null;
  departments: Department[];
}

/**
 * A unified dialog for both adding and editing teams.
 */
export default function TeamFormDialog({ isOpen, onClose, onSubmit, isLoading, initialData, departments }: TeamFormDialogProps) {
  const isEditMode = !!initialData;

  const form = useForm<TeamFormData>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: { name: "", description: "", departmentId: "" },
  });

  useEffect(() => {
    if (isOpen) {
        form.reset(isEditMode ? { name: initialData.name, description: initialData.description, departmentId: initialData.departmentId } : { name: "", description: "", departmentId: "" });
    }
  }, [isOpen, initialData, form, isEditMode]);

  const handleFormSubmit = (data: TeamFormData) => {
    onSubmit({ ...data, id: initialData?.id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Team" : "Create New Team"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? `Update details for the ${initialData.name} team.` : "Set up a new team within a department."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 pt-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Team Name</FormLabel><FormControl><Input placeholder="e.g. Frontend Avengers" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="A short description of the team's purpose." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="departmentId" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {departments.map(dept => <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditMode ? "Save Changes" : "Create Team"}
                    </Button>
                </div>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
