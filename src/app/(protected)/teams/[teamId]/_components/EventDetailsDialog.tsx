"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Edit, Trash2 } from "lucide-react";
import type { Event } from "../types";
import { AuthorizedComponent } from "@/hooks/use-authorization";
interface EventDetailsDialogProps {
  event: Event | null;
  teamId:string;
  onClose: () => void;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}

export function EventDetailsDialog({ event, onClose,teamId, onEdit, onDelete }: EventDetailsDialogProps) {
  if (!event) return null;

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle>
              <DialogDescription className="mt-1">
                <Badge variant="outline" className="capitalize">{event.type}</Badge>
              </DialogDescription>
            </div>
            <div className={`w-4 h-4 rounded-full mt-2 ${event.color}`}></div>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-muted-foreground">{event.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{new Date(`${event.date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{event.time} ({event.duration} min)</span>
            </div>
            <div className="flex items-center gap-2 col-span-full">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Attendees</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{event.attendees.join(', ')}</span>
            </div>
          </div>
        </div>
        <AuthorizedComponent teamId={teamId} action="manage">
        <DialogFooter className="sm:justify-between gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          
            <div className="flex gap-2">
              <Button variant="destructive" onClick={() => onDelete(event)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button onClick={() => onEdit(event)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
        </DialogFooter>
          </AuthorizedComponent>
      </DialogContent>
    </Dialog>
  );
}