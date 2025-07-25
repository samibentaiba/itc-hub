"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  Edit,
  Trash2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { FileUpload } from "./file-upload";
import { FilePreview } from "./file-preview";
import { getTickets } from "@/services/ticketService";
import { getMessages, createMessage } from "@/services/messageService";

interface TicketChatViewProps {
  ticketId: string
}

type Reaction = any;

export function TicketChatView({ ticketId }: TicketChatViewProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [ticket, setTicket] = useState<any>(null)
  const [editingMessage, setEditingMessage] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null)
  const [ticketStatus, setTicketStatus] = useState("")
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchTicketAndMessages() {
      setLoading(true)
      // Fetch ticket
      const foundTicket = await getTickets().then(tickets => tickets.find((t: any) => t.id === ticketId));
      setTicket(foundTicket)
      setTicketStatus(foundTicket?.status || "")
      // Fetch messages
      const allMessages = await getMessages();
      const filtered = allMessages.filter((m: any) => m.ticketId === ticketId)
      setMessages(filtered)
      setLoading(false)
    }
    fetchTicketAndMessages()
  }, [ticketId])

  const emojis = ["👍", "👎", "❤️", "😂", "😮", "😢", "😡", "🔥", "👏", "🚀"]

  const handleSendMessage = async () => {
    if (message.trim()) {
      // POST to API
      const newMessage = await createMessage({
        ticketId,
        senderId: ticket?.assigneeId || ticket?.createdById, // fallback
        content: message,
        type: "text",
      });
      if (newMessage) {
        setMessages([...messages, newMessage])
        setMessage("")
        toast({ title: "Message sent", description: "Your message has been posted to the ticket." })
      }
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
          const existingReaction = msg.reactions.find((r: Reaction) => r.emoji === emoji)
          if (existingReaction) {
            if (existingReaction.users.includes("u1")) {
              // Remove reaction
              return {
                ...msg,
                reactions: msg.reactions
                  .map((r: Reaction) =>
                    r.emoji === emoji ? { ...r, users: r.users.filter((u: any) => u !== "u1"), count: r.count - 1 } : r,
                  )
                  .filter((r: Reaction) => r.count > 0),
              }
            } else {
              // Add reaction
              return {
                ...msg,
                reactions: msg.reactions.map((r: Reaction) =>
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

  const renderMessageContent = (msg: any) => {
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

  if (loading) return <div>Loading ticket and messages...</div>
  if (!ticket) return <div>Ticket not found.</div>

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
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditMessage(msg.id)}>
                                    <Edit className="mr-2 h-3 w-3" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteMessage(msg.id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-3 w-3" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                        </div>

                        {/* Reactions */}
                        <div className="flex items-center gap-1 flex-wrap">
                          {Array.isArray(msg.reactions) && msg.reactions.map((reaction: Reaction) => (
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
                  {msg.files && msg.files.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.files.map((fileId: string) => (
                        <FilePreview key={fileId} fileId={fileId} />
                      ))}
                    </div>
                  )}
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
              <Button onClick={handleSendMessage} className="bg-red-600 hover:bg-red-700">
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-4">
        <FileUpload
          uploadedById={ticket?.assigneeId || ticket?.createdById || ""}
          ticketId={ticketId}
          onUpload={(fileId) => {
            // Optionally, refresh messages or show a toast
          }}
        />
      </div>
    </div>
  )
}
