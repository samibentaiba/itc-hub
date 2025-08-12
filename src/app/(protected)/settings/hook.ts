"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import type { UserSettingsLocal } from "../types";

// The hook now accepts initial data fetched by the server.
export function useSettingsPage(initialSettings: UserSettingsLocal) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { toast } = useToast();
  
  // The initial state is now set from the props.
  const [settings, setSettings] = useState(initialSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // useEffect is still needed to handle client-side-only logic like theme mounting.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get current theme state, ensuring it runs only after mounting.
  const currentTheme = mounted ? resolvedTheme || theme || "dark" : "dark";
  const isSystem = mounted && theme === "system";

  // This handler remains for client-side form updates.
  const handleSettingsChange = (key: keyof UserSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // The save handler simulates an API call and can still use localStorage for persistence.
  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In a real app, this would be a POST/PUT request to your API.
      // We can still use localStorage for client-side persistence demonstration.
      localStorage.setItem("user-settings", JSON.stringify(settings));
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    settings,
    handleSettingsChange,
    isLoading,
    handleSave,
    theme,
    setTheme,
    currentTheme,
    isSystem,
  };
}
