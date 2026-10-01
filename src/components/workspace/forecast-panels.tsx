'use client';
import { CloudRain, Clock3, MapPin, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Badge, Range } from '@/components/ui';
import type { EarthEvent, Evidence, Forecast, Horizon, Scenario } from '@/data/types';
import { thresholdLabel, triggerProfile } from '@/lib/forecast';
export function HorizonControl({
  value,
  onChange,
  includeNow = true,
}: {
  value: Horizon;
  onChange: (n: Horizon) => void;
  includeNow?: boolean;
}) {
  return (
    <div className="horizon-control" aria-label="Forecast horizon">
      {(includeNow ? [0, 30, 60, 90] : [30, 60, 90]).map((n) => (
        <button
          key={n}
          className={value === n ? 'selected' : ''}
          aria-pressed={value === n}
          onClick={() => onChange(n as Horizon)}
        >
          {n === 0 ? 'NOW' : `+${n}D`}
        </button>
      ))}
    </div>
  );
}
export function ScenarioControls({
  scenario,
  onChange,
  onReset,
}: {
  scenario: Scenario;
  onChange: (s: Scenario) => void;
  onReset: () => void;
}) {
  return (
    <aside className="scenario-controls">
      <div className="panel-title">
        <SlidersHorizontal size={17} />
        <strong>What-If Lab</strong>
        <Badge type="FORECAST">SCENARIO</Badge>
      </div>
      <p className="fine-print">Change assumptions, then inspect the response.</p>
      <Range
        label="Rainfall intensity"
        value={scenario.rainfall}
        onChange={(rainfall) => onChange({ ...scenario, rainfall })}
        ends={['Normal', 'Extreme']}
        suffix=" / 100"
      />
      <Range
        label="Antecedent moisture"
        value={scenario.moisture}
        onChange={(moisture) => onChange({ ...scenario, moisture })}
        ends={['Dry', 'Saturated']}
        suffix=" / 100"
      />
      <Range
        label="Trend acceleration"
        value={scenario.acceleration}
        onChange={(acceleration) => onChange({ ...scenario, acceleration })}
        ends={['Continue trend', 'Accelerating']}
        suffix=" / 100"
      />
      <p className="fine-print scenario-rule">
        Rainfall and moisture change monitoring priority. Acceleration changes the trajectory. These
        indices are hypothetical inputs.
      </p>
      <button className="button small" onClick={onReset}>
        <RotateCcw size={14} /> Reset scenario
      </button>
    </aside>
  );
}
export function ForecastPanels({
  event,
  result,
  scenario,
  onEvidence,
  onArea,
}: {
  event: EarthEvent;
  result: Forecast;
  scenario: Scenario;
  onEvidence: (e: Evidence) => void;
  onArea: (id: string) => void;
}) {
  const profile = triggerProfile(scenario);
  return (
    <div className="forecast-modules">
      <section className="trigger-panel">
        <div className="panel-title">
          <CloudRain size={19} />
          <h3>Trigger Engine</h3>
          <Badge type="CONTEXTUAL" />
        </div>
        <p className="eyebrow muted">NEXT / 0–10 DAYS · SIMULATED</p>
        <div
          className="trigger-bars"
          role="img"
          aria-label={`Synthetic trigger intensity peaks on day 5 at ${profile[4].intensity} out of 100. Not a weather forecast.`}
        >
          {profile.map((p) => (
            <div key={p.day}>
              <div
                style={{ height: `${12 + p.intensity}px` }}
                title={`Day ${p.day}: ${p.intensity}/100`}
              />
              <span>{p.day}</span>
            </div>
          ))}
        </div>
        <p>
          Peak trigger window: <strong>days 4–6</strong>
        </p>
        <p className="fine-print">
          Rainfall / moisture sensitivity index, not rainfall in mm. No weather feed connected.
        </p>
        <button className="text-button" onClick={() => onEvidence(event.evidence[3])}>
          Inspect trigger assumptions
        </button>
      </section>
      <section className="threshold-panel">
        <div className="panel-title">
          <Clock3 size={19} />
          <h3>Time to Threshold</h3>
        </div>
        <p className="eyebrow muted">SOON / MEASUREMENT SCENARIO</p>
        <strong className="threshold-number">{thresholdLabel(result)}</strong>
        <p>
          Potential window to{' '}
          <strong>
            {event.threshold} {event.unit}
          </strong>
        </p>
        <p className="fine-print">
          {event.variable}. Range spans the sensitivity envelope and is censored at 90 days. It does
          not describe a hazard date.
        </p>
        <Badge type="FORECAST">RESEARCH SCENARIO · NOT A HAZARD PREDICTION</Badge>
        <button className="text-button" onClick={() => onEvidence(event.evidence[4])}>
          How the window is calculated
        </button>
      </section>
      <section className="hotspot-panel">
        <div className="panel-title">
          <MapPin size={19} />
          <h3>Future Hotspots</h3>
        </div>
        <p className="eyebrow muted">WATCH AREAS · SYNTHETIC BOUNDARIES</p>
        <div className="hotspot-list">
          {[...event.watchAreas]
            .sort((a, b) => b.sensitivity - a.sensitivity)
            .map((area, i) => (
              <button key={area.id} onClick={() => onArea(area.id)}>
                <span className="hotspot-number">0{i + 1}</span>
                <span>
                  <strong>{area.name}</strong>
                  <small>
                    {result.score * area.sensitivity >= 50
                      ? 'Priority review'
                      : 'Continue monitoring'}
                  </small>
                </span>
                <MapPin size={15} />
              </button>
            ))}
        </div>
        <p className="fine-print">
          Experimental rule: temporal persistence + selected triggers + trend assumption. Rank is
          not a hazard probability.
        </p>
      </section>
    </div>
  );
}
