export async function getMessages() {
  const res = await fetch("/api/messages");
  return res.json();
}

export async function createMessage(data: any) {
  const res = await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  return res.json();
}
