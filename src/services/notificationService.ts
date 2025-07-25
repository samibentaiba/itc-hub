export async function getNotifications() {
  const res = await fetch("/api/notifications");
  return res.json();
}
