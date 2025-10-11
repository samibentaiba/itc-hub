import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { UsersTable } from "./UsersTable";

export function UserTab({ userData, onSetModal }: UserTabProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Add, edit, and manage user accounts.</CardDescription>
        </div>
        <Button onClick={() => onSetModal({ view: "ADD_USER" })}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </CardHeader>
      <CardContent>
        <UsersTable users={userData.users} onSetModal={onSetModal} />
      </CardContent>
    </Card>
  );
}