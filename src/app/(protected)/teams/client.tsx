"use client";

import Link from "next/link";
import { useTeamsPage } from "./hook";
import type { TeamLocal, StatLocal } from "../types";
// Import the icons directly into the client component
import { Users, TrendingUp, Clock } from "lucide-react";

// UI Component Imports
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


interface TeamsClientPageProps {
  initialTeams: TeamLocal[];
  initialStats: StatLocal[];
}

// The mapping from stat title to Icon component now lives on the client.
const iconMap = {
  "Total Teams": Users,
  "Total Members": Users,
  "Active Projects": TrendingUp,
  "Avg Team Size": Clock,
};

const TeamLeaders = ({ leaders }: { leaders: TeamLocal['leaders'] }) => {
  if (!leaders || leaders.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">?</AvatarFallback></Avatar>
        <div><p className="text-sm font-medium">Unknown Team Leader</p><p className="text-xs text-muted-foreground">No leader assigned</p></div>
      </div>
    );
  }

  const firstLeader = leaders[0];

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8"><AvatarImage src={firstLeader.avatar} alt={firstLeader.name} /><AvatarFallback className="text-xs">{firstLeader.name.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback></Avatar>
      <div><Link href={`/users/${firstLeader.id}`} className="text-sm font-medium hover:underline">{firstLeader.name}</Link><p className="text-xs text-muted-foreground">Team Lead</p></div>
      {leaders.length > 1 && (
        <div className="text-xs text-muted-foreground">+{leaders.length - 1} more</div>
      )}
    </div>
  );
};


export default function TeamsClientPage({ initialTeams, initialStats }: TeamsClientPageProps) {
  const { stats, teams, getDepartmentColor } = useTeamsPage(initialTeams, initialStats);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">Manage teams and their members</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          // Look up the correct icon component based on the stat title
          const Icon = iconMap[stat.title as keyof typeof iconMap] || Users;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>



      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Card key={team.id} className="hover:shadow-md transition-shadow">
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
              <TeamLeaders leaders={team.leaders} />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Members</span>
                  <span className="text-xs text-muted-foreground">{team.memberCount} total</span>
                </div>
                <div className="flex -space-x-2">
                  {team.members.slice(0, 4).map((member) => (
                    <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-xs">
                        {member.name.split(" ").map((n: string) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {team.memberCount > 4 && (
                    <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                      <span className="text-xs font-medium">+{team.memberCount - 4}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="text-center">
                  <div className="text-lg font-semibold text-primary">{team.activeProjects}</div>
                  <div className="text-xs text-muted-foreground">Active Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">
                    {team.status === "active" ? "Active" : "Inactive"}
                  </div>
                  <div className="text-xs text-muted-foreground">Status</div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Recent:</span> {team.recentActivity}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
       {teams.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No teams found matching your search.
        </div>
      )}
    </div>
  );
}
