import { Badge } from "@/components/ui/badge";

const roleLabels: Record<string, string> = {
  admin: "Admin",
  super_leader: "Super Leader",
  leader: "Leader",
  member: "Member",
  guest: "Guest",
  SUPERLEADER: "Super Leader",
  LEADER: "Leader",
  ADMIN: "Admin",
  MEMBER: "Member",
  GUEST: "Guest",
};

const roleVariants: Record<string, string> = {
  admin: "destructive",
  super_leader: "destructive",
  SUPERLEADER: "destructive",
  leader: "default",
  LEADER: "default",
  member: "secondary",
  MEMBER: "secondary",
  guest: "outline",
  GUEST: "outline",
};

export function RoleBadge({ role, className = "" }: { role: string; className?: string }) {
  return (
    <Badge variant={roleVariants[role] as "default" | "destructive" | "secondary" | "outline"} className={"text-xs " + className}>
      {roleLabels[role] || role}
    </Badge>
  );
} 