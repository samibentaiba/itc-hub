import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Users2, Edit, Trash2 } from "lucide-react";
import { formatLeaders } from "../utils";

export function TeamsTable({ teams, onSetModal }: TeamsTableProps) {
  return (
    <Table>
      <TableHeader><TableRow><TableHead>Team</TableHead><TableHead>Leader</TableHead><TableHead>Members</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
      <TableBody>
        {teams.map((team: Team) => (
          <TableRow key={team.id}>
            <TableCell>
              <div className="font-medium">{team.name}</div>
              <div className="text-xs text-muted-foreground">{team.description}</div>
            </TableCell>
            <TableCell>{formatLeaders(team.leaders)}</TableCell>
            <TableCell>{team.members.length}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onSetModal({ view: "MANAGE_MEMBERS", data: { ...team, entityType: "team" } })}><Users2 className="mr-2 h-4 w-4" />Manage Members</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSetModal({ view: "EDIT_TEAM", data: team })}><Edit className="mr-2 h-4 w-4" />Edit Team</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={() => onSetModal({ view: "DELETE_TEAM", data: team })}><Trash2 className="mr-2 h-4 w-4" />Delete Team</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}