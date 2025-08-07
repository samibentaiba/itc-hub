// /admin/_components/admin-tabs.tsx

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UserPlus, Plus, MoreVertical, Edit, Trash2, CheckCircle, Mail, Users2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { User, Team, Department, ModalState } from "../types";

interface AdminTabsProps {
  users: User[];
  teams: Team[];
  departments: Department[];
  onSetModal: (modal: ModalState) => void;
}

/**
 * Displays the main tabbed interface for managing users, teams, and departments.
 * It now uses a single `onSetModal` handler to open any dialog.
 */
export default function AdminTabs({ users, teams, departments, onSetModal }: AdminTabsProps) {

  const getStatusBadgeVariant = (status: string) => status === "verified" ? "default" : "secondary";
  const getUserNameById = (userId: string) => users.find(u => u.id === userId)?.name;

  return (
    <Tabs defaultValue="users" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="teams">Teams</TabsTrigger>
        <TabsTrigger value="departments">Departments</TabsTrigger>
      </TabsList>

      {/* Users Tab */}
      <TabsContent value="users" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div><CardTitle>User Management</CardTitle><CardDescription>Add, edit, and manage user accounts.</CardDescription></div>
            <Button onClick={() => onSetModal({ view: 'ADD_USER' })}><UserPlus className="mr-2 h-4 w-4" />Add User</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell><div className="flex items-center gap-3"><Avatar className="h-9 w-9"><AvatarImage src={user.avatar} /><AvatarFallback>{user.name.charAt(0)}</AvatarFallback></Avatar><div><div className="font-medium">{user.name}</div><div className="text-sm text-muted-foreground">{user.email}</div></div></div></TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
                      {user.status === 'pending' && <Button size="sm" variant="outline" className="ml-2 h-7 px-2" onClick={() => onSetModal({ view: 'VERIFY_USER', data: user })}><CheckCircle className="h-3 w-3 mr-1"/>Verify</Button>}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onSetModal({ view: 'EDIT_USER', data: user })}><Edit className="mr-2 h-4 w-4" />Edit User</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => alert(`Sending email to ${user.email}`)}><Mail className="mr-2 h-4 w-4" />Send Email</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => onSetModal({ view: 'DELETE_USER', data: user })}><Trash2 className="mr-2 h-4 w-4" />Delete User</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Teams Tab */}
      <TabsContent value="teams" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div><CardTitle>Team Management</CardTitle><CardDescription>Create teams and manage their members.</CardDescription></div>
            <Button onClick={() => onSetModal({ view: 'ADD_TEAM' })}><Plus className="mr-2 h-4 w-4" />Create Team</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Team</TableHead><TableHead>Leader(s)</TableHead><TableHead>Members</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {teams.map((team) => {
                  const leaders = team.members.filter(m => m.role === 'leader').map(m => getUserNameById(m.userId)).filter(Boolean).join(', ');
                  return (
                    <TableRow key={team.id}>
                      <TableCell><div className="font-medium">{team.name}</div><div className="text-xs text-muted-foreground">{team.description}</div></TableCell>
                      <TableCell>{leaders || 'N/A'}</TableCell>
                      <TableCell>{team.members.length}</TableCell>
                      <TableCell className="text-right">
                         <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onSetModal({ view: 'MANAGE_MEMBERS', data: { ...team, entityType: 'team' } })}><Users2 className="mr-2 h-4 w-4" />Manage Members</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onSetModal({ view: 'EDIT_TEAM', data: team })}><Edit className="mr-2 h-4 w-4" />Edit Team</DropdownMenuItem>
                             <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => onSetModal({ view: 'DELETE_TEAM', data: team })}><Trash2 className="mr-2 h-4 w-4" />Delete Team</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Departments Tab */}
      <TabsContent value="departments" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div><CardTitle>Department Management</CardTitle><CardDescription>Create departments and assign members.</CardDescription></div>
            <Button onClick={() => onSetModal({ view: 'ADD_DEPARTMENT' })}><Plus className="mr-2 h-4 w-4" />Create Department</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Department</TableHead><TableHead>Leader(s)</TableHead><TableHead>Members</TableHead><TableHead>Teams</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {departments.map((dept) => {
                  const leaders = dept.members.filter(m => m.role === 'leader').map(m => getUserNameById(m.userId)).filter(Boolean).join(', ');
                  return (
                    <TableRow key={dept.id}>
                      <TableCell><div className="font-medium">{dept.name}</div><div className="text-xs text-muted-foreground">{dept.description}</div></TableCell>
                      <TableCell>{leaders || 'N/A'}</TableCell>
                      <TableCell>{dept.members.length}</TableCell>
                      <TableCell>{dept.teams.length}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onSetModal({ view: 'MANAGE_MEMBERS', data: { ...dept, entityType: 'department' } })}><Users2 className="mr-2 h-4 w-4" />Manage Members</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onSetModal({ view: 'EDIT_DEPARTMENT', data: dept })}><Edit className="mr-2 h-4 w-4" />Edit Department</DropdownMenuItem>
                             <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => onSetModal({ view: 'DELETE_DEPARTMENT', data: dept })}><Trash2 className="mr-2 h-4 w-4" />Delete Department</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
