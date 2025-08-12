// ===== IMPROVED types.d.ts =====
// src/app/(protected)/profile/types.d.ts

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  title: string;
  department: string;
  location: string;
  bio: string;
  avatar: string;
  socialLinks: SocialLinks;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface ProfileStats {
  projectsCompleted: number;
  teamsLed: number;
  mentorshipHours: number;
  contributions: number;
}

export interface Skill {
  name: string;
  level: number;
}

export interface Project {
  id: number;
  name: string;
  role: string;
  progress: number;
  priority: "High" | "Medium" | "Low";
  team: string;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
  category: "Innovation" | "Leadership" | "Technical" | "Design";
}

export interface TeamMembership {
  id: number;
  name: string;
  role: string;
  members: number;
  isLead: boolean;
}

// Single comprehensive data object - following the user route pattern
export interface ProfileData {
  profile: UserProfile;
  stats: ProfileStats;
  skills: Skill[];
  projects: Project[];
  achievements: Achievement[];
  teams: TeamMembership[];
  departments: TeamMembership[];
}