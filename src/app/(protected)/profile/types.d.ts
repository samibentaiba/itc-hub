// Defines the structure for social media links
export interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
  website: string;
}

// Defines the main user profile information
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

// Defines the structure for the quick stats card
export interface ProfileStats {
  projectsCompleted: number;
  teamsLed: number;
  mentorshipHours: number;
  contributions: number;
}

// Defines a single skill with its proficiency level
export interface Skill {
  name: string;
  level: number;
}

// Defines a single project the user is working on
export interface Project {
  id: number;
  name: string;
  role: string;
  progress: number;
  priority: "High" | "Medium" | "Low";
  team: string;
}

// Defines a single achievement or award
export interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
  category: "Innovation" | "Leadership" | "Technical";
}

// Defines a team the user is a member of
export interface TeamMembership {
  id: number;
  name: string;
  role: string;
  members: number;
  isLead: boolean;
}

// A single, comprehensive object to hold all profile data
export interface ProfileData {
  profile: UserProfile;
  stats: ProfileStats;
  skills: Skill[];
  projects: Project[];
  achievements: Achievement[];
  teams: TeamMembership[];
  departments: TeamMembership[]; // Reusing TeamMembership for simplicity
}
