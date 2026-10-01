"""Validate an external preprocessed record without upgrading its scientific status.

This is a contract validator, not a raw SAR processor or scientific verifier.
Usage: python backend/validate_processed.py path/to/record.json
"""
import argparse
import json
from math import isfinite
from datetime import date


def validate(record):
    for key in ("id", "product", "unit", "coordinates", "observations", "status", "processingVersion", "crs", "referenceConvention"):
        if key not in record:
            raise ValueError(f"Missing {key}")
    if record["product"] not in ("GUNW", "GCOV", "GOFF", "GSLC", "SME2"):
        raise ValueError("Unsupported product")
    if record["status"] not in ("VERIFIED", "ILLUSTRATIVE"):
        raise ValueError("Explicit verification status is required")
    if record["crs"] != "EPSG:4326":
        raise ValueError("Web contract coordinates must be EPSG:4326")
    coordinates = record["coordinates"]
    if len(coordinates) != 2 or not all(isfinite(n) for n in coordinates) or not (-180 <= coordinates[0] <= 180 and -90 <= coordinates[1] <= 90):
        raise ValueError("Coordinates must be finite longitude/latitude")
    previous = None
    if len(record["observations"]) < 3:
        raise ValueError("At least three chronological observations are required")
    for obs in record["observations"]:
        acquired = date.fromisoformat(obs["date"])
        if previous and acquired <= previous:
            raise ValueError("Dates must increase")
        previous = acquired
        if not isfinite(obs["value"]) or not isfinite(obs["error"]) or obs["error"] < 0:
            raise ValueError("Invalid value or error")
        if record["status"] == "VERIFIED" and not all(obs.get(k) for k in ("granuleId", "sourceUrl", "qualityMask", "processingVersion")):
            raise ValueError("Verified records require per-acquisition granule, source, quality mask and processing version")
    return {"schemaValid": True, "scientificallyVerifiedByValidator": False, "id": record["id"]}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("record")
    args = parser.parse_args()
    print(json.dumps(validate(json.load(open(args.record, encoding="utf-8"))), indent=2))
