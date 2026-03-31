import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckSquare, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <CheckSquare size={18} className="text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">FlowTrack</span>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-1">Create an account</h2>
        <p className="text-muted-foreground mb-6">Get started with FlowTrack</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Full Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Confirm Password</label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account…" : <><UserPlus size={16} className="mr-1.5" />Create Account</>}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
