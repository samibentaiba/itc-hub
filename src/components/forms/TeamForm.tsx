import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RoleSelect } from "@/features/selects/RoleSelect";
import { DepartmentSelect } from "@/features/selects/DepartmentSelect";

export function TeamForm({ initialData = { name: "", description: "", leader: "", department: "" }, onSubmit, onCancel, submitLabel = "Submit" }: {
  initialData?: { name: string; description: string; leader: string; department: string };
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  submitLabel?: string;
}) {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="teamName" className="text-sm">
          Team Name
        </Label>
        <Input
          id="teamName"
          placeholder="Enter team name..."
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="text-sm"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="teamDescription" className="text-sm">
          Description
        </Label>
        <Input
          id="teamDescription"
          placeholder="Describe the team's purpose..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          className="text-sm"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm">Team Leader</Label>
          <RoleSelect
            value={formData.leader}
            onChange={(value) => setFormData({ ...formData, leader: value })}
            className="text-sm"
            placeholder="Select leader"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm">Department</Label>
          <DepartmentSelect
            value={formData.department}
            onChange={(value) => setFormData({ ...formData, department: value })}
            className="text-sm"
            placeholder="Select department"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" className="text-sm bg-transparent" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="bg-red-600 hover:bg-red-700 text-sm">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
} 