import { Suspense } from 'react';
import { Workspace } from '@/components/workspace/workspace';
export const metadata = { title: 'Earth Pulse' };
export default function Explore() {
  return (
    <Suspense
      fallback={
        <main id="main" className="route-loading">
          Preparing Earth Pulse…
        </main>
      }
    >
      <Workspace />
    </Suspense>
  );
}
