import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Users2, Edit, Trash2 } from "lucide-react";
import { formatLeaders } from "../utils";

export function DepartmentsTable({ departments, onSetModal }: any) {
  return (
    <Table>
      <TableHeader><TableRow><TableHead>Department</TableHead><TableHead>Manager</TableHead><TableHead>Members</TableHead><TableHead>Teams</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
      <TableBody>
        {departments.map((dept: any) => (
          <TableRow key={dept.id}>
            <TableCell>
              <div className="font-medium">{dept.name}</div>
              <div className="text-xs text-muted-foreground">{dept.description}</div>
            </TableCell>
            <TableCell>{formatLeaders(dept.managers)}</TableCell>
            <TableCell>{dept.members.length}</TableCell>
            <TableCell>{dept.teams?.length}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onSetModal({ view: "MANAGE_MEMBERS", data: { ...dept, entityType: "department" } })}><Users2 className="mr-2 h-4 w-4" />Manage Members</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSetModal({ view: "EDIT_DEPARTMENT", data: dept })}><Edit className="mr-2 h-4 w-4" />Edit Department</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={() => onSetModal({ view: "DELETE_DEPARTMENT", data: dept })}><Trash2 className="mr-2 h-4 w-4" />Delete Department</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}