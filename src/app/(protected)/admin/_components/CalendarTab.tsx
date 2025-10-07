import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarView } from "./CalendarView";
import { CalendarSidebar } from "./CalendarSidebar";

export function CalendarTab({ calendarData }: any) {
  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Calendar className="h-5 w-5" />
                {calendarData.utils.formatDate(calendarData.currentDate)}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => calendarData.actions.navigate("prev")}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" onClick={() => calendarData.actions.navigate("next")}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent><CalendarView calendarData={calendarData} /></CardContent>
        </Card>
      </div>
      <CalendarSidebar calendarData={calendarData} />
    </div>
  );
}