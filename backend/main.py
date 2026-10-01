"""Optional API for TerraCascade. Run from repo root: uvicorn backend.main:app."""
from pathlib import Path
from typing import Literal
import json
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict
from .engine import forecast

ROOT = Path(__file__).resolve().parents[1]
EVENTS = json.loads((ROOT / "public/data/events.json").read_text(encoding="utf-8"))
EVENT_INDEX = {e["id"]: e for e in EVENTS}
app = FastAPI(title="TerraCascade", version="1.0.0", description="NISAR-first illustrative research scenarios. No live data connection or official hazard warnings.")
app.add_middleware(CORSMiddleware, allow_origins=os.getenv("TERRACASCADE_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(","), allow_methods=["GET", "POST"], allow_headers=["Content-Type"], allow_credentials=False)


class Scenario(BaseModel):
    model_config = ConfigDict(extra="forbid", allow_inf_nan=False)
    rainfall: float = Field(default=35, ge=0, le=100)
    moisture: float = Field(default=45, ge=0, le=100)
    acceleration: float = Field(default=0, ge=0, le=100)
    horizon: Literal[0, 30, 60, 90] = 60


class ForecastRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    eventId: str = Field(max_length=50)
    scenario: Scenario = Field(default_factory=Scenario)


def get_event(event_id):
    if event_id not in EVENT_INDEX:
        raise HTTPException(status_code=404, detail="Study not found")
    return EVENT_INDEX[event_id]


@app.get("/health")
def health():
    return {"status": "ok", "dataStatus": "ILLUSTRATIVE", "catalogVersion": "1.0.0", "liveNisarConnected": False}


@app.get("/events")
def events():
    return EVENTS


@app.get("/events/{event_id}")
def event_detail(event_id: str):
    return get_event(event_id)


@app.get("/events/{event_id}/evidence")
def evidence(event_id: str):
    return get_event(event_id)["evidence"]


@app.post("/forecast")
def project(body: ForecastRequest):
    event = get_event(body.eventId)
    return {"eventId": event["id"], "dataStatus": event["status"], "evidenceId": event["evidence"][-1]["id"], "result": forecast(event, body.scenario.model_dump())}


@app.post("/scenario")
def scenario(body: ForecastRequest):
    return project(body)
