"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Bell, Moon, Sun, Settings, Monitor, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"

interface UserSettings {
  displayName: string
  email: string
  notifications: boolean
  theme: string
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User Settings</CardTitle>
          <CardDescription>Customize your experience across the ITC Hub.</CardDescription>
        </CardHeader>
        <CardContent>
          <UserSettingsForm />
        </CardContent>
      </Card>
    </div>
  )
}

// User Settings Form Component
function UserSettingsForm() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState<UserSettings>({
    displayName: "",
    email: "",
    notifications: true,
    theme: "dark",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const { toast } = useToast()

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load user settings
  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        setIsLoadingData(true)
        // Get current user's profile for settings
        const profile = await api.profile.get()
        setSettings({
          displayName: profile.name || "",
          email: profile.email || "",
          notifications: true, // Default value
          theme: theme || "dark",
        })
      } catch (error) {
        console.error('Error loading user settings:', error)
        toast({
          title: "Error",
          description: "Failed to load user settings. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    loadUserSettings()
  }, [toast])

  // Get current theme state
  const currentTheme = mounted ? (resolvedTheme || theme || "dark") : "dark"
  const isSystem = mounted && theme === "system"

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Update user profile with new settings
      await api.profile.update("current", {
        name: settings.displayName,
        email: settings.email,
      })

      // Save theme preference to localStorage
      localStorage.setItem("theme", settings.theme)
      setTheme(settings.theme)

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      })
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "Save Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading settings...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="space-y-2">
        <Label htmlFor="displayName" className="text-sm font-medium">
          Display Name
        </Label>
        <Input
          id="displayName"
          value={settings.displayName}
          onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
          className="text-sm border-border/50 focus:border-red-500 focus:ring-red-500/20"
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={settings.email}
          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
          className="text-sm border-border/50 focus:border-red-500 focus:ring-red-500/20"
          disabled={isLoading}
        />
      </div>
      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
        <div className="flex items-center gap-3">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="notifications" className="text-sm font-medium">
            Email Notifications
          </Label>
        </div>
        <Button
          variant={settings.notifications ? "default" : "outline"}
          size="sm"
          onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
          className="text-xs"
          disabled={isLoading}
        >
          {settings.notifications ? "On" : "Off"}
        </Button>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Theme</Label>
        <div className="flex gap-2">
          <Button
            variant={currentTheme === "light" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setTheme("light")
              setSettings({ ...settings, theme: "light" })
            }}
            className="text-xs flex-1"
            disabled={isLoading}
          >
            <Sun className="mr-2 h-4 w-4" />
            Light
          </Button>
          <Button
            variant={!isSystem && currentTheme === "dark" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setTheme("dark")
              setSettings({ ...settings, theme: "dark" })
            }}
            className="text-xs flex-1"
            disabled={isLoading}
          >
            <Moon className="mr-2 h-4 w-4" />
            Dark
          </Button>
          <Button
            variant={isSystem ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setTheme("system")
              setSettings({ ...settings, theme: "system" })
            }}
            className="text-xs flex-1"
            disabled={isLoading}
          >
            <Monitor className="mr-2 h-4 w-4" />
            System
          </Button>
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSave}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-sm w-full sm:w-auto shadow-md"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  )
}