import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TeamsTable } from "./TeamsTable";

export function TeamTab({ teamData, onSetModal }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Team Management</CardTitle>
          <CardDescription>Create teams and manage their members.</CardDescription>
        </div>
        <Button onClick={() => onSetModal({ view: "ADD_TEAM" })}>
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </CardHeader>
      <CardContent>
        <TeamsTable teams={teamData.teams} onSetModal={onSetModal} />
      </CardContent>
    </Card>
  );
}