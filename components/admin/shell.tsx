'use client';

import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminTopbar } from '@/components/admin/topbar';
import { HelpDrawer, HelpProvider } from '@/components/help/help-drawer';
import { adminHelpContent } from '@/lib/admin/faq-data';
import '@/app/admin/admin.css';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <HelpProvider>
      <div className="admin-app flex min-h-screen">
        <div className="hidden lg:block">
          <div className="sticky top-0 h-screen">
            <AdminSidebar />
          </div>
        </div>

        {mobileOpen ? (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label="Cerrar menú"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative z-10 h-full shadow-2xl">
              <AdminSidebar onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar onMenuClick={() => setMobileOpen(true)} />
          <div className="admin-scrollbar flex-1 overflow-auto">{children}</div>
        </div>

        <HelpDrawer content={adminHelpContent} theme="admin" />
      </div>
    </HelpProvider>
  );
}
