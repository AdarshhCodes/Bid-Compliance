/**
 * ANVESHA (अन्वेषा) — Canonical Type Definitions
 * SIH 2026 Problem Statement ID: SIH26100
 * Ministry of Petroleum & Natural Gas · CPCL
 *
 * Core Principle: Evidence is first-class, typed relational data.
 * AI produces structured extraction; Deterministic rules produce verdicts; Officers decide.
 */

// ==========================================
// 1. Core Enums & Verdict State Machine
// ==========================================

export type VerdictState = 
  | 'VERIFIED'       // Grounded in evidence, passes deterministic threshold & registry
  | 'CONTRADICTED'   // Direct conflict between docs, failed threshold, or revoked registry
  | 'UNVERIFIABLE'   // Source timeout, missing document, or unreadable scan
  | 'PENDING_REVIEW';// Low extraction confidence or requires human officer determination

export type ProvenanceBadge =
  | 'REAL'
  | 'SYNTHETIC'
  | 'MOCK'
  | 'CACHED'
  | 'USER_PROVIDED'
  | 'DERIVED';

export type RequirementCategory =
  | 'STATUTORY'
  | 'FINANCIAL'
  | 'TECHNICAL'
  | 'PREFERENCE'
  | 'INTEGRITY';

export type RuleType =
  | 'THRESHOLD'
  | 'EXACT_MATCH'
  | 'REGISTRY_STATUS'
  | 'ARITHMETIC_RECOMPUTE'
  | 'DOCUMENT_EXISTS'
  | 'SEMANTIC_MATCH';

export type DocumentType =
  | 'GST_CERT'
  | 'UDYAM_CERT'
  | 'CA_TURNOVER_CERT'
  | 'BALANCE_SHEET'
  | 'OEM_AUTHORIZATION'
  | 'MII_DECLARATION'
  | 'PAN_CARD'
  | 'DEBARMENT_AFFIDAVIT'
  | 'TECHNICAL_PROPOSAL'
  | 'BID_COVER_LETTER'
  | 'BILL_OF_MATERIALS';

export type SignalType =
  | 'SHARED_BANK_ACCOUNT'
  | 'SHARED_DIRECTOR_DIN'
  | 'SHARED_PHYSICAL_ADDRESS'
  | 'SHARED_PHONE_EMAIL'
  | 'BOILERPLATE_TEXT_SIMILARITY'
  | 'SHARED_DOCUMENT_METADATA';

export type AdapterStatus = 'VERIFIED' | 'CONTRADICTED' | 'UNAVAILABLE';

// ==========================================
// 2. Core Entities
// ==========================================

/** Master Public Tender issued on GeM by CPCL */
export interface Tender {
  id: string; // e.g., 'CPCL/2026/VALVES-7701'
  title: string;
  issuingAuthority: string; // 'Chennai Petroleum Corporation Limited (CPCL)'
  publishedDate: string; // ISO-8601
  closingDate: string; // ISO-8601
  evaluationDate: string; // ISO-8601
  estimatedValueInr: number; // e.g. 185000000 (18.5 Cr)
  category: 'GOODS' | 'SERVICES' | 'WORKS';
  status: 'DRAFT' | 'PUBLISHED' | 'UNDER_EVALUATION' | 'AWARDED';
  biddersCount: number;
  mandatoryRequirementsCount: number;
}

/** Clause in tender tender document */
export interface Clause {
  id: string;
  clauseReference: string; // e.g., 'Clause 4.2'
  title: string;
  rawText: string;
  isMandatory: boolean;
}

/** Requirement derived from Clause */
export interface Requirement {
  id: string;
  tenderId: string;
  clauseId: string;
  clauseReference: string;
  title: string;
  category: RequirementCategory;
  ruleType: RuleType;
  ruleDefinition: {
    field?: string;
    operator?: '>=' | '<=' | '==' | '!=' | 'IN' | 'STATUS_ACTIVE';
    threshold?: number | string | boolean;
    unit?: string;
    description: string;
  };
  isMandatory: boolean;
}

/** Bank Account associated with Bidder */
export interface BankAccount {
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
}

/** Corporate Director associated with Bidder */
export interface Director {
  din: string;
  name: string;
  designation: string;
  appointmentDate: string;
}

/** Bidder Commercial Entity */
export interface Bidder {
  id: string; // 'BIDDER-001'
  legalName: string;
  nameAliases?: string[]; // For entity resolution across documents
  canonicalNameNote?: string;
  pan: string;
  gstin: string;
  udyamNumber?: string;
  registeredAddress: string;
  phone: string;
  email: string;
  bankAccount: BankAccount;
  directors: Director[];
  documentsCount: number;
  overallTriageRank: number; // Uncertainty x Materiality ranking
}

/** Submitted Bid Packet for a Tender */
export interface Bid {
  id: string;
  tenderId: string;
  bidderId: string;
  submissionTimestamp: string;
  declaredTurnoverInr?: number;
  declaredMiiPercentage?: number;
  overallVerdict: VerdictState;
  unverifiableCount: number;
  contradictedCount: number;
  verifiedCount: number;
}

