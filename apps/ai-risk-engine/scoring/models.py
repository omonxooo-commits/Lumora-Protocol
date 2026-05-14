from pydantic import BaseModel, Field
from typing import Optional, Literal

RiskGrade = Literal["AAA", "AA", "A", "BBB", "BB", "B", "CCC", "D"]


class ScoringRequest(BaseModel):
    pool_id: str
    issuer_address: str

    # Financial health
    target_amount: float = Field(..., gt=0)
    raised_amount: float = Field(..., ge=0)
    roi_percent: float = Field(..., ge=0, le=200)
    duration_days: int = Field(..., gt=0)

    # Issuer history
    total_projects: int = Field(default=0, ge=0)
    successful_projects: int = Field(default=0, ge=0)
    historical_repayment_rate: float = Field(default=0.0, ge=0.0, le=1.0)

    # On-chain activity
    wallet_age_days: int = Field(default=0, ge=0)
    transaction_count: int = Field(default=0, ge=0)
    governance_participation_rate: float = Field(default=0.0, ge=0.0, le=1.0)

    # Milestone data
    milestone_completion_rate: float = Field(default=0.0, ge=0.0, le=1.0)
    dispute_count: int = Field(default=0, ge=0)

    # Revenue consistency (0–1)
    revenue_consistency_score: float = Field(default=0.5, ge=0.0, le=1.0)

    # KYC level (0–3)
    kyc_level: int = Field(default=0, ge=0, le=3)

    # Optional override
    category: Optional[str] = None


class RiskFactor(BaseModel):
    name: str
    weight: float
    raw_value: float
    normalized_score: float  # 0–100
    impact: Literal["positive", "negative", "neutral"]


class ScoringResponse(BaseModel):
    pool_id: str
    grade: RiskGrade
    score: float = Field(..., ge=0, le=100)
    confidence: float = Field(..., ge=0.0, le=1.0)
    factors: list[RiskFactor]
    summary: str
