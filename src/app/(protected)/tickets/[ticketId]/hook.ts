import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Message, Ticket, Reaction } from "./types";

export const useTicketDetailPage = (initialTicket: Ticket, initialMessages: Message[]) => {
  const { toast } = useToast();
  
  const [ticket, setTicket] = useState<Ticket | null>(initialTicket);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const [message, setMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (message.trim() && ticket) {
      const newMessage: Message = {
        id: `m${messages.length + 1}`,
        user: { id: "u1", name: "Sami", avatar: "/placeholder.svg?height=32&width=32", role: "leader" },
        comment: message,
        type: "text",
        timestamp: new Date().toISOString(),
        reactions: [],
        edited: false,
      };
      setMessages([...messages, newMessage]);
      setMessage("");
      toast({ title: "Message sent", description: "Your message has been posted." });
    }
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages(
      messages.map((msg) => {
        if (msg.id === messageId) {
          const reactionIndex = msg.reactions.findIndex((r: Reaction) => r.emoji === emoji);
          const currentUser = "u1"; // Mock current user

          if (reactionIndex > -1) {
            const reaction = msg.reactions[reactionIndex];
            const userIndex = reaction.users.indexOf(currentUser);

            if (userIndex > -1) {
              const updatedUsers = reaction.users.filter((u) => u !== currentUser);
              if (updatedUsers.length === 0) {
                return { ...msg, reactions: msg.reactions.filter((r: Reaction) => r.emoji !== emoji) };
              } else {
                const updatedReactions = [...msg.reactions];
                updatedReactions[reactionIndex] = { ...reaction, users: updatedUsers, count: updatedUsers.length };
                return { ...msg, reactions: updatedReactions };
              }
            } else {
              const updatedReactions = [...msg.reactions];
              updatedReactions[reactionIndex] = { ...reaction, users: [...reaction.users, currentUser], count: reaction.count + 1 };
              return { ...msg, reactions: updatedReactions };
            }
          } else {
            return { ...msg, reactions: [...msg.reactions, { emoji, users: [currentUser], count: 1 }] };
          }
        }
        return msg;
      })
    );
    setShowEmojiPicker(null);
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && ticket) {
      const newMessage: Message = {
        id: `m${messages.length + 1}`,
        user: { id: "u1", name: "Sami", avatar: "/placeholder.svg?height=32&width=32", role: "leader" },
        comment: file.type.startsWith("image/") ? URL.createObjectURL(file) : `📎 ${file.name}`,
        type: file.type.startsWith("image/") ? "image" : "file",
        timestamp: new Date().toISOString(),
        reactions: [],
        edited: false,
      };
      setMessages([...messages, newMessage]);
      toast({ title: "File uploaded", description: `${file.name} has been shared.` });
    }
  };

  const handleVerifyTicket = () => {
    if (ticket) {
      setTicket({ ...ticket, status: "resolved" });
      const newMessage: Message = {
        id: `m${messages.length + 1}`,
        user: { id: "u1", name: "Sami", avatar: "/placeholder.svg?height=32&width=32", role: "leader" },
        comment: "✅ Ticket has been marked as resolved!",
        type: "system",
        timestamp: new Date().toISOString(),
        reactions: [],
        edited: false,
      };
      setMessages([...messages, newMessage]);
      toast({ title: "Ticket Resolved!", description: "The ticket is now complete." });
    }
  };
  
  const handleEditMessage = (messageId: string) => {
    const messageToEdit = messages.find((m) => m.id === messageId);
    if (messageToEdit) {
      setEditingMessage(messageId);
      setEditContent(messageToEdit.comment);
    }
  };

  const handleSaveEdit = (messageId: string) => {
    setMessages(
      messages.map((msg) => (msg.id === messageId ? { ...msg, comment: editContent, edited: true } : msg))
    );
    setEditingMessage(null);
    setEditContent("");
    toast({ title: "Message updated", description: "Your message has been edited." });
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((msg) => msg.id !== messageId));
    toast({ title: "Message deleted", description: "The message has been removed." });
  };

  const handleTicketAction = (action: "edit" | "assign" | "due_date" | "delete") => {
    toast({
      title: "Action Required",
      description: `This functionality (${action}) is not yet implemented.`,
    });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  // ADDED: Helper functions from the /tickets/ hook to maintain consistency
  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case "new": return "destructive";
      case "in_progress": return "default";
      case "resolved": return "secondary";
      default: return "outline";
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case "urgent":
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return {
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
    // EXPOSED: Make helper functions available to the client component
    getStatusColor,
    getPriorityColor,
    formatStatus,
  };
};
