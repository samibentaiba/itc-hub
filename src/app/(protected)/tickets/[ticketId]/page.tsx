import Link from "next/link";
import { fetchTicketById, fetchMessagesByTicketId } from "./api"; // Note the relative path
import TicketDetailClientPage from "./client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// This is a Server Component. 
// It fetches data on the server and passes it to the client component.
export default async function TicketDetailPage({ params }: { params: { ticketId: string } }) {
  const { ticketId } = params;

  // Fetch data for the specific ticket in parallel
  const [ticket, messages] = await Promise.all([
    fetchTicketById(ticketId),
    fetchMessagesByTicketId(ticketId)
  ]);

  // Handle the case where the ticket doesn't exist
  if (!ticket) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/tickets">
                    <Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Tickets</Button>
                </Link>
            </div>
            <Card>
                <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">Ticket not found</h3>
                        <p className="text-muted-foreground">The ticket you're looking for doesn't exist.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  // Pass the server-fetched data as props to the client component.
  return (
    <TicketDetailClientPage 
      initialTicket={ticket} 
      initialMessages={messages} 
    />
  );
}
