import type { EarthEvent, Forecast, ForecastPoint, Scenario } from '@/data/types';
export const daysBetween = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / 86400000;
export const median = (values: number[]) => {
  const a = [...values].sort((x, y) => x - y);
  return a.length ? (a[Math.floor((a.length - 1) / 2)] + a[Math.ceil((a.length - 1) / 2)]) / 2 : 0;
};
export function validateScenario(s: Scenario): void {
  if (
    ![s.rainfall, s.moisture, s.acceleration, s.horizon].every(Number.isFinite) ||
    s.rainfall < 0 ||
    s.rainfall > 100 ||
    s.moisture < 0 ||
    s.moisture > 100 ||
    s.acceleration < 0 ||
    s.acceleration > 100 ||
    ![0, 30, 60, 90].includes(s.horizon)
  )
    throw new Error('Scenario values are outside supported bounds.');
}
export function forecast(e: EarthEvent, s: Scenario): Forecast {
  validateScenario(s);
  const obs = e.observations;
  if (
    obs.length < 3 ||
    obs.some(
      (o, i) =>
        !Number.isFinite(o.value) ||
        !Number.isFinite(o.error) ||
        o.error < 0 ||
        !Number.isFinite(Date.parse(o.date)) ||
        (i > 0 && Date.parse(o.date) <= Date.parse(obs[i - 1].date)),
    )
  )
    throw new Error('At least three finite observations in chronological order are required.');
  const x = obs.map((o) => daysBetween(obs[0].date, o.date));
  const slopes: number[] = [];
  for (let i = 0; i < obs.length; i++)
    for (let j = i + 1; j < obs.length; j++)
      slopes.push((obs[j].value - obs[i].value) / (x[j] - x[i]));
  const slope = median(slopes),
    last = obs[obs.length - 1];
  const spread = Math.max(
    median(slopes.map((n) => Math.abs(n - slope))) * 1.4826,
    Math.abs(slope) * 0.12,
    last.error / (x[x.length - 1] || 1),
  );
  const acceleration = ((s.acceleration / 100) * slope) / 90;
  const point = (day: number): ForecastPoint => {
    const value = last.value + slope * day + 0.5 * acceleration * day * day;
    const envelope = last.error + spread * day + Math.abs(0.5 * acceleration * day * day) * 0.35;
    return { day, value, lower: value - envelope, upper: value + envelope };
  };
  const points = Array.from({ length: s.horizon / 3 + 1 }, (_, i) => point(i * 3));
  const persistence =
    obs.slice(1).filter((o, i) => Math.sign(o.value - obs[i].value) === Math.sign(slope)).length /
    (obs.length - 1);
  const score = Math.round(
    100 *
      (0.35 * persistence +
        (0.25 * s.rainfall) / 100 +
        (0.2 * s.moisture) / 100 +
        (0.2 * s.acceleration) / 100),
  );
  const crossed = (v: number) => (e.direction === 'negative' ? v <= e.threshold : v >= e.threshold);
  let early: number | null = null,
    late: number | null = null;
  for (let day = 0; day <= 90; day++) {
    const p = point(day);
    if (early === null && crossed(e.direction === 'negative' ? p.lower : p.upper)) early = day;
    if (late === null && crossed(e.direction === 'negative' ? p.upper : p.lower)) late = day;
  }
  return {
    points,
    slope,
    acceleration,
    persistence,
    spread,
    score,
    priority: score >= 65 ? 'Priority review' : score >= 45 ? 'Elevated' : 'Routine',
    thresholdWindow: [early, late],
    model: 'Theil–Sen trend + sensitivity envelope',
  };
}
export function thresholdLabel(f: Forecast) {
  const [a, b] = f.thresholdWindow;
  return a === null ? 'Beyond 90 days' : b === null ? `${a} to >90 days` : `${a}–${b} days`;
}
export function measuredAcceleration(e: EarthEvent) {
  const a = e.observations;
  const v = a.slice(1).map((o, i) => (o.value - a[i].value) / daysBetween(a[i].date, o.date));
  return (v[v.length - 1] - v[0]) / daysBetween(a[1].date, a[a.length - 1].date);
}
export function triggerProfile(s: Scenario) {
  return [0.12, 0.18, 0.35, 0.68, 1, 0.85, 0.5, 0.3, 0.18, 0.12].map((n, i) => ({
    day: i + 1,
    intensity: Math.round(n * s.rainfall * (0.6 + (0.4 * s.moisture) / 100)),
  }));
}
export function formatValue(value: number, digits = 1) {
  return new Intl.NumberFormat('en', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}
