/**
 * @file utils.ts
 * @description Contains helper functions for API requests and data transformation.
 */

// Helper for API calls
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

// Helper to transform API responses
export const transformApiResponse = (item: any, type: 'user' | 'team' | 'department' | 'event') => {
  switch (type) {
    case 'user':
      return { ...item, joinedDate: item.createdAt, avatar: item.avatar || `https://i.pravatar.cc/150?u=${item.id}` };
    case 'team':
      return { ...item, createdDate: item.createdAt, status: 'active', leader: item.leader };
    case 'department':
      return { ...item, createdDate: item.createdAt, status: 'active', manager: item.manager };
    case 'event':
      return {
        ...item,
        date: new Date(item.date).toISOString().split('T')[0],
        type: item.type.toLowerCase(),
        attendees: item.attendees?.map((a: any) => a.name) || [],
        color: item.color || '#3b82f6',
      };
    default:
      return item;
  }
};