// src/app/(protected)/departments/[departmentId]/_components/members_tab.tsx

/**
 * components/department/MembersTab.tsx
 *
 * This component renders the content for the "Members" tab.
 * It displays a list of members in the department.
 */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Member } from "../types";

interface MembersTabProps {
  members: Member[];
}

export const MembersTab = ({ members }: MembersTabProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Department Members</CardTitle>
      <CardDescription>
        All members of this department.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{member.name}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{member.role}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);