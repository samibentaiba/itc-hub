import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RoleSelect } from "@/features/selects/RoleSelect";

export function DepartmentForm({ initialData = { name: "", description: "", superLeader: "" }, onSubmit, onCancel, submitLabel = "Submit" }: {
  initialData?: { name: string; description: string; superLeader: string };
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
        <Label htmlFor="deptName" className="text-sm">
          Department Name
        </Label>
        <Input
          id="deptName"
          placeholder="Enter department name..."
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="text-sm"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="deptDescription" className="text-sm">
          Description
        </Label>
        <Input
          id="deptDescription"
          placeholder="Describe the department's role..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          className="text-sm"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm">Super Leader</Label>
        <RoleSelect
          value={formData.superLeader}
          onChange={(value) => setFormData({ ...formData, superLeader: value })}
          className="text-sm"
          placeholder="Select super leader"
        />
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