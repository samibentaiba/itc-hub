// src/app/(protected)/teams/[teamId]/page.tsx
import Link from "next/link";
import { fetchTeamById, fetchTicketsByTeamId } from "./api";
import TeamDetailClientPage from "./client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: {
    teamId: string;
  };
}

export default async function TeamDetailPage({ params }: PageProps) {
  const { teamId } = params;

  const [team, tickets] = await Promise.all([
    fetchTeamById(teamId),
    fetchTicketsByTeamId(teamId),
  ]);

  if (!team) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/teams">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Teams
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Team not found</h3>
              <p className="text-muted-foreground">
                The team you're looking for doesn't exist.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TeamDetailClientPage 
      initialTeam={team} 
      initialTickets={tickets} 
    />
  );
}
