-- Optional PostGIS ingestion schema; not required by the bundled demonstration.
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE TABLE IF NOT EXISTS nisar_studies (
  id text PRIMARY KEY,
  name text NOT NULL,
  product text NOT NULL CHECK (product IN ('GUNW','GCOV','GOFF','GSLC','SME2')),
  boundary geometry(MultiPolygon, 4326),
  verification_status text NOT NULL CHECK (verification_status IN ('VERIFIED','ILLUSTRATIVE')),
  metadata jsonb NOT NULL
);
CREATE TABLE IF NOT EXISTS nisar_observations (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  study_id text REFERENCES nisar_studies(id),
  acquired_at timestamptz NOT NULL,
  reference_acquired_at timestamptz,
  granule_id text,
  source_url text,
  processing_version text NOT NULL,
  value double precision NOT NULL,
  unit text NOT NULL,
  quality jsonb NOT NULL,
  verification_status text NOT NULL CHECK (verification_status IN ('VERIFIED','ILLUSTRATIVE')),
  CHECK (verification_status <> 'VERIFIED' OR (granule_id IS NOT NULL AND source_url IS NOT NULL)),
  UNIQUE (study_id, acquired_at, processing_version)
);
CREATE INDEX IF NOT EXISTS studies_boundary_gist ON nisar_studies USING gist (boundary);
