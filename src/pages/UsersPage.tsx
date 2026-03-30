import AppLayout from "@/components/AppLayout";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { LoadingSpinner, EmptyState } from "@/components/StatusComponents";
import { getInitials } from "@/utils/helpers";

export default function UsersPage() {
  const { users, loading } = useAppContext();

  return (
    <AppLayout>
      <Navbar title="Team" subtitle="Manage your team members" />
      <div className="p-6 animate-fade-in">
        {loading ? <LoadingSpinner /> : users.length === 0 ? (
          <EmptyState title="No users" description="No team members found." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((u) => (
              <div key={u.id} className="bg-card rounded-xl border border-border p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
                  {getInitials(u.name)}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">{u.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{u.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">{u.role}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
