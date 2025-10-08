
// _components/StatsGrid.tsx
"use client";

import { Users, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StatLocal } from "../../types";

// Mapping from stat title to Icon component
const iconMap = {
  "Total Teams": Users,
  "Total Members": Users,
  "Active Projects": TrendingUp,
  "Avg Team Size": Clock,
};

interface StatsGridProps {
  stats: StatLocal[];
}

/**
 * Grid component displaying team statistics.
 * Shows key metrics like total teams, members, projects, etc.
 * 
 * @param stats - Array of statistics to display.
 *                Each stat should have title, value, description, and trend.
 */
export function StatsGrid({ stats }: StatsGridProps) {
  return (
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
  );
}
