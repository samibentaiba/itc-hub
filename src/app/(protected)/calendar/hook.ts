import { useState, useEffect } from "react";
import { getEvents } from "@/services/eventService";

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  type: string;
  team?: string;
  department?: string;
}

export function useCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const data = await getEvents();
        setEvents(data);
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

  const navigateDate = (direction: "prev" | "next") => {
    if (date) {
      const newDate = new Date(date);
      if (direction === "prev") {
        newDate.setDate(newDate.getDate() - 1);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
      setDate(newDate);
    }
  };

  return {
    date,
    setDate,
    events,
    loading,
    getSelectedDateEvents,
    navigateDate,
  };
}
