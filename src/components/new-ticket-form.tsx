"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, X } from "lucide-react"

interface NewTicketFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export default function NewTicketForm({ onSuccess, onCancel }: NewTicketFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "task",
    priority: "medium",
    status: "pending",
    dueDate: "",
  })
  const [users, setUsers] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [selectedAssignee, setSelectedAssignee] = useState("")
  const [selectedTeam, setSelectedTeam] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const { toast } = useToast()

  // Load users, teams, and departments for dropdowns
  const loadFormData = async () => {
    try {
      const [usersResponse, teamsResponse, departmentsResponse] = await Promise.all([
        api.users.getAll({ limit: 100 }),
        api.teams.getAll({ limit: 100 }),
        api.departments.getAll({ limit: 100 }),
      ])

      setUsers(usersResponse.users || [])
      setTeams(teamsResponse.teams || [])
      setDepartments(departmentsResponse.departments || [])
    } catch (error) {
      console.error('Error loading form data:', error)
      toast({
        title: "Error",
        description: "Failed to load form data. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Load data when component mounts
  useState(() => {
    loadFormData()
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const ticketData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate || undefined,
        assigneeId: selectedAssignee || undefined,
        teamId: selectedTeam || undefined,
        departmentId: selectedDepartment || undefined,
      }

      const newTicket = await api.tickets.create(ticketData)

      toast({
        title: "Success",
        description: "Ticket created successfully!",
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        type: "task",
        priority: "medium",
        status: "pending",
        dueDate: "",
      })
      setSelectedAssignee("")
      setSelectedTeam("")
      setSelectedDepartment("")

      onSuccess?.()
    } catch (error) {
      console.error('Error creating ticket:', error)
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Ticket
        </CardTitle>
        <CardDescription>
          Fill in the details below to create a new support ticket
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter ticket title"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description *
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the issue or task"
              rows={4}
              required
            />
          </div>

          {/* Type and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Type
              </label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Priority
              </label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status and Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium">
                Due Date
              </label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
              />
            </div>
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <label htmlFor="assignee" className="text-sm font-medium">
              Assignee
            </label>
            <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
              <SelectTrigger>
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Team and Department */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="team" className="text-sm font-medium">
                Team
              </label>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No team</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="department" className="text-sm font-medium">
                Department
              </label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No department</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Preview</label>
            <div className="p-3 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{formData.type}</Badge>
                <Badge variant={formData.priority === "high" || formData.priority === "urgent" ? "destructive" : "default"}>
                  {formData.priority}
                </Badge>
                <Badge variant={formData.status === "pending" ? "destructive" : "secondary"}>
                  {formData.status.replace('_', ' ')}
                </Badge>
              </div>
              <h4 className="font-medium">{formData.title || "Ticket title"}</h4>
              <p className="text-sm text-muted-foreground">
                {formData.description || "Ticket description"}
              </p>
              {formData.dueDate && (
                <p className="text-xs text-muted-foreground mt-1">
                  Due: {new Date(formData.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading || !formData.title || !formData.description}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Ticket
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
