import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";

export function useSettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState({
    displayName: "Sami",
    email: "sami@itc.com",
    notifications: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem("user-settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Get current theme state
  const currentTheme = mounted ? resolvedTheme || theme || "dark" : "dark";
  const isSystem = mounted && theme === "system";

  const handleSettingsChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save settings to localStorage or API
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
    theme,
    setTheme,
    currentTheme,
    isSystem,
    settings,
    setSettings,
    isLoading,
    handleSave,
    handleSettingsChange,
  };
}
