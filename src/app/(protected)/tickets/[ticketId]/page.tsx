import { WorkspaceLayout } from "@/components/workspace-layout"
import { TicketChatView } from "@/components/ticket-chat-view"

interface TicketPageProps {
  params: {
    ticketId: string
  }
}

export default function TicketPage({ params }: TicketPageProps) {
  return (
    <WorkspaceLayout>
      <TicketChatView ticketId={params.ticketId} />
    </WorkspaceLayout>
  )
}
