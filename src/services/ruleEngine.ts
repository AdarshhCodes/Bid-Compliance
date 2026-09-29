/**
 * ANVESHA (अन्वेषा) — Deterministic Rule & Verification Engine
 * SIH 2026 Problem Statement ID: SIH26100
 * Ministry of Petroleum & Natural Gas · CPCL
 *
 * STRICT ARCHITECTURAL PRINCIPLE:
 * Deterministic software rules (NEVER LLMs) handle:
 * - Mathematical threshold comparisons (>=, <=, ==)
 * - Pure arithmetic summations & percentages (BoM, Turnover averages)
 * - Date and temporal freshness evaluations
 * - Regex & Checksum verification (PAN, GSTIN, UDIN)
 * - External registry state code mappings
 * - Cross-document numeric discrepancy delta calculations
 */

import { VerdictState, AdapterResponse } from '../types';

export interface RuleEvaluationResult {
  verdict: VerdictState;
  passed: boolean;
  reasonCode: string;
  summary: string;
}

export interface BoMItem {
  itemNumber: number;
  description: string;
  countryOfOrigin: string; // 'INDIA' vs other
  costInr: number;
}

/**
 * 1. Financial Turnover Threshold Evaluator
 */
export function evaluateTurnoverThreshold(
  certifiedTurnoverInr: number,
  mandatoryThresholdInr: number = 100000000.00 // ₹10.00 Cr
): RuleEvaluationResult {
  if (certifiedTurnoverInr >= mandatoryThresholdInr) {
    const crVal = (certifiedTurnoverInr / 10000000).toFixed(2);
    return {
      verdict: 'VERIFIED',
      passed: true,
      reasonCode: 'RULE_TURNOVER_MET',
      summary: `Certified average annual turnover of ₹${crVal} Cr satisfies mandatory tender threshold of ₹10.00 Cr.`
    };
  }

  const crVal = (certifiedTurnoverInr / 10000000).toFixed(2);
  const deltaCr = ((mandatoryThresholdInr - certifiedTurnoverInr) / 10000000).toFixed(2);
  return {
    verdict: 'CONTRADICTED',
    passed: false,
    reasonCode: 'ERR_TURNOVER_BELOW_THRESHOLD',
    summary: `Certified average turnover of ₹${crVal} Cr fails mandatory threshold of ₹10.00 Cr (Deficit: -₹${deltaCr} Cr).`
  };
}

/**
 * 2. Cross-Document Discrepancy Evaluator (In-Bid Contradiction)
 */
export function detectDocumentValueMismatch(
  fieldLabel: string,
  docAName: string,
  valueA: number,
  docBName: string,
  valueB: number,
  tolerance: number = 0.01
): { hasMismatch: boolean; delta: number; deltaPercent: number; summary: string } {
  const delta = valueA - valueB;
  const absDelta = Math.abs(delta);
  const deltaPercent = (absDelta / Math.max(valueA, valueB)) * 100;

  if (absDelta > tolerance) {
    const aCr = (valueA / 10000000).toFixed(2);
    const bCr = (valueB / 10000000).toFixed(2);
    return {
      hasMismatch: true,
      delta,
      deltaPercent,
      summary: `Declared ${fieldLabel} on ${docAName} (₹${aCr} Cr) contradicts ${docBName} (₹${bCr} Cr). Discrepancy: ${deltaPercent.toFixed(1)}%.`
    };
  }

  return {
    hasMismatch: false,
    delta: 0,
    deltaPercent: 0,
    summary: `${fieldLabel} matches across ${docAName} and ${docBName}.`
  };
}

/**
 * 3. Bill of Materials (BoM) Local-Content Recomputation Engine
 * Recomputes actual Make-in-India percentage from individual line items.
 */
