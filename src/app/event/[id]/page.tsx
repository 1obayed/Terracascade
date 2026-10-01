import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { EVENTS, getEvent } from '@/data/catalog';
import { Workspace } from '@/components/workspace/workspace';
export const dynamicParams = false;
export function generateStaticParams() {
  return EVENTS.map((e) => ({ id: e.id }));
}
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: getEvent(id)?.name || 'Story not found' };
}
export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEvent(id)) notFound();
  return (
    <Suspense
      fallback={
        <main id="main" className="route-loading">
          Preparing the Earth-change story…
        </main>
      }
    >
      <Workspace initialEvent={id} eventPage />
    </Suspense>
  );
}
