// _components/TeamActivity.tsx
"use client";

interface TeamActivityProps {
  recentActivity: string;
}

/**
 * Component for displaying team's recent activity.
 * Shows a brief description of the most recent team activity.
 * 
 * @param recentActivity - Description of recent activity.
 */
export function TeamActivity({ recentActivity }: TeamActivityProps) {
  return (
    <div className="pt-2 border-t">
      <p className="text-xs text-muted-foreground">
        <span className="font-medium">Recent:</span> {recentActivity}
      </p>
    </div>
  );
}

// _components/EmptyState.tsx
"use client";

/**
 * Empty state component for when no teams are found.
 * Displays a centered message when the teams list is empty.
 */
export function EmptyState() {
  return (
    <div className="text-center py-16 text-muted-foreground">
      No teams found matching your search.
    </div>
  );
}