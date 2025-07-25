import { WorkspaceLayout } from "@/components/workspace-layout"
import { TeamView } from "@/components/team-view"

interface TeamPageProps {
  params: {
    teamId: string
  }
}

export default function TeamPage({ params }: TeamPageProps) {
  return (
    <WorkspaceLayout>
      <TeamView teamId={params.teamId} />
    </WorkspaceLayout>
  )
}
