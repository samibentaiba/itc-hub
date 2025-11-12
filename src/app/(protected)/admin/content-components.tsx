// src/app/(protected)/admin/content-components.tsx
"use client";

import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  FileText,
  Video,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Check,
  X,
  Loader2,
} from "lucide-react";
import type {
  Project,
  Vlog,
  PendingProject,
  PendingVlog,
  ProjectFormData,
  VlogFormData,
} from "./content-types";
import { useProjectFormDialog, useVlogFormDialog } from "./content-hooks";

// ===== STATUS BADGE COMPONENT =====
export const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    published: "default" as const,
    pending: "secondary" as const,
    draft: "outline" as const,
  };

  const variant = variants[status as keyof typeof variants] || "outline";

  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  );
};

// ===== PROJECTS TABLE =====
export function ProjectsTable({
  projects,
  onEdit,
  onDelete,
  onUpdateStatus,
}: {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onUpdateStatus: (
    projectId: string,
    status: "draft" | "published" | "pending"
  ) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center text-muted-foreground py-8"
            >
              No projects found.
            </TableCell>
          </TableRow>
        ) : (
          projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {project.image && (
                    <Image
                      src={project.image}
                      alt={project.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded object-cover"
                    />
                  )}
                  <div>
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {project.description}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {project.type.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={project.author.avatar || ""} />
                    <AvatarFallback className="text-xs">
                      {project.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{project.author.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Select
                  value={project.status}
                  onValueChange={(value: "draft" | "published" | "pending") =>
                    onUpdateStatus(project.id, value)
                  }
                >
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        window.open(`/projects/${project.slug}`, "_blank")
                      }
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Project
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(project)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Project
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(project.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

// ===== VLOGS TABLE =====
export function VlogsTable({
  vlogs,
  onEdit,
  onDelete,
  onUpdateStatus,
}: {
  vlogs: Vlog[];
  onEdit: (vlog: Vlog) => void;
  onDelete: (vlogId: string) => void;
  onUpdateStatus: (
    vlogId: string,
    status: "draft" | "published" | "pending"
  ) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vlog</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vlogs.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center text-muted-foreground py-8"
            >
              No vlogs found.
            </TableCell>
          </TableRow>
        ) : (
          vlogs.map((vlog) => (
            <TableRow key={vlog.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {vlog.image && (
                    <Image
                      src={vlog.image}
                      alt={vlog.title}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded object-cover"
                    />
                  )}
                  <div>
                    <div className="font-medium">{vlog.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {vlog.description}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={vlog.author.avatar || ""} />
                    <AvatarFallback className="text-xs">
                      {vlog.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{vlog.author.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Select
                  value={vlog.status}
                  onValueChange={(value: "draft" | "published" | "pending") =>
                    onUpdateStatus(vlog.id, value)
                  }
                >
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {new Date(vlog.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        window.open(`/vlogs/${vlog.slug}`, "_blank")
                      }
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Vlog
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(vlog)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Vlog
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(vlog.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Vlog
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

// ===== CONTENT REQUESTS TABLE =====
export function ContentRequestsTable({
  pendingProjects,
  pendingVlogs,
  onApproveProject,
  onRejectProject,
  onApproveVlog,
  onRejectVlog,
  loadingAction,
}: {
  pendingProjects: PendingProject[];
  pendingVlogs: PendingVlog[];
  onApproveProject: (projectId: string) => void;
  onRejectProject: (projectId: string) => void;
  onApproveVlog: (vlogId: string) => void;
  onRejectVlog: (vlogId: string) => void;
  loadingAction: string | null;
}) {
  const allRequests = [
    ...pendingProjects.map((p) => ({ ...p, type: "project" as const })),
    ...pendingVlogs.map((v) => ({ ...v, type: "vlog" as const })),
  ].sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Submitted By</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allRequests.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center text-muted-foreground py-8"
            >
              No pending requests.
            </TableCell>
          </TableRow>
        ) : (
          allRequests.map((request) => (
            <TableRow key={`${request.type}-${request.id}`}>
              <TableCell>
                <Badge variant="outline" className="gap-1">
                  {request.type === "project" ? (
                    <>
                      <FileText className="h-3 w-3" /> Project
                    </>
                  ) : (
                    <>
                      <Video className="h-3 w-3" /> Vlog
                    </>
                  )}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  {"name" in request ? request.name : request.title}
                </div>
                <div className="text-sm text-muted-foreground line-clamp-1">
                  {request.description}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    request.submittedByType === "team" ? "secondary" : "outline"
                  }
                >
                  {request.submittedBy}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(request.submittedAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() =>
                    request.type === "project"
                      ? onRejectProject(request.id)
                      : onRejectVlog(request.id)
                  }
                  disabled={!!loadingAction}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    request.type === "project"
                      ? onApproveProject(request.id)
                      : onApproveVlog(request.id)
                  }
                  disabled={!!loadingAction}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

// ===== PROJECT FORM DIALOG =====
export function ProjectFormDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData & { id?: string }) => Promise<boolean>;
  isLoading: boolean;
  initialData?: Project | null;
}) {
  const { handleFormSubmit, isEditMode, form } = useProjectFormDialog({
    isOpen,
    onSubmit,
    initialData,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Project" : "Create New Project"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the project details."
              : "Add a new project to the platform."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => handleFormSubmit(data))}
            className="space-y-4 pt-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. AI Assistant" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. ai-assistant" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the project..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AI">AI</SelectItem>
                        <SelectItem value="UI_UX">UI/UX</SelectItem>
                        <SelectItem value="SOFTWARE">Software</SelectItem>
                        <SelectItem value="WEB_DEV">Web Development</SelectItem>
                        <SelectItem value="NETWORKING">Networking</SelectItem>
                        <SelectItem value="SECURITY">Security</SelectItem>
                        <SelectItem value="DEV_OPS">DevOps</SelectItem>
                        <SelectItem value="VFX">VFX</SelectItem>
                        <SelectItem value="MEDIA">Media</SelectItem>
                        <SelectItem value="ROBOTICS">Robotics</SelectItem>
                        <SelectItem value="GAME_DEV">
                          Game Development
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. AI, Machine Learning, Python"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="projectLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Link (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="githubLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Link (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Save Changes" : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ===== VLOG FORM DIALOG =====
export function VlogFormDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VlogFormData & { id?: string }) => Promise<boolean>;
  isLoading: boolean;
  initialData?: Vlog | null;
}) {
  const { handleFormSubmit, isEditMode, form } = useVlogFormDialog({
    isOpen,
    onSubmit,
    initialData,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Vlog" : "Create New Vlog"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the vlog details."
              : "Add a new vlog to the platform."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => handleFormSubmit(data))}
            className="space-y-4 pt-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vlog Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Team Building Event"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. team-building-event"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the vlog..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Save Changes" : "Create Vlog"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
