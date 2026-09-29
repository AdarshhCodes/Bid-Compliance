/**
 * ANVESHA (अन्वेषा) — Verification Service
 * Manages deterministic requirement verifications, contradictions, and officer overrides.
 */

import { Verification, Contradiction, OfficerAction, VerdictState } from '../types';
import { MOCK_CONTRADICTIONS } from '../data/mockTenderData';
import { recordAuditEvent } from './auditService';

// In-memory runtime verification findings cache
let verificationStore: Verification[] = [
  // Bidder 1 (Clean baseline)
  {
    id: 'VRF-B1-REQ1',
    bidId: 'BID-7701-B1',
    bidderId: 'BIDDER-001',
    requirementId: 'REQ-001',
    verdict: 'VERIFIED',
    confidence: 0.98,
    reasonCode: 'RULE_TURNOVER_MET',
    verdictSummary: 'Certified average annual turnover of ₹16.50 Cr satisfies mandatory threshold of ₹10.00 Cr.',
    primaryEvidenceId: 'EVD-B1-TURNOVER',
    evaluatedAt: '2026-09-29T10:14:10Z'
  },
  // Bidder 2 (Turnover Contradiction)
  {
    id: 'VRF-B2-REQ1',
    bidId: 'BID-7701-B2',
    bidderId: 'BIDDER-002',
    requirementId: 'REQ-001',
    verdict: 'CONTRADICTED',
    confidence: 0.99,
    reasonCode: 'ERR_CROSS_DOC_CONTRADICTION',
    verdictSummary: 'Declared turnover on Bid Cover Letter (₹12.00 Cr) refutes CA Certificate (₹9.00 Cr). Certified ₹9.00 Cr fails mandatory threshold of ₹10.00 Cr.',
    primaryEvidenceId: 'EVD-B2-CACERT-TURNOVER',
    contradictionId: 'CTR-001',
    evaluatedAt: '2026-09-29T10:14:22Z'
  },
  // Bidder 3 (Udyam Revocation)
  {
    id: 'VRF-B3-REQ3',
    bidId: 'BID-7701-B3',
    bidderId: 'BIDDER-003',
    requirementId: 'REQ-003',
    verdict: 'CONTRADICTED',
    confidence: 1.0,
    reasonCode: 'ERR_REGISTRY_STATUS_REVOKED',
    verdictSummary: 'Udyam Certificate was officially CANCELLED on the National Registry on 31-Aug-2026 prior to tender submission.',
    primaryEvidenceId: 'EVD-B3-UDYAM-DOC',
    contradictionId: 'CTR-002',
    evaluatedAt: '2026-09-29T10:14:28Z'
  },
  // Bidder 6 (OEM Scope Mismatch)
  {
    id: 'VRF-B6-REQ5',
    bidId: 'BID-7701-B6',
    bidderId: 'BIDDER-006',
    requirementId: 'REQ-005',
    verdict: 'CONTRADICTED',
    confidence: 0.96,
    reasonCode: 'ERR_OEM_SCOPE_MISMATCH',
    verdictSummary: 'OEM authorization letter authorizes residential plumbing valves, completely failing refinery API-6D specification.',
    primaryEvidenceId: 'EVD-B6-OEM-LETTER',
    contradictionId: 'CTR-003',
    evaluatedAt: '2026-09-29T10:14:35Z'
  },
  // Bidder 7 (GST Adapter Timeout)
  {
    id: 'VRF-B7-REQ2',
    bidId: 'BID-7701-B7',
    bidderId: 'BIDDER-007',
    requirementId: 'REQ-002',
    verdict: 'UNVERIFIABLE',
    confidence: 0.0,
    reasonCode: 'ERR_ADAPTER_TIMEOUT_504',
    verdictSummary: 'GSTN Gateway API timed out (504 Gateway Timeout). External registry unreachable after 3 retries. Routed to Officer Priority Queue.',
    evaluatedAt: '2026-09-29T10:14:45Z'
  }
];

export async function getVerificationsForBid(bidId: string): Promise<Verification[]> {
  await new Promise(r => setTimeout(r, 40));
  return verificationStore.filter(v => v.bidId === bidId);
}

export async function getContradictionsForTender(tenderId: string): Promise<Contradiction[]> {
  await new Promise(r => setTimeout(r, 40));
  return MOCK_CONTRADICTIONS;
}

export async function recordOfficerOverride(
  verificationId: string,
  officerId: string,
  officerName: string,
  newVerdict: VerdictState,
  overrideReasonCategory: string,
  justification: string
): Promise<OfficerAction> {
  const vIndex = verificationStore.findIndex(v => v.id === verificationId);
  if (vIndex !== -1) {
    verificationStore[vIndex].verdict = newVerdict;
    verificationStore[vIndex].verdictSummary += ` [OFFICER OVERRIDE: ${justification}]`;
  }

  const action: OfficerAction = {
    id: `ACT-${Date.now()}`,
    verificationId,
    bidderId: verificationStore[vIndex]?.bidderId || 'UNKNOWN',
    officerId,
    officerName,
    action: newVerdict === 'VERIFIED' ? 'OVERRIDE_TO_VERIFIED' : 'OVERRIDE_TO_CONTRADICTED',
    overrideReasonCategory,
    justification,
    committedAt: new Date().toISOString()
  };

  // Commit to Cryptographic Audit Ledger
  await recordAuditEvent({
    actorType: 'OFFICER_USER',
    actorId: officerId,
    eventType: 'OFFICER_VERDICT_OVERRIDE',
    payload: {
      actionId: action.id,
      verificationId,
      newVerdict,
      overrideReasonCategory,
      justification
    }
  });

  return action;
}
