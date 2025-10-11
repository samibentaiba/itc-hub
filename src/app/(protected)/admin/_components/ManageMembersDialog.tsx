
// /app/(protected)/admin/_components/ManageMembersDialog.tsx
"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Trash2 } from "lucide-react";
import type { User, Team, Department } from "../types";

// This type is local to this component, so it's defined here.
type ManagingEntity = ({ entityType: "team" } & Team) | ({ entityType: "department" } & Department) | null;

interface ManageMembersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  entity: ManagingEntity;
  allUsers: User[];
  memberActions: {
    add: (entityId: string, entityType: "team" | "department", userId: string, role: "manager" | "member") => void;
    remove: (entityId: string, entityType: "team" | "department", userId: string) => void;
    updateRole: (entityId: string, entityType: "team" | "department", userId: string, newRole: "manager" | "member") => void;
  };
}

export function ManageMembersDialog({ isOpen, onClose, entity, allUsers, memberActions }: ManageMembersDialogProps) {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState<"manager" | "member">("member");

  if (!entity) return null;

  const isTeam = entity.entityType === 'team';
  const roles = [
    { value: 'manager', label: isTeam ? 'Leader' : 'Manager' },
    { value: 'member', label: 'Member' },
  ];

  const memberUserIds = useMemo(() => new Set(entity.members.map((m) => m.userId)), [entity.members]);
  const potentialNewMembers = useMemo(() => allUsers.filter((u) => !memberUserIds.has(u.id)), [allUsers, memberUserIds]);
  const getUserById = (userId: string) => allUsers.find((u) => u.id === userId);

  const handleAddClick = () => {
    if (selectedUser) {
      memberActions.add(entity.id, entity.entityType, selectedUser, selectedRole);
      setSelectedUser("");
      setSelectedRole("member");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Members for {entity.name}</DialogTitle>
          <DialogDescription>Add, remove, and assign roles to members.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {/* Add New Member Form */}
          <div className="flex items-end gap-2 p-4 border rounded-lg">
            <div className="flex-grow space-y-2">
              <label className="text-sm font-medium">Add New Member</label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger><SelectValue placeholder="Select a user to add" /></SelectTrigger>
                <SelectContent>
                  {potentialNewMembers.length > 0 ? (
                    potentialNewMembers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>{user.name} ({user.email})</SelectItem>
                    ))
                  ) : (
                    <p className="p-4 text-sm text-muted-foreground">No users available to add.</p>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={selectedRole} onValueChange={(r: "manager" | "member") => setSelectedRole(r)}>
                <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {roles.map(role => <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddClick} disabled={!selectedUser}><UserPlus className="h-4 w-4" /></Button>
          </div>

          {/* Current Members Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader><TableRow><TableHead>Member</TableHead><TableHead>Role</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
              <TableBody>
                {entity.members.length > 0 ? (
                  entity.members.map((member) => {
                    const user = getUserById(member.userId);
                    return user ? (
                      <TableRow key={member.userId}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>
                          <Select
                            value={member.role}
                            onValueChange={(newRole: "manager" | "member") => memberActions.updateRole(entity.id, entity.entityType, member.userId, newRole)}
                          >
                            <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {roles.map(role => <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => memberActions.remove(entity.id, entity.entityType, member.userId)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ) : null;
                  })
                ) : (
                  <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-4">No members yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
