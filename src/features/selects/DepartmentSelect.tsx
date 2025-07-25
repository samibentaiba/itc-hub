import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getDepartments } from "@/services/departmentService";

export function DepartmentSelect({ value, onChange, className = "", placeholder = "Select department" }: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}) {
  const [departments, setDepartments] = useState<any[]>([]);
  useEffect(() => {
    getDepartments().then(setDepartments);
  }, []);
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {departments.map((dept) => (
          <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 