'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import type { MapProps } from './earth-map';
const Map = dynamic(() => import('./earth-map'), {
  ssr: false,
  loading: () => <div className="map-loading">Preparing Earth…</div>,
});
export function LazyMap(props: MapProps) {
  const router = useRouter();
  return (
    <Map
      {...props}
      onSelect={
        props.onSelect ?? (props.interactive ? (id) => router.push(`/event/${id}/`) : undefined)
      }
    />
  );
}
