import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RoleSelect } from "@/features/selects/RoleSelect";

export function UserForm({ initialData = { name: "", email: "", role: "member" }, onSubmit, onCancel, submitLabel = "Submit" }: {
  initialData?: { name: string; email: string; role: string };
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
        <Label htmlFor="userName" className="text-sm">
          Full Name
        </Label>
        <Input
          id="userName"
          placeholder="Enter user's full name..."
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="text-sm"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="userEmail" className="text-sm">
          Email Address
        </Label>
        <Input
          id="userEmail"
          type="email"
          placeholder="Enter user's email..."
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="text-sm"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm">Initial Role</Label>
        <RoleSelect
          value={formData.role}
          onChange={(value) => setFormData({ ...formData, role: value })}
          className="text-sm"
          placeholder="Select role"
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