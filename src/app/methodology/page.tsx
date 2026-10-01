import Link from 'next/link';
import { Radar, Layers, ChartNoAxesCombined, Orbit, ArrowDown, Info } from 'lucide-react';
import { PRODUCTS, PRODUCT_URL } from '@/data/catalog';
export const metadata = { title: 'Methodology' };
export default function Methodology() {
  return (
    <main id="main" className="editorial-page shell">
      <header className="editorial-header">
        <p className="eyebrow">THE SCIENCE / THE ASSUMPTIONS / THE LIMITS</p>
        <h1>
          Built around
          <br />
          <em>NISAR.</em>
        </h1>
        <div className="editorial-intro">
          <p>
            NISAR is TerraCascade’s primary observation source. Repeated radar measurements form the
            history. Environmental information adds context. TerraCast explores how the signal might
            continue.
          </p>
          <div className="reference-note">
            <Radar size={24} />
            <span>
              Current demonstration
              <br />
              <strong>Illustrative scientific data only</strong>
            </span>
          </div>
        </div>
      </header>
      <section className="method-section">
        <div className="section-kicker">01 / THE FOUNDATION</div>
        <div className="method-content">
          <h2>Radar sees a different Earth.</h2>
          <div className="science-explain">
            <article>
              <h3>What is SAR?</h3>
              <p>
                Synthetic aperture radar combines radar echoes acquired along a satellite’s path to
                form images of the surface. Its own microwave illumination lets it operate day and
                night, through many weather conditions.
              </p>
            </article>
            <article>
              <h3>What is NISAR?</h3>
              <p>
                The NASA–ISRO Synthetic Aperture Radar mission provides repeated observations for
                studying Earth’s changing land and ice. TerraCascade is designed around its geocoded
                products.
              </p>
            </article>
            <article>
              <h3>Why repeat observations?</h3>
              <p>
                A single acquisition gives a state. Consistently processed acquisitions reveal a
                history. Reference frames, viewing geometry, temporal spacing and quality masks
                matter as much as the trend.
              </p>
            </article>
          </div>
          <a href={PRODUCT_URL} className="text-link" target="_blank" rel="noreferrer">
            Read the official NISAR product guide
          </a>
        </div>
      </section>
      <section className="method-section">
        <div className="section-kicker">02 / THE SCIENTIFIC SPINE</div>
        <div className="method-content">
          <h2>
            One primary signal.
            <br />
            An explicit chain of reasoning.
          </h2>
          <div className="pipeline">
            <div className="pipeline-primary">
              <Radar size={28} />
              <div>
                <strong>NISAR</strong>
                <span>GUNW · GCOV · GOFF · product-specific observations</span>
              </div>
            </div>
            {[
              [
                'Preprocess & validate',
                'Align grids, maintain a reference, mask unreliable pixels, retain acquisition metadata.',
              ],
              [
                'Observe & measure',
                'Publish processed series and small geospatial layers. Keep raw SAR outside the browser.',
              ],
              [
                'Describe temporal change',
                'Magnitude, median slope, persistence and descriptive acceleration.',
              ],
              [
                'Add supporting context',
                'Terrain, drainage, moisture and environmental trigger information enter here.',
              ],
              [
                'TerraCast',
                'Project the NISAR-derived trajectory. Expose assumptions and model sensitivity.',
              ],
              [
                'Monitoring scenarios',
                'Compare futures, inspect watch sectors and plan the next observation checkpoint.',
              ],
            ].map(([title, text], i) => (
              <div className="pipeline-step" key={title}>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                {i === 3 ? (
                  <Layers size={20} />
                ) : i === 4 ? (
                  <ChartNoAxesCombined size={20} />
                ) : (
                  <ArrowDown size={17} />
                )}
              </div>
            ))}
          </div>
          <p className="fine-print">
            The demo begins with synthetic, preprocessed fixtures. Acquisition, raster processing
            and external context ingestion are integration boundaries, not services claimed to be
            running.
          </p>
        </div>
      </section>
      <section className="method-section">
        <div className="section-kicker">03 / PRODUCT CATALOG</div>
        <div className="method-content">
          <h2>The right product for the question.</h2>
          <div className="product-table">
            {Object.entries(PRODUCTS).map(([key, p]) => (
              <article key={key}>
                <strong>{key}</strong>
                <div>
                  <h3>{p.name}</h3>
                  <p>{p.role}</p>
                </div>
                <span>{p.usage}</span>
              </article>
            ))}
          </div>
          <div className="inline-note">
            <Info size={20} />
            <p>
              GUNW line-of-sight displacement is not automatically vertical subsidence. GCOV
              backscatter is not a direct wetland-loss measurement. GOFF offsets require geometric
              interpretation. Product availability and suitability must be verified per study.
            </p>
          </div>
        </div>
      </section>
      <section className="method-section">
        <div className="section-kicker">04 / TERRACAST</div>
        <div className="method-content">
          <h2>A model you can inspect.</h2>
          <div className="formula-block">
            <p className="eyebrow">ANCHORED TREND SCENARIO</p>
            <p className="formula">
              y(h) = y<sub>last</sub> + v · h + ½ a · h²
            </p>
            <p>
              h = days after the last observation · v = median pairwise slope
              <br />a = user-selected acceleration assumption
            </p>
          </div>
          <div className="science-explain two">
            <article>
              <h3>Trend</h3>
              <p>
                Theil–Sen estimates the median slope between observation pairs. The projection is
                anchored to the latest value. Persistence counts the fraction of consecutive changes
                that agree with the slope’s direction.
              </p>
            </article>
            <article>
              <h3>Sensitivity envelope</h3>
              <p>
                The spread includes assumed observation error plus time × slope sensitivity.
                Sensitivity uses the largest of slope dispersion, 12% of the slope magnitude, and
                error divided by the history length. Scenario acceleration adds further spread.
              </p>
            </article>
            <article>
              <h3>Threshold window</h3>
              <p>
                The engine checks when the envelope first and last crosses a defined measurement
                threshold. Windows are censored beyond 90 days. A measurement threshold is not a
                flood, landslide or failure date.
              </p>
            </article>
            <article>
              <h3>Monitoring priority</h3>
              <p>
                The illustrative index is 35% persistence, 25% rainfall, 20% moisture and 20%
                acceleration assumption. Sector rankings also use synthetic contextual sensitivity.
                The weights are unvalidated design choices, not probabilities.
              </p>
            </article>
          </div>
          <div className="horizon-explainer">
            <div>
              <span>NEXT</span>
              <strong>0–10 days</strong>
              <p>Environmental trigger awareness. The demo uses a simulated intensity profile.</p>
            </div>
            <div>
              <span>SOON</span>
              <strong>30–90 days</strong>
              <p>Trajectory continuation. Uncertainty grows beyond the short history.</p>
            </div>
            <div>
              <span>LATER</span>
              <strong>Conditional</strong>
              <p>Stress-test assumptions in What-If Lab. No long-range hazard claim.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="method-section">
        <div className="section-kicker">05 / EVIDENCE & VALIDATION</div>
        <div className="method-content">
          <h2>Uncertainty belongs in the foreground.</h2>
          <div className="evidence-taxonomy">
            {[
              [
                'observed',
                'OBSERVED',
                'Directly supported by a documented measurement. Demo fixtures are explicitly marked illustrative.',
              ],
              [
                'derived',
                'DERIVED',
                'Calculated from the observation history using an identified method.',
              ],
              [
                'contextual',
                'CONTEXTUAL',
                'Supporting information from environmental sources, distinct from the primary signal.',
              ],
              [
                'forecast',
                'FORECAST',
                'A conditional future output with assumptions and visible uncertainty.',
              ],
            ].map(([style, label, text]) => (
              <div key={label}>
                <span className={`tag ${style}`}>{label}</span>
                <p>{text}</p>
              </div>
            ))}
          </div>
          <div className="validation-copy">
            <h3>Before using real observations</h3>
            <p>
              Verify acquisition metadata, units, projection, orbit geometry, phase-to-displacement
              conventions and spatial reference. Screen decorrelation, atmospheric effects and
              invalid pixels. Preserve source granule identifiers, processing versions and quality
              masks. Compare withheld acquisitions and independent ground observations before
              claiming forecast skill.
            </p>
            <h3>What is not validated here</h3>
            <p>
              The demonstration contains four synthetic observations per story. Neither its forecast
              envelopes nor its monitoring weights are calibrated against real outcomes. Terrain,
              triggers, watch-sector boundaries and checkpoints are illustrative. Ask Terra explains
              those structured records with local rules; it is not a scientific detector or a
              connected language model.
            </p>
          </div>
          <Link href="/sources" className="button dark">
            Inspect sources & provenance <Orbit size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
