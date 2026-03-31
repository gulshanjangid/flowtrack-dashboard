import AppLayout from "@/components/AppLayout";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { LoadingSpinner, EmptyState } from "@/components/StatusComponents";
import { getInitials } from "@/utils/helpers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Search, Shield } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  enabled: boolean;
}

export default function UsersPage() {
  const { users, loading } = useAppContext();
  const [search, setSearch] = useState("");

  // Local state for role/enabled management (mock)
  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>([]);

  // Sync managed users when users from context change
  useEffect(() => {
    setManagedUsers((prev) => {
      if (prev.length === 0) return users.map((u) => ({ ...u, enabled: true }));
      const existingIds = new Set(prev.map((u) => u.id));
      const newUsers = users.filter((u) => !existingIds.has(u.id)).map((u) => ({ ...u, enabled: true }));
      return [...prev.map((p) => {
        const fresh = users.find((u) => u.id === p.id);
        return fresh ? { ...p, name: fresh.name, email: fresh.email } : p;
      }), ...newUsers];
    });
  }, [users]);

  const filtered = useMemo(() => {
    if (!search.trim()) return managedUsers;
    const q = search.toLowerCase();
    return managedUsers.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [managedUsers, search]);

  const changeRole = (userId: string, newRole: string) => {
    setManagedUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
    toast.success("Role updated");
  };

  const toggleEnabled = (userId: string) => {
    setManagedUsers((prev) => prev.map((u) => {
      if (u.id !== userId) return u;
      const next = !u.enabled;
      toast.info(next ? `${u.name} enabled` : `${u.name} disabled`);
      return { ...u, enabled: next };
    }));
  };

  const ROLES = ["Admin", "Manager", "Developer", "Designer", "PM", "Member"];

  return (
    <AppLayout>
      <Navbar title="User Management" subtitle="Assign roles and manage access" />
      <div className="p-6 animate-fade-in">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users…" className="pl-9" />
          </div>
        </div>

        {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
          <EmptyState title="No users found" description="No team members match your search." />
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-hover">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Email</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id} className={`border-b border-border last:border-0 hover:bg-surface-hover transition-colors ${!u.enabled ? "opacity-50" : ""}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                            {getInitials(u.name)}
                          </div>
                          <span className="font-medium text-foreground">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3">
                        <Select value={u.role} onValueChange={(v) => changeRole(u.id, v)}>
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <div className="flex items-center gap-1.5">
                              <Shield size={12} />
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Switch checked={u.enabled} onCheckedChange={() => toggleEnabled(u.id)} />
                          <span className={`text-xs font-medium ${u.enabled ? "text-success" : "text-destructive"}`}>
                            {u.enabled ? "Active" : "Disabled"}
                          </span>
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
    </AppLayout>
  );
}
