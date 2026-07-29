'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_TRAINING_STATS,
  dateKeyFromDate,
  resolveMemberWorkout,
  type MemberTrainingStats,
  type ProgressEntry,
  type TrainingLevel,
} from '@/lib/portal/training-data';
import { todayClass, activeChallenges } from '@/lib/portal/mock-data';
import {
  getCurrentUser,
  getCurrentUserId,
  updatePortalUserTraining,
} from '@/lib/portal/users';

function scopedKey(base: string, userId: string | null) {
  return userId ? `${base}:${userId}` : base;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function computeStats(
  completed: string[],
  level: TrainingLevel,
): MemberTrainingStats {
  const completedSet = new Set(completed);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const day = today.getDay();
  const toMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + toMonday);

  let sessionsThisWeek = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    if (completedSet.has(dateKeyFromDate(d))) sessionsThisWeek += 1;
  }

  let streakDays = 0;
  const cursor = new Date(today);
  while (completedSet.has(dateKeyFromDate(cursor))) {
    streakDays += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  let weeksCompleted = DEFAULT_TRAINING_STATS.weeksCompleted;
  if (completed.length > 0) {
    weeksCompleted = 0;
    for (let w = 0; w < 8; w++) {
      const weekStart = new Date(monday);
      weekStart.setDate(monday.getDate() - w * 7);
      let count = 0;
      for (let i = 0; i < 7; i++) {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        if (completedSet.has(dateKeyFromDate(d))) count += 1;
      }
      if (count >= 3) weeksCompleted += 1;
    }
  }

  return {
    weeksCompleted,
    weeksGoal: 8,
    sessionsThisWeek,
    sessionsWeekGoal: 4,
    streakDays,
    level,
  };
}

function syncCrmSnapshot(
  userId: string,
  completed: string[],
  level: TrainingLevel,
) {
  const stats = computeStats(completed, level);
  const user = getCurrentUser();
  const joinedIds = new Set(user?.challengeIds || []);
  const challenges = activeChallenges.map((item) => ({
    ...item,
    joined: joinedIds.has(item.id),
  }));
  const workout = resolveMemberWorkout({
    dayClass: todayClass,
    challenges,
  });

  updatePortalUserTraining(userId, {
    trainingLevel: level,
    primaryClassName: workout.className,
    lastWorkoutTitle: workout.title,
    sessionsThisWeek: stats.sessionsThisWeek,
    streakDays: stats.streakDays,
    completedSessionsCount: completed.length,
  });
}

export function useTrainingProgress() {
  const [userId, setUserId] = useState<string | null>(null);
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [completedKeys, setCompletedKeys] = useState<string[]>([]);
  const [level, setLevelState] = useState<TrainingLevel>('intermedio');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = getCurrentUserId();
    setUserId(id);
    const user = getCurrentUser();
    const entriesKey = scopedKey('villanova_training_progress_v2', id);
    const completedKey = scopedKey('villanova_training_completed_v2', id);
    const levelKey = scopedKey('villanova_training_level_v2', id);

    const loadedCompleted = readJson<string[]>(completedKey, []);
    const loadedLevel = readJson<TrainingLevel>(
      levelKey,
      user?.trainingLevel || DEFAULT_TRAINING_STATS.level,
    );

    setEntries(readJson<ProgressEntry[]>(entriesKey, []));
    setCompletedKeys(loadedCompleted);
    setLevelState(loadedLevel);
    setReady(true);

    if (id) syncCrmSnapshot(id, loadedCompleted, loadedLevel);
  }, []);

  const completedSet = useMemo(() => new Set(completedKeys), [completedKeys]);

  const stats = useMemo(
    () => computeStats(completedKeys, level),
    [completedKeys, level],
  );

  const persistCompleted = useCallback(
    (next: string[]) => {
      writeJson(scopedKey('villanova_training_completed_v2', userId), next);
      setCompletedKeys(next);
      if (userId) syncCrmSnapshot(userId, next, level);
    },
    [userId, level],
  );

  const addEntry = useCallback(
    (input: Omit<ProgressEntry, 'id' | 'createdAt' | 'dateKey'> & { dateKey?: string }) => {
      const entry: ProgressEntry = {
        id: `pr_${Date.now().toString(36)}`,
        dateKey: input.dateKey || dateKeyFromDate(new Date()),
        exerciseId: input.exerciseId,
        exerciseName: input.exerciseName,
        weight: input.weight.trim(),
        reps: input.reps.trim(),
        notes: input.notes.trim(),
        createdAt: new Date().toISOString(),
      };
      setEntries((prev) => {
        const next = [entry, ...prev].slice(0, 80);
        writeJson(scopedKey('villanova_training_progress_v2', userId), next);
        return next;
      });
      if (userId) syncCrmSnapshot(userId, completedKeys, level);
      return entry;
    },
    [userId, completedKeys, level],
  );

  const removeEntry = useCallback(
    (id: string) => {
      setEntries((prev) => {
        const next = prev.filter((e) => e.id !== id);
        writeJson(scopedKey('villanova_training_progress_v2', userId), next);
        return next;
      });
    },
    [userId],
  );

  const toggleSessionComplete = useCallback(
    (dateKey: string) => {
      const has = completedKeys.includes(dateKey);
      const next = has
        ? completedKeys.filter((k) => k !== dateKey)
        : [...completedKeys, dateKey];
      persistCompleted(next);
    },
    [completedKeys, persistCompleted],
  );

  const markTodayComplete = useCallback(() => {
    const key = dateKeyFromDate(new Date());
    if (completedKeys.includes(key)) return;
    persistCompleted([...completedKeys, key]);
  }, [completedKeys, persistCompleted]);

  const setLevel = useCallback(
    (next: TrainingLevel) => {
      setLevelState(next);
      writeJson(scopedKey('villanova_training_level_v2', userId), next);
      if (userId) syncCrmSnapshot(userId, completedKeys, next);
    },
    [userId, completedKeys],
  );

  const todayCompleted = completedSet.has(dateKeyFromDate(new Date()));

  return {
    ready,
    entries,
    completedSet,
    completedKeys,
    stats,
    level,
    setLevel,
    addEntry,
    removeEntry,
    toggleSessionComplete,
    markTodayComplete,
    todayCompleted,
  };
}
