"use client"

import { useState, useMemo } from "react"
import type { TicketLocal, TicketStatLocal } from "../types"

export function useTicketsPage(initialTickets: TicketLocal[], initialStats: TicketStatLocal[]) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all") // ADDED: State for the new type filter

  const filteredTickets = useMemo(() => {
    if (!initialTickets) return [];
    
    return initialTickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.description && ticket.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
      const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
      const matchesType = typeFilter === "all" || ticket.type === typeFilter // ADDED: Logic for type filter

      return matchesSearch && matchesStatus && matchesPriority && matchesType
    })
  }, [searchTerm, statusFilter, priorityFilter, typeFilter, initialTickets]) // ADDED: typeFilter to dependency array

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      // UPDATED: Cases to match new statuses
      case "new":
        return "destructive"
      case "in-progress":
        return "default"
      case "resolved":
        return "secondary"
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
    typeFilter, // EXPOSED: Expose new state and setter
    stats: initialStats,
    filteredTickets,
    setSearchTerm,
    setStatusFilter,
    setPriorityFilter,
    setTypeFilter, // EXPOSED: Expose new state and setter
    getStatusColor,
    getPriorityColor,
    formatStatus,
  }
}
