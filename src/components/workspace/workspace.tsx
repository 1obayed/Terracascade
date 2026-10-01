'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Radar,
  Layers,
  Sparkles,
  Eye,
  Play,
  Pause,
  Info,
  Check,
  Globe2,
  MapPin,
  FlaskConical,
} from 'lucide-react';
import { DEFAULT_SCENARIO, EVENTS, getEvent, DEMO_TODAY } from '@/data/catalog';
import type { Evidence, Mode, Scenario, WatchRecord } from '@/data/types';
import { formatValue, measuredAcceleration, daysBetween } from '@/lib/forecast';
import { useForecast } from '@/lib/use-forecast';
import { readWatches, saveWatches } from '@/lib/watch';
import { LazyMap } from '@/components/map/lazy-map';
import { Badge } from '@/components/ui';
import { SelectMenu } from '@/components/select-menu';
import { TrajectoryChart } from './trajectory-chart';
import { EvidencePanel } from './evidence-panel';
import { Cascade } from './cascade';
import { FutureTwin } from './future-twin';
import { HorizonControl, ScenarioControls, ForecastPanels } from './forecast-panels';
import { AskTerra } from './ask-terra';
import { AIPreview } from './ai-preview';
import { WatchPanel } from './watch-panel';
import { GuidedStory } from './guided-story';
const modeMeta = {
  see: { number: '01', label: 'SEE', question: 'What is NISAR showing us?', icon: Radar },
  understand: {
    number: '02',
    label: 'UNDERSTAND',
    question: 'Why does this change matter?',
    icon: Layers,
  },
  anticipate: {
    number: '03',
    label: 'ANTICIPATE',
    question: 'What may happen next?',
    icon: Sparkles,
  },
};
export function Workspace({
  initialMode = 'see',
  initialEvent = 'jakarta',
  lab = false,
  eventPage = false,
}: {
  initialMode?: Mode;
  initialEvent?: string;
  lab?: boolean;
  eventPage?: boolean;
}) {
  const params = useSearchParams();
  const [id, setId] = useState(
    () => getEvent(params.get('event') || initialEvent)?.id || 'jakarta',
  );
  const [mode, setMode] = useState<Mode>(() =>
    ['see', 'understand', 'anticipate'].includes(params.get('mode') || '')
      ? (params.get('mode') as Mode)
      : initialMode,
  );
  const [scenario, setScenario] = useState<Scenario>({ ...DEFAULT_SCENARIO });
  const [observation, setObservation] = useState(3);
  const [layer, setLayer] = useState('signal');
  const [context, setContext] = useState(true);
  const [view, setView] = useState(params.get('view') === 'twin' ? 'twin' : 'map');
  const [beforeAfter, setBeforeAfter] = useState(false);
  const [evidence, setEvidence] = useState<Evidence | null>(null);
  const [ask, setAsk] = useState(false);
  const [showWatch, setShowWatch] = useState(false);
  const [watches, setWatches] = useState<WatchRecord[]>([]);
  const [notice, setNotice] = useState('');
  const [storageReady, setStorageReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [story, setStory] = useState<number | null>(params.get('story') === '1' ? 0 : null);
  const [world, setWorld] = useState(params.get('story') === '1');
  const [area, setArea] = useState<string | null>(null);
  const [camera, setCamera] = useState<
    { lng: number; lat: number; zoom: number; bearing: number; pitch: number } | undefined
  >();
  const event = getEvent(id)!;
  const { result, serviceNote } = useForecast(event, scenario);
  const selected = event.observations[observation];
  const future = result.points.at(-1)!;
  const watched = watches.some((w) => w.eventId === id);
  useEffect(() => {
    try {
      setWatches(readWatches());
    } catch {
      setNotice('Saved places could not be read. You can still explore and use scenarios.');
    }
    setStorageReady(true);
  }, []);
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(
      () =>
        setObservation((v) => {
          if (v >= 3) {
            setPlaying(false);
            return 3;
          }
          return v + 1;
        }),
      1400,
    );
    return () => clearInterval(timer);
  }, [playing]);
  useEffect(() => {
    setPlaying(false);
    setObservation(3);
    setLayer('signal');
    setArea(null);
    setCamera(undefined);
  }, [id]);
  const persist = (next: WatchRecord[]) => {
    try {
      saveWatches(next);
      setWatches(next);
      return true;
    } catch {
      setNotice('Browser storage is unavailable. This watch could not be saved.');
      return false;
    }
  };
  const watch = () => {
    const record: WatchRecord = {
      eventId: id,
      savedAt: new Date().toISOString(),
      scenario: { ...scenario },
      triggers: [`Rainfall ${scenario.rainfall}/100`, `Moisture ${scenario.moisture}/100`],
    };
    if (persist([...watches.filter((w) => w.eventId !== id), record]))
      setNotice(`${event.name} ${watched ? 'updated' : 'saved'} in this browser.`);
  };
  const selectMode = (m: Mode) => {
    setMode(m);
    setBeforeAfter(false);
    setWorld(false);
    setPlaying(false);
  };
  const selectArea = (areaId: string) => {
    const a = event.watchAreas.find((x) => x.id === areaId)!;
    setArea(a.name);
    setView('map');
    setWorld(false);
    setCamera({
      lng: event.coordinates[0] + a.offset[0],
      lat: event.coordinates[1] + a.offset[1],
      zoom: 12.2,
      pitch: 0,
      bearing: 0,
    });
    document
      .getElementById('map-workspace')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const applyStory = (step: number) => {
    setStory(step);
    setId('jakarta');
    setWorld(step === 0);
    setBeforeAfter(false);
    setPlaying(false);
    setObservation(step >= 3 && step <= 6 ? step - 3 : 3);
    setMode(step <= 7 ? 'see' : step === 11 || step === 13 ? 'understand' : 'anticipate');
    setView(step === 15 ? 'twin' : 'map');
    setContext(step >= 11);
    setScenario({
      ...DEFAULT_SCENARIO,
      horizon: step === 8 ? 0 : 60,
      rainfall: step >= 12 ? 90 : 35,
    });
  };
  const openEvidence = (ev: Evidence) => {
    setAsk(false);
    setEvidence(ev);
  };
  return (
    <main id="main" className={`workspace mode-${mode}`}>
      <div className="workspace-heading">
        <div>
          <p className="eyebrow">
            TERRACASCADE /{' '}
            {lab
              ? 'SCENARIO WORKSPACE'
              : eventPage
                ? 'EARTH-CHANGE STORY'
                : initialMode === 'anticipate'
                  ? 'FORECAST WORKSPACE'
                  : 'EARTH EXPLORER'}
          </p>
          <h1>
            {lab
              ? 'What-If Lab.'
              : eventPage
                ? event.name
                : initialMode === 'anticipate'
                  ? 'TerraCast.'
                  : 'Earth Pulse.'}
          </h1>
        </div>
        <div className="workspace-actions">
          <button className="button small" onClick={() => applyStory(0)}>
            <Play size={14} /> Run the story
          </button>
          <button className="button small" onClick={() => setShowWatch(true)}>
            <Eye size={15} /> Watchlist <span className="count">{watches.length}</span>
          </button>
          <button className="button dark small" onClick={() => setAsk(true)}>
            <Sparkles size={15} /> Ask Terra
          </button>
        </div>
      </div>
      <div className="workspace-modebar">
        <div className="mode-switch" aria-label="Scientific mode">
          {(Object.keys(modeMeta) as Mode[]).map((m) => {
            const Icon = modeMeta[m].icon;
            return (
              <button
                key={m}
                onClick={() => selectMode(m)}
                aria-pressed={mode === m}
                className={mode === m ? 'selected' : ''}
              >
                <Icon size={16} />
                <span>{modeMeta[m].number}</span> {modeMeta[m].label}
              </button>
            );
          })}
        </div>
        <p>{modeMeta[mode].question}</p>
        <Badge type="DEMO">ILLUSTRATIVE DEMONSTRATION</Badge>
      </div>
      {story !== null && (
        <GuidedStory
          step={story}
          onStep={applyStory}
          onExit={() => {
            setStory(null);
            setWorld(false);
          }}
        />
      )}
      <div className="data-notice">
        <Info size={14} />
        <p>
          All scientific values, footprints and triggers are illustrative. No verified NISAR
          measurements are connected. <Link href="/sources">View data status</Link>
        </p>
        <span>DEMO NOW · {DEMO_TODAY}</span>
      </div>
      <div className={`map-layout ${lab ? 'with-lab' : ''}`}>
        <section
          className="map-workspace"
          id="map-workspace"
          aria-label="Earth Pulse map workspace"
        >
          <div className="map-toolbar">
            <div className="location-select">
              <MapPin size={17} />
              <SelectMenu
                label="Study location"
                value={id}
                options={EVENTS.map((event) => ({ value: event.id, label: event.location }))}
                onChange={(value) => {
                  setId(value);
                  setWorld(false);
                  setStory(null);
                }}
              />
            </div>
            <div className="map-toolbar-right">
              {mode === 'anticipate' ? (
                <div className="segmented">
                  <button
                    className={view === 'map' ? 'active' : ''}
                    onClick={() => setView('map')}
                    aria-pressed={view === 'map'}
                  >
                    Forecast Map
                  </button>
                  <button
                    className={view === 'twin' ? 'active' : ''}
                    onClick={() => {
                      setWorld(false);
                      setView('twin');
                    }}
                    aria-pressed={view === 'twin'}
                  >
                    Future Twin
                  </button>
                </div>
              ) : (
                <>
                  <div className="layer-select">
                    <Layers size={15} />
                    <SelectMenu
                      label="NISAR map layer"
                      value={layer}
                      onChange={setLayer}
                      options={[
                        {
                          value: 'signal',
                          label:
                            event.product === 'GCOV'
                              ? 'Backscatter change'
                              : event.product === 'GOFF'
                                ? 'Surface motion'
                                : 'LOS displacement',
                        },
                        ...(event.product === 'GUNW'
                          ? [{ value: 'coherence', label: 'Interferometric coherence' }]
                          : []),
                      ]}
                    />
                  </div>
                  <button
                    className={`button small ${beforeAfter ? 'active' : ''}`}
                    onClick={() => {
                      setBeforeAfter(!beforeAfter);
                      setWorld(false);
                    }}
                    aria-pressed={beforeAfter}
                  >
                    Before / after
                  </button>
                </>
              )}
              <button
                className="icon-button"
                aria-label={world ? 'Return to selected region' : 'Show Earth overview'}
                onClick={() => {
                  setWorld(!world);
                  setView('map');
                  setBeforeAfter(false);
                }}
              >
                <Globe2 size={18} />
              </button>
            </div>
          </div>
          <div className="map-stage">
            {beforeAfter || (mode === 'anticipate' && view === 'twin') ? (
              <FutureTwin
                key={id + (beforeAfter ? 'comparison' : 'twin')}
                event={event}
                scenario={scenario}
                beforeAfter={beforeAfter}
                layer={layer}
              />
            ) : (
              <LazyMap
                event={event}
                mode={mode}
                scenario={scenario}
                observation={observation}
                layer={layer}
                globe={world}
                onSelect={(selectedId) => {
                  setId(selectedId);
                  setWorld(false);
                }}
                context={context}
                camera={camera}
              />
            )}
            {!beforeAfter && view !== 'twin' && (
              <>
                <div className="floating-summary">
                  <div className="badge-row">
                    <Badge
                      type={
                        mode === 'anticipate'
                          ? 'FORECAST'
                          : mode === 'understand'
                            ? 'DERIVED'
                            : 'OBSERVED'
                      }
                    />
                    <span className="tiny-label">ILLUSTRATIVE</span>
                  </div>
                  <h2>{event.name}</h2>
                  <p>
                    NISAR {event.product} ·{' '}
                    {mode === 'anticipate'
                      ? 'TerraCast trajectory'
                      : layer === 'coherence'
                        ? 'Interferometric coherence'
                        : event.variable}
                  </p>
                  <div className="map-metric">
                    <strong>
                      {formatValue(
                        layer === 'coherence' && mode !== 'anticipate'
                          ? selected.coherence
                          : mode === 'anticipate'
                            ? future.value
                            : selected.value,
                        layer === 'coherence' ? 2 : 1,
                      )}
                    </strong>
                    <span>
                      {layer === 'coherence' && mode !== 'anticipate' ? '0–1' : event.unit}
                    </span>
                  </div>
                  <p className="metric-caption">
                    {mode === 'anticipate'
                      ? `+${scenario.horizon} days from demo NOW`
                      : `Demo acquisition · ${selected.date}`}
                  </p>
                  <button
                    className="text-button"
                    onClick={() =>
                      openEvidence(
                        mode === 'anticipate'
                          ? event.evidence[4]
                          : { ...event.evidence[0], date: selected.date },
                      )
                    }
                  >
                    Inspect source & evidence <Info size={13} />
                  </button>
                </div>
                <div className="map-legend">
                  <span className={`legend-gradient ${mode}`} />
                  <span>
                    {mode === 'anticipate'
                      ? 'Softer boundary = scenario uncertainty'
                      : layer === 'coherence'
                        ? 'Illustrative coherence intensity'
                        : 'Illustrative signal magnitude'}
                  </span>
                  <small>Synthetic footprint · not a measured raster</small>
                </div>
              </>
            )}
            {mode === 'understand' && (
              <label className="context-toggle">
                <input
                  type="checkbox"
                  checked={context}
                  onChange={(e) => setContext(e.target.checked)}
                />{' '}
                Show contextual watch sectors
              </label>
            )}
            {area && (
              <div className="selected-area">
                Watch area selected: <strong>{area}</strong>
                <button
                  aria-label="Clear selected area"
                  onClick={() => {
                    setArea(null);
                    setCamera({
                      lng: event.coordinates[0],
                      lat: event.coordinates[1],
                      zoom: 10.9,
                      pitch: 0,
                      bearing: 0,
                    });
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>
          <div className="timeline-bar">
            {mode === 'anticipate' ? (
              <>
                <div>
                  <span className="eyebrow violet">TERRACAST HORIZON</span>
                  <p>Projection from NISAR history</p>
                </div>
                <HorizonControl
                  value={scenario.horizon}
                  onChange={(horizon) => setScenario({ ...scenario, horizon })}
                />
                <span className="timeline-note">
                  SOON · 30–90 DAYS
                  <br />
                  Uncertainty increases with time
                </span>
              </>
            ) : (
              <>
                <button
                  className="icon-button"
                  aria-label={playing ? 'Pause time travel' : 'Play time travel'}
                  onClick={() => {
                    if (!playing) setObservation(0);
                    setPlaying(!playing);
                  }}
                >
                  {playing ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <div className="timeline-label">
                  <span className="eyebrow blue">NISAR TIME TRAVEL</span>
                  <span>{selected.date}</span>
                </div>
                <label className="time-range">
                  <span className="sr-only">Observation checkpoint</span>
                  <input
                    type="range"
                    aria-label="Observation checkpoint"
                    min="0"
                    max="3"
                    value={observation}
                    onChange={(e) => {
                      setObservation(Number(e.target.value));
                      setPlaying(false);
                    }}
                  />
                  <div>
                    {event.observations.map((o, i) => (
                      <button
                        key={o.date}
                        className={observation === i ? 'active' : ''}
                        aria-label={`Select checkpoint ${i + 1}, ${o.date}`}
                        onClick={() => {
                          setObservation(i);
                          setPlaying(false);
                        }}
                      >
                        T{i + 1} <span>{o.date.slice(5)}</span>
                      </button>
                    ))}
                  </div>
                </label>
                <span className="timeline-note">
                  4 DEMO ACQUISITIONS
                  <br />
                  12-day sample spacing
                </span>
              </>
            )}
          </div>
        </section>
        {lab && (
          <ScenarioControls
            scenario={scenario}
            onChange={(s) => {
              setScenario(s);
              setMode('anticipate');
            }}
            onReset={() => {
              setScenario({ ...DEFAULT_SCENARIO });
              setMode('anticipate');
              setNotice('Scenario reset to baseline assumptions.');
            }}
          />
        )}
      </div>
      <div className="region-strip">
        <div>
          <Radar size={18} />
          <span>
            Primary observation contract <strong>NISAR {event.product}</strong>
          </span>
        </div>
        <p>{event.description}</p>
        <button className="button small" disabled={!storageReady} onClick={watch}>
          {watched ? <Check size={15} /> : <Eye size={15} />}{' '}
          {watched ? 'Update saved watch' : 'Watch this place'}
        </button>
      </div>
      {serviceNote && (
        <p className="fine-print" role="status">
          {serviceNote}
        </p>
      )}
      {notice && (
        <div className="feedback" role="status">
          {notice}
          <button onClick={() => setNotice('')} aria-label="Dismiss notification">
            ×
          </button>
        </div>
      )}
      {mode === 'anticipate' && (
        <AIPreview
          event={event}
          result={result}
          scenario={scenario}
          onEvidence={openEvidence}
          onAsk={() => setAsk(true)}
          onApply={(next) => {
            setScenario(next);
            setNotice(
              'Preview scenario applied. The map, trajectory and monitoring priorities now reflect your settings.',
            );
          }}
        />
      )}
      <div className="analysis-grid">
        <section className="chart-panel">
          <div className="section-heading">
            <div>
              <p className={`eyebrow ${mode === 'anticipate' ? 'violet' : 'blue'}`}>
                {mode === 'anticipate' ? 'TERRACAST / TRAJECTORY' : 'NISAR / TEMPORAL RECORD'}
              </p>
              <h2>{mode === 'anticipate' ? 'From signal to scenario.' : 'A history of change.'}</h2>
            </div>
            <Badge type={mode === 'anticipate' ? 'FORECAST' : 'DERIVED'} />
          </div>
          <TrajectoryChart
            event={event}
            result={result}
            showForecast={mode === 'anticipate'}
            selected={observation}
          />
          <div className="chart-footer">
            <span>
              {mode === 'anticipate'
                ? result.model
                : `NISAR ${event.product} · synthetic time series`}
            </span>
            <button
              className="text-button"
              onClick={() => openEvidence(event.evidence[mode === 'anticipate' ? 4 : 1])}
            >
              Method & limitations
            </button>
          </div>
          {mode === 'anticipate' && (
            <p className="uncertainty-note">
              Sensitivity envelope, not a calibrated confidence interval. A{' '}
              {daysBetween(event.observations[0].date, event.observations.at(-1)!.date)}-day
              synthetic history cannot establish a validated {scenario.horizon}-day forecast.
            </p>
          )}
        </section>
        <aside className="dna-panel">
          <div className="panel-title">
            <h3>{mode === 'anticipate' ? 'Monitoring outlook' : 'Change DNA'}</h3>
            <Badge type="DERIVED" />
          </div>
          {mode === 'anticipate' ? (
            <>
              <strong className="priority-display">{result.priority}</strong>
              <p className="fine-print">
                Experimental rule index <strong>{result.score}/100</strong>. Not an event
                probability.
              </p>
              <div className="dna-meter">
                <span style={{ width: `${result.score}%` }} />
              </div>
              <dl className="compact-details">
                <div>
                  <dt>Projected value</dt>
                  <dd>
                    {formatValue(future.value)} {event.unit}
                  </dd>
                </div>
                <div>
                  <dt>Sensitivity range</dt>
                  <dd>
                    {formatValue(future.lower)} to {formatValue(future.upper)} {event.unit}
                  </dd>
                </div>
                <div>
                  <dt>Next demo checkpoint</dt>
                  <dd>{event.nextCheckpoint}</dd>
                </div>
              </dl>
              <p className="fine-print">{event.checkpointNote}</p>
              <Link href={`/scenarios?event=${id}`} className="button small">
                <FlaskConical size={15} /> Test a different future
              </Link>
            </>
          ) : (
            <>
              <dl className="compact-details">
                <div>
                  <dt>Magnitude at T4</dt>
                  <dd>
                    {event.observations.at(-1)!.value} {event.unit}
                  </dd>
                </div>
                <div>
                  <dt>Direction</dt>
                  <dd>{result.slope < 0 ? 'Decreasing' : 'Increasing'} signal</dd>
                </div>
                <div>
                  <dt>Median rate</dt>
                  <dd>
                    {formatValue(result.slope, 3)} {event.unit}/day
                  </dd>
                </div>
                <div>
                  <dt>Persistence</dt>
                  <dd>{Math.round(result.persistence * 100)}% of intervals</dd>
                </div>
                <div>
                  <dt>Finite-difference acceleration</dt>
                  <dd>
                    {formatValue(measuredAcceleration(event), 4)} {event.unit}/day²
                  </dd>
                </div>
                <div>
                  <dt>Observation duration</dt>
                  <dd>36 days · 4 fixtures</dd>
                </div>
                <div>
                  <dt>Evidence quality</dt>
                  <dd>Synthetic / unvalidated</dd>
                </div>
              </dl>
              <p className="fine-print">
                Descriptive features of the illustrative series. Acceleration from four points is
                unstable.
              </p>
              <button className="text-button" onClick={() => openEvidence(event.evidence[1])}>
                Inspect derived analysis
              </button>
            </>
          )}
        </aside>
      </div>
      {mode === 'understand' && <Cascade event={event} result={result} onEvidence={openEvidence} />}
      {mode === 'anticipate' && (
        <>
          <ForecastPanels
            event={event}
            result={result}
            scenario={scenario}
            onEvidence={openEvidence}
            onArea={selectArea}
          />
          {lab && <Cascade event={event} result={result} onEvidence={openEvidence} />}
        </>
      )}
      <div className="scientific-boundary">
        <Info size={20} />
        <div>
          <strong>What this signal can and cannot tell us</strong>
          {event.limitations.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
        <Link href="/methodology">Read the methodology</Link>
      </div>
      <section className="other-stories">
        <div className="section-heading">
          <h2>Other signals. Same planet.</h2>
          <span className="helper">Four illustrative NISAR-led stories</span>
        </div>
        <div>
          {EVENTS.map((e) => (
            <button
              key={e.id}
              className={id === e.id ? 'selected' : ''}
              onClick={() => {
                setId(e.id);
                setStory(null);
                setWorld(false);
                document.getElementById('main')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="eyebrow">
                {e.product} / {e.category}
              </span>
              <h3>{e.name}</h3>
              <p>{e.location}</p>
              <span className="tiny-label">ILLUSTRATIVE</span>
            </button>
          ))}
        </div>
      </section>
      {evidence && (
        <EvidencePanel evidence={evidence} event={event} onClose={() => setEvidence(null)} />
      )}
      {ask && (
        <AskTerra
          event={event}
          result={result}
          scenario={scenario}
          mode={mode}
          observation={observation}
          onClose={() => setAsk(false)}
          onEvidence={openEvidence}
          onScenario={(next) => {
            setScenario(next);
            setMode('anticipate');
            setNotice('Suggested scenario applied from Ask Terra preview.');
          }}
          onHeavyRain={() => {
            setScenario({ ...scenario, rainfall: 90 });
            setMode('anticipate');
            setNotice('Heavy-rain scenario applied: rainfall sensitivity 90/100.');
          }}
        />
      )}
      {showWatch && (
        <WatchPanel
          records={watches}
          onClose={() => setShowWatch(false)}
          onRemove={(eventId) => persist(watches.filter((w) => w.eventId !== eventId))}
          onOpen={(record) => {
            setId(record.eventId);
            setScenario(record.scenario);
            setMode('anticipate');
            setShowWatch(false);
            setWorld(false);
          }}
        />
      )}
    </main>
  );
}
