import type { Project, Task, User } from "./constants";

export const mockUsers: User[] = [
  { id: "u1", name: "Alex Rivera", email: "alex@flowtrack.io", avatar: "", role: "Admin" },
  { id: "u2", name: "Sarah Chen", email: "sarah@flowtrack.io", avatar: "", role: "Developer" },
  { id: "u3", name: "Marcus Johnson", email: "marcus@flowtrack.io", avatar: "", role: "Designer" },
  { id: "u4", name: "Priya Patel", email: "priya@flowtrack.io", avatar: "", role: "PM" },
  { id: "u5", name: "James Wilson", email: "james@flowtrack.io", avatar: "", role: "Developer" },
];

export const mockProjects: Project[] = [
  { id: "p1", name: "Website Redesign", description: "Complete overhaul of the company website with modern design", createdAt: "2024-01-15", taskCount: 12 },
  { id: "p2", name: "Mobile App v2", description: "Second version of the mobile application with new features", createdAt: "2024-02-01", taskCount: 8 },
  { id: "p3", name: "API Integration", description: "Third-party API integrations for payment and analytics", createdAt: "2024-02-20", taskCount: 6 },
  { id: "p4", name: "Data Pipeline", description: "Build ETL pipeline for analytics dashboard", createdAt: "2024-03-01", taskCount: 5 },
];

export const mockTasks: Task[] = [
  { id: "t1", title: "Design homepage layout", description: "Create wireframes and high-fidelity mockups for the new homepage", status: "Done", priority: "High", assignedUser: "Marcus Johnson", dueDate: "2024-03-15", projectId: "p1", projectName: "Website Redesign", createdAt: "2024-01-20", comments: [{ id: "c1", user: "Priya Patel", text: "Looks great! Approved.", createdAt: "2024-03-10T14:30:00Z" }], history: [{ from: "To Do", to: "In Progress", changedAt: "2024-02-01T09:00:00Z", changedBy: "Marcus Johnson" }, { from: "In Progress", to: "Done", changedAt: "2024-03-14T16:00:00Z", changedBy: "Marcus Johnson" }] },
  { id: "t2", title: "Implement auth system", description: "Set up JWT authentication with refresh tokens", status: "In Progress", priority: "Critical", assignedUser: "Sarah Chen", dueDate: "2024-04-01", projectId: "p1", projectName: "Website Redesign", createdAt: "2024-02-01", comments: [], history: [{ from: "To Do", to: "In Progress", changedAt: "2024-03-01T10:00:00Z", changedBy: "Sarah Chen" }] },
  { id: "t3", title: "Setup CI/CD pipeline", description: "Configure GitHub Actions for automated testing and deployment", status: "To Do", priority: "Medium", assignedUser: "Alex Rivera", dueDate: "2024-04-10", projectId: "p1", projectName: "Website Redesign", createdAt: "2024-02-15", comments: [], history: [] },
  { id: "t4", title: "Design mobile navigation", description: "Create bottom tab navigation for the mobile app", status: "In Review", priority: "High", assignedUser: "Marcus Johnson", dueDate: "2024-03-25", projectId: "p2", projectName: "Mobile App v2", createdAt: "2024-02-05", comments: [{ id: "c2", user: "Priya Patel", text: "Can we add gesture support?", createdAt: "2024-03-20T11:00:00Z" }], history: [{ from: "To Do", to: "In Progress", changedAt: "2024-02-10T09:00:00Z", changedBy: "Marcus Johnson" }, { from: "In Progress", to: "In Review", changedAt: "2024-03-18T15:00:00Z", changedBy: "Marcus Johnson" }] },
  { id: "t5", title: "Integrate Stripe payments", description: "Add Stripe payment gateway for subscription billing", status: "To Do", priority: "Critical", assignedUser: "James Wilson", dueDate: "2024-04-15", projectId: "p3", projectName: "API Integration", createdAt: "2024-02-22", comments: [], history: [] },
  { id: "t6", title: "Build analytics dashboard", description: "Create dashboard with charts for key metrics", status: "In Progress", priority: "Medium", assignedUser: "Sarah Chen", dueDate: "2024-04-20", projectId: "p4", projectName: "Data Pipeline", createdAt: "2024-03-05", comments: [], history: [{ from: "To Do", to: "In Progress", changedAt: "2024-03-15T08:00:00Z", changedBy: "Sarah Chen" }] },
  { id: "t7", title: "Write API documentation", description: "Document all REST endpoints with examples", status: "To Do", priority: "Low", assignedUser: "Priya Patel", dueDate: "2024-04-30", projectId: "p3", projectName: "API Integration", createdAt: "2024-03-01", comments: [], history: [] },
  { id: "t8", title: "User onboarding flow", description: "Design and implement the new user onboarding experience", status: "In Progress", priority: "High", assignedUser: "Alex Rivera", dueDate: "2024-04-05", projectId: "p2", projectName: "Mobile App v2", createdAt: "2024-02-10", comments: [{ id: "c3", user: "Sarah Chen", text: "Should we add a skip option?", createdAt: "2024-03-22T09:30:00Z" }], history: [{ from: "To Do", to: "In Progress", changedAt: "2024-03-10T10:00:00Z", changedBy: "Alex Rivera" }] },
];
