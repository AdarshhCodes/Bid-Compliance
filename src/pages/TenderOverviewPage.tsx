import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FileText,
  Users,
  CheckSquare,
  Shield,
  AlertTriangle,
  Clock,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Activity,
  Layers,
  Database,
  Network,
  GitCommit,
  Search,
  Filter
} from 'lucide-react';
import { Tender, Bidder, Bid } from '../types';
import { getTenderById } from '../services/tenderService';
import { getAllBidders, getAllBids } from '../services/bidderService';

export const TenderOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isBiddersView = location.pathname.includes('/bidders');
  const tenderId = 'CPCL-2026-VALVES-7701';

  const [tender, setTender] = useState<Tender | null>(null);
  const [bidders, setBidders] = useState<Bidder[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [attentionFilter, setAttentionFilter] = useState<'ALL' | 'CONTRADICTED' | 'UNVERIFIABLE' | 'RELATIONSHIP' | 'OTHER'>('ALL');
  const [bidderSearch, setBidderSearch] = useState('');
  const [bidderVerdictFilter, setBidderVerdictFilter] = useState<'ALL' | 'VERIFIED' | 'CONTRADICTED' | 'UNVERIFIABLE' | 'RELATIONSHIP'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const t = await getTenderById('CPCL/2026/VALVES-7701');
      const bList = await getAllBidders('CPCL/2026/VALVES-7701');
      const bMap = await getAllBids('CPCL/2026/VALVES-7701');
      setTender(t);
      setBidders(bList);
      setBids(bMap);
      setLoading(false);
    }
    load();
  }, []);

  if (loading || !tender) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
        Verifying tender intelligence dossier and evidence pipeline...
      </div>
    );
  }

  // Attention Queue Items (Matching Screenshot 1 & 2)
  const attentionItems = [
    {
      id: 'AN-001',
      issue: 'Turnover contradiction',
      bidder: 'Apex Process Systems Pvt Ltd',
      bidderId: 'BIDDER-002',
      details: 'Bid form: ₹12 Cr | CA certificate: ₹9 Cr',
      status: 'CONTRADICTED',
      priority: 'P1',
      actionLabel: 'Investigate →',
      targetPath: `/tender/${tenderId}/bidder/BIDDER-002`,
      filterCategory: 'CONTRADICTED'
    },
    {
      id: 'AN-002',
      issue: 'Udyam registration stale',
      bidder: 'Bharat Industrial Controls',
      bidderId: 'BIDDER-003',
      details: 'Registry: Cancelled on 04 Aug 2026',
      status: 'CONTRADICTED',
      priority: 'P1',
      actionLabel: 'Investigate →',
      targetPath: `/tender/${tenderId}/bidder/BIDDER-003`,
      filterCategory: 'CONTRADICTED'
    },
    {
      id: 'AN-003',
      issue: 'Shared banking identity',
      bidder: 'Bidder 4 ↔ Bidder 5',
      bidderId: 'BIDDER-004',
      details: 'Same IFSC + Account (50200088991122)',
      status: 'RELATIONSHIP',
      priority: 'P1',
      actionLabel: 'View Graph →',
      targetPath: `/tender/${tenderId}/network`,
      filterCategory: 'RELATIONSHIP'
    },
    {
      id: 'AN-004',
      issue: 'OEM scope mismatch',
      bidder: 'Dynamic Flow Solutions',
      bidderId: 'BIDDER-006',
      details: 'Authorization for different product category',
      status: 'CONTRADICTED',
      priority: 'P2',
      actionLabel: 'Investigate →',
      targetPath: `/tender/${tenderId}/bidder/BIDDER-006`,
      filterCategory: 'CONTRADICTED'
    },
    {
      id: 'AN-005',
      issue: 'GST source unavailable',
      bidder: 'Eastern Process Equipments',
      bidderId: 'BIDDER-007',
      details: 'GST API: Gateway timeout (504)',
      status: 'UNVERIFIABLE',
      priority: 'P1',
      actionLabel: 'Retry →',
      targetPath: `/tender/${tenderId}/bidder/BIDDER-007`,
      filterCategory: 'UNVERIFIABLE'
    }
  ];

  const filteredAttentionItems = attentionItems.filter(item => {
    if (attentionFilter === 'ALL') return true;
    if (attentionFilter === 'CONTRADICTED') return item.filterCategory === 'CONTRADICTED';
    if (attentionFilter === 'UNVERIFIABLE') return item.filterCategory === 'UNVERIFIABLE';
    if (attentionFilter === 'RELATIONSHIP') return item.filterCategory === 'RELATIONSHIP';
    return true;
  });

  const filteredBidders = bidders.filter(b => {
    const bid = bids.find(x => x.bidderId === b.id);
    const v = bid?.overallVerdict;
    if (bidderVerdictFilter === 'VERIFIED' && v !== 'VERIFIED') return false;
    if (bidderVerdictFilter === 'CONTRADICTED' && v !== 'CONTRADICTED') return false;
    if (bidderVerdictFilter === 'UNVERIFIABLE' && v !== 'UNVERIFIABLE') return false;
    if (bidderVerdictFilter === 'RELATIONSHIP' && !['BIDDER-004', 'BIDDER-005'].includes(b.id)) return false;

    if (bidderSearch.trim()) {
      const q = bidderSearch.toLowerCase().trim();
      const match =
        b.id.toLowerCase().includes(q) ||
        b.legalName.toLowerCase().includes(q) ||
        b.pan.toLowerCase().includes(q) ||
        b.gstin.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleSubTabClick = (tabKey: string) => {
    if (tabKey === 'OVERVIEW') {
      navigate('/tender');
    } else if (tabKey === 'BIDDERS') {
      navigate(`/tender/${tenderId}/bidders`);
    } else if (tabKey === 'REQUIREMENTS') {
      navigate(`/tender/${tenderId}/requirements`);
    } else if (tabKey === 'DOCUMENTS') {
      navigate(`/tender/${tenderId}/evidence`);
    } else if (tabKey === 'ANOMALIES') {
      navigate(`/tender/${tenderId}/anomalies`);
    } else if (tabKey === 'TIMELINE') {
      navigate(`/tender/${tenderId}/audit/reconstruction`);
    }
  };

  return (
    <div style={{ maxWidth: 1320, margin: '0 auto' }}>
      {/* 1. Header Banner & Sub-Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>CPCL / Industrial Pumping & Process Equipment</span>
            <span className="stage-badge">Technical Evaluation</span>
          </h1>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
            Tender Ref: CPCL/PROC/2026/047 · Published: 12 Aug 2026 · Bid Submission: 18 Aug 2026
          </div>
        </div>

        {/* Sub-tabs matching reference screenshot */}
        <div style={{ display: 'flex', background: 'var(--border-default)', padding: 2, borderRadius: 'var(--radius-sm)' }}>
          {[
            { key: 'OVERVIEW', label: 'Overview' },
            { key: 'BIDDERS', label: 'Bidders (7)' },
            { key: 'REQUIREMENTS', label: 'Requirements (48)' },
            { key: 'DOCUMENTS', label: 'Documents (196)' },
            { key: 'ANOMALIES', label: 'Anomalies (11)' },
            { key: 'TIMELINE', label: 'Timeline' }
          ].map(tab => {
            const isActive = isBiddersView ? tab.key === 'BIDDERS' : tab.key === 'OVERVIEW';
            return (
              <button
                key={tab.key}
                onClick={() => handleSubTabClick(tab.key)}
                style={{
                  padding: '4px 10px',
                  fontSize: 11,
                  fontWeight: isActive ? 700 : 500,
                  borderRadius: 3,
                  background: isActive ? 'var(--bg-surface)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================== VIEW 1: TENDER OVERVIEW ===================== */}
      {!isBiddersView && (
        <>
          {/* 2. Interactive Evidence Flow Pipeline */}
          <div className="panel-card" style={{ marginBottom: 'var(--space-4)', padding: '12px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                EVIDENCE FLOW PIPELINE
              </span>
              <span style={{ fontSize: 11, color: 'var(--border-accent)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                Active Scrutiny State: Phase 4
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Step 1: Documents */}
              <div className="flow-step" onClick={() => navigate(`/tender/${tenderId}/evidence`)}>
                <div className="flow-icon" style={{ background: 'var(--status-pending-bg)', color: 'var(--status-pending-text)', border: '1px solid var(--status-pending-border)' }}>
                  <FileText size={15} />
                </div>
                <div>
                  <div className="flow-label">Documents</div>
                  <div className="flow-sub">196 ingested</div>
                </div>
              </div>
              <div className="flow-arrow">→</div>

              {/* Step 2: Extraction */}
              <div className="flow-step" onClick={() => navigate(`/tender/${tenderId}/evidence`)}>
                <div className="flow-icon" style={{ background: 'var(--status-verified-bg)', color: 'var(--status-verified-text)', border: '1px solid var(--status-verified-border)' }}>
                  <Layers size={15} />
                </div>
                <div>
                  <div className="flow-label">Extraction</div>
                  <div className="flow-sub">166 processed</div>
                </div>
              </div>
              <div className="flow-arrow">→</div>

              {/* Step 3: Verification */}
              <div className="flow-step" onClick={() => navigate(`/tender/${tenderId}/requirements`)}>
                <div className="flow-icon" style={{ background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-strong)' }}>
                  <CheckSquare size={15} />
                </div>
                <div>
                  <div className="flow-label">Verification</div>
                  <div className="flow-sub">48 requirements</div>
                </div>
              </div>
              <div className="flow-arrow">→</div>

              {/* Step 4: Contradictions */}
              <div className="flow-step" onClick={() => navigate(`/tender/${tenderId}/bidder/BIDDER-002`)}>
                <div className="flow-icon" style={{ background: 'var(--status-contradicted-bg)', color: 'var(--status-contradicted-text)', border: '1px solid var(--status-contradicted-border)' }}>
                  <AlertTriangle size={15} />
                </div>
                <div>
                  <div className="flow-label" style={{ color: 'var(--status-contradicted-text)' }}>Contradictions</div>
                  <div className="flow-sub">11 findings</div>
                </div>
              </div>
              <div className="flow-arrow">→</div>

              {/* Step 5: Relationships */}
              <div className="flow-step" onClick={() => navigate(`/tender/${tenderId}/network`)}>
                <div className="flow-icon" style={{ background: 'var(--status-relationship-bg)', color: 'var(--status-relationship-text)', border: '1px solid var(--status-relationship-border)' }}>
                  <Network size={15} />
                </div>
                <div>
                  <div className="flow-label">Relationships</div>
                  <div className="flow-sub">3 signals</div>
                </div>
              </div>
              <div className="flow-arrow">→</div>

              {/* Step 6: Officer Review */}
              <div className="flow-step" onClick={() => navigate(`/tender/${tenderId}/review-queue`)}>
                <div className="flow-icon" style={{ background: 'var(--status-unverifiable-bg)', color: 'var(--status-unverifiable-text)', border: '1px solid var(--status-unverifiable-border)' }}>
                  <Clock size={15} />
                </div>
                <div>
                  <div className="flow-label">Officer Review</div>
                  <div className="flow-sub">4 pending</div>
                </div>
              </div>
              <div className="flow-arrow">→</div>

              {/* Step 7: Audit */}
              <div className="flow-step" onClick={() => navigate(`/tender/${tenderId}/audit/reconstruction`)}>
                <div className="flow-icon" style={{ background: 'var(--status-verified-bg)', color: 'var(--status-verified-text)', border: '1px solid var(--status-verified-border)' }}>
                  <GitCommit size={15} />
                </div>
                <div>
                  <div className="flow-label">Audit</div>
                  <div className="flow-sub">100% logged</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Key Metrics: Inline compact chips */}
          <div className="metric-chips-row">
            <div className="metric-chip" style={{ cursor: 'pointer' }} onClick={() => navigate(`/tender/${tenderId}/bidders`)}>
              <Users size={14} color="var(--border-accent)" />
              <span className="metric-chip-num">7</span>
              <span className="metric-chip-label">Bidders</span>
            </div>
            <div className="metric-chip" style={{ cursor: 'pointer' }} onClick={() => navigate(`/tender/${tenderId}/requirements`)}>
              <CheckSquare size={14} color="var(--status-verified-dot)" />
              <span className="metric-chip-num">48</span>
              <span className="metric-chip-label">Requirements</span>
            </div>
            <div className="metric-chip" style={{ cursor: 'pointer' }} onClick={() => navigate(`/tender/${tenderId}/evidence`)}>
              <Database size={14} color="var(--text-secondary)" />
              <span className="metric-chip-num">196</span>
              <span className="metric-chip-label">Evidence Objects</span>
            </div>
            <div className="metric-chip" style={{ borderColor: 'var(--status-contradicted-border)', cursor: 'pointer' }} onClick={() => navigate(`/tender/${tenderId}/anomalies`)}>
              <AlertTriangle size={14} color="var(--status-contradicted-dot)" />
              <span className="metric-chip-num" style={{ color: 'var(--status-contradicted-text)' }}>11</span>
              <span className="metric-chip-label">Anomalies</span>
            </div>
            <div className="metric-chip" style={{ borderColor: 'var(--status-unverifiable-border)', cursor: 'pointer' }} onClick={() => navigate(`/tender/${tenderId}/review-queue`)}>
              <Clock size={14} color="var(--status-unverifiable-dot)" />
              <span className="metric-chip-num" style={{ color: 'var(--status-unverifiable-text)' }}>4</span>
              <span className="metric-chip-label">Pending Reviews</span>
            </div>
            <div className="metric-chip" style={{ cursor: 'pointer' }} onClick={() => navigate(`/tender/${tenderId}/source-health`)}>
              <Activity size={14} color="var(--text-muted)" />
              <span className="metric-chip-num">2</span>
              <span className="metric-chip-label">Sources Unavailable</span>
            </div>
          </div>

          {/* 4. Officer Attention Queue */}
          <div className="panel-card" style={{ marginBottom: 'var(--space-6)' }}>
            <div className="panel-card-header">
              <div>
                <h3 className="panel-title">Officer Attention Queue</h3>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  Priority-sorted forensic findings requiring statutory officer determination under GFR Rule 173(xiv).
                </p>
              </div>

              {/* Filter Chips */}
              <div className="filter-chips-row">
                {[
                  { key: 'ALL', label: 'All (11)' },
                  { key: 'CONTRADICTED', label: 'Contradicted (5)' },
                  { key: 'UNVERIFIABLE', label: 'Unverifiable (2)' },
                  { key: 'RELATIONSHIP', label: 'Relationship (3)' },
                  { key: 'OTHER', label: 'Other (1)' }
                ].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setAttentionFilter(f.key as any)}
                    className={`filter-chip ${attentionFilter === f.key ? 'active' : ''}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 80 }}>ID</th>
                  <th style={{ width: 220 }}>Issue</th>
                  <th style={{ width: 220 }}>Bidder</th>
                  <th>Details</th>
                  <th style={{ width: 140 }}>Status</th>
                  <th style={{ width: 70 }}>Priority</th>
                  <th style={{ width: 120 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttentionItems.map((item) => (
                  <tr key={item.id} style={{ cursor: 'pointer' }} onClick={() => navigate(item.targetPath)}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--border-accent)', fontSize: 12 }}>
                      {item.id}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.issue}
                    </td>
                    <td>
                      <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{item.bidder}</span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {item.details}
                    </td>
                    <td>
                      {item.status === 'CONTRADICTED' && (
                        <span className="status-pill status-pill-contradicted">CONTRADICTED</span>
                      )}
                      {item.status === 'UNVERIFIABLE' && (
                        <span className="status-pill status-pill-unverifiable">UNVERIFIABLE</span>
                      )}
                      {item.status === 'RELATIONSHIP' && (
                        <span className="status-pill status-pill-relationship">RELATIONSHIP</span>
                      )}
                    </td>
                    <td>
                      <span className={item.priority === 'P1' ? 'priority-tag-p1' : 'priority-tag-p2'}>
                        {item.priority}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--border-accent)' }}>
                        {item.actionLabel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Summary Navigation Banner to Bidders Queue */}
          <div
            className="panel-card"
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(90deg, var(--bg-surface) 0%, var(--bg-surface-elevated) 100%)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={16} color="var(--border-accent)" />
                <span>Bidders Evaluation Dossiers (7 Participating Firms)</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                1 Verified Clean · 3 Contradictions · 2 Cross-Bidder Collusion Signals · 1 Unverifiable Timeout
              </div>
            </div>
            <button
              onClick={() => navigate(`/tender/${tenderId}/bidders`)}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: 12 }}
            >
              <span>View Full Bidders Queue (7)</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </>
      )}

      {/* ===================== VIEW 2: BIDDERS EVALUATION QUEUE ===================== */}
      {isBiddersView && (
        <div className="panel-card">
          <div className="panel-card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 className="panel-title" style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={18} color="var(--border-accent)" />
                <span>Bidders Evaluation Queue (7 Bidders)</span>
              </h3>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                Multi-document evidence dossiers, turnover reconciliation, and statutory verification status.
              </p>
            </div>

            {/* Live Search and Verdict Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={13} style={{ position: 'absolute', left: 10, color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search bidder, PAN, GSTIN..."
                  value={bidderSearch}
                  onChange={(e) => setBidderSearch(e.target.value)}
                  style={{
                    padding: '5px 10px 5px 30px',
                    fontSize: 12,
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    width: 210
                  }}
                />
              </div>

              <div className="filter-chips-row">
                {[
                  { key: 'ALL', label: 'All (7)' },
                  { key: 'VERIFIED', label: 'Verified (1)' },
                  { key: 'CONTRADICTED', label: 'Contradicted (3)' },
                  { key: 'RELATIONSHIP', label: 'Cartel Signals (2)' },
                  { key: 'UNVERIFIABLE', label: 'Unverifiable (1)' }
                ].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setBidderVerdictFilter(f.key as any)}
                    className={`filter-chip ${bidderVerdictFilter === f.key ? 'active' : ''}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 80 }}>ID</th>
                <th style={{ width: 220 }}>Bidder Name</th>
                <th style={{ width: 180 }}>Statutory Identifiers</th>
                <th style={{ width: 140 }}>Declared Turnover</th>
                <th style={{ width: 130 }}>Verdict</th>
                <th>Forensic Findings</th>
                <th style={{ width: 100 }}>Inspect</th>
              </tr>
            </thead>
            <tbody>
              {filteredBidders.map(b => (
                <tr key={b.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--border-accent)', fontSize: 12 }}>
                    {b.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{b.legalName}</div>
                    {b.canonicalNameNote && (
                      <div style={{ fontSize: 11, color: 'var(--border-accent)', fontStyle: 'italic' }}>
                        ✓ {b.canonicalNameNote}
                      </div>
                    )}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                    <div>PAN: {b.pan}</div>
                    <div>GST: {b.gstin}</div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                    {b.id === 'BIDDER-002' ? (
                      <span style={{ color: 'var(--status-contradicted-text)', fontWeight: 700 }}>₹12 Cr (CA: ₹9 Cr)</span>
                    ) : (
                      <span>₹{(bids.find(x => x.bidderId === b.id)?.declaredTurnoverInr || 0) / 10000000} Cr</span>
                    )}
                  </td>
                  <td>
                    {bids.find(x => x.bidderId === b.id)?.overallVerdict === 'VERIFIED' && (
                      <span className="status-pill status-pill-verified">VERIFIED</span>
                    )}
                    {bids.find(x => x.bidderId === b.id)?.overallVerdict === 'CONTRADICTED' && (
                      <span className="status-pill status-pill-contradicted">CONTRADICTED</span>
                    )}
                    {bids.find(x => x.bidderId === b.id)?.overallVerdict === 'UNVERIFIABLE' && (
                      <span className="status-pill status-pill-unverifiable">UNVERIFIABLE</span>
                    )}
                    {bids.find(x => x.bidderId === b.id)?.overallVerdict === 'PENDING_REVIEW' && (
                      <span className="status-pill status-pill-pending">PENDING</span>
                    )}
                  </td>
                  <td style={{ fontSize: 12 }}>
                    {b.id === 'BIDDER-001' && <span style={{ color: 'var(--status-verified-text)' }}>Fully compliant clean baseline</span>}
                    {b.id === 'BIDDER-002' && <span style={{ color: 'var(--status-contradicted-text)' }}>Turnover discrepancy: Form ₹12 Cr vs CA Cert ₹9 Cr</span>}
                    {b.id === 'BIDDER-003' && <span style={{ color: 'var(--status-contradicted-text)' }}>Udyam Certificate cancelled on registry 2 weeks prior</span>}
                    {b.id === 'BIDDER-004' && <span style={{ color: 'var(--status-relationship-text)' }}>Shared bank account & 94% text overlap with Bidder 5</span>}
                    {b.id === 'BIDDER-005' && <span style={{ color: 'var(--status-relationship-text)' }}>Shared bank account & 94% text overlap with Bidder 4</span>}
                    {b.id === 'BIDDER-006' && <span style={{ color: 'var(--status-contradicted-text)' }}>OEM letter authorizes domestic plumbing valves, not API-6D</span>}
                    {b.id === 'BIDDER-007' && <span style={{ color: 'var(--status-unverifiable-text)' }}>GST Gateway timeout (Graceful degradation)</span>}
                  </td>
                  <td>
                    <button
                      onClick={() => navigate(`/tender/${tenderId}/bidder/${b.id}`)}
                      className="btn-primary"
                      style={{ padding: '3px 8px', fontSize: 11 }}
                    >
                      <span>Inspect</span>
                      <ArrowRight size={11} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TenderOverviewPage;
