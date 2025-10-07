
// /app/(protected)/admin/_components/UserFormDialog.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import type { User, UserFormData } from "../types";
import { userFormSchema } from "../types";

interface UserFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData & { id?: string }) => void;
  isLoading: boolean;
  initialData?: User | null;
}

export function UserFormDialog({ isOpen, onClose, onSubmit, isLoading, initialData }: UserFormDialogProps) {
  const isEditMode = !!initialData;
  const form = useForm<UserFormData>({ 
    resolver: zodResolver(userFormSchema), 
    defaultValues: { name: "", email: "" } 
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(isEditMode && initialData ? { name: initialData.name, email: initialData.email } : { name: "", email: "" });
    }
  }, [isOpen, initialData, form, isEditMode]);

  const handleFormSubmit = (data: UserFormData) => {
    onSubmit({ ...data, id: initialData?.id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? `Update the details for ${initialData.name}.` : "Create a new user account."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 pt-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl><Input placeholder="e.g. Sami" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input type="email" placeholder="e.g. sami@itc.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Save Changes" : "Add User"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
