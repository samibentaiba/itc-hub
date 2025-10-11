import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Mail, Trash2, CheckCircle } from "lucide-react";
import { getStatusBadgeVariant } from "../utils";

export function UsersTable({ users, onSetModal }: UsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user: User) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
              {user.status === "pending" && (
                <Button size="sm" variant="outline" className="ml-2 h-7 px-2" onClick={() => onSetModal({ view: "VERIFY_USER", data: user })}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verify
                </Button>
              )}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onSetModal({ view: "EDIT_USER", data: user })}><Edit className="mr-2 h-4 w-4" />Edit User</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => alert(`Sending email to ${user.email}`)}><Mail className="mr-2 h-4 w-4" />Send Email</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={() => onSetModal({ view: "DELETE_USER", data: user })}><Trash2 className="mr-2 h-4 w-4" />Delete User</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}