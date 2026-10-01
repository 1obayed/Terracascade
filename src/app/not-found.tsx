import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="main" className="not-found shell">
      <p className="eyebrow">404 / OUTSIDE THE STUDY AREA</p>
      <h1>This signal isn’t here.</h1>
      <p>The page may have moved. The Earth Pulse explorer is a good place to start.</p>
      <Link href="/explore" className="button dark">
        Explore Earth
      </Link>
    </main>
  );
}
