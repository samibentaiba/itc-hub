"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDepartmentsPage } from "./hook";
import type { DepartmentStatLocal } from "../types";
// Import the new type-safe model from the server
import type { DepartmentDetails } from "@/server/admin/departments";

// Import icons directly into the client component
import { Building2, Users, Briefcase, TrendingUp } from "lucide-react";

interface DepartmentsClientPageProps {
  initialDepartments: DepartmentDetails[];
  initialStats: DepartmentStatLocal[];
}

// The mapping from stat title to Icon component now lives on the client.
const iconMap = {
  "Total Departments": Building2,
  "Department Heads": Users,
  "Teams per Dept": Briefcase,
  "Cross-Dept Projects": TrendingUp,
};

export default function DepartmentsClientPage({ initialDepartments, initialStats }: DepartmentsClientPageProps) {
  const { stats, departments } = useDepartmentsPage(initialDepartments, initialStats);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-muted-foreground">Manage organizational departments</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = iconMap[stat.title as keyof typeof iconMap] || Building2;
          return <StatCard key={stat.title} stat={stat} Icon={Icon} />;
        })}
      </div>

      {/* Departments Grid */}
      <DepartmentsGrid departments={departments} />
    </div>
  );
}

const StatCard = ({ stat, Icon }: { stat: DepartmentStatLocal; Icon: React.ElementType }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{stat.value}</div>
      <p className="text-xs text-muted-foreground">{stat.description}</p>
    </CardContent>
  </Card>
);

const DepartmentsGrid = ({ departments }: { departments: DepartmentDetails[] }) => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {departments.map((department) => (
      <DepartmentCard key={department.id} department={department} />
    ))}
  </div>
);

const DepartmentCard = ({ department }: { department: DepartmentDetails }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg">
            <Link href={`/departments/${department.id}`} className="hover:underline">
              {department.name}
            </Link>
          </CardTitle>
          <CardDescription className="text-sm">{department.description}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <DepartmentHead managers={department.managers} />
      <TeamsSection teams={department.teams} />
      <DepartmentStats memberCount={department._count.members} status={department.status || 'inactive'} />
      {/* Recent activity might need to be fetched or derived differently */}
      {/* <RecentActivity activity={department.recentActivity} /> */}
    </CardContent>
  </Card>
);

const DepartmentHead = ({ managers }: { managers: DepartmentDetails['managers'] }) => {
  if (!managers || managers.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">?</AvatarFallback></Avatar>
        <div><p className="text-sm font-medium">Unknown Head</p><p className="text-xs text-muted-foreground">No manager</p></div>
      </div>
    );
  }

  const firstManager = managers[0];

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={firstManager.avatar || undefined} alt={firstManager.name} />
        <AvatarFallback className="text-xs">{firstManager.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
      </Avatar>
      <div>
        <Link href={`/users/${firstManager.id}`} className="text-sm font-medium hover:underline">{firstManager.name}</Link>
        <p className="text-xs text-muted-foreground">Department Head</p>
      </div>
      {managers.length > 1 && (
        <div className="text-xs text-muted-foreground">+{managers.length - 1} more</div>
      )}
    </div>
  );
};

const TeamsSection = ({ teams }: { teams: DepartmentDetails['teams'] }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">Teams</span>
      <span className="text-xs text-muted-foreground">{teams.length} teams</span>
    </div>
    <div className="space-y-1">
      {teams.slice(0, 3).map((team) => (
        <div key={team.id} className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{team.name}</span>
          <span className="text-muted-foreground">{team._count.members} members</span>
        </div>
      ))}
    </div>
  </div>
);

const DepartmentStats = ({ memberCount, status }: { memberCount: number; status: string }) => (
  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
    <div className="text-center">
      <div className="text-lg font-semibold text-primary">{memberCount}</div>
      <div className="text-xs text-muted-foreground">Total Members</div>
    </div>
    <div className="text-center">
      <div className={`text-lg font-semibold ${status === "active" ? 'text-green-600' : 'text-gray-500'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
      <div className="text-xs text-muted-foreground">Status</div>
    </div>
  </div>
);