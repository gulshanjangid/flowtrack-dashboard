import type { UserRole } from "@/context/AuthContext";

export const PERMISSIONS = {
  manageUsers: ["admin"],
  manageTeams: ["admin"],
  manageWorkflows: ["admin", "manager"],
  manageTasks: ["admin", "manager"],
  viewTeamData: ["admin", "manager"],
  viewActivityLogs: ["admin", "manager"],
  viewAssignedTasks: ["admin", "manager", "member"],
  updateTaskStatus: ["admin", "manager", "member"],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly string[]).includes(role);
}
