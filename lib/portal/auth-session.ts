/**
 * Sesión del Portal del Socio — 100% localStorage (PC + móvil mismo navegador).
 */

import { MEMBER_PROFILE_KEY, type MemberProfile } from '@/lib/portal/types';
import {
  CURRENT_USER_ID_KEY,
  USERS_STORAGE_KEY,
  authenticateUser,
  getCurrentUser,
  getUserByEmail,
  loadUsers,
  setCurrentUserId,
  userToMemberProfile,
  type PortalUser,
} from '@/lib/portal/users';

export { USERS_STORAGE_KEY, CURRENT_USER_ID_KEY, MEMBER_PROFILE_KEY };

/** Guarda perfil activo + id de sesión en localStorage. */
export function persistMemberSession(user: PortalUser) {
  if (typeof window === 'undefined') return;
  setCurrentUserId(user.id);
  const profile = userToMemberProfile(user);
  window.localStorage.setItem(MEMBER_PROFILE_KEY, JSON.stringify(profile));
  window.dispatchEvent(
    new CustomEvent('villanova-member-session', { detail: profile }),
  );
}

export function clearMemberSession() {
  if (typeof window === 'undefined') return;
  setCurrentUserId(null);
  window.localStorage.removeItem(MEMBER_PROFILE_KEY);
  window.dispatchEvent(new CustomEvent('villanova-member-session', { detail: null }));
}

export function readStoredProfile(): MemberProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(MEMBER_PROFILE_KEY);
    return raw ? (JSON.parse(raw) as MemberProfile) : null;
  } catch {
    return null;
  }
}

/**
 * Login contra la DB local de usuarios.
 * Devuelve null si el correo no existe o la contraseña no coincide.
 */
export function loginFromLocalStorage(email: string, password: string): PortalUser | null {
  // Asegura seed (Usuario Demo) en el device
  loadUsers();
  const user = authenticateUser(email, password);
  if (!user) return null;
  persistMemberSession(user);
  return user;
}

/** Restaura sesión desde localStorage (refresh / nueva pestaña). */
export function restoreSessionFromLocalStorage(): MemberProfile | null {
  const current = getCurrentUser();
  if (current) {
    const profile = userToMemberProfile(current);
    window.localStorage.setItem(MEMBER_PROFILE_KEY, JSON.stringify(profile));
    return profile;
  }

  const stored = readStoredProfile();
  if (!stored) return null;

  const byEmail = getUserByEmail(stored.email);
  if (byEmail) {
    persistMemberSession(byEmail);
    return userToMemberProfile(byEmail);
  }

  return stored;
}
