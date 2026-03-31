import { useAuth } from "@/context/AuthContext";
import type { Permission } from "@/utils/permissions";
import { hasPermission } from "@/utils/permissions";
import { Navigate } from "react-router-dom";

interface RoleGuardProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirect?: boolean;
}

/** Protects UI elements or routes based on user role */
export default function RoleGuard({ permission, children, fallback = null, redirect = false }: RoleGuardProps) {
  const { user } = useAuth();
  if (!user || !hasPermission(user.role, permission)) {
    if (redirect) return <Navigate to="/" replace />;
    return <>{fallback}</>;
  }
  return <>{children}</>;
}
