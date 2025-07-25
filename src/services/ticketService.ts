export async function getTickets() {
  const res = await fetch("/api/tickets");
  return res.json();
}

export async function createTicket(data: any) {
  return fetch("/api/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateTicket(ticketId: string, data: any) {
  return fetch(`/api/tickets?id=${ticketId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteTicket(ticketId: string) {
  return fetch(`/api/tickets?id=${ticketId}`, {
    method: "DELETE",
  });
}
