import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderKanban, CheckSquare, Users, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/users", label: "Users", icon: Users },
];

export default function AppSidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 md:hidden rounded-md p-2 bg-sidebar text-sidebar-foreground"
        aria-label="Toggle sidebar"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {open && <div className="fixed inset-0 z-30 bg-foreground/20 md:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-60 sidebar-gradient flex flex-col transition-transform md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-2 px-6 py-6 border-b border-sidebar-border">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <CheckSquare size={18} className="text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-accent-foreground tracking-tight">FlowTrack</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map((l) => {
            const isActive = l.to === "/" ? location.pathname === "/" : location.pathname.startsWith(l.to);
            return (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <l.icon size={18} />
                {l.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/50">FlowTrack v1.0</p>
        </div>
      </aside>
    </>
  );
}
