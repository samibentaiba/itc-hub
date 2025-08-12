// src/app/(protected)/api.ts
import { mockData } from './mock'; // Imports from the typed mock.ts file
import * as T from './types';

const MOCK_API_DELAY = 500; // ms

const simulateDelay = () => new Promise(res => setTimeout(res, MOCK_API_DELAY));

// Dashboard
export const getDashboardData = async (): Promise<T.DashboardData> => {
  await simulateDelay();
  return mockData.dashboard;
};

// Dashboard - Additional functions for backward compatibility
export const fetchDashboardData = async (): Promise<T.DashboardData> => {
  console.log("Fetching dashboard data...");
  const data = await getDashboardData();
  console.log("Fetched dashboard data:", data);
  return data;
};

export const fetchWorkspaceStats = async () => {
  const dashboardData = await fetchDashboardData();
  
  // Transform dashboard stats to match the expected WorkspaceStats interface
  return {
    teams: { 
      count: 2, // You can derive this from dashboardData or your mock data
      change: "+1 this month", 
      trend: "up" 
    },
    departments: { 
      count: 2, 
      change: "No change", 
      trend: "stable" 
    },
    activeTickets: { 
      count: dashboardData.stats.openTickets + dashboardData.stats.pendingIssues, 
      change: `+${dashboardData.stats.pendingIssues} this week`, 
      trend: "up" 
    },
    completedThisWeek: { 
      count: dashboardData.stats.closedTickets, 
      change: `+${dashboardData.stats.closedTickets} from last week`, 
      trend: "up" 
    }
  };
};

export const fetchTickets = async () => {
  const dashboardData = await fetchDashboardData();
  
  // Transform recent tickets to match the expected Ticket interface
  return dashboardData.recentTickets.map(ticket => ({
    id: ticket.id || '',
    title: ticket.title || '',
    type: 'task', // Default type since it's not in original data
    workspace: ticket.team?.name || ticket.department?.name || 'Unknown',
    workspaceType: ticket.team ? 'team' : 'department',
    status: ticket.status || 'open',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 1 week from now
    messages: Math.floor(Math.random() * 10) + 1, // Random for demo
    priority: ticket.priority || 'medium',
    assignedBy: ticket.assignee?.name || 'System'
  }));
};

// --- Calendar ---
// Gets the aggregated calendar for the current user (personal, team, department)
export const getPersonalCalendarData = async (): Promise<T.CalendarEvent[]> => {
  await simulateDelay();
  const { personalEvents, teamEvents, departmentEvents } = mockData.personalCalendar;
  return [...personalEvents, ...teamEvents, ...departmentEvents];
};

// Gets the global calendar with company-wide events
export const getGlobalCalendarData = async (): Promise<T.CalendarEvent[]> => {
  await simulateDelay();
  return mockData.globalCalendar.events;
};

// Calendar - Additional functions from local calendar API
export const fetchEvents = async (): Promise<T.CalendarLocalEvent[]> => {
  console.log("Fetching calendar events...");
  await simulateDelay();
  console.log("Fetched calendar events.");
  // Transform central calendar events to match local Event interface
  const events = await getPersonalCalendarData();
  return events.map((event, index) => ({
    id: parseInt(event.id),
    title: event.title,
    description: event.description,
    date: event.start.split('T')[0],
    time: event.start.split('T')[1]?.split(':').slice(0, 2).join(':') || '00:00',
    duration: 60, // Default duration
    type: event.type,
    attendees: event.participants?.map(p => p.name || '') || [],
    location: event.location || '',
    color: event.type === 'meeting' ? '#3b82f6' : '#10b981'
  }));
};

export const fetchUpcomingEvents = async (): Promise<T.CalendarUpcomingEvent[]> => {
  console.log("Fetching upcoming events...");
  await simulateDelay();
  console.log("Fetched upcoming events.");
  const events = await getPersonalCalendarData();
  return events.slice(0, 5).map((event, index) => ({
    id: parseInt(event.id),
    title: event.title,
    date: new Date(event.start).toLocaleDateString(),
    type: event.type,
    attendees: event.participants?.length || 0
  }));
};

