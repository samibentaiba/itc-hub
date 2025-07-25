import { JWT } from "next-auth/jwt";

export async function getUsers() {
  const res = await fetch("/api/users");
  return res.json();
}

export async function createUser(data: any) {
  return fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateUser(userId: string, data: any) {
  return fetch(`/api/users?id=${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteUser(userId: string) {
  return fetch(`/api/users?id=${userId}`, {
    method: "DELETE",
  });
}
