// /app/(home)/hook.ts

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Activity } from "lucide-react";

/**
 * A custom hook to manage all state and logic for the landing page.
 * This includes dialogs, loading states, and user actions.
 */
export const useLandingPage = () => {
  const [selectedStatCard, setSelectedStatCard] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  // Effect to show a welcome-back dialog to authenticated users.
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setShowDialog(true);
    }
  }, [status, session]);

  const handleGoToDashboard = () => router.push("/dashboard");
  const handleStayHere = () => setShowDialog(false);

  // Handles clicks on the main statistic cards.
  const handleStatCardClick = async (cardType: string) => {
    setSelectedStatCard(cardType);
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({
        title: `${cardType} Overview`,
        description: `Viewing ${cardType.toLowerCase()} statistics and details.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to load details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSelectedStatCard(null);
    }
  };

  // Handles all other primary actions on the page.
  const handleQuickAction = async (action: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      switch (action) {
        case "Join Community":
          router.push("/dashboard");
          break;
        case "View All Events":
          toast({
            title: "Events Calendar",
            description: "Opening events calendar...",
          });
          break;
        case "Learn More":
          toast({
            title: "More Information",
            description: "Loading additional details...",
          });
          break;
        default:
          toast({
            title: `Action: ${action}`,
            description: `Performing ${action.toLowerCase()}...`,
          });
      }
    } catch {
      toast({
        title: "Action Failed",
        description: "Failed to perform action. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to determine the color for event priority.
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  // Helper to render the correct trend icon for stats.
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-3 w-3 text-green-500" />;
      case "down": return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      default: return <Activity className="h-3 w-3 text-gray-500" />;
    }
  };

  return {
    isLoading,
    showDialog,
    selectedStatCard,
    session,
    setShowDialog,
    handleGoToDashboard,
    handleStayHere,
    handleStatCardClick,
    handleQuickAction,
    getPriorityColor,
    getTrendIcon,
  };
};