// Departments
export const getDepartments = async (): Promise<T.DepartmentsPageData> => {
    await simulateDelay();
    return mockData.departments;
}

export const getDepartmentById = async (id: string): Promise<T.DepartmentDetailData | undefined> => {
    await simulateDelay();
    // In a real app, you would find the specific department from the list.
    return mockData.departmentDetail.id === id ? mockData.departmentDetail : undefined;
}

// Departments - Additional functions from local departments API
export const fetchDepartments = async (): Promise<T.DepartmentLocal[]> => {
  await simulateDelay();
  const departments = await getDepartments();
  return departments.map(dept => ({
    id: dept.id || '',
    name: dept.name || '',
    description: dept.description || '',
    head: {
      name: dept.manager?.name || 'Unknown',
      avatar: dept.manager?.avatar || '',
      id: dept.manager?.id || ''
    },
    teamCount: dept.teams?.length || 0,
    memberCount: dept.memberCount || 0,
    status: "active" as const,
    recentActivity: "Recent activity",
    color: "#3b82f6",
    teams: dept.teams?.map(team => ({
      name: team.name || '',
      memberCount: team.memberCount || 0
    })) || []
  }));
};

export const fetchDepartmentStats = async (): Promise<T.DepartmentStatLocal[]> => {
  await simulateDelay();
  return [
    {
      title: "Total Departments",
      value: "8",
      description: "Active departments",
      trend: "+2 this quarter"
    },
    {
      title: "Total Teams",
      value: "24",
      description: "Across all departments",
      trend: "+3 this month"
    },
    {
      title: "Total Members",
      value: "156",
      description: "Active employees",
      trend: "+12 this quarter"
    },
    {
      title: "Open Positions",
      value: "7",
      description: "Currently hiring",
      trend: "+2 this week"
    }
  ];
};

// Teams
export const getTeams = async (): Promise<T.TeamsPageData> => {
    await simulateDelay();
    return mockData.teams;
}

export const getTeamById = async (id: string): Promise<T.TeamDetailData | undefined> => {
    await simulateDelay();
    return mockData.teamDetail.id === id ? mockData.teamDetail : undefined;
}

// Teams - Additional functions from local teams API
export const fetchTeams = async (): Promise<T.TeamLocal[]> => {
  await simulateDelay();
  const teams = await getTeams();
  return teams.map(team => ({
    id: team.id || '',
    name: team.name || '',
    description: team.description || '',
    department: team.department || '',
    memberCount: team.memberCount || 0,
    activeProjects: 3, // Default value
    lead: {
      name: team.leader?.name || 'Unknown',
      avatar: team.leader?.avatar || '',
      id: team.leader?.id || ''
    },
    members: team.members?.map(member => ({
      name: member.name || '',
      avatar: member.avatar || '',
      id: member.id || ''
    })) || [],
    recentActivity: "Recent team activity",
    status: "active" as const
  }));
};

export const fetchTeamStats = async (): Promise<T.TeamStatLocal[]> => {
  await simulateDelay();
  return [
    {
      title: "Total Teams",
      value: "24",
      description: "Active teams",
      trend: "+3 this month"
    },
    {
      title: "Team Members",
      value: "156",
      description: "Across all teams",
      trend: "+12 this quarter"
    },
    {
      title: "Active Projects",
      value: "42",
      description: "In progress",
      trend: "+8 this month"
    },
    {
      title: "Completed Projects",
      value: "89",
      description: "This year",
      trend: "+15 this quarter"
    }
  ];
};

// Tickets
export const getTickets = async (): Promise<T.TicketsPageData> => {
    await simulateDelay();
    return mockData.tickets;
}

export const getTicketById = async (id: string): Promise<T.TicketDetails | undefined> => {
    await simulateDelay();
    return mockData.ticketDetail.id === id ? mockData.ticketDetail : undefined;
}

