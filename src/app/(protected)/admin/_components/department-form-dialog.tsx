// /admin/_components/DepartmentFormDialog.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { Department, DepartmentFormData } from "../types";
import { departmentFormSchema } from "../types";

interface DepartmentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DepartmentFormData & { id?: string }) => void;
  isLoading: boolean;
  initialData?: Department | null;
}

/**
 * A unified dialog for both adding and editing departments.
 */
export default function DepartmentFormDialog({ isOpen, onClose, onSubmit, isLoading, initialData }: DepartmentFormDialogProps) {
  const isEditMode = !!initialData;

  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (isOpen) {
        form.reset(isEditMode ? { name: initialData.name, description: initialData.description } : { name: "", description: "" });
    }
  }, [isOpen, initialData, form, isEditMode]);

  const handleFormSubmit = (data: DepartmentFormData) => {
    onSubmit({ ...data, id: initialData?.id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Department" : "Create New Department"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? `Update details for the ${initialData.name} department.` : "Set up a new department."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 pt-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Department Name</FormLabel><FormControl><Input placeholder="e.g. Engineering" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="What is the purpose of this department?" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditMode ? "Save Changes" : "Create Department"}
                    </Button>
                </div>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
