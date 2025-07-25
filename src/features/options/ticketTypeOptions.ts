export const ticketTypeOptions = [
  { value: "task", label: "Task" },
  { value: "meeting", label: "Meeting" },
  { value: "event", label: "Event" },
];

export const ticketTypeOptionsMap = Object.fromEntries(
  ticketTypeOptions.map((opt) => [opt.value, opt.label])
);
