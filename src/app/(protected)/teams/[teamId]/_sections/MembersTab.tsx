// src/app/(protected)/teams/[teamId]/_sections/MembersTab.tsx
"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Mail, MoreVertical } from "lucide-react";
import { TeamDetail as Team, TeamMember as Member } from "../types";
import { TabsContent } from "@/components/ui/tabs";

interface MembersTabProps {
  team: Team;
  handleMemberAction: (member: Member, action: string) => void;
}
export function MembersTab({ team, handleMemberAction }:MembersTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Current team composition and roles</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {team.members?.map((member) =>
              !member?.name ? null : (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={member.avatar || ""} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.email || "No email"}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.role === "leader" ? "default" : "secondary"}>
                      {member.role || "member"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          member.status === "online"
                            ? "bg-green-500"
                            : member.status === "away"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                        }`}
                      />
                      {member.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    {member.joinedDate
                      ? new Date(member.joinedDate).toLocaleDateString()
                      : "Unknown"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleMemberAction(member, "remove")}>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Message
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
        {(!team.members || team.members.length === 0) && (
          <p className="text-muted-foreground text-center py-8">No members found for this team.</p>
        )}
      </CardContent>
    </Card>
  );
}
