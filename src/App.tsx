import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "@/context/AppContext";
import { LoadingSpinner } from "@/components/StatusComponents";
import NotFound from "./pages/NotFound.tsx";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectTasksPage = lazy(() => import("./pages/ProjectTasksPage"));
const Tasks = lazy(() => import("./pages/Tasks"));
const TaskDetailsPage = lazy(() => import("./pages/TaskDetailsPage"));
const UsersPage = lazy(() => import("./pages/UsersPage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProvider>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectTasksPage />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/tasks/:id" element={<TaskDetailsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
