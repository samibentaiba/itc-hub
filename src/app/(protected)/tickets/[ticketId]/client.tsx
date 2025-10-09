"use client";

import type React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTicketDetailPage } from "./hook";
import type { Message, Ticket } from "./types";

interface TicketDetailClientPageProps {
  initialTicket: Ticket;
  initialMessages: Message[];
  fromPath: string; // The new prop for the throwback link
}
import { ChatMessage } from "./_components/ChatMessage";
import { TicketHeader } from "./_components/TicketHeader";
import { MessageInput } from "./_components/MassageInput";
export default function TicketDetailClientPage({
  initialTicket,
  initialMessages,
  fromPath,
}: TicketDetailClientPageProps) {
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
    formatTimestamp,
    getStatusColor,
    getPriorityColor,
    formatStatus,
  } = useTicketDetailPage(initialTicket, initialMessages);

  const emojis = ["👍", "👎", "❤️", "😂", "😮", "😢", "😡", "🔥", "👏", "🚀"];

  if (!ticket) return null;
  // Helper function to create a user-friendly label from the fromPath
  const getBackLinkText = (path: string) => {
    if (path.startsWith("/dashboard")) return "Back to Dashboard";
    if (path.startsWith("/teams")) return "Back to Team";
    if (path.startsWith("/departments")) return "Back to Department";
    if (path.startsWith("/tickets")) return "Back to Tickets";
    return "Back"; // Fallback
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start flex-col gap-6">
        {/* The back button now uses the dynamic fromPath */}
        <Link href={fromPath}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {getBackLinkText(fromPath)}
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{ticket.id}</h1>
          <p className="text-muted-foreground">{ticket.title}</p>
        </div>
      </div>

      <TicketHeader
        ticket={ticket}
        onVerify={handleVerifyTicket}
        getStatusColor={getStatusColor}
        getPriorityColor={getPriorityColor}
        formatStatus={formatStatus}
      />
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Discussion</CardTitle>
          <CardDescription>
            Chat-like conversation for this ticket
          </CardDescription>
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
                  onAddReaction={(emoji: string) =>
                    handleAddReaction(msg.id, emoji)
                  }
                  showEmojiPicker={showEmojiPicker === msg.id}
                  setShowEmojiPicker={() =>
                    setShowEmojiPicker(
                      showEmojiPicker === msg.id ? null : msg.id
                    )
                  }
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
