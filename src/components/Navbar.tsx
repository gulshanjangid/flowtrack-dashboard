import { useAuth } from "@/context/AuthContext";
import { Bell, LogOut } from "lucide-react";
import { getInitials } from "@/utils/helpers";
import ThemeToggle from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  title: string;
  subtitle?: string;
}

export default function Navbar({ title, subtitle }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button className="relative p-2 rounded-lg hover:bg-surface-hover transition-colors" aria-label="Notifications">
          <Bell size={18} className="text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </button>
        {user && (
          <div className="flex items-center gap-2 ml-1">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
              {getInitials(user.name)}
            </div>
            <span className="text-sm font-medium text-foreground hidden sm:block">{user.name}</span>
            <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-surface-hover transition-colors" aria-label="Logout">
              <LogOut size={16} className="text-muted-foreground" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
