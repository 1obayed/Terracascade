'use client';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
export const STORY_STEPS = [
  [
    'A planet in motion',
    'NISAR is the primary observation source. This demonstration uses synthetic fixtures at real geographic locations.',
  ],
  [
    'The Sinking City',
    'Our flagship story begins in North Jakarta. The study footprints are illustrative.',
  ],
  [
    'Start with the radar signal',
    'The GUNW product supports displacement analysis. A line-of-sight signal alone does not prove vertical subsidence.',
  ],
  ['Checkpoint T1', 'An illustrative relative displacement of −4 mm begins the record.'],
  ['Checkpoint T2', 'The next illustrative acquisition reaches −11 mm.'],
  ['Checkpoint T3', 'The series continues to −19 mm.'],
  ['Checkpoint T4', 'At −27 mm, four synthetic checkpoints now establish a demonstration history.'],
  [
    'A persistent trajectory',
    'The Change Engine calculates the trend and consistency. Real deployment requires quality masks and independent validation.',
  ],
  [
    'Cross the observation boundary',
    'Demo NOW is fixed at 24 September 2026. Beyond this point, every value is a projection.',
  ],
  ['TerraCast looks ahead', 'A median-slope model extends the radar-derived history to +60 days.'],
  [
    'Make uncertainty visible',
    'The widening band is model sensitivity. It is not a calibrated probability or a disaster forecast.',
  ],
  [
    'Add supporting context',
    'Terrain and drainage help interpret the NISAR signal. These layers are also illustrative in this demonstration.',
  ],
  [
    'Introduce a trigger',
    'A hypothetical heavy-rain window changes monitoring priority. It does not directly change measured displacement.',
  ],
  [
    'Understand the cascade',
    'Inspect each node: original signal, derived trajectory, environmental context and a conditional watch area.',
  ],
  [
    'Watch what deserves attention',
    'Future Hotspots prioritize follow-up observations, not guaranteed disaster locations.',
  ],
  [
    'Meet the Future Twin',
    'Move the comparison split to inspect current and projected footprints on synchronized maps.',
  ],
  [
    'See. Understand. Anticipate.',
    'NISAR observes the change. TerraCascade understands the chain. TerraCast explores what may come next.',
  ],
];
export function GuidedStory({
  step,
  onStep,
  onExit,
}: {
  step: number;
  onStep: (n: number) => void;
  onExit: () => void;
}) {
  return (
    <section className="guided-story" aria-label="Guided story">
      <div
        className="story-progress"
        style={{ width: `${((step + 1) / STORY_STEPS.length) * 100}%` }}
      />
      <span className="story-count">
        STORY {String(step + 1).padStart(2, '0')} / {STORY_STEPS.length}
      </span>
      <div aria-live="polite">
        <h2>{STORY_STEPS[step][0]}</h2>
        <p>{STORY_STEPS[step][1]}</p>
      </div>
      <div className="story-buttons">
        <button
          className="icon-button"
          aria-label="Previous story step"
          disabled={step === 0}
          onClick={() => onStep(step - 1)}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          className="button small dark"
          onClick={() => (step === STORY_STEPS.length - 1 ? onExit() : onStep(step + 1))}
        >
          {step === STORY_STEPS.length - 1 ? 'Explore freely' : 'Next'}
          <ChevronRight size={16} />
        </button>
        <button className="icon-button" aria-label="Exit guided story" onClick={onExit}>
          <X size={18} />
        </button>
      </div>
    </section>
  );
}
