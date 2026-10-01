import Link from 'next/link';
import Image from 'next/image';
import { LazyMap } from '@/components/map/lazy-map';
export const metadata = { title: 'About the Project' };
export default function About() {
  return (
    <main id="main" className="editorial-page shell">
      <header className="editorial-header about-header">
        <div>
          <p className="eyebrow">NASA SPACE APPS CHALLENGE 2026</p>
          <h1>
            A changing Earth.
            <br />A more thoughtful
            <br />
            <em>next question.</em>
          </h1>
          <p className="about-lead">
            TerraCascade asks what we should watch next—starting with what NISAR can tell us now.
          </p>
        </div>
        <div className="about-earth">
          <LazyMap globe interactive={false} />
        </div>
      </header>
      <section className="method-section">
        <div className="section-kicker">OUR PURPOSE</div>
        <div className="method-content">
          <h2>
            Make the evidence understandable.
            <br />
            Keep the uncertainty visible.
          </h2>
          <p className="reading">
            Created for the “Dancing with the SARs” challenge, TerraCascade connects radar
            observation, environmental interpretation and transparent future scenarios. Its
            scientific core is NASA–ISRO NISAR. Its central question is what deserves the next
            observation.
          </p>
          <div className="about-values">
            <div>
              <h3>See the change.</h3>
              <p>Read the original signal and its quality.</p>
            </div>
            <div>
              <h3>Understand the chain.</h3>
              <p>Follow evidence, context and assumptions.</p>
            </div>
            <div>
              <h3>Anticipate what comes next.</h3>
              <p>Compare conditional futures and monitoring priorities.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="method-section">
        <div className="section-kicker">THE AI EXPERIENCE</div>
        <div className="method-content">
          <h2>Explore the question behind the forecast.</h2>
          <p className="reading">
            Ask Terra and the ANTICIPATE interpretation panel demonstrate our planned AI experience:
            contextual explanations, evidence links and suggested scenarios that you can inspect and
            apply. The current preview uses local explanation rules and clearly labeled illustrative
            data. No language model is connected, and TerraCast projections use a statistical model.
            AI-assisted interpretation and evaluated predictive models are planned for future
            development.
          </p>
          <Link href="/forecast" className="button">
            Explore the AI preview
          </Link>
        </div>
      </section>
      <section className="method-section">
        <div className="section-kicker">THE TEAM</div>
        <div className="method-content">
          <h2>Meet Team Voyage.</h2>
          <p className="reading">
            The people behind TerraCascade, bringing together system architecture, machine learning,
            web development, storytelling and creative direction.
          </p>
          <div className="team-list">
            {[
              {
                name: 'Md Obayed Reza Hridoy',
                role: 'Team Lead & System Architect',
                photo: 'obayed.jpg',
              },
              { name: 'Siam Abdullah', role: 'ML Research Lead', photo: 'siam.jpg' },
              {
                name: 'Tasir Rahman',
                role: 'Web Developer and UI/UX Designer',
                photo: 'tasir.jpg',
              },
              {
                name: 'Meherub Mahmud Shahed',
                role: 'Storytelling, Pitch & Strategy Lead',
                photo: 'shahed.jpeg',
              },
              { name: 'Jannatul Ferdous Choya', role: 'Creative Lead', photo: 'choya.jpeg' },
            ].map((member) => (
              <div key={member.name}>
                <Image
                  className="team-portrait"
                  src={`/team/${member.photo}`}
                  alt={`Portrait of ${member.name}`}
                  width={480}
                  height={480}
                  sizes="(max-width: 700px) 90vw, (max-width: 1100px) 40vw, 25vw"
                />
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="method-section">
        <div className="section-kicker">ACKNOWLEDGEMENTS</div>
        <div className="method-content">
          <h2>Built on open Earth science.</h2>
          <p className="reading">
            We acknowledge NASA, ISRO and the Alaska Satellite Facility for the NISAR mission and
            product documentation, and the wider Earth-science community for the scientific
            foundations of this project. Natural Earth, OpenStreetMap provide geographic context.
          </p>
          <div className="inline-note">
            <p>
              TerraCascade is an independent project. It is not an official NASA or ISRO product and
              does not issue hazard warnings. The current app is a research demonstration with
              illustrative scientific records, not a validated operational forecasting service.
            </p>
          </div>
          <div className="about-links">
            <Link href="/sources" className="button">
              Sources & data status
            </Link>
            <Link href="/explore?story=1" className="button dark">
              Run the guided story
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
