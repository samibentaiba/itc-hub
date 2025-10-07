import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  MoreVertical,
  Edit,
  Mail,
  Trash2,
  CheckCircle,
  Plus,
  Users2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import { CalendarView } from "./CalendarView";
import { CalendarSidebar } from "./CalendarSidebar";
import type { User } from "../types";

/**
 * @component AdminTabs
 * @description Renders the main tabbed interface for the admin dashboard, allowing navigation between user, team, department, calendar, and event request management.
 * @param {object} props - The component props.
 * @returns {JSX.Element} - The rendered tabs component.
 */
export function AdminTabs({
  userData,
  teamData,
  departmentData,
  eventRequestData,
  calendarData,
  onSetModal,
  loadingAction,
}: any) {
  const getStatusBadgeVariant = (status: string) => (status === "verified" ? "default" : "secondary");

  const formatLeaders = (leaders: User[]) => {
    if (!leaders || leaders.length === 0) return "N/A";
    if (leaders.length === 1) return leaders[0].name;
    return `${leaders[0].name} +${leaders.length - 1}`;
  };

  return (
    <Tabs defaultValue="users" className="space-y-4">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="teams">Teams</TabsTrigger>
        <TabsTrigger value="departments">Departments</TabsTrigger>
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
        <TabsTrigger value="requests">Event Requests</TabsTrigger>
      </TabsList>

      {/* Users Tab */}
      <TabsContent value="users" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Add, edit, and manage user accounts.</CardDescription>
            </div>
            <Button onClick={() => onSetModal({ view: "ADD_USER" })}><UserPlus className="mr-2 h-4 w-4" />Add User</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {userData.users.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9"><AvatarImage src={user.avatar} /><AvatarFallback>{user.name.charAt(0)}</AvatarFallback></Avatar>
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
          </CardContent>
        </Card>
      </TabsContent>

      {/* Teams Tab */}
      <TabsContent value="teams" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>Create teams and manage their members.</CardDescription>
            </div>
            <Button onClick={() => onSetModal({ view: "ADD_TEAM" })}><Plus className="mr-2 h-4 w-4" />Create Team</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Team</TableHead><TableHead>Leader</TableHead><TableHead>Members</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {teamData.teams.map((team: any) => (
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
          </CardContent>
        </Card>
      </TabsContent>

      {/* Departments Tab */}
      <TabsContent value="departments" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Department Management</CardTitle>
              <CardDescription>Create departments and assign members.</CardDescription>
            </div>
            <Button onClick={() => onSetModal({ view: "ADD_DEPARTMENT" })}><Plus className="mr-2 h-4 w-4" />Create Department</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Department</TableHead><TableHead>Manager</TableHead><TableHead>Members</TableHead><TableHead>Teams</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {departmentData.departments.map((dept: any) => (
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
          </CardContent>
        </Card>
      </TabsContent>

      {/* Calendar Tab */}
      <TabsContent value="calendar" className="space-y-4">
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Calendar className="h-5 w-5" />
                    {calendarData.utils.formatDate(calendarData.currentDate)}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => calendarData.actions.navigate("prev")}><ChevronLeft className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" onClick={() => calendarData.actions.navigate("next")}><ChevronRight className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent><CalendarView calendarData={calendarData} /></CardContent>
            </Card>
          </div>
          <CalendarSidebar calendarData={calendarData} />
        </div>
      </TabsContent>

      {/* Event Requests Tab */}
      <TabsContent value="requests" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Event Requests</CardTitle>
            <CardDescription>Review and approve event submissions from teams and departments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Event Title</TableHead><TableHead>Submitted By</TableHead><TableHead>Date & Time</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {eventRequestData.pendingEvents.length > 0 ? (
                  eventRequestData.pendingEvents.map((event: any) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{event.description}</div>
                      </TableCell>
                      <TableCell><Badge variant={event.submittedByType === "team" ? "secondary" : "outline"}>{event.submittedBy}</Badge></TableCell>
                      <TableCell>
                        <div>{new Date(event.date).toLocaleDateString()}</div>
                        <div className="text-xs text-muted-foreground">{event.time}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="mr-2" onClick={() => eventRequestData.handleRejectEvent(event)} disabled={!!loadingAction}><X className="h-4 w-4 mr-1" />Reject</Button>
                        <Button size="sm" onClick={() => eventRequestData.handleAcceptEvent(event)} disabled={!!loadingAction}><Check className="h-4 w-4 mr-1" />Accept</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No pending event requests.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}