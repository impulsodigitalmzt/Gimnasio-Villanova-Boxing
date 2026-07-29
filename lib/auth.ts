export const ADMIN_SESSION_COOKIE = 'villanova_admin_session';

/** Cookie de sesión demo (sin Supabase ni auth real). */
export function getAdminSessionToken() {
  return process.env.ADMIN_SESSION_SECRET || 'villanova-admin-dev-session';
}

export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || 'admin@villanovaboxing.mx',
    password: process.env.ADMIN_PASSWORD || 'villanovaadmin',
  };
}

export function isValidAdminSession(token: string | undefined | null) {
  if (!token) return false;
  return token === getAdminSessionToken();
}
