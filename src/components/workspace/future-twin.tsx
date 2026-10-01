'use client';
import { useState } from 'react';
import { LazyMap } from '@/components/map/lazy-map';
import type { EarthEvent, Scenario } from '@/data/types';
export function FutureTwin({
  event,
  scenario,
  beforeAfter = false,
  layer = 'signal',
}: {
  event: EarthEvent;
  scenario: Scenario;
  beforeAfter?: boolean;
  layer?: string;
}) {
  const [split, setSplit] = useState(50);
  const [camera, setCamera] = useState({
    lng: event.coordinates[0],
    lat: event.coordinates[1],
    zoom: 10.9,
    bearing: 0,
    pitch: 0,
  });
  return (
    <div className="twin-wrapper">
      <div className="twin-map">
        <LazyMap
          event={event}
          mode={beforeAfter ? 'see' : 'anticipate'}
          scenario={scenario}
          camera={camera}
          onCamera={setCamera}
          layer={layer}
        />
        <div className="twin-left" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
          <LazyMap
            event={event}
            mode="see"
            currentOnly
            scenario={scenario}
            observation={beforeAfter ? 0 : 3}
            camera={camera}
            onCamera={setCamera}
            layer={layer}
          />
        </div>
        <div className="twin-label left">
          {beforeAfter ? 'T1 · 19 AUG' : 'CURRENT EARTH'}
          <small>ILLUSTRATIVE HISTORY</small>
        </div>
        <div className="twin-label right">
          {beforeAfter ? 'T4 · 24 SEP' : `PROJECTED EARTH · +${scenario.horizon}D`}
          <small>{beforeAfter ? 'ILLUSTRATIVE HISTORY' : 'CONDITIONAL SCENARIO'}</small>
        </div>
        <div className="twin-divider" style={{ left: `${split}%` }}>
          <span>↔</span>
        </div>
      </div>
      <label className="twin-slider">
        <span>{beforeAfter ? 'Before / after' : 'Present / future'} split</span>
        <input
          type="range"
          aria-label="Comparison split"
          min="10"
          max="90"
          value={split}
          onChange={(e) => setSplit(Number(e.target.value))}
        />
        <output>{split}%</output>
      </label>
    </div>
  );
}
