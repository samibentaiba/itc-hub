export async function uploadFile(formData: FormData) {
  const res = await fetch("/api/files", {
    method: "POST",
    body: formData,
  });
  return await res.json();
}

export async function getFile(fileId: string) {
  const res = await fetch(`/api/files?id=${fileId}`);
  if (!res.ok) throw new Error("File not found");
  const blob = await res.blob();
  return { blob, headers: res.headers };
}
