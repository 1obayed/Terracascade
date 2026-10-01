import fs from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { EVENTS } from '../src/data/catalog.ts';
const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'public');
fs.mkdirSync(path.join(out, 'data'), { recursive: true });
fs.mkdirSync(path.join(out, 'vendor/maplibre'), { recursive: true });
const topo = require('topojson-client');
const world = require('world-atlas/countries-110m.json');
fs.writeFileSync(
  path.join(out, 'data/countries.geojson'),
  JSON.stringify(topo.feature(world, world.objects.countries)),
);
fs.writeFileSync(path.join(out, 'data/events.json'), JSON.stringify(EVENTS, null, 2));
for (const file of ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs'])
  fs.copyFileSync(
    path.join(root, 'node_modules/maplibre-gl/dist', file),
    path.join(out, 'vendor/maplibre', file),
  );
fs.copyFileSync(
  path.join(root, 'node_modules/maplibre-gl/LICENSE.txt'),
  path.join(out, 'vendor/maplibre/LICENSE.txt'),
);
console.log('Prepared local geography, demonstration catalog and MapLibre worker.');
