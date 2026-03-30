import AppLayout from "@/components/AppLayout";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { LoadingSpinner, EmptyState } from "@/components/StatusComponents";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { useParams, Link } from "react-router-dom";
import { formatDate, formatDateTime, getInitials } from "@/utils/helpers";
import { ArrowLeft, MessageSquare, History } from "lucide-react";

export default function TaskDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { tasks, loading } = useAppContext();
  const task = tasks.find((t) => t.id === id);

  return (
    <AppLayout>
      <Navbar title="Task Details" />
      <div className="p-6 animate-fade-in">
        <Link to="/tasks" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft size={16} />Back to Tasks
        </Link>

        {loading ? <LoadingSpinner /> : !task ? (
          <EmptyState title="Task not found" description="This task may have been deleted." />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-2">{task.title}</h2>
                <p className="text-muted-foreground">{task.description}</p>
              </div>

              {/* Comments */}
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare size={18} className="text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">Comments ({task.comments.length})</h3>
                </div>
                {task.comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No comments yet.</p>
                ) : (
                  <div className="space-y-4">
                    {task.comments.map((c) => (
                      <div key={c.id} className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                          {getInitials(c.user)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">{c.user}</span>
                            <span className="text-xs text-muted-foreground">{formatDateTime(c.createdAt)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* History */}
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <History size={18} className="text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">Status History</h3>
                </div>
                {task.history.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No status changes yet.</p>
                ) : (
                  <div className="space-y-3">
                    {task.history.map((h, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                        <span className="text-muted-foreground">
                          <span className="font-medium text-foreground">{h.changedBy}</span> changed status from{" "}
                          <StatusBadge status={h.from} /> to <StatusBadge status={h.to} />
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">{formatDateTime(h.changedAt)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-card rounded-xl border border-border p-5 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <StatusBadge status={task.status} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Priority</p>
                  <PriorityBadge priority={task.priority} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Assignee</p>
                  <p className="text-sm font-medium text-foreground">{task.assignedUser}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Project</p>
                  <p className="text-sm font-medium text-foreground">{task.projectName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Due Date</p>
                  <p className="text-sm font-medium text-foreground">{formatDate(task.dueDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Created</p>
                  <p className="text-sm font-medium text-foreground">{formatDate(task.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
