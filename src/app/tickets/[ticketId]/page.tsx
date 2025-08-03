"use client"

import type React from "react"
import {  useRef } from "react"
import {  CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Send,
  ImageIcon,
  LinkIcon,
  MoreVertical,
  CheckCircle,
  Clock,
  Users,
  Building2,
  Paperclip,
  Smile,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
interface TicketChatViewProps {
  ticketId: string
}
export default function TicketDetailPage() {
  const params = useParams()
  const ticketId = params.ticketId as string
  const [loading, setLoading] = useState(true)
  const [ticket, setTicket] = useState<{
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    assignee: {
      name: string;
      avatar: string;
      id: string;
    };
    reporter: {
      name: string;
      avatar: string;
      id: string;
    };
    createdAt: string;
    updatedAt: string;
    team: string;
    labels: string[];
  } | null>(null)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Mock ticket data based on ticketId
      const mockTicket = {
        id: ticketId,
        title: ticketId === "T-001" ? "Login page not responsive on mobile" : "Database connection timeout",
        description:
          ticketId === "T-001"
            ? "The login form breaks on mobile devices below 768px width. Users are unable to complete the login process on their phones."
            : "API endpoints are timing out due to database connection issues. This is affecting user experience across the platform.",
        status: ticketId === "T-001" ? "open" : "in-progress",
        priority: ticketId === "T-001" ? "high" : "urgent",
        assignee: {
          name: ticketId === "T-001" ? "Sami Al-Rashid" : "Ali Mohammed",
          avatar: "/placeholder.svg?height=32&width=32",
          id: ticketId === "T-001" ? "sami" : "ali",
        },
        reporter: {
          name: ticketId === "T-001" ? "Yasmine Hassan" : "Sami Al-Rashid",
          avatar: "/placeholder.svg?height=32&width=32",
          id: ticketId === "T-001" ? "yasmine" : "sami",
        },
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-16T14:20:00Z",
        team: ticketId === "T-001" ? "Frontend Team" : "Backend Team",
        labels: ticketId === "T-001" ? ["bug", "mobile", "ui"] : ["bug", "database", "urgent"],
      }
      setTicket(mockTicket)
      setLoading(false)
    }, 1000)
  }, [ticketId])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/tickets">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tickets
            </Button>
          </Link>
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/tickets">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tickets
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Ticket not found</h3>
              <p className="text-muted-foreground">The ticket you&apos;re looking for doesn&apos;t exist.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start flex-col gap-6  ">
        <div className="flex items-center gap-4">
          <Link href="/tickets">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tickets
            </Button>
          </Link>
        </div>
          <div>
            <h1 className="text-3xl font-bold">{ticket.id}</h1>
            <p className="text-muted-foreground">{ticket.title}</p>
          </div>
      </div>
      {/* Ticket Details */}
      <TicketChatView ticketId={ticketId} />
    </div>
  )
}

