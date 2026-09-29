/**
 * ANVESHA (अन्वेषा) — Cross-Bidder Relationship & Graph Service
 * Discovers and traverses shared entity attributes across bidders in a tender.
 */

import { Relationship, Anomaly } from '../types';
import { MOCK_RELATIONSHIPS, MOCK_ANOMALIES } from '../data/mockTenderData';

export async function getTenderRelationships(tenderId: string): Promise<Relationship[]> {
  await new Promise(r => setTimeout(r, 50));
  return MOCK_RELATIONSHIPS;
}

export async function getTenderAnomalies(tenderId: string): Promise<Anomaly[]> {
  await new Promise(r => setTimeout(r, 40));
  return MOCK_ANOMALIES;
}

export interface NetworkNode {
  id: string;
  label: string;
  type: 'BIDDER' | 'BANK_ACCOUNT' | 'DIRECTOR' | 'ADDRESS';
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type: 'SHARED_BANK' | 'TEXT_SIMILARITY';
}

export async function getTenderGraphNetwork(tenderId: string): Promise<{ nodes: NetworkNode[]; edges: NetworkEdge[] }> {
  await new Promise(r => setTimeout(r, 60));

  const nodes: NetworkNode[] = [
    { id: 'BIDDER-004', label: 'Apex Industrial Tech', type: 'BIDDER', riskLevel: 'HIGH' },
    { id: 'BIDDER-005', label: 'Zenith Flow Equipments', type: 'BIDDER', riskLevel: 'HIGH' },
    { id: 'BANK-001', label: 'HDFC Bank · 50200088991122 (IFSC: HDFC0001234)', type: 'BANK_ACCOUNT', riskLevel: 'HIGH' },
    { id: 'BIDDER-001', label: 'Hindustan Valves Corp', type: 'BIDDER', riskLevel: 'LOW' },
    { id: 'BIDDER-002', label: 'Bharat Fluid Systems', type: 'BIDDER', riskLevel: 'MEDIUM' }
  ];

  const edges: NetworkEdge[] = [
    { id: 'E-01', source: 'BIDDER-004', target: 'BANK-001', label: 'Shared Bank Account', type: 'SHARED_BANK' },
    { id: 'E-02', source: 'BIDDER-005', target: 'BANK-001', label: 'Shared Bank Account', type: 'SHARED_BANK' },
    { id: 'E-03', source: 'BIDDER-004', target: 'BIDDER-005', label: '94.2% Proposal Similarity', type: 'TEXT_SIMILARITY' }
  ];

  return { nodes, edges };
}
