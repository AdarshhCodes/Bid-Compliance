"""
PRAMAAN (प्रमाण) — Python Pydantic Models
SIH 2026 Problem Statement ID: SIH26100
Ministry of Petroleum & Natural Gas · CPCL

Core Philosophy: Probabilistic AI extracts structured evidence;
Deterministic rules evaluate verdicts; Officers decide.
"""

from enum import Enum
from typing import Optional, List, Dict, Any, Tuple
from pydantic import BaseModel, Field
from datetime import datetime


class VerdictState(str, Enum):
    VERIFIED = "VERIFIED"
    CONTRADICTED = "CONTRADICTED"
    UNVERIFIABLE = "UNVERIFIABLE"
    PENDING_REVIEW = "PENDING_REVIEW"


class ProvenanceBadge(str, Enum):
    REAL = "REAL"
    SYNTHETIC = "SYNTHETIC"
    MOCK = "MOCK"
    CACHED = "CACHED"
    USER_PROVIDED = "USER_PROVIDED"
    DERIVED = "DERIVED"


class RequirementCategory(str, Enum):
    STATUTORY = "STATUTORY"
    FINANCIAL = "FINANCIAL"
    TECHNICAL = "TECHNICAL"
    PREFERENCE = "PREFERENCE"
    INTEGRITY = "INTEGRITY"


class RuleType(str, Enum):
    THRESHOLD = "THRESHOLD"
    EXACT_MATCH = "EXACT_MATCH"
    REGISTRY_STATUS = "REGISTRY_STATUS"
    ARITHMETIC_RECOMPUTE = "ARITHMETIC_RECOMPUTE"
    DOCUMENT_EXISTS = "DOCUMENT_EXISTS"
    SEMANTIC_MATCH = "SEMANTIC_MATCH"


class AdapterStatus(str, Enum):
    VERIFIED = "VERIFIED"
    CONTRADICTED = "CONTRADICTED"
    UNAVAILABLE = "UNAVAILABLE"


class SignalType(str, Enum):
    SHARED_BANK_ACCOUNT = "SHARED_BANK_ACCOUNT"
    SHARED_DIRECTOR_DIN = "SHARED_DIRECTOR_DIN"
    SHARED_PHYSICAL_ADDRESS = "SHARED_PHYSICAL_ADDRESS"
    SHARED_PHONE_EMAIL = "SHARED_PHONE_EMAIL"
    BOILERPLATE_TEXT_SIMILARITY = "BOILERPLATE_TEXT_SIMILARITY"
    SHARED_DOCUMENT_METADATA = "SHARED_DOCUMENT_METADATA"


class BankAccount(BaseModel):
    account_number: str
    ifsc_code: str
    bank_name: str
    branch_name: str


class Director(BaseModel):
    din: str
    name: str
    designation: str
    appointment_date: str


class Evidence(BaseModel):
    id: str
    document_id: str
    bidder_id: str
    page_number: int
    bounding_box: Tuple[float, float, float, float]  # [ymin, xmin, ymax, xmax]
    claim_field: str
    extracted_value: Any
    raw_text_snippet: str
    extraction_confidence: float
    provenance_type: str
    provenance_badge: ProvenanceBadge = ProvenanceBadge.SYNTHETIC
    extracted_at: datetime


class AdapterResponse(BaseModel):
    status: AdapterStatus
    source: str
    evidence: Any
    checked_at: datetime
    confidence: float
    reference_id: str
    error_message: Optional[str] = None
    is_demo_data: bool = True


class Verification(BaseModel):
    id: str
    bid_id: str
    bidder_id: str
    requirement_id: str
    claim_id: Optional[str] = None
    verdict: VerdictState
    confidence: float
    reason_code: str
    verdict_summary: str
    primary_evidence_id: Optional[str] = None
    adapter_response: Optional[AdapterResponse] = None
    contradiction_id: Optional[str] = None
    evaluated_at: datetime


class Contradiction(BaseModel):
    id: str
    bid_id: str
    bidder_id: str
    requirement_id: str
    title: str
    evidence_a_id: str
    evidence_b_id: Optional[str] = None
    adapter_reference_id: Optional[str] = None
    value_a: str
    value_b: str
    delta_description: str
    severity: str
    flagged_at: datetime


class Relationship(BaseModel):
    id: str
    tender_id: str
    bidder_a_id: str
    bidder_b_id: str
    signal_type: SignalType
    shared_attribute_key: str
    shared_attribute_value: str
    similarity_score: Optional[float] = None
    description: str
    status: str
    discovered_at: datetime


class OfficerAction(BaseModel):
    id: str
    verification_id: str
    bidder_id: str
    officer_id: str
    officer_name: str
    action: str
    override_reason_category: Optional[str] = None
    justification: str = Field(min_length=30)
    committed_at: datetime


class AuditEvent(BaseModel):
    event_index: int
    event_id: str
    timestamp: datetime
    actor_type: str
    actor_id: str
    event_type: str
    payload: Dict[str, Any]
    previous_hash: str
    current_hash: str
