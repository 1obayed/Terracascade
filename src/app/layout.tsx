import type { Metadata } from 'next';
import '@fontsource-variable/inter';
import 'maplibre-gl/dist/maplibre-gl.css';
import './globals.css';
import { Navigation, Footer } from '@/components/navigation';
export const metadata: Metadata = {
  title: { default: 'TerraCascade — Earth Change Forecasting', template: '%s · TerraCascade' },
  description:
    'See NISAR surface-change signals, understand their context, and explore transparent future scenarios with TerraCast. Illustrative research demonstration.',
  icons: { icon: '/terracascade-mark.svg' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
