export async function getEvents() {
  const res = await fetch("/api/events");
  return res.json();
}

export async function createEvent(data: any) {
  return fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateEvent(eventId: string, data: any) {
  return fetch(`/api/events?id=${eventId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteEvent(eventId: string) {
  return fetch(`/api/events?id=${eventId}`, {
    method: "DELETE",
  });
}
