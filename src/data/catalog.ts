import type { EarthEvent, Evidence, NisarProduct, Scenario } from './types';
export const DEMO_TODAY = '2026-09-24';
export const DEFAULT_SCENARIO: Scenario = {
  rainfall: 35,
  moisture: 45,
  acceleration: 0,
  horizon: 60,
};
export const PRODUCT_URL = 'https://nisar-docs.asf.alaska.edu/products-overview/';
export const PRODUCTS: Record<NisarProduct, { name: string; role: string; usage: string }> = {
  GUNW: {
    name: 'Geocoded Unwrapped Interferogram',
    role: 'Displacement & interferometric coherence',
    usage: 'Flagship demonstration contract',
  },
  GCOV: {
    name: 'Geocoded Polarimetric Covariance',
    role: 'Terrain-corrected radar backscatter',
    usage: 'Wetland and disturbance demonstrations',
  },
  GOFF: {
    name: 'Geocoded Pixel Offsets',
    role: 'Dense surface-motion offsets',
    usage: 'Glacier demonstration contract',
  },
  GSLC: {
    name: 'Geocoded Single Look Complex',
    role: 'Complex radar signal for advanced analysis',
    usage: 'Future ingestion support; not used in the demo',
  },
  SME2: {
    name: 'Soil Moisture Product',
    role: 'Soil-moisture context where appropriate',
    usage: 'Catalog reference; not ingested in the demo',
  },
};
const dates = ['2026-08-19', '2026-08-31', '2026-09-12', DEMO_TODAY];
type Seed = Omit<
  EarthEvent,
  'observations' | 'evidence' | 'status' | 'quality' | 'nextCheckpoint' | 'checkpointNote'
