import type { EarthEvent, Forecast, Scenario } from '@/data/types';
import { forecast, formatValue } from './forecast';

export const PREVIEW_LABEL = 'AI preview · simulated responses';
export const SCENARIO_SUGGESTIONS = [
  {
    id: 'wetter',
    label: 'Explore wetter conditions',
    detail:
      'Rainfall 90/100 · moisture 80/100. Changes monitoring priority; the surface trajectory stays the same.',
  },
  {
    id: 'accelerating',
    label: 'Explore a faster trend',
    detail:
      'Trend acceleration 60/100. Tests an assumed continuation with acceleration; this is not a detected change.',
  },
  {
    id: 'steady',
    label: 'Continue the current trend',
    detail: 'Trend acceleration 0/100. Keeps your rainfall, moisture and forecast horizon.',
  },
] as const;
export type SuggestionId = (typeof SCENARIO_SUGGESTIONS)[number]['id'];

export function suggestedScenario(current: Scenario, id: SuggestionId): Scenario {
  switch (id) {
    case 'wetter':
      return { ...current, rainfall: 90, moisture: 80 };
    case 'accelerating':
      return { ...current, acceleration: 60 };
    case 'steady':
      return { ...current, acceleration: 0 };
  }
}

export function compareSuggestion(event: EarthEvent, current: Scenario, id: SuggestionId) {
  const scenario = suggestedScenario(current, id);
  return { scenario, before: forecast(event, current), after: forecast(event, scenario) };
}

export function previewInsights(event: EarthEvent, result: Forecast, scenario: Scenario) {
  const point = result.points.at(-1)!;
  return [
    {
      title: 'What the trajectory suggests',
      text: `For ${event.location}, the +${scenario.horizon}D scenario reaches ${formatValue(point.value)} ${event.unit} for ${event.variable.toLowerCase()}. This follows the illustrative ${event.product} history and your trend-acceleration setting of ${scenario.acceleration}/100.`,
      evidence: [0, 1, 4],
    },
    {
      title: 'Why the outcome is uncertain',
      text: `The sensitivity range is ${formatValue(point.lower)} to ${formatValue(point.upper)} ${event.unit}. It is not a calibrated confidence interval. Four synthetic observations cannot validate this forecast. ${event.limitations[0]}`,
      evidence: [0, 4],
    },
    {
      title: 'What deserves another look',
      text: `The current monitoring priority is ${result.priority.toLowerCase()} (${result.score}/100), using rainfall ${scenario.rainfall}/100 and moisture ${scenario.moisture}/100 as hypothetical context. Inspect the next observation for trend persistence and quality. This score is not a hazard probability.`,
      evidence: [1, 3, 4],
    },
  ];
}
