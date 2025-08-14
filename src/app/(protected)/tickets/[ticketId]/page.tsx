import Link from "next/link";
import { getTicketById } from "../../api"; // Updated import from clean API
import TicketDetailClientPage from "./client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// This is a Server Component.
// It fetches data on the server and passes it to the client component.
export default async function TicketDetailPage(props: {
  params: { ticketId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { ticketId } = props.params;

  // Get the 'from' query parameter to create the throwback link, or default to '/tickets'
  const fromPath =
    typeof props.searchParams.from === "string" ? props.searchParams.from : "/tickets";

  // Fetch data for the specific ticket
  const ticket = await getTicketById(ticketId);

  // Handle the case where the ticket doesn't exist
  if (!ticket) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          {/* Use the fromPath for the back button's href */}
          <Link href={fromPath}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Ticket not found</h3>
              <p className="text-muted-foreground">
                The ticket you're looking for doesn't exist.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pass the server-fetched data and the fromPath as props to the client component.
  return (
    <TicketDetailClientPage
      initialTicket={ticket}
      initialMessages={ticket.comments || []} // Use comments from ticket data
      fromPath={fromPath} // Pass the path to the client component
    />
  );
}
