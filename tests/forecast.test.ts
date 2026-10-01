import { describe, it, expect } from 'vitest';
import { EVENTS, DEFAULT_SCENARIO } from '../src/data/catalog';
import { forecast, daysBetween, thresholdLabel } from '../src/lib/forecast';
import { explain } from '../src/lib/explain';
const event = EVENTS[0];
describe('TerraCast scientific invariants', () => {
  it('anchors NOW at the latest observation', () => {
    const f = forecast(event, { ...DEFAULT_SCENARIO, horizon: 0 });
    expect(f.points).toHaveLength(1);
    expect(f.points[0].value).toBe(-27);
  });
  it('uses real day differences instead of array indices', () => {
    expect(daysBetween('2026-08-19', '2026-09-24')).toBe(36);
    const f = forecast(event, DEFAULT_SCENARIO);
    expect(f.slope).toBeCloseTo(-0.6527777778);
    expect(f.points.at(-1)!.value).toBeCloseTo(-66.1666666667);
  });
  it('widens the envelope as the horizon grows', () => {
    const f = forecast(event, { ...DEFAULT_SCENARIO, horizon: 90 });
    const widths = f.points.map((p) => p.upper - p.lower);
    expect(widths.every((w, i) => i === 0 || w >= widths[i - 1])).toBe(true);
  });
  it('keeps rainfall separate from surface displacement', () => {
    const low = forecast(event, { ...DEFAULT_SCENARIO, rainfall: 0 });
    const high = forecast(event, { ...DEFAULT_SCENARIO, rainfall: 100 });
    expect(low.points).toEqual(high.points);
    expect(high.score).toBeGreaterThan(low.score);
  });
  it('changes the conditional trajectory when acceleration is selected', () => {
    const baseline = forecast(event, DEFAULT_SCENARIO);
    const accelerated = forecast(event, { ...DEFAULT_SCENARIO, acceleration: 100 });
    expect(accelerated.points.at(-1)!.value).toBeLessThan(baseline.points.at(-1)!.value);
  });
  it('uses upward threshold logic for glacier offsets', () => {
    const f = forecast(EVENTS[3], DEFAULT_SCENARIO);
    expect(f.slope).toBeGreaterThan(0);
    expect(f.thresholdWindow[0]).not.toBeNull();
    expect(f.thresholdWindow[1]).toBeGreaterThanOrEqual(f.thresholdWindow[0]!);
  });
  it('does not invent a date for a threshold beyond the model horizon', () => {
    const f = forecast({ ...event, threshold: -10000 }, DEFAULT_SCENARIO);
    expect(f.thresholdWindow).toEqual([null, null]);
    expect(thresholdLabel(f)).toBe('Beyond 90 days');
  });
  it('recognizes thresholds already crossed', () => {
    const f = forecast({ ...event, threshold: -10 }, DEFAULT_SCENARIO);
    expect(f.thresholdWindow).toEqual([0, 0]);
  });
  it.each([NaN, Infinity, -1, 101])('rejects invalid scenario intensity %s', (rainfall) => {
    expect(() => forecast(event, { ...DEFAULT_SCENARIO, rainfall })).toThrow();
  });
  it('rejects duplicate timestamps and insufficient history', () => {
    expect(() =>
      forecast(
        {
          ...event,
          observations: [event.observations[0], event.observations[0], event.observations[1]],
        },
        DEFAULT_SCENARIO,
      ),
    ).toThrow();
    expect(() =>
      forecast({ ...event, observations: event.observations.slice(0, 2) }, DEFAULT_SCENARIO),
    ).toThrow();
  });
  it('rejects nonfinite data and invalid dates', () => {
    expect(() =>
      forecast(
        {
          ...event,
          observations: event.observations.map((o, i) => (i === 0 ? { ...o, value: NaN } : o)),
        },
        DEFAULT_SCENARIO,
      ),
    ).toThrow();
    expect(() =>
      forecast(
        {
          ...event,
          observations: event.observations.map((o, i) => (i === 0 ? { ...o, date: 'invalid' } : o)),
        },
        DEFAULT_SCENARIO,
      ),
    ).toThrow();
  });
  it('handles a flat series without a divide-by-zero', () => {
    const f = forecast(
      { ...event, observations: event.observations.map((o) => ({ ...o, value: 5 })) },
      DEFAULT_SCENARIO,
    );
    expect(f.slope).toBe(0);
    expect(f.points.every((p) => Number.isFinite(p.lower) && Number.isFinite(p.upper))).toBe(true);
  });
});
describe('Evidence integrity', () => {
  it.each(EVENTS)('keeps $id synthetic and NISAR first', (e) => {
    expect(e.status).toBe('ILLUSTRATIVE');
    expect(e.evidence[0].source).toContain('NISAR');
    expect(
      e.evidence.every(
        (v) =>
          v.status === 'ILLUSTRATIVE' &&
          v.source &&
          v.method &&
          v.limitation &&
          v.sourceUrl.startsWith('https://'),
      ),
    ).toBe(true);
    expect(e.observations).toHaveLength(4);
  });
  it('explains the selected observation and uncertainty without fake probabilities', () => {
    const f = forecast(event, DEFAULT_SCENARIO);
    const answer = explain('What changed here?', event, f, DEFAULT_SCENARIO, 'see', 0);
    expect(answer.text).toContain('-4.0');
    expect(answer.text).toContain('2026-08-19');
    expect(answer.text).toContain('illustrative');
    const uncertainty = explain(
      'Why is the forecast uncertain?',
      event,
      f,
      DEFAULT_SCENARIO,
      'anticipate',
      3,
    );
    expect(uncertainty.text).toContain('not a calibrated confidence interval');
  });
  it('declines unsupported general questions', () => {
    expect(
      explain(
        'Write me a song',
        event,
        forecast(event, DEFAULT_SCENARIO),
        DEFAULT_SCENARIO,
        'see',
        3,
      ).text,
    ).toContain('no general-purpose language model');
  });
  it('returns an explicit scenario action for a heavy-rain request', () => {
    expect(
      explain(
        'Show heavy rain',
        event,
        forecast(event, DEFAULT_SCENARIO),
        DEFAULT_SCENARIO,
        'anticipate',
        3,
      ).action,
    ).toBe(true);
  });
});
