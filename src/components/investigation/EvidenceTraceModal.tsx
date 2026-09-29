import React, { useState } from 'react';
import {
  X,
  FileText,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sliders,
  Check,
  RotateCcw,
  Sparkles,
  Cpu,
  Layers,
  Info,
  Shield,
  UserCheck,
  GitCommit
} from 'lucide-react';
import { EvidenceChain } from './EvidenceChain';
import { DocumentViewerModal } from './DocumentViewerModal';
import { EvidenceDrawer } from './EvidenceDrawer';
import { Evidence } from '../../types';
import { recordOfficerAction } from '../../services/auditService';

interface EvidenceTraceModalProps {
  isOpen: boolean;
  onClose: () => void;
  bidderName?: string;
  bidderId?: string;
  requirementId?: string;
  requirementTitle?: string;
  clauseId?: string;
  clauseTitle?: string;
  clauseRawText?: string;
  claimASource?: string;
  claimAValue?: string;
  claimBSource?: string;
  claimBValue?: string;
  thresholdValue?: string;
  verdict?: 'VERIFIED' | 'CONTRADICTED' | 'UNVERIFIABLE' | 'PENDING_REVIEW';
  verdictReason?: string;
}

export const EvidenceTraceModal: React.FC<EvidenceTraceModalProps> = ({
  isOpen,
  onClose,
  bidderName = 'Bharat Fluid Systems Private Limited (Apex Process Systems)',
  bidderId = 'BIDDER-002',
  requirementId = 'REQ-001',
  requirementTitle = 'Minimum Average Annual Turnover ≥ INR 10.00 Cr',
  clauseId = 'Clause 4.2',
  clauseTitle = 'Financial Turnover Criteria',
  clauseRawText = 'The average annual financial turnover of the bidder during the last three preceding financial years (FY 2021-22, 2022-23, and 2023-24) must not be less than INR 10.00 Crores, duly certified by a Chartered Accountant with valid UDIN. Bids submitted with self-declarations unsupported by audited balance sheets and valid UDIN shall be disqualified under GFR Rule 144.',
  claimASource = 'Bid Form.pdf (Cover Letter, Page 3)',
  claimAValue = 'INR 12,00,00,000 (₹12.00 Cr)',
  claimBSource = 'CA Certificate.pdf (UDIN: 24089123AAAAA, Page 2)',
  claimBValue = 'INR 9,00,00,000 (₹9.00 Cr)',
  thresholdValue = '≥ INR 10,00,00,000 (₹10.00 Cr)',
  verdict = 'CONTRADICTED',
  verdictReason = 'The same semantic field has conflicting values across submitted evidence. Certified turnover (₹9.00 Cr) refutes declared claim (₹12.00 Cr) and falls below the mandatory threshold of ₹10.00 Cr.'
}) => {
  // Active Sub-tab matching Image 1 Panel 3
  const [activeTab, setActiveTab] = useState<'EVIDENCE_VIEW' | 'CLAUSE_CONTEXT' | 'VERIFICATION_LOGIC' | 'TIMELINE' | 'RELATED_REQS'>('EVIDENCE_VIEW');

  // Document Viewer & Evidence Drawer Sub-modals
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<'DOC-B2-CA-CERT' | 'DOC-B2-BID-COVER'>('DOC-B2-CA-CERT');
  const [targetDocPage, setTargetDocPage] = useState<number>(2);

  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);
  const [selectedEvidenceRecord, setSelectedEvidenceRecord] = useState<Evidence | null>(null);

  // What-If Sandbox State
  const [sandboxTurnover, setSandboxTurnover] = useState<number>(9.0);
  const [sandboxThreshold, setSandboxThreshold] = useState<number>(10.0);
  const isCompliant = sandboxTurnover >= sandboxThreshold;
  const [officerDecisionMessage, setOfficerDecisionMessage] = useState<string | null>(null);

  // Mandatory Reasoned Override Dialog State
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [overrideReasonInput, setOverrideReasonInput] = useState('');
  const [isCommittingAction, setIsCommittingAction] = useState(false);

  // Document Zoom State
  const [leftZoom, setLeftZoom] = useState(100);
  const [rightZoom, setRightZoom] = useState(100);

  const handleOpenDoc = (docType: 'CA_CERT' | 'BID_FORM', page: number) => {
    setSelectedDocId(docType === 'CA_CERT' ? 'DOC-B2-CA-CERT' : 'DOC-B2-BID-COVER');
    setTargetDocPage(page);
    setIsDocViewerOpen(true);
  };

  const handleOpenEvidence = (docType: 'CA_CERT' | 'BID_FORM') => {
    setSelectedEvidenceRecord({
      id: docType === 'CA_CERT' ? 'EVID-B2-CA-001' : 'EVID-B2-BID-001',
      bidderId: bidderId || 'BIDDER-002',
      documentId: docType === 'CA_CERT' ? 'DOC-B2-CA-CERT' : 'DOC-B2-BID-COVER',
      pageNumber: docType === 'CA_CERT' ? 2 : 3,
      boundingBox: [0.55, 0.15, 0.62, 0.85],
      claimField: 'Average Annual Turnover',
      extractedValue: docType === 'CA_CERT' ? 'INR 9,00,00,000' : 'INR 12,00,00,000',
      rawTextSnippet: docType === 'CA_CERT' ? 'Average Annual Turnover: Rs. 9,00,00,000/-' : 'Turnover: Rs. 12,00,00,000/-',
      extractionConfidence: docType === 'CA_CERT' ? 0.981 : 0.984,
      provenanceType: 'OCR_EXTRACTION',
      provenanceBadge: docType === 'CA_CERT' ? 'REAL' : 'USER_PROVIDED',
      extractedAt: new Date().toISOString()
    });
    setIsEvidenceDrawerOpen(true);
  };

  const handleConfirmOverride = async () => {
    if (!overrideReasonInput.trim() || overrideReasonInput.trim().length < 15) {
      alert('Statutory Governance Rule: A typed justification of at least 15 characters is required. Silent overrides are prohibited under CVC guidelines.');
      return;
    }
    setIsCommittingAction(true);
    try {
      const res = await recordOfficerAction({
        bidderId: bidderId || 'BIDDER-002',
        requirementId: requirementId || 'REQ-001',
        action: 'OVERRIDE_TO_VERIFIED',
        justification: overrideReasonInput.trim(),
        previousVerdict: verdict || 'CONTRADICTED',
        newVerdict: 'VERIFIED'
      });
      setOfficerDecisionMessage(`Officer override committed! Chained in block #${res.auditEvent.eventIndex} (Hash: ${res.auditEvent.currentHash.substring(0, 16)}...)`);
      setIsOverrideModalOpen(false);
      setOverrideReasonInput('');
    } catch (e: any) {
      alert(e.message || 'Failed to record override.');
    } finally {
      setIsCommittingAction(false);
    }
  };

  const handleAcceptFinding = async () => {
    try {
      const res = await recordOfficerAction({
        bidderId: bidderId || 'BIDDER-002',
        requirementId: requirementId || 'REQ-001',
        action: 'ACCEPT_SYSTEM_VERDICT',
        justification: 'Automated CONTRADICTED finding confirmed and accepted by Procurement Officer.',
        previousVerdict: verdict || 'CONTRADICTED',
        newVerdict: 'CONTRADICTED'
      });
      setOfficerDecisionMessage(`Finding accepted & committed to block #${res.auditEvent.eventIndex}.`);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleRequestClarification = async () => {
    try {
      const res = await recordOfficerAction({
        bidderId: bidderId || 'BIDDER-002',
        requirementId: requirementId || 'REQ-001',
        action: 'REQUEST_CLARIFICATION',
        justification: 'Formal clarification notice dispatched via GeM portal requesting physical certified JV balance sheet.',
        previousVerdict: verdict || 'CONTRADICTED',
        newVerdict: 'PENDING_REVIEW'
      });
      setOfficerDecisionMessage(`Clarification notice dispatched and logged in block #${res.auditEvent.eventIndex}.`);
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} style={{ zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: 1280,
            maxWidth: '98vw',
            height: '94vh',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
            border: '1px solid var(--border-default)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* 1. Header Banner */}
          <div
            style={{
              padding: '12px 20px',
              borderBottom: '1px solid var(--border-default)',
              background: 'var(--bg-surface-elevated)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--border-accent)',
                  cursor: 'pointer'
                }}
              >
                ← Back
              </button>
              <div style={{ width: 1, height: 18, background: 'var(--border-default)' }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                    Requirement: {requirementTitle}
                  </span>
                  <span className={`status-pill ${verdict === 'CONTRADICTED' ? 'status-pill-contradicted' : verdict === 'VERIFIED' ? 'status-pill-verified' : 'status-pill-unverifiable'}`}>
                    {verdict}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {requirementId} | {clauseId} · Bidder: <strong style={{ color: 'var(--text-primary)' }}>{bidderName}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="provenance-tag">
                EVIDENCE TRACE
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--border-default)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* 2. Top Navigation Tabs (Matching Image 1 Panel 3) */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-default)', padding: '0 20px', background: 'var(--bg-surface)', gap: 16 }}>
            {[
              { key: 'EVIDENCE_VIEW', label: 'Evidence View' },
              { key: 'CLAUSE_CONTEXT', label: 'Clause Context' },
              { key: 'VERIFICATION_LOGIC', label: 'Verification Logic' },
              { key: 'TIMELINE', label: 'Timeline' },
              { key: 'RELATED_REQS', label: 'Related Requirements' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                style={{
                  padding: '10px 4px',
                  fontSize: 12,
                  fontWeight: activeTab === tab.key ? 700 : 500,
                  color: activeTab === tab.key ? 'var(--border-accent)' : 'var(--text-muted)',
                  borderBottom: activeTab === tab.key ? '2px solid var(--border-accent)' : '2px solid transparent',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 3. Main Workspace Area */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* EVIDENCE VIEW: Side-by-Side Document Sheet & Verification Panel (Matching Reference UI Screen 3) */}
            {activeTab === 'EVIDENCE_VIEW' && (
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.8fr 1fr', overflow: 'hidden' }}>
                {/* LEFT MAIN AREA: Side-by-Side Documents + Extracted Values Strip */}
                <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-default)', background: 'var(--bg-canvas)', overflowY: 'auto', padding: '16px 20px' }}>
                  {/* Comparison View Header Dropdowns */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
                      Comparison View
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <select
                        style={{
                          fontSize: 11,
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-default)',
                          background: 'var(--bg-surface)',
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-sans)',
                          fontWeight: 600
                        }}
                      >
                        <option>Bid Form (Page 3)</option>
                      </select>
                      <select
                        style={{
                          fontSize: 11,
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-default)',
                          background: 'var(--bg-surface)',
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-sans)',
                          fontWeight: 600
                        }}
                      >
                        <option>CA Certificate (Page 2)</option>
                      </select>
                    </div>
                  </div>

                  {/* Side-by-Side Rendered Document Pages */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                    {/* Left Document: Bid Form */}
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: 12, display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>BID FORM</span>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Bidder Submission</span>
                      </div>

                      {/* Simulated Paper Content with Red Box Highlight */}
                      <div style={{ background: '#FAF9F5', border: '1px solid #E2E8F0', padding: 16, height: 210, fontSize: 11, fontFamily: 'serif', lineHeight: 1.5, color: '#334155', position: 'relative' }}>
                        <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 12, marginBottom: 8 }}>
                          BHARAT FLUID SYSTEMS PRIVATE LIMITED
                        </div>
                        <div style={{ fontSize: 10, marginBottom: 10 }}>
                          Commercial Bid Submission Dossier · CPCL Pipeline Valves
                        </div>

                        {/* Highlighted Bounding Box Region */}
                        <div
                          style={{
                            border: '2px solid #EF4444',
                            background: 'rgba(239, 68, 68, 0.1)',
                            padding: '6px 8px',
                            borderRadius: 3,
                            fontWeight: 'bold',
                            color: '#991B1B',
                            margin: '12px 0'
                          }}
                        >
                          Average Annual Turnover: ₹12,00,00,000/- (Twelve Crores)
                        </div>

                        <div style={{ fontSize: 9, color: '#64748B', marginTop: 10 }}>
                          Signatory: Vikram A. Shah, Director · Seal Affixed
                        </div>
                      </div>

                      {/* Page Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, paddingTop: 6, borderTop: '1px solid var(--border-subtle)', fontSize: 11, color: 'var(--text-muted)' }}>
                        <span style={{ fontFamily: 'var(--font-mono)' }}>Page 3 / 24</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <button onClick={() => setLeftZoom(Math.max(70, leftZoom - 10))} style={{ cursor: 'pointer' }}>-</button>
                          <span style={{ fontFamily: 'var(--font-mono)' }}>{leftZoom}%</span>
                          <button onClick={() => setLeftZoom(Math.min(150, leftZoom + 10))} style={{ cursor: 'pointer' }}>+</button>
                        </div>
                      </div>
                    </div>

                    {/* Right Document: CA Certificate */}
                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: 12, display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>CHARTERED ACCOUNTANT CERTIFICATE</span>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>UDIN: 24089123AAAAA</span>
                      </div>

                      {/* Simulated CA Paper Content with Red Box Highlight */}
                      <div style={{ background: '#FAF9F5', border: '1px solid #E2E8F0', padding: 16, height: 210, fontSize: 11, fontFamily: 'serif', lineHeight: 1.5, color: '#334155', position: 'relative' }}>
                        <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 12, marginBottom: 8 }}>
                          R. S. MEHTA & ASSOCIATES · CHARTERED ACCOUNTANTS
                        </div>
                        <div style={{ fontSize: 10, marginBottom: 10 }}>
                          Turnover & Financial Worth Certificate for GeM Bidding
                        </div>

                        {/* Highlighted Bounding Box Region */}
                        <div
                          style={{
                            border: '2px solid #EF4444',
                            background: 'rgba(239, 68, 68, 0.1)',
                            padding: '6px 8px',
                            borderRadius: 3,
                            fontWeight: 'bold',
                            color: '#991B1B',
                            margin: '12px 0'
                          }}
                        >
                          Average Annual Turnover: ₹9,00,00,000/- (Nine Crores)
                        </div>

                        <div style={{ fontSize: 9, color: '#64748B', marginTop: 10 }}>
                          ICAI Reg: 109283W · UDIN: 24089123AAAAA (Verified Authentic)
                        </div>
                      </div>

                      {/* Page Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, paddingTop: 6, borderTop: '1px solid var(--border-subtle)', fontSize: 11, color: 'var(--text-muted)' }}>
                        <span style={{ fontFamily: 'var(--font-mono)' }}>Page 2 / 4</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <button onClick={() => setRightZoom(Math.max(70, rightZoom - 10))} style={{ cursor: 'pointer' }}>-</button>
                          <span style={{ fontFamily: 'var(--font-mono)' }}>{rightZoom}%</span>
                          <button onClick={() => setRightZoom(Math.min(150, rightZoom + 10))} style={{ cursor: 'pointer' }}>+</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Extracted Values Comparison Strip (Matching Reference UI Screen 3) */}
                  <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Left Value Card */}
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                        ₹12,00,00,000
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        Source: <strong>Bid Form</strong> · Page: 3 · Confidence: <strong style={{ color: 'var(--status-verified-text)' }}>98.4%</strong>
                      </div>
                    </div>

                    {/* Center Discrepancy Icon Node */}
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'var(--status-contradicted-bg)',
                        border: '1px solid var(--status-contradicted-border)',
                        color: 'var(--status-contradicted-text)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: 16
                      }}
                      title="Contradiction: Discrepancy of -₹3.00 Cr (-25.0%)"
                    >
                      ≠
                    </div>

                    {/* Right Value Card */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 15, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--status-contradicted-text)' }}>
                        ₹9,00,00,000
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        Source: <strong>CA Certificate</strong> · Page: 2 · Confidence: <strong style={{ color: 'var(--status-verified-text)' }}>98.1%</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE PANEL: Verification Result, Why This Verdict & Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px 20px', background: 'var(--bg-surface)', overflowY: 'auto' }}>
                  <div>
                    {/* Verification Result Header */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 4 }}>
                        VERIFICATION RESULT
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: 'var(--status-contradicted-dot)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            fontWeight: 900
                          }}
                        >
                          ✕
                        </span>
                        <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--status-contradicted-text)' }}>
                          CONTRADICTED
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                        Conflicting turnover values found across submitted documents.
                      </div>
                    </div>

                    {/* Requirement Specification Box */}
                    <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', marginBottom: 14, fontSize: 12 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>
                        Requirement
                      </div>
                      <div style={{ color: 'var(--text-primary)', lineHeight: 1.4, fontSize: 11 }}>
                        Minimum average annual turnover of not less than ₹10 crore in the last three financial years.
                      </div>
                    </div>

                    {/* Verified Values List */}
                    <div style={{ marginBottom: 14, fontSize: 11 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                        Verified Values
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'var(--font-mono)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                          <span>• Bid Form:</span>
                          <strong>₹12 Cr</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--status-contradicted-text)' }}>
                          <span>• CA Certificate:</span>
                          <strong>₹9 Cr</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-primary)', borderTop: '1px dashed var(--border-default)', paddingTop: 4 }}>
                          <span>• Threshold:</span>
                          <strong>≥ ₹10 Cr</strong>
                        </div>
                      </div>
                    </div>

                    {/* Why this verdict? numbered list */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                        Why this verdict?
                      </div>
                      <ol style={{ paddingLeft: 16, fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <li>Two authoritative documents contain different values</li>
                        <li>Values fall on different sides of the mandatory threshold</li>
                        <li>Requires statutory officer review and clarification</li>
                      </ol>

                      <button
                        onClick={() => setActiveTab('VERIFICATION_LOGIC')}
                        style={{ fontSize: 11, color: 'var(--border-accent)', fontWeight: 600, marginTop: 8, cursor: 'pointer' }}
                      >
                        View Full Finding Logic →
                      </button>
                    </div>

                    {officerDecisionMessage && (
                      <div style={{ background: 'var(--status-verified-bg)', border: '1px solid var(--status-verified-border)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', fontSize: 11, color: 'var(--status-verified-text)', marginBottom: 12 }}>
                        ✓ {officerDecisionMessage}
                      </div>
                    )}
                  </div>

                  {/* Pinned Action Buttons at Bottom */}
                  <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                      <button
                        onClick={handleAcceptFinding}
                        className="btn-primary"
                        style={{ justifyContent: 'center', fontSize: 11, padding: '7px 8px' }}
                      >
                        <span>Accept Finding</span>
                      </button>
                      <button
                        onClick={() => {
                          setOverrideReasonInput('');
                          setIsOverrideModalOpen(true);
                        }}
                        className="btn-secondary"
                        style={{ justifyContent: 'center', fontSize: 11, padding: '7px 8px' }}
                      >
                        <span>Override</span>
                      </button>
                    </div>
                    <button
                      onClick={handleRequestClarification}
                      className="btn-secondary"
                      style={{ width: '100%', justifyContent: 'center', fontSize: 11, padding: '6px 8px' }}
                    >
                      <span>Request Clarification</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* CLAUSE CONTEXT TAB */}
            {activeTab === 'CLAUSE_CONTEXT' && (
              <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto', background: 'var(--bg-canvas)' }}>
                <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="panel-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span className="priority-tag-p1">{clauseId}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Tender CPCL/PROC/2026/047 · Section 4</span>
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                      {clauseTitle}
                    </h3>
                    <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: 14, fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.6, color: 'var(--text-primary)' }}>
                      "{clauseRawText}"
                    </div>
                  </div>

                  <div className="panel-card">
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
                      Statutory Evaluation Standard
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12 }}>
                      <div style={{ padding: 12, background: 'var(--bg-canvas)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Governing Precedence</div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>GFR Rule 144 & CVC Circular 03/2021</div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>Certified CA statements supersede self-declarations. Any discrepancy triggers non-compliance review.</div>
                      </div>
                      <div style={{ padding: 12, background: 'var(--bg-canvas)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mandatory Cutoff</div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>≥ ₹10,00,00,000 (₹10.00 Cr)</div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>Calculated as the arithmetic mean of FY 2021-22, 2022-23, and 2023-24 audited net turnovers.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VERIFICATION LOGIC TAB */}
            {activeTab === 'VERIFICATION_LOGIC' && (
              <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto', background: 'var(--bg-canvas)' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div className="panel-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <Shield size={16} color="var(--border-accent)" />
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                        Two-Stage Deterministic Verification Pipeline
                      </h3>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      Per SIH26100 architecture constraints, neural models are strictly confined to perceptual text extraction. All threshold evaluations, cross-document equality checks, and compliance verdicts run through deterministic Python code.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div className="panel-card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--border-accent)', marginBottom: 10 }}>
                        <Sparkles size={16} />
                        <strong style={{ fontSize: 12, textTransform: 'uppercase' }}>Stage 1: AI / OCR Extraction</strong>
                      </div>
                      <ul style={{ fontSize: 11, color: 'var(--text-secondary)', paddingLeft: 16, lineHeight: 1.7, margin: 0 }}>
                        <li>Extracts raw token strings: <code style={{ fontFamily: 'var(--font-mono)' }}>"12,00,00,000"</code> and <code style={{ fontFamily: 'var(--font-mono)' }}>"9,00,00,000"</code>.</li>
                        <li>Identifies document layout geometry and bounding box coords.</li>
                        <li>Associates UDIN: <code style={{ fontFamily: 'var(--font-mono)' }}>24089123AAAAA</code> with ICAI member record.</li>
                        <li>Outputs structured JSON envelope with 98.4% confidence score.</li>
                      </ul>
                    </div>

                    <div className="panel-card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--status-verified-text)', marginBottom: 10 }}>
                        <Cpu size={16} />
                        <strong style={{ fontSize: 12, textTransform: 'uppercase' }}>Stage 2: Deterministic Rule Engine</strong>
                      </div>
                      <ul style={{ fontSize: 11, color: 'var(--text-secondary)', paddingLeft: 16, lineHeight: 1.7, margin: 0 }}>
                        <li>Executes numerical inequality: <code style={{ fontFamily: 'var(--font-mono)' }}>certified_val &gt;= 100000000</code>.</li>
                        <li>Detects cross-document delta: <code style={{ fontFamily: 'var(--font-mono)' }}>120000000 != 90000000</code>.</li>
                        <li>Evaluates boolean outcome: <code style={{ fontFamily: 'var(--font-mono)' }}>90000000 &gt;= 100000000 == False</code>.</li>
                        <li>Emits statutory status code: <code style={{ fontFamily: 'var(--font-mono)' }}>ERR_CROSS_DOC_CONTRADICTION</code>.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Interactive What-If Simulator */}
                  <div className="panel-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <Sliders size={16} color="var(--border-accent)" />
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                        Interactive What-If Simulation
                      </h4>
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                        Simulated CA Certified Turnover: <strong style={{ color: 'var(--border-accent)', fontFamily: 'var(--font-mono)' }}>₹{sandboxTurnover.toFixed(1)} Crore</strong>
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="18"
                        step="0.5"
                        value={sandboxTurnover}
                        onChange={(e) => setSandboxTurnover(parseFloat(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--border-accent)' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                        <span>₹5.0 Cr</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹10.0 Cr (Mandatory Cutoff)</span>
                        <span>₹18.0 Cr</span>
                      </div>
                    </div>

                    <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: isCompliant ? 'var(--status-verified-bg)' : 'var(--status-contradicted-bg)', border: `1px solid ${isCompliant ? 'var(--status-verified-border)' : 'var(--status-contradicted-border)'}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 12, color: isCompliant ? 'var(--status-verified-text)' : 'var(--status-contradicted-text)' }}>
                        {isCompliant ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                        <span>Evaluated Verdict: {isCompliant ? 'VERIFIED' : 'CONTRADICTED'}</span>
                      </div>
                      <div style={{ fontSize: 11, color: isCompliant ? 'var(--status-verified-text)' : 'var(--status-contradicted-text)', marginTop: 2 }}>
                        {isCompliant
                          ? `₹${sandboxTurnover.toFixed(1)} Cr satisfies mandatory requirement of ₹${sandboxThreshold.toFixed(1)} Cr.`
                          : `₹${sandboxTurnover.toFixed(1)} Cr is below the mandatory threshold of ₹${sandboxThreshold.toFixed(1)} Cr (Deficit: -₹${(sandboxThreshold - sandboxTurnover).toFixed(1)} Cr).`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TIMELINE TAB */}
            {activeTab === 'TIMELINE' && (
              <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto', background: 'var(--bg-canvas)' }}>
                <div className="panel-card" style={{ maxWidth: 840, margin: '0 auto' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
                    Evidence Ingestion & Verification Sequence
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                      { time: '10:31:04', title: 'Clause Extracted from Tender Doc', desc: 'Requirement criteria identified: Minimum turnover ≥ ₹10.00 Cr under Clause 4.2.' },
                      { time: '10:31:12', title: 'Bid Form Ingested & Parsed', desc: 'Cover letter scanned: Declared turnover ₹12,00,00,000 found on Page 3.' },
                      { time: '10:31:14', title: 'CA Certificate Verified via UDIN', desc: 'ICAI register queried: UDIN 24089123AAAAA verified. Certified turnover ₹9,00,00,000 extracted.' },
                      { time: '10:31:15', title: 'Deterministic Contradiction Detected', desc: 'Rule comparison: ₹12 Cr ≠ ₹9 Cr and ₹9 Cr < ₹10 Cr. Verdict assigned CONTRADICTED.' },
                      { time: '10:31:16', title: 'Anomaly Logged & Appended to Audit Block #14', desc: 'Cryptographic hash generated: SHA-256 e3b0c442... chained to previous block #13.' }
                    ].map((step, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--border-accent)', width: 70, flexShrink: 0 }}>
                          {step.time}
                        </span>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--border-accent)', marginTop: 5, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{step.title}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{step.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* RELATED REQUIREMENTS TAB */}
            {activeTab === 'RELATED_REQS' && (
              <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto', background: 'var(--bg-canvas)' }}>
                <div className="panel-card" style={{ maxWidth: 900, margin: '0 auto' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
                    Bidder Compliance Summary · {bidderName}
                  </h3>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th style={{ width: 80 }}>#</th>
                        <th>Requirement</th>
                        <th style={{ width: 70 }}>Clause</th>
                        <th style={{ width: 140 }}>Status</th>
                        <th style={{ width: 90 }}>Confidence</th>
                        <th style={{ width: 80 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 'REQ-004', name: 'Annual Turnover ≥ ₹10 Cr', clause: '4.2', verdict: 'CONTRADICTED', conf: '98%' },
                        { id: 'REQ-005', name: 'OEM Authorization Certificate', clause: '5.1', verdict: 'CONTRADICTED', conf: '91%' },
                        { id: 'REQ-006', name: 'Udyam Registration Certificate', clause: '6.3', verdict: 'CONTRADICTED', conf: '99%' },
                        { id: 'REQ-007', name: 'GST Registration Compliance', clause: '7.2', verdict: 'UNVERIFIABLE', conf: '—' },
                        { id: 'REQ-008', name: 'PAN & ITR Verification', clause: '7.3', verdict: 'VERIFIED', conf: '96%' }
                      ].map(r => (
                        <tr key={r.id}>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--border-accent)' }}>{r.id}</td>
                          <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.name}</td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{r.clause}</td>
                          <td>
                            <span className={`status-pill ${r.verdict === 'CONTRADICTED' ? 'status-pill-contradicted' : r.verdict === 'VERIFIED' ? 'status-pill-verified' : 'status-pill-unverifiable'}`}>
                              {r.verdict}
                            </span>
                          </td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{r.conf}</td>
                          <td>
                            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--border-accent)', cursor: 'pointer' }}>Review →</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reasoned Officer Override Dialog Modal */}
      {isOverrideModalOpen && (
        <div
          className="drawer-backdrop"
          onClick={() => setIsOverrideModalOpen(false)}
          style={{ zIndex: 160, alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            className="modal-panel"
            style={{
              width: 580,
              background: '#FFFFFF',
              borderRadius: 10,
              padding: 24,
              boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
              border: '1px solid #CBD5E1'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <UserCheck size={18} color="var(--palette-teal)" />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  Statutory Officer Override: {requirementId}
                </h3>
              </div>
              <button onClick={() => setIsOverrideModalOpen(false)} style={{ color: '#94A3B8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: 'var(--status-contradicted-bg)', border: '1px solid var(--status-contradicted-border)', borderRadius: 6, padding: '10px 12px', fontSize: 12, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: 'var(--palette-crimson)' }}>Automated Finding: CONTRADICTED</div>
              <div style={{ color: '#475569', marginTop: 2 }}>
                Overriding will flip status to <strong>VERIFIED</strong>. CVC vigilance rules require mandatory recorded rationale.
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
                  Mandatory Statutory Justification:
                </label>
                <span style={{ fontSize: 11, color: overrideReasonInput.length >= 15 ? 'var(--palette-teal)' : 'var(--palette-crimson)' }}>
                  {overrideReasonInput.length}/15 chars min
                </span>
              </div>
              <textarea
                autoFocus
                rows={4}
                value={overrideReasonInput}
                onChange={(e) => setOverrideReasonInput(e.target.value)}
                placeholder="Example: Physical CA certificate verification confirmed additional ₹2.5 Cr turnover in audited JV ledger, satisfying minimum threshold under GTC 4.2."
                style={{
                  width: '100%',
                  padding: 10,
                  fontSize: 12,
                  fontFamily: 'var(--font-sans)',
                  border: `1px solid ${overrideReasonInput.length >= 15 ? '#CBD5E1' : '#FCA5A5'}`,
                  borderRadius: 6,
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '8px 12px', borderRadius: 6, border: '1px solid #E2E8F0', marginBottom: 16 }}>
              <span style={{ fontSize: 11, color: '#64748B' }}>Authorized Officer:</span>
              <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#0F172A' }}>
                CPCL-OFFICER-7749 (A. Sharma · CPCL Manali)
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => setIsOverrideModalOpen(false)} className="btn-secondary" style={{ fontSize: 12 }}>
                Cancel
              </button>
              <button
                onClick={handleConfirmOverride}
                disabled={isCommittingAction || overrideReasonInput.trim().length < 15}
                className="btn-primary"
                style={{ fontSize: 12 }}
              >
                <GitCommit size={14} />
                <span>{isCommittingAction ? 'Hashing & Signing...' : 'Sign Override & Append Hash Block'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Modal: Full Forensic Document Viewer */}
      <DocumentViewerModal
        isOpen={isDocViewerOpen}
        onClose={() => setIsDocViewerOpen(false)}
        documentId={selectedDocId}
        initialPage={targetDocPage}
        onOpenEvidenceDrawer={() => {
          setIsDocViewerOpen(false);
          handleOpenEvidence(selectedDocId === 'DOC-B2-CA-CERT' ? 'CA_CERT' : 'BID_FORM');
        }}
      />

      {/* Sub-Drawer: Global Evidence Drawer */}
      <EvidenceDrawer
        isOpen={isEvidenceDrawerOpen}
        onClose={() => setIsEvidenceDrawerOpen(false)}
        evidence={selectedEvidenceRecord}
        onOpenDocument={(docId, page) => {
          setIsEvidenceDrawerOpen(false);
          handleOpenDoc(docId.includes('BID') ? 'BID_FORM' : 'CA_CERT', page);
        }}
        onTraceRequirement={() => {
          setIsEvidenceDrawerOpen(false);
          setActiveTab('EVIDENCE_VIEW');
        }}
      />
    </>
  );
};