// Tickets - Additional functions from local tickets API (renamed to avoid conflicts)
export const fetchTicketsLocal = async (): Promise<T.TicketLocal[]> => {
  await simulateDelay();
  const ticketsData = await getTickets();
  return ticketsData.tickets.map(ticket => ({
    id: ticket.id || '',
    title: ticket.title || '',
    description: ticket.description || '',
    status: (ticket.status === 'open' ? 'new' : ticket.status === 'in_progress' ? 'in-progress' : 'resolved') as 'new' | 'in-progress' | 'resolved',
    priority: (ticket.priority || 'medium') as 'low' | 'medium' | 'high' | 'urgent',
    type: 'Task' as 'Task' | 'Bug' | 'Feature',
    from: ticket.department?.name || ticket.team?.name || 'Unknown',
    assignee: {
      name: ticket.assignee?.name || 'Unassigned',
      avatar: ticket.assignee?.avatar || '',
      id: ticket.assignee?.id || ''
    },
    reporter: {
      name: ticket.reporter?.name || 'System',
      avatar: ticket.reporter?.avatar || '',
      id: ticket.reporter?.id || ''
    },
    createdAt: ticket.createdAt || new Date().toISOString(),
    updatedAt: ticket.updatedAt || new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    comments: 0
  }));
};

export const fetchStats = async (): Promise<T.TicketStatLocal[]> => {
  await simulateDelay();
  const ticketsData = await getTickets();
  return [
    {
      title: "Total Tickets",
      value: ticketsData.tickets.length.toString(),
      description: "All time",
      trend: "+12 this month"
    },
    {
      title: "Open Tickets",
      value: ticketsData.stats.open.toString(),
      description: "Need attention",
      trend: "+3 this week"
    },
    {
      title: "In Progress",
      value: ticketsData.stats.inProgress.toString(),
      description: "Being worked on",
      trend: "+5 this week"
    },
    {
      title: "Resolved",
      value: ticketsData.stats.closed.toString(),
      description: "This month",
      trend: "+18 this month"
    }
  ];
};

// Users
export const getUsers = async (): Promise<T.UsersPageData> => {
    await simulateDelay();
    return mockData.users;
}

export const getUserById = async (id: string): Promise<T.UserDetailData | undefined> => {
    await simulateDelay();
    return mockData.userDetail.id === id ? mockData.userDetail : undefined;
}

// Users - Additional functions from local users API
export const fetchUsers = async (): Promise<T.UserLocal[]> => {
  await simulateDelay();
  const users = await getUsers();
  return users.map(user => ({
    id: user.id || '',
    name: user.name || '',
    email: user.email || '',
    avatar: user.avatar || '',
    role: user.role || 'user',
    department: user.department || '',
    status: "Active" as "Active" | "Away" | "Offline",
    lastActive: "Just now",
    projects: Math.floor(Math.random() * 10) + 1
  }));
};

export const fetchUserStats = async (): Promise<T.UserStatLocal[]> => {
  await simulateDelay();
  return [
    {
      title: "Total Users",
      value: "156",
      description: "Active employees",
      trend: "+12 this quarter"
    },
    {
      title: "New Users",
      value: "8",
      description: "This month",
      trend: "+3 this week"
    },
    {
      title: "Active Now",
      value: "89",
      description: "Currently online",
      trend: "+5 from yesterday"
    },
    {
      title: "Teams",
      value: "24",
      description: "Total teams",
      trend: "+2 this month"
    }
  ];
};

// Profile
export const getProfileData = async (): Promise<T.Profile> => {
    await simulateDelay();
    return mockData.profile;
}

