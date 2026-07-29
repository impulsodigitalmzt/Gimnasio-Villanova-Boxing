'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_TRAINING_STATS,
  dateKeyFromDate,
  type MemberTrainingStats,
  type ProgressEntry,
  type TrainingLevel,
} from '@/lib/portal/training-data';

const ENTRIES_KEY = 'villanova_training_progress_v1';
const COMPLETED_KEY = 'villanova_training_completed_v1';
const LEVEL_KEY = 'villanova_training_level_v1';

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

  // Semana actual (lunes–domingo)
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

  // Rachas hacia atrás desde hoy
  let streakDays = 0;
  const cursor = new Date(today);
  while (completedSet.has(dateKeyFromDate(cursor))) {
    streakDays += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  // Semanas con ≥3 sesiones en las últimas 8
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

export function useTrainingProgress() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [completedKeys, setCompletedKeys] = useState<string[]>([]);
  const [level, setLevelState] = useState<TrainingLevel>('intermedio');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEntries(readJson<ProgressEntry[]>(ENTRIES_KEY, []));
    setCompletedKeys(readJson<string[]>(COMPLETED_KEY, []));
    setLevelState(readJson<TrainingLevel>(LEVEL_KEY, 'intermedio'));
    setReady(true);
  }, []);

  const completedSet = useMemo(() => new Set(completedKeys), [completedKeys]);

  const stats = useMemo(
    () => computeStats(completedKeys, level),
    [completedKeys, level],
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
        writeJson(ENTRIES_KEY, next);
        return next;
      });
      return entry;
    },
    [],
  );

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id);
      writeJson(ENTRIES_KEY, next);
      return next;
    });
  }, []);

  const toggleSessionComplete = useCallback((dateKey: string) => {
    setCompletedKeys((prev) => {
      const has = prev.includes(dateKey);
      const next = has ? prev.filter((k) => k !== dateKey) : [...prev, dateKey];
      writeJson(COMPLETED_KEY, next);
      return next;
    });
  }, []);

  const markTodayComplete = useCallback(() => {
    const key = dateKeyFromDate(new Date());
    setCompletedKeys((prev) => {
      if (prev.includes(key)) return prev;
      const next = [...prev, key];
      writeJson(COMPLETED_KEY, next);
      return next;
    });
  }, []);

  const setLevel = useCallback((next: TrainingLevel) => {
    setLevelState(next);
    writeJson(LEVEL_KEY, next);
  }, []);

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
