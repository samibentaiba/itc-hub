/**
 * components/department/CalendarTab.tsx
 *
 * This component renders the content for the "Department Calendar" tab.
 * It includes the interactive calendar and the list of milestones for
 * the selected date.
 */
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Ticket } from "./../types"; // Adjust path as needed

interface CalendarTabProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  calendarEvents: Record<string, Ticket[]>;
  selectedDateTickets: Ticket[];
  goToPreviousDay: () => void;  
  goToNextDay: () => void;
}

export const CalendarTab = ({ date, setDate, calendarEvents, selectedDateTickets, goToPreviousDay, goToNextDay }: CalendarTabProps) => (
  <div className="grid gap-4 lg:gap-6 lg:grid-cols-2">
    {/* Calendar Component */}
    <Card>
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
        <CardDescription>Select a date to view milestones</CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border w-full"
          modifiers={{ hasEvents: (d) => calendarEvents[d.toDateString()]?.length > 0 }}
          modifiersStyles={{ hasEvents: { backgroundColor: "rgb(220 38 38 / 0.1)", color: "rgb(220 38 38)", fontWeight: "bold" } }}
        />
      </CardContent>
    </Card>

    {/* Milestones for Selected Date */}
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>
            {date ? `Milestones for ${date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}` : "Select a date"}
          </CardTitle>
          <CardDescription>
            {selectedDateTickets.length > 0 ? `${selectedDateTickets.length} milestone${selectedDateTickets.length > 1 ? "s" : ""} scheduled` : "No milestones scheduled"}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousDay}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={goToNextDay}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </CardHeader>
      <CardContent>
        {selectedDateTickets.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center border rounded-md">
            <p className="text-sm text-muted-foreground">No milestones scheduled</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[300px] overflow-auto">
            {selectedDateTickets.map((ticket) => (
              <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                  <h3 className="font-semibold">{ticket.title}</h3>
                  <p className="text-sm text-muted-foreground">Duration: {ticket.duration}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  </div>
);