// Profile - Additional functions from local profile API
export const fetchProfileData = async (): Promise<T.ProfileDataLocal | null> => {
  try {
    await simulateDelay();
    const profile = await getProfileData();
    
    // Transform central profile to local profile format
    return {
      profile: {
        name: profile.name,
        email: profile.email,
        phone: "555-0123", // Default value
        title: profile.role,
        department: profile.department || '',
        location: "San Francisco, CA", // Default value
        bio: profile.bio,
        avatar: profile.avatar,
        socialLinks: {
          github: profile.socialLinks.github,
          linkedin: profile.socialLinks.linkedin,
          twitter: profile.socialLinks.twitter,
          website: ""
        }
      },
      stats: {
        projectsCompleted: 15,
        teamsLed: 2,
        mentorshipHours: 120,
        contributions: 89
      },
      skills: profile.skills.map((skill, index) => ({
        name: skill,
        level: Math.floor(Math.random() * 5) + 1
      })),
      projects: [
        {
          id: 1,
          name: "Project Alpha",
          role: "Lead Developer",
          progress: 75,
          priority: "High" as const,
          team: "Engineering"
        }
      ],
      achievements: [
        {
          id: 1,
          title: "Innovation Award",
          description: "Outstanding contribution to product development",
          date: "2024-01-15",
          category: "Innovation" as const
        }
      ],
      teams: [
        {
          id: 1,
          name: "Engineering",
          role: "Senior Developer",
          members: 8,
          isLead: false
        }
      ],
      departments: [
        {
          id: 1,
          name: profile.department || "Engineering",
          role: profile.role,
          members: 25,
          isLead: false
        }
      ]
    };
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
    return null;
  }
};

// Settings
export const getSettingsData = async (): Promise<T.SettingsData> => {
    await simulateDelay();
    return mockData.settings;
}

// Settings - Additional functions from local settings API
export const fetchUserSettings = async (): Promise<T.UserSettingsLocal> => {
  await simulateDelay();
  const settings = await getSettingsData();
  return {
    displayName: settings.profile?.name || '',
    email: settings.profile?.email || '',
    notifications: settings.notifications.email
  };
};

// Department Detail Functions
export const fetchDepartment = async (departmentId: string): Promise<T.DepartmentDetailLocal | null> => {
  await simulateDelay();
  const departmentDetail = await getDepartmentById(departmentId);
  
  if (!departmentDetail) {
    return null;
  }

  // Transform to match local department detail structure
  const ticketsWithDates: T.DeptTicketLocal[] = (departmentDetail.tickets || []).map((ticket) => ({
    id: ticket.id || '',
    title: ticket.title || '',
    type: (ticket.status === 'open' ? 'task' : ticket.status === 'in_progress' ? 'meeting' : 'event') as 'meeting' | 'task' | 'event',
    status: (ticket.status === 'open' ? 'in_progress' : ticket.status === 'in_progress' ? 'pending' : 'scheduled') as 'in_progress' | 'pending' | 'scheduled',
    assignee: ticket.assignee?.name || null,
    duration: '2 hours', // Default duration
    messages: Math.floor(Math.random() * 10) + 1,
    lastActivity: 'Recently',
    collaborative: true,
    calendarDate: new Date(),
    collaborators: [ticket.assignee?.name || '', ticket.reporter?.name || ''].filter(Boolean)
  }));

  return {
    id: departmentDetail.id,
    name: departmentDetail.name,
    description: departmentDetail.description,
    head: {
      name: departmentDetail.manager?.name || 'Unknown',
      avatar: departmentDetail.manager?.avatar || '',
      id: departmentDetail.manager?.id || ''
    },
    teamCount: departmentDetail.teams?.length || 0,
    memberCount: departmentDetail.memberCount || 0,
    budget: '$500,000', // Default budget
    status: 'Active',
    createdAt: new Date().toISOString(),
    teams: (departmentDetail.teams || []).map(team => ({
      id: team.id || '',
      name: team.name || '',
      memberCount: team.memberCount || 0,
      leader: team.leader?.name || 'Unknown',
      status: 'active' as 'active' | 'planning' | 'archived'
    })),
    tickets: ticketsWithDates,
    members: (departmentDetail.members || []).map(member => ({
      id: member.id || '',
      name: member.name || '',
      role: (member.role === 'manager' ? 'leader' : 'member') as 'leader' | 'member',
      avatar: member.avatar || ''
    })),
    events: (departmentDetail.events || []).map((event, index) => ({
      id: index + 1,
      title: event.title || '',
      description: event.description || '',
      date: event.start?.split('T')[0] || new Date().toISOString().split('T')[0],
      time: event.start?.split('T')[1]?.split(':').slice(0, 2).join(':') || '09:00',
      duration: 60,
      type: (event.type === 'meeting' ? 'meeting' : 'workshop') as 'meeting' | 'review' | 'planning' | 'workshop',
      attendees: event.participants?.map(p => p.name || '') || [],
      location: event.location || 'Conference Room',
      color: event.type === 'meeting' ? '#3b82f6' : '#10b981'
    }))
  };
};

