# TerraCascade

An anticipation-first Earth intelligence application built around NISAR and the SEE → UNDERSTAND → ANTICIPATE journey. Prepared for the user's NASA Space Apps 2026 “Dancing with the SARs” concept; an independent demonstration, without NASA endorsement.

## Run locally

Requires Node.js 22.18 or newer and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. No API keys or backend are required. The preparation script generates bundled geography and copies the compatible MapLibre worker.

For a production build:

```sh
npm run build
npm start
```

Stop the development server before starting the production server on the same port. Set `PORT` to use another port. The static output is in `out/`. For Vercel, import this directory as the project root; `vercel.json` supplies build and output settings. This repository has not been deployed to a public host.

## Included experiences

- Editorial homepage and interactive globe with selectable regional studies.
- Earth Pulse: observation checkpoints, product layers, before/after comparison and charts with accessible data tables.
- Understand: evidence-linked cascade chains separating observation, inference and context.
- TerraCast: forecast map, synchronized Future Twin, trigger controls, threshold windows, future hotspots and What-If Lab.
- Browser-local watchlist that saves scenarios; contextual Ask Terra explanations and a guided story.
- Evidence dialogs and export, methodology, About and official source links.
- Four illustrative studies: Jakarta, Sierra Nevada, Sundarbans and Malaspina Glacier.

## Scientific boundaries

Every bundled measurement, scientific overlay, forecast and exposure/context value is **illustrative**. No verified NISAR granule has been ingested. Product descriptions link to official documentation. The demo clock is fixed at September 24, 2026; future checkpoints are illustrative, not an acquisition schedule.

GUNW displacement is along the radar line of sight, not directly vertical subsidence. GCOV backscatter changes are not definitive damage or inundation classifications. GOFF offsets require quality assessment and interpretation. The model uses a median pairwise trend and an expanding sensitivity envelope, not a calibrated probability interval. The Anticipation Index is a transparent monitoring-priority heuristic, not disaster probability. Rainfall changes contextual priority rather than directly causing modeled deformation.

Ask Terra uses local, evidence-linked explanation rules. It does not call a language model. Watch This Place uses localStorage; it does not send alerts or poll satellites. The processing validator and PostGIS schema are integration foundations; neither constitutes a deployed ingestion pipeline or database.

## AI interaction preview

Open `/forecast` or `/scenarios` to find the ANTICIPATE interpretation panel. It explains the selected trajectory, sensitivity envelope and monitoring priority with clickable evidence. Ask Terra carries the same explicit **AI preview · simulated responses** label and updates its rule-based answers with the selected location, checkpoint and scenario.

Choose wetter conditions, a faster trend or continuation of the current trend. The preview compares the current and suggested projected values and monitoring indices before applying the change. Applying a suggestion updates the shared map, chart and scenario controls. Ask Terra also exposes these suggestions in its expandable scenario section. No language-model credentials, external AI requests, fabricated processing delays or AI-generated forecasting claims are used.

## Optional scientific API

From the repository root, with Python 3.11+:

```sh
python -m venv backend/.venv
# Windows:
backend/.venv/Scripts/python -m pip install -r backend/requirements.txt
backend/.venv/Scripts/python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
# macOS/Linux: use backend/.venv/bin/python instead.
```

Copy `.env.example` to `.env.local`, set `NEXT_PUBLIC_TERRACASCADE_API_URL=http://127.0.0.1:8000`, and restart/rebuild the frontend. Requests time out after five seconds and fall back to the bundled model. API documentation is at `/docs` on port 8000. Routes include `/health`, `/events`, `/events/{id}`, `/events/{id}/evidence`, `/forecast` and `/scenario`. Adjust `TERRACASCADE_ORIGINS` for a deployed frontend. Do not expose the development server as a production service.

## Validation

```sh
npm run typecheck
npm test
npm run build
backend/.venv/Scripts/python -m unittest discover -s tests -p backend_test.py -v
```

A Playwright/axe suite is included (`npm run test:e2e`; install browsers with `npx playwright install chromium`). It was not executed in this environment. See [validation record](docs/VALIDATION.md) and [architecture](docs/ARCHITECTURE.md).

## Maps, privacy and hosting

MapLibre and deck.gl render scientific overlays locally. Natural Earth geography is bundled through world-atlas. Regional maps request OpenStreetMap raster tiles with visible attribution; map requests disclose the viewed tile area to the provider. There is no application analytics or account system. Public OSM tiles are suitable for modest interactive use subject to their usage policy, not unrestricted production traffic or offline downloading. Configure a licensed basemap through the environment settings before a high-traffic launch. Core geographic context remains available from local geography when remote tiles fail. External source links require an internet connection.

The application uses Next.js, React, strict TypeScript, Tailwind/CSS, MapLibre, deck.gl, D3, local Inter fonts and Lucide icons. Dependencies and font/map licenses remain with their respective owners. No rights to NASA marks or endorsement are implied.
