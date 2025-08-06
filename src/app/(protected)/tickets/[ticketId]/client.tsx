"use client";

import type React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Clock, Users, Building2, MoreVertical, Send, ImageIcon, LinkIcon, Paperclip, Smile, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTicketDetailPage } from "./hook";
import type { Message, Ticket, Reaction } from "./types";

interface TicketDetailClientPageProps {
  initialTicket: Ticket;
  initialMessages: Message[];
}

// This is the Client Component. It receives data from the server
// and handles all user interactions.
export default function TicketDetailClientPage({ initialTicket, initialMessages }: TicketDetailClientPageProps) {
  const {
    ticket,
    message,
    setMessage,
    messages,
    editingMessage,
    setEditingMessage,
    editContent,
    setEditContent,
    showEmojiPicker,
    setShowEmojiPicker,
    fileInputRef,
    handleSendMessage,
    handleFileUpload,
    handleVerifyTicket,
    handleAddReaction,
    handleEditMessage,
    handleSaveEdit,
    handleDeleteMessage,
    handleTicketAction,
    formatTimestamp,
  } = useTicketDetailPage(initialTicket, initialMessages); // Pass initial data to the hook

  const emojis = ["👍", "👎", "❤️", "😂", "😮", "😢", "😡", "🔥", "👏", "🚀"];

  if (!ticket) return null; // Should be handled by the server page, but good for safety.

  return (
    <div className="space-y-6">
      <div className="flex items-start flex-col gap-6">
        <Link href="/tickets">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tickets
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{ticket.id}</h1>
          <p className="text-muted-foreground">{ticket.title}</p>
        </div>
      </div>
      
      {/* The rest of the UI components (TicketHeader, ChatMessage, etc.) go here */}
      {/* They are unchanged from your original file, so I'm including one as an example */}
      <TicketHeader
        ticket={ticket}
        onVerify={handleVerifyTicket}
        onAction={handleTicketAction}
      />
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Discussion</CardTitle>
          <CardDescription>Chat-like conversation for this ticket</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  msg={msg}
                  currentUser="u1" // Mock current user
                  isEditing={editingMessage === msg.id}
                  editContent={editContent}
                  setEditContent={setEditContent}
                  onSaveEdit={() => handleSaveEdit(msg.id)}
                  onCancelEdit={() => setEditingMessage(null)}
                  onEdit={() => handleEditMessage(msg.id)}
                  onDelete={() => handleDeleteMessage(msg.id)}
                  onAddReaction={(emoji: string) => handleAddReaction(msg.id, emoji)}
                  showEmojiPicker={showEmojiPicker === msg.id}
                  setShowEmojiPicker={() => setShowEmojiPicker(showEmojiPicker === msg.id ? null : msg.id)}
                  formatTimestamp={formatTimestamp}
                  emojis={emojis}
                />
              ))}
            </div>
          </ScrollArea>
          <MessageInput
            message={message}
            setMessage={setMessage}
            onSendMessage={handleSendMessage}
            fileInputRef={fileInputRef}
            onFileUpload={handleFileUpload}
          />
        </CardContent>
      </Card>
    </div>
  );
}

// --- All other sub-components (TicketHeader, ChatMessage, etc.) would follow ---
// They are identical to the ones in your original page.tsx file.
// --- Prop Interfaces ---
interface TicketHeaderProps {
  ticket: Ticket;
  onVerify: () => void;
  onAction: (action: 'edit' | 'assign' | 'due_date' | 'delete') => void;
}

interface ChatMessageProps {
  msg: Message;
  currentUser: string;
  isEditing: boolean;
  editContent: string;
  setEditContent: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddReaction: (emoji: string) => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: () => void;
  formatTimestamp: (timestamp: string) => string;
  emojis: string[];
}

interface MessageInputProps {
  message: string;
  setMessage: (value: string) => void;
  onSendMessage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TicketHeader = ({ ticket, onVerify, onAction }: TicketHeaderProps) => (
    <Card>
        <CardHeader>
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle>{ticket.title}</CardTitle>
                        <Badge variant="outline">{ticket.type}</Badge>
                        <Badge variant={ticket.status === "verified" ? "default" : ticket.status === "in-progress" ? "secondary" : "destructive"}>
                            {ticket.status.replace("_", " ")}
                        </Badge>
                    </div>
                    <CardDescription>{ticket.description}</CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                            {ticket.workspaceType === "team" ? <Users className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                            {ticket.workspace}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Due {ticket.dueDate}
                        </span>
                        <span>Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {ticket.status !== "verified" && (
                        <Button variant="outline" size="sm" onClick={onVerify} className="bg-green-600 hover:bg-green-700 text-white border-green-600">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Verify Complete
                        </Button>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onAction('edit')}>Edit ticket</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onAction('assign')}>Change assignee</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onAction('due_date')}>Set due date</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onAction('delete')} className="text-destructive">Delete ticket</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </CardHeader>
    </Card>
);

