// src/lib/client-api.ts
// Client-safe API functions for data mutations (Create, Update, Delete operations)

// Tickets
export const createTicket = async (ticketData: any) => {
  const response = await fetch('/api/tickets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ticketData),
  });

  if (!response.ok) {
    throw new Error('Failed to create ticket');
  }

  return response.json();
};

export const updateTicket = async (ticketId: string, ticketData: any) => {
  const response = await fetch(`/api/tickets/${ticketId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ticketData),
  });

  if (!response.ok) {
    throw new Error('Failed to update ticket');
  }

  return response.json();
};

export const deleteTicket = async (ticketId: string) => {
  const response = await fetch(`/api/tickets/${ticketId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete ticket');
  }

  return response.json();
};

// Teams
export const createTeam = async (teamData: any) => {
  const response = await fetch('/api/teams', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(teamData),
  });

  if (!response.ok) {
    throw new Error('Failed to create team');
  }

  return response.json();
};

export const updateTeam = async (teamId: string, teamData: any) => {
  const response = await fetch(`/api/teams/${teamId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(teamData),
  });

  if (!response.ok) {
    throw new Error('Failed to update team');
  }

  return response.json();
};

export const deleteTeam = async (teamId: string) => {
  const response = await fetch(`/api/teams/${teamId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete team');
  }

  return response.json();
};

export const addTeamMember = async (teamId: string, userId: string, role?: string) => {
  const response = await fetch(`/api/teams/${teamId}/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, role }),
  });

  if (!response.ok) {
    throw new Error('Failed to add team member');
  }

  return response.json();
};

export const removeTeamMember = async (teamId: string, userId: string) => {
  const response = await fetch(`/api/teams/${teamId}/members/${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to remove team member');
  }

  return response.json();
};

// Departments
export const createDepartment = async (departmentData: any) => {
  const response = await fetch('/api/departments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(departmentData),
  });

  if (!response.ok) {
    throw new Error('Failed to create department');
  }

  return response.json();
};

export const updateDepartment = async (departmentId: string, departmentData: any) => {
  const response = await fetch(`/api/departments/${departmentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(departmentData),
  });

  if (!response.ok) {
    throw new Error('Failed to update department');
  }

  return response.json();
};

export const deleteDepartment = async (departmentId: string) => {
  const response = await fetch(`/api/departments/${departmentId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete department');
  }

  return response.json();
};

export const addDepartmentMember = async (departmentId: string, userId: string, role?: string) => {
  const response = await fetch(`/api/departments/${departmentId}/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, role }),
  });

  if (!response.ok) {
    throw new Error('Failed to add department member');
  }

  return response.json();
};

export const removeDepartmentMember = async (departmentId: string, userId: string) => {
  const response = await fetch(`/api/departments/${departmentId}/members/${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to remove department member');
  }

  return response.json();
};

// Users
export const updateUser = async (userId: string, userData: any) => {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to update user');
  }

  return response.json();
};

export const deleteUser = async (userId: string) => {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }

  return response.json();
};

// Profile
export const updateProfile = async (profileData: any) => {
  const response = await fetch('/api/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }

  return response.json();
};

// Settings
export const updateSettings = async (settingsData: any) => {
  const response = await fetch('/api/settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settingsData),
  });

  if (!response.ok) {
    throw new Error('Failed to update settings');
  }

  return response.json();
};

// Events
export const createEvent = async (eventData: any) => {
  const response = await fetch('/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Error('Failed to create event');
  }

  return response.json();
};

export const updateEvent = async (eventId: string, eventData: any) => {
  const response = await fetch(`/api/events/${eventId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Error('Failed to update event');
  }

  return response.json();
};

export const deleteEvent = async (eventId: string) => {
  const response = await fetch(`/api/events/${eventId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete event');
  }

  return response.json();
};

// Admin-specific functions
export const createEventAdmin = async (eventData: any) => {
  return createEvent(eventData);
};

export const updateEventAdmin = async (eventId: string, eventData: any) => {
  return updateEvent(eventId, eventData);
};

export const addMemberToEntity = async (entityType: string, entityId: string, userId: string, role?: string) => {
  if (entityType === 'team') {
    return addTeamMember(entityId, userId, role);
  } else if (entityType === 'department') {
    return addDepartmentMember(entityId, userId, role);
  }
  throw new Error('Invalid entity type');
};

export const removeMemberFromEntity = async (entityType: string, entityId: string, userId: string) => {
  if (entityType === 'team') {
    return removeTeamMember(entityId, userId);
  } else if (entityType === 'department') {
    return removeDepartmentMember(entityId, userId);
  }
  throw new Error('Invalid entity type');
};

export const updateMemberRoleInEntity = async (entityType: string, entityId: string, userId: string, role: string) => {
  // This would need to be implemented as a dedicated API endpoint
  const response = await fetch(`/api/${entityType}s/${entityId}/members/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update ${entityType} member role`);
  }

  return response.json();
};