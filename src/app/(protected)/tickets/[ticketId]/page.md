# Ticket Details Page (`(protected)/tickets/[ticketId]/page.tsx`)

## Purpose
Displays the details and chat for a specific ticket (task/issue).

## UI/UX Intent
- **Chat View:** Shows ticket conversation and updates.
- **Details:** Ticket info, status, assignee, etc.
- **Layout:** Uses `WorkspaceLayout` for consistency.

## Structure
- Receives `ticketId` as a prop.
- Renders `TicketChatView` for the ticket conversation.
- Wrapped in `WorkspaceLayout`.

## Relationships
- Linked from tickets list and notifications.
- Consumes data from ticket services or API routes.

## Related Files
- `@/components/workspace-layout`
- `@/components/ticket-chat-view`
- `/api/tickets/route.ts` (API logic) 