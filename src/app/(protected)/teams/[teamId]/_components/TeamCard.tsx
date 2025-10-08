// _components/TeamCard.tsx
"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TeamLeaders } from "./TeamLeaders";
import { TeamMembers } from "./TeamMembers";
import { TeamStats } from "./TeamStats";
import { TeamActivity } from "./TeamActivity";
import type { TeamLocal } from "./../types";

interface TeamCardProps {
  team: TeamLocal;
  getDepartmentColor: (department: string) => string;
}

/**
 * Card component for displaying team information.
 * Shows team name, department, leaders, members, and statistics.
 * 
 * @param team - The team data to display.
 * @param getDepartmentColor - Function to get the color class for the department.
 */
export function TeamCard({ team, getDepartmentColor }: TeamCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              <Link href={`/teams/${team.id}`} className="hover:underline">
                {team.name}
              </Link>
            </CardTitle>
            <CardDescription className="text-sm">{team.description}</CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <div className={`w-3 h-3 rounded-full ${getDepartmentColor(team.department)}`} />
          <Badge variant="outline" className="text-xs">
            {team.department}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Team leaders display component */}
        <TeamLeaders leaders={team.leaders} />

        {/* Team members avatar stack */}
        <TeamMembers members={team.members} memberCount={team.memberCount} />

        {/* Team statistics (projects and status) */}
        <TeamStats 
          activeProjects={team.activeProjects} 
          status={team.status} 
        />

        {/* Recent activity section */}
        <TeamActivity recentActivity={team.recentActivity} />
      </CardContent>
    </Card>
  );
}
