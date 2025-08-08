"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogClose } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// Define interfaces for the component's props
interface Workspace {
  id: string;
  name: string;
  type: 'team' | 'department';
}

interface User {
  id: string;
  name: string;
  role: string;
}

interface NewTicketFormProps {
  contextType: 'department' | 'team';
  contextId: string;
  availableWorkspaces: Workspace[];
  availableUsers: User[];
}

export function NewTicketForm({
  contextType,
  contextId,
  availableWorkspaces,
  availableUsers,
}: NewTicketFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    workspace: contextType === 'team' ? contextId : "",
    assignee: "",
    dueDate: undefined as Date | undefined,
    priority: "medium",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const isRequest = formData.type === "meeting" || formData.type === "event"

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.type) newErrors.type = "Type is required"
    if (!formData.workspace) newErrors.workspace = "Workspace is required"
    if (!formData.dueDate) newErrors.dueDate = "Due date is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newItem = {
        id: `${isRequest ? 'request' : 'ticket'}-${Date.now()}`,
        ...formData,
        status: isRequest ? "pending_approval" : "pending",
        createdAt: new Date().toISOString(),
        createdBy: "current-user", // This should be replaced with actual user data
        messages: 0,
        context: {
            type: contextType,
            id: contextId
        }
      }

      const storageKey = isRequest ? "requests" : "tickets"
      const existingItems = JSON.parse(localStorage.getItem(storageKey) || "[]")
      existingItems.push(newItem)
      localStorage.setItem(storageKey, JSON.stringify(existingItems))

      if (isRequest) {
        toast({
          title: "Request Sent Successfully!",
          description: `Your request for the ${formData.type} "${formData.title}" has been sent for admin approval.`,
        })
      } else {
        toast({
          title: "Ticket Created Successfully!",
          description: `"${formData.title}" has been created and assigned to ${formData.assignee || "unassigned"}.`,
        })
      }

      setFormData({
        title: "",
        description: "",
        type: "",
        workspace: contextType === 'team' ? contextId : "",
        assignee: "",
        dueDate: undefined,
        priority: "medium",
      })
      setErrors({})

      setTimeout(() => {
        const closeButton = document.querySelector("[data-dialog-close]") as HTMLButtonElement
        closeButton?.click()
      }, 1000)
    } catch {
      toast({
        title: isRequest ? "Request Failed" : "Creation Failed",
        description: `Failed to ${isRequest ? "send request" : "create ticket"}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
        title: "",
        description: "",
        type: "",
        workspace: contextType === 'team' ? contextId : "",
        assignee: "",
        dueDate: undefined,
        priority: "medium",
      })
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Enter title..."
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={cn("text-sm", errors.title && "border-red-500")}
          disabled={isLoading}
        />
        {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe the task, meeting, or event..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={cn("text-sm min-h-[80px]", errors.description && "border-red-500")}
          disabled={isLoading}
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm">
            Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value) => {
              const isMeetingOrEvent = value === "meeting" || value === "event";
              setFormData({ 
                ...formData, 
                type: value,
                assignee: isMeetingOrEvent ? "" : formData.assignee 
              });
            }}
            disabled={isLoading}
          >
            <SelectTrigger className={cn("text-sm", errors.type && "border-red-500")}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="task">📋 Task</SelectItem>
              <SelectItem value="meeting">🤝 Meeting</SelectItem>
              <SelectItem value="event">📅 Event</SelectItem>
              <SelectItem value="bug">🐛 Bug</SelectItem>
              <SelectItem value="feature">✨ Feature</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-xs text-red-500">{errors.type}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => setFormData({ ...formData, priority: value })}
            disabled={isLoading}
          >
            <SelectTrigger className="text-sm">
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

      <div className="space-y-2">
        <Label className="text-sm">
          Workspace <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.workspace}
          onValueChange={(value) => setFormData({ ...formData, workspace: value })}
          disabled={isLoading || contextType === 'team'}
        >
          <SelectTrigger className={cn("text-sm", errors.workspace && "border-red-500")}>
            <SelectValue placeholder={contextType === 'team' ? "Not applicable for teams" : "Select workspace"} />
          </SelectTrigger>
          <SelectContent>
            {availableWorkspaces.map(ws => (
                <SelectItem key={ws.id} value={ws.id}>
                    {ws.type === 'team' ? '👥' : '🏢'} {ws.name}
                </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.workspace && <p className="text-xs text-red-500">{errors.workspace}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {!isRequest && (
            <div className="space-y-2">
            <Label className="text-sm">Assignee</Label>
            <Select
                value={formData.assignee}
                onValueChange={(value) => setFormData({ ...formData, assignee: value })}
                disabled={isLoading}
            >
                <SelectTrigger className="text-sm">
                <SelectValue placeholder="Assign to..." />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {availableUsers.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                        👤 {user.name} ({user.role})
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
            </div>
        )}

        <div className={cn("space-y-2", isRequest && "sm:col-span-2")}>
          <Label className="text-sm">
            Due Date <span className="text-red-500">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal text-sm",
                  !formData.dueDate && "text-muted-foreground",
                  errors.dueDate && "border-red-500",
                )}
                disabled={isLoading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dueDate ? format(formData.dueDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.dueDate}
                onSelect={(date) => setFormData({ ...formData, dueDate: date })}
                disabled={(date) => date < new Date() || (date === null)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.dueDate && <p className="text-xs text-red-500">{errors.dueDate}</p>}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="text-sm bg-transparent"
          disabled={isLoading}
        >
          Reset
        </Button>
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            className="text-sm bg-transparent"
            disabled={isLoading}
            data-dialog-close
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          className="bg-red-800 text-white hover:bg-red-700 text-sm"
          disabled={
            isLoading ||
            !formData.title ||
            !formData.description ||
            !formData.type ||
            !formData.workspace ||
            !formData.dueDate
          }
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isRequest ? "Sending Request..." : "Creating Ticket..."}
            </>
          ) : (
            isRequest ? "Send Request" : "Create Ticket"
          )}
        </Button>
      </div>
    </form>
  )
}
