# TerraCascade architecture

## Product and interaction model

The pasted product brief is authoritative. The Word proposal supplies context. The main journey is a shared event and time selection through SEE, UNDERSTAND and ANTICIPATE. Forecast and scenario routes open the same workspace in the appropriate mode; event URLs open independently addressable stories. Every dataset carries an evidence class separately from its verification status. All bundled scientific records are illustrative.

## Scientific hierarchy

NISAR product contract → preprocessed observation series → change metrics → supporting context → TerraCast trajectory and trigger rules → monitoring priorities → explanation. A GUNW line-of-sight signal does not independently prove vertical subsidence or its cause. GCOV disturbance does not independently prove vegetation loss; GOFF offsets need geometry and quality checks.

## Design system

Editorial warm white, near-black grotesk, deep forest cartography, cobalt observation, teal context, violet forecast, amber triggers. Large asymmetric home composition; map-dominant workspaces with compact controls and expandable details. Shared tokens, semantic elements, visible focus, accessible chart tables, keyboard split controls, reduced motion. No fabricated live status.

## Modules

- `src/data`: centralized typed demonstration catalog and official reference catalog.
- `src/lib`: pure validated trend, spread, threshold, scenario, explanation and persistence functions.
- `src/components/map`: lazy MapLibre base and deck.gl feature layers, graceful no-WebGL fallback.
- `src/components/workspace`: shared mode state, timeline, evidence, cascade, comparison, forecast and watch UI.
- `src/app`: Next.js App Router pages; static server-rendered supporting pages, client scientific workspaces.
- `backend`: optional FastAPI service over the same JSON contract, processing validation boundary and PostGIS schema.

## Data and forecasting

Demo observations are fixed, explicitly synthetic fixtures in realistic geographic contexts. Theil–Sen median pairwise slopes estimate the trend. A transparent sensitivity envelope uses measurement error plus slope dispersion and a minimum trend-sensitivity floor; it is not a calibrated probability interval. Scenario acceleration changes trajectory. Rain/moisture change contextual monitoring priorities, not measured displacement. Threshold windows are computed only for the selected measurement and censored beyond 90 days. No disaster prediction.

## Delivery

Next.js static export is portable and Vercel-ready; the demo has no required credentials or services. Watch state stays in this browser. The optional API supports validated event and scenario requests. Raw SAR preprocessing remains outside the browser. PostgreSQL/PostGIS is an integration schema, not a claimed running hosted database. No account, notification delivery, automatic NISAR polling or live weather ingestion is implied.
