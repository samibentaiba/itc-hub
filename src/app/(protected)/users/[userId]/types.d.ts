
/*
================================================================================
|                                 types.d.ts                                   |
================================================================================
| Description:                                                                 |
| This file defines the TypeScript types for the user profile page. Having     |
| strong types ensures data consistency between the server-side fetching and   |
| the client-side rendering, preventing common bugs.                           |
================================================================================
*/
// Defines the structure for a user's skill.
export type UserSkill = {
  name: string;
  level: number;
};

// Defines the structure for a project a user is involved in.
export type UserProject = {
  id: number;
  name: string;
  role: string;
  progress: number;
  priority: string;
  team: string;
};

// Defines the structure for a user's achievement.
// The `icon` property is removed as it's not serializable.
export type UserAchievement = {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
};

// Defines the structure for a team a user is a member of.
export type UserTeam = {
  id: number;
  name: string;
  role: string;
  members: number;
  isLead: boolean;
};

// Defines the structure for a department a user belongs to.
export type UserDepartment = {
  id: number;
  name: string;
  role: string;
  isLead: boolean;
};

// Defines the structure for a user's quick statistics.
export type UserStats = {
  projectsCompleted: number;
  teamsLed: number;
  mentorshipHours: number;
  contributions: number;
};

// Defines the structure for a user's social media links.
export type UserSocialLinks = {
  github?: string;
  linkedin: string;
  twitter?: string;
};

// Defines the main structure for the complete User object.
export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string;
  department: string;
  location: string;
  joinDate: string;
  bio: string;
  stats: UserStats;
  skills: UserSkill[];
  socialLinks: UserSocialLinks;
  currentProjects: UserProject[];
  achievements: UserAchievement[];
  teams: UserTeam[];
  departments: UserDepartment[];
};

