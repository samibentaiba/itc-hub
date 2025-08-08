// /calendar/components/CalendarView.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, MapPin } from "lucide-react";
import type { Event } from "../../types";

interface CalendarViewProps {
  currentDate: Date;
  view: "month" | "week" | "day";
  events: Event[];
  setSelectedEvent: (event: Event | null) => void;
  handleDayClick: (date: Date) => void;
  getDaysInMonth: (date: Date) => number;
  getFirstDayOfMonth: (date: Date) => number;
  formatDateString: (date: Date) => string;
}

export default function CalendarView({ currentDate, view, events, setSelectedEvent, handleDayClick, getDaysInMonth, getFirstDayOfMonth, formatDateString }: CalendarViewProps) {
  
  const getEventsForDate = (date: string) => {
    return events.filter((event) => event.date === date);
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border-t border-r border-border/50"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = formatDateString(date);
      const dayEvents = getEventsForDate(dateString);
      const isToday = dateString === formatDateString(new Date());

      days.push(
        <div key={day} className={`h-24 border-t border-r border-border/50 p-1.5 space-y-1 overflow-hidden cursor-pointer hover:bg-accent/50 ${isToday ? "bg-primary/10" : ""}`} onClick={() => handleDayClick(date)}>
          <div className={`text-xs font-medium ${isToday ? "text-primary font-bold" : "text-muted-foreground"}`}>{day}</div>
          {dayEvents.slice(0, 2).map((event) => (
            <div key={event.id} className={`text-white text-[10px] p-1 rounded truncate ${event.color}`} title={event.title} onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}>
              {event.title}
            </div>
          ))}
          {dayEvents.length > 2 && <div className="text-xs text-muted-foreground">+{dayEvents.length - 2} more</div>}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 border-l border-b border-border/50">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="h-10 border-t border-r border-border/50 bg-muted/50 flex items-center justify-center font-medium text-sm">{day}</div>
        ))}
        {days}
      </div>
    );
  };
  
  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const weekDays: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        weekDays.push(date);
    }

    return (
        <div className="grid grid-cols-8 border-t border-l border-b border-border/50">
            <div className="h-10 border-r border-border/50 bg-muted/50"></div>
            {weekDays.map(day => (
                <div key={day.toISOString()} className="h-14 border-r border-border/50 bg-muted/50 flex flex-col items-center justify-center font-medium text-sm cursor-pointer" onClick={() => handleDayClick(day)}>
                    <span>{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <span className={`text-lg font-bold ${formatDateString(day) === formatDateString(new Date()) ? 'text-primary' : ''}`}>{day.getDate()}</span>
                </div>
            ))}
            {Array.from({ length: 24 }, (_, i) => i + 8).map(hour => (
                <div key={hour} className="contents">
                    <div className="h-16 border-r border-t border-border/50 p-2 text-xs text-muted-foreground text-center">{`${hour}:00`}</div>
                    {weekDays.map(day => {
                        const dayEvents = getEventsForDate(formatDateString(day)).filter(e => parseInt(e.time.split(':')[0]) === hour);
                        return (
                            <div key={day.toISOString()} className="h-16 border-r border-t border-border/50 p-1 space-y-1 overflow-hidden">
                                {dayEvents.map(event => (
                                    <div key={event.id} className={`text-white text-[10px] p-1 rounded truncate cursor-pointer ${event.color}`} title={event.title} onClick={() => setSelectedEvent(event)}>
                                        {event.title}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
  };

  const renderDayView = () => {
    const dayToRender = currentDate;
    const dateString = formatDateString(dayToRender);
    const dayEvents = getEventsForDate(dateString).sort((a,b) => a.time.localeCompare(b.time));

    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold">{dayToRender.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</h3>
        </div>
        <div className="space-y-3">
          {dayEvents.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No events scheduled for this day.</div>
          ) : (
            dayEvents.map((event) => (
              <Card key={event.id} className="hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => setSelectedEvent(event)}>
                <CardContent className="p-4 flex items-start gap-4">
                  <div className={`w-1.5 h-16 rounded-full ${event.color}`}></div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-semibold">{event.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{event.time} ({event.duration} min)</span>
                      <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{event.location}</span>
                    </div>
                     <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {event.attendees.join(', ')}
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">{event.type}</Badge>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  };

  switch (view) {
    case "month": return renderMonthView();
    case "week": return renderWeekView();
    case "day": return renderDayView();
    default: return renderMonthView();
  }
}
