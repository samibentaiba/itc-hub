/**
 * components/department/TeamsTab.tsx
 *
 * This component renders the content for the "Supervised Teams" tab.
 * It displays a list of teams associated with the department.
 */
import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Team } from "../../types"; // Adjust path as needed

interface TeamsTabProps {
  teams: Team[];
}

export const TeamsTab = ({ teams }: TeamsTabProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Supervised Teams</CardTitle>
      <CardDescription>Teams under this department's oversight</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Card key={team.id} className="hover:bg-accent/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium">{team.name}</h3>
                  <p className="text-sm text-muted-foreground">{team.memberCount} members</p>
                </div>
                <Badge variant={team.status === "active" ? "default" : "secondary"}>{team.status}</Badge>
              </div>
              <Link href={`/teams/${team.id}`}>
                <Button size="sm" variant="outline"><Eye className="mr-1 h-3 w-3" /> View</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </CardContent>
  </Card>
);