> & { values: number[]; error: number };
const seeds: Seed[] = [
  {
    id: 'jakarta',
    name: 'The Sinking City',
    location: 'North Jakarta, Indonesia',
    category: 'Ground deformation',
    coordinates: [106.82, -6.12],
    product: 'GUNW',
    variable: 'Relative LOS displacement',
    unit: 'mm',
    direction: 'negative',
    threshold: -60,
    values: [-4, -11, -19, -27],
    error: 2,
    description:
      'Follow a radar displacement signal across four illustrative checkpoints. Explore how a persistent trajectory could intersect with low terrain and drainage sensitivity.',
    context: ['Low terrain', 'Drainage sensitivity', 'Rainfall & antecedent moisture'],
    limitations: [
      'Line-of-sight displacement is not vertical subsidence. Orbit geometry and independent validation are required.',
      'The four values and all spatial footprints are synthetic. No NISAR granule has been ingested.',
      'Rainfall does not directly alter the projected radar displacement in this model.',
    ],
    watchAreas: [
      {
        id: 'coastal',
        name: 'Coastal sector',
        offset: [-0.018, 0.024],
        sensitivity: 0.9,
        rationale: 'Illustrative low-terrain and drainage overlap.',
      },
      {
        id: 'inland',
        name: 'Inland corridor',
        offset: [0.025, -0.018],
        sensitivity: 0.6,
        rationale: 'Persistent simulated signal; contextual sensitivity is lower.',
      },
      {
        id: 'east',
        name: 'Eastern sector',
        offset: [0.055, 0.008],
        sensitivity: 0.75,
        rationale: 'Review the next observation for signal persistence.',
      },
    ],
  },
  {
    id: 'sierra',
    name: 'After the Fire',
    location: 'Sierra Nevada, California',
    category: 'Surface disturbance',
    coordinates: [-119.45, 37.35],
    product: 'GCOV',
    variable: 'Backscatter change from reference',
    unit: 'dB',
    direction: 'negative',
    threshold: -5,
    values: [-0.4, -1.2, -1.8, -2.1],
    error: 0.35,
    description:
      'Start with a changing radar response. Add illustrative fire and slope context to examine where a rainfall window could warrant closer observation.',
    context: ['Fire-event context', 'Slope sensitivity', 'Rainfall & antecedent moisture'],
    limitations: [
      'Radar backscatter responds to moisture and geometry as well as disturbance. It does not independently establish burn severity.',
      'This synthetic series is not an observed fire event or a landslide forecast.',
    ],
    watchAreas: [
      {
        id: 'slope',
        name: 'Western slope',
        offset: [-0.02, 0.015],
        sensitivity: 0.85,
        rationale: 'Illustrative disturbed-surface and steep-slope overlap.',
      },
      {
        id: 'valley',
        name: 'Valley margin',
        offset: [0.03, -0.02],
        sensitivity: 0.6,
        rationale: 'A comparison sector for subsequent radar acquisitions.',
      },
      {
        id: 'ridge',
        name: 'Ridge sector',
        offset: [0.052, 0.028],
        sensitivity: 0.45,
        rationale: 'Lower illustrative contextual sensitivity.',
      },
    ],
  },
  {
    id: 'sundarbans',
    name: 'A Shifting Waterline',
    location: 'Sundarbans, Bangladesh',
    category: 'Wetland change',
    coordinates: [89.56, 22.02],
    product: 'GCOV',
    variable: 'Backscatter change from reference',
    unit: 'dB',
    direction: 'negative',
    threshold: -4,
    values: [-0.3, -0.8, -1.4, -1.7],
    error: 0.3,
    description:
      'Explore repeated changes in radar response along a wetland margin. Separate a possible hydrological signal from a claim of ecosystem loss.',
    context: [
      'Tidal & hydrological context',
      'Land-cover boundaries',
      'Rainfall & antecedent moisture',
    ],
    limitations: [
      'Backscatter is not a direct water-depth, wetland-loss or boundary-position measurement. Tides and vegetation must be accounted for.',
      'Wetland footprints and hydrological conditions are illustrative.',
    ],
    watchAreas: [
      {
        id: 'estuary',
        name: 'Estuary margin',
        offset: [-0.02, 0.01],
        sensitivity: 0.8,
        rationale: 'Illustrative radar-change and hydrological-context overlap.',
      },
      {
        id: 'interior',
        name: 'Interior wetland',
        offset: [0.04, -0.025],
        sensitivity: 0.55,
        rationale: 'Compare future acquisitions at matched tidal states.',
      },
      {
        id: 'channel',
        name: 'Channel edge',
        offset: [0.018, 0.042],
        sensitivity: 0.7,
        rationale: 'Review consistency along the illustrative channel margin.',
      },
    ],
  },
  {
    id: 'alaska',
    name: 'Ice in Motion',
    location: 'Malaspina Glacier, Alaska',
    category: 'Glacier movement',
    coordinates: [-140.55, 59.92],
    product: 'GOFF',
    variable: 'Cumulative along-flow offset',
    unit: 'm',
    direction: 'positive',
    threshold: 50,
    values: [2, 8, 15, 23],
    error: 1.4,
    description:
      'Trace an illustrative motion history using the GOFF product contract. Explore short-term continuation and the growing uncertainty of a moving ice surface.',
    context: ['Glacier geometry', 'Surface-melt conditions', 'Seasonal temperature context'],
    limitations: [
      'Offsets require geolocation, matching quality and geometric interpretation before conversion to physical velocity.',
      'Rain and moisture controls are exploratory context here; they do not represent a glacier-flow model.',
    ],
    watchAreas: [
      {
        id: 'front',
        name: 'Glacier front',
        offset: [-0.02, -0.02],
        sensitivity: 0.8,
        rationale: 'Illustrative motion signal near the terminus.',
      },
      {
        id: 'center',
        name: 'Central flowline',
        offset: [0.028, 0.035],
        sensitivity: 0.65,
        rationale: 'Track whether the motion trajectory persists.',
      },
      {
        id: 'margin',
        name: 'Eastern margin',
        offset: [0.07, 0.006],
        sensitivity: 0.5,
        rationale: 'Compare geometry and offset matching quality.',
      },
    ],
  },
];
function evidenceFor(e: Seed): Evidence[] {
  const common = { status: 'ILLUSTRATIVE' as const, date: DEMO_TODAY, sourceUrl: PRODUCT_URL };
  return [
    {
      ...common,
      id: `${e.id}-signal`,
      label: `NISAR ${e.product} observation contract`,
      type: 'OBSERVED',
      source: `NASA–ISRO NISAR ${e.product} • synthetic fixture`,
      dataset: `DEMO-${e.product}-${e.id.toUpperCase()}-V1 (not a granule ID)`,
      method: 'Four manually specified illustrative observations; no satellite scene processed.',
      unit: e.unit,
      assumption: 'The example emulates a quality-controlled, co-registered time series.',
      limitation: e.limitations[0],
      relationship: 'Repeated acquisitions allow a temporal trend to be estimated.',
    },
    {
      ...common,
      id: `${e.id}-trend`,
      label: 'Persistent temporal signal',
      type: 'DERIVED',
      source: `Illustrative ${e.product} time series`,
      dataset: 'TerraCascade demo catalog v1',
      method:
        'Theil–Sen median pairwise slope; persistence = fraction of consecutive changes with the trend direction.',
      unit: `${e.unit}/day`,
      assumption: 'Reference frame and processing are consistent between acquisitions.',
      limitation:
        'Four synthetic observations cannot establish a real-world trend or statistically robust acceleration.',
      relationship: 'Context helps interpret which continuation scenarios merit attention.',
    },
    {
      ...common,
      id: `${e.id}-context`,
      label: e.context[0],
      type: 'CONTEXTUAL',
      source: 'Illustrative environmental context; planned DEM / terrain integration',
      dataset: 'Synthetic contextual sensitivity v1',
      method: 'Explicit demonstration sensitivity assigned to each example watch sector.',
      unit: 'dimensionless',
      assumption: 'Environmental layers overlap the radar-change footprint.',
      limitation: 'No terrain raster, infrastructure or exposure inventory has been loaded.',
      relationship:
        'Terrain and system sensitivity condition the relevance of environmental triggers.',
    },
    {
      ...common,
      id: `${e.id}-trigger`,
      label: e.context[2],
      type: 'CONTEXTUAL',
      source: 'Simulated environmental trigger; planned NASA GEOS-FP / SMAP context',
      dataset: 'Synthetic 10-day trigger sequence v1',
      method:
        'A user-selected intensity profile across days 1–10. Values represent a sensitivity index, not mm of rainfall.',
      unit: 'index / 100',
      assumption: 'A hypothetical trigger overlaps a persistent surface-change signal.',
      limitation: 'No current weather forecast or SMAP measurement is connected.',
      relationship:
        'Trigger strength changes monitoring priority; it does not establish a hazard probability.',
      sourceUrl: 'https://gmao.gsfc.nasa.gov/gmao-products/geos-near-real-time-data-products/',
    },
    {
      ...common,
      id: `${e.id}-forecast`,
      label: 'Next-stage watch area',
      type: 'FORECAST',
      source: `TerraCast from illustrative NISAR ${e.product} history`,
      dataset: 'TerraCast research scenario v1',
      method:
        'Anchored median-slope extrapolation plus optional scenario acceleration; sensitivity envelope grows with horizon.',
      unit: e.unit,
      assumption: 'Historical change continues under the selected trend assumption.',
      limitation:
        'The envelope is uncalibrated model sensitivity, not a statistical confidence interval. Watch boundaries are synthetic.',
      relationship: 'Check the next acquisition and seek independent measurements before acting.',
    },
  ];
}
export const EVENTS: EarthEvent[] = seeds.map((e) => ({
  ...e,
  status: 'ILLUSTRATIVE',
  quality: 'Synthetic • unvalidated',
  observations: e.values.map((value, i) => ({
    date: dates[i],
    value,
    error: e.error,
    coherence: [0.88, 0.86, 0.83, 0.81][i],
    backscatter: [-8.2, -8.5, -8.8, -9.1][i],
  })),
  evidence: evidenceFor(e),
  nextCheckpoint: '2026-10-06',
  checkpointNote: 'Illustrative +12-day checkpoint, not a confirmed acquisition schedule.',
}));
export const getEvent = (id: string) => EVENTS.find((e) => e.id === id);
export const SOURCES = [
  {
    name: 'NASA–ISRO NISAR',
    role: 'Primary observation mission',
    url: 'https://nisar.jpl.nasa.gov/',
    status: 'Mission reference',
    description: 'Repeated synthetic-aperture radar observations of a changing Earth.',
  },
  {
    name: 'NISAR Data User Guide / ASF',
    role: 'Product definitions & access',
    url: PRODUCT_URL,
    status: 'Technical reference',
    description:
      'GUNW, GCOV, GOFF, GSLC and soil-moisture product descriptions. The demo uses product contracts, not downloaded measurements.',
  },
  {
    name: 'NASA Earthdata Search',
    role: 'NISAR discovery pathway',
    url: 'https://search.earthdata.nasa.gov/',
    status: 'Planned ingestion',
    description:
      'Discover acquisition metadata and source granules. Authentication and regional availability must be checked during integration.',
  },
  {
    name: 'NASA GEOS-FP',
    role: 'Supporting trigger context',
    url: 'https://gmao.gsfc.nasa.gov/gmao-products/geos-near-real-time-data-products/',
    status: 'Not connected',
    description: 'Experimental atmospheric analyses and forecasts for research context.',
  },
  {
    name: 'NASA SMAP',
    role: 'Supporting soil-moisture context',
    url: 'https://smap.jpl.nasa.gov/',
    status: 'Not connected',
    description:
      'Soil-moisture information can describe antecedent conditions; it is not the primary detection signal.',
  },
  {
    name: 'NASA FIRMS',
    role: 'Supporting fire context',
    url: 'https://firms.modaps.eosdis.nasa.gov/',
    status: 'Not connected',
    description: 'Active-fire context for a NISAR-led surface-disturbance story.',
  },
  {
    name: 'Natural Earth',
    role: 'Geographic basemap',
    url: 'https://www.naturalearthdata.com/',
    status: 'Bundled cartography',
    description:
      'Public-domain small-scale country geometry via world-atlas. This is a basemap, not radar data.',
  },
  {
    name: 'OpenStreetMap',
    role: 'Optional detailed basemap',
    url: 'https://www.openstreetmap.org/copyright',
    status: 'Online basemap',
    description:
      'Street and land context only. Local country geometry remains available when network tiles fail.',
  },
];
