// src/app/(protected)/mock.ts
import * as T from "./types";

// A root type for the entire mock data structure.
// This is defined in types.ts
interface MockData {
  dashboard: T.DashboardData;
  personalCalendar: T.PersonalCalendarData;
  globalCalendar: T.GlobalCalendarData;
  departments: T.DepartmentsPageData;
  departmentDetail: T.DepartmentDetailData;
  profile: T.Profile;
  settings: T.SettingsData;
  teams: T.TeamsPageData;
  teamDetail: T.TeamDetailData;
  tickets: T.TicketsPageData;
  ticketDetail: T.TicketDetails;
  users: T.UsersPageData;
  userDetail: T.UserDetailData;
}

const users: T.User[] = [
  {
    id: "USER-001",
    name: "Sami Bentaiba",
    email: "sami.bentaiba@example.com",
    avatar: "/avatars/sami.png",
    role: "admin",
    department: "Executive",
    team: "Management",
  },
  {
    id: "USER-002",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    avatar: "/avatars/jane.png",
    role: "manager",
    department: "Engineering",
    team: "Frontend",
  },
  {
    id: "USER-003",
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "/avatars/john.png",
    role: "user",
    department: "Engineering",
    team: "Frontend",
  },
  {
    id: "USER-004",
    name: "Peter Jones",
    email: "peter.jones@example.com",
    avatar: "/avatars/peter.png",
    role: "manager",
    department: "Engineering",
    team: "Backend",
  },
  {
    id: "USER-005",
    name: "Mary Williams",
    email: "mary.williams@example.com",
    avatar: "/avatars/mary.png",
    role: "user",
    department: "Engineering",
    team: "Backend",
  },
  {
    id: "USER-006",
    name: "David Brown",
    email: "david.brown@example.com",
    avatar: "/avatars/david.png",
    role: "manager",
    department: "Support",
    team: "Tier 1 Support",
  },
  {
    id: "USER-007",
    name: "Patricia Garcia",
    email: "patricia.garcia@example.com",
    avatar: "/avatars/patricia.png",
    role: "user",
    department: "Support",
    team: "Tier 1 Support",
  },
  {
    id: "USER-008",
    name: "Michael Miller",
    email: "michael.miller@example.com",
    avatar: "/avatars/michael.png",
    role: "user",
    department: "Support",
    team: "Tier 2 Support",
  },
];

const departments: T.Department[] = [
  {
    id: "DEP-001",
    name: "Engineering",
    manager: users[1],
    memberCount: 4,
    ticketCount: 120,
    teams: [],
    members: [],
    description:
      "Responsible for all software development and product engineering.",
  },
  {
    id: "DEP-002",
    name: "Support",
    manager: users[5],
    memberCount: 3,
    ticketCount: 350,
    teams: [],
    members: [],
    description: "Dedicated to providing world-class customer support.",
  },
  {
    id: "DEP-003",
    name: "Executive",
    manager: users[0],
    memberCount: 1,
    ticketCount: 5,
    teams: [],
    members: [],
    description: "High-level company leadership.",
  },
];

const teams: T.Team[] = [
  {
    id: "TEAM-001",
    name: "Frontend",
    leader: users[1],
    department: "Engineering",
    memberCount: 2,
    members: [users[1], users[2]],
    description: "Develops and maintains the user interface.",
  },
  {
    id: "TEAM-002",
    name: "Backend",
    leader: users[3],
    department: "Engineering",
    memberCount: 2,
    members: [users[3], users[4]],
    description: "Manages the server-side logic and database.",
  },
  {
    id: "TEAM-003",
    name: "Tier 1 Support",
    leader: users[5],
    department: "Support",
    memberCount: 2,
    members: [users[5], users[6]],
    description: "First line of response for customer issues.",
  },
  {
    id: "TEAM-004",
    name: "Tier 2 Support",
    leader: users[5],
    department: "Support",
    memberCount: 1,
    members: [users[7]],
    description: "Handles escalated and technical support cases.",
  },
  {
    id: "TEAM-005",
    name: "Management",
    leader: users[0],
    department: "Executive",
    memberCount: 1,
    members: [users[0]],
    description: "Company leadership.",
  },
];

departments[0].teams = [teams[0], teams[1]];
departments[0].members = [users[1], users[2], users[3], users[4]];
departments[1].teams = [teams[2], teams[3]];
departments[1].members = [users[5], users[6], users[7]];
departments[2].teams = [teams[4]];
departments[2].members = [users[0]];

const tickets: T.Ticket[] = [
  {
    id: "TICKET-001",
    title: "Login button unresponsive on Firefox",
    description:
      "Users on the latest Firefox version are reporting that the main login button does not trigger any action.",
    status: "open",
    priority: "high",
    assignee: users[2],
    reporter: users[6],
    department: departments[0],
    team: teams[0],
    createdAt: "2025-08-11T10:00:00Z",
    updatedAt: "2025-08-11T11:30:00Z",
  },
  {
    id: "TICKET-002",
    title: "API endpoint /api/users returning 500 error",
    description:
      "The user list endpoint is consistently failing with an internal server error. This is blocking user management tasks.",
    status: "in_progress",
    priority: "high",
    assignee: users[4],
    reporter: users[0],
    department: departments[0],
    team: teams[1],
    createdAt: "2025-08-11T09:30:00Z",
    updatedAt: "2025-08-11T14:00:00Z",
  },
  {
    id: "TICKET-003",
    title: "Update password policy documentation",
    description:
      "The internal documentation for password requirements needs to be updated to reflect the new 12-character minimum.",
    status: "closed",
    priority: "low",
    assignee: users[6],
    reporter: users[1],
    department: departments[1],
    team: teams[2],
    createdAt: "2025-08-10T15:00:00Z",
    updatedAt: "2025-08-10T16:00:00Z",
  },
  {
    id: "TICKET-004",
    title: "Customer cannot reset their password",
    description:
      "A customer (user ID: CUST-554) is unable to reset their password via the forgot password link. They are not receiving the email.",
    status: "open",
    priority: "medium",
    assignee: users[7],
    reporter: users[6],
    department: departments[1],
    team: teams[3],
    createdAt: "2025-08-11T18:00:00Z",
    updatedAt: "2025-08-11T18:00:00Z",
  },
];

