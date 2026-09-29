/**
 * ANVESHA (अन्वेषा) — Tamper-Evident Audit Ledger Service
 * SIH 2026 Problem Statement SIH26100 · Ministry of Petroleum & Natural Gas · CPCL
 *
 * Implements a real, immutable cryptographic hash-chain ledger.
 * Content Hash: CurrentHash = SHA256(index + "|" + previousHash + "|" + timestamp + "|" + eventType + "|" + payloadHash)
 * Labeled plainly as a "Tamper-Evident Hash Chain", never "blockchain".
 */

import { AuditEvent, OfficerAction } from '../types';

// In-memory store for active session audit events
let auditLogStore: AuditEvent[] = [];
let isInitialized = false;

// Canonical officer overrides state store
export interface OfficerOverrideState {
  bidderId: string;
  requirementId: string;
  action: 'ACCEPT_SYSTEM_VERDICT' | 'OVERRIDE_TO_VERIFIED' | 'OVERRIDE_TO_CONTRADICTED' | 'REQUEST_CLARIFICATION' | 'RERUN_VERIFICATION';
  justification: string;
  officerId: string;
  officerName: string;
  timestamp: string;
  auditEventId: string;
  auditHash: string;
  ruleVersion: string;
  modelVersion: string;
}

const officerOverridesMap: Record<string, OfficerOverrideState> = {};

// Event listeners for reactive component updates
type AuditChangeListener = () => void;
const listeners: Set<AuditChangeListener> = new Set();

export function subscribeToAuditChanges(listener: AuditChangeListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyAuditListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Audit listener error:', e);
    }
  });
}

/**
 * Standard WebCrypto SHA-256 computation (Native, Zero external dependencies)
 */
export async function computeSha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Initialize canonical seed audit trail for CPCL Tender CPCL/2026/VALVES-7701
 */
