"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
import { WorkspaceLayout } from "@/components/workspace-layout"

interface TicketPageProps {
  params: {
    ticketId: string
  }
}

type Reaction = any;
import { useTicket } from "./hook";

export default function TicketPage({ params }: TicketPageProps) {
  const {
    ticket,
    ticketStatus,
    handleFileChange,
    loading,
    message,
    setMessage,
    setMessages,
    toast,
    messages,
    editingMessage,
    setEditingMessage,
    editContent,
    setEditContent,
    showEmojiPicker,
    setShowEmojiPicker,
    emojis,
    fileInputRef,
    uploadInputRef,
    uploading,
    error,
    success,
    handleSendMessage,
    handleFileUpload,
    handleVerifyTicket,
    handleAddReaction,
  } = useTicket(params.ticketId)

  if (loading) return <div>Loading ticket and messages...</div>
  if (!ticket) return <div>Ticket not found.</div>

  return (
    <WorkspaceLayout>
      <div className="space-y-6">
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
                        <span className="text-xs text-muted-foreground">
                          {new Date(msg.timestamp).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {msg.edited && <span className="text-xs text-muted-foreground">(edited)</span>}
                      </div>

                      {editingMessage === msg.id ? (
                        <div className="space-y-2">
                          <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => {
                              setMessages(messages.map((m) => (m.id === msg.id ? { ...m, content: editContent, edited: true } : m)))
                              setEditingMessage(null)
                              setEditContent("")
                              toast({ title: "Message updated", description: "Your message has been edited successfully." })
                            }}>Save</Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingMessage(null)}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="text-sm bg-accent/50 rounded-lg p-3 relative group">
                            {/* Inline content rendering */}
                            {msg.type === "image" ? (
                              <img
                                src={msg.content || "/placeholder.svg"}
                                alt="Shared image"
                                className="max-w-sm rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => window.open(msg.content, "_blank")}
                              />
                            ) : msg.type === "file" ? (
                              <div className="mt-2 p-3 border rounded-lg bg-accent/50 max-w-sm">
                                <div className="flex items-center gap-2">
                                  <Paperclip className="h-4 w-4" />
                                  <span className="text-sm">{msg.content}</span>
                                </div>
                              </div>
                            ) : msg.type === "system" ? (
                              <div className="text-center py-2">
                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                                  {msg.content}
                                </Badge>
                              </div>
                            ) : (
                              <div>{msg.content}</div>
                            )}

                            {msg.sender.id === "u1" && msg.type !== "system" && (
                              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                      <MoreVertical className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => {
                                      setEditingMessage(msg.id)
                                      setEditContent(msg.content)
                                    }}>
                                      <Edit className="mr-2 h-3 w-3" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                      setMessages(messages.filter((m) => m.id !== msg.id))
                                      toast({ title: "Message deleted", description: "The message has been removed from the ticket." })
                                    }} className="text-destructive">
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

        {/* File Upload Section */}
        <div className="mt-4">
          <div>
            <input
              type="file"
              ref={uploadInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <Button onClick={() => uploadInputRef.current?.click()} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload File"}
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {success && <p className="text-green-500 mt-2">{success}</p>}
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  )
}