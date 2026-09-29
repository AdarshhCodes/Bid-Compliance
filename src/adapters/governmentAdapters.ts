/**
 * ANVESHA (अन्वेषा) — Polymorphic Government Registry Adapters
 * SIH 2026 Problem Statement ID: SIH26100
 * Ministry of Petroleum & Natural Gas · CPCL
 *
 * PROVENANCE: DEMO DATA — Synthetic dataset for SIH demonstration.
 * In prototype mode, simulates live registry APIs (GSTN, Udyam, MCA21, EPFO, CPPP).
 * Contract is identical to future production REST/SOAP endpoints.
 */

import { AdapterResponse, AdapterStatus } from '../types';

export interface AdapterConfig {
  simulateTimeout?: boolean;
  networkLatencyMs?: number;
}

// Global runtime adapter fault injection state (can be toggled during live judge demo)
export const ADAPTER_FAULT_STATE = {
  forceGstTimeout: false,
  forceUdyamOffline: false
};

/**
 * 1. GSTN Portal Registry Adapter
 * Contract: verifyGST(gstin: string) -> AdapterResponse
 */
export async function verifyGST(
  gstin: string,
  config: AdapterConfig = {}
): Promise<AdapterResponse> {
  const latency = config.networkLatencyMs ?? 400;
  await new Promise(r => setTimeout(r, latency));

  const timestamp = new Date().toISOString();

  // Fault simulation: Bidder 7 GSTIN (36AAACD9900N1Z1) or forced toggle
  if (gstin === '36AAACD9900N1Z1' || ADAPTER_FAULT_STATE.forceGstTimeout || config.simulateTimeout) {
    return {
      status: 'UNAVAILABLE',
      source: 'GSTN Gateway API (National Informatics Centre)',
      evidence: null,
      checked_at: timestamp,
      confidence: 0.0,
      reference_id: `NIC-GSTN-TXN-${Date.now()}`,
      errorMessage: 'HTTP 504 Gateway Timeout: National GST Portal did not respond after 3 retries.',
      isDemoData: true
    };
  }

  // Realistic synthetic responses for valid GSTINs
  return {
    status: 'VERIFIED',
    source: 'GSTN Gateway API (National Informatics Centre)',
    evidence: {
      gstin,
      taxpayerType: 'Regular Taxpayer',
      filingFrequency: 'Monthly',
      lastGstr3bFilingDate: '2026-08-20',
      complianceRating: 'A+ (Zero defaults in 24 months)',
      status: 'ACTIVE'
    },
    checked_at: timestamp,
    confidence: 1.0,
    reference_id: `NIC-GSTN-ACK-${Math.floor(100000 + Math.random() * 900000)}`,
    isDemoData: true
  };
}

/**
 * 2. Udyam Registration (Ministry of MSME) Adapter
 * Contract: verifyUdyam(number: string) -> AdapterResponse
 */
export async function verifyUdyam(
  udyamNumber: string,
  config: AdapterConfig = {}
): Promise<AdapterResponse> {
  const latency = config.networkLatencyMs ?? 350;
  await new Promise(r => setTimeout(r, latency));

  const timestamp = new Date().toISOString();

  if (ADAPTER_FAULT_STATE.forceUdyamOffline || config.simulateTimeout) {
    return {
      status: 'UNAVAILABLE',
      source: 'Ministry of MSME - Udyam National Registry',
      evidence: null,
      checked_at: timestamp,
      confidence: 0.0,
      reference_id: `UDYAM-ERR-${Date.now()}`,
      errorMessage: 'HTTP 503 Service Unavailable: Central Udyam Database in maintenance window.',
      isDemoData: true
    };
  }

  // Special scenario: Bidder 3 Udyam (UDYAM-TN-02-0055443) cancelled on registry!
  if (udyamNumber === 'UDYAM-TN-02-0055443') {
    return {
      status: 'CONTRADICTED',
      source: 'Ministry of MSME - Udyam National Registry',
      evidence: {
        udyamNumber,
        enterpriseType: 'Small Enterprise',
        registrationDate: '2021-03-10',
        currentStatus: 'CANCELLED',
        cancellationDate: '2026-08-31',
        cancellationReason: 'Non-filing of mandatory Form MSME-1 and annual financial turnover returns.',
        validOnSubmissionDate: false
      },
      checked_at: timestamp,
      confidence: 1.0,
      reference_id: `UDYAM-REVOKE-REG-${Date.now()}`,
      errorMessage: 'Registration revoked on National MSME Registry prior to tender closing date.',
      isDemoData: true
    };
  }

  return {
    status: 'VERIFIED',
    source: 'Ministry of MSME - Udyam National Registry',
    evidence: {
      udyamNumber,
      enterpriseType: 'Medium Enterprise',
      majorActivity: 'Manufacturing of Industrial Valves & Fittings (NIC 28121)',
      currentStatus: 'ACTIVE',
      validOnSubmissionDate: true
    },
    checked_at: timestamp,
    confidence: 1.0,
    reference_id: `UDYAM-REG-VER-${Math.floor(100000 + Math.random() * 900000)}`,
    isDemoData: true
  };
}

