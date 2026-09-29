import React from 'react';
import {
  X,
  CheckCircle2,
  ExternalLink,
  Layers,
  Cpu,
  FileText,
  Search,
  AlertTriangle,
  GitCommit,
  Shield,
  Activity,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PsCoveragePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenImpact?: () => void;
}

export const PsCoveragePanel: React.FC<PsCoveragePanelProps> = ({
  isOpen,
  onClose,
  onOpenImpact
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const coverageItems = [
    {
      sihClause: 'AI & Analytics Engine',
      sihRequirement: 'Intelligent extraction, parsing, and automated cross-verification of submitted tender documents against multi-portal data.',
      ANVESHAModule: 'ANVESHA Verification Engine & BoM Re-derivation',
      status: 'IMPLEMENTED',
      details: 'LayoutLM coordinate extraction + deterministic Python rule engine (BoM recalculation, threshold checks, date validation).',
      route: '/tender/CPCL-2026-VALVES-7701/requirements',
      icon: Cpu
    },
    {
      sihClause: 'Central Command Dashboard',
      sihRequirement: 'Consolidated overview of tender status, incoming bids, verification status, and key anomalies.',
      ANVESHAModule: 'Tender Investigation Command Centre',
      status: 'IMPLEMENTED',
      details: '7-stage evidence flow pipeline, 6 operational metrics, and priority-ranked Attention Queue (AN-001 to AN-005).',
      route: '/tender',
      icon: Layers
    },
    {
      sihClause: 'Multi-Portal Integration',
      sihRequirement: 'Cross-referencing bidder data with government portals: GeM, GSTN, MCA21, CPPP, Udyam MSME.',
      ANVESHAModule: 'Source Adapter Architecture & Fault Simulator',
      status: 'IMPLEMENTED',
      details: 'Pluggable adapters for all 5 registries with circuit-breaker fault tolerance and 504 gateway timeout degradation.',
      route: '/tender/CPCL-2026-VALVES-7701/source-health',
      icon: Activity
    },
    {
      sihClause: 'Submitted Document Analysis',
      sihRequirement: 'Deep inspection of balance sheets, CA certificates, OEM authorizations, and technical proposals.',
      ANVESHAModule: 'Split-Screen Document Viewer & Provenance Chain',
      status: 'IMPLEMENTED',
      details: 'Exact bounding-box visualizer with OCR tokens, CA UDIN verification, and multi-clause trace.',
      route: '/tender/CPCL-2026-VALVES-7701/bidder/BIDDER-002',
      icon: FileText
    },
    {
      sihClause: 'Missing & Inconsistent Information',
      sihRequirement: 'Identification of discrepancies between bidder claims and statutory filings, plus handling missing data.',
      ANVESHAModule: '4-State Machine & Contradiction Engine',
      status: 'IMPLEMENTED',
      details: 'Surfaces internal document contradictions (CTR-001) and temporal revocations (CTR-002). Missing data routes to UNVERIFIABLE.',
      route: '/tender/CPCL-2026-VALVES-7701/anomalies',
      icon: AlertTriangle
    },
    {
      sihClause: 'Compliance Assessment',
      sihRequirement: 'Evaluation of tender terms, technical specifications, and regulatory norms with human officer oversight.',
      ANVESHAModule: 'Clause-Level Compliance Matrix & Review Queue',
      status: 'IMPLEMENTED',
      details: 'Transparent 4-state verdicts (VERIFIED, CONTRADICTED, UNVERIFIABLE, PENDING) with mandatory reasoned officer overrides.',
      route: '/tender/CPCL-2026-VALVES-7701/review-queue',
      icon: Shield
    },
    {
      sihClause: 'Automated Reporting',
      sihRequirement: 'Comprehensive evaluation reports, audit summaries, and defensible tender dossiers.',
      ANVESHAModule: 'Cryptographic Decision Reconstruction & Dossiers',
      status: 'IMPLEMENTED',
      details: 'Complete replay of tender evaluation history with SHA-256 Merkle chain blocks for statutory defense.',
      route: '/tender/CPCL-2026-VALVES-7701/audit/reconstruction',
      icon: GitCommit
    },
    {
      sihClause: 'Faster Tender Evaluation',
      sihRequirement: 'Drastically shorten evaluation cycles while eliminating manual oversight errors.',
      ANVESHAModule: 'Attention Queue Prioritized by Uncertainty × Materiality',
      status: 'IMPLEMENTED',
      details: 'Triage rank (1 to 7) focuses officer time strictly on high-materiality anomalies rather than clean bids.',
      route: '/tender',
      icon: Clock
    },
    {
      sihClause: 'Improved Compliance & Transparency',
      sihRequirement: 'Zero black-box decisions, strict anti-corruption audit trails, and defensibility before CVC / CAG.',
      ANVESHAModule: 'Evidence-First Architecture & Network Intelligence',
      status: 'IMPLEMENTED',
      details: 'Discovers shared bank accounts (REL-001) and 94.2% text duplication between colluding bidders.',
      route: '/tender/CPCL-2026-VALVES-7701/network',
      icon: Search
    }
  ];

  return (
    <div className="drawer-backdrop" onClick={onClose} style={{ zIndex: 120, alignItems: 'center', justifyContent: 'center' }}>
      <div
        className="modal-panel"
        style={{
          width: 960,
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
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            background: 'var(--sidebar-surface)',
            color: '#FFFFFF'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="logo-badge">अन्वेषा</span>
              <span style={{ fontSize: 11, color: 'var(--palette-teal)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                SIH 2026 Compliance Audit
              </span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
              Problem Statement SIH26100 Scope Coverage Matrix
            </h2>
            <div style={{ fontSize: 12, color: 'var(--sidebar-text-muted)', marginTop: 4 }}>
              Direct mapping of official Ministry of Petroleum & Natural Gas / CPCL requirements to implemented ANVESHA subsystems.
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--sidebar-active-bg)',
              border: '1px solid var(--sidebar-border)',
              color: '#CBD5E1',
              padding: 6,
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Coverage Table */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', maxHeight: 'calc(90vh - 180px)' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '2px solid var(--border-default)', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 12px', width: '22%' }}>OFFICIAL SIH26100 SCOPE</th>
                <th style={{ padding: '10px 12px', width: '28%' }}>ANVESHA SUBSYSTEM</th>
                <th style={{ padding: '10px 12px', width: '38%' }}>TECHNICAL IMPLEMENTATION</th>
                <th style={{ padding: '10px 12px', width: '12%', textAlign: 'center' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {coverageItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid var(--border-default)',
                      fontSize: 12,
                      background: idx % 2 === 0 ? '#FFFFFF' : 'var(--bg-surface-elevated)'
                    }}
                  >
                    <td style={{ padding: '12px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Icon size={14} color="var(--palette-teal)" />
                        <span>{item.sihClause}</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>
                        {item.sihRequirement}
                      </div>
                    </td>

                    <td style={{ padding: '12px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.ANVESHAModule}
                      </div>
                      <div style={{ marginTop: 4 }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: 'var(--status-verified-bg)',
                            border: '1px solid var(--status-verified-border)',
                            color: 'var(--status-verified-text)',
                            fontSize: 10,
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)'
                          }}
                        >
                          <CheckCircle2 size={10} />
                          {item.status}
                        </span>
                      </div>
                    </td>

                    <td style={{ padding: '12px', verticalAlign: 'top', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {item.details}
                    </td>

                    <td style={{ padding: '12px', verticalAlign: 'middle', textAlign: 'center' }}>
                      <button
                        onClick={() => {
                          onClose();
                          navigate(item.route);
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '4px 8px',
                          background: 'rgba(49, 170, 169, 0.1)',
                          border: '1px solid var(--palette-teal)',
                          borderRadius: 4,
                          color: 'var(--palette-teal)',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                        title={`Jump to ${item.ANVESHAModule}`}
                      >
                        <span>Open</span>
                        <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            background: 'var(--bg-surface-elevated)',
            borderTop: '1px solid var(--border-default)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ fontSize: 11, color: 'var(--status-verified-text)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 size={14} />
            <span>9 of 9 Scope Deliverables Implemented & Grounded with Synthetic Dataset</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {onOpenImpact && (
              <button
                onClick={() => {
                  onClose();
                  onOpenImpact();
                }}
                className="btn-secondary"
                style={{ fontSize: 12 }}
              >
                <span>View Impact Targets</span>
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
