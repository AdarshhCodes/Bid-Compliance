/**
 * ANVESHA (अन्वेषा) — Evidence Service
 * Provides atomic, coordinate-bounded evidence records.
 */

import { Evidence, Document } from '../types';

export const MOCK_EVIDENCE_STORE: Evidence[] = [
  {
    id: 'EVD-B1-TURNOVER',
    documentId: 'DOC-B1-CA-CERT',
    bidderId: 'BIDDER-001',
    pageNumber: 1,
    boundingBox: [0.42, 0.15, 0.48, 0.85],
    claimField: 'average_annual_turnover',
    extractedValue: 165000000.00,
    rawTextSnippet: 'Average annual financial turnover of Hindustan Valves Corp Ltd for the preceding three financial years is certified as INR 16.50 Crores.',
    extractionConfidence: 0.98,
    provenanceType: 'PDF_NATIVE_TEXT',
    provenanceBadge: 'SYNTHETIC',
    extractedAt: '2026-09-29T10:14:10Z'
  },
  {
    id: 'EVD-B2-BIDFORM-TURNOVER',
    documentId: 'DOC-B2-BID-COVER',
    bidderId: 'BIDDER-002',
    pageNumber: 3,
    boundingBox: [0.35, 0.20, 0.40, 0.70],
    claimField: 'declared_turnover',
    extractedValue: 120000000.00,
    rawTextSnippet: 'Declared Annual Average Turnover: INR 12.00 Crores (Rupees Twelve Crores Only)',
    extractionConfidence: 0.99,
    provenanceType: 'PDF_NATIVE_TEXT',
    provenanceBadge: 'SYNTHETIC',
    extractedAt: '2026-09-29T10:14:22Z'
  },
  {
    id: 'EVD-B2-CACERT-TURNOVER',
    documentId: 'DOC-B2-CA-CERT',
    bidderId: 'BIDDER-002',
    pageNumber: 1,
    boundingBox: [0.55, 0.15, 0.62, 0.85],
    claimField: 'certified_turnover',
    extractedValue: 90000000.00,
    rawTextSnippet: 'This is to certify that average turnover of M/s Bharat Fluid Systems Pvt Ltd across FY 2021-22, 22-23, and 23-24 is INR 9.00 Crores (Rupees Nine Crores only). UDIN: 24089123AAAAA.',
    extractionConfidence: 0.97,
    provenanceType: 'OCR_EXTRACTION',
    provenanceBadge: 'SYNTHETIC',
    extractedAt: '2026-09-29T10:14:23Z'
  },
  {
    id: 'EVD-B3-UDYAM-DOC',
    documentId: 'DOC-B3-UDYAM',
    bidderId: 'BIDDER-003',
    pageNumber: 1,
    boundingBox: [0.25, 0.10, 0.35, 0.90],
    claimField: 'udyam_registration',
    extractedValue: 'UDYAM-TN-02-0055443',
    rawTextSnippet: 'Udyam Registration Certificate: UDYAM-TN-02-0055443 · Small Enterprise · Manufacturing',
    extractionConfidence: 0.99,
    provenanceType: 'PDF_NATIVE_TEXT',
    provenanceBadge: 'SYNTHETIC',
    extractedAt: '2026-09-29T10:14:28Z'
  },
  {
    id: 'EVD-B6-OEM-LETTER',
    documentId: 'DOC-B6-OEM',
    bidderId: 'BIDDER-006',
    pageNumber: 2,
    boundingBox: [0.45, 0.12, 0.58, 0.88],
    claimField: 'oem_product_scope',
    extractedValue: 'Commercial Plumbing Butterfly & Gate Valves for residential water distribution',
    rawTextSnippet: 'We hereby authorize M/s Precision Piping Solutions to distribute our commercial plumbing butterfly and gate valves for residential and municipal water projects.',
    extractionConfidence: 0.96,
    provenanceType: 'PDF_NATIVE_TEXT',
    provenanceBadge: 'SYNTHETIC',
    extractedAt: '2026-09-29T10:14:35Z'
  }
];

export async function getEvidenceById(evidenceId: string): Promise<Evidence | null> {
  await new Promise(r => setTimeout(r, 30));
  return MOCK_EVIDENCE_STORE.find(e => e.id === evidenceId) || null;
}

export async function getEvidenceForBidder(bidderId: string): Promise<Evidence[]> {
  await new Promise(r => setTimeout(r, 40));
  return MOCK_EVIDENCE_STORE.filter(e => e.bidderId === bidderId);
}
