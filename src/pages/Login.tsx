import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckSquare, LogIn } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 sidebar-gradient items-center justify-center p-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <CheckSquare size={22} className="text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">FlowTrack</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">Streamline your workflow, amplify your productivity.</h1>
          <p className="text-white/60 text-lg">Manage tasks, track progress, and collaborate with your team — all in one place.</p>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <CheckSquare size={18} className="text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">FlowTrack</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-1">Welcome back</h2>
          <p className="text-muted-foreground mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@flowtrack.io" autoComplete="email" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : <><LogIn size={16} className="mr-1.5" />Sign In</>}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline font-medium">Sign up</Link>
          </p>

          <div className="mt-8 p-4 rounded-lg bg-surface-hover border border-border">
            <p className="text-xs font-semibold text-foreground mb-2">Demo Accounts</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><span className="font-medium text-foreground">Admin:</span> admin@flowtrack.io / admin123</p>
              <p><span className="font-medium text-foreground">Manager:</span> manager@flowtrack.io / manager123</p>
              <p><span className="font-medium text-foreground">Member:</span> member@flowtrack.io / member123</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
