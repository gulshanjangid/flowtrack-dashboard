import AppSidebar from "@/components/AppSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="md:ml-60 min-h-screen">
        {children}
      </main>
    </div>
  );
}
