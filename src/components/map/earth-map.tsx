'use client';
import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { Map as LibreMap, StyleSpecification } from 'maplibre-gl';
import { MapLibreOverlay } from '@deck.gl/maplibre';
import { PolygonLayer, ScatterplotLayer } from '@deck.gl/layers';
import { Globe2, Minus, Plus, RotateCcw } from 'lucide-react';
import { EVENTS } from '@/data/catalog';
import type { EarthEvent, Mode, Scenario } from '@/data/types';
import type { FeatureCollection } from 'geojson';
maplibregl.setWorkerUrl('/vendor/maplibre/maplibre-gl-worker.mjs');
maplibregl.setWorkerCount(2);
type Cell = { polygon: number[][]; weight: number };
export interface MapProps {
  event?: EarthEvent;
  mode?: Mode;
  scenario?: Scenario;
  observation?: number;
  layer?: string;
  globe?: boolean;
  interactive?: boolean;
  onSelect?: (id: string) => void;
  context?: boolean;
  currentOnly?: boolean;
  camera?: { lng: number; lat: number; zoom: number; bearing: number; pitch: number };
  onCamera?: (c: {
    lng: number;
    lat: number;
    zoom: number;
    bearing: number;
    pitch: number;
  }) => void;
}
function cells(e: EarthEvent): Cell[] {
  const out: Cell[] = [];
  for (let x = -6; x <= 6; x++)
    for (let y = -5; y <= 5; y++) {
      const w =
        Math.exp(-((x + 0.8) ** 2 / 22 + (y - 0.5) ** 2 / 12)) +
        0.24 * Math.exp(-((x - 4) ** 2 + (y + 3) ** 2) / 7);
      if (w < 0.12) continue;
      const dx = 0.008,
        dy = 0.006;
      const lon = e.coordinates[0] + x * dx,
        lat = e.coordinates[1] + y * dy;
      out.push({
        polygon: [
          [lon, lat],
          [lon + dx * 0.92, lat],
          [lon + dx * 0.92, lat + dy * 0.92],
          [lon, lat + dy * 0.92],
        ],
        weight: w,
      });
    }
  return out;
}
const graticule: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    ...Array.from({ length: 11 }, (_, i) => {
      const lon = -150 + i * 30;
      return {
        type: 'Feature' as const,
        properties: {},
        geometry: {
          type: 'LineString' as const,
          coordinates: Array.from({ length: 161 }, (_, j) => [lon, j - 80]),
        },
      };
    }),
    ...Array.from({ length: 5 }, (_, i) => {
      const lat = -60 + i * 30;
      return {
        type: 'Feature' as const,
        properties: {},
        geometry: {
          type: 'LineString' as const,
          coordinates: Array.from({ length: 361 }, (_, j) => [j - 180, lat]),
        },
      };
    }),
  ],
};
export default function EarthMap({
  event = EVENTS[0],
  mode = 'see',
  scenario,
  observation = 3,
  layer = 'signal',
  globe = false,
  interactive = true,
  onSelect,
  context = false,
  currentOnly = false,
  camera,
  onCamera,
}: MapProps) {
  const container = useRef<HTMLDivElement>(null),
    map = useRef<LibreMap | null>(null),
    overlay = useRef<MapLibreOverlay | null>(null);
  const [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false),
    [tileError, setTileError] = useState(false);
  const selection = useRef(onSelect);
  selection.current = onSelect;
  const cameraCallback = useRef(onCamera);
  cameraCallback.current = onCamera;
  useEffect(() => {
    if (!container.current) return;
    let disposed = false;
    const style: StyleSpecification = {
      version: 8,
      sources: {
        countries: {
          type: 'geojson',
          data: '/data/countries.geojson',
          attribution: '© Natural Earth',
        },
        grid: { type: 'geojson', data: graticule },
        ...(globe
          ? {}
          : {
              basemap: {
                type: 'raster' as const,
                tiles: [
                  process.env.NEXT_PUBLIC_BASEMAP_TILE_URL ||
                    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                ],
                tileSize: 256,
                attribution:
                  '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>',
              },
            }),
      },
      layers: [
        {
          id: 'ocean',
          type: 'background',
          paint: { 'background-color': globe ? '#dbe5df' : '#e3ece8' },
        },
        {
          id: 'land',
          type: 'fill',
          source: 'countries',
          paint: { 'fill-color': globe ? '#47685b' : '#f1f2e9', 'fill-opacity': 1 },
        },
        {
          id: 'borders',
          type: 'line',
          source: 'countries',
          paint: { 'line-color': globe ? '#8ba18e' : '#ced9cf', 'line-width': 0.5 },
        },
        ...(globe
          ? []
          : [
              {
                id: 'basemap',
                type: 'raster' as const,
                source: 'basemap',
                paint: { 'raster-opacity': 0.8, 'raster-saturation': -0.65 },
              },
            ]),
        {
          id: 'grid',
          type: 'line',
          source: 'grid',
          paint: {
            'line-color': globe ? '#98b0a2' : '#adbfb5',
            'line-width': 0.5,
            'line-opacity': 0.3,
          },
        },
      ],
    };
    try {
      const m = new maplibregl.Map({
        container: container.current,
        style,
        center: globe ? [80, 12] : event.coordinates,
        zoom: globe ? 1.75 : 10.9,
        minZoom: globe ? 1 : 1,
        maxZoom: 16,
        attributionControl: { compact: false },
        interactive,
        canvasContextAttributes: { antialias: true },
        renderWorldCopies: !globe,
      });
      map.current = m;
      m.on('error', (err) => {
        if (err.error?.message?.includes('WebGL')) setFailed(true);
        else setTileError(true);
      });
      m.on('load', () => {
        if (disposed) return;
        if (globe) m.setProjection({ type: 'globe' });
        m.addSource('events', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: EVENTS.map((e) => ({
              type: 'Feature',
              properties: { id: e.id, name: e.name },
              geometry: { type: 'Point', coordinates: e.coordinates },
            })),
          },
        });
        m.addLayer({
          id: 'event-halo',
          type: 'circle',
          source: 'events',
          paint: {
            'circle-radius': globe ? 12 : 14,
            'circle-color': '#bbef87',
            'circle-opacity': 0.2,
            'circle-stroke-color': '#bee999',
            'circle-stroke-width': 1,
          },
        });
        m.addLayer({
          id: 'event-points',
          type: 'circle',
          source: 'events',
          paint: {
            'circle-radius': 4,
            'circle-color': globe ? '#dcffa8' : '#2757d9',
            'circle-stroke-color': '#fff',
            'circle-stroke-width': 1.5,
          },
        });
        m.on('click', 'event-halo', (ev) => {
          const id = ev.features?.[0]?.properties?.id;
          if (id) selection.current?.(String(id));
        });
        m.on('mouseenter', 'event-halo', () => (m.getCanvas().style.cursor = 'pointer'));
        m.on('mouseleave', 'event-halo', () => (m.getCanvas().style.cursor = ''));
        if (!globe) {
          const o = new MapLibreOverlay({ interleaved: true, layers: [] });
          overlay.current = o;
          m.addControl(o);
        }
        setReady(true);
      });
      m.on('move', () => {
        const p = m.getCenter();
        cameraCallback.current?.({
          lng: p.lng,
          lat: p.lat,
          zoom: m.getZoom(),
          bearing: m.getBearing(),
          pitch: m.getPitch(),
        });
      });
      const resize = new ResizeObserver(() => m.resize());
      resize.observe(container.current);
      return () => {
        disposed = true;
        resize.disconnect();
        m.remove();
        map.current = null;
        overlay.current = null;
      };
    } catch {
      setFailed(true);
    }
    // Initialization owns the WebGL context; dynamic state is applied in the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globe, interactive]);
  useEffect(() => {
    if (ready && !globe)
      map.current?.easeTo({
        center: event.coordinates,
        zoom: 10.9,
        duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 900,
      });
  }, [event.id, globe, ready, event.coordinates]);
  useEffect(() => {
    if (!camera || !map.current) return;
    const m = map.current,
      c = m.getCenter();
    if (
      Math.abs(c.lng - camera.lng) +
        Math.abs(c.lat - camera.lat) +
        Math.abs(m.getZoom() - camera.zoom) +
        Math.abs(m.getBearing() - camera.bearing) +
        Math.abs(m.getPitch() - camera.pitch) >
      0.00001
    )
      m.jumpTo({
        center: [camera.lng, camera.lat],
        zoom: camera.zoom,
        bearing: camera.bearing,
        pitch: camera.pitch,
      });
  }, [camera]);
  useEffect(() => {
    if (!ready || !overlay.current) return;
    const future = mode === 'anticipate' && !currentOnly;
    const horizon = future ? scenario?.horizon || 0 : 0;
    const strength = (observation + 1) / 4;
    const alpha = future ? 155 - horizon * 0.5 : 165;
    const rgb: [number, number, number] = future
      ? [121, 82, 193]
      : mode === 'understand'
        ? [30, 143, 129]
        : layer === 'coherence'
          ? [33, 131, 135]
          : layer === 'backscatter'
            ? [183, 126, 57]
            : [42, 97, 210];
    const list = cells(event);
    const expansion = 1 + horizon / 300 + (scenario?.acceleration || 0) / 450;
    overlay.current.setProps({
      layers: [
        new PolygonLayer<Cell>({
          id: 'signal-cells',
          data: list,
          getPolygon: (d) =>
            d.polygon.map((p) => [
              event.coordinates[0] + (p[0] - event.coordinates[0]) * expansion,
              event.coordinates[1] + (p[1] - event.coordinates[1]) * expansion,
            ]),
          getFillColor: (d) => [
            ...rgb,
            Math.round(
              alpha *
                d.weight *
                (layer === 'coherence' ? event.observations[observation].coherence : strength),
            ),
          ],
          getLineColor: [255, 255, 255, 30],
          stroked: true,
          getLineWidth: 1,
          lineWidthUnits: 'pixels',
          pickable: true,
          updateTriggers: {
            getPolygon: [horizon, scenario?.acceleration],
            getFillColor: [mode, observation, layer],
          },
        }),
        ...((mode === 'understand' && context) || future
          ? [
              new ScatterplotLayer({
                id: 'context-zones',
                data: event.watchAreas,
                getPosition: (d) => [
                  event.coordinates[0] + d.offset[0],
                  event.coordinates[1] + d.offset[1],
                ],
                getRadius: (d) =>
                  350 +
                  d.sensitivity * 250 +
                  (future ? horizon * 4 + (scenario?.rainfall || 0) * 2 : 0),
                getFillColor: future ? [124, 77, 196, 28] : [14, 141, 124, 25],
                getLineColor: future ? [124, 77, 196, 180] : [14, 141, 124, 150],
                getLineWidth: 1.5,
                lineWidthUnits: 'pixels',
                stroked: true,
                pickable: true,
              }),
            ]
          : []),
      ],
      getTooltip: ({ object }) =>
        object
          ? {
              text: object.weight
                ? `Illustrative ${layer} footprint\nRelative spatial weight ${object.weight.toFixed(2)}\nSynthetic geometry, not a measured raster`
                : `${object.name}\n${object.rationale}`,
              style: { backgroundColor: '#173c36', fontSize: '13px', padding: '12px' },
            }
          : null,
    });
  }, [event, mode, scenario, observation, layer, context, currentOnly, ready]);
  return (
    <div className={`earth-map ${globe ? 'globe-map' : ''}`} data-testid="earth-map">
      <div
        ref={container}
        className="map-canvas"
        aria-label={
          globe
            ? 'Interactive Earth with four illustrative study locations'
            : `${event.location}: ${mode === 'anticipate' ? 'projected' : 'illustrative'} ${layer} map`
        }
        role="region"
      />
      {!ready && !failed && (
        <div className="map-loading">
          <Globe2 size={40} />
          <span>Preparing Earth…</span>
        </div>
      )}
      {failed && (
        <div className="map-loading map-fallback">
          <Globe2 size={45} />
          <h3>Map unavailable on this device</h3>
          <p>
            WebGL could not start. Every story, measurement and scenario remains available below.
          </p>
          <ul>
            {EVENTS.map((e) => (
              <li key={e.id}>
                <button onClick={() => selection.current?.(e.id)}>{e.location}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {ready && interactive && !globe && (
        <div className="map-zoom">
          <button aria-label="Zoom in" onClick={() => map.current?.zoomIn()}>
            <Plus size={18} />
          </button>
          <button aria-label="Zoom out" onClick={() => map.current?.zoomOut()}>
            <Minus size={18} />
          </button>
          <button
            aria-label="Reset map view"
            onClick={() =>
              map.current?.easeTo({ center: event.coordinates, zoom: 10.9, bearing: 0, pitch: 0 })
            }
          >
            <RotateCcw size={17} />
          </button>
        </div>
      )}
      {tileError && !globe && (
        <span className="map-network-note">
          Some map tiles unavailable · local geography retained
        </span>
      )}
    </div>
  );
}
