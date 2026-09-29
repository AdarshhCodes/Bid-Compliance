/**
 * ANVESHA (अन्वेषा) — Bidder Service
 * Provides bidder identity chains, submissions, and triage prioritization.
 */

import { Bidder, Bid } from '../types';
import { MOCK_BIDDERS, MOCK_BIDS } from '../data/mockTenderData';

export async function getAllBidders(tenderId: string): Promise<Bidder[]> {
  await new Promise(r => setTimeout(r, 60));
  // Return sorted by overallTriageRank (uncertainty x materiality)
  return [...MOCK_BIDDERS].sort((a, b) => a.overallTriageRank - b.overallTriageRank);
}

export async function getBidderById(bidderId: string): Promise<Bidder | null> {
  await new Promise(r => setTimeout(r, 40));
  return MOCK_BIDDERS.find(b => b.id === bidderId) || null;
}

export async function getBidForBidder(tenderId: string, bidderId: string): Promise<Bid | null> {
  await new Promise(r => setTimeout(r, 40));
  return MOCK_BIDS.find(b => b.bidderId === bidderId) || null;
}

export async function getAllBids(tenderId: string): Promise<Bid[]> {
  await new Promise(r => setTimeout(r, 50));
  return MOCK_BIDS;
}
