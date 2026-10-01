export type EvidenceClass = 'OBSERVED' | 'DERIVED' | 'CONTEXTUAL' | 'FORECAST';
export type DataStatus = 'VERIFIED' | 'ILLUSTRATIVE';
export type Mode = 'see' | 'understand' | 'anticipate';
export type Horizon = 0 | 30 | 60 | 90;
export type NisarProduct = 'GUNW' | 'GCOV' | 'GOFF' | 'GSLC' | 'SME2';
export interface Observation {
  date: string;
  value: number;
  coherence: number;
  backscatter: number;
  error: number;
}
export interface Evidence {
  id: string;
  label: string;
  type: EvidenceClass;
  status: DataStatus;
  source: string;
  dataset: string;
  date: string;
  method: string;
  unit: string;
  assumption: string;
  limitation: string;
  relationship: string;
  sourceUrl: string;
}
export interface WatchArea {
  id: string;
  name: string;
  offset: [number, number];
  sensitivity: number;
  rationale: string;
}
export interface EarthEvent {
  id: string;
  name: string;
  location: string;
  category: string;
  coordinates: [number, number];
  description: string;
  product: NisarProduct;
  variable: string;
  unit: string;
  direction: 'negative' | 'positive';
  threshold: number;
  observations: Observation[];
  status: DataStatus;
  quality: string;
  context: string[];
  limitations: string[];
  watchAreas: WatchArea[];
  evidence: Evidence[];
  nextCheckpoint: string;
  checkpointNote: string;
}
export interface Scenario {
  rainfall: number;
  moisture: number;
  acceleration: number;
  horizon: Horizon;
}
export interface ForecastPoint {
  day: number;
  value: number;
  lower: number;
  upper: number;
}
export interface Forecast {
  points: ForecastPoint[];
  slope: number;
  acceleration: number;
  persistence: number;
  spread: number;
  priority: 'Routine' | 'Elevated' | 'Priority review';
  score: number;
  thresholdWindow: [number | null, number | null];
  model: string;
}
export interface WatchRecord {
  eventId: string;
  savedAt: string;
  scenario: Scenario;
  triggers: string[];
}
