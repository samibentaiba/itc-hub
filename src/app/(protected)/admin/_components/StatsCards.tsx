
// /app/(protected)/admin/_components/StatsCards.tsx
"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2 } from "lucide-react";
import type { User, Team, Department } from "../types";

interface StatsCardsProps {
  users: User[];
  teams: Team[];
  departments: Department[];
}

export function StatsCards({ users, teams, departments }: StatsCardsProps) {
  const pendingUsers = useMemo(() => users.filter((u) => u.status === "pending").length, [users]);
  const activeTeams = useMemo(() => teams.filter((t) => t.status === "active").length, [teams]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">{users.length}</div>
          <p className="text-xs text-muted-foreground">{pendingUsers} pending</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">{activeTeams}</div>
          <p className="text-xs text-muted-foreground">{teams.length} total</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Departments</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">{departments.length}</div>
          <p className="text-xs text-muted-foreground">All active</p>
        </CardContent>
      </Card>
    </div>
  );
}