export const mockData: MockData = {
  dashboard: {
    stats: {
      openTickets: 2,
      closedTickets: 1,
      newUsers: 3,
      pendingIssues: 1,
    },
    recentTickets: [tickets[3], tickets[0], tickets[1]],
    upcomingEvents: [
      {
        id: "EVENT-001",
        title: "Q3 Planning Meeting",
        start: "2025-08-12T14:00:00Z",
        end: "2025-08-12T15:00:00Z",
        allDay: false,
        type: "meeting",
        description: "Quarterly planning session for all managers.",
      },
    ],
    recentActivity: [
      {
        id: "ACT-001",
        user: users[1],
        action: "closed",
        target: "TICKET-003",
        createdAt: "2025-08-10T16:00:00Z",
      },
    ],
  },
  personalCalendar: {
    personalEvents: [
      {
        id: "PE-001",
        title: "Sami's Dentist Appointment",
        start: "2025-08-15T10:00:00Z",
        end: "2025-08-15T11:00:00Z",
        allDay: false,
        type: "personal",
        description: "Annual check-up.",
      },
    ],
    teamEvents: [
      {
        id: "TE-002",
        title: "Backend Team Sprint Planning",
        start: "2025-08-13T10:00:00Z",
        end: "2025-08-13T11:30:00Z",
        allDay: false,
        type: "team-event",
        description: "Planning for the next two-week sprint.",
      },
    ],
    departmentEvents: [
      {
        id: "DE-001",
        title: "Engineering All-Hands",
        start: "2025-08-14T11:00:00Z",
        end: "2025-08-14T12:00:00Z",
        allDay: false,
        type: "department-event",
        description: "Monthly sync for the entire engineering department.",
      },
    ],
  },
  globalCalendar: {
    events: [
      {
        id: "GE-001",
        title: "Company All-Hands",
        start: "2025-08-20T16:00:00Z",
        end: "2025-08-20T17:00:00Z",
        allDay: false,
        type: "global",
        description: "Q3 company-wide all-hands meeting.",
      },
    ],
  },
  departments: departments,
  departmentDetail: {
    ...departments[0],
    teams: [teams[0], teams[1]],
    members: [users[1], users[2], users[3], users[4]],
    tickets: [tickets[0], tickets[1]],
    events: [
      {
        id: "DE-001",
        title: "Engineering All-Hands",
        start: "2025-08-14T11:00:00Z",
        end: "2025-08-14T12:00:00Z",
        allDay: false,
        type: "department-event",
        description: "Monthly sync for the entire engineering department.",
      },
    ],
  },
  profile: {
    ...users[0],
    bio: "Founder and CEO of ITC Hub. Passionate about building tools that empower teams.",
    skills: [
      "Leadership",
      "Product Management",
      "Software Architecture",
      "Public Speaking",
    ],
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/samibentaiba",
      twitter: "https://twitter.com/samibentaiba",
      github: "https://github.com/samibentaiba",
    },
  },
  settings: {
    profile: {
      name: "Sami Bentaiba",
      email: "sami.bentaiba@example.com",
      bio: "Founder and CEO...",
    },
    notifications: {
      email: true,
      push: true,
      ticketUpdates: true,
      mentions: true,
    },
    theme: "dark",
  },
  teams: teams,
  teamDetail: {
    ...teams[0],
    members: [users[1], users[2]],
    tickets: [tickets[0]],
    events: [
      {
        id: "TE-001",
        title: "Frontend Team Sync",
        start: "2025-08-13T09:00:00Z",
        end: "2025-08-13T09:30:00Z",
        allDay: false,
        type: "team-event",
        description: "Weekly team sync for Frontend.",
      },
    ],
  },
  tickets: {
    tickets: tickets,
    stats: { open: 2, inProgress: 1, closed: 1 },
  },
  ticketDetail: {
    ...tickets[0],
    comments: [
      {
        id: "COMMENT-001",
        user: users[6],
        comment:
          "I've replicated this on Firefox v130. It seems to be an issue with a recent update.",
        createdAt: "2025-08-11T10:05:00Z",
      },
      {
        id: "COMMENT-002",
        user: users[2],
        comment:
          "Thanks for the report. I'm looking into it now. It might be related to the new CSS changes.",
        createdAt: "2025-08-11T11:35:00Z",
      },
    ],
    attachments: [],
  },
  users: users,
  userDetail: {
    ...users[2],
    profile: {
      ...users[2],
      bio: "Creative frontend developer with a passion for accessible and intuitive UI/UX.",
      skills: ["React", "TypeScript", "Next.js", "Figma"],
      socialLinks: { linkedin: "", twitter: "", github: "" },
    },
    assignedTickets: [tickets[0]],
    reportedTickets: [],
    activity: [
      {
        id: "ACT-002",
        user: users[2],
        action: "commented on",
        target: "TICKET-001",
        createdAt: "2025-08-11T11:35:00Z",
      },
    ],
  },
};
