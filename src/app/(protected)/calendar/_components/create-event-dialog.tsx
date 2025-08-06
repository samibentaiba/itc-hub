// /calendar/components/CreateEventDialog.tsx

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { EventFormData } from "../types";

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  createEvent: (formData: EventFormData) => Promise<boolean>;
  isLoading: boolean;
}

export default function CreateEventDialog({ isOpen, onClose, createEvent, isLoading }: CreateEventDialogProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
    duration: "60",
    type: "meeting",
    location: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createEvent(formData);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>Add a new event to your calendar.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="date">Date</Label><Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required /></div>
            <div className="space-y-2"><Label htmlFor="time">Time</Label><Input id="time" type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Duration</Label><Select value={formData.duration} onValueChange={(v) => setFormData({ ...formData, duration: v })}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="30">30 min</SelectItem><SelectItem value="60">1 hour</SelectItem><SelectItem value="90">1.5 hours</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Type</Label><Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="meeting">Meeting</SelectItem><SelectItem value="review">Review</SelectItem><SelectItem value="planning">Planning</SelectItem><SelectItem value="workshop">Workshop</SelectItem></SelectContent></Select></div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Creating..." : "Create Event"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
