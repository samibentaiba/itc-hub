// API utility functions for ITC Hub

const API_BASE = '/api'

// Generic API function
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'API request failed')
  }

  return response.json()
}

// Users API
export const usersApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string; role?: string; departmentId?: string; teamId?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString())
      })
    }
    return apiRequest(`/users?${searchParams.toString()}`)
  },

  getById: (id: string) => apiRequest(`/users/${id}`),

  create: (data: { name: string; email: string; password: string; role?: string; departmentIds?: string[]; teamIds?: string[] }) =>
    apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/users/${id}`, {
      method: 'DELETE',
    }),
}

// Departments API
export const departmentsApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString())
      })
    }
    return apiRequest(`/departments?${searchParams.toString()}`)
  },

  getById: (id: string) => apiRequest(`/departments/${id}`),

  create: (data: { name: string; description?: string; status?: string; memberIds?: string[] }) =>
    apiRequest('/departments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/departments/${id}`, {
      method: 'DELETE',
    }),
}

// Teams API
export const teamsApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string; status?: string; departmentId?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString())
      })
    }
    return apiRequest(`/teams?${searchParams.toString()}`)
  },

  getById: (id: string) => apiRequest(`/teams/${id}`),

  create: (data: { name: string; description?: string; status?: string; departmentId: string; memberIds?: string[] }) =>
    apiRequest('/teams', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/teams/${id}`, {
      method: 'DELETE',
    }),
}

// Tickets API
export const ticketsApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string; status?: string; type?: string; assigneeId?: string; createdById?: string; teamId?: string; departmentId?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString())
      })
    }
    return apiRequest(`/tickets?${searchParams.toString()}`)
  },

  getById: (id: string) => apiRequest(`/tickets/${id}`),

  create: (data: { title: string; description: string; type?: string; status?: string; dueDate?: string; assigneeId?: string; teamId?: string; departmentId?: string }) =>
    apiRequest('/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/tickets/${id}`, {
      method: 'DELETE',
    }),
}

// Messages API
export const messagesApi = {
  getAll: (params: { ticketId: string; page?: number; limit?: number; senderId?: string }) => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, value.toString())
    })
    return apiRequest(`/messages?${searchParams.toString()}`)
  },

  getById: (id: string) => apiRequest(`/messages/${id}`),

  create: (data: { ticketId: string; content: string; type?: string; reactions?: any }) =>
    apiRequest('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/messages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/messages/${id}`, {
      method: 'DELETE',
    }),
}

// Events API
export const eventsApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string; type?: string; organizerId?: string; startDate?: string; endDate?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString())
      })
    }
    return apiRequest(`/events?${searchParams.toString()}`)
  },

  getById: (id: string) => apiRequest(`/events/${id}`),

  create: (data: { title: string; description: string; date: string; time?: string; duration?: string; type?: string; location?: string; attendees?: number; isRecurring?: boolean }) =>
    apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/events/${id}`, {
      method: 'DELETE',
    }),
}

// Notifications API
export const notificationsApi = {
  getAll: (params?: { page?: number; limit?: number; unread?: boolean; type?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString())
      })
    }
    return apiRequest(`/notifications?${searchParams.toString()}`)
  },

  getById: (id: string) => apiRequest(`/notifications/${id}`),

  create: (data: { userId: string; title: string; description: string; type: string }) =>
    apiRequest('/notifications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: { unread: boolean }) =>
    apiRequest(`/notifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/notifications/${id}`, {
      method: 'DELETE',
    }),
}

// Files API
export const filesApi = {
  getAll: (params?: { page?: number; limit?: number; ticketId?: string; messageId?: string; uploadedById?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString())
      })
    }
    return apiRequest(`/files?${searchParams.toString()}`)
  },

  getById: (id: string) => apiRequest(`/files/${id}`),

  upload: (file: File, ticketId?: string, messageId?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    if (ticketId) formData.append('ticketId', ticketId)
    if (messageId) formData.append('messageId', messageId)

    return fetch(`${API_BASE}/files`, {
      method: 'POST',
      body: formData,
    }).then(response => {
      if (!response.ok) {
        return response.json().then(error => {
          throw new Error(error.error || 'Upload failed')
        })
      }
      return response.json()
    })
  },

  delete: (id: string) =>
    apiRequest(`/files/${id}`, {
      method: 'DELETE',
    }),
}

// Profile API
export const profileApi = {
  get: (userId?: string) => {
    const params = userId ? `?userId=${userId}` : ''
    return apiRequest(`/profile${params}`)
  },

  getById: (id: string) => apiRequest(`/profile/${id}`),

  create: (data: { realName: string; bio?: string; profilePic?: string }) =>
    apiRequest('/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/profile/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/profile/${id}`, {
      method: 'DELETE',
    }),
}

// Export all APIs
export const api = {
  users: usersApi,
  departments: departmentsApi,
  teams: teamsApi,
  tickets: ticketsApi,
  messages: messagesApi,
  events: eventsApi,
  notifications: notificationsApi,
  files: filesApi,
  profile: profileApi,
} 