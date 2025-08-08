"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogClose } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Define interfaces for the component's props
interface Workspace {
  id: string;
  name: string;
  type: "team" | "department";
}

interface User {
  id: string;
  name: string;
  role: string;
}

interface NewTicketFormProps {
  contextType: "department" | "team";
  contextId: string;
  availableUsers: User[];
  availableWorkspaces?: Workspace[]; // Made this prop optional
}

export function NewTicketForm({
  contextType,
  contextId,
  availableUsers,
  availableWorkspaces, // Can now be undefined
}: NewTicketFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    workspace: contextType === "team" ? contextId : "",
    assignee: "",
    dueDate: undefined as Date | undefined,
    priority: "medium",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const isRequest = formData.type === "meeting" || formData.type === "event";

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.type) newErrors.type = "Type is required";
    // Only validate workspace if it's meant to be shown
    if (availableWorkspaces && !formData.workspace)
      newErrors.workspace = "Workspace is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newItem = {
        id: `${isRequest ? "request" : "ticket"}-${Date.now()}`,
        ...formData,
        status: isRequest ? "pending_approval" : "pending",
        createdAt: new Date().toISOString(),
        createdBy: "current-user",
        messages: 0,
        context: {
          type: contextType,
          id: contextId,
        },
      };

      const storageKey = isRequest ? "requests" : "tickets";
      const existingItems = JSON.parse(
        localStorage.getItem(storageKey) || "[]"
      );
      existingItems.push(newItem);
      localStorage.setItem(storageKey, JSON.stringify(existingItems));

      toast({
        title: isRequest ? "Request Sent!" : "Ticket Created!",
        description: isRequest
          ? `Your request for "${formData.title}" has been sent for approval.`
          : `"${formData.title}" has been created.`,
      });

      // Reset form and close dialog
      setFormData({
        title: "",
        description: "",
        type: "",
        workspace: contextId,
        assignee: "",
        dueDate: undefined,
        priority: "medium",
      });
      setErrors({});
      document
        .querySelector("[data-dialog-close]")
        ?.dispatchEvent(new MouseEvent("click"));
    } catch {
      toast({
        title: "Error",
        description: `Failed to create ticket. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      type: "",
      workspace: contextId,
      assignee: "",
      dueDate: undefined,
      priority: "medium",
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title and Description fields remain the same */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Enter title..."
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={cn(errors.title && "border-red-500")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe the task, meeting, or event..."
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className={cn("min-h-[80px]", errors.description && "border-red-500")}
        />
        </div>

      {/* Type and Priority fields remain the same */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                type: value,
                assignee:
                  value === "meeting" || value === "event"
                    ? ""
                    : formData.assignee,
              })
            }
          >
            <SelectTrigger className={cn(errors.type && "border-red-500")}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="task">📋 Task</SelectItem>
              {/* <SelectItem value="meeting">🤝 Meeting</SelectItem>
              <SelectItem value="event">📅 Event</SelectItem> */}
              <SelectItem value="bug">🐛 Bug</SelectItem>
              <SelectItem value="feature">✨ Feature</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) =>
              setFormData({ ...formData, priority: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">🟢 Low</SelectItem>
              <SelectItem value="medium">🟡 Medium</SelectItem>
              <SelectItem value="high">🔴 High</SelectItem>
              <SelectItem value="urgent">🚨 Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Conditionally render Workspace select */}
      {availableWorkspaces && availableWorkspaces.length > 0 && (
        <div className="space-y-2">
          <Label>
            Workspace <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.workspace}
            onValueChange={(value) =>
              setFormData({ ...formData, workspace: value })
            }
            disabled={contextType === "team"}
          >
            <SelectTrigger className={cn(errors.workspace && "border-red-500")}>
              <SelectValue placeholder="Select workspace" />
            </SelectTrigger>
            <SelectContent>
              {availableWorkspaces.map((ws) => (
                <SelectItem key={ws.id} value={ws.id}>
                  {ws.type === "team" ? "👥" : "🏢"} {ws.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Assignee and Due Date fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {!isRequest ? (
          <div className="space-y-2">
            <Label>Assignee</Label>
            <Select
              value={formData.assignee}
              onValueChange={(value) =>
                setFormData({ ...formData, assignee: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Assign to..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {availableUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    👤 {user.name} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div />
        )}

        <div className="space-y-2">
          <Label>
            Due Date <span className="text-red-500">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.dueDate && "text-muted-foreground",
                  errors.dueDate && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dueDate
                  ? format(formData.dueDate, "PPP")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.dueDate}
                onSelect={(date) => setFormData({ ...formData, dueDate: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Form actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={isLoading}
        >
          Reset
        </Button>
        <DialogClose asChild>
          <Button type="button" variant="ghost" data-dialog-close>
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          className="bg-red-800 text-white hover:bg-red-700"
          disabled={
            isLoading ||
            !formData.title ||
            !formData.description ||
            !formData.type ||
            !formData.dueDate
          }
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
            </>
          ) : isRequest ? (
            "Send Request"
          ) : (
            "Create Ticket"
          )}
        </Button>
      </div>
    </form>
  );
}