// Team Detail Functions  
export const fetchTeamByIdDetail = async (teamId: string): Promise<T.TeamDetailLocalFull | null> => {
  await simulateDelay();
  const teamDetail = await getTeamById(teamId);
  
  if (!teamDetail) {
    return null;
  }

  return {
    id: teamDetail.id,
    name: teamDetail.name,
    description: teamDetail.description,
    department: teamDetail.department || 'Unknown',
    memberCount: teamDetail.memberCount || 0,
    activeProjects: 3, // Default value
    lead: {
      name: teamDetail.leader?.name || 'Unknown',
      avatar: teamDetail.leader?.avatar || '',
      id: teamDetail.leader?.id || ''
    },
    status: 'active' as 'active' | 'inactive',
    createdAt: new Date().toISOString(),
    members: (teamDetail.members || []).map(member => ({
      id: member.id || '',
      name: member.name || '',
      role: (member.role === 'manager' ? 'leader' : 'member') as 'leader' | 'member',
      avatar: member.avatar || '',
      status: 'online' as 'online' | 'away' | 'offline',
      email: member.email || '',
      joinedDate: new Date().toISOString()
    })),
    events: (teamDetail.events || []).map((event, index) => ({
      id: index + 1,
      title: event.title || '',
      description: event.description || '',
      date: event.start?.split('T')[0] || new Date().toISOString().split('T')[0],
      time: event.start?.split('T')[1]?.split(':').slice(0, 2).join(':') || '10:00',
      duration: 60,
      type: (event.type === 'meeting' ? 'meeting' : 'planning') as 'meeting' | 'review' | 'planning' | 'workshop',
      attendees: event.participants?.map(p => p.name || '') || [],
      location: event.location || 'Virtual',
      color: event.type === 'meeting' ? 'bg-blue-500' : 'bg-purple-500'
    })),
    upcomingEvents: [
      { id: 1, title: 'Team Standup', date: 'Today, 10:00 AM', type: 'meeting', attendees: 2 }
    ]
  };
};

export const fetchTicketsByTeamId = async (teamId: string): Promise<T.TeamTicketLocal[]> => {
  await simulateDelay();
  const teamDetail = await getTeamById(teamId);
  
  if (!teamDetail || !teamDetail.tickets) {
    return [];
  }

  return teamDetail.tickets.map(ticket => ({
    id: ticket.id || '',
    title: ticket.title || '',
    type: (ticket.status === 'open' ? 'task' : ticket.status === 'in_progress' ? 'meeting' : 'event') as 'task' | 'meeting' | 'event',
    status: (ticket.status === 'open' ? 'in_progress' : ticket.status === 'in_progress' ? 'scheduled' : 'verified') as 'in_progress' | 'scheduled' | 'pending' | 'verified',
    assignee: ticket.assignee?.name || null,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    messages: Math.floor(Math.random() * 10) + 1,
    lastActivity: 'Recently'
  }));
};

