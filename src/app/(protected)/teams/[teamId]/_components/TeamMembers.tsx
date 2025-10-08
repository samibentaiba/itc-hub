
// _components/TeamMembers.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { TeamLocal } from "./../types";

interface TeamMembersProps {
  members: TeamLocal['members'];
  memberCount: number;
}

/**
 * Component for displaying team members as an avatar stack.
 * Shows up to 4 member avatars with overflow indicator.
 * 
 * @param members - Array of team members to display.
 * @param memberCount - Total count of team members.
 */
export function TeamMembers({ members, memberCount }: TeamMembersProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Members</span>
        <span className="text-xs text-muted-foreground">{memberCount} total</span>
      </div>
      <div className="flex -space-x-2">
        {members.slice(0, 4).map((member) => {
          const initials = member.name
            .split(" ")
            .map((n: string) => n[0])
            .join("");
          
          return (
            <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
          );
        })}
        {memberCount > 4 && (
          <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
            <span className="text-xs font-medium">+{memberCount - 4}</span>
          </div>
        )}
      </div>
    </div>
  );
}
