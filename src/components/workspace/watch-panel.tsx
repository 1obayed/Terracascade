'use client';
import { Eye, Trash2 } from 'lucide-react';
import { Modal, Badge } from '@/components/ui';
import { EVENTS } from '@/data/catalog';
import type { WatchRecord } from '@/data/types';
export function WatchPanel({
  records,
  onClose,
  onRemove,
  onOpen,
}: {
  records: WatchRecord[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onOpen: (record: WatchRecord) => void;
}) {
  return (
    <Modal title="Your watch places" onClose={onClose}>
      <p className="fine-print">
        Saved in this browser only. No background monitoring, email alerts or acquisition polling.
      </p>
      {records.length === 0 ? (
        <div className="empty-state">
          <Eye size={35} />
          <h3>No places watched yet.</h3>
          <p>Select a story, set your scenario and choose “Watch this place.”</p>
        </div>
      ) : (
        records.map((record) => {
          const event = EVENTS.find((e) => e.id === record.eventId)!;
          return (
            <article className="watch-record" key={record.eventId}>
              <div className="panel-title">
                <h3>{event.name}</h3>
                <Badge type="DEMO" />
              </div>
              <p>{event.location}</p>
              <dl className="compact-details">
                <div>
                  <dt>Selected signal</dt>
                  <dd>
                    {event.product} · {event.variable}
                  </dd>
                </div>
                <div>
                  <dt>Latest demo observation</dt>
                  <dd>{event.observations.at(-1)!.date}</dd>
                </div>
                <div>
                  <dt>History</dt>
                  <dd>
                    {event.observations[0].date} – {event.observations.at(-1)!.date}
                  </dd>
                </div>
                <div>
                  <dt>Next demo checkpoint</dt>
                  <dd>{event.nextCheckpoint} (not scheduled)</dd>
                </div>
                <div>
                  <dt>Selected triggers</dt>
                  <dd>{record.triggers.join(', ') || 'None'}</dd>
                </div>
                <div>
                  <dt>Recent changes</dt>
                  <dd>Static demonstration; no new acquisitions since the bundled record.</dd>
                </div>
              </dl>
              <div className="modal-actions">
                <button className="button small dark" onClick={() => onOpen(record)}>
                  Open saved scenario
                </button>
                <button className="button small" onClick={() => onRemove(record.eventId)}>
                  <Trash2 size={14} /> Remove watch
                </button>
              </div>
            </article>
          );
        })
      )}
    </Modal>
  );
}
