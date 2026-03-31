import AppLayout from "@/components/AppLayout";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { LoadingSpinner, EmptyState } from "@/components/StatusComponents";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Pencil, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import TaskFormModal from "@/features/tasks/TaskFormModal";
import { TASK_STATUSES, TASK_PRIORITIES } from "@/utils/constants";
import type { Task } from "@/utils/constants";
import { formatDate } from "@/utils/helpers";
import { toast } from "sonner";

export default function Tasks() {
  const { tasks, projects, loading, deleteTask } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>();
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterProject, setFilterProject] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (filterStatus !== "all" && t.status !== filterStatus) return false;
      if (filterPriority !== "all" && t.priority !== filterPriority) return false;
      if (filterProject !== "all" && t.projectId !== filterProject) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!t.title.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q) && !t.assignedUser.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [tasks, filterStatus, filterPriority, filterProject, search]);

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  return (
    <AppLayout>
      <Navbar title="Tasks" subtitle="Track and manage all tasks" />
      <div className="p-6 animate-fade-in">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks…" className="pl-9" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {TASK_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {TASK_PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Project" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex-1" />
          <Button onClick={() => { setEditTask(undefined); setShowForm(true); }}><Plus size={16} className="mr-1.5" />New Task</Button>
        </div>

        {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
          <EmptyState title="No tasks found" description="Adjust your filters or create a new task." action={<Button onClick={() => { setEditTask(undefined); setShowForm(true); }}>Create Task</Button>} />
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-hover">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Priority</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Assignee</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Due Date</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id} className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors">
                      <td className="px-4 py-3">
                        <Link to={`/tasks/${t.id}`} className="font-medium text-foreground hover:text-primary transition-colors">{t.title}</Link>
                        <p className="text-xs text-muted-foreground">{t.projectName}</p>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                      <td className="px-4 py-3"><PriorityBadge priority={t.priority} /></td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{t.assignedUser}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{formatDate(t.dueDate)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setEditTask(t); setShowForm(true); }} className="p-1.5 rounded-md hover:bg-surface-active transition-colors" aria-label="Edit task"><Pencil size={14} className="text-muted-foreground" /></button>
                          <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors" aria-label="Delete task"><Trash2 size={14} className="text-destructive" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <TaskFormModal open={showForm} onClose={() => setShowForm(false)} editTask={editTask} />
    </AppLayout>
  );
}
