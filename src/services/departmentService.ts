export async function getDepartments() {
  const res = await fetch("/api/departments");
  return res.json();
}

export async function createDepartment(data: any) {
  return fetch("/api/departments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateDepartment(deptId: string, data: any) {
  return fetch(`/api/departments?id=${deptId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteDepartment(deptId: string) {
  return fetch(`/api/departments?id=${deptId}`, {
    method: "DELETE",
  });
}
