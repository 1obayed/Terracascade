import type { EarthEvent, Forecast, Mode, Scenario } from '@/data/types';
import { formatValue, thresholdLabel } from './forecast';
export function explain(
  question: string,
  event: EarthEvent,
  result: Forecast,
  scenario: Scenario,
  mode: Mode,
  observation: number,
) {
  const q = question.toLowerCase().trim();
  const current = event.observations[observation];
  const preface = `At ${event.location}, the selected ${event.product} record is illustrative, not a verified NISAR measurement.`;
  const observationText = `${preface} The ${current.date} fixture is ${formatValue(current.value)} ${event.unit} (${event.variable.toLowerCase()}).`;
  if (/rain|storm/.test(q))
    return {
      text: `${observationText} A heavy-rain scenario raises the simulated trigger intensity. This changes the monitoring-priority rule; rainfall does not directly change the NISAR-derived trajectory. Use “Apply heavy rain” to set the scenario to 90/100.`,
      evidence: [0, 3, 4],
      action: true,
    };
  if (/uncertain|confiden|accur|reliab/.test(q))
    return {
      text: `${preface} TerraCast has only four synthetic observations, a short 36-day history, and an assumed measurement error. The ${scenario.horizon}-day projection assumes the trend continues. Its shaded envelope combines slope dispersion, a 12% trend-sensitivity floor, and assumed observation error; it is not a calibrated confidence interval. ${event.limitations[0]}`,
      evidence: [0, 1, 4],
    };
  if (/next|watch|monitor|forecast|threshold/.test(q))
    return {
      text: `${observationText} The derived median trend is ${formatValue(result.slope, 3)} ${event.unit}/day. Under the +${scenario.horizon}D scenario, the endpoint is ${formatValue(result.points.at(-1)!.value)} ${event.unit}. Monitoring priority is ${result.priority.toLowerCase()} under the illustrative trigger rule. The ${event.threshold} ${event.unit} measurement threshold has a sensitivity window of ${thresholdLabel(result).toLowerCase()}. The next demo checkpoint is ${event.nextCheckpoint}; it is not a scheduled acquisition or a hazard date.`,
      evidence: [0, 1, 3, 4],
    };
  if (/change|nisar|signal|support|why|evidence|area/.test(q))
    return {
      text: `${observationText} Across the complete synthetic history, the signal changes from ${event.observations[0].value} to ${event.observations.at(-1)!.value} ${event.unit}. The median trend is ${formatValue(result.slope, 3)} ${event.unit}/day. ${event.context.join(', ')} are supporting illustrative context. The ${mode.toUpperCase()} view keeps that context separate from the original radar signal. ${event.limitations[0]}`,
      evidence: [0, 1, 2],
    };
  return {
    text: `I can explain the selected ${event.product} signal, its provenance, the current scenario, monitoring priorities and uncertainty. This local evidence guide uses the structured ${event.name} record; it has no general-purpose language model or external search. Try “What changed here?” or “Why is this forecast uncertain?”`,
    evidence: [0],
  };
}
