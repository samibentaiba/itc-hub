"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogClose } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { TicketForm } from "@/components/forms/TicketForm";
import { createTicket } from "@/services/ticketService";

export function NewTicketForm() {
  const { toast } = useToast();
  const handleSubmit = async (formData: any) => {
    try {
      const res = await createTicket(formData);
      if (res.ok) {
        toast({
          title: "Ticket created successfully!",
          description: `"${formData.title}" has been created and assigned.`,
        });
      } else {
        toast({ title: "Error", description: "Failed to create ticket." });
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to create ticket." });
    }
  };
  return <TicketForm onSubmit={handleSubmit} submitLabel="Create Ticket" />;
}