function TicketChatView({ ticketId }: TicketChatViewProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: "m1",
      sender: {
        id: "u1",
        name: "Sami",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "leader",
      },
      content:
        "Hey Ali, can you implement the dark mode toggle? It should be in the header and persist user preference.",
      type: "text",
      timestamp: "2025-01-20T10:00:00",
      reactions: [{ emoji: "👍", users: ["u2"], count: 1 }],
      edited: false,
    },
    {
      id: "m2",
      sender: {
        id: "u2",
        name: "Ali",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "member",
      },
      content: "I'll start working on it. Should I use localStorage for persistence?",
      type: "text",
      timestamp: "2025-01-20T10:15:00",
      reactions: [],
      edited: false,
    },
    {
      id: "m3",
      sender: {
        id: "u1",
        name: "Sami",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "leader",
      },
      content:
        "Yes, localStorage is perfect. Also check this design reference: https://dribbble.com/shots/dark-mode-toggle",
      type: "text",
      timestamp: "2025-01-20T10:20:00",
      hasUrl: true,
      reactions: [{ emoji: "🔥", users: ["u2"], count: 1 }],
      edited: false,
    },
    {
      id: "m4",
      sender: {
        id: "u2",
        name: "Ali",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "member",
      },
      content: "I've implemented the basic functionality. Here's a screenshot of the current progress:",
      type: "text",
      timestamp: "2025-01-22T14:30:00",
      reactions: [],
      edited: false,
    },
    {
      id: "m5",
      sender: {
        id: "u2",
        name: "Ali",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "member",
      },
      content: "/placeholder.svg?height=300&width=500&text=Dark+Mode+Toggle+Screenshot",
      type: "image",
      timestamp: "2025-01-22T14:31:00",
      reactions: [
        { emoji: "👏", users: ["u1"], count: 1 },
        { emoji: "🚀", users: ["u1", "u3"], count: 2 },
      ],
      edited: false,
    },
    {
      id: "m6",
      sender: {
        id: "u2",
        name: "Ali",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "member",
      },
      content: "The toggle is working and the theme persists across page reloads. Ready for review!",
      type: "text",
      timestamp: "2025-01-22T14:35:00",
      reactions: [],
      edited: false,
    },
  ])

  const [editingMessage, setEditingMessage] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null)
  const [ticketStatus, setTicketStatus] = useState("in_progress")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Mock ticket data
  const ticket = {
    id: ticketId,
    title: "Implement dark mode toggle",
    description: "Add a dark mode toggle to the application header with proper theme switching functionality",
    type: "task",
    status: ticketStatus,
    workspace: "Frontend Team",
    workspaceType: "team",
    assignee: {
      id: "u2",
      name: "Ali",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdBy: {
      id: "u1",
      name: "Sami",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    dueDate: "2025-01-25",
    createdAt: "2025-01-20",
  }

  const emojis = ["👍", "👎", "❤️", "😂", "😮", "😢", "😡", "🔥", "👏", "🚀"]

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: `m${messages.length + 1}`,
        sender: {
          id: "u1",
          name: "Sami",
          avatar: "/placeholder.svg?height=32&width=32",
          role: "leader",
        },
        content: message,
        type: "text" as const,
        timestamp: new Date().toISOString(),
        reactions: [],
        edited: false,
      }
      setMessages([...messages, newMessage])
      setMessage("")

      toast({
        title: "Message sent",
        description: "Your message has been posted to the ticket.",
      })
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Mock file upload
      const newMessage = {
        id: `m${messages.length + 1}`,
        sender: {
          id: "u1",
          name: "Sami",
          avatar: "/placeholder.svg?height=32&width=32",
          role: "leader",
        },
        content: file.type.startsWith("image/")
          ? `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(file.name)}`
          : `📎 ${file.name}`,
        type: file.type.startsWith("image/") ? ("image" as const) : ("file" as const),
        timestamp: new Date().toISOString(),
        reactions: [],
        edited: false,
      }
      setMessages([...messages, newMessage])

      toast({
        title: "File uploaded",
        description: `${file.name} has been shared in the ticket.`,
      })
    }
  }

  const handleVerifyTicket = () => {
    setTicketStatus("verified")
    const newMessage = {
      id: `m${messages.length + 1}`,
      sender: {
        id: "u1",
        name: "Sami",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "leader",
      },
      content: "✅ Ticket has been verified and marked as complete!",
      type: "system" as const,
      timestamp: new Date().toISOString(),
      reactions: [],
      edited: false,
    }
    setMessages([...messages, newMessage])

    toast({
      title: "Ticket verified!",
      description: "The ticket has been marked as complete and verified.",
    })
  }

  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages(
      messages.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find((r) => r.emoji === emoji)
          if (existingReaction) {
            if (existingReaction.users.includes("u1")) {
              // Remove reaction
              return {
                ...msg,
                reactions: msg.reactions
                  .map((r) =>
                    r.emoji === emoji ? { ...r, users: r.users.filter((u) => u !== "u1"), count: r.count - 1 } : r,
                  )
                  .filter((r) => r.count > 0),
              }
            } else {
              // Add reaction
              return {
                ...msg,
                reactions: msg.reactions.map((r) =>
                  r.emoji === emoji ? { ...r, users: [...r.users, "u1"], count: r.count + 1 } : r,
                ),
              }
            }
          } else {
            // New reaction
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, users: ["u1"], count: 1 }],
            }
          }
        }
        return msg
      }),
    )
    setShowEmojiPicker(null)
  }

  const handleEditMessage = (messageId: string) => {
    const message = messages.find((m) => m.id === messageId)
    if (message) {
      setEditingMessage(messageId)
      setEditContent(message.content)
    }
  }

  const handleSaveEdit = (messageId: string) => {
    setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, content: editContent, edited: true } : msg)))
    setEditingMessage(null)
    setEditContent("")

    toast({
      title: "Message updated",
      description: "Your message has been edited successfully.",
    })
  }

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((msg) => msg.id !== messageId))

    toast({
      title: "Message deleted",
      description: "The message has been removed from the ticket.",
    })
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderMessageContent = (msg: {
    type: string;
    content: string;
    hasUrl?: boolean;
  }) => {
    if (msg.type === "image") {
      return (
        <div className="mt-2">
          <img
            src={msg.content || "/placeholder.svg"}
            alt="Shared image"
            className="max-w-sm rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => window.open(msg.content, "_blank")}
          />
        </div>
      )
    }

    if (msg.type === "file") {
      return (
        <div className="mt-2 p-3 border rounded-lg bg-accent/50 max-w-sm">
          <div className="flex items-center gap-2">
            <Paperclip className="h-4 w-4" />
            <span className="text-sm">{msg.content}</span>
          </div>
        </div>
      )
    }

    if (msg.type === "system") {
      return (
        <div className="text-center py-2">
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            {msg.content}
          </Badge>
        </div>
      )
    }

    if (msg.hasUrl) {
      const urlRegex = /(https?:\/\/[^\s]+)/g
      const parts = msg.content.split(urlRegex)
      return (
        <div>
          {parts.map((part: string, index: number) => {
            if (part.match(urlRegex)) {
              return (
                <a
                  key={index}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  {part}
                </a>
              )
            }
            return <span key={index}>{part}</span>
          })}
        </div>
      )
    }

    return <div>{msg.content}</div>
  }

  return (
    <div className="space-y-6">
      {/* Ticket Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CardTitle>{ticket.title}</CardTitle>
                <Badge variant="outline">{ticket.type}</Badge>
                <Badge
                  variant={
                    ticket.status === "verified"
                      ? "default"
                      : ticket.status === "in_progress"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {ticket.status.replace("_", " ")}
                </Badge>
              </div>
              <CardDescription>{ticket.description}</CardDescription>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  {ticket.workspaceType === "team" ? <Users className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                  {ticket.workspace}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Due {ticket.dueDate}
                </span>
                <span>Created {ticket.createdAt}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {ticket.status !== "verified" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVerifyTicket}
                  className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify Complete
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit ticket</DropdownMenuItem>
                  <DropdownMenuItem>Change assignee</DropdownMenuItem>
                  <DropdownMenuItem>Set due date</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete ticket</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Chat Messages */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Discussion</CardTitle>
          <CardDescription>Chat-like conversation for this ticket</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.sender.avatar || "/placeholder.svg"} alt={msg.sender.name} />
                    <AvatarFallback>{msg.sender.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{msg.sender.name}</span>
                      <Badge variant={msg.sender.role === "leader" ? "default" : "secondary"} className="text-xs">
                        {msg.sender.role}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatTimestamp(msg.timestamp)}</span>
                      {msg.edited && <span className="text-xs text-muted-foreground">(edited)</span>}
                    </div>

                    {editingMessage === msg.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[60px]"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSaveEdit(msg.id)}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingMessage(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm bg-accent/50 rounded-lg p-3 relative group">
                          {renderMessageContent(msg)}

                          {msg.sender.id === "u1" && msg.type !== "system" && (
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <MoreVertical className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>

                              </DropdownMenu>
                            </div>
                          )}
                        </div>

                        {/* Reactions */}
                        <div className="flex items-center gap-1 flex-wrap">
                          {msg.reactions.map((reaction) => (
                            <Button
                              key={reaction.emoji}
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs bg-transparent"
                              onClick={() => handleAddReaction(msg.id, reaction.emoji)}
                            >
                              {reaction.emoji} {reaction.count}
                            </Button>
                          ))}

                          {msg.type !== "system" && (
                            <Popover
                              open={showEmojiPicker === msg.id}
                              onOpenChange={(open) => setShowEmojiPicker(open ? msg.id : null)}
                            >
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Smile className="h-3 w-3" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-2">
                                <div className="grid grid-cols-5 gap-1">
                                  {emojis.map((emoji) => (
                                    <Button
                                      key={emoji}
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => handleAddReaction(msg.id, emoji)}
                                    >
                                      {emoji}
                                    </Button>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="mt-4 space-y-2">
            <Textarea
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <LinkIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={handleSendMessage} className="bg-red-800 text-white hover:bg-red-700">
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
