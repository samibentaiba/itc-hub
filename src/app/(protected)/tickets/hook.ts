"use client"

import { useState, useMemo } from "react"
import type { Ticket, Stat } from "./types"

export function useTicketsPage(initialTickets: Ticket[], initialStats: Stat[]) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredTickets = useMemo(() => {
    // If no initial tickets are provided, return an empty array
    if (!initialTickets) return [];
    
    return initialTickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.description && ticket.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
      const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [searchTerm, statusFilter, priorityFilter, initialTickets])

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case "open":
        return "destructive"
      case "in-progress":
        return "default"
      case "resolved":
        return "secondary"
      case "closed":
        return "outline"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case "urgent":
      case "high": return "destructive"
      case "medium": return "default"
      case "low": return "secondary"
      default: return "outline"
    }
  }

  const formatStatus = (status: string) => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return {
    searchTerm,
    statusFilter,
    priorityFilter,
    stats: initialStats, // Pass through the stats from props
    filteredTickets,
    setSearchTerm,
    setStatusFilter,
    setPriorityFilter,
    getStatusColor,
    getPriorityColor,
    formatStatus,
  }
}