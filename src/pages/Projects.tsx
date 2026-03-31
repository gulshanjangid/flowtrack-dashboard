import AppLayout from "@/components/AppLayout";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { LoadingSpinner, EmptyState } from "@/components/StatusComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import ProjectFormModal from "@/features/projects/ProjectFormModal";
import { formatDate } from "@/utils/helpers";

export default function Projects() {
  const { projects, loading } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return projects;
    const q = search.toLowerCase();
    return projects.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }, [projects, search]);

  return (
    <AppLayout>
      <Navbar title="Projects" subtitle="Manage your team's projects" />
      <div className="p-6 animate-fade-in">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects…" className="pl-9" />
          </div>
          <div className="flex-1" />
          <Button onClick={() => setShowForm(true)}><Plus size={16} className="mr-1.5" />New Project</Button>
        </div>

        {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
          <EmptyState title="No projects found" description="Create your first project to get started." action={<Button onClick={() => setShowForm(true)}>Create Project</Button>} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <Link key={p.id} to={`/projects/${p.id}`} className="group bg-card rounded-xl border border-border p-5 hover:shadow-md hover:border-primary/30 transition-all">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{p.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">{p.taskCount} tasks</span>
                  <span className="text-xs text-muted-foreground">{formatDate(p.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <ProjectFormModal open={showForm} onClose={() => setShowForm(false)} />
    </AppLayout>
  );
}
