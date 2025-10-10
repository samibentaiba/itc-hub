"use client";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Ticket,
  TicketStatus,
  User,
  Department,
  Team,
  Message,
  File as PrismaFile,
} from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, X } from "lucide-react";
import { Session } from "next-auth";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FileWithoutData = {
  id: string;
  filename: string;
  mimetype: string;
  url: string | null;
  uploadedAt: Date;
};

type FullTicket = Ticket & {
  createdBy: User;
  department: (Department & { members: { userId: string }[], managers: {id: string}[] }) | null;
  team: (Team & { members: { userId: string }[], leaders: {id: string}[] }) | null;
  messages: (Message & { sender: User; files: FileWithoutData[] })[];
  files: FileWithoutData[];
};

export default function TicketClient({
  ticket: initialTicket,
  user,
  canEditStatus,
  fromPath
}: {
  ticket: FullTicket;
  user: Session["user"];
  canEditStatus: boolean;
  fromPath: string; // The new prop for the throwback link
}) {
  const router = useRouter();
  const [ticket, setTicket] = useState<FullTicket>(initialTicket);
  const [newMessage, setNewMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStatusChange = async (status: TicketStatus) => {
    const response = await fetch(`/api/tickets/${ticket.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (response.ok) {
      const updatedTicket = await response.json();
      setTicket(updatedTicket);
      // router.refresh(); // Consider removing for smoother UX
    } else {
      // Handle error
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" && files.length === 0) return;

    const formData = new FormData();
    formData.append("content", newMessage);
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch(`/api/tickets/${ticket.id}/messages`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const newMessageFromApi = await response.json();
      setTicket((prevTicket) => {
        const newFiles = newMessageFromApi.files || [];
        return {
          ...prevTicket!,
          messages: [...prevTicket!.messages, newMessageFromApi],
          files: [...prevTicket!.files, ...newFiles],
        };
      });
      setNewMessage("");
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      // Handle error
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (fileName: string) => {
    setFiles(files.filter((file) => file.name !== fileName));
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...Array.from(e.dataTransfer.files),
      ]);
    }
  };

  return (
    <div className="container mx-auto p-4 gap-4 space-y-6">
              <div className="flex items-center gap-4">
                {/* Use the fromPath for the back button's href */}
                <Link href={fromPath}>
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                  </Button>
                </Link>
              </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold mb-2">
                    {ticket.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>
                      Created by {ticket.createdBy.name} on{" "}
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                    <Badge variant="outline">{ticket.status}</Badge>
                  </div>
                </div>
                {canEditStatus && (
                  <Select
                    onValueChange={(value) =>
                      handleStatusChange(value as TicketStatus)
                    }
                    defaultValue={ticket.status}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(TicketStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{ticket.description}</p>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ticket.messages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={message.sender.avatar || ""} />
                      <AvatarFallback>
                        {message.sender.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{message.sender.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {message.content && <p>{message.content}</p>}
                      {message.files && message.files.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.files.map((file: FileWithoutData) => (
                            <div key={file.id}>
                              {file.mimetype.startsWith("image/") ? (
                                <img
                                  src={`/api/files/${file.id}`}
                                  alt={file.filename}
                                  className="max-w-xs rounded-md"
                                />
                              ) : (
                                <a
                                  href={`/api/files/${file.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline"
                                >
                                  {file.filename}
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div
                className={`mt-6 border-2 border-dashed rounded-lg p-4 relative ${
                  isDragging
                    ? "border-primary bg-primary/10"
                    : "border-border/50"
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {isDragging && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-primary font-semibold">
                      Drop files here
                    </div>
                  </div>
                )}
                <Textarea
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <div className="mt-2 space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center justify-between bg-muted p-2 rounded-md text-sm"
                    >
                      <span className="truncate max-w-xs">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeFile(file.name)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach Files
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      multiple
                    />
                  </div>
                  <Button onClick={handleSendMessage}>Send</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="font-semibold">Status</p>
                  <p>{ticket.status}</p>
                </div>
                <div>
                  <p className="font-semibold">Priority</p>
                  <p>{ticket.priority}</p>
                </div>
                <div>
                  <p className="font-semibold">Department</p>
                  <p>{ticket.department?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="font-semibold">Team</p>
                  <p>{ticket.team?.name || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Attached Files</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {ticket.files.map((file: FileWithoutData) => (
                  <li
                    key={file.id}
                    className="flex items-center justify-between"
                  >
                    <a
                      href={`/api/files/${file.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {file.filename}
                    </a>
                    <span className="text-sm text-muted-foreground">
                      {file.mimetype}
                    </span>
                  </li>
                ))}
                {ticket.files.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No files attached.
                  </p>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}