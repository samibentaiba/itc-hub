// src/app/(protected)/teams/[teamId]/page.tsx
import Link from "next/link";
import TeamDetailClientPage from "./client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { headers } from 'next/headers';

// Helper function for authenticated server-side fetch requests
async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headersList = await headers();
  const cookie = headersList.get('cookie');
  
  return fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(cookie && { Cookie: cookie }),
      ...options.headers,
    },
  });
}

interface PageProps {
  params: Promise<{
    teamId: string;
  }>;
}

export default async function TeamDetailPage(props: PageProps) {
  const { teamId } = await props.params;

  // Fetch team data directly from API
  const response = await authenticatedFetch(`/api/teams/${teamId}`);
  let team = null;
  
  if (response.ok) {
    team = await response.json();
  } else if (response.status !== 404) {
    throw new Error('Failed to fetch team');
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
