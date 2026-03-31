import AppLayout from "@/components/AppLayout";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { LoadingSpinner, EmptyState } from "@/components/StatusComponents";
import { getInitials } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Users2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Team {
  id: string;
  name: string;
  members: string[]; // user IDs
}

const INITIAL_TEAMS: Team[] = [
  { id: "team1", name: "Engineering", members: ["u1", "u2", "u5"] },
  { id: "team2", name: "Design", members: ["u3", "u4"] },
];

export default function Teams() {
  const { users, loading } = useAppContext();
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");

  const createTeam = () => {
    if (!newName.trim()) return;
    setTeams((prev) => [...prev, { id: `team${Date.now()}`, name: newName.trim(), members: [] }]);
    setNewName("");
    setShowCreate(false);
    toast.success("Team created");
  };

  const addMember = (teamId: string, userId: string) => {
    setTeams((prev) => prev.map((t) => t.id === teamId ? { ...t, members: [...t.members, userId] } : t));
    toast.success("Member added");
  };

  const removeMember = (teamId: string, userId: string) => {
    setTeams((prev) => prev.map((t) => t.id === teamId ? { ...t, members: t.members.filter((m) => m !== userId) } : t));
    toast.info("Member removed");
  };

  const getUserById = (id: string) => users.find((u) => u.id === id);

  return (
    <AppLayout>
      <Navbar title="Teams" subtitle="Manage team composition" />
      <div className="p-6 animate-fade-in">
        <div className="flex justify-end mb-6">
          <Button onClick={() => setShowCreate(true)}><Plus size={16} className="mr-1.5" />New Team</Button>
        </div>

        {loading ? <LoadingSpinner /> : teams.length === 0 ? (
          <EmptyState title="No teams" description="Create your first team." action={<Button onClick={() => setShowCreate(true)}>Create Team</Button>} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {teams.map((team) => (
              <motion.div key={team.id} layout className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users2 size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{team.name}</h3>
                    <p className="text-xs text-muted-foreground">{team.members.length} members</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {team.members.map((uid) => {
                    const user = getUserById(uid);
                    if (!user) return null;
                    return (
                      <div key={uid} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-surface-hover">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                            {getInitials(user.name)}
                          </div>
                          <span className="text-sm text-foreground">{user.name}</span>
                        </div>
                        <button onClick={() => removeMember(team.id, uid)} className="p-1 hover:bg-destructive/10 rounded transition-colors">
                          <X size={14} className="text-destructive" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Add member dropdown */}
                {users.filter((u) => !team.members.includes(u.id)).length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {users.filter((u) => !team.members.includes(u.id)).map((u) => (
                      <button
                        key={u.id}
                        onClick={() => addMember(team.id, u.id)}
                        className="text-xs px-2 py-1 rounded bg-surface-active text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        + {u.name}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Create Team</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Team Name</label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Marketing" />
            </div>
            <Button onClick={createTeam} className="w-full" disabled={!newName.trim()}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
