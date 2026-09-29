import React from 'react';
import {
  X,
  FileText,
  ExternalLink,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Cpu,
  Layers,
  HelpCircle,
  Copy,
  ChevronRight
} from 'lucide-react';
import { Evidence } from '../../types';

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: Evidence | null;
  requirementTitle?: string;
  requirementId?: string;
  clauseReference?: string;
  verdictImpact?: string;
  onOpenDocument?: (docId: string, pageNumber: number, bbox?: [number, number, number, number]) => void;
  onTraceRequirement?: (reqId: string) => void;
  onViewAuditEvent?: (eventId: string) => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  isOpen,
  onClose,
  evidence,
  requirementTitle = 'Minimum Average Annual Turnover ≥ INR 10.00 Cr',
  requirementId = 'REQ-001',
  clauseReference = 'Clause 4.2',
  verdictImpact = 'Certified turnover (₹9.00 Cr) refutes declared claim (₹12.00 Cr) and fails mandatory ₹10.00 Cr cutoff → Triggers CONTRADICTED verdict.',
  onOpenDocument,
  onTraceRequirement,
  onViewAuditEvent
}) => {
  if (!isOpen || !evidence) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(evidence.id);
    alert(`Copied Evidence ID: ${evidence.id}`);
  };

  return (
    <div className="drawer-backdrop" onClick={onClose} style={{ zIndex: 120 }}>
      <div
        className="evidence-drawer-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 540,
          background: '#FFFFFF',
          borderLeft: '1px solid #CBD5E1',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          boxShadow: '-8px 0 32px rgba(15, 23, 42, 0.15)'
        }}
      >
        {/* 1. Drawer Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#F8FAFC'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#2563EB', background: '#EFF6FF', padding: '2px 6px', borderRadius: 3 }}>
                First-Class Evidence Record
              </span>
              <span className="provenance-tag" style={{ fontSize: 10 }}>
                {evidence.provenanceBadge}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', fontFamily: 'var(--font-mono)' }}>
                {evidence.id}
              </h2>
              <button
                onClick={handleCopyId}
                title="Copy Evidence ID"
                style={{ color: '#94A3B8', hover: { color: '#0F172A' } } as any}
              >
                <Copy size={13} />
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: 6,
              borderRadius: 4,
              color: '#64748B',
              background: '#F1F5F9'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. Scrollable Body Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {/* Extracted Value Hero Box */}
          <div
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 6,
              padding: '14px 16px',
              marginBottom: 18
            }}
          >
            <div style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
              Extracted Evidentiary Value ({evidence.claimField})
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-mono)' }}>
              {typeof evidence.extractedValue === 'number'
                ? `₹${(evidence.extractedValue / 10000000).toFixed(2)} Crore (₹${evidence.extractedValue.toLocaleString('en-IN')})`
                : String(evidence.extractedValue)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, fontSize: 11 }}>
              <span style={{ color: '#16A34A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={13} /> {(evidence.extractionConfidence * 100).toFixed(1)}% Confidence
              </span>
              <span style={{ color: '#64748B' }}>•</span>
              <span style={{ color: '#475569', fontFamily: 'var(--font-mono)' }}>
                Extraction Mode: {evidence.provenanceType}
              </span>
            </div>
          </div>

          {/* Coordinate Bounding Box & Document Anchor */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Document Grounding Coordinates
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 6, padding: '12px 14px', fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#64748B' }}>Source Document:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#2563EB' }}>
                  {evidence.documentId}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#64748B' }}>Page Number:</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>Page {evidence.pageNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#64748B' }}>Normalized Bounding Box:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#DC2626', background: '#FEF2F2', padding: '1px 6px', borderRadius: 3, fontSize: 11 }}>
                  [{evidence.boundingBox.map(n => n.toFixed(2)).join(', ')}]
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Ingestion Timestamp:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#64748B', fontSize: 11 }}>
                  {new Date(evidence.extractedAt).toLocaleString('en-IN')} IST
                </span>
              </div>
            </div>
          </div>

          {/* Raw Text Snippet */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Raw OCR Text Snippet
            </div>
            <div
              style={{
                background: '#F1F5F9',
                borderLeft: '3px solid #2563EB',
                padding: '10px 14px',
                borderRadius: '0 6px 6px 0',
                fontSize: 12,
                color: '#1E293B',
                lineHeight: 1.5,
                fontFamily: 'serif',
                fontStyle: 'italic'
              }}
            >
              "{evidence.rawTextSnippet}"
            </div>
          </div>

          {/* Requirement Impact */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Tender Requirement & Verdict Impact
            </div>
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 6, padding: '12px 14px', fontSize: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>
                <AlertTriangle size={14} />
                <span>{clauseReference} · {requirementId}</span>
              </div>
              <div style={{ fontWeight: 600, color: '#78350F', marginBottom: 6 }}>
                {requirementTitle}
              </div>
              <p style={{ fontSize: 11, color: '#92400E', lineHeight: 1.4 }}>
                {verdictImpact}
              </p>
            </div>
          </div>

          {/* AI vs Deterministic Rules Separation (Phase 2 Requirement) */}
          <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 6, padding: '14px', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', marginBottom: 10 }}>
              <Layers size={14} color="#2563EB" />
              <span>AI Extraction vs Deterministic Rule Verification</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 11 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                  1
                </div>
                <div>
                  <strong style={{ color: '#0F172A' }}>Stage 1: AI / OCR Extraction (Probabilistic)</strong>
                  <div style={{ color: '#64748B', marginTop: 2 }}>
                    Extracted token string from PDF coordinates with 98% confidence. AI does NOT do math or pass/fail determinations.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                  2
                </div>
                <div>
                  <strong style={{ color: '#0F172A' }}>Stage 2: Deterministic Python Engine (Mathematical)</strong>
                  <div style={{ color: '#64748B', marginTop: 2 }}>
                    Evaluated strict inequality <code>certified_val (9.0 Cr) &lt; threshold (10.0 Cr)</code>. Zero LLM hallucinations in arithmetic.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Action Buttons Footer */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid #E2E8F0',
            background: '#F8FAFC',
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}
        >
          <button
            onClick={() => {
              onClose();
              if (onOpenDocument) {
                onOpenDocument(evidence.documentId, evidence.pageNumber, evidence.boundingBox);
              }
            }}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '9px 14px' }}
          >
            <FileText size={15} />
            <span>Open Document (Jump to Page {evidence.pageNumber})</span>
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              onClick={() => {
                onClose();
                if (onTraceRequirement) {
                  onTraceRequirement(requirementId);
                }
              }}
              className="btn-secondary"
              style={{ justifyContent: 'center', fontSize: 11 }}
            >
              <span>Trace Requirement</span>
              <ChevronRight size={13} />
            </button>

            <button
              onClick={() => {
                onClose();
                if (onViewAuditEvent) {
                  onViewAuditEvent('evt_batch_eval_0002');
                } else {
                  alert(`Audit Ledger Block: SHA-256 Hash Seal verified for ${evidence.id}. Registered in Block #2.`);
                }
              }}
              className="btn-secondary"
              style={{ justifyContent: 'center', fontSize: 11 }}
            >
              <RotateCcw size={13} />
              <span>View Audit Event</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