/**
 * 3. Ministry of Corporate Affairs (MCA21) Adapter
 * Contract: verifyMCA(companyIdentifier: string) -> AdapterResponse
 */
export async function verifyMCA(
  companyIdentifier: string,
  config: AdapterConfig = {}
): Promise<AdapterResponse> {
  const latency = config.networkLatencyMs ?? 400;
  await new Promise(r => setTimeout(r, latency));

  const timestamp = new Date().toISOString();

  return {
    status: 'VERIFIED',
    source: 'Ministry of Corporate Affairs (MCA21 Portal)',
    evidence: {
      companyIdentifier,
      companyStatus: 'ACTIVE',
      annualReturnFilingFY: '2023-24 (Filed)',
      balanceSheetFilingFY: '2023-24 (Filed)',
      authorizedCapitalInr: 50000000.0,
      paidUpCapitalInr: 25000000.0
    },
    checked_at: timestamp,
    confidence: 1.0,
    reference_id: `MCA-V3-REC-${Math.floor(100000 + Math.random() * 900000)}`,
    isDemoData: true
  };
}

/**
 * 4. EPFO (Employees' Provident Fund) Adapter
 * Contract: verifyEPFO(establishmentCode: string) -> AdapterResponse
 */
export async function verifyEPFO(
  establishmentCode: string,
  config: AdapterConfig = {}
): Promise<AdapterResponse> {
  const latency = config.networkLatencyMs ?? 300;
  await new Promise(r => setTimeout(r, latency));

  const timestamp = new Date().toISOString();

  return {
    status: 'VERIFIED',
    source: 'Employees Provident Fund Organisation (EPFO Shram Suvidha)',
    evidence: {
      establishmentCode,
      activeMembersCount: 142,
      lastEcrWageMonth: 'August 2026 (Submitted on 12-Sep-2026)',
      defaultStatus: 'NIL DEFAULT'
    },
    checked_at: timestamp,
    confidence: 1.0,
    reference_id: `EPFO-SS-TR-${Math.floor(100000 + Math.random() * 900000)}`,
    isDemoData: true
  };
}

/**
 * 5. CPPP / GeM Central Debarment & Blacklist Watchlist
 * Contract: verifyBlacklist(entityIdentifier: string) -> AdapterResponse
 */
export async function verifyBlacklist(
  entityIdentifier: string,
  config: AdapterConfig = {}
): Promise<AdapterResponse> {
  const latency = config.networkLatencyMs ?? 250;
  await new Promise(r => setTimeout(r, latency));

  const timestamp = new Date().toISOString();

  return {
    status: 'VERIFIED',
    source: 'Central Public Procurement Portal (CPPP) Debarment List & GeM Clause 26 Register',
    evidence: {
      entityIdentifier,
      isDebarred: false,
      isSuspended: false,
      activeWatchlistHits: 0,
      searchDatabaseTimestamp: '2026-09-29T06:00:00Z'
    },
    checked_at: timestamp,
    confidence: 1.0,
    reference_id: `CPPP-DEB-CHK-${Math.floor(100000 + Math.random() * 900000)}`,
    isDemoData: true
  };
}
