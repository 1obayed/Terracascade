import Link from 'next/link';
import { ExternalLink, Radar } from 'lucide-react';
import { SOURCES, EVENTS } from '@/data/catalog';
export const metadata = { title: 'Sources & Provenance' };
export default function Sources() {
  return (
    <main id="main" className="editorial-page shell">
      <header className="editorial-header">
        <p className="eyebrow">THE EVIDENCE BEHIND THE EXPERIENCE</p>
        <h1>
          Every signal
          <br />
          has a <em>source.</em>
        </h1>
        <div className="editorial-intro">
          <p>
            NISAR is the primary scientific foundation. This catalog separates official technical
            references, planned supporting data and the illustrative records currently powering
            TerraCascade.
          </p>
          <div className="reference-note">
            <Radar size={25} />
            <span>
              Data connection status
              <br />
              <strong>No verified NISAR granules ingested</strong>
            </span>
          </div>
        </div>
      </header>
      <section className="source-catalog" aria-label="Dataset catalog">
        {SOURCES.map((s, i) => (
          <article key={s.name} className={i === 0 ? 'primary-source' : ''}>
            <div>
              <p className="eyebrow">{s.role}</p>
              <h2>{s.name}</h2>
              <p>{s.description}</p>
              <a href={s.url} target="_blank" rel="noreferrer">
                Official source <ExternalLink size={14} />
              </a>
            </div>
            <span className="source-status">{s.status}</span>
          </article>
        ))}
      </section>
      <section className="provenance-register">
        <div className="section-heading">
          <div>
            <p className="eyebrow">DEMONSTRATION REGISTER</p>
            <h2>Know what you’re looking at.</h2>
          </div>
          <span className="tag demo">ALL SCIENTIFIC RECORDS ILLUSTRATIVE</span>
        </div>
        <div className="table-scroll">
          <table>
            <caption>
              Synthetic fixtures at real geographic locations. Basemap geography is not a NISAR
              observation.
            </caption>
            <thead>
              <tr>
                <th>Story</th>
                <th>Product contract</th>
                <th>Variable</th>
                <th>Origin</th>
                <th>Inspect</th>
              </tr>
            </thead>
            <tbody>
              {EVENTS.map((e) => (
                <tr key={e.id}>
                  <td>
                    {e.name}
                    <small>{e.location}</small>
                  </td>
                  <td>NISAR {e.product}</td>
                  <td>
                    {e.variable} ({e.unit})
                  </td>
                  <td>
                    Manually specified fixtures
                    <br />
                    2026-08-19 to 2026-09-24
                  </td>
                  <td>
                    <Link href={`/event/${e.id}`}>Open story</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <a href="/data/events.json" download className="button small">
          Download the demonstration catalog
        </a>
      </section>
      <section className="source-boundary">
        <h2>Transparent data. AI integration ahead.</h2>
        <p>
          Every signal is labeled so you can distinguish illustrative examples from verified
          satellite measurements. The current prototype uses illustrative data to demonstrate the
          observation, analysis and forecasting workflow.
        </p>
        <p>
          AI model integration is planned for an upcoming release to support Ask Terra and
          explanations in ANTICIPATE. You can explore the intended experience through the current
          AI preview, which uses simulated responses. Until the connection is enabled, no data is
          sent to a language-model service.
        </p>
        <p>
          Watch places are saved in your browser. Regional basemap tiles come from OpenStreetMap;
          country geometry and illustrative scientific data are bundled with the application.
        </p>
        <Link href="/methodology" className="text-link">
          Read methods and limitations
        </Link>
      </section>
    </main>
  );
}