async function initializeSeedAuditTrail() {
  if (isInitialized) return;
  isInitialized = true;

  const seedEvents = [
    {
      actorType: 'SYSTEM_ENGINE' as const,
      actorId: 'ANVESHA_ORCHESTRATOR_V1',
      eventType: 'TENDER_INGESTED',
      timestamp: '2026-09-29T10:00:00Z',
      payload: {
        tenderId: 'CPCL/2026/VALVES-7701',
        title: 'Procurement of High-Pressure API-6D Ball Valves & Pipeline Fittings',
        issuingAuthority: 'Chennai Petroleum Corporation Limited (CPCL)',
        estimatedValueInr: 185000000.0,
        requirementsCount: 6,
        biddersCount: 7,
        ruleVersion: 'v1.4'
      }
    },
    {
      actorType: 'AI_SERVICE' as const,
      actorId: 'LAYOUTLM_PARSER_V2',
      eventType: 'CLAUSE_EXTRACTED',
      timestamp: '2026-09-29T10:05:12Z',
      payload: {
        clauseReference: 'Clause 4.2',
        clauseTitle: 'Financial Turnover Criteria',
        requirementId: 'REQ-001',
        thresholdValue: 100000000.0,
        isMandatory: true,
        ruleDefinition: 'Average 3-year turnover >= 10.00 Cr duly certified by CA with valid UDIN'
      }
    },
    {
      actorType: 'AI_SERVICE' as const,
      actorId: 'EXTRACTION_PIPELINE_CELERY_02',
      eventType: 'BID_FORM_PROCESSED',
      timestamp: '2026-09-29T10:14:10Z',
      payload: {
        bidderId: 'BIDDER-002',
        bidderName: 'Bharat Fluid Systems Private Limited',
        documentId: 'DOC-B2-BID-COVER',
        documentTitle: 'Bid_Cover_Letter_B2.pdf',
        pageNumber: 3,
        evidenceId: 'EVID-1021',
        extractedField: 'declared_turnover',
        extractedValue: 120000000.0,
        formattedValue: 'INR 12.00 Cr',
        boundingBox: [0.65, 0.2, 0.7, 0.6],
        confidence: 0.991,
        modelVersion: 'extractor-2.1'
      }
    },
    {
      actorType: 'AI_SERVICE' as const,
      actorId: 'EXTRACTION_PIPELINE_CELERY_04',
      eventType: 'CA_CERTIFICATE_PROCESSED',
      timestamp: '2026-09-29T10:14:22Z',
      payload: {
        bidderId: 'BIDDER-002',
        bidderName: 'Bharat Fluid Systems Private Limited',
        documentId: 'DOC-B2-CA-CERT',
        documentTitle: 'CA_Turnover_Certificate_B2.pdf',
        pageNumber: 2,
        evidenceId: 'EVID-1042',
        extractedField: 'certified_average_turnover',
        extractedValue: 90000000.0,
        formattedValue: 'INR 9.00 Cr',
        udin: '24089123AAAAA',
        udinStatus: 'VERIFIED_AUTHENTIC',
        boundingBox: [0.42, 0.58, 0.46, 0.88],
        confidence: 0.982,
        modelVersion: 'extractor-2.1'
      }
    },
    {
      actorType: 'SYSTEM_ENGINE' as const,
      actorId: 'DETERMINISTIC_RULE_ENGINE',
      eventType: 'CONTRADICTION_DETECTED',
      timestamp: '2026-09-29T10:14:25Z',
      payload: {
        bidderId: 'BIDDER-002',
        requirementId: 'REQ-001',
        contradictionId: 'CTR-001',
        claimA: { source: 'Bid Cover Letter (Page 3)', value: 120000000.0 },
        claimB: { source: 'CA Certificate with UDIN (Page 2)', value: 90000000.0 },
        deltaInr: -30000000.0,
        deltaPercent: '-25.0%',
        mandatoryThresholdInr: 100000000.0,
        verdict: 'CONTRADICTED',
        reason: 'Certified turnover (₹9.00 Cr) refutes declared claim (₹12.00 Cr) and fails mandatory tender threshold of ₹10.00 Cr.',
        ruleVersion: 'v1.4'
      }
    },
    {
      actorType: 'SYSTEM_ENGINE' as const,
      actorId: 'ATTENTION_TRIAGE_INDEX',
      eventType: 'OFFICER_REVIEW_QUEUED',
      timestamp: '2026-09-29T10:14:30Z',
      payload: {
        reviewItemId: 'REV-001',
        bidderId: 'BIDDER-002',
        requirementId: 'REQ-001',
        materiality: 'CRITICAL',
        uncertaintyIndex: 9.8,
        priorityRank: 'P1',
        suggestedNextAction: 'Review CA certificate vs bid form discrepancy and request physical verification under GTC 4.2'
      }
    }
  ];

  let prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
  for (let i = 0; i < seedEvents.length; i++) {
    const s = seedEvents[i];
    const index = i + 1;
    const payloadStr = JSON.stringify(s.payload);
    const payloadHash = await computeSha256(payloadStr);
    const blockHeader = `${index}|${prevHash}|${s.timestamp}|${s.eventType}|${payloadHash}`;
    const currHash = await computeSha256(blockHeader);

    auditLogStore.push({
      eventIndex: index,
      eventId: `evt_${String(index).padStart(4, '0')}`,
      timestamp: s.timestamp,
      actorType: s.actorType,
      actorId: s.actorId,
      eventType: s.eventType,
      payload: s.payload,
      previousHash: prevHash,
      currentHash: currHash
    });

    prevHash = currHash;
  }
}

/**
 * Get all audit events sorted newest first or chronological
 */
export async function getAuditLedger(chronological: boolean = false): Promise<AuditEvent[]> {
  await initializeSeedAuditTrail();
  const copy = [...auditLogStore];
  return chronological ? copy.sort((a, b) => a.eventIndex - b.eventIndex) : copy.sort((a, b) => b.eventIndex - a.eventIndex);
}

/**
 * Record a new AuditEvent with real SHA-256 hash chaining
 */
