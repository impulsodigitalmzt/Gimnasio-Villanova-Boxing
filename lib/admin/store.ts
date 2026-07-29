import {
  createSeedDatabase,
  type AdminDatabase,
  type AgendaClass,
  type Member,
  type Product,
  type Wod,
} from '@/lib/admin/types';
import { activateUserAfterPayment, loadUsers, updatePortalUserStatus } from '@/lib/portal/users';
import {
  portalIdFromAdminMemberId,
  syncPortalUsersToAdmin,
} from '@/lib/portal/sync-admin';
import { expiryLabelFromPayment, resolveAdminStatusFromExpiry } from '@/lib/portal/membership-lifecycle';

const STORAGE_KEY = 'villanova-admin-db-v6';
const LATENCY_MS = 420;

type Listener = () => void;

let memoryDb: AdminDatabase | null = null;
const listeners = new Set<Listener>();

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function cloneDb(db: AdminDatabase): AdminDatabase {
  return structuredClone(db);
}

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function readStorage(): AdminDatabase | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminDatabase;
    if (!parsed?.version || !Array.isArray(parsed.members)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStorage(db: AdminDatabase) {
  memoryDb = db;
  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }
  listeners.forEach((listener) => listener());
}

function applyExpiryStatuses(db: AdminDatabase) {
  db.members = db.members.map((member) => ({
    ...member,
    status: resolveAdminStatusFromExpiry(member.expiresAt, member.status),
  }));
}

function ensureDb(): AdminDatabase {
  if (memoryDb) return memoryDb;
  const stored = readStorage();
  memoryDb = stored ?? createSeedDatabase();
  if (!stored && canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryDb));
  }
  // Une registros del Portal del Socio (mismo localStorage)
  if (canUseStorage()) {
    try {
      syncPortalUsersToAdmin(loadUsers());
      const merged = readStorage();
      if (merged) memoryDb = merged;
    } catch {
      // ignore sync errors in demo
    }
  }
  applyExpiryStatuses(memoryDb);
  return memoryDb;
}

/** Fuerza relectura + sync portal → admin (útil al abrir Socios). */
export function refreshAdminDbFromStorage() {
  memoryDb = null;
  return getAdminDbSnapshot();
}

async function withLatency<T>(work: () => T): Promise<T> {
  await new Promise((resolve) => window.setTimeout(resolve, LATENCY_MS));
  return work();
}

function mutate(updater: (draft: AdminDatabase) => void): AdminDatabase {
  const next = cloneDb(ensureDb());
  updater(next);
  writeStorage(next);
  return next;
}

export function subscribeAdminDb(listener: Listener) {
  listeners.add(listener);
  if (typeof window !== 'undefined') {
    const onExternal = () => {
      memoryDb = readStorage() ?? memoryDb;
      listener();
    };
    window.addEventListener('villanova-admin-db-updated', onExternal);
    window.addEventListener('villanova-portal-users-updated', onExternal);
    const originalRemove = () => {
      listeners.delete(listener);
      window.removeEventListener('villanova-admin-db-updated', onExternal);
      window.removeEventListener('villanova-portal-users-updated', onExternal);
    };
    return originalRemove;
  }
  return () => {
    listeners.delete(listener);
  };
}

export function getAdminDbSnapshot(): AdminDatabase {
  return cloneDb(ensureDb());
}

export function computeMemberStats(db: AdminDatabase) {
  const active = db.members.filter((m) => m.status === 'activo').length;
  const soon = db.members.filter((m) => m.status === 'por_vencer').length;
  const overdue = db.members.filter((m) => m.status === 'vencido').length;
  const pending = db.pendingUsers.length;
  return {
    active,
    soon,
    overdue,
    pending,
    newThisMonth: db.newThisMonth,
  };
}

export function computeDashboardStats(db: AdminDatabase) {
  const stats = computeMemberStats(db);
  return {
    activeMembers: stats.active,
    packagesToday: db.todayPackages.length,
    newThisMonth: db.newThisMonth,
    reservationsToday: db.reservationsToday,
  };
}

