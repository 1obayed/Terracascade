import type { WatchRecord } from '@/data/types';
import { EVENTS } from '@/data/catalog';
import { validateScenario } from './forecast';
export const WATCH_KEY = 'terracascade-watch-v1';
export function readWatches(): WatchRecord[] {
  const parsed: unknown = JSON.parse(localStorage.getItem(WATCH_KEY) || '[]');
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((v): v is WatchRecord => {
    if (
      !v ||
      typeof v !== 'object' ||
      !EVENTS.some((e) => e.id === v.eventId) ||
      typeof v.savedAt !== 'string' ||
      !Array.isArray(v.triggers)
    )
      return false;
    try {
      validateScenario(v.scenario);
      return v.triggers.every((t: unknown) => typeof t === 'string');
    } catch {
      return false;
    }
  });
}
export function saveWatches(records: WatchRecord[]) {
  localStorage.setItem(WATCH_KEY, JSON.stringify(records));
}
