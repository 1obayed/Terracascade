'use client';
import type { EarthEvent, Evidence, Forecast } from '@/data/types';
import { Badge } from '@/components/ui';
import { ChevronDown, Info } from 'lucide-react';
export function Cascade({
  event,
  result,
  onEvidence,
}: {
  event: EarthEvent;
  result: Forecast;
  onEvidence: (e: Evidence) => void;
}) {
  return (
    <section className="cascade-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow teal">UNDERSTANDING ENGINE</p>
          <h2>Follow the chain.</h2>
        </div>
        <span className="helper">Select a node to inspect its evidence.</span>
      </div>
      <div className="cascade-flow">
        {event.evidence.map((e, i) => (
          <div key={e.id} className="cascade-node-wrap">
            <button className="cascade-node" onClick={() => onEvidence(e)}>
              <div>
                <Badge type={e.type} />
              </div>
              <h3>
                {i === 0
                  ? `${event.product} surface signal`
                  : i === 4
                    ? `${result.priority} watch area`
                    : e.label}
              </h3>
              <p>
                {i === 0
                  ? 'Illustrative NISAR observation history'
                  : i === 1
                    ? 'A repeatable pattern in the demonstration series'
                    : i === 2
                      ? 'Supporting context; not the detection source'
                      : i === 3
                        ? 'Hypothetical 0–10 day trigger window'
                        : 'Conditional trajectory + contextual sensitivity'}
              </p>
              <span className="node-evidence">
                <Info size={13} /> Evidence & assumptions
              </span>
            </button>
            {i < event.evidence.length - 1 && (
              <ChevronDown className="cascade-connector" size={18} />
            )}
          </div>
        ))}
      </div>
      <p className="fine-print">
        A chain of evidence does not establish causation. Each transition depends on the assumptions
        shown in its source record.
      </p>
    </section>
  );
}
