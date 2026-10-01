import { Suspense } from 'react';
import { Workspace } from '@/components/workspace/workspace';
export const metadata = { title: 'What-If Lab' };
export default function Scenarios() {
  return (
    <Suspense
      fallback={
        <main id="main" className="route-loading">
          Preparing What-If Lab…
        </main>
      }
    >
      <Workspace initialMode="anticipate" lab />
    </Suspense>
  );
}
