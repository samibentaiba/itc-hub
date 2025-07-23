"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogClose } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export function NewTicketForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    workspace: "",
    assignee: "",
    dueDate: "",
  })
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock ticket creation
    toast({
      title: "Ticket created successfully!",
      description: `"${formData.title}" has been created and assigned.`,
    })

    // Reset form
    setFormData({
      title: "",
      description: "",
      type: "",
      workspace: "",
      assignee: "",
      dueDate: "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter ticket title..."
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the task, meeting, or event..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="task">Task</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="event">Event</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Workspace</Label>
          <Select value={formData.workspace} onValueChange={(value) => setFormData({ ...formData, workspace: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select workspace" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="team-1">Frontend Team</SelectItem>
              <SelectItem value="team-2">Backend Team</SelectItem>
              <SelectItem value="dept-1">Development Department</SelectItem>
              <SelectItem value="dept-2">Design Department</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Assignee</Label>
          <Select value={formData.assignee} onValueChange={(value) => setFormData({ ...formData, assignee: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Assign to..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="u1">Sami</SelectItem>
              <SelectItem value="u2">Ali</SelectItem>
              <SelectItem value="u3">Sara</SelectItem>
              <SelectItem value="u4">Yasmine</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="submit" className="bg-red-600 hover:bg-red-700">
            Create Ticket
          </Button>
        </DialogClose>
      </div>
    </form>
  )
}
