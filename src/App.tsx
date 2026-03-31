import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LoadingSpinner } from "@/components/StatusComponents";
import PrivateRoute from "@/routes/PrivateRoute";
import RoleGuard from "@/components/RoleGuard";
import NotFound from "./pages/NotFound.tsx";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectTasksPage = lazy(() => import("./pages/ProjectTasksPage"));
const Tasks = lazy(() => import("./pages/Tasks"));
const TaskDetailsPage = lazy(() => import("./pages/TaskDetailsPage"));
const Workflows = lazy(() => import("./pages/Workflows"));
const Teams = lazy(() => import("./pages/Teams"));
const UsersPage = lazy(() => import("./pages/UsersPage"));
const ActivityLogs = lazy(() => import("./pages/ActivityLogs"));

const queryClient = new QueryClient();

const Fallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <LoadingSpinner />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppProvider>
              <Suspense fallback={<Fallback />}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
                  <Route path="/projects/:id" element={<PrivateRoute><ProjectTasksPage /></PrivateRoute>} />
                  <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
                  <Route path="/tasks/:id" element={<PrivateRoute><TaskDetailsPage /></PrivateRoute>} />
                  <Route path="/workflows" element={<PrivateRoute><Workflows /></PrivateRoute>} />
                  <Route path="/teams" element={<PrivateRoute><RoleGuard permission="viewTeamData" redirect><Teams /></RoleGuard></PrivateRoute>} />
                  <Route path="/users" element={<PrivateRoute><RoleGuard permission="manageUsers" redirect><UsersPage /></RoleGuard></PrivateRoute>} />
                  <Route path="/activity" element={<PrivateRoute><RoleGuard permission="viewActivityLogs" redirect><ActivityLogs /></RoleGuard></PrivateRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </AppProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
