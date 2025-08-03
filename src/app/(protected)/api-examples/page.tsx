"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { 
  Loader2, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Building2, 
  Ticket, 
  MessageSquare,
  FileText,
  Calendar,
  Bell
} from "lucide-react"

interface ApiExample {
  title: string
  description: string
  icon: React.ReactNode
  action: () => Promise<void>
  loading: boolean
}

export default function ApiExamplesPage() {
  const [examples, setExamples] = useState<ApiExample[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>({})
  const { toast } = useToast()

  // Form states for creating data
  const [createForm, setCreateForm] = useState({
    type: "user",
    name: "",
    email: "",
    role: "MEMBER",
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
  })

  useEffect(() => {
    initializeExamples()
  }, [])

  const initializeExamples = () => {
    const examplesList: ApiExample[] = [
      {
        title: "Get All Users",
        description: "Fetch all users with pagination and search",
        icon: <Users className="h-5 w-5" />,
        action: async () => {
          try {
            const response = await api.users.getAll({ limit: 10 })
            setResults({ users: response })
            toast({
              title: "Success",
              description: `Found ${response.users?.length || 0} users`,
            })
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to fetch users",
              variant: "destructive",
            })
          }
        },
        loading: false,
      },
      {
        title: "Get All Departments",
        description: "Fetch all departments with their members",
        icon: <Building2 className="h-5 w-5" />,
        action: async () => {
          try {
            const response = await api.departments.getAll({ limit: 10 })
            setResults({ departments: response })
            toast({
              title: "Success",
              description: `Found ${response.departments?.length || 0} departments`,
            })
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to fetch departments",
              variant: "destructive",
            })
          }
        },
        loading: false,
      },
      {
        title: "Get All Teams",
        description: "Fetch all teams with their members",
        icon: <Users className="h-5 w-5" />,
        action: async () => {
          try {
            const response = await api.teams.getAll({ limit: 10 })
            setResults({ teams: response })
            toast({
              title: "Success",
              description: `Found ${response.teams?.length || 0} teams`,
            })
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to fetch teams",
              variant: "destructive",
            })
          }
        },
        loading: false,
      },
      {
        title: "Get All Tickets",
        description: "Fetch all tickets with filters",
        icon: <Ticket className="h-5 w-5" />,
        action: async () => {
          try {
            const response = await api.tickets.getAll({ 
              limit: 10,
              status: "active,in_progress,pending"
            })
            setResults({ tickets: response })
            toast({
              title: "Success",
              description: `Found ${response.tickets?.length || 0} active tickets`,
            })
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to fetch tickets",
              variant: "destructive",
            })
          }
        },
        loading: false,
      },
      {
        title: "Get All Messages",
        description: "Fetch all messages for a ticket",
        icon: <MessageSquare className="h-5 w-5" />,
        action: async () => {
          try {
            const response = await api.messages.getAll({ limit: 10 })
            setResults({ messages: response })
            toast({
              title: "Success",
              description: `Found ${response.messages?.length || 0} messages`,
            })
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to fetch messages",
              variant: "destructive",
            })
          }
        },
        loading: false,
      },
      {
        title: "Get All Events",
        description: "Fetch all events with date filters",
        icon: <Calendar className="h-5 w-5" />,
        action: async () => {
          try {
            const response = await api.events.getAll({ limit: 10 })
            setResults({ events: response })
            toast({
              title: "Success",
              description: `Found ${response.events?.length || 0} events`,
            })
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to fetch events",
              variant: "destructive",
            })
          }
        },
        loading: false,
      },
      {
        title: "Get All Notifications",
        description: "Fetch user's notifications",
        icon: <Bell className="h-5 w-5" />,
        action: async () => {
          try {
            const response = await api.notifications.getAll({ limit: 10 })
            setResults({ notifications: response })
            toast({
              title: "Success",
              description: `Found ${response.notifications?.length || 0} notifications`,
            })
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to fetch notifications",
              variant: "destructive",
            })
          }
        },
        loading: false,
      },
      {
        title: "Get All Files",
        description: "Fetch all uploaded files",
        icon: <FileText className="h-5 w-5" />,
        action: async () => {
          try {
            const response = await api.files.getAll({ limit: 10 })
            setResults({ files: response })
            toast({
              title: "Success",
              description: `Found ${response.files?.length || 0} files`,
            })
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to fetch files",
              variant: "destructive",
            })
          }
        },
        loading: false,
      },
    ]

    setExamples(examplesList)
  }

  const handleExampleClick = async (index: number) => {
    const updatedExamples = [...examples]
    updatedExamples[index].loading = true
    setExamples(updatedExamples)

    try {
      await updatedExamples[index].action()
    } finally {
      updatedExamples[index].loading = false
      setExamples(updatedExamples)
    }
  }

  const handleCreate = async () => {
    setIsLoading(true)
    try {
      let response
      switch (createForm.type) {
        case "user":
          response = await api.users.create({
            name: createForm.name,
            email: createForm.email,
            password: "password123",
            role: createForm.role as any,
          })
          break
        case "ticket":
          response = await api.tickets.create({
            title: createForm.title,
            description: createForm.description,
            type: "task",
            priority: createForm.priority as any,
            status: createForm.status as any,
          })
          break
        case "department":
          response = await api.departments.create({
            name: createForm.name,
            description: createForm.description,
          })
          break
        case "team":
          response = await api.teams.create({
            name: createForm.name,
            description: createForm.description,
          })
          break
        default:
          throw new Error("Invalid type")
      }

      setResults({ created: response })
      toast({
        title: "Success",
        description: `${createForm.type} created successfully!`,
      })

      // Reset form
      setCreateForm({
        type: "user",
        name: "",
        email: "",
        role: "MEMBER",
        title: "",
        description: "",
        priority: "medium",
        status: "pending",
      })
    } catch (error) {
      console.error('Error creating:', error)
      toast({
        title: "Error",
        description: `Failed to create ${createForm.type}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Examples</h1>
          <p className="text-muted-foreground">
            Examples of how to use the API utility functions
          </p>
        </div>
      </div>

      {/* Create Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Data
          </CardTitle>
          <CardDescription>
            Test creating different types of data using the API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={createForm.type} onValueChange={(value) => setCreateForm({ ...createForm, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="ticket">Ticket</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {createForm.type === "user" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Select value={createForm.role} onValueChange={(value) => setCreateForm({ ...createForm, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="SUPERLEADER">Super Leader</SelectItem>
                      <SelectItem value="LEADER">Leader</SelectItem>
                      <SelectItem value="MEMBER">Member</SelectItem>
                      <SelectItem value="GUEST">Guest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {createForm.type === "ticket" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={createForm.priority} onValueChange={(value) => setCreateForm({ ...createForm, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={createForm.status} onValueChange={(value) => setCreateForm({ ...createForm, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
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
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {createForm.type === "user" ? "Name" : createForm.type === "ticket" ? "Title" : "Name"}
              </label>
              <Input
                value={createForm.type === "user" ? createForm.name : createForm.title}
                onChange={(e) => setCreateForm({
                  ...createForm,
                  [createForm.type === "user" ? "name" : "title"]: e.target.value
                })}
                placeholder={`Enter ${createForm.type === "user" ? "name" : createForm.type === "ticket" ? "title" : "name"}`}
              />
            </div>

            {createForm.type === "user" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="Enter email"
                  type="email"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              placeholder="Enter description"
              rows={3}
            />
          </div>

          <Button onClick={handleCreate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create {createForm.type}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* API Examples Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {examples.map((example, index) => (
          <Card key={example.title} className="cursor-pointer hover:bg-accent/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                {example.icon}
                {example.title}
              </CardTitle>
              <CardDescription className="text-xs">
                {example.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleExampleClick(index)}
                disabled={example.loading}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {example.loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Test API"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Results Display */}
      {Object.keys(results).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>API Results</CardTitle>
            <CardDescription>
              Latest API response data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-xs overflow-auto max-h-96">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 