import AppLayout from "@/components/AppLayout";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { LoadingSpinner } from "@/components/StatusComponents";
import { Link } from "react-router-dom";
import { CheckSquare, Clock, FolderKanban, TrendingUp, AlertTriangle } from "lucide-react";
import { StatusBadge, PriorityBadge } from "@/components/Badges";
import { formatDate } from "@/utils/helpers";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useMemo } from "react";

export default function Dashboard() {
  const { projects, tasks, loading } = useAppContext();

  const totalTasks = tasks.length;
  const completed = tasks.filter((t) => t.status === "Done").length;
  const pending = tasks.filter((t) => t.status !== "Done").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const overdue = tasks.filter((t) => t.status !== "Done" && new Date(t.dueDate) < new Date()).length;

  const stats = [
    { label: "Total Tasks", value: totalTasks, icon: CheckSquare, color: "text-primary" },
    { label: "Completed", value: completed, icon: TrendingUp, color: "text-success" },
    { label: "In Progress", value: inProgress, icon: Clock, color: "text-info" },
    { label: "Overdue", value: overdue, icon: AlertTriangle, color: "text-destructive" },
  ];

  const priorityData = useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach((t) => { counts[t.priority] = (counts[t.priority] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tasks]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach((t) => { counts[t.status] = (counts[t.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tasks]);

  const projectProgress = useMemo(() => {
    return projects.map((p) => {
      const projectTasks = tasks.filter((t) => t.projectId === p.id);
      const done = projectTasks.filter((t) => t.status === "Done").length;
      const total = projectTasks.length;
      return { name: p.name.length > 12 ? p.name.slice(0, 12) + "…" : p.name, done, total, progress: total ? Math.round((done / total) * 100) : 0 };
    });
  }, [projects, tasks]);

  const PIE_COLORS = ["hsl(0, 72%, 51%)", "hsl(38, 92%, 50%)", "hsl(210, 70%, 50%)", "hsl(142, 60%, 40%)"];
  const STATUS_COLORS = ["hsl(220, 10%, 46%)", "hsl(210, 70%, 50%)", "hsl(38, 92%, 50%)", "hsl(142, 60%, 40%)"];

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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* Charts row */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Priority Distribution */}
              <div className="bg-card rounded-xl border border-border p-5">
                <h2 className="font-semibold text-foreground mb-4">Priority Distribution</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={priorityData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                      {priorityData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 mt-2 justify-center">
                  {priorityData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      {d.name} ({d.value})
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="bg-card rounded-xl border border-border p-5">
                <h2 className="font-semibold text-foreground mb-4">Task Status</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {statusData.map((_, i) => (
                        <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Project Progress */}
              <div className="bg-card rounded-xl border border-border p-5">
                <h2 className="font-semibold text-foreground mb-4">Project Progress</h2>
                <div className="space-y-4">
                  {projectProgress.map((p) => (
                    <div key={p.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-foreground">{p.name}</span>
                        <span className="text-xs text-muted-foreground">{p.done}/{p.total}</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-active overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Projects + Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