export async function activatePendingUser(id: string) {
  return withLatency(() => {
    let portalId = portalIdFromAdminMemberId(id);

    mutate((db) => {
      const index = db.pendingUsers.findIndex((u) => u.id === id);
      if (index < 0) return;
      const [user] = db.pendingUsers.splice(index, 1);
      const expiresAt = expiryLabelFromPayment();
      const activated = {
        ...user,
        id: user.id.startsWith('portal_') ? user.id : uid('m'),
        status: 'activo' as const,
        expiresAt,
      };
      db.members = db.members.filter((m) => m.id !== user.id && m.email !== user.email);
      db.members.unshift(activated);
      db.newThisMonth += 1;
      portalId = portalIdFromAdminMemberId(activated.id) ?? portalId;
    });

    if (portalId) {
      activateUserAfterPayment(portalId);
    }
  });
}

export async function updateMemberStatus(id: string, status: Member['status']) {
  return withLatency(() => {
    mutate((db) => {
      const member = db.members.find((m) => m.id === id);
      if (member) member.status = status;
    });

    const portalId = portalIdFromAdminMemberId(id);
    if (portalId) {
      const portalStatus =
        status === 'activo' || status === 'por_vencer'
          ? 'activo'
          : status === 'pendiente'
            ? 'pendiente'
            : 'vencido';
      updatePortalUserStatus(portalId, portalStatus);
    }
  });
}

export async function createProduct(input: {
  name: string;
  stock: number;
  price: number;
  public: boolean;
}) {
  return withLatency(() =>
    mutate((db) => {
      db.products.unshift({
        id: uid('pr'),
        name: input.name,
        stock: input.stock,
        price: input.price,
        public: input.public,
        modifiedBy: 'Admin Villanova',
        image: '/logo_negro.png',
        active: true,
      });
    }),
  );
}

export async function updateProduct(
  id: string,
  patch: Partial<Pick<Product, 'name' | 'stock' | 'price' | 'public' | 'active'>>,
) {
  return withLatency(() =>
    mutate((db) => {
      const product = db.products.find((p) => p.id === id);
      if (!product) return;
      Object.assign(product, patch, { modifiedBy: 'Admin Villanova' });
    }),
  );
}

export async function deleteProduct(id: string) {
  return withLatency(() =>
    mutate((db) => {
      const product = db.products.find((p) => p.id === id);
      if (product) product.active = false;
    }),
  );
}

export async function restoreProduct(id: string) {
  return withLatency(() =>
    mutate((db) => {
      const product = db.products.find((p) => p.id === id);
      if (product) product.active = true;
    }),
  );
}

export async function createWod(input: Omit<Wod, 'id' | 'marks'> & { marks?: number }) {
  return withLatency(() =>
    mutate((db) => {
      db.wods.unshift({
        id: uid('w'),
        date: input.date,
        title: input.title,
        exercises: input.exercises,
        marks: input.marks ?? 0,
      });
    }),
  );
}

export async function updateWod(id: string, patch: Partial<Omit<Wod, 'id'>>) {
  return withLatency(() =>
    mutate((db) => {
      const wod = db.wods.find((w) => w.id === id);
      if (wod) Object.assign(wod, patch);
    }),
  );
}

export async function deleteWod(id: string) {
  return withLatency(() =>
    mutate((db) => {
      db.wods = db.wods.filter((w) => w.id !== id);
    }),
  );
}

export async function createAgendaClass(input: Omit<AgendaClass, 'id' | 'enrolled'> & { enrolled?: number }) {
  return withLatency(() =>
    mutate((db) => {
      db.agendaClasses.push({
        id: uid('a'),
        day: input.day,
        time: input.time,
        name: input.name,
        enrolled: input.enrolled ?? 0,
        capacity: input.capacity,
      });
      const day = db.agendaDays[input.day];
      if (day) day.reservations += input.enrolled ?? 0;
      db.reservationsToday += input.enrolled ?? 0;
    }),
  );
}

export async function deleteAgendaClass(id: string) {
  return withLatency(() =>
    mutate((db) => {
      const cls = db.agendaClasses.find((c) => c.id === id);
      if (!cls) return;
      db.agendaClasses = db.agendaClasses.filter((c) => c.id !== id);
      const day = db.agendaDays[cls.day];
      if (day) day.reservations = Math.max(0, day.reservations - cls.enrolled);
    }),
  );
}

/** Reinicia la base local al dataset inicial (uso interno / soporte). */
export async function resetAdminDatabase() {
  return withLatency(() => {
    const seed = createSeedDatabase();
    writeStorage(seed);
    return seed;
  });
}

// Compat con imports antiguos de mock-data
export {
  adminUser,
  type Member,
  type MemberStatus,
  type Product,
  type Wod,
  type AgendaClass,
  type TodayClass,
  type TodayPackage,
  type Birthday,
} from '@/lib/admin/types';
