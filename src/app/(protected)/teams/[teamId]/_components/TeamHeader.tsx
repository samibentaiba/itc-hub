// _components/TeamsHeader.tsx
"use client";

/**
 * Header component for the teams page.
 * Displays the page title and description.
 */
export function TeamsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Teams</h1>
        <p className="text-muted-foreground">Manage teams and their members</p>
      </div>
    </div>
  );
}
