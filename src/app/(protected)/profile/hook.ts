import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  description: string;
  realName: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  joinedDate: string;
  lastActive: string;
  currentWork: WorkItem[];
  achievements: Achievement[];
  teams: Team[];
  departments: Department[];
  skills: Skill[];
  stats: Stats;
}

interface WorkItem {
  id: string;
  title: string;
  description: string;
  progress: number;
  priority: string;
  dueDate: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  date: string;
  type: string;
}

interface Team {
  id: string;
  name: string;
  role: string;
  joinedDate: string;
  members: number;
}

interface Department {
  id: string;
  name: string;
  role: string;
  joinedDate: string;
  teams: number;
}

interface Skill {
  name: string;
  level: number;
}

interface Stats {
  projectsCompleted: number;
  teamsLed: number;
  mentorshipHours: number;
  contributionsThisMonth: number;
}

interface EditForm {
  name: string;
  realName: string;
  description: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function useProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const { toast } = useToast();

  // Mock user data - in real app this would come from API
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "u1",
    name: "Sami Ahmed",
    email: "sami@itc.com",
    role: "admin",
    avatar: "/placeholder.svg?height=120&width=120",
    description:
      "Full-stack developer passionate about creating innovative solutions and leading development teams. Experienced in React, Node.js, and cloud technologies.",
    realName: "Sami Ahmed Mohamed",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "https://sami.dev",
    github: "sami-dev",
    linkedin: "sami-ahmed",
    twitter: "@sami_dev",
    joinedDate: "2024-01-01",
    lastActive: "2024-03-15T10:30:00Z",

    // Work Information
    currentWork: [
      {
        id: "w1",
        title: "ITC Hub Platform Development",
        description:
          "Leading the development of the main platform architecture and user management system",
        progress: 75,
        priority: "high",
        dueDate: "2024-04-15",
      },
      {
        id: "w2",
        title: "Team Onboarding Process",
        description:
          "Creating comprehensive onboarding documentation and training materials",
        progress: 45,
        priority: "medium",
        dueDate: "2024-04-30",
      },
    ],

    // Achievements
    achievements: [
      {
        id: "a1",
        title: "Platform Architect",
        description:
          "Successfully designed and implemented the core platform architecture",
        icon: "🏗️",
        date: "2024-02-15",
        type: "technical",
      },
      {
        id: "a2",
        title: "Team Leader",
        description:
          "Led a team of 8 developers to deliver the project ahead of schedule",
        icon: "👥",
        date: "2024-01-30",
        type: "leadership",
      },
      {
        id: "a3",
        title: "Innovation Award",
        description:
          "Received recognition for implementing cutting-edge solutions",
        icon: "🚀",
        date: "2024-03-01",
        type: "recognition",
      },
      {
        id: "a4",
        title: "Mentor",
        description: "Successfully mentored 5 junior developers",
        icon: "🎓",
        date: "2024-02-20",
        type: "mentorship",
      },
    ],

    // Team and Department memberships (read-only)
    teams: [
      {
        id: "team-1",
        name: "Frontend Team",
        role: "leader",
        joinedDate: "2024-01-01",
        members: 8,
      },
      {
        id: "team-2",
        name: "Architecture Team",
        role: "member",
        joinedDate: "2024-01-15",
        members: 5,
      },
    ],
    departments: [
      {
        id: "dept-1",
        name: "Development",
        role: "super_leader",
        joinedDate: "2024-01-01",
        teams: 4,
      },
    ],

    // Skills and Stats
    skills: [
      { name: "React", level: 95 },
      { name: "Node.js", level: 90 },
      { name: "TypeScript", level: 88 },
      { name: "Python", level: 85 },
      { name: "AWS", level: 80 },
      { name: "Docker", level: 75 },
    ],

    stats: {
      projectsCompleted: 24,
      teamsLed: 3,
      mentorshipHours: 120,
      contributionsThisMonth: 45,
    },
  });

  const [editForm, setEditForm] = useState<EditForm>({
    name: userProfile.name,
    realName: userProfile.realName,
    description: userProfile.description,
    phone: userProfile.phone,
    location: userProfile.location,
    website: userProfile.website,
    github: userProfile.github,
    linkedin: userProfile.linkedin,
    twitter: userProfile.twitter,
  });

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setUserProfile({ ...userProfile, ...editForm });
      setIsEditing(false);

      toast({
        title: "Profile updated successfully!",
        description: "Your profile information has been saved.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation don't match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordDialog(false);

      toast({
        title: "Password changed successfully!",
        description: "Your password has been updated.",
      });
    } catch (error) {
      toast({
        title: "Password change failed",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async () => {
    // Simulate file upload
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Avatar updated!",
        description: "Your profile picture has been updated.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "super_leader":
        return "destructive";
      case "leader":
        return "default";
      default:
        return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-100 border-green-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getAchievementTypeColor = (type: string) => {
    switch (type) {
      case "technical":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "leadership":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "recognition":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "mentorship":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return {
    userProfile,
    editForm,
    setEditForm,
    passwordForm,
    setPasswordForm,
    isEditing,
    setIsEditing,
    isLoading,
    showPasswordDialog,
    setShowPasswordDialog,
    handleSaveProfile,
    handleChangePassword,
    handleAvatarUpload,
    getRoleBadgeVariant,
    getPriorityColor,
    getAchievementTypeColor,
  };
}
