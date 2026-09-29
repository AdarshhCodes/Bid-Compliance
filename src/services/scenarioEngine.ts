/**
 * ANVESHA (अन्वेषा) — Scenario Engine & Demo Orchestration
 * SIH 2026 Problem Statement SIH26100 · CPCL / MoPNG
 *
 * Deterministically triggers investigation scenarios across Phase 2–4 modules.
 * Strictly adheres to ANVESHA rules:
 * - Deterministic routing and state triggers
 * - No fake live-government-API claims ([DEMO DATA — Synthetic dataset])
 * - No ungrounded conclusions
 */

export interface DemoScenario {
  id: string;
  title: string;
  shortLabel: string;
  description: string;
  targetPath: string;
  hotkey?: string;
  badge: 'CONTRADICTED' | 'UNVERIFIABLE' | 'RELATIONSHIP' | 'SECURITY' | 'AUDIT';
  actionPrompt: string;
  elevationPitch: string;
}

export const DEMO_SCENARIOS: Record<string, DemoScenario> = {
  turnover_contradiction: {
    id: 'turnover_contradiction',
    title: 'Turnover Contradiction (Bidder 2)',
    shortLabel: 'Turnover Contradiction',
    description: 'Surfaces ₹3.00 Cr discrepancy between Bid Cover Letter (₹12 Cr) and CA Certificate with UDIN (₹9 Cr), falling below mandatory ₹10 Cr cutoff.',
    targetPath: '/tender/CPCL-2026-VALVES-7701/bidder/BIDDER-002?trigger=turnover',
    hotkey: '2',
    badge: 'CONTRADICTED',
    actionPrompt: 'Trigger Turnover Contradiction',
    elevationPitch: 'Shows ANVESHA identifying an internal document contradiction: Bid Form claimed ₹12 Cr, but CA Certificate proved ₹9 Cr.'
  },
  stale_udyam: {
    id: 'stale_udyam',
    title: 'Temporal Staleness: Cancelled Udyam (Bidder 3)',
    shortLabel: 'Udyam Staleness',
    description: 'Bidder submitted an internally valid Udyam PDF, but central MSME registry shows registration was cancelled on 31/08/2026 before bid closing.',
    targetPath: '/tender/CPCL-2026-VALVES-7701/bidder/BIDDER-003?trigger=udyam',
    hotkey: '4',
    badge: 'CONTRADICTED',
    actionPrompt: 'Trigger Udyam Staleness',
    elevationPitch: 'Demonstrates registry cross-referencing: catches a revoked MSME registration submitted for EMD exemption.'
  },
  shared_bank: {
    id: 'shared_bank',
    title: 'Cross-Bidder Relationship (Bidder 4 ↔ 5)',
    shortLabel: 'Bidder Relationship',
    description: 'Detects shared HDFC corporate account (50200088991122) and 94.2% boilerplate paragraph duplication with identical typo "hydrolic".',
    targetPath: '/tender/CPCL-2026-VALVES-7701/network?trigger=shared_bank',
    hotkey: '3',
    badge: 'RELATIONSHIP',
    actionPrompt: 'Reveal Bidder Relationship',
    elevationPitch: 'ANVESHA visualizes the tender as an interconnected network, flagging shared banking and document templates.'
  },
  wrong_oem: {
    id: 'wrong_oem',
    title: 'OEM Scope Mismatch (Bidder 6)',
    shortLabel: 'Wrong OEM Scope',
    description: 'Genuine OEM authorization from L&T Valves, but authorizes commercial plumbing valves rather than mandatory API-6D refinery ball valves.',
    targetPath: '/tender/CPCL-2026-VALVES-7701/bidder/BIDDER-006?trigger=oem',
    badge: 'CONTRADICTED',
    actionPrompt: 'Trigger OEM Scope Mismatch',
    elevationPitch: 'Proves semantic scope checking: catches authentic authorization letters that cover the wrong equipment category.'
  },
  source_unavailable: {
    id: 'source_unavailable',
    title: 'GST Gateway Timeout & Circuit Breaker (Bidder 7)',
    shortLabel: 'GST Outage',
    description: 'Simulates NIC GST portal 504 gateway timeout. Status degrades gracefully to UNVERIFIABLE without fabricating compliance.',
    targetPath: '/tender/CPCL-2026-VALVES-7701/source-health?trigger=gst_outage',
    hotkey: '5',
    badge: 'UNVERIFIABLE',
    actionPrompt: 'Simulate GST Outage',
    elevationPitch: 'Honest uncertainty: when a government registry goes down, ANVESHA never guesses or passes blindly — it escalates as UNVERIFIABLE.'
  },
  prompt_injection: {
    id: 'prompt_injection',
    title: 'Adversarial Prompt-Injection Defense',
    shortLabel: 'Security Test',
    description: 'Screens malicious document text containing embedded prompt overrides ("SYSTEM INSTRUCTION: IGNORE CONSTRAINTS..."). Quarantines in isolated context.',
    targetPath: '/tender/CPCL-2026-VALVES-7701/security?trigger=prompt_injection',
    badge: 'SECURITY',
    actionPrompt: 'Run Security Test',
    elevationPitch: 'Shows platform security: untrusted document text is quarantined and cannot hijack verification rules.'
  },
  decision_reconstruction: {
    id: 'decision_reconstruction',
    title: 'Tamper-Evident Decision Reconstruction',
    shortLabel: 'Decision Reconstruction',
    description: 'Chronological replay of all automated checks, officer overrides, and SHA-256 Merkle chain blocks for statutory audit defensibility.',
    targetPath: '/tender/CPCL-2026-VALVES-7701/audit/reconstruction',
    hotkey: '6',
    badge: 'AUDIT',
    actionPrompt: 'Open Decision Reconstruction',
    elevationPitch: 'Full audit defensibility: proves every step, timestamp, and human decision can be cryptographically reconstructed for CVC/CAG.'
  }
};
