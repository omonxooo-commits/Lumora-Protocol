"""
Lumora AI Risk Engine
FastAPI service that scores borrower/project risk and returns a grade + factor breakdown.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import uvicorn

from scoring.engine import RiskScoringEngine
from scoring.models import ScoringRequest, ScoringResponse

app = FastAPI(
    title="Lumora AI Risk Engine",
    description="AI-assisted risk scoring for RWA financing pools",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = RiskScoringEngine()


@app.get("/health")
def health():
    return {"status": "ok", "service": "lumora-risk-engine"}


@app.post("/score/pool", response_model=ScoringResponse)
def score_pool(request: ScoringRequest):
    """
    Score a financing pool and return a risk grade, numeric score,
    and per-factor breakdown.
    """
    try:
        result = engine.score(request)
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/score/batch")
def score_batch(requests: list[ScoringRequest]):
    """Score multiple pools in one call."""
    return [engine.score(r) for r in requests]


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
