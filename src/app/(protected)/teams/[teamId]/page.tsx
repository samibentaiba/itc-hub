"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useTeamDetailPage } from "./hook"
import TeamView from "./team-view" // Assuming you moved UI into a component
import Loading from "./loading"

export default function TeamDetailPage() {
  const { teamId, loading, team } = useTeamDetailPage()

  if (loading && !team) {
    return <Loading/>
  }

  if (!team) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/teams">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Teams
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Team not found</h3>
              <p className="text-muted-foreground">The team you&apos;re looking for doesn&apos;t exist.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/teams">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Teams
          </Button>
        </Link>
      </div>

      <TeamView
        teamId={team.id}
        teamName={team.name}
        teamDescription={team.description}
      />
    </div>
  )
}
