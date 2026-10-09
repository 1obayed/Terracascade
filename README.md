TerraCascade

## See the change. Understand the chain. Anticipate what comes next.

TerraCascade is a NISAR-powered Earth intelligence and forecasting platform developed by Team Voyage for the NASA International Space Apps Challenge 2026 under the challenge Dancing with the SARs.

Most Earth-observation platforms show what has already happened.

TerraCascade goes one step further.

It uses repeated NISAR observations to study how Earth's surface is changing, connects those changes with environmental conditions, and creates forward-looking research scenarios to help identify what may deserve attention next.

> NISAR observes the change.  
> TerraCascade understands the chain.  
> TerraCast anticipates what may come next.


## Live Demo

https://terracascade-eight.vercel.app/


## The Idea

TerraCascade is built around three simple questions.

### SEE

What is changing?

Users can explore NISAR-based surface-change signals through interactive maps, observation checkpoints, time-series analysis, before-and-after comparison, and Change DNA.

### UNDERSTAND

Why does this change matter?

TerraCascade connects the observed NISAR signal with supporting information such as terrain, rainfall, soil moisture, drainage, persistence, and environmental conditions.

The Cascade View helps explain how one change may connect with another.

### ANTICIPATE

What may happen next?

This is the main idea behind TerraCascade.

TerraCast uses the historical change signal to explore possible future trajectories, environmental triggers, uncertainty, monitoring priorities, and conditional scenarios.

The goal is not to claim that a disaster will definitely happen.

The goal is to help people recognize important signals earlier and understand what may need closer monitoring or preparation.


## What Makes TerraCascade Different?

TerraCascade is not designed as another satellite-data dashboard.

A traditional workflow may stop here:

Satellite observation  
↓  
Change detected  
↓  
Change displayed on a map

TerraCascade continues the process:

NISAR Observation  
↓  
Surface Change  
↓  
Temporal Trend  
↓  
Environmental Context  
↓  
TerraCast  
↓  
Future Scenario  
↓  
Monitoring Priority

This turns Earth observation into a more forward-looking experience.


## Main Features

### Earth Pulse

An interactive geospatial workspace for exploring different Earth-change studies.

### NISAR Time Travel

Move through repeated observation checkpoints and see how the selected signal changes over time.

### Change DNA

Summarizes characteristics such as:

- magnitude
- direction
- persistence
- rate
- acceleration
- observation duration
- data quality

### Cascade View

Connects the original NISAR signal with supporting environmental conditions and possible next-stage concerns.

### TerraCast

The forecasting component of TerraCascade.

It uses the historical change trajectory to create conditional future scenarios with visible uncertainty.

### Future Twin

Compares the latest Earth state with a projected future state.

Users can explore different horizons such as:

- Now
- +30 days
- +60 days
- +90 days

### What-If Lab

Allows users to test different scenarios by changing conditions such as:

- rainfall
- soil moisture
- trend acceleration
- forecast horizon

The rest of the system updates based on the selected scenario.

### Future Hotspots

Highlights places that may deserve additional monitoring under the current scenario.

### Watch This Place

Allows users to save a study and scenario for later review.

### Ask Terra

An AI-focused explanation experience that helps users understand scientific evidence, uncertainty, forecasts, and scenarios in simpler language.


## TerraCast

TerraCast is the anticipation engine inside TerraCascade.

Its workflow begins with the Earth-change history:

Repeated observations  
↓  
Trend analysis  
↓  
Persistence  
↓  
Acceleration  
↓  
Projected trajectory  
↓  
Environmental triggers  
↓  
Future scenario  
↓  
Monitoring priority

TerraCast is designed to explore how an observed signal may continue.

It does not provide an exact disaster date or an official hazard warning.

Future projections are shown together with uncertainty so users can distinguish measured history from possible future conditions.


## AI in TerraCascade

AI is already part of the TerraCascade experience through Ask Terra and the ANTICIPATE interface.

Its role is to help people understand the scientific information produced by the platform.

The intended structure is:

Scientific Data  
↓  
Scientific Processing  
↓  
Structured Evidence  
↓  
TerraCast  
↓  
AI Explanation  
↓  
User

The AI layer should explain the science, not invent it.

### Current AI Status

The Ask Terra interface, interaction flow, scenario suggestions, and explanation system are already integrated into TerraCascade.

The current prototype uses local explanation logic and simulated AI responses.

A production AI model is not yet connected.

The next step is therefore not to build the AI feature again, but to connect a real AI model to the existing Ask Terra system.


## Project Scenarios

TerraCascade demonstrates the same SEE, UNDERSTAND, ANTICIPATE workflow across several types of Earth change.

### The Sinking City

Urban surface deformation using a GUNW-style displacement scenario.

This is the main TerraCascade demonstration.

### After the Fire

Post-fire surface disturbance using a GCOV-style radar backscatter scenario.

### A Shifting Waterline

Wetland and water-boundary change using a GCOV-style scenario.

### Ice in Motion

Glacier movement using a GOFF-style surface-motion scenario.


## NISAR at the Core

NISAR is the primary Earth-observation foundation of TerraCascade.

The project is designed around products including:

### GUNW

Used conceptually for:

