// src/app/(protected)/teams/[teamId]/page.tsx
import Link from "next/link";
import { getTeamById } from "@/lib/data-services";
import TeamDetailClientPage from "./client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{
    teamId: string;
  }>;
}

export default async function TeamDetailPage(props: PageProps) {
  const { teamId } = await props.params;

  let team;
  try {
    team = await getTeamById(teamId);
  } catch (error) {
    // Handle authorization errors
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return (
        <div className="space-y-6">
          <Link href="/teams">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Teams
            </Button>
          </Link>
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Access Denied</h3>
                <p className="text-muted-foreground">
                  You don&apos;t have permission to view this team.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    throw error;
  }

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
      initialTickets={team.tickets || []} // Use tickets from team data
    />
  );
}
