import { describe, it, expect } from 'vitest';
import { EVENTS, DEFAULT_SCENARIO } from '../src/data/catalog';
import { compareSuggestion, previewInsights, suggestedScenario } from '../src/lib/ai-preview';
import { forecast, formatValue } from '../src/lib/forecast';

describe('Simulated AI scenario suggestions', () => {
  it.each(EVENTS)(
    'wetter conditions preserve the $id trajectory while changing priority',
    (event) => {
      const comparison = compareSuggestion(event, DEFAULT_SCENARIO, 'wetter');
      expect(comparison.after.points).toEqual(comparison.before.points);
      expect(comparison.after.score).toBeGreaterThan(comparison.before.score);
      expect(comparison.scenario.horizon).toBe(DEFAULT_SCENARIO.horizon);
    },
  );
  it.each(EVENTS)('faster trend changes the $id projection and steady reverses it', (event) => {
    const faster = compareSuggestion(event, DEFAULT_SCENARIO, 'accelerating');
    expect(faster.after.points.at(-1)!.value).not.toBe(faster.before.points.at(-1)!.value);
    const steady = compareSuggestion(event, faster.scenario, 'steady');
    expect(steady.after.points).toEqual(faster.before.points);
  });
  it('preserves caller settings and does not mutate a scenario', () => {
    const original = Object.freeze({ ...DEFAULT_SCENARIO, horizon: 30 as const, rainfall: 12 });
    expect(suggestedScenario(original, 'accelerating')).toEqual({ ...original, acceleration: 60 });
    expect(original.acceleration).toBe(0);
  });
  it.each(EVENTS)('grounds $id insights in the active result and resolvable evidence', (event) => {
    const scenario = { ...DEFAULT_SCENARIO, horizon: 90 as const };
    const result = forecast(event, scenario);
    const insights = previewInsights(event, result, scenario);
    expect(insights[0].text).toContain(formatValue(result.points.at(-1)!.value));
    expect(insights[0].text).toContain('+90D');
    expect(insights[1].text).toContain('not a calibrated confidence interval');
    expect(insights[2].text).toContain(`${result.score}/100`);
    expect(
      insights.every((i) => i.evidence.every((index) => Boolean(event.evidence[index]?.id))),
    ).toBe(true);
  });
});