- displacement
- deformation
- interferometric analysis

### GCOV

Used conceptually for:

- radar backscatter
- surface disturbance
- inundation-related analysis
- vegetation and ecosystem change

### GOFF

Used conceptually for:

- surface motion
- glacier movement
- large displacement

GSLC and SME2 are also considered for future expansion where scientifically appropriate.

Supporting environmental datasets are used to help understand and anticipate change, but they do not replace NISAR as the primary observation source.


## Evidence and Transparency

TerraCascade separates information based on its scientific role.

Evidence can be classified as:

- Observed
- Derived
- Contextual
- Forecast

The platform also separates actual data status from evidence type.

Possible statuses include:

- Verified
- Demo
- Illustrative
- Simulated
- Scenario

This distinction helps prevent demonstration data from being mistaken for verified real-world observations.


## Current Limitations

TerraCascade is currently a research and competition prototype.

Some important limitations remain:

- Current bundled scientific measurements are illustrative.
- A complete live NISAR ingestion pipeline is not yet connected.
- TerraCast currently uses an interpretable trend-based forecasting approach.
- Forecast uncertainty has not yet been scientifically calibrated for operational use.
- Rainfall and moisture trigger inputs are currently demonstration inputs.
- Ask Terra is integrated, but a production AI model is not yet connected.
- Future Hotspots are demonstration monitoring outputs, not official hazard zones.
- Watch This Place currently stores information locally rather than providing cloud alerts.

These limitations are intentionally communicated inside the project instead of being hidden from users.


## Future Work

The next major development is to connect TerraCascade with real scientific services while preserving the current transparent workflow.

Planned work includes:

### Real NISAR Integration

Connect at least one reviewed real NISAR study with proper acquisition information, quality metadata, provenance, and scientific validation.

### Automated Data Pipeline

Develop a pipeline for discovering, processing, validating, and preparing new NISAR observations for TerraCascade.

### Environmental Data Connections

Connect supporting data sources such as:

- NASA SMAP
- NASA GEOS-FP
- NASA FIRMS
- elevation and terrain data
- rainfall and hydrological information

These sources will remain supporting context around the NISAR signal.

### AI Model Connection

Connect a real AI model to the existing Ask Terra interface.

The model will receive structured and validated scientific information rather than being asked to make conclusions directly from raw satellite imagery.

Future AI development will also include:

- evidence grounding
- numerical validation
- source checking
- uncertainty awareness
- safe scenario actions
- fallback handling

### Forecast Validation

Evaluate TerraCast using real historical observations and compare future predictions against later measurements.

This will include:

- prediction-error analysis
- temporal validation
- location-based validation
- bias analysis
- uncertainty calibration
- scientific review

### Machine-Learning Forecasting

Explore learned forecasting approaches after enough real observations are available.

Potential directions include:

- time-series forecasting
- anomaly detection
- surface-change classification
- spatial forecasting
- ensemble models

Any learned model should first be compared with the existing transparent statistical baseline.

### Persistent Monitoring

Future versions may expand Watch This Place into an active monitoring system with:

- cloud watchlists
- new-observation checking
- updated monitoring priorities
- push notifications
- email alerts


## Technology

TerraCascade is built with:

- Next.js
- React
- TypeScript
- Tailwind CSS
- MapLibre GL
- deck.gl
- D3
- FastAPI
- Python

Future scientific processing may use tools such as NumPy, Xarray, Rasterio, GDAL, GeoPandas, SciPy, scikit-learn, and statsmodels where required.


## System Concept

NISAR  
↓  
Observation Engine  
↓  
Change Engine  
↓  
Understanding Engine  
↓  
TerraCast  
↓  
Future Engine  
↓  
TerraCascade Experience

Supporting environmental information enters mainly during the UNDERSTAND and ANTICIPATE stages.

The final experience includes:

- Earth Pulse
- Time Travel
- Change DNA
- Cascade View
- TerraCast
- Future Twin
- What-If Lab
- Future Hotspots
- Watch This Place
- Ask Terra


## Human Impact

Behind every disaster map, there are people.

There are families, homes, and lives that can change in only a few minutes.

We may not be able to stop every natural process.

But if we can understand important changes earlier, people may have more time to prepare, move to safety, protect infrastructure, and protect the people they care about.

That is the idea behind TerraCascade.

We do not want to only show what has already happened.

We want to understand what is happening now and help people prepare for what may come next.


## Team Voyage

TerraCascade was developed by Team Voyage.

Md Obayed Reza Hridoy  
Team Lead and System Architect

Siam Abdullah  
ML Research Lead

Tasir Rahman  
Web Developer and UI/UX Designer

Meherub Mahmud Shahed  
Storytelling, Pitch and Strategy Lead

Jannatul Ferdous Choya  
Creative Lead


## Disclaimer

TerraCascade is an independent NASA Space Apps Challenge 2026 project.

It is not an official NASA or ISRO product.

The current platform is a research and demonstration prototype.

TerraCast scenarios, Future Hotspots, monitoring priorities, and threshold windows should not be interpreted as official hazard warnings.


# TerraCascade

## See the change.
## Understand the chain.
## Anticipate what comes next.
