import React from 'react';
import {
  X,
  ShieldCheck,
  AlertOctagon,
  Layers,
  Scale,
  Activity,
  GitCommit,
  Cpu,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface WhyThisMattersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenImpact: () => void;
  onOpenPsCoverage: () => void;
}

export const WhyThisMattersDrawer: React.FC<WhyThisMattersDrawerProps> = ({
  isOpen,
  onClose,
  onOpenImpact,
  onOpenPsCoverage
}) => {
  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose} style={{ zIndex: 120 }}>
      <div
        className="drawer-panel"
        style={{
          width: 580,
          background: '#FFFFFF',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.15)',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#0C1527',
            color: '#FFFFFF'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="logo-badge">अन्वेषा</span>
              <span style={{ fontSize: 11, color: '#60A5FA', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Executive Briefing
              </span>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
              Why ANVESHA Matters in CPSE Procurement
            </h2>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
              SIH 2026 Problem Statement SIH26100 · MoPNG · CPCL Manali Refinery
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#1E2D4A',
              border: '1px solid #334155',
              color: '#CBD5E1',
              padding: 6,
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content: 7 Pillars */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Pillar 1: The Problem */}
          <div style={{ borderLeft: '3px solid #DC2626', paddingLeft: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <AlertOctagon size={16} color="#DC2626" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                1. The Statutory Reality
              </span>
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>
              Procurement Officers Bear 100% Personal Accountability
            </h3>
            <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
              Under CVC guidelines and GFR 2017, procurement officers manually verify dozens of statutory eligibility, financial, and technical criteria across 5+ disconnected portals. Human fatigue causes subtle contradictions to slip through, while paper-based cartel networks remain undetectable.
            </p>
          </div>

          {/* Pillar 2: ANVESHA */}
          <div style={{ borderLeft: '3px solid #2563EB', paddingLeft: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Layers size={16} color="#2563EB" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                2. What ANVESHA Does
              </span>
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>
              Unifies Multi-Source Evidence & Surfaces Contradictions
            </h3>
            <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
              ANVESHA ingests bidder PDFs, performs layout-aware token extraction, anchors facts to coordinates, and queries government registries in parallel. It automatically flags cross-document discrepancies (e.g. ₹12 Cr claimed vs ₹9 Cr CA certified) and surfaces hidden shared banking coordinates.
            </p>
          </div>

          {/* Pillar 3: The Difference */}
          <div style={{ borderLeft: '3px solid #059669', paddingLeft: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <CheckCircle2 size={16} color="#059669" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                3. The Critical Difference
              </span>
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>
              Evidence-First, Never an Opaque Percentage Score
            </h3>
            <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
              Unlike generic AI tools that output a black-box "85% compliant" score that no government officer can defend in an audit, ANVESHA uses a 4-state verdict machine (<span className="verdict-tag verified" style={{ padding: '1px 5px', fontSize: 10 }}>VERIFIED</span>, <span className="verdict-tag contradicted" style={{ padding: '1px 5px', fontSize: 10 }}>CONTRADICTED</span>, <span className="verdict-tag unverifiable" style={{ padding: '1px 5px', fontSize: 10 }}>UNVERIFIABLE</span>, <span className="verdict-tag pending" style={{ padding: '1px 5px', fontSize: 10 }}>PENDING REVIEW</span>). Every finding links directly to a document page and bounding box.
            </p>
          </div>

          {/* Pillar 4: Safety */}
          <div style={{ borderLeft: '3px solid #D97706', paddingLeft: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Scale size={16} color="#D97706" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                4. Safety & Governance
              </span>
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>
              AI Recommends, Rules Verify, the Officer Decides
            </h3>
            <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
              No math in LLMs. Thresholds, dates, and BoM re-derivation run strictly through deterministic Python code. AI is strictly confined to coordinate extraction. The procurement officer retains sole statutory authority, with every override requiring a formal written reason.
            </p>
          </div>

          {/* Pillar 5: Resilience */}
          <div style={{ borderLeft: '3px solid #7C3AED', paddingLeft: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Activity size={16} color="#7C3AED" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                5. Fault Resilience & Honest Uncertainty
              </span>
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>
              Failed Registries Degrade to UNVERIFIABLE, Never Hallucinated
            </h3>
            <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
              When the GST portal returns a 504 Gateway Timeout (as simulated on Bidder 7), ANVESHA does not assume compliance or fabricate data. It records the endpoint failure in the circuit breaker, flags the requirement as UNVERIFIABLE, and offers offline filing verification.
            </p>
          </div>

          {/* Pillar 6: Auditability */}
          <div style={{ borderLeft: '3px solid #0F172A', paddingLeft: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <GitCommit size={16} color="#0F172A" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                6. Cryptographic Audit Defensibility
              </span>
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>
              Tamper-Evident SHA-256 Decision Reconstruction
            </h3>
            <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
              Every ingestion, OCR extraction, rule execution, and officer sign-off generates a cryptographically hashed block. The complete decision state can be replayed years later to defend against CVC inquiries or judicial challenges.
            </p>
          </div>

          {/* Pillar 7: Production Path */}
          <div style={{ borderLeft: '3px solid #2563EB', paddingLeft: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Cpu size={16} color="#2563EB" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                7. Production Path
              </span>
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>
              Plug-and-Play Gateway Adapters for Live Government APIs
            </h3>
            <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
              The prototype's synthetic dataset operates behind strict TypeScript interfaces (GstAdapter, UdyamAdapter, McaAdapter). To deploy in production, CPCL simply drops in authorized NIC/GeM REST endpoints without altering any verification logic or UI workflows.
            </p>
          </div>

        </div>

        {/* Footer Quick Links */}
        <div style={{ marginTop: 'auto', padding: '16px 24px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <button
            onClick={() => {
              onClose();
              onOpenImpact();
            }}
            className="btn-secondary"
            style={{ fontSize: 12, flex: 1, justifyContent: 'center' }}
          >
            <span>View Impact Targets</span>
            <ArrowRight size={14} />
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenPsCoverage();
            }}
            className="btn-primary"
            style={{ fontSize: 12, flex: 1, justifyContent: 'center' }}
          >
            <span>SIH26100 Scope Coverage</span>
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