/** Document attachment uploaded in bid packet */
export interface Document {
  id: string;
  bidId: string;
  bidderId: string;
  filename: string;
  sha256Hash: string;
  classifiedType: DocumentType;
  pageCount: number;
  isDigitalPdf: boolean; // false if scanned needing OCR
  storageUri: string;
  adversarialFlag?: boolean; // Prompt injection directive detected
  uploadedAt: string;
}

/** Atomic First-Class Evidence Record */
export interface Evidence {
  id: string; // 'EVD-...'
  documentId: string;
  bidderId: string;
  pageNumber: number;
  boundingBox: [number, number, number, number]; // [ymin, xmin, ymax, xmax] normalized 0..1
  claimField: string;
  extractedValue: any;
  rawTextSnippet: string;
  extractionConfidence: number; // 0.00 to 1.00
  provenanceType: 'PDF_NATIVE_TEXT' | 'OCR_EXTRACTION' | 'TABLE_PARSER' | 'REGISTRY_API';
  provenanceBadge: ProvenanceBadge;
  extractedAt: string;
}

/** Claim made by bidder in submissions */
export interface Claim {
  id: string;
  bidderId: string;
  requirementId: string;
  field: string;
  statedValue: any;
  documentId: string;
  pageNumber: number;
  sourceType: 'BID_FORM' | 'COVER_LETTER' | 'DECLARATION';
}

/** External Authoritative Registry Source */
export interface Source {
  id: string;
  name: string; // 'GSTN Gateway', 'Udyam Registration Portal', etc.
  type: 'GST' | 'UDYAM' | 'MCA' | 'EPFO' | 'BLACKLIST';
  mode: 'LIVE' | 'MOCK_DEMO';
  healthStatus: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
  lastPing: string;
}

/** Standard Polymorphic Adapter Response Contract */
export interface AdapterResponse {
  status: AdapterStatus; // 'VERIFIED' | 'CONTRADICTED' | 'UNAVAILABLE'
  source: string;
  evidence: any;
  checked_at: string;
  confidence: number;
  reference_id: string;
  errorMessage?: string;
  isDemoData: boolean; // Always true for hackathon
}

/** Deterministic Verification Record */
export interface Verification {
  id: string;
  bidId: string;
  bidderId: string;
  requirementId: string;
  claimId?: string;
  verdict: VerdictState; // VERIFIED | CONTRADICTED | UNVERIFIABLE | PENDING_REVIEW
  confidence: number;
  reasonCode: string;
  verdictSummary: string;
  primaryEvidenceId?: string;
  adapterResponse?: AdapterResponse;
  contradictionId?: string;
  evaluatedAt: string;
}

/** Cross-Document or Document-Registry Contradiction */
export interface Contradiction {
  id: string;
  bidId: string;
  bidderId: string;
  requirementId: string;
  title: string;
  evidenceAId: string;
  evidenceBId?: string;
  adapterReferenceId?: string;
  valueA: string;
  valueB: string;
  deltaDescription: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFORMATIONAL';
  flaggedAt: string;
}

/** Cross-Bidder Relationship Signal */
export interface Relationship {
  id: string;
  tenderId: string;
  bidderAId: string;
  bidderBId: string;
  signalType: SignalType;
  sharedAttributeKey: string;
  sharedAttributeValue: string;
  similarityScore?: number;
  description: string;
  status: 'FLAGGED_FOR_OFFICER' | 'CONFIRMED_BENIGN' | 'REFERRED_TO_VIGILANCE';
  discoveredAt: string;
}

/** Anomaly flag (e.g., prompt injection, duplicate invoice numbering) */
export interface Anomaly {
  id: string;
  tenderId: string;
  bidderId: string;
  documentId?: string;
  anomalyType: 'PROMPT_INJECTION' | 'METADATA_WORKSTATION_MATCH' | 'UDIN_INVALID';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  snippet?: string;
  detectedAt: string;
}

/** Officer Intervention & Override Action */
export interface OfficerAction {
  id: string;
  verificationId: string;
  bidderId: string;
  officerId: string;
  officerName: string;
  action: 'ACCEPT_SYSTEM_VERDICT' | 'OVERRIDE_TO_VERIFIED' | 'OVERRIDE_TO_CONTRADICTED' | 'REQUEST_CLARIFICATION';
  overrideReasonCategory?: string;
  justification: string; // Minimum 30 characters required
  committedAt: string;
}

/** Cryptographic Hash-Chained Audit Record */
export interface AuditEvent {
  eventIndex: number; // 1, 2, 3...
  eventId: string;
  timestamp: string;
  actorType: 'SYSTEM_ENGINE' | 'AI_SERVICE' | 'REGISTRY_ADAPTER' | 'OFFICER_USER';
  actorId: string;
  eventType: string;
  payload: any;
  previousHash: string; // SHA-256
  currentHash: string;  // SHA-256(index + previousHash + timestamp + payloadHash)
}
