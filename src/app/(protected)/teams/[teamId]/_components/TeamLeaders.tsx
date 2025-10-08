
// _components/TeamLeaders.tsx
"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { TeamLocal } from "./../types";

interface TeamLeadersProps {
  leaders: TeamLocal['leaders'];
}

/**
 * Component for displaying team leaders.
 * Shows the first leader with avatar and name, with count if multiple.
 * 
 * @param leaders - Array of team leaders to display.
 */
export function TeamLeaders({ leaders }: TeamLeadersProps) {
  if (!leaders || leaders.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">?</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">Unknown Team Leader</p>
          <p className="text-xs text-muted-foreground">No leader assigned</p>
        </div>
      </div>
    );
  }

  const firstLeader = leaders[0];
  const initials = firstLeader.name
    .split(" ")
    .map((n: string) => n[0])
    .join("");

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={firstLeader.avatar} alt={firstLeader.name} />
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>
      <div>
        <Link 
          href={`/users/${firstLeader.id}`} 
          className="text-sm font-medium hover:underline"
        >
          {firstLeader.name}
        </Link>
        <p className="text-xs text-muted-foreground">Team Lead</p>
      </div>
      {leaders.length > 1 && (
        <div className="text-xs text-muted-foreground">
          +{leaders.length - 1} more
        </div>
      )}
    </div>
  );
}