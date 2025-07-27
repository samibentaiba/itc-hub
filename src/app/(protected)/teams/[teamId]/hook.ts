"use client"

import { useState, useEffect } from "react"

import { useToast } from "@/hooks/use-toast"
import { getTeams } from "@/services/teamService";
import { getTickets } from "@/services/ticketService";

export function useTeam({ params }: { params: { teamId: string } }) {
    const { teamId } = params
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [showNewTicket, setShowNewTicket] = useState(false)
    const [team, setTeam] = useState<any>(null)
    const [tickets, setTickets] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const teams = await getTeams()
            const foundTeam = teams.find((t: any) => t.id === teamId)
            setTeam(foundTeam)

            const allTickets = await getTickets()
            const filtered = allTickets.filter((t: any) => t.teamId === teamId)
            setTickets(filtered)

            setLoading(false)
        }
        fetchData()
    }, [teamId])

    const selectedDateTickets = tickets.filter(
        (ticket) => date && new Date(ticket.dueDate).toDateString() === date.toDateString(),
    )

    const calendarEvents = tickets.reduce((acc, ticket) => {
        const dateKey = new Date(ticket.dueDate).toDateString()
        if (!acc[dateKey]) acc[dateKey] = []
        acc[dateKey].push(ticket)
        return acc
    }, {} as Record<string, typeof tickets>)

    const handleMemberAction = (action: string, memberId: string) => {
        const member = team.members.find((m: any) => m.id === memberId)
        toast({
            title: `${action} ${member?.name}`,
            description: `Action "${action}" performed on ${member?.name}`,
        })
    }

    const handleInviteMember = () => {
        toast({
            title: "Invitation sent",
            description: "Team invitation has been sent successfully.",
        })
    }
    return { loading, team, showNewTicket, setShowNewTicket, tickets, setDate, calendarEvents, date, selectedDateTickets, handleInviteMember, handleMemberAction }
}