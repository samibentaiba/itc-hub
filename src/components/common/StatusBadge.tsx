import { Badge } from "@/components/ui/badge";

const statusLabels: Record<string, string> = {
  verified: "Verified",
  pending: "Pending",
  in_progress: "In Progress",
  scheduled: "Scheduled",
  active: "Active",
  closed: "Closed",
  VERIFIED: "Verified",
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  SCHEDULED: "Scheduled",
  ACTIVE: "Active",
  CLOSED: "Closed",
};

const statusVariants: Record<string, string> = {
  verified: "default",
  VERIFIED: "default",
  pending: "secondary",
  PENDING: "secondary",
  in_progress: "secondary",
  IN_PROGRESS: "secondary",
  scheduled: "outline",
  SCHEDULED: "outline",
  active: "default",
  ACTIVE: "default",
  closed: "outline",
  CLOSED: "outline",
};

export function StatusBadge({ status, className = "" }: { status: string; className?: string }) {
  return (
    <Badge variant={statusVariants[status] as "default" | "destructive" | "secondary" | "outline"} className={"text-xs " + className}>
      {statusLabels[status] || status}
    </Badge>
  );
} 