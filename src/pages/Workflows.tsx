import AppLayout from "@/components/AppLayout";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { LoadingSpinner } from "@/components/StatusComponents";
import { PriorityBadge } from "@/components/Badges";
import { TASK_STATUSES } from "@/utils/constants";
import type { Task, TaskStatus } from "@/utils/constants";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getInitials } from "@/utils/helpers";
import { toast } from "sonner";
import RoleGuard from "@/components/RoleGuard";

const COLUMN_COLORS: Record<TaskStatus, string> = {
  "To Do": "border-t-muted-foreground",
  "In Progress": "border-t-info",
  "In Review": "border-t-warning",
  "Done": "border-t-success",
};

export default function Workflows() {
  const { tasks, loading, updateTask } = useAppContext();
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const columns = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { "To Do": [], "In Progress": [], "In Review": [], "Done": [] };
    tasks.forEach((t) => { if (map[t.status]) map[t.status].push(t); });
    return map;
  }, [tasks]);

  const handleDragStart = (taskId: string) => setDraggedTask(taskId);

  const handleDrop = async (status: TaskStatus) => {
    if (!draggedTask) return;
    const task = tasks.find((t) => t.id === draggedTask);
    if (task && task.status !== status) {
      try {
        await updateTask(draggedTask, { status });
        toast.success(`Moved to ${status}`);
      } catch {
        toast.error("Failed to update task");
      }
    }
    setDraggedTask(null);
  };

  return (
    <AppLayout>
      <Navbar title="Workflow Board" subtitle="Drag tasks between columns to update status" />
      <div className="p-6 animate-fade-in">
        {loading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {TASK_STATUSES.map((status) => (
              <div
                key={status}
                className={`bg-card rounded-xl border border-border border-t-4 ${COLUMN_COLORS[status]} min-h-[400px]`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(status)}
              >
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">{status}</h3>
                  <span className="text-xs text-muted-foreground bg-surface-hover px-2 py-0.5 rounded-full">
                    {columns[status].length}
                  </span>
                </div>
                <div className="p-3 space-y-2">
                  {columns[status].map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                      className="bg-background rounded-lg border border-border p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                    >
                      <Link to={`/tasks/${task.id}`} className="text-sm font-medium text-foreground hover:text-primary transition-colors block mb-1.5">
                        {task.title}
                      </Link>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
                      <div className="flex items-center justify-between">
                        <PriorityBadge priority={task.priority} />
                        <div
                          className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-semibold"
                          title={task.assignedUser}
                        >
                          {getInitials(task.assignedUser)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
