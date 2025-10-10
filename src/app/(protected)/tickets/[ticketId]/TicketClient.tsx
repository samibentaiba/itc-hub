'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Ticket, TicketStatus, User, Department, Team, Message, File as PrismaFile } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip } from 'lucide-react';
import { Session } from 'next-auth';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type FullTicket = Ticket & {
  createdBy: User;
  department: (Department & { members: { userId: string }[] }) | null;
  team: (Team & { members: { userId: string }[] }) | null;
  messages: (Message & { sender: User })[];
  files: PrismaFile[];
};

export default function TicketClient({ ticket: initialTicket, user, canEditStatus }: { ticket: FullTicket; user: Session['user']; canEditStatus: boolean }) {
  const router = useRouter();
  const [ticket, setTicket] = useState<FullTicket>(initialTicket);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStatusChange = async (status: TicketStatus) => {
    const response = await fetch(`/api/tickets/${ticket.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (response.ok) {
      const updatedTicket = await response.json();
      setTicket(updatedTicket);
      router.refresh();
    } else {
      // Handle error
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    const response = await fetch(`/api/tickets/${ticket.id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newMessage }),
    });
    if (response.ok) {
      const newMessageFromApi = await response.json();
      setTicket(prevTicket => ({
        ...prevTicket!,
        messages: [...prevTicket!.messages, newMessageFromApi],
      }));
      setNewMessage('');
    } else {
      // Handle error
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`/api/tickets/${ticket.id}/files`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const { file: newFileFromApi } = await response.json();
      setTicket(prevTicket => ({
        ...prevTicket!,
        files: [...prevTicket!.files, newFileFromApi],
      }));
      setFile(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
    } else {
      // Handle error
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold mb-2">{ticket.title}</CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>
                      Created by {ticket.createdBy.name} on{' '}
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                    <Badge variant="outline">{ticket.status}</Badge>
                  </div>
                </div>
                {canEditStatus && (
                  <Select onValueChange={(value) => handleStatusChange(value as TicketStatus)} defaultValue={ticket.status}>
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
                      <AvatarImage src={message.sender.avatar || ''} />
                      <AvatarFallback>{message.sender.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{message.sender.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p>{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Textarea placeholder="Type your message here..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                <div className="flex justify-between items-center mt-2">
                  <div>
                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach File
                    </Button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    {file && <span className="ml-2 text-sm">{file.name}</span>}
                  </div>
                  <Button onClick={handleSendMessage}>Send Message</Button>
                  {file && <Button onClick={handleFileUpload}>Upload File</Button>}
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
                  <p>{ticket.department?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-semibold">Team</p>
                  <p>{ticket.team?.name || 'N/A'}</p>
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
                {ticket.files.map((file) => (
                  <li key={file.id} className="flex items-center justify-between">
                    <a href={`/api/files/${file.id}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {file.filename}
                    </a>
                    <span className="text-sm text-muted-foreground">{file.mimetype}</span>
                  </li>
                ))}
                {ticket.files.length === 0 && (
                  <p className="text-sm text-muted-foreground">No files attached.</p>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}