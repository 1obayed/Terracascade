'use client';
import { useState } from 'react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import type { EarthEvent, Evidence, Forecast, Scenario } from '@/data/types';
import {
  PREVIEW_LABEL,
  SCENARIO_SUGGESTIONS,
  compareSuggestion,
  previewInsights,
  type SuggestionId,
} from '@/lib/ai-preview';
import { formatValue } from '@/lib/forecast';

export function ScenarioSuggestions({
  event,
  scenario,
  onApply,
}: {
  event: EarthEvent;
  scenario: Scenario;
  onApply: (scenario: Scenario) => void;
}) {
  const [selection, setSelection] = useState<SuggestionId>('wetter');
  const comparison = compareSuggestion(event, scenario, selection);
  const unchanged = JSON.stringify(comparison.scenario) === JSON.stringify(scenario);
  const suggestion = SCENARIO_SUGGESTIONS.find((item) => item.id === selection)!;
  return (
    <div className="ai-scenarios">
      <h3>Try a different assumption</h3>
      <p className="fine-print">
        Preset suggestions for the planned AI experience. Review the effect before applying.
      </p>
      <div className="ai-preset-buttons" aria-label="Scenario suggestions">
        {SCENARIO_SUGGESTIONS.map((item) => (
          <button
            key={item.id}
            aria-pressed={selection === item.id}
            onClick={() => setSelection(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="ai-comparison" aria-live="polite" aria-atomic="true">
        <p>{suggestion.detail}</p>
        <dl>
          <div>
            <dt>Projected value · +{scenario.horizon}D</dt>
            <dd>
              {formatValue(comparison.before.points.at(-1)!.value)} →{' '}
              {formatValue(comparison.after.points.at(-1)!.value)} {event.unit}
            </dd>
          </div>
          <div>
            <dt>Monitoring index · current → suggested</dt>
            <dd>
              {comparison.before.score} → {comparison.after.score} / 100
            </dd>
          </div>
        </dl>
        <button
          className="button small dark"
          disabled={unchanged}
          onClick={() => onApply(comparison.scenario)}
        >
          {unchanged ? <Check size={15} /> : <ArrowRight size={15} />}{' '}
          {unchanged ? 'Matches current settings' : 'Apply suggested scenario'}
        </button>
      </div>
    </div>
  );
}

export function AIPreview({
  event,
  result,
  scenario,
  onEvidence,
  onApply,
  onAsk,
}: {
  event: EarthEvent;
  result: Forecast;
  scenario: Scenario;
  onEvidence: (e: Evidence) => void;
  onApply: (s: Scenario) => void;
  onAsk: () => void;
}) {
  return (
    <section className="ai-preview-panel" aria-labelledby="ai-preview-title">
      <div className="ai-preview-heading">
        <div>
          <p className="eyebrow violet">
            <Sparkles size={16} /> ANTICIPATE / INTERPRETATION
          </p>
          <h2 id="ai-preview-title">Make sense of the possible.</h2>
        </div>
        <span className="ai-preview-badge">{PREVIEW_LABEL}</span>
      </div>
      <p className="ai-disclosure">
        A preview of the planned AI assistant, using local explanation rules and illustrative
        evidence. No AI model is connected. Projections come from TerraCast’s statistical model.
      </p>
      <div className="ai-insights" aria-live="polite" aria-atomic="true">
        {previewInsights(event, result, scenario).map((insight) => (
          <article key={insight.title}>
            <h3>{insight.title}</h3>
            <p>{insight.text}</p>
            <div className="answer-sources">
              {insight.evidence.map((i) => (
                <button key={event.evidence[i].id} onClick={() => onEvidence(event.evidence[i])}>
                  {event.evidence[i].label}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
      <ScenarioSuggestions event={event} scenario={scenario} onApply={onApply} />
      <button className="text-link" onClick={onAsk}>
        <Sparkles size={16} /> Explore with Ask Terra
      </button>
    </section>
  );
}
