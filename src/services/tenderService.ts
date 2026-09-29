/**
 * ANVESHA (अन्वेषा) — Tender Service
 * Provides tender metadata, clauses, requirements, and compliance metrics.
 */

import { Tender, Clause, Requirement } from '../types';
import { MOCK_TENDER, MOCK_CLAUSES, MOCK_REQUIREMENTS } from '../data/mockTenderData';

export async function getTenderById(tenderId: string): Promise<Tender | null> {
  // Simulates network latency
  await new Promise(r => setTimeout(r, 60));
  if (tenderId === MOCK_TENDER.id || tenderId === 'CPCL/2026/VALVES-7701' || tenderId === 'active') {
    return MOCK_TENDER;
  }
  return MOCK_TENDER; // Default fallback for demo
}

export async function getTenderClauses(tenderId: string): Promise<Clause[]> {
  await new Promise(r => setTimeout(r, 50));
  return MOCK_CLAUSES;
}

export async function getTenderRequirements(tenderId: string): Promise<Requirement[]> {
  await new Promise(r => setTimeout(r, 50));
  return MOCK_REQUIREMENTS;
}
