import React, { useRef, useState } from "react";
import { uploadFile } from "@/services/fileService";

interface FileUploadProps {
  uploadedById: string;
  ticketId?: string;
  messageId?: string;
  onUpload?: (fileId: string) => void;
}

export function FileUpload({ uploadedById, ticketId, messageId, onUpload }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadedById", uploadedById);
    if (ticketId) formData.append("ticketId", ticketId);
    if (messageId) formData.append("messageId", messageId);
    try {
      const data = await uploadFile(formData);
      if (data.id) {
        setSuccess("Upload successful!");
        if (onUpload) onUpload(data.id);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      setError("Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        disabled={uploading}
        className="block mb-2"
      />
      {uploading && <span>Uploading...</span>}
      {error && <span className="text-red-600">{error}</span>}
      {success && <span className="text-green-600">{success}</span>}
    </div>
  );
} 