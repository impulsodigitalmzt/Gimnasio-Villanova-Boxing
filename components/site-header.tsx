'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, UserRound } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { BrandLogo } from './brand-logo';
import { MobileNavMenu } from './mobile-nav-menu';
import { SocialLinks } from './social-links';
import { readStoredProfile } from '@/lib/portal/auth-session';
import { memberInitials } from '@/lib/portal/google-auth';
import { getCurrentUser, loadUsers } from '@/lib/portal/users';
import type { MemberProfile } from '@/lib/portal/types';

const navigation = [
  { href: '/quien-soy', label: 'Quién soy' },
  { href: '/gimnasio', label: 'Instalaciones' },
  { href: '/planes', label: 'Planes' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/tienda', label: 'Tienda' },
  { href: '/contacto', label: 'Contacto' },
];

function useMemberSession() {
  const [profile, setProfile] = useState<MemberProfile | null>(null);

  useEffect(() => {
    const sync = () => {
      loadUsers();
      const user = getCurrentUser();
      if (user) {
        setProfile({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          planId: user.planId,
          planName: user.planName,
          status: 'activa',
          expiresAt: user.expiresAt,
          memberSince: user.memberSince,
          lastPaymentAt: user.activatedAt,
          amountPaid: user.amountPaid,
          authProvider: user.authProvider,
        });
        return;
      }
      setProfile(readStoredProfile());
    };

    sync();
    window.addEventListener('villanova-member-session', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('villanova-member-session', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return profile;
}

export function SiteHeader({ cartSlot }: { cartSlot?: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const profile = useMemberSession();
  const loggedIn = Boolean(profile);
  const memberHref = loggedIn ? '/app' : '/app/login';

  return (
    <>
      <header className="site-header-safe fixed inset-x-0 top-0 z-50 border-b-[3px] border-brand/25 bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-3 px-5 sm:px-8">
          <BrandLogo className="min-w-0" imgClassName="size-9 sm:size-11" />

          <nav className="hidden items-center gap-7 lg:flex">
            {navigation.map((item) => {
              const active =
                pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-bold uppercase tracking-[0.12em] transition-colors ${
                    active ? 'text-brand' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-3">
            {cartSlot ? <div className="flex items-center">{cartSlot}</div> : null}

            <SocialLinks className="hidden sm:flex" />

            {loggedIn && profile ? (
              <Link
                href="/app"
                className="inline-flex items-center rounded-full transition-colors hover:bg-brand/20 xl:gap-2 xl:border xl:border-brand/50 xl:bg-brand/10 xl:py-1 xl:pl-1 xl:pr-3"
                aria-label={`Mi cuenta · ${profile.name}`}
                title={profile.name}
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-brand text-sm font-black text-black">
                  <span className="xl:hidden">{profile.name.trim().charAt(0).toUpperCase()}</span>
                  <span className="hidden xl:inline">{memberInitials(profile.name)}</span>
                </span>
                <span className="hidden max-w-[7rem] truncate text-[11px] font-bold uppercase tracking-wider text-brand-light xl:block">
                  {profile.name.split(' ')[0]}
                </span>
              </Link>
            ) : (
              <>
                <Link
                  href="/app/login"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-brand/60 bg-brand/10 px-2.5 text-brand-light transition-colors hover:border-brand hover:bg-brand/20 lg:hidden"
                  aria-label="Iniciar sesión / Acceso alumnos"
                >
                  <UserRound className="size-3.5 shrink-0" />
                  <span className="hidden text-[9px] font-black uppercase tracking-wider min-[360px]:inline">
                    Ingresar
                  </span>
                </Link>
                <Link
                  href="/app/login"
                  className="hidden max-w-[11rem] rounded-full border border-brand/50 bg-brand/10 px-3 py-2 text-brand-light transition-colors hover:border-brand hover:bg-brand/20 xl:max-w-none xl:px-4 xl:py-2.5 lg:inline-flex"
                  aria-label="Iniciar sesión / Acceso alumnos"
                >
                  <span className="block text-center text-[10px] font-black uppercase leading-tight tracking-wider xl:text-[11px]">
                    Iniciar sesión
                  </span>
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-full border border-white/15 p-2.5 text-white lg:hidden"
              aria-label="Abrir menú"
              aria-expanded={open}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileNavMenu
        open={open}
        onClose={() => setOpen(false)}
        memberHref={memberHref}
        memberLabel={loggedIn ? profile?.name.split(' ')[0] || 'Mi cuenta' : 'Iniciar Sesión / Acceso Alumnos'}
        loggedIn={loggedIn}
        memberInitial={loggedIn && profile ? memberInitials(profile.name) : undefined}
      />
    </>
  );
}
