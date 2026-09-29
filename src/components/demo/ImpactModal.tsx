import React from 'react';
import {
  X,
  TrendingUp,
  Clock,
  FileCheck,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Layers,
  Database,
  ArrowRight
} from 'lucide-react';

interface ImpactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPsCoverage?: () => void;
}

export const ImpactModal: React.FC<ImpactModalProps> = ({
  isOpen,
  onClose,
  onOpenPsCoverage
}) => {
  if (!isOpen) return null;

  const kpis = [
    {
      title: 'Average Verification Time',
      target: '15 – 20 min / bidder',
      baseline: '180 – 240 min manual',
      status: 'Target Simulation',
      description: 'Expected time for ingestion, OCR token anchoring, automated registry cross-checks, and officer sign-off.',
      icon: Clock,
      color: '#2563EB',
      badge: 'EXPECTED RANGE'
    },
    {
      title: 'Documents Processed Per Bidder',
      target: '6.2 avg documents',
      baseline: '196 total evidence pages',
      status: 'Active Dataset',
      description: 'Full statutory coverage: CA turnover certificates, PAN, GST filings, Udyam MSME, BoM sheets, and OEM authorizations.',
      icon: FileCheck,
      color: '#059669',
      badge: 'SYNTHETIC TEST'
    },
    {
      title: 'Requirements Automatically Evaluated',
      target: '42 of 48 checks (87.5%)',
      baseline: '6 clauses × 7 bidders',
      status: 'Deterministic Rules',
      description: 'Statutory rules evaluated deterministically via Python logic without hallucinating mathematical comparisons.',
      icon: CheckCircle,
      color: '#10B981',
      badge: 'DETERMINISTIC'
    },
    {
      title: 'Contradictions Surfaced Pre-Award',
      target: '3 critical contradictions',
      baseline: '0 caught in manual draft',
      status: 'Discrepancy Catch',
      description: 'Surfaced ₹3 Cr turnover gap (Bidder 2), cancelled Udyam (Bidder 3), and residential valve OEM scope mismatch (Bidder 6).',
      icon: AlertTriangle,
      color: '#DC2626',
      badge: 'PRE-AWARD RISK'
    },
    {
      title: 'Unverifiable Cases Escalated',
      target: '1 case escalated (Bidder 7)',
      baseline: '0 unverified passes',
      status: 'Honest Uncertainty',
      description: 'NIC GST gateway 504 timeout classified as UNVERIFIABLE rather than guessed or falsely approved.',
      icon: HelpCircle,
      color: '#D97706',
      badge: 'ZERO GUESSING'
    },
    {
      title: 'Estimated Officer Review Workload',
      target: '30 – 45 min total review',
      baseline: '14 – 18 officer-hours',
      status: 'Projected Target',
      description: 'Officer reviews priority-ranked attention queue (Uncertainty × Materiality) instead of parsing every page from scratch.',
      icon: TrendingUp,
      color: '#7C3AED',
      badge: 'TARGET RANGE'
    },
    {
      title: 'Projected Officer Override Rate',
      target: '4% – 6% expected range',
      baseline: 'Human retains authority',
      status: 'Governance Model',
      description: 'Expected frequency of officer overriding system recommendations with mandatory statutory justification.',
      icon: ShieldCheck,
      color: '#475569',
      badge: 'GOVERNANCE'
    },
    {
      title: 'False Positive Target Benchmark',
      target: '< 1.2% target rate',
      baseline: 'Coordinate-grounded',
      status: 'Quality Metric',
      description: 'Minimizing false alarms by requiring bounding box coordinate verification before generating a contradiction alert.',
      icon: Layers,
      color: '#0284C7',
      badge: 'BENCHMARK TARGET'
    },
    {
      title: 'Evidence Trace Completion Rate',
      target: '100.0% grounded',
      baseline: '196 of 196 facts anchored',
      status: 'Zero Black-Box',
      description: 'Every extracted claim contains document page number, normalized bounding box coordinates, and source hash.',
      icon: Database,
      color: '#059669',
      badge: 'AUDIT REQUIREMENT'
    },
    {
      title: 'Source Failure Recovery Rate',
      target: '100% graceful handling',
      baseline: 'Zero unhandled crashes',
      status: 'Circuit Breaker',
      description: 'Registry downtime (GSTN, MCA21, Udyam) automatically routes through fallback queue and offline filing audit.',
      icon: AlertCircle,
      color: '#D97706',
      badge: 'RESILIENCE'
    }
  ];

  return (
    <div className="drawer-backdrop" onClick={onClose} style={{ zIndex: 120, alignItems: 'center', justifyContent: 'center' }}>
      <div
        className="modal-panel"
        style={{
          width: 920,
          maxHeight: '90vh',
          background: '#FFFFFF',
          borderRadius: 10,
          boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
          border: '1px solid #CBD5E1',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            background: '#0C1527',
            color: '#FFFFFF'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="logo-badge">अन्वेषा</span>
              <span style={{ fontSize: 11, color: '#60A5FA', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Impact Simulation Framework
              </span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
              Procurement Velocity & Compliance Impact Modeling
            </h2>
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>
              Estimated operational metrics for CPCL Manali Refinery Procurement Division rollout.
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

        {/* Mandatory SIH Jury Guardrail Disclaimer Banner */}
        <div
          style={{
            background: '#FEF3C7',
            borderBottom: '1px solid #FCD34D',
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}
        >
          <AlertTriangle size={16} color="#B45309" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: 12, color: '#92400E', lineHeight: 1.4 }}>
            <strong>STATUTORY BENCHMARK NOTICE:</strong> All figures presented are <strong>illustrative target ranges / simulation models</strong> based on the 7-bidder synthetic evaluation dataset. They represent expected rollout metrics, NOT claims of proven production results in live tenders.
          </div>
        </div>

        {/* Metrics Grid */}
        <div style={{ padding: '24px', overflowY: 'auto', maxHeight: 'calc(90vh - 190px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {kpis.map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={idx}
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: 8,
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'border-color 150ms'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#94A3B8'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            background: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: kpi.color
                          }}
                        >
                          <Icon size={16} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                          {kpi.title}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 4,
                          background: '#E2E8F0',
                          color: '#475569',
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        {kpi.badge}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '8px 0 6px' }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: kpi.color, fontFamily: 'var(--font-mono)' }}>
                        {kpi.target}
                      </span>
                      <span style={{ fontSize: 11, color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                        (baseline: {kpi.baseline})
                      </span>
                    </div>

                    <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.5, margin: 0 }}>
                      {kpi.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            background: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'var(--font-mono)' }}>
            Methodology: Synthetic evaluation run on 7 Bidders · 48 Requirements · 196 Evidence objects
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {onOpenPsCoverage && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPsCoverage();
                }}
                className="btn-secondary"
                style={{ fontSize: 12 }}
              >
                <span>View SIH26100 Scope Coverage</span>
                <ArrowRight size={14} />
              </button>
            )}
            <button onClick={onClose} className="btn-primary" style={{ fontSize: 12 }}>
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
