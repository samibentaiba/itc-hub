"use client";

import type React from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();


// Community stats data
const communityStats = {
  activeMembers: { count: 127, change: "+12 this month", trend: "up" },
  activeProjects: { count: 23, change: "+5 this week", trend: "up" },
  completedTasks: { count: 1247, change: "+89 this week", trend: "up" },
  successRate: { count: 94, change: "+2% from last month", trend: "up" },
}

const [showDialog, setShowDialog] = useState(false)
const [countdown, setCountdown] = useState(3) // State for the 3-second countdown

useEffect(() => {
  // Handle authenticated users
  if (status === "authenticated" && session?.user) {
    setShowDialog(true)
    return // Exit early
  }

  // Handle unauthenticated users with a countdown
  if (status === "unauthenticated") {
    if (countdown === 0) {
      router.push("/login")
      return
    }

    // Set up a timer to decrement the countdown
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    // Clean up the timer when the component unmounts or dependencies change
    return () => clearTimeout(timer)
  }
}, [status, session, countdown, router])

const handleStayHere = () => {
  setShowDialog(false)
}

const handleGoToDashboard = () => {
  router.push("/dashboard")
}

if (status === "loading") {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p className="text-lg">Loading...</p>
        <p className="text-sm text-gray-500">Verifying session...</p>
      </div>
    </div>
  )
}

if (status === "unauthenticated") {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <p className="text-xl font-semibold text-gray-800">Access Denied</p>
        <p className="text-md text-gray-600 mt-2">
          You must be logged in to access this page.
        </p>
        <p className="text-lg text-gray-700 mt-4">
          Redirecting to login in{" "}
          <span className="font-bold text-red-500 w-8 inline-block text-center">{countdown}</span>{" "}
          seconds...
        </p>
      </div>
    </div>
  )
}


  return <>       
  {children}
</>;
}
