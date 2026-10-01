'use client';
import { useEffect, useMemo, useState } from 'react';
import { forecast } from './forecast';
import type { EarthEvent, Forecast, Scenario } from '@/data/types';

function isForecast(value: unknown, expectedLength: number): value is Forecast {
  if (!value || typeof value !== 'object') return false;
  const f = value as Forecast;
  return (
    Array.isArray(f.points) &&
    f.points.length === expectedLength &&
    f.points.every(
      (p) =>
        [p.day, p.value, p.lower, p.upper].every(Number.isFinite) &&
        p.lower <= p.value &&
        p.value <= p.upper,
    ) &&
    [f.score, f.slope, f.spread, f.acceleration, f.persistence].every(Number.isFinite) &&
    f.score >= 0 &&
    f.score <= 100 &&
    ['Routine', 'Elevated', 'Priority review'].includes(f.priority) &&
    Array.isArray(f.thresholdWindow) &&
    f.thresholdWindow.length === 2 &&
    f.thresholdWindow.every((v) => v === null || (Number.isInteger(v) && v >= 0 && v <= 90)) &&
    typeof f.model === 'string'
  );
}

export function useForecast(event: EarthEvent, scenario: Scenario) {
  const local = useMemo(() => forecast(event, scenario), [event, scenario]);
  const [remote, setRemote] = useState<{ key: string; result: Forecast } | null>(null);
  const [serviceNote, setServiceNote] = useState('');
  const key = JSON.stringify([event.id, scenario]);
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_TERRACASCADE_API_URL;
    if (!base) return;
    const controller = new AbortController();
    let disposed = false;
    const timeout = setTimeout(() => controller.abort(), 5000);
    setServiceNote('Checking the configured scientific service…');
    fetch(`${base.replace(/\/$/, '')}/forecast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId: event.id, scenario }),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Service unavailable');
        const data = await response.json();
        if (
          data.dataStatus !== 'ILLUSTRATIVE' ||
          data.eventId !== event.id ||
          !isForecast(data.result, local.points.length)
        )
          throw new Error('Unexpected scientific response');
        if (!disposed) {
          setRemote({ key, result: data.result });
          setServiceNote('Scientific service connected · illustrative catalog');
        }
      })
      .catch(() => {
        if (!disposed)
          setServiceNote('Scientific service unavailable · using the bundled illustrative model.');
      })
      .finally(() => clearTimeout(timeout));
    return () => {
      disposed = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [event.id, key, scenario, local]);
  return { result: remote?.key === key ? remote.result : local, serviceNote };
}
