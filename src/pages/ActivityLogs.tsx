import AppLayout from "@/components/AppLayout";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { LoadingSpinner, EmptyState } from "@/components/StatusComponents";
import { formatDateTime } from "@/utils/helpers";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";

interface LogEntry {
  id: string;
  taskTitle: string;
  taskId: string;
  from: string;
  to: string;
  changedBy: string;
  changedAt: string;
}

export default function ActivityLogs() {
  const { tasks, loading } = useAppContext();

  const logs = useMemo(() => {
    const entries: LogEntry[] = [];
    tasks.forEach((t) => {
      t.history.forEach((h, i) => {
        entries.push({
          id: `${t.id}-${i}`,
          taskTitle: t.title,
          taskId: t.id,
          from: h.from,
          to: h.to,
          changedBy: h.changedBy,
          changedAt: h.changedAt,
        });
      });
    });
    return entries.sort((a, b) => b.changedAt.localeCompare(a.changedAt));
  }, [tasks]);

  return (
    <AppLayout>
      <Navbar title="Activity Logs" subtitle="Track all task status changes" />
      <div className="p-6 animate-fade-in">
        {loading ? <LoadingSpinner /> : logs.length === 0 ? (
          <EmptyState title="No activity yet" description="Status changes will appear here." />
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-hover">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Task</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Change</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">By</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{log.taskTitle}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded bg-surface-active text-muted-foreground">{log.from}</span>
                          <ArrowRight size={12} className="text-muted-foreground" />
                          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">{log.to}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{log.changedBy}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{formatDateTime(log.changedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
