import { useState, useEffect, useRef } from "react"
import { uploadFile } from "@/services/fileService"
import { getTickets } from "@/services/ticketService"
import { getMessages, createMessage } from "@/services/messageService"
import { useToast } from "@/hooks/use-toast"


type Reaction = {
  emoji: string
  users: string[]
  count: number
}

export function useTicket(ticketId: string) {
    
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
  
    // FileUpload component state
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const uploadInputRef = useRef<HTMLInputElement>(null)
  
    useEffect(() => {
      async function fetchTicketAndMessages() {
        setLoading(true)
        const foundTicket = await getTickets().then(tickets => tickets.find((t: any) => t.id === ticketId));
        setTicket(foundTicket)
        setTicketStatus(foundTicket?.status || "")
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
        const newMessage = await createMessage({
          ticketId,
          senderId: ticket?.assigneeId || ticket?.createdById,
          content: message,
          type: "text",
        })
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
                return {
                  ...msg,
                  reactions: msg.reactions
                    .map((r: Reaction) =>
                      r.emoji === emoji ? { ...r, users: r.users.filter((u: any) => u !== "u1"), count: r.count - 1 } : r,
                    )
                    .filter((r: Reaction) => r.count > 0),
                }
              } else {
                return {
                  ...msg,
                  reactions: msg.reactions.map((r: Reaction) =>
                    r.emoji === emoji ? { ...r, users: [...r.users, "u1"], count: r.count + 1 } : r,
                  ),
                }
              }
            } else {
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
  
    // FileUpload logic
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      setUploading(true)
      setError(null)
      setSuccess(null)
      const formData = new FormData()
      formData.append("file", file)
      formData.append("uploadedById", ticket?.assigneeId || ticket?.createdById || "")
      formData.append("ticketId", ticketId)
      try {
        const data = await uploadFile(formData)
        setSuccess("File uploaded successfully")
      } catch (err: any) {
        setError("Upload failed: " + err.message)
      } finally {
        setUploading(false)
      }
    }
  

  return {
    ticket,
    ticketStatus,
    loading,
    message,
    setMessage,
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
    setMessages,
    toast,
    handleFileChange,
  }
}
