// /admin/_components/request-event-dialog.tsx

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Event, EventFormData } from "../../types";
import { requestEventSchema } from "../../types";

interface RequestEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData & { id?: number | string }) => Promise<boolean>;
  isLoading: boolean;
  initialData?: Event | null; // Optional prop for editing
}

/**
 * A unified dialog for both creating and editing calendar events.
 * It determines its mode based on the presence of `initialData`.
 */
export default function RequestEventDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
}: RequestEventDialogProps) {
  const isEditMode = !!initialData;

  const form = useForm<EventFormData>({
    resolver: zodResolver(requestEventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      duration: "60",
      type: "meeting",
      location: "",
    },
  });

  // When the dialog opens, populate the form with initialData if editing,
  // otherwise reset to default values for creating a new event.
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        form.reset({
          title: initialData.title,
          description: initialData.description,
          date: initialData.date,
          time: initialData.time,
          duration: String(initialData.duration),
          type: initialData.type,
          location: initialData.location,
        });
      } else {
        form.reset({
          title: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
          time: "",
          duration: "60",
          type: "meeting",
          location: "",
        });
      }
    }
  }, [isOpen, initialData, isEditMode, form]);

  const handleFormSubmit = async (data: EventFormData) => {
    const success = await onSubmit({ ...data, id: initialData?.id });
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Event" : "Request time for a New Event"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the details for this event."
              : "Request access for a club's time slot for an event"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4 pt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Q4 Planning" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of the event..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="30">30 min</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Conference Room A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Save Changes" : "Request Event"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
