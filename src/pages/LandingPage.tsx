import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  FileText,
  Building,
  Users,
  UserCheck,
  GitCommit,
  Lock,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const processSteps = [
    { icon: FileText, title: 'Tender Clause', desc: 'Extract requirements & rules', color: 'var(--palette-teal)' },
    { icon: FileText, title: 'Bidder Documents', desc: 'Find coordinate-grounded evidence', color: 'var(--palette-teal)' },
    { icon: Building, title: 'Authority Verification', desc: 'Check external government sources', color: 'var(--palette-teal)' },
    { icon: Users, title: 'Cross-Bidder Intelligence', desc: 'Detect relationship signals', color: 'var(--palette-cream)' },
    { icon: UserCheck, title: 'Officer Review', desc: 'You decide & record statutory rationale', color: 'var(--palette-cream)' },
    { icon: GitCommit, title: 'Audit Trail', desc: 'Reconstruct decisions anytime (SHA-256)', color: 'var(--palette-cream)' }
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--sidebar-bg)',
        color: 'var(--sidebar-text)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-sans)'
      }}
    >
      {/* 1. Header Bar */}
      <header
        style={{
          height: 56,
          borderBottom: '1px solid var(--sidebar-border)',
          background: 'var(--sidebar-bg)',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.05em', color: '#FFFFFF' }}>
            ANVESHA
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--palette-teal)' }}>
            अन्वेषा
          </span>
          <span style={{ fontSize: 10, color: 'var(--sidebar-text-muted)', marginLeft: 8, padding: '1px 6px', background: 'var(--sidebar-surface)', border: '1px solid var(--sidebar-border)', borderRadius: 3, fontFamily: 'var(--font-mono)' }}>
            SIH26100 · CPCL
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--sidebar-surface)',
              border: '1px solid var(--sidebar-border)',
              padding: '3px 8px',
              borderRadius: 12,
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--palette-teal)'
            }}
          >
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--palette-teal)', flexShrink: 0 }} />
            <span>Demo Mode</span>
            <span style={{ background: 'var(--palette-teal)', color: '#FFF', fontSize: 8, padding: '1px 4px', borderRadius: 2 }}>
              LIVE
            </span>
          </div>

          <button
            onClick={() => navigate('/tender')}
            className="btn-primary"
            style={{ fontSize: 11, padding: '5px 12px' }}
          >
            Enter Platform →
          </button>
        </div>
      </header>

      {/* 2. Hero Body */}
      <main
        style={{
          flex: 1,
          maxWidth: 1200,
          margin: '0 auto',
          padding: '48px 32px 32px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'center', marginBottom: 40 }}>
          {/* Left Column: Title, Tagline, CTAs */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--palette-cream)', marginBottom: 16, fontFamily: 'var(--font-mono)' }}>
              <span>CPCL / MoPNG</span>
              <span>·</span>
              <span>GeM Bid Compliance Verification</span>
            </div>

            <h1
              style={{
                fontSize: 38,
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                margin: '0 0 8px'
              }}
            >
              ANVESHA अन्वेषा
            </h1>

            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: 'var(--palette-teal)',
                marginBottom: 16
              }}
            >
              Evidence before Verdicts.
            </div>

            <p
              style={{
                fontSize: 14,
                color: 'var(--sidebar-text-muted)',
                lineHeight: 1.6,
                maxWidth: 480,
                marginBottom: 28
              }}
            >
              An AI-assisted, evidence-first bid compliance verification and decision-support platform for GeM procurement. Ground every claim to document coordinates, enforce deterministic rule logic, uncover cross-bidder collusion, and preserve 100% statutory human authority.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
              <button
                onClick={() => navigate('/tender')}
                className="btn-primary"
                style={{
                  fontSize: 13,
                  padding: '9px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <span>Explore Demo Tender</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => navigate('/tender/CPCL-2026-VALVES-7701/audit/reconstruction')}
                className="btn-secondary"
                style={{
                  fontSize: 13,
                  padding: '9px 16px',
                  background: 'var(--sidebar-surface)',
                  borderColor: 'var(--sidebar-border)',
                  color: 'var(--sidebar-text)'
                }}
              >
                <span>How it Works</span>
              </button>
            </div>
          </div>

          {/* Right Column: Flat Vector Process Rail & Layered Document Motif */}
          <div
            style={{
              background: 'var(--sidebar-surface)',
              border: '1px solid var(--sidebar-border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px 22px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--sidebar-border)', marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--sidebar-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Forensic Verification Pipeline
              </span>
              <span style={{ fontSize: 10, color: 'var(--palette-teal)', fontFamily: 'var(--font-mono)' }}>
                6 Stages
              </span>
            </div>

            {/* Vertical Process Rail */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {processSteps.map((step, idx) => {
                const IconComponent = step.icon;
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--sidebar-bg)',
                        border: '1px solid var(--sidebar-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: step.color,
                        flexShrink: 0
                      }}
                    >
                      <IconComponent size={14} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#FFFFFF' }}>
                        {step.title}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--sidebar-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {step.desc}
                      </div>
                    </div>

                    <ChevronRight size={12} color="var(--sidebar-text-muted)" style={{ opacity: 0.5 }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Bottom Stat Strip (Small, inline, not giant KPI cards) */}
        <div
          style={{
            background: 'var(--sidebar-surface)',
            border: '1px solid var(--sidebar-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16
          }}
        >
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#FFFFFF' }}>7</div>
            <div style={{ fontSize: 10, color: 'var(--sidebar-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Bidders Analysed</div>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--palette-teal)' }}>48</div>
            <div style={{ fontSize: 10, color: 'var(--sidebar-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Requirements</div>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--palette-teal)' }}>196</div>
            <div style={{ fontSize: 10, color: 'var(--sidebar-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Evidence Objects</div>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--palette-crimson)' }}>11</div>
            <div style={{ fontSize: 10, color: 'var(--sidebar-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Anomalies Found</div>
          </div>
        </div>

        {/* Minimal Footer */}
        <div style={{ textAlign: 'center', fontSize: 10, color: 'var(--sidebar-text-muted)', marginTop: 24 }}>
          Designed for Government Procurement · SIH26100 · Ministry of Petroleum & Natural Gas · CPCL
        </div>
      </main>
    </div>
  );
};
