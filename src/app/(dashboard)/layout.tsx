import React from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { DashboardSidebar } from '@/modules/auth/ui/components/dashboard-sidebar';
import { DashboardNavBar } from '@/modules/auth/ui/components/dashboard-navbar';
interface Props {
  children: React.ReactNode;
}

const layout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="flex flex-col h-screen w-screen bg-muted">
        <DashboardNavBar/>
        {children}
      </main>
    </SidebarProvider>
  )
}

export default layout