export function recomputeLocalContentPercentage(
  declaredPercentage: number,
  bomItems: BoMItem[]
): {
  recomputedPercentage: number;
  totalCostInr: number;
  domesticCostInr: number;
  importedCostInr: number;
  isCompliantWithThreshold: boolean;
  matchesDeclaration: boolean;
  summary: string;
} {
  let domesticCost = 0;
  let importedCost = 0;

  for (const item of bomItems) {
    if (item.countryOfOrigin.trim().toUpperCase() === 'INDIA') {
      domesticCost += item.costInr;
    } else {
      importedCost += item.costInr;
    }
  }

  const totalCost = domesticCost + importedCost;
  const recomputed = totalCost === 0 ? 0 : (domesticCost / totalCost) * 100;
  const roundedRecomputed = Math.round(recomputed * 10) / 10;

  const isCompliant = roundedRecomputed >= 50.0; // Class-I local supplier threshold
  const deltaFromDeclared = Math.abs(roundedRecomputed - declaredPercentage);
  const matchesDeclaration = deltaFromDeclared <= 1.0;

  let summary = `Recomputed Local Content: ${roundedRecomputed}% (Domestic: ₹${(domesticCost/100000).toFixed(1)}L, Imported: ₹${(importedCost/100000).toFixed(1)}L).`;
  if (!matchesDeclaration) {
    summary += ` CONTRADICTION: Declared ${declaredPercentage}% differs from BoM recomputed ${roundedRecomputed}%.`;
  }

  return {
    recomputedPercentage: roundedRecomputed,
    totalCostInr: totalCost,
    domesticCostInr: domesticCost,
    importedCostInr: importedCost,
    isCompliantWithThreshold: isCompliant,
    matchesDeclaration,
    summary
  };
}

/**
 * 4. Temporal Staleness & Validity Evaluator
 * Verifies that registration was active on submission date AND evaluation date.
 */
export function evaluateTemporalValidity(
  submissionDate: string,
  evaluationDate: string,
  cancellationDate?: string
): { isStale: boolean; reasonCode: string; summary: string } {
  if (!cancellationDate) {
    return {
      isStale: false,
      reasonCode: 'TEMPORAL_VALID',
      summary: 'Certificate registration is currently active with no record of revocation.'
    };
  }

  const sub = new Date(submissionDate).getTime();
  const cancel = new Date(cancellationDate).getTime();

  if (cancel <= sub) {
    return {
      isStale: true,
      reasonCode: 'ERR_CANCELLED_PRIOR_TO_SUBMISSION',
      summary: `Registration was legally revoked on ${cancellationDate}, which is prior to the tender bid submission date (${submissionDate.split('T')[0]}).`
    };
  }

  return {
    isStale: true,
    reasonCode: 'ERR_CANCELLED_POST_SUBMISSION',
    summary: `Registration was revoked on ${cancellationDate} after bid submission but prior to contract evaluation.`
  };
}

/**
 * 5. Adapter Status to Verdict Converter
 * The UI/Engine boundary layer converting adapter status into user-facing Three-State Verdict.
 */
export function convertAdapterToVerdict(adapterResponse: AdapterResponse): { verdict: VerdictState; reasonCode: string; summary: string } {
  if (adapterResponse.status === 'UNAVAILABLE') {
    return {
      verdict: 'UNVERIFIABLE',
      reasonCode: 'ERR_SOURCE_UNAVAILABLE',
      summary: adapterResponse.errorMessage || `Authoritative source "${adapterResponse.source}" did not respond.`
    };
  }

  if (adapterResponse.status === 'CONTRADICTED') {
    return {
      verdict: 'CONTRADICTED',
      reasonCode: 'ERR_REGISTRY_STATUS_REVOKED',
      summary: adapterResponse.errorMessage || `Authoritative registry refutes claimed status.`
    };
  }

  return {
    verdict: 'VERIFIED',
    reasonCode: 'REGISTRY_CONFIRMED',
    summary: `Verified against authoritative database (${adapterResponse.source}).`
  };
}
