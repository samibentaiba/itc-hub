"use client";

import type React from "react";
import {  Send,
  ImageIcon,
  LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  message: string;
  setMessage: (value: string) => void;
  onSendMessage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MessageInput = ({
  message,
  setMessage,
  onSendMessage,
  fileInputRef,
  onFileUpload,
}: MessageInputProps) => (
  <div className="mt-4 space-y-2">
    <Textarea
      placeholder="Type your message..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      className="min-h-[80px]"
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onSendMessage();
        }
      }}
    />
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef as React.RefObject<HTMLInputElement>}
          onChange={onFileUpload}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>
      <Button
        onClick={onSendMessage}
        className="bg-red-800 text-white hover:bg-red-700"
      >
        <Send className="mr-2 h-4 w-4" /> Send
      </Button>
    </div>
  </div>
);
