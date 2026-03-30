import { format, parseISO, isValid } from "date-fns";

export function formatDate(dateStr: string): string {
  const d = parseISO(dateStr);
  return isValid(d) ? format(d, "MMM d, yyyy") : dateStr;
}

export function formatDateTime(dateStr: string): string {
  const d = parseISO(dateStr);
  return isValid(d) ? format(d, "MMM d, yyyy h:mm a") : dateStr;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
