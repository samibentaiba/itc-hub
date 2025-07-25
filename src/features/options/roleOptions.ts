export const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "super_leader", label: "Super Leader" },
  { value: "leader", label: "Leader" },
  { value: "member", label: "Member" },
  { value: "guest", label: "Guest" },
];

export const roleOptionsMap = Object.fromEntries(
  roleOptions.map((opt) => [opt.value, opt.label])
);