const ChatMessage = ({ msg, currentUser, isEditing, editContent, setEditContent, onSaveEdit, onCancelEdit, onEdit, onDelete, onAddReaction, showEmojiPicker, setShowEmojiPicker, formatTimestamp, emojis }: ChatMessageProps) => (
    <div key={msg.id} className="flex gap-3">
        <Avatar className="h-8 w-8">
            <AvatarImage src={msg.sender.avatar || "/placeholder.svg"} alt={msg.sender.name} />
            <AvatarFallback>{msg.sender.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm">{msg.sender.name}</span>
                <Badge variant={msg.sender.role === "leader" ? "default" : "secondary"} className="text-xs">{msg.sender.role}</Badge>
                <span className="text-xs text-muted-foreground">{formatTimestamp(msg.timestamp)}</span>
                {msg.edited && <span className="text-xs text-muted-foreground">(edited)</span>}
            </div>

            {isEditing ? (
                <div className="space-y-2">
                    <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="min-h-[60px]" />
                    <div className="flex gap-2">
                        <Button size="sm" onClick={onSaveEdit}>Save</Button>
                        <Button size="sm" variant="outline" onClick={onCancelEdit}>Cancel</Button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="text-sm bg-accent/50 rounded-lg p-3 relative group">
                        <MessageContent msg={msg} />
                        {msg.sender.id === currentUser && msg.type !== "system" && (
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-6 w-6"><MoreVertical className="h-3 w-3" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={onEdit}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                                        <DropdownMenuItem onClick={onDelete} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-1 flex-wrap">
                        {msg.reactions.map((reaction: Reaction) => (
                            <Button key={reaction.emoji} variant="outline" size="sm" className="h-6 px-2 text-xs bg-transparent" onClick={() => onAddReaction(reaction.emoji)}>
                                {reaction.emoji} {reaction.count}
                            </Button>
                        ))}
                        {msg.type !== "system" && (
                            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><Smile className="h-3 w-3" /></Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-2">
                                    <div className="grid grid-cols-5 gap-1">
                                        {emojis.map((emoji: string) => (
                                            <Button key={emoji} variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onAddReaction(emoji)}>{emoji}</Button>
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
);

const MessageContent = ({ msg }: { msg: Message }) => {
    if (msg.type === 'image') {
        return <img src={msg.content} alt="Shared content" className="max-w-sm rounded-lg border cursor-pointer hover:opacity-80 transition-opacity" onClick={() => window.open(msg.content, "_blank")} />;
    }
    if (msg.type === 'file') {
        return (
            <div className="mt-2 p-3 border rounded-lg bg-accent/50 max-w-sm flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                <span className="text-sm">{msg.content}</span>
            </div>
        );
    }
    if (msg.type === 'system') {
        return (
            <div className="text-center py-2">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">{msg.content}</Badge>
            </div>
        );
    }
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    if (urlRegex.test(msg.content)) {
        return (
            <div>
                {msg.content.split(urlRegex).map((part, index) =>
                    part.match(urlRegex) ? (
                        <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{part}</a>
                    ) : (
                        <span key={index}>{part}</span>
                    )
                )}
            </div>
        );
    }
    return <div>{msg.content}</div>;
};

const MessageInput = ({ message, setMessage, onSendMessage, fileInputRef, onFileUpload }: MessageInputProps) => (
    <div className="mt-4 space-y-2">
        <Textarea
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[80px]"
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSendMessage(); } }}
        />
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <input type="file" ref={fileInputRef as React.RefObject<HTMLInputElement>} onChange={onFileUpload} className="hidden" accept="image/*,.pdf,.doc,.docx,.txt" />
                <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}><ImageIcon className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><LinkIcon className="h-4 w-4" /></Button>
            </div>
            <Button onClick={onSendMessage} className="bg-red-800 text-white hover:bg-red-700">
                <Send className="mr-2 h-4 w-4" /> Send
            </Button>
        </div>
    </div>
);
