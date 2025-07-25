import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AvatarDisplay({ name, avatar, size = 8, className = "" }: { name: string; avatar?: string; size?: number; className?: string }) {
  return (
    <Avatar className={`h-${size} w-${size} ${className}`} >
      <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
      <AvatarFallback>{name?.charAt(0) || "?"}</AvatarFallback>
    </Avatar>
  );
} 