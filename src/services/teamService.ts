export async function getTeams() {
  const res = await fetch("/api/teams");
  return res.json();
}

export async function createTeam(data: any) {
  return fetch("/api/teams", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateTeam(teamId: string, data: any) {
  return fetch(`/api/teams?id=${teamId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteTeam(teamId: string) {
  return fetch(`/api/teams?id=${teamId}`, {
    method: "DELETE",
  });
}
