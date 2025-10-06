
"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Eye } from "lucide-react";
import type { Team, User } from "../types";

interface TeamsTabProps {
  teams: Team[];
}

export function TeamsTab({ teams }: TeamsTabProps) {
  const formatLeaders = (leaders: User[]) => {
    if (!leaders || leaders.length === 0) {
      return null;
    }
    return (
      <div className="flex items-center gap-2 text-sm">
        <Avatar className="h-6 w-6">
          <AvatarImage src={leaders[0].avatar} alt={leaders[0].name} />
          <AvatarFallback className="text-xs">
            {leaders[0].name.split(' ').map((n: any) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <span className="text-muted-foreground">
          Led by <span className="font-medium text-foreground">{leaders[0].name}</span>
          {leaders.length > 1 && ` +${leaders.length - 1} more`}
        </span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supervised Teams</CardTitle>
        <CardDescription>Teams under this department&apos;s oversight</CardDescription>
      </CardHeader>
      <CardContent>
        {teams.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No teams found in this department</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <Card key={team.id} className="hover:bg-accent/50 transition-colors">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{team.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Users className="h-3 w-3" />
                          {team.memberCount} members
                        </p>
                      </div>
                      <Badge variant="default" className="shrink-0">Active</Badge>
                    </div>
                                        {formatLeaders(team.leaders)}
                    {team.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {team.description}
                      </p>
                    )}
                    <div className="pt-2">
                      <Link href={`/teams/${team.id}`}>
                        <Button size="sm" variant="outline" className="w-full">
                          <Eye className="mr-2 h-3 w-3" />
                          View Team
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