// Ticket Detail Functions
export const fetchTicketByIdDetail = async (ticketId: string): Promise<T.TicketDetailLocal | null> => {
  await simulateDelay();
  const ticketDetail = await getTicketById(ticketId);
  
  if (!ticketDetail) {
    return null;
  }

  return {
    id: ticketDetail.id,
    title: ticketDetail.title,
    description: ticketDetail.description,
    status: (ticketDetail.status === 'open' ? 'new' : ticketDetail.status === 'in_progress' ? 'in-progress' : 'resolved') as 'new' | 'in-progress' | 'resolved',
    priority: (ticketDetail.priority || 'medium') as 'low' | 'medium' | 'high' | 'urgent',
    type: 'Task' as 'Task' | 'Bug' | 'Feature',
    from: ticketDetail.department?.name || ticketDetail.team?.name || 'Unknown',
    assignee: {
      name: ticketDetail.assignee?.name || 'Unassigned',
      avatar: ticketDetail.assignee?.avatar || '',
      id: ticketDetail.assignee?.id || ''
    },
    reporter: {
      name: ticketDetail.reporter?.name || 'System',
      avatar: ticketDetail.reporter?.avatar || '',
      id: ticketDetail.reporter?.id || ''
    },
    createdAt: ticketDetail.createdAt || new Date().toISOString(),
    updatedAt: ticketDetail.updatedAt || new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    comments: ticketDetail.comments?.length || 0
  };
};

export const fetchMessagesByTicketId = async (ticketId: string): Promise<T.MessageLocal[]> => {
  await simulateDelay();
  const ticketDetail = await getTicketById(ticketId);
  
  if (!ticketDetail || !ticketDetail.comments) {
    return [];
  }

  return ticketDetail.comments.map((comment, index) => ({
    id: comment.id || index.toString(),
    sender: {
      id: comment.user?.id || '',
      name: comment.user?.name || 'Anonymous',
      avatar: comment.user?.avatar || '',
      role: (comment.user?.role === 'manager' ? 'leader' : 'member') as 'leader' | 'member'
    },
    content: comment.comment || '',
    type: 'text' as 'text' | 'image' | 'file' | 'system',
    timestamp: comment.createdAt || new Date().toISOString(),
    reactions: [],
    edited: false,
    hasUrl: false
  }));
};

// User Detail Functions
export const fetchUserByIdDetail = async (userId: string): Promise<T.UserDetailLocal | null> => {
  await simulateDelay();
  const userDetail = await getUserById(userId);
  
  if (!userDetail) {
    return null;
  }

  return {
    id: userDetail.id,
    name: userDetail.name,
    email: userDetail.email,
    avatar: userDetail.avatar,
    title: userDetail.role,
    department: userDetail.department || 'Unknown',
    location: 'San Francisco, CA', // Default location
    joinDate: new Date().toISOString(),
    bio: userDetail.profile?.bio || '',
    stats: {
      projectsCompleted: 15,
      teamsLed: 2,
      mentorshipHours: 120,
      contributions: 89
    },
    skills: (userDetail.profile?.skills || []).map((skill, index) => ({
      name: skill,
      level: Math.floor(Math.random() * 5) + 1
    })),
    socialLinks: {
      github: userDetail.profile?.socialLinks?.github,
      linkedin: userDetail.profile?.socialLinks?.linkedin || '',
      twitter: userDetail.profile?.socialLinks?.twitter
    },
    currentProjects: [
      {
        id: 1,
        name: 'Project Alpha',
        role: 'Lead Developer',
        progress: 75,
        priority: 'High',
        team: 'Engineering'
      }
    ],
    achievements: [
      {
        id: 1,
        title: 'Innovation Award',
        description: 'Outstanding contribution to product development',
        date: '2024-01-15',
        category: 'Innovation'
      }
    ],
    teams: [
      {
        id: 1,
        name: 'Engineering',
        role: 'Senior Developer',
        members: 8,
        isLead: false
      }
    ],
    departments: [
      {
        id: 1,
        name: userDetail.department || 'Engineering',
        role: userDetail.role,
        isLead: false
      }
    ]
  };
};


