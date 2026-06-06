'use client';

import { useState } from 'react';
import { Menu, Shield } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <div className="mobile-topbar">
        <button className="hamburger" onClick={() => setSidebarOpen(true)}>
          <Menu size={22} />
        </button>
        <div className="sidebar-logo" style={{ fontSize: '1rem', gap: '6px' }}>
          <div className="sidebar-logo-icon" style={{ width: 28, height: 28 }}>
            <Shield size={14} />
          </div>
          BlotterHQ
        </div>
        <div style={{ width: 38 }} /> {/* Spacer for centering */}
      </div>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
