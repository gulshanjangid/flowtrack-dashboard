import AppLayout from "@/components/AppLayout";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { LoadingSpinner, EmptyState } from "@/components/StatusComponents";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/utils/helpers";

export default function ProjectTasksPage() {
  const { id } = useParams<{ id: string }>();
  const { projects, tasks, loading } = useAppContext();
  const project = projects.find((p) => p.id === id);
  const projectTasks = tasks.filter((t) => t.projectId === id);

  return (
    <AppLayout>
      <Navbar title={project?.name || "Project"} subtitle={project?.description} />
      <div className="p-6 animate-fade-in">
        <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft size={16} />Back to Projects
        </Link>

        {loading ? <LoadingSpinner /> : projectTasks.length === 0 ? (
          <EmptyState title="No tasks" description="This project has no tasks yet." />
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-hover">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Priority</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Assignee</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {projectTasks.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors">
                    <td className="px-4 py-3">
                      <Link to={`/tasks/${t.id}`} className="font-medium text-foreground hover:text-primary transition-colors">{t.title}</Link>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-4 py-3"><PriorityBadge priority={t.priority} /></td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{t.assignedUser}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{formatDate(t.dueDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