export async function recordAuditEvent(params: {
  actorType: 'SYSTEM_ENGINE' | 'AI_SERVICE' | 'REGISTRY_ADAPTER' | 'OFFICER_USER';
  actorId: string;
  eventType: string;
  payload: any;
}): Promise<AuditEvent> {
  await initializeSeedAuditTrail();

  const lastEvent = auditLogStore[auditLogStore.length - 1];
  const newIndex = lastEvent ? lastEvent.eventIndex + 1 : 1;
  const previousHash = lastEvent ? lastEvent.currentHash : '0000000000000000000000000000000000000000000000000000000000000000';
  const timestamp = new Date().toISOString();
  const eventId = `evt_${String(newIndex).padStart(4, '0')}_${Math.floor(100 + Math.random() * 900)}`;

  const payloadString = JSON.stringify(params.payload);
  const payloadHash = await computeSha256(payloadString);
  const blockHeader = `${newIndex}|${previousHash}|${timestamp}|${params.eventType}|${payloadHash}`;
  const currentHash = await computeSha256(blockHeader);

  const event: AuditEvent = {
    eventIndex: newIndex,
    eventId,
    timestamp,
    actorType: params.actorType,
    actorId: params.actorId,
    eventType: params.eventType,
    payload: params.payload,
    previousHash,
    currentHash
  };

  auditLogStore.push(event);
  notifyAuditListeners();
  return event;
}

/**
 * Record an official Officer Action / Override
 * Enforces mandatory typed justification and records real chained AuditEvent.
 */
export async function recordOfficerAction(params: {
  bidderId: string;
  requirementId: string;
  action: 'ACCEPT_SYSTEM_VERDICT' | 'OVERRIDE_TO_VERIFIED' | 'OVERRIDE_TO_CONTRADICTED' | 'REQUEST_CLARIFICATION' | 'RERUN_VERIFICATION';
  justification: string;
  officerId?: string;
  officerName?: string;
  previousVerdict?: string;
  newVerdict?: string;
}): Promise<{ auditEvent: AuditEvent; overrideState: OfficerOverrideState }> {
  // Enforce mandatory non-empty typed justification
  if (!params.justification || params.justification.trim().length < 15) {
    throw new Error('Mandatory statutory justification requires at least 15 characters before recording an officer determination.');
  }

  const officerId = params.officerId || 'CPCL-OFFICER-7749';
  const officerName = params.officerName || 'A. Sharma (Procurement Officer · CPCL)';
  const ruleVersion = 'v1.4';
  const modelVersion = 'extractor-2.1';

  // Compute snapshot hash of the justification and decision parameters
  const snapshotData = {
    bidderId: params.bidderId,
    requirementId: params.requirementId,
    action: params.action,
    justification: params.justification.trim(),
    officerId,
    timestamp: new Date().toISOString()
  };
  const snapshotHash = await computeSha256(JSON.stringify(snapshotData));

  // Commit real chained AuditEvent
  const auditEvent = await recordAuditEvent({
    actorType: 'OFFICER_USER',
    actorId: `${officerId} (${officerName})`,
    eventType: params.action === 'OVERRIDE_TO_VERIFIED' || params.action === 'OVERRIDE_TO_CONTRADICTED'
      ? 'OFFICER_OVERRIDE_SUBMITTED'
      : params.action === 'REQUEST_CLARIFICATION'
      ? 'CLARIFICATION_DISPATCHED_TO_BIDDER'
      : 'OFFICER_FINDING_ACCEPTED',
    payload: {
      bidderId: params.bidderId,
      requirementId: params.requirementId,
      action: params.action,
      justification: params.justification.trim(),
      previousVerdict: params.previousVerdict || 'CONTRADICTED',
      newVerdict: params.newVerdict || (params.action === 'OVERRIDE_TO_VERIFIED' ? 'VERIFIED' : 'CONTRADICTED'),
      officerId,
      officerName,
      ruleVersion,
      modelVersion,
      evidenceSnapshotHash: snapshotHash,
      statutoryReference: 'GFR 2017 Rule 173(xiv) & GeM GTC Clause 4.2'
    }
  });

  const overrideState: OfficerOverrideState = {
    bidderId: params.bidderId,
    requirementId: params.requirementId,
    action: params.action,
    justification: params.justification.trim(),
    officerId,
    officerName,
    timestamp: auditEvent.timestamp,
    auditEventId: auditEvent.eventId,
    auditHash: auditEvent.currentHash,
    ruleVersion,
    modelVersion
  };

  const key = `${params.bidderId}:${params.requirementId}`;
  officerOverridesMap[key] = overrideState;
  notifyAuditListeners();

  return { auditEvent, overrideState };
}

/**
 * Get active officer override for a bidder and requirement
 */
export function getOfficerOverride(bidderId: string, requirementId: string): OfficerOverrideState | null {
  const key = `${bidderId}:${requirementId}`;
  return officerOverridesMap[key] || null;
}

/**
 * Get all active officer overrides
 */
