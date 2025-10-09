"use client";

import type React from "react";
import { MoreVertical, Paperclip, Smile, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Message, Reaction } from "../types";

// --- ChatMessage and MessageInput components (unchanged) ---

const MessageContent = ({ msg }: { msg: Message }) => {
  if (msg.type === "image") {
    return (
      <Image
        src={msg.comment}
        alt="Shared content"
        width={200}
        height={200}
        className="max-w-sm rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => window.open(msg.comment, "_blank")}
      />
    );
  }
  if (msg.type === "file") {
    return (
      <div className="mt-2 p-3 border rounded-lg bg-accent/50 max-w-sm flex items-center gap-2">
        <Paperclip className="h-4 w-4" />
        <span className="text-sm">{msg.comment}</span>
      </div>
    );
  }
  if (msg.type === "system") {
    return (
      <div className="text-center py-2">
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 border-green-300"
        >
          {msg.comment}
        </Badge>
      </div>
    );
  }
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  if (msg.comment && urlRegex.test(msg.comment)) {
    return (
      <div>
        {msg.comment.split(urlRegex).map((part: string, index: number) =>
          part.match(urlRegex) ? (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {part}
            </a>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </div>
    );
  }
  return <div>{msg.comment}</div>;
};

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

export const ChatMessage = ({
  msg,
  currentUser,
  isEditing,
  editContent,
  setEditContent,
  onSaveEdit,
  onCancelEdit,
  onEdit,
  onDelete,
  onAddReaction,
  showEmojiPicker,
  setShowEmojiPicker,
  formatTimestamp,
  emojis,
}: ChatMessageProps) => (
  <div key={msg.id} className="flex gap-3">
    <Avatar className="h-8 w-8">
      <AvatarImage
        src={msg.user.avatar || "/placeholder.svg"}
        alt={msg.user.name}
      />
      <AvatarFallback>{msg.user.name.charAt(0)}</AvatarFallback>
    </Avatar>
    <div className="flex-1 space-y-1">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-medium text-sm">{msg.user.name}</span>
        <Badge
          variant={msg.user.role === "leader" ? "default" : "secondary"}
          className="text-xs"
        >
          {msg.user.role}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {formatTimestamp(msg.timestamp)}
        </span>
        {msg.edited && (
          <span className="text-xs text-muted-foreground">(edited)</span>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[60px]"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={onSaveEdit}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={onCancelEdit}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="text-sm bg-accent/50 rounded-lg p-3 relative group">
            <MessageContent msg={msg} />
            {msg.user.id === currentUser && msg.type !== "system" && (
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={onDelete}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {Array.isArray(msg.reactions) &&
              msg.reactions.map((reaction: Reaction) => (
                <Button
                  key={reaction.emoji}
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs bg-transparent"
                  onClick={() => onAddReaction(reaction.emoji)}
                >
                  {reaction.emoji} {reaction.count}
                </Button>
              ))}
            {msg.type !== "system" && (
              <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Smile className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <div className="grid grid-cols-5 gap-1">
                    {emojis.map((emoji: string) => (
                      <Button
                        key={emoji}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onAddReaction(emoji)}
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
);
