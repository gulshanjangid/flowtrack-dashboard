import { cn } from "@/lib/utils";
import type { TaskStatus, TaskPriority } from "@/utils/constants";

const statusStyles: Record<TaskStatus, string> = {
  "To Do": "bg-muted text-muted-foreground",
  "In Progress": "bg-info/10 text-info",
  "In Review": "bg-warning/10 text-warning",
  "Done": "bg-success/10 text-success",
};

const priorityStyles: Record<TaskPriority, string> = {
  "Low": "bg-muted text-muted-foreground",
  "Medium": "bg-info/10 text-info",
  "High": "bg-warning/10 text-warning",
  "Critical": "bg-destructive/10 text-destructive",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", statusStyles[status])}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", priorityStyles[priority])}>
      {priority}
    </span>
  );
}
