// /admin/_components/manage-members-dialog.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, UserPlus } from "lucide-react";
import type { User,  } from "../../types";

// Updated entity type to be more specific
type ManagingEntity = (({ entityType: 'team' } & import('../../types').Team) | ({ entityType: 'department' } & import('../../types').Department)) | null;

interface ManageMembersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  entity: ManagingEntity;
  allUsers: User[];
  onAddMember: (entityId: string, entityType: 'team' | 'department', userId: string, role: 'leader' | 'member') => void;
  onRemoveMember: (entityId: string, entityType: 'team' | 'department', userId: string) => void;
  onChangeMemberRole: (entityId: string, entityType: 'team' | 'department', userId: string, newRole: 'leader' | 'member') => void;
}

/**
 * A dialog to manage members of a team or department.
 * Its logic is complex enough to remain a standalone component.
 */
export default function ManageMembersDialog({
  isOpen, onClose, entity, allUsers, onAddMember, onRemoveMember, onChangeMemberRole
}: ManageMembersDialogProps) {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState<'leader' | 'member'>("member");

  if (!entity) return null;

  const entityMembers = entity.members;
    const memberUserIds = new Set(entityMembers.map(m => m.userId));
  const potentialNewMembers = allUsers.filter(u => !memberUserIds.has(u.id));

  const getUserById = (userId: string) => allUsers.find(u => u.id === userId);

  const handleAddClick = () => {
    if (selectedUser && selectedRole) {
      onAddMember(entity.id, entity.entityType, selectedUser, selectedRole);
      setSelectedUser(""); // Reset dropdown
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
                  {potentialNewMembers.length > 0 ? potentialNewMembers.map(user => (
                    <SelectItem key={user.id} value={user.id}>{user.name} ({user.email})</SelectItem>
                  )) : <p className="p-4 text-sm text-muted-foreground">No users available to add.</p>}
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={selectedRole} onValueChange={(r: 'leader' | 'member') => setSelectedRole(r)}>
                <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="leader">Leader</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddClick} disabled={!selectedUser}><UserPlus className="h-4 w-4" /></Button>
          </div>

          {/* Current Members Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entityMembers.length > 0 ? entityMembers.map((member: { userId: string, role: 'leader' | 'member' }) => {
                  const user = getUserById(member.userId);
                  return user ? (
                    <TableRow key={member.userId}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <Select value={member.role} onValueChange={(newRole: 'leader' | 'member') => onChangeMemberRole(entity.id, entity.entityType, member.userId, newRole)}>
                          <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="leader">Leader</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => onRemoveMember(entity.id, entity.entityType, member.userId)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : null;
                }) : (
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
