"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Moon, Sun, Settings, Monitor } from "lucide-react";
import { useSettingsPage } from "./hook";
import type { UserSettingsLocal } from "../types";

interface SettingsClientPageProps {
  initialSettings: UserSettingsLocal;
}

// This is the main client component for the settings page.
export default function SettingsClientPage({ initialSettings }: SettingsClientPageProps) {
  const {
    settings,
    handleSettingsChange,
    isLoading,
    handleSave,
    setTheme,
    currentTheme,
    isSystem,
  } = useSettingsPage(initialSettings);

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
          {/* Form UI */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={settings.displayName}
                onChange={(e) => handleSettingsChange("displayName", e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleSettingsChange("email", e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="notifications">Email Notifications</Label>
              </div>
              <Button
                variant={settings.notifications ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingsChange("notifications", !settings.notifications)}
                disabled={isLoading}
              >
                {settings.notifications ? "On" : "Off"}
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="flex gap-2">
                <Button variant={currentTheme === "light" ? "default" : "outline"} size="sm" onClick={() => setTheme("light")} disabled={isLoading}>
                  <Sun className="mr-2 h-4 w-4" /> Light
                </Button>
                <Button variant={!isSystem && currentTheme === "dark" ? "default" : "outline"} size="sm" onClick={() => setTheme("dark")} disabled={isLoading}>
                  <Moon className="mr-2 h-4 w-4" /> Dark
                </Button>
                <Button variant={isSystem ? "default" : "outline"} size="sm" onClick={() => setTheme("system")} disabled={isLoading}>
                  <Monitor className="mr-2 h-4 w-4" /> System
                </Button>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
