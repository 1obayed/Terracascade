import Link from 'next/link';
import { ArrowDown, Radar, Play, Orbit, Layers, ScanLine, MoveUpRight } from 'lucide-react';
import { LazyMap } from '@/components/map/lazy-map';
export default function Home() {
  return (
    <main id="main">
      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="small-cross">✳</span> NASA SPACE APPS 2026{' '}
            <span className="muted">/ DANCING WITH THE SARS</span>
          </p>
          <h1>
            Earth is already
            <br />
            telling us what
            <br />
            may happen <em>next.</em>
          </h1>
          <p className="hero-description">
            Small changes. Connected consequences.
            <br />A clearer view of what deserves our attention.
          </p>
          <div className="hero-actions">
            <Link href="/explore" className="button dark">
              Enter the future <Orbit size={18} />
            </Link>
            <Link href="/explore?story=1" className="button plain">
              <Play size={14} fill="currentColor" /> Run the story
            </Link>
          </div>
          <div className="hero-source">
            <Radar size={25} />
            <div>
              <strong>Built around NISAR.</strong>
              <span>NASA–ISRO radar observations at the scientific core.</span>
            </div>
          </div>
        </div>
        <div className="hero-earth">
          <LazyMap globe interactive />
          <span className="earth-caption top">
            <span className="crosshair">+</span> EARTH PULSE / 01
          </span>
          <div className="earth-callout">
            <span className="tag observed">NISAR GUNW · ILLUSTRATIVE</span>
            <strong>The Sinking City</strong>
            <span>Jakarta, Indonesia · 6.12° S, 106.82° E</span>
            <Link href="/event/jakarta">
              Explore the signal <MoveUpRight size={16} />
            </Link>
          </div>
          <div className="earth-coordinate">
            A CHANGING PLANET.
            <br />A NEW PERSPECTIVE.
          </div>
        </div>
      </section>
      <div className="mission-strip shell">
        <p>
          SEE THE CHANGE.
          <br />
          <span>UNDERSTAND THE CHAIN.</span>
          <br />
          ANTICIPATE WHAT COMES NEXT.
        </p>
        <p>
          TerraCascade uses repeated NISAR radar measurements as its primary scientific foundation.
          Environmental context helps turn a surface-change history into transparent,
          forward-looking research scenarios.
        </p>
        <a className="round-link" href="#how-it-works" aria-label="How it works">
          <ArrowDown size={21} />
        </a>
      </div>
      <section id="how-it-works" className="chapter shell">
        <div className="chapter-index blue">01 / SEE</div>
        <div>
          <p className="eyebrow">WHAT IS NISAR SHOWING US?</p>
          <h2>
            The quiet changes
            <br />
            are still <em>changes.</em>
          </h2>
          <p className="reading">
            Radar reveals surface movement and changing backscatter across repeated acquisitions.
            Follow each checkpoint, inspect its quality, and trace every claim to its source.
          </p>
          <Link href="/explore" className="text-link">
            Open NISAR observation mode <ScanLine size={18} />
          </Link>
        </div>
        <div className="observation-art">
          <div className="mini-header">
            <Radar size={18} />
            <span>NISAR GUNW / ILLUSTRATIVE SERIES</span>
          </div>
          <div className="observation-bars">
            {[4, 11, 19, 27].map((n, i) => (
              <div key={n}>
                <span>T0{i + 1}</span>
                <div style={{ height: 40 + n * 4 }} />
                <strong>
                  −{n}
                  <small> mm</small>
                </strong>
              </div>
            ))}
          </div>
          <p>
            Repeated observations make a trajectory visible.
            <br />
            Synthetic line-of-sight displacement, not verified subsidence.
          </p>
        </div>
      </section>
      <section className="understand-chapter">
        <div className="shell chapter">
          <div className="chapter-index teal">02 / UNDERSTAND</div>
          <div>
            <p className="eyebrow">WHY DOES THIS CHANGE MATTER?</p>
            <h2>
              No signal exists
              <br />
              in <em>isolation.</em>
            </h2>
            <p className="reading">
              Start with the NISAR signal. Add terrain, drainage and environmental conditions.
              Explore the chain, with evidence and assumptions visible at every step.
            </p>
            <Link href="/explore?mode=understand" className="text-link">
              Follow the cascade <Layers size={18} />
            </Link>
          </div>
          <div className="home-cascade">
            {[
              ['NISAR displacement', 'OBSERVED · DEMO'],
              ['Persistent trajectory', 'DERIVED'],
              ['Terrain + drainage', 'CONTEXTUAL'],
              ['Next-stage watch area', 'FORECAST'],
            ].map(([n, t], i) => (
              <div key={n} className={`cascade-step step-${i}`}>
                <span>0{i + 1}</span>
                <strong>{n}</strong>
                <small>{t}</small>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="anticipate-chapter shell">
        <div className="chapter-index violet">03 / ANTICIPATE</div>
        <div className="anticipate-heading">
          <div>
            <p className="eyebrow">WHAT MAY HAPPEN NEXT?</p>
            <h2>
              Look beyond
              <br />
              the last <em>observation.</em>
            </h2>
          </div>
          <p>
            TerraCast starts with the NISAR-derived trajectory. Explore its continuation, test
            environmental triggers, and see uncertainty grow with the horizon.
          </p>
        </div>
        <div className="future-ribbon">
          <span>OBSERVATION HISTORY</span>
          <div className="ribbon-line solid" />
          <strong>NOW</strong>
          <div className="ribbon-line dashed" />
          <span>+30D</span>
          <div className="ribbon-line dashed" />
          <span>+60D</span>
          <div className="ribbon-line dashed" />
          <span>+90D</span>
        </div>
        <div className="future-links">
          <Link href="/forecast">
            <h3>TerraCast</h3>
            <p>Trajectory, uncertainty and monitoring priorities.</p>
          </Link>
          <Link href="/forecast?view=twin">
            <h3>Future Twin</h3>
            <p>Compare the present with a conditional future.</p>
          </Link>
          <Link href="/scenarios">
            <h3>What-If Lab</h3>
            <p>Change the assumptions. Examine the consequences.</p>
          </Link>
        </div>
        <div className="science-note">
          <span className="tag forecast">RESEARCH SCENARIOS</span>
          <p>
            All scientific values in this demonstration are illustrative. No verified NISAR
            measurements or live weather feeds are connected. Forecast envelopes show model
            sensitivity, not disaster probabilities.
          </p>
        </div>
      </section>
      <section className="closing">
        <div className="shell">
          <p className="eyebrow">A PLANET WORTH PAYING ATTENTION TO</p>
          <h2>
            See what Earth
            <br />
            is telling <em>us.</em>
          </h2>
          <p>
            Understand how the signals connect.
            <br />
            Anticipate what may happen next.
          </p>
          <Link href="/explore" className="button lime">
            Enter TerraCascade <Orbit size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
