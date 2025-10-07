// /app/(protected)/admin/_hooks/useApiHelper.ts
export async function apiRequest(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "An unknown error occurred" }));
    throw new Error(errorData.error || "Request failed");
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
}
