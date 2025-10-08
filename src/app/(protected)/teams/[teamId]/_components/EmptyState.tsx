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