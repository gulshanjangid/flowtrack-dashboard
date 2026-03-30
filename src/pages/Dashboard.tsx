import AppLayout from "@/components/AppLayout";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { LoadingSpinner } from "@/components/StatusComponents";
import { Link } from "react-router-dom";
import { CheckSquare, Clock, FolderKanban, TrendingUp } from "lucide-react";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { formatDate } from "@/utils/helpers";

export default function Dashboard() {
  const { projects, tasks, loading } = useAppContext();

  const totalTasks = tasks.length;
  const completed = tasks.filter((t) => t.status === "Done").length;
  const pending = tasks.filter((t) => t.status !== "Done").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;

  const stats = [
    { label: "Total Tasks", value: totalTasks, icon: CheckSquare, color: "text-primary" },
    { label: "Completed", value: completed, icon: TrendingUp, color: "text-success" },
    { label: "In Progress", value: inProgress, icon: Clock, color: "text-info" },
    { label: "Pending", value: pending, icon: FolderKanban, color: "text-warning" },
  ];

  const recentTasks = [...tasks].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return (
    <AppLayout>
      <Navbar title="Dashboard" subtitle="Welcome back — here's your overview" />
      <div className="p-6 space-y-6 animate-fade-in">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">{s.label}</span>
                    <s.icon size={18} className={s.color} />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Projects + Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Projects */}
              <div className="lg:col-span-1 bg-card rounded-xl border border-border p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-foreground">Projects</h2>
                  <Link to="/projects" className="text-xs text-primary hover:underline">View all</Link>
                </div>
                <div className="space-y-3">
                  {projects.slice(0, 4).map((p) => (
                    <Link key={p.id} to={`/projects/${p.id}`} className="block p-3 rounded-lg hover:bg-surface-hover transition-colors">
                      <p className="text-sm font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.taskCount} tasks</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
                <h2 className="font-semibold text-foreground mb-4">Recent Tasks</h2>
                <div className="space-y-3">
                  {recentTasks.map((t) => (
                    <Link key={t.id} to={`/tasks/${t.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-hover transition-colors">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{t.title}</p>
                        <p className="text-xs text-muted-foreground">{t.projectName} · {t.assignedUser}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <PriorityBadge priority={t.priority} />
                        <StatusBadge status={t.status} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
