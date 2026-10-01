"""Transparent demo engine. Pure Python; no raw SAR processing in request paths."""
from datetime import date
from statistics import median
from math import isfinite


def forecast(event: dict, scenario: dict) -> dict:
    for name in ("rainfall", "moisture", "acceleration"):
        value = scenario[name]
        if not isfinite(value) or not 0 <= value <= 100:
            raise ValueError(f"Invalid {name}")
    if scenario["horizon"] not in (0, 30, 60, 90):
        raise ValueError("Unsupported horizon")
    observations = event["observations"]
    if len(observations) < 3:
        raise ValueError("At least three observations are required")
    days = [(date.fromisoformat(o["date"]) - date.fromisoformat(observations[0]["date"])).days for o in observations]
    if any(not isfinite(o["value"]) or not isfinite(o["error"]) or o["error"] < 0 for o in observations):
        raise ValueError("Values and errors must be finite, with nonnegative errors")
    if any(days[i] <= days[i - 1] for i in range(1, len(days))):
        raise ValueError("Observation dates must increase")
    slopes = [(b["value"] - a["value"]) / (days[j] - days[i]) for i, a in enumerate(observations) for j, b in enumerate(observations) if j > i]
    slope = median(slopes)
    last = observations[-1]
    spread = max(median([abs(s - slope) for s in slopes]) * 1.4826, abs(slope) * .12, last["error"] / (days[-1] or 1))
    acceleration = scenario["acceleration"] / 100 * slope / 90

    def point(day):
        value = last["value"] + slope * day + .5 * acceleration * day * day
        envelope = last["error"] + spread * day + abs(.5 * acceleration * day * day) * .35
        return {"day": day, "value": value, "lower": value - envelope, "upper": value + envelope}

    def sign(n):
        return (n > 0) - (n < 0)

    persistence = sum(sign(o["value"] - observations[i]["value"]) == sign(slope) for i, o in enumerate(observations[1:])) / (len(observations) - 1)
    # Math.round parity for nonnegative indices.
    score = int(100 * (.35 * persistence + .25 * scenario["rainfall"] / 100 + .2 * scenario["moisture"] / 100 + .2 * scenario["acceleration"] / 100) + .5)
    negative = event["direction"] == "negative"

    def crossed(v):
        return v <= event["threshold"] if negative else v >= event["threshold"]

    early = late = None
    for day in range(91):
        p = point(day)
        if early is None and crossed(p["lower"] if negative else p["upper"]):
            early = day
        if late is None and crossed(p["upper"] if negative else p["lower"]):
            late = day
    return {"points": [point(day) for day in range(0, scenario["horizon"] + 1, 3)], "slope": slope, "spread": spread, "acceleration": acceleration, "persistence": persistence, "score": score, "priority": "Priority review" if score >= 65 else "Elevated" if score >= 45 else "Routine", "thresholdWindow": [early, late], "model": "Theil–Sen trend + sensitivity envelope"}
