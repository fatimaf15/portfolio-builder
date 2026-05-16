'use client';

import React from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import MobileNav from '../../components/dashboard/MobileNav';
import TopNavbar from '../../components/dashboard/TopNavbar';
import { DashboardProvider } from '../../context/DashboardContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="flex min-h-screen bg-zinc-950 text-white">
        {/* Responsive, collapsible Sidebar navigation */}
        <Sidebar />

        {/* Core page workflow frame */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Action-header dashboard controls */}
          <TopNavbar />

          {/* Core sub-route layout injection slot */}
          <div className="flex-grow pb-20 md:pb-0">
            {children}
          </div>

          {/* Bottom nav for mobile users */}
          <MobileNav />
        </div>
      </div>
    </DashboardProvider>
  );
}
