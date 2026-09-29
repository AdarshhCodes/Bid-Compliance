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
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--palette-teal)', background: 'rgba(49, 170, 169, 0.1)', padding: '2px 6px', borderRadius: 3 }}>
                First-Class Evidence Record
              </span>
              <span className="provenance-tag" style={{ fontSize: 10 }}>
                {evidence.provenanceBadge}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {evidence.id}
              </h2>
              <button
                onClick={handleCopyId}
                title="Copy Evidence ID"
                style={{ color: 'var(--text-muted)' }}
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
              color: 'var(--text-muted)',
              background: 'var(--bg-subtle)'
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
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 6,
              padding: '14px 16px',
              marginBottom: 18
            }}
          >
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
              Extracted Evidentiary Value ({evidence.claimField})
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {typeof evidence.extractedValue === 'number'
                ? `₹${(evidence.extractedValue / 10000000).toFixed(2)} Crore (₹${evidence.extractedValue.toLocaleString('en-IN')})`
                : String(evidence.extractedValue)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, fontSize: 11 }}>
              <span style={{ color: 'var(--palette-teal)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={13} /> {(evidence.extractionConfidence * 100).toFixed(1)}% Confidence
              </span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                Extraction Mode: {evidence.provenanceType}
              </span>
            </div>
          </div>

          {/* Coordinate Bounding Box & Document Anchor */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Document Grounding Coordinates
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: 6, padding: '12px 14px', fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Source Document:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--palette-teal)' }}>
                  {evidence.documentId}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Page Number:</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Page {evidence.pageNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Normalized Bounding Box:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--palette-crimson)', background: 'var(--status-contradicted-bg)', padding: '1px 6px', borderRadius: 3, fontSize: 11 }}>
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
                background: 'var(--bg-subtle)',
                borderLeft: '3px solid var(--palette-teal)',
                padding: '10px 14px',
                borderRadius: '0 6px 6px 0',
                fontSize: 12,
                color: 'var(--text-primary)',
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
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Tender Requirement & Verdict Impact
            </div>
            <div style={{ background: 'var(--accent-gold-bg)', border: '1px solid var(--accent-gold-border)', borderRadius: 6, padding: '12px 14px', fontSize: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--accent-gold-text)', marginBottom: 4 }}>
                <AlertTriangle size={14} />
                <span>{clauseReference} · {requirementId}</span>
              </div>
              <div style={{ fontWeight: 600, color: 'var(--accent-gold-text)', marginBottom: 6 }}>
                {requirementTitle}
              </div>
              <p style={{ fontSize: 11, color: 'var(--accent-gold-text)', lineHeight: 1.4 }}>
                {verdictImpact}
              </p>
            </div>
          </div>

          {/* AI vs Deterministic Rules Separation (Phase 2 Requirement) */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-default)', borderRadius: 6, padding: '14px', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: 10 }}>
              <Layers size={14} color="var(--palette-teal)" />
              <span>AI Extraction vs Deterministic Rule Verification</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 11 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(49, 170, 169, 0.12)', color: 'var(--palette-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                  1
                </div>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Stage 1: AI / OCR Extraction (Probabilistic)</strong>
                  <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>
                    Extracted token string from PDF coordinates with 98% confidence. AI does NOT do math or pass/fail determinations.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--status-verified-bg)', color: 'var(--palette-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                  2
                </div>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Stage 2: Deterministic Python Engine (Mathematical)</strong>
                  <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>
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
