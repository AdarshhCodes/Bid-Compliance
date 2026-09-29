import React, { useState } from 'react';
import {
  X,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  ChevronRight,
  Info,
  Layers,
  Sparkles,
  GitCompare,
  Fingerprint
} from 'lucide-react';

interface DocumentFingerprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEvidenceDrawer?: (evidenceId: string) => void;
}

export const DocumentFingerprintModal: React.FC<DocumentFingerprintModalProps> = ({
  isOpen,
  onClose,
  onOpenEvidenceDrawer
}) => {
  const [activeTab, setActiveTab] = useState<'TEXT_OVERLAP' | 'METADATA' | 'TABLE_STRUCTURE'>('TEXT_OVERLAP');

  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose} style={{ zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 1220,
          maxWidth: '97vw',
          height: '92vh',
          background: '#FFFFFF',
          borderRadius: 8,
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
          border: '1px solid #CBD5E1',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* 1. Header Banner */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid #E2E8F0',
            background: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--palette-maroon)', fontWeight: 800 }}>
                <Fingerprint size={20} />
                <span style={{ fontSize: 16, color: '#0F172A' }}>Document Fingerprint Investigation</span>
              </div>
              <span className="verdict-badge verdict-relationship">
                RELATIONSHIP SIGNAL: 94.2% SIMILARITY
              </span>
            </div>
            <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
              Bidder 4 (Apex Industrial Tech) ↔ Bidder 5 (Zenith Flow Equipments) · Technical Proposal QAP Comparison
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="provenance-tag">STRUCTURAL TEXT ANALYSIS</span>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#E2E8F0',
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 2. Mandatory Language Rule Warning (SIH Defensibility) */}
        <div
          style={{
            background: '#FFFBEB',
            borderBottom: '1px solid #FDE68A',
            padding: '8px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 11,
            color: '#92400E'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={14} color="#D97706" />
            <span>
              <strong>RELATIONSHIP SIGNAL ONLY — NOT A DETERMINATION OF MISCONDUCT.</strong> High text overlap can arise from standard OEM boilerplate, common ISO consultants, or joint bidding. Requires statutory human inquiry.
            </span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#B45309' }}>
            N-Gram Size: 5 · Cosine Distance: 0.058
          </span>
        </div>

        {/* 3. Navigation Sub-Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', padding: '0 20px', background: '#FFFFFF', gap: 20 }}>
          {[
            { key: 'TEXT_OVERLAP', label: 'Verbatim Paragraph Overlap (Section 3.2)' },
            { key: 'METADATA', label: 'PDF Workstation Metadata Fingerprint' },
            { key: 'TABLE_STRUCTURE', label: 'Inspection Matrix Table Alignment' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                padding: '10px 4px',
                fontSize: 13,
                fontWeight: activeTab === tab.key ? 700 : 500,
                color: activeTab === tab.key ? 'var(--palette-teal)' : '#64748B',
                borderBottom: activeTab === tab.key ? '2px solid var(--palette-teal)' : '2px solid transparent',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 4. Comparison Body Viewports */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'TEXT_OVERLAP' && (
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden', background: '#F8FAFC' }}>
              {/* Document Viewport Left: Bidder 4 */}
              <div style={{ borderRight: '1px solid #CBD5E1', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '10px 16px', background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#1E293B' }}>BIDDER 4: Apex Industrial Tech Pvt Ltd</span>
                    <div style={{ fontSize: 10, color: '#64748B' }}>Doc: Tech_Proposal_Apex_2026.pdf (Page 14)</div>
                  </div>
                  <span style={{ fontSize: 10, background: 'rgba(49, 170, 169, 0.12)', color: 'var(--palette-teal)', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                    Submission: 15-Sep 12:04
                  </span>
                </div>

                <div style={{ flex: 1, padding: 20, overflowY: 'auto', background: '#FFFFFF', fontSize: 12, lineHeight: 1.7, color: '#1E293B', fontFamily: 'serif' }}>
                  <div style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 10, color: '#0F172A' }}>
                    3.2 Quality Assurance & Pressure Containment Protocol
                  </div>

                  <p style={{ marginBottom: 14 }}>
                    The testing procedures for all forged body carbon-steel trunnion mounted valves shall be conducted strictly in conformance with API Specification 6D (Twenty-Fourth Edition) and ISO 14313.
                  </p>

                  {/* Verbatim Matching Block */}
                  <div
                    style={{
                      background: '#FEF9C3',
                      borderLeft: '4px solid #EAB308',
                      padding: '10px 14px',
                      borderRadius: '0 4px 4px 0',
                      marginBottom: 14
                    }}
                  >
                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: '#854D0E', display: 'block', marginBottom: 4 }}>
                      ⚡ 100% Verbatim Match (148 Consecutive Words)
                    </span>
                    "Prior to final hydrostatic shell testing, each valve assembly shall undergo comprehensive non-destructive examination including 100% magnetic particle testing on all circumferential weld bevels. Shell pressure testing shall be held continuously at 1.5 times the maximum rated design pressure for a minimum holding duration of fifteen (15) uninterrupted minutes. Any visible weeping, sweating, or pressure decay exceeding 0.05 bar shall constitute immediate rejection."
                  </div>

                  {/* Unique Shared Typo Highlight */}
                  <div
                    style={{
                      background: 'var(--status-contradicted-bg)',
                      borderLeft: '4px solid var(--palette-crimson)',
                      padding: '10px 14px',
                      borderRadius: '0 4px 4px 0',
                      marginBottom: 14
                    }}
                  >
                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: '#991B1B', display: 'block', marginBottom: 4 }}>
                      🚨 Shared Lexical Anomaly (Identical Typo)
                    </span>
                    "Subsequent to shell verification, the high-pressure seat integrity shall be verified utilizing an automated <mark style={{ background: '#FECACA', color: '#991B1B', fontWeight: 800, padding: '0 4px', borderRadius: 2 }}>hydrolic pressure test</mark> rig calibrated to ISO 17025 standards."
                    <div style={{ fontSize: 10, color: '#991B1B', marginTop: 4 }}>
                      Typo: "hydrolic" instead of "hydraulic" — identical spelling error appears across both ostensibly independent proposals.
                    </div>
                  </div>

                  <p>
                    All test charts shall be digitally archived with calibrated digital pressure transducers.
                  </p>
                </div>
              </div>

              {/* Document Viewport Right: Bidder 5 */}
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '10px 16px', background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#1E293B' }}>BIDDER 5: Zenith Flow Equipments LLP</span>
                    <div style={{ fontSize: 10, color: '#64748B' }}>Doc: Technical_Bid_Zenith_Manali.pdf (Page 11)</div>
                  </div>
                  <span style={{ fontSize: 10, background: 'var(--status-relationship-bg)', color: 'var(--status-relationship-text)', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                    Submission: 15-Sep 12:08 (+4 mins)
                  </span>
                </div>

                <div style={{ flex: 1, padding: 20, overflowY: 'auto', background: '#FFFFFF', fontSize: 12, lineHeight: 1.7, color: '#1E293B', fontFamily: 'serif' }}>
                  <div style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 10, color: '#0F172A' }}>
                    3.2 Quality Assurance & Pressure Containment Protocol
                  </div>

                  <p style={{ marginBottom: 14 }}>
                    The testing procedures for all forged body carbon-steel trunnion mounted valves shall be conducted strictly in conformance with API Specification 6D (Twenty-Fourth Edition) and ISO 14313.
                  </p>

                  {/* Verbatim Matching Block */}
                  <div
                    style={{
                      background: '#FEF9C3',
                      borderLeft: '4px solid #EAB308',
                      padding: '10px 14px',
                      borderRadius: '0 4px 4px 0',
                      marginBottom: 14
                    }}
                  >
                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: '#854D0E', display: 'block', marginBottom: 4 }}>
                      ⚡ 100% Verbatim Match (148 Consecutive Words)
                    </span>
                    "Prior to final hydrostatic shell testing, each valve assembly shall undergo comprehensive non-destructive examination including 100% magnetic particle testing on all circumferential weld bevels. Shell pressure testing shall be held continuously at 1.5 times the maximum rated design pressure for a minimum holding duration of fifteen (15) uninterrupted minutes. Any visible weeping, sweating, or pressure decay exceeding 0.05 bar shall constitute immediate rejection."
                  </div>

                  {/* Unique Shared Typo Highlight */}
                  <div
                    style={{
                      background: 'var(--status-contradicted-bg)',
                      borderLeft: '4px solid var(--palette-crimson)',
                      padding: '10px 14px',
                      borderRadius: '0 4px 4px 0',
                      marginBottom: 14
                    }}
                  >
                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: '#991B1B', display: 'block', marginBottom: 4 }}>
                      🚨 Shared Lexical Anomaly (Identical Typo)
                    </span>
                    "Subsequent to shell verification, the high-pressure seat integrity shall be verified utilizing an automated <mark style={{ background: '#FECACA', color: '#991B1B', fontWeight: 800, padding: '0 4px', borderRadius: 2 }}>hydrolic pressure test</mark> rig calibrated to ISO 17025 standards."
                    <div style={{ fontSize: 10, color: '#991B1B', marginTop: 4 }}>
                      Typo: "hydrolic" instead of "hydraulic" — identical spelling error appears across both ostensibly independent proposals.
                    </div>
                  </div>

                  <p>
                    All test charts shall be digitally archived with calibrated digital pressure transducers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'METADATA' && (
            <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                Underlying PDF Workstation Metadata Analysis
              </h3>
              <p style={{ fontSize: 12, color: '#64748B', marginBottom: 20 }}>
                Forensic inspection of the binary PDF dictionary trailers, author handles, and software toolchains.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="panel-card">
                  <div className="panel-card-header">
                    <span className="panel-title">Bidder 4 PDF Metadata</span>
                    <span className="provenance-tag">Apex Industrial Tech</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                    <div>Producer: <strong style={{ color: '#0F172A' }}>PDFKit 0.8.2 (Windows 11)</strong></div>
                    <div>Author Tag: <strong style={{ color: 'var(--palette-crimson)' }}>DESKTOP-LUB0TNN\Engineer01</strong></div>
                    <div>Creation Timestamp: <span style={{ color: 'var(--palette-teal)' }}>2026-09-15T11:42:10Z</span></div>
                    <div>Page Size: 595.27 x 841.89 pts (A4)</div>
                    <div>Font Subsets: ArialMT, TimesNewRomanPSMT</div>
                  </div>
                </div>

                <div className="panel-card" style={{ borderColor: '#FCA5A5' }}>
                  <div className="panel-card-header">
                    <span className="panel-title">Bidder 5 PDF Metadata</span>
                    <span className="provenance-tag" style={{ color: 'var(--status-relationship-text)', borderColor: 'var(--status-relationship-border)', background: 'var(--status-relationship-bg)' }}>Zenith Flow Equipments</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                    <div>Producer: <strong style={{ color: '#0F172A' }}>PDFKit 0.8.2 (Windows 11)</strong></div>
                    <div>Author Tag: <strong style={{ color: 'var(--palette-crimson)' }}>DESKTOP-LUB0TNN\Engineer01</strong></div>
                    <div>Creation Timestamp: <span style={{ color: 'var(--palette-teal)' }}>2026-09-15T11:46:22Z (+4m 12s)</span></div>
                    <div>Page Size: 595.27 x 841.89 pts (A4)</div>
                    <div>Font Subsets: ArialMT, TimesNewRomanPSMT</div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--status-contradicted-bg)', border: '1px solid var(--status-contradicted-border)', padding: '12px 16px', borderRadius: 6, marginTop: 20, fontSize: 12, color: 'var(--status-contradicted-text)' }}>
                <strong>Workstation Match Finding:</strong> Both technical proposals were compiled on the exact same machine identifier (<code>DESKTOP-LUB0TNN</code>) under the same OS user account, just 4 minutes and 12 seconds apart.
              </div>
            </div>
          )}

          {activeTab === 'TABLE_STRUCTURE' && (
            <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                Inspection Test Plan (ITP) Table Geometry Comparison
              </h3>
              <p style={{ fontSize: 12, color: '#64748B', marginBottom: 20 }}>
                Visual bounding box alignment of submitted Quality Assurance tables.
              </p>

              <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: 20, borderRadius: 6, fontSize: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, textAlign: 'center', marginBottom: 14 }}>
                  <div style={{ padding: 10, background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 4 }}>
                    <div style={{ fontSize: 10, color: '#64748B' }}>Column Width Vector</div>
                    <strong style={{ color: '#16A34A' }}>100% Identical</strong>
                  </div>
                  <div style={{ padding: 10, background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 4 }}>
                    <div style={{ fontSize: 10, color: '#64748B' }}>Table Row Sequence</div>
                    <strong style={{ color: '#16A34A' }}>12 of 12 Matched</strong>
                  </div>
                  <div style={{ padding: 10, background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 4 }}>
                    <div style={{ fontSize: 10, color: '#64748B' }}>Holding Period Specs</div>
                    <strong style={{ color: '#16A34A' }}>15 mins across all classes</strong>
                  </div>
                  <div style={{ padding: 10, background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 4 }}>
                    <div style={{ fontSize: 10, color: '#64748B' }}>Structural Similarity</div>
                    <strong style={{ color: 'var(--palette-crimson)' }}>94.2% Structural Match</strong>
                  </div>
                </div>

                <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.6 }}>
                  Both proposals use identical non-standard column headers: <code>["Activity Stage", "Scope of Inspection", "Hold Point Category", "Third Party Agency (TPIA) Sign-off"]</code>.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. Footer Actions */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid #E2E8F0',
            background: '#F8FAFC',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ fontSize: 11, color: '#64748B' }}>
            Flagged under SIH26100 whole-tender graph collusion scrutiny. Connected with Shared Bank Account (HDFC0001234).
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => {
                if (onOpenEvidenceDrawer) {
                  onOpenEvidenceDrawer('EVD-B4-B5-PROPOSAL-SIMILARITY');
                } else {
                  alert("Opening Evidence Drawer for Document Similarity signal (94.2%).");
                }
              }}
              className="btn-secondary"
              style={{ fontSize: 11 }}
            >
              <span>View Evidence Drawer</span>
            </button>
            <button onClick={onClose} className="btn-primary" style={{ fontSize: 11 }}>
              <span>Return to Network Graph</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
