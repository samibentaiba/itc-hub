// src/app/(protected)/teams/[teamId]/client.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { AuthorizedComponent } from "@/hooks/use-authorization";
import type { TeamDetail, TeamTicket, TeamMember, Event, UpcomingEvent, EventFormData } from "../types";
import { eventFormSchema } from "../types";
import { formatDate, getDaysInMonth, getFirstDayOfMonth, formatDateString } from "../utils";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NewTicketForm } from "@/components/new-ticket-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import {
  Clock,
  MessageSquare,
  Users,
  Plus,
  Mail,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Calendar as CalendarIcon,
  Filter,
  MapPin,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";

// Request Event Dialog Component
interface RequestEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData & { id?: number }) => Promise<boolean>;
  isLoading: boolean;
  initialData?: Event | null;
}

export function RequestEventDialog({ isOpen, onClose, onSubmit, isLoading, initialData }: RequestEventDialogProps) {
  const isEditMode = !!initialData;

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
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

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        // Cast the type to ensure it matches the expected union type
        const eventType = ["meeting", "review", "workshop", "planning"].includes(initialData.type)
          ? initialData.type as EventFormData['type']
          : "meeting";

        form.reset({
          title: initialData.title,
          description: initialData.description,
          date: initialData.date,
          time: initialData.time,
          duration: String(initialData.duration),
          type: eventType,
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
          <DialogTitle>{isEditMode ? "Edit Event" : "Request time for a New Event"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the details for this event." : "Request access for a club's time slot for an event"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl><Input placeholder="e.g., Q4 Planning" {...field} /></FormControl>
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
                  <FormControl><Textarea placeholder="A brief description of the event..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="date" render={({ field }) => (<FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="time" render={({ field }) => (<FormItem><FormLabel>Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="duration" render={({ field }) => (<FormItem><FormLabel>Duration</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="30">30 min</SelectItem><SelectItem value="60">1 hour</SelectItem><SelectItem value="90">1.5 hours</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="meeting">Meeting</SelectItem><SelectItem value="review">Review</SelectItem><SelectItem value="planning">Planning</SelectItem><SelectItem value="workshop">Workshop</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            </div>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <FormControl><Input placeholder="e.g., Conference Room A" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
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
