'use client';
import type { Evidence, EarthEvent } from '@/data/types';
import { Badge, Modal } from '@/components/ui';
import { ExternalLink, Download } from 'lucide-react';
export function EvidencePanel({
  evidence,
  event,
  onClose,
}: {
  evidence: Evidence;
  event: EarthEvent;
  onClose: () => void;
}) {
  const download = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            event: event.id,
            coordinates: event.coordinates,
            evidence,
            observations: event.observations,
            notice: 'All scientific values are illustrative; no verified NISAR granules ingested.',
          },
          null,
          2,
        ),
      ],
      { type: 'application/json' },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terracascade-${evidence.id}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <Modal title="Follow the evidence" onClose={onClose}>
      <div className="badge-row">
        <Badge type={evidence.type} />
        <Badge type="DEMO">ILLUSTRATIVE · NOT VERIFIED</Badge>
      </div>
      <h3 className="modal-subtitle">{evidence.label}</h3>
      <p className="evidence-notice">
        “{evidence.type}” describes this record’s role in the scientific pipeline. This record is
        synthetic and is not a verified {evidence.type.toLowerCase()} measurement.
      </p>
      <dl className="evidence-details">
        {[
          ['Source', evidence.source],
          ['Dataset / record', evidence.dataset],
          ['Demo date', evidence.date],
          [
            'Acquisition pair',
            `${event.observations[0].date} – ${event.observations.at(-1)!.date} (synthetic time-series span)`,
          ],
          ['NISAR product', `${event.product} · Level 2 product contract`],
          ['Variable & unit', `${event.variable} · ${evidence.unit}`],
          ['Method', evidence.method],
          ['Quality', event.quality],
          ['Assumption', evidence.assumption],
          ['Limitation', evidence.limitation],
          ['Next relationship', evidence.relationship],
        ].map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <div className="modal-actions">
        <a className="button dark small" href={evidence.sourceUrl} target="_blank" rel="noreferrer">
          Source documentation <ExternalLink size={14} />
        </a>
        <button className="button small" onClick={download}>
          <Download size={14} /> Export evidence
        </button>
      </div>
    </Modal>
  );
}
