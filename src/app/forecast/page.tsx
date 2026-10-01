import { Suspense } from 'react';
import { Workspace } from '@/components/workspace/workspace';
export const metadata = { title: 'TerraCast' };
export default function Forecast() {
  return (
    <Suspense
      fallback={
        <main id="main" className="route-loading">
          Preparing TerraCast…
        </main>
      }
    >
      <Workspace initialMode="anticipate" />
    </Suspense>
  );
}
