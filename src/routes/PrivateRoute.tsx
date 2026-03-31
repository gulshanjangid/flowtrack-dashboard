import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { LoadingSpinner } from "@/components/StatusComponents";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><LoadingSpinner /></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
