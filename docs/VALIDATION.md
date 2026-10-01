# Validation record

Final source checks on October 1, 2026:

| Check | Result |
| --- | --- |
| TypeScript type checking | Passed |
| Vitest scientific model, evidence and simulated AI preview tests | 35 passed |
| Python API and validation tests | 8 passed |
| Next.js production static export | Passed; 13 generated pages |
| Playwright and axe suite | Included, not executed |

Earlier browser inspection verified the homepage and explorer navigation, regional scientific map overlays, observation checkpoint changes, coherence-layer values, forecast metrics, and keyboard adjustment of the before/after split. Desktop layouts were visually inspected. These checks found and led to fixes for the MapLibre worker path, deck.gl adapter compatibility, a basemap requiring a key, and SVG hydration.

The final browser pass was interrupted by the browser security policy rejecting access to a stale preview tab. Complete watchlist, Ask Terra, guided-story, mobile and accessibility regression checks therefore remain unverified. Responsive styles, semantic controls, keyboard-operable ranges, native modal dialogs, focus states, reduced-motion styling and data-table alternatives are implemented; this is not an accessibility certification.

No validation against real NISAR observations or calibrated hazard outcomes has been performed. The Python test client emits an upstream HTTPX deprecation warning; all eight tests pass.

The AI preview update passed the production build (including TypeScript) and all 35 Vitest tests. Added checks cover all four locations, ensure wetter scenarios preserve trajectory values, confirm acceleration changes are reversible, preserve caller settings, and check that explanations use the selected result with resolvable evidence. The browser journey for the preview is included but was not executed; visual and interaction verification of this addition remains outstanding.
