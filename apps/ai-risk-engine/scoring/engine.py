"""
Lumora Risk Scoring Engine

Weighted multi-factor scoring model.
Each factor is normalized to 0–100 and combined with a weight.
The final score maps to a letter grade.
"""

from .models import ScoringRequest, ScoringResponse, RiskFactor, RiskGrade


# Grade thresholds (score → grade)
GRADE_THRESHOLDS: list[tuple[float, RiskGrade]] = [
    (90, "AAA"),
    (82, "AA"),
    (74, "A"),
    (65, "BBB"),
    (55, "BB"),
    (44, "B"),
    (30, "CCC"),
    (0,  "D"),
]

# Factor weights (must sum to 1.0)
WEIGHTS = {
    "repayment_history":        0.22,
    "milestone_completion":     0.18,
    "treasury_health":          0.15,
    "wallet_activity":          0.10,
    "revenue_consistency":      0.12,
    "kyc_level":                0.08,
    "governance_participation": 0.07,
    "dispute_penalty":          0.08,  # negative factor
}


def _grade(score: float) -> RiskGrade:
    for threshold, grade in GRADE_THRESHOLDS:
        if score >= threshold:
            return grade
    return "D"


def _clamp(value: float, lo: float = 0.0, hi: float = 100.0) -> float:
    return max(lo, min(hi, value))


class RiskScoringEngine:
    def score(self, req: ScoringRequest) -> ScoringResponse:
        factors: list[RiskFactor] = []

        # 1. Repayment history
        repayment_score = req.historical_repayment_rate * 100
        if req.total_projects > 0:
            success_rate = req.successful_projects / req.total_projects
            repayment_score = (repayment_score * 0.6 + success_rate * 100 * 0.4)
        factors.append(RiskFactor(
            name="Repayment History",
            weight=WEIGHTS["repayment_history"],
            raw_value=req.historical_repayment_rate,
            normalized_score=_clamp(repayment_score),
            impact="positive",
        ))

        # 2. Milestone completion
        milestone_score = req.milestone_completion_rate * 100
        factors.append(RiskFactor(
            name="Milestone Completion Rate",
            weight=WEIGHTS["milestone_completion"],
            raw_value=req.milestone_completion_rate,
            normalized_score=_clamp(milestone_score),
            impact="positive",
        ))

        # 3. Treasury health (funding progress)
        funding_progress = (req.raised_amount / req.target_amount) if req.target_amount > 0 else 0
        treasury_score = _clamp(funding_progress * 100)
        factors.append(RiskFactor(
            name="Treasury Health",
            weight=WEIGHTS["treasury_health"],
            raw_value=funding_progress,
            normalized_score=treasury_score,
            impact="positive",
        ))

        # 4. Wallet activity
        tx_score = _clamp(min(req.transaction_count / 500, 1.0) * 100)
        age_score = _clamp(min(req.wallet_age_days / 730, 1.0) * 100)
        wallet_score = tx_score * 0.5 + age_score * 0.5
        factors.append(RiskFactor(
            name="Wallet Activity",
            weight=WEIGHTS["wallet_activity"],
            raw_value=req.transaction_count,
            normalized_score=_clamp(wallet_score),
            impact="positive",
        ))

        # 5. Revenue consistency
        rev_score = req.revenue_consistency_score * 100
        factors.append(RiskFactor(
            name="Revenue Consistency",
            weight=WEIGHTS["revenue_consistency"],
            raw_value=req.revenue_consistency_score,
            normalized_score=_clamp(rev_score),
            impact="positive",
        ))

        # 6. KYC level
        kyc_score = (req.kyc_level / 3) * 100
        factors.append(RiskFactor(
            name="KYC Level",
            weight=WEIGHTS["kyc_level"],
            raw_value=float(req.kyc_level),
            normalized_score=_clamp(kyc_score),
            impact="positive",
        ))

        # 7. Governance participation
        gov_score = req.governance_participation_rate * 100
        factors.append(RiskFactor(
            name="Governance Participation",
            weight=WEIGHTS["governance_participation"],
            raw_value=req.governance_participation_rate,
            normalized_score=_clamp(gov_score),
            impact="positive",
        ))

        # 8. Dispute penalty (negative)
        dispute_penalty = _clamp(req.dispute_count * 15)  # -15 pts per dispute
        dispute_score = _clamp(100 - dispute_penalty)
        factors.append(RiskFactor(
            name="Dispute Penalty",
            weight=WEIGHTS["dispute_penalty"],
            raw_value=float(req.dispute_count),
            normalized_score=dispute_score,
            impact="negative" if req.dispute_count > 0 else "neutral",
        ))

        # Weighted sum
        total_score = sum(f.normalized_score * f.weight for f in factors)
        total_score = _clamp(total_score)

        grade = _grade(total_score)

        # Confidence: higher with more data points
        data_completeness = sum([
            req.total_projects > 0,
            req.transaction_count > 0,
            req.wallet_age_days > 0,
            req.historical_repayment_rate > 0,
            req.milestone_completion_rate > 0,
            req.kyc_level > 0,
        ]) / 6
        confidence = round(0.5 + data_completeness * 0.5, 2)

        summary = (
            f"Pool {req.pool_id} scored {total_score:.1f}/100 ({grade}). "
            f"Key drivers: repayment history ({repayment_score:.0f}), "
            f"milestone completion ({milestone_score:.0f}), "
            f"treasury health ({treasury_score:.0f}). "
            f"Confidence: {confidence:.0%}."
        )

        return ScoringResponse(
            pool_id=req.pool_id,
            grade=grade,
            score=round(total_score, 2),
            confidence=confidence,
            factors=factors,
            summary=summary,
        )
