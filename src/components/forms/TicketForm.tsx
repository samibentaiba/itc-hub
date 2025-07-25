import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TicketTypeSelect } from "@/features/selects/TicketTypeSelect";
import { RoleSelect } from "@/features/selects/RoleSelect";
import { DepartmentSelect } from "@/features/selects/DepartmentSelect";

export function TicketForm({ initialData = { title: "", description: "", type: "", workspace: "", assignee: "", dueDate: "" }, onSubmit, onCancel, submitLabel = "Submit" }: {
  initialData?: { title: string; description: string; type: string; workspace: string; assignee: string; dueDate: string };
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
        <Label htmlFor="title" className="text-sm">
          Title
        </Label>
        <Input
          id="title"
          placeholder="Enter ticket title..."
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="text-sm"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm">
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Describe the task, meeting, or event..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          className="text-sm min-h-[80px]"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm">Type</Label>
          <TicketTypeSelect
            value={formData.type}
            onChange={(value) => setFormData({ ...formData, type: value })}
            className="text-sm"
            placeholder="Select type"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm">Workspace</Label>
          <Input
            placeholder="Enter workspace (team/department)"
            value={formData.workspace}
            onChange={(e) => setFormData({ ...formData, workspace: e.target.value })}
            className="text-sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm">Assignee</Label>
          <RoleSelect
            value={formData.assignee}
            onChange={(value) => setFormData({ ...formData, assignee: value })}
            className="text-sm"
            placeholder="Assign to..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dueDate" className="text-sm">
            Due Date
          </Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
            className="text-sm"
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