'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  computeDashboardStats,
  computeMemberStats,
  getAdminDbSnapshot,
  refreshAdminDbFromStorage,
  subscribeAdminDb,
} from '@/lib/admin/store';
import { createSeedDatabase, type AdminDatabase } from '@/lib/admin/types';

export function useAdminDb() {
  const [db, setDb] = useState<AdminDatabase>(() => createSeedDatabase());
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setDb(refreshAdminDbFromStorage());
    setReady(true);
    return subscribeAdminDb(() => {
      setDb(getAdminDbSnapshot());
    });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const run = useCallback(async <T,>(action: () => Promise<T>, successMessage?: string) => {
    setBusy(true);
    try {
      const result = await action();
      if (successMessage) setToast(successMessage);
      return result;
    } finally {
      setBusy(false);
    }
  }, []);

  return {
    db,
    ready,
    busy,
    toast,
    setToast,
    run,
    stats: {
      dashboard: computeDashboardStats(db),
      members: computeMemberStats(db),
    },
  };
}
