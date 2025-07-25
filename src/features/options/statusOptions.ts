export const statusOptions = [
  { value: "verified", label: "Verified" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "scheduled", label: "Scheduled" },
  { value: "active", label: "Active" },
  { value: "closed", label: "Closed" },
];

export const statusOptionsMap = Object.fromEntries(
  statusOptions.map((opt) => [opt.value, opt.label])
);
