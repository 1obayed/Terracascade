'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="not-found shell">
      <p className="eyebrow">SOMETHING INTERRUPTED THIS VIEW</p>
      <h1>Let’s try that again.</h1>
      <p>The view could not finish loading. Your saved places remain in this browser.</p>
      <button className="button dark" onClick={reset}>
        Reload this view
      </button>
    </main>
  );
}
