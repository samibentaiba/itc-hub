import React, { useEffect, useState } from "react";
import { getFile } from "@/services/fileService";

interface FilePreviewProps {
  fileId: string;
}

export function FilePreview({ fileId }: FilePreviewProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [mimetype, setMimetype] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let url: string | null = null;
    async function fetchFile() {
      setError(null);
      setFileUrl(null);
      setMimetype(null);
      setFilename(null);
      try {
        const { blob, headers } = await getFile(fileId);
        url = URL.createObjectURL(blob);
        setFileUrl(url);
        setMimetype(blob.type);
        const disposition = headers.get("Content-Disposition");
        if (disposition) {
          const match = disposition.match(/filename="(.+)"/);
          if (match) setFilename(match[1]);
        }
      } catch (e) {
        setError("Could not load file");
      }
    }
    fetchFile();
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [fileId]);

  if (error) return <span className="text-red-600">{error}</span>;
  if (!fileUrl) return <span>Loading...</span>;
  if (mimetype && mimetype.startsWith("image/")) {
    return <img src={fileUrl} alt={filename || "file"} className="max-w-xs max-h-64" />;
  }
  return (
    <a href={fileUrl} download={filename || undefined} className="text-blue-600 underline">
      Download {filename || "file"}
    </a>
  );
} 