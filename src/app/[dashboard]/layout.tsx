import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/modules/auth/ui/components/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <DashboardSidebar />

        <SidebarInset>
          <main className="h-full w-full bg-muted">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
