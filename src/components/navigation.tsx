'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, Orbit } from 'lucide-react';
const links = [
  ['Explore Earth', '/explore'],
  ['Forecast', '/forecast'],
  ['Scenarios', '/scenarios'],
  ['Methodology', '/methodology'],
  ['About', '/about'],
];
export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const listener = () => setCompact(window.scrollY > 30);
    window.addEventListener('scroll', listener, { passive: true });
    return () => window.removeEventListener('scroll', listener);
  }, []);
  return (
    <header className={`site-header ${compact ? 'condensed' : ''}`}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Link href="/" className="wordmark" aria-label="TerraCascade home">
        <Orbit size={30} strokeWidth={1.5} />
        <span>
          terra<span className="wordmark-light">cascade</span>
        </span>
      </Link>
      <button
        className="icon-button mobile-menu"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        aria-controls="primary-nav"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav
        id="primary-nav"
        aria-label="Main navigation"
        className={open ? 'nav-links open' : 'nav-links'}
      >
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname.startsWith(href) ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            {label}
          </Link>
        ))}
        <Link href="/explore" className="button dark nav-cta" onClick={() => setOpen(false)}>
          Enter TerraCascade
        </Link>
      </nav>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link href="/" className="wordmark">
          <Orbit size={26} />
          terracascade
        </Link>
        <p>
          NASA SPACE APPS CHALLENGE 2026
          <br />
          DANCING WITH THE SARS
        </p>
        <p>© 2026 Team Voyage. All rights reserved.</p>
      </div>
      <div className="footer-links">
        {[...links, ['Sources', '/sources']].map(([n, u]) => (
          <Link key={u} href={u}>
            {n}
          </Link>
        ))}
      </div>
      <p className="footer-note">
        Research scenarios and monitoring priorities.
        <br />
        TerraCascade does not issue official hazard warnings.
        <br />
        Independent project. Not endorsed by NASA or ISRO.
      </p>
    </footer>
  );
}