export function getAllOfficerOverrides(): Record<string, OfficerOverrideState> {
  return { ...officerOverridesMap };
}

/**
 * Build complete Decision Reconstruction Timeline for Bidder 2 Turnover Walkthrough Case
 */
export async function getDecisionReconstructionTimeline(): Promise<{
  events: {
    id: string;
    stepNumber: number;
    title: string;
    time: string;
    actor: string;
    status: 'COMPLETED' | 'FLAGGED' | 'IN_REVIEW' | 'OVERRIDE' | 'VERIFIED';
    ruleVersion?: string;
    modelVersion?: string;
    details: string;
    previousHash: string;
    currentHash: string;
    payloadSnippet: string;
    isOfficerAction?: boolean;
    justification?: string;
  }[];
  activeOverride: OfficerOverrideState | null;
}> {
  await initializeSeedAuditTrail();
  const rawEvents = await getAuditLedger(true); // Chronological

  // Check if an override has been recorded in this session for Bidder 2 REQ-001
  const b2Override = getOfficerOverride('BIDDER-002', 'REQ-001');

  // Format events for the vertical timeline
  const formattedEvents = rawEvents.map((evt, idx) => {
    let status: 'COMPLETED' | 'FLAGGED' | 'IN_REVIEW' | 'OVERRIDE' | 'VERIFIED' = 'COMPLETED';
    let title = evt.eventType;
    let details = '';

    if (evt.eventType === 'TENDER_INGESTED') {
      title = 'Tender Ingested & Requirements Initialized';
      details = 'CPCL/2026/VALVES-7701 ingested with 6 statutory clauses and 7 bidder packets.';
    } else if (evt.eventType === 'CLAUSE_EXTRACTED') {
      title = 'Clause 4.2 Financial Turnover Extracted';
      details = 'Mandatory threshold: Average 3-year turnover >= INR 10.00 Cr with valid UDIN.';
    } else if (evt.eventType === 'BID_FORM_PROCESSED') {
      title = 'Bid Form Processed (EVID-1021)';
      details = 'Bid Cover Letter (Page 3): Bidder declared INR 12.00 Cr annual turnover.';
    } else if (evt.eventType === 'CA_CERTIFICATE_PROCESSED') {
      title = 'CA Certificate Processed (EVID-1042)';
      details = 'Audited CA Certificate (Page 2, UDIN: 24089123AAAAA): Certified turnover INR 9.00 Cr.';
    } else if (evt.eventType === 'CONTRADICTION_DETECTED') {
      title = 'Contradiction Detected: ₹12 Cr vs ₹9 Cr';
      status = 'FLAGGED';
      details = 'Declared figure exceeds certified figure by ₹3.00 Cr (+33.3%). Certified fails ₹10 Cr cutoff.';
    } else if (evt.eventType === 'OFFICER_REVIEW_QUEUED') {
      title = 'Officer Review Queue Priority P1 Assigned';
      status = 'IN_REVIEW';
      details = 'Enqueued as REV-001. Ranked Priority 1 by Uncertainty × Materiality.';
    } else if (evt.eventType === 'OFFICER_OVERRIDE_SUBMITTED') {
      title = 'Officer Override Submitted & Recorded';
      status = 'OVERRIDE';
      details = `Determination: ${evt.payload.action} by ${evt.payload.officerId}. Justification permanently recorded in audit ledger.`;
    } else if (evt.eventType === 'OFFICER_FINDING_ACCEPTED') {
      title = 'Officer Accepted Contradiction Verdict';
      status = 'COMPLETED';
      details = `Disqualification confirmed by ${evt.payload.officerId}. Justification logged.`;
    }

    return {
      id: evt.eventId,
      stepNumber: idx + 1,
      title,
      time: evt.timestamp.substring(11, 19),
      actor: evt.actorId,
      status,
      ruleVersion: evt.payload?.ruleVersion || 'v1.4',
      modelVersion: evt.payload?.modelVersion || 'extractor-2.1',
      details,
      previousHash: evt.previousHash,
      currentHash: evt.currentHash,
      payloadSnippet: JSON.stringify(evt.payload, null, 2),
      isOfficerAction: evt.actorType === 'OFFICER_USER',
      justification: evt.payload?.justification
    };
  });

  return {
    events: formattedEvents,
    activeOverride: b2Override
  };
}
