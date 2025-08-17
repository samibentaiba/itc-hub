"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { ProfileDataLocal } from "../types";

// The hook now accepts the initial data fetched by the server.
export function useProfilePage(initialData: ProfileDataLocal) {
  const { toast } = useToast();
  
  // State for client-side interactions (e.g., editing mode)
  const [isEditing, setIsEditing] = useState(false);
  // The main profile data is now managed here, initialized by server props.
  const [profileData, setProfileData] = useState<UserProfile>(initialData.profile);
  // Temporary state for form inputs while editing.
  const [tempData, setTempData] = useState<UserProfile>(initialData.profile);

  const handleEdit = () => {
    setTempData(profileData); // Sync temp data with current profile before editing
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfileData(tempData); // On save, update the main profile data
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
    // In a real app, you would also send a PUT/POST request to your API here.
  };

  const handleCancel = () => {
    setIsEditing(false);
    // No need to reset tempData, as it will be re-synced on the next edit.
  };

  // Generic handler for top-level profile fields
  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  // Specific handler for nested social links
  const handleSocialLinkChange = (platform: keyof UserProfile['socialLinks'], value: string) => {
    setTempData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
  };

  // Helper functions can remain on the client
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "innovation": return "bg-purple-500";
      case "leadership": return "bg-blue-500";
      case "technical": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return {
    isEditing,
    profileData,
    tempData,
    stats: initialData.stats,
    skills: initialData.skills,
    projects: initialData.projects,
    achievements: initialData.achievements,
    teams: initialData.teams,
    departments: initialData.departments,
    handleEdit,
    handleSave,
    handleCancel,
    handleInputChange,
    handleSocialLinkChange,
    getPriorityColor,
    getCategoryColor,
  };
}
