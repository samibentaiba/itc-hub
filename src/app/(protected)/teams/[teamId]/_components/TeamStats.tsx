// _components/TeamStats.tsx
"use client";

interface TeamStatsProps {
  activeProjects: number;
  status: string;
}

/**
 * Component for displaying team statistics.
 * Shows active projects count and team status.
 * 
 * @param activeProjects - Number of active projects.
 * @param status - Current team status (active/inactive).
 */
export function TeamStats({ activeProjects, status }: TeamStatsProps) {
  const statusText = status === "active" ? "Active" : "Inactive";
  const statusClass = status === "active" ? "text-green-600" : "text-muted-foreground";

  return (
    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
      <div className="text-center">
        <div className="text-lg font-semibold text-primary">{activeProjects}</div>
        <div className="text-xs text-muted-foreground">Active Projects</div>
      </div>
      <div className="text-center">
        <div className={`text-lg font-semibold ${statusClass}`}>
          {statusText}
        </div>
        <div className="text-xs text-muted-foreground">Status</div>
      </div>
    </div>
  );
}