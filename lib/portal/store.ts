'use client';

import { useCallback, useEffect, useState } from 'react';
import { MEMBER_PROFILE_KEY, type Challenge, type MemberProfile } from '@/lib/portal/types';
import {
  activeChallenges as seedChallenges,
  createDemoMember,
} from '@/lib/portal/mock-data';
import {
  enrollPortalUserChallenge,
  getCurrentUser,
  getCurrentUserId,
  loadUsers,
  membershipToPortalStatus,
  saveUsers,
  setCurrentUserId,
  userToMemberProfile,
} from '@/lib/portal/users';
import { restoreSessionFromLocalStorage, persistMemberSession } from '@/lib/portal/auth-session';
import { getSubscriptionPlan } from '@/lib/portal/subscription-plans';

const CHALLENGES_KEY = 'villanova_member_challenges_v3';

type ChallengesByUser = Record<string, string[]>;

function readChallengeMap(): ChallengesByUser {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(CHALLENGES_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ChallengesByUser;
  } catch {
    return {};
  }
}

function writeChallengeMap(map: ChallengesByUser) {
  window.localStorage.setItem(CHALLENGES_KEY, JSON.stringify(map));
}

/** Catálogo de retos con `joined` según el alumno actual (CRM + local). */
function loadChallengesForUser(userId: string | null): Challenge[] {
  const fromUser = userId ? getCurrentUser()?.challengeIds || [] : [];
  const fromMap = userId ? readChallengeMap()[userId] || [] : [];
  const joinedIds = new Set([...fromUser, ...fromMap]);
  return seedChallenges.map((item) => ({
    ...item,
    joined: joinedIds.has(item.id),
  }));
}

function resolveProfile(): MemberProfile | null {
  loadUsers();

  const restored = restoreSessionFromLocalStorage();
  if (restored) return restored;

  const fromDb = getCurrentUser();
  if (fromDb) {
    persistMemberSession(fromDb);
    return userToMemberProfile(fromDb);
  }

  return null;
}

export function useMemberPortal() {
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>(seedChallenges);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    const nextProfile = resolveProfile();
    setProfile(nextProfile);
    setChallenges(loadChallengesForUser(nextProfile?.id || getCurrentUserId()));
  }, []);

  useEffect(() => {
    refresh();
    setReady(true);

    const onStorage = (event: StorageEvent) => {
      if (
        event.key === MEMBER_PROFILE_KEY ||
        event.key === 'villanova_portal_users_v1' ||
        event.key === 'villanova_portal_current_user_id' ||
        event.key === CHALLENGES_KEY
      ) {
        refresh();
      }
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('villanova-member-session', refresh);
    window.addEventListener('villanova-portal-users-updated', refresh);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('villanova-member-session', refresh);
      window.removeEventListener('villanova-portal-users-updated', refresh);
    };
  }, [refresh]);

  const persistProfile = useCallback((next: MemberProfile) => {
    window.localStorage.setItem(MEMBER_PROFILE_KEY, JSON.stringify(next));
    setProfile(next);

    const users = loadUsers();
    const idx = users.findIndex((u) => u.email.toLowerCase() === next.email.toLowerCase());
    if (idx >= 0) {
      users[idx] = {
        ...users[idx],
        name: next.name,
        phone: next.phone ?? users[idx].phone,
        planId: next.planId,
        planName: next.planName,
        status: membershipToPortalStatus(next.status),
        expiresAt: next.expiresAt === 'Pendiente de pago' ? '—' : next.expiresAt,
        memberSince: next.memberSince,
      };
      saveUsers(users);
      setCurrentUserId(users[idx].id);
    }
  }, []);

  const activateMembership = useCallback(() => {
    const base =
      getCurrentUser()
        ? userToMemberProfile(getCurrentUser()!)
        : restoreSessionFromLocalStorage() ?? createDemoMember();
    const plan = getSubscriptionPlan(base.planId || 'individual');
    const next: MemberProfile = {
      ...base,
      planId: plan.id,
      planName: plan.name,
      status: 'activa',
      expiresAt: base.expiresAt || '15/08/2026',
    };
    persistProfile(next);
    return next;
  }, [persistProfile]);

  const markExpired = useCallback(() => {
    const base = restoreSessionFromLocalStorage() ?? createDemoMember();
    persistProfile({ ...base, status: 'vencida' });
  }, [persistProfile]);

  const markActive = useCallback(() => {
    const base = restoreSessionFromLocalStorage() ?? createDemoMember();
    persistProfile({ ...base, status: 'activa', expiresAt: '15/08/2026' });
  }, [persistProfile]);

  const joinChallenge = useCallback(
    (id: string) => {
      const userId = getCurrentUserId() || profile?.id;
      if (!userId) return;

      const map = readChallengeMap();
      const current = new Set(map[userId] || []);
      current.add(id);
      map[userId] = [...current];
      writeChallengeMap(map);

      enrollPortalUserChallenge(userId, id);
      setChallenges(loadChallengesForUser(userId));
    },
    [profile?.id],
  );

  return {
    ready,
    profile,
    challenges,
    persistProfile,
    activateMembership,
    markExpired,
    markActive,
    joinChallenge,
  };
}
