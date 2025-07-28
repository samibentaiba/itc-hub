import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getEvents, createEvent } from "@/services/eventService";

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  duration: string;
  type: string;
  location: string;
  attendees: number;
  organizer: string;
  isRecurring?: boolean;
}

interface FormData {
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  location: string;
  isRecurring: boolean;
}

export function useGlobalCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const data = await getEvents();
        // Parse date fields and map organizer name
        setEvents(
          data.map((event: any) => ({
            ...event,
            date: new Date(event.date),
            organizer: event.organizer?.name || event.organizer || "Unknown",
          }))
        );
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const getSelectedDateEvents = () => {
    return events.filter(
      (event) => date && event.date.toDateString() === date.toDateString()
    );
  };

  const getUpcomingEvents = () => {
    return events
      .filter((event) => event.date >= new Date())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  };

  const getCalendarEvents = () => {
    return events.reduce((acc, event) => {
      const dateKey = event.date.toDateString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(event);
      return acc;
    }, {} as Record<string, typeof events>);
  };

  const handleCreateEvent = async (formData: FormData) => {
    try {
      const data = await createEvent({
        ...formData,
        date: new Date(formData.date + "T" + formData.time),
      });
      if (data) {
        toast({
          title: "Event created successfully!",
          description: `"${formData.title}" has been added to the global calendar.`,
        });
        setShowNewEvent(false);
        // Refresh events
        const updated = await getEvents();
        setEvents((prev) => [
          ...prev,
          {
            ...updated,
            date: new Date(updated.date),
            organizer: updated.organizer?.name || "Unknown",
          },
        ]);
      } else {
        toast({ title: "Error", description: "Failed to create event." });
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to create event." });
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "event":
        return "bg-green-100 text-green-800 border-green-300";
      case "deadline":
        return "bg-red-100 text-red-800 border-red-300";
      case "workshop":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "networking":
        return "bg-orange-100 text-orange-800 border-orange-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      date: "",
      time: "",
      duration: "",
      type: "",
      location: "",
      isRecurring: false,
    })
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      handleCreateEvent(formData)
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        duration: "",
        type: "",
        location: "",
        isRecurring: false,
      })
      setShowNewEvent(false)
    }

  return {
    date,
    setDate,
    formData,
    showNewEvent,
    handleSubmit,
    setShowNewEvent,
    events,
    loading,
    setFormData,
    getSelectedDateEvents,
    getUpcomingEvents,
    getCalendarEvents,
    handleCreateEvent,
    getEventTypeColor,
  };
}
