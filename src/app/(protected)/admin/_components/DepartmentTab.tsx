import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DepartmentsTable } from "./DepartmentsTable";

export function DepartmentTab({ departmentData, onSetModal }: DepartmentTabProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Department Management</CardTitle>
          <CardDescription>Create departments and assign members.</CardDescription>
        </div>
        <Button onClick={() => onSetModal({ view: "ADD_DEPARTMENT" })}>
          <Plus className="mr-2 h-4 w-4" />
          Create Department
        </Button>
      </CardHeader>
      <CardContent>
        <DepartmentsTable departments={departmentData.departments} onSetModal={onSetModal} />
      </CardContent>
    </Card>
  );
}