import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, transformApiResponse } from "../utils";
import type { Event, PendingEvent } from "../types";

/**
 * @hook useEventRequests
 * @description Manages state and actions for pending event requests.
 * @param {PendingEvent[]} initialPendingEvents - The initial list of pending events.
 * @param {React.Dispatch<React.SetStateAction<Event[]>>} setAllEvents - Function to update the main event list.
 * @returns {object} - The pending events state and action handlers.
 */
export const useEventRequests = (
  initialPendingEvents: PendingEvent[],
  setAllEvents: React.Dispatch<React.SetStateAction<Event[]>>
) => {
  const { toast } = useToast();
  const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>(initialPendingEvents);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAcceptEvent = async (eventToAccept: PendingEvent) => {
    setLoadingAction(`accept-${eventToAccept.id}`);
    try {
      const acceptedEventData = await apiRequest(`/api/admin/events/requests/${eventToAccept.id}/approve`, { method: "POST" });
      const acceptedEvent = transformApiResponse(acceptedEventData, 'event');

      setAllEvents((prev) => [...prev, acceptedEvent]);
      setPendingEvents((prev) => prev.filter((e) => e.id !== eventToAccept.id));
      toast({ title: "Event Approved", description: `"${eventToAccept.title}" has been added to the calendar.` });
    } catch (error: unknown) {
      toast({ title: "Error", description: (error as Error).message || "Could not approve the event.", variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRejectEvent = async (eventToReject: PendingEvent) => {
    setLoadingAction(`reject-${eventToReject.id}`);
    try {
      await apiRequest(`/api/admin/events/requests/${eventToReject.id}/reject`, { method: "POST" });
      setPendingEvents((prev) => prev.filter((e) => e.id !== eventToReject.id));
      toast({ title: "Event Rejected", description: `"${eventToReject.title}" has been rejected.`, variant: "destructive" });
    } catch (error: unknown) {
      toast({ title: "Error", description: (error as Error).message || "Could not reject the event.", variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  return {
    pendingEvents,
    setPendingEvents,
    loadingAction,
    handleAcceptEvent,
    handleRejectEvent,
  };
};