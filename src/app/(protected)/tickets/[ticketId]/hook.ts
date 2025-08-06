import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Message, Ticket } from "./types";

// The hook now receives initial data, removing the need for internal fetching.
export const useTicketDetailPage = (initialTicket: Ticket, initialMessages: Message[]) => {
  const { toast } = useToast();
  
  // State is initialized directly from the props passed by the Server Component.
  const [ticket, setTicket] = useState<Ticket | null>(initialTicket);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  // All other state and handlers remain for client-side interactivity.
  const [message, setMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (message.trim() && ticket) {
      const newMessage: Message = {
        id: `m${messages.length + 1}`,
        sender: { id: "u1", name: "Sami", avatar: "/placeholder.svg?height=32&width=32", role: "leader" },
        content: message,
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
          const reactionIndex = msg.reactions.findIndex((r) => r.emoji === emoji);
          const currentUser = "u1"; // Mock current user

          if (reactionIndex > -1) {
            const reaction = msg.reactions[reactionIndex];
            const userIndex = reaction.users.indexOf(currentUser);

            if (userIndex > -1) {
              const updatedUsers = reaction.users.filter((u) => u !== currentUser);
              if (updatedUsers.length === 0) {
                return { ...msg, reactions: msg.reactions.filter((r) => r.emoji !== emoji) };
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
  
  // ... other handler functions like handleFileUpload, handleVerifyTicket, etc. would go here ...
  // (Keeping them the same as your original file for brevity)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && ticket) {
      const newMessage: Message = {
        id: `m${messages.length + 1}`,
        sender: { id: "u1", name: "Sami", avatar: "/placeholder.svg?height=32&width=32", role: "leader" },
        content: file.type.startsWith("image/") ? URL.createObjectURL(file) : `📎 ${file.name}`,
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
      setTicket({ ...ticket, status: "verified" });
      const newMessage: Message = {
        id: `m${messages.length + 1}`,
        sender: { id: "u1", name: "Sami", avatar: "/placeholder.svg?height=32&width=32", role: "leader" },
        content: "✅ Ticket has been verified and marked as complete!",
        type: "system",
        timestamp: new Date().toISOString(),
        reactions: [],
        edited: false,
      };
      setMessages([...messages, newMessage]);
      toast({ title: "Ticket verified!", description: "The ticket is now complete." });
    }
  };
  
  const handleEditMessage = (messageId: string) => {
    const messageToEdit = messages.find((m) => m.id === messageId);
    if (messageToEdit) {
      setEditingMessage(messageId);
      setEditContent(messageToEdit.content);
    }
  };

  const handleSaveEdit = (messageId: string) => {
    setMessages(
      messages.map((msg) => (msg.id === messageId ? { ...msg, content: editContent, edited: true } : msg))
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
  };
};
