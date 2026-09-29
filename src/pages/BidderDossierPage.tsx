import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  AlertCircle,
  FileText,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  Search,
  RotateCcw,
  Sparkles,
  Building,
  CreditCard,
  Users,
  Check
} from 'lucide-react';
import { Bidder, Bid, Verification, Evidence } from '../types';
import { getBidderById, getBidForBidder } from '../services/bidderService';
import { getVerificationsForBid } from '../services/verificationService';
import { EvidenceTraceModal } from '../components/investigation/EvidenceTraceModal';
import { EvidenceDrawer } from '../components/investigation/EvidenceDrawer';
import { DocumentViewerModal } from '../components/investigation/DocumentViewerModal';

export const BidderDossierPage: React.FC = () => {
  const { bidderId } = useParams<{ bidderId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [bidder, setBidder] = useState<Bidder | null>(null);
  const [bid, setBid] = useState<Bid | null>(null);
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);

  // Sub-tabs
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'IDENTITY' | 'REQUIREMENTS' | 'DOCUMENTS' | 'SOURCE' | 'NOTES'>('OVERVIEW');

  // Matrix Filter Pills & Search
  const [matrixFilter, setMatrixFilter] = useState<'ALL' | 'VERIFIED' | 'CONTRADICTED' | 'UNVERIFIABLE' | 'NOT_APPLICABLE'>('ALL');
  const [matrixSearch, setMatrixSearch] = useState('');

  // Modals state
  const [isTraceModalOpen, setIsTraceModalOpen] = useState(false);
  const [selectedReqData, setSelectedReqData] = useState<any>(null);

  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);
  const [selectedEvidenceForDrawer, setSelectedEvidenceForDrawer] = useState<Evidence | null>(null);

  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [selectedDocIdForViewer, setSelectedDocIdForViewer] = useState<string>('DOC-B2-CA-CERT');
  const [selectedDocPageForViewer, setSelectedDocPageForViewer] = useState<number>(2);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (!bidderId) return;
      const b = await getBidderById(bidderId);
      const bidData = await getBidForBidder('CPCL/2026/VALVES-7701', bidderId);
      if (bidData) {
        const vList = await getVerificationsForBid(bidData.id);
        setVerifications(vList);
      }
      setBidder(b);
      setBid(bidData);
      setLoading(false);
    }
    load();
  }, [bidderId]);

  // Handle trigger query params (Phase 5 Demo Scenarios)
  useEffect(() => {
    if (!loading && bidder) {
      const trigger = searchParams.get('trigger');
      const matrix = getMatrixDataForBidder();
      if (trigger === 'turnover') {
        const row = matrix.find(r => r.id === 'REQ-001') || matrix[0];
        setSelectedReqData(row);
        setIsTraceModalOpen(true);
      } else if (trigger === 'udyam') {
        const row = matrix.find(r => r.id === 'REQ-003') || matrix[1];
        setSelectedReqData(row);
        setIsTraceModalOpen(true);
      } else if (trigger === 'oem') {
        const row = matrix.find(r => r.id === 'REQ-005') || matrix[4];
        setSelectedReqData(row);
        setIsTraceModalOpen(true);
      }
    }
  }, [loading, bidderId, searchParams]);

  if (loading || !bidder) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
        <div style={{ display: 'inline-flex', padding: 12, background: 'rgba(49, 170, 169, 0.12)', borderRadius: '50%', color: 'var(--palette-teal)', marginBottom: 12 }}>
          <Sparkles size={24} />
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
          Resolving bidder statutory identity chain and cross-document evidence...
        </div>
        <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
          Validating PAN anchor against MCA21, GSTN, and Udyam registries.
        </div>
      </div>
    );
  }

  // Bidder-specific dynamic requirement compliance data
  const getMatrixDataForBidder = () => {
    const isB2 = bidder.id === 'BIDDER-002';
    const isB3 = bidder.id === 'BIDDER-003';
    const isB6 = bidder.id === 'BIDDER-006';
    const isB7 = bidder.id === 'BIDDER-007';

    return [
      {
        id: 'REQ-001',
        requirement: 'Minimum Average Annual Turnover ≥ INR 10.00 Cr',
        clause: 'Clause 4.2',
        clauseTitle: 'Financial Turnover Criteria',
        category: 'Financial Eligibility',
        sources: isB2 ? 'Bid Form, CA Cert' : 'CA Turnover Cert',
        evidence: isB2 ? '₹12 Cr vs ₹9 Cr' : '₹16.50 Cr Verified',
        verdict: isB2 ? 'CONTRADICTED' : 'VERIFIED',
        confidence: '98.2%',
        freshness: 'Current',
        actionLabel: isB2 ? 'Review →' : 'View →',
        isFlagged: isB2,
        claimASource: 'Bid Form.pdf (Cover Letter, Page 3)',
        claimAValue: isB2 ? 'INR 12,00,00,000 (₹12.00 Cr)' : 'INR 16,50,00,000',
        claimBSource: 'CA Certificate.pdf (UDIN: 24089123AAAAA, Page 2)',
        claimBValue: isB2 ? 'INR 9,00,00,000 (₹9.00 Cr)' : 'INR 16,50,00,000',
        thresholdValue: '≥ INR 10,00,00,000 (₹10.00 Cr)',
        verdictReason: isB2
          ? 'The same semantic field has conflicting values across submitted evidence. Certified turnover (₹9.00 Cr) refutes declared claim (₹12.00 Cr) and falls below mandatory threshold of ₹10.00 Cr.'
          : 'Certified turnover satisfies mandatory cutoff of ₹10.00 Cr without contradiction.'
      },
      {
        id: 'REQ-002',
        requirement: 'Active GSTIN with Zero Default (Last 6 Months)',
        clause: 'Clause 5.1',
        clauseTitle: 'Statutory GST Registration',
        category: 'Tax Statutory',
        sources: 'GSTN Gateway API',
        evidence: isB7 ? 'Gateway Timeout (504)' : 'Active (GSTR-3B Filed)',
        verdict: isB7 ? 'UNVERIFIABLE' : 'VERIFIED',
        confidence: isB7 ? '—' : '99.5%',
        freshness: isB7 ? 'Stale' : 'Current',
        actionLabel: isB7 ? 'Retry →' : 'View →',
        isFlagged: isB7,
        claimASource: 'Bid Submission Declaration',
        claimAValue: bidder.gstin,
        claimBSource: isB7 ? 'GSTN Circuit Breaker (Timeout)' : 'GSTN Live Gateway Response',
        claimBValue: isB7 ? '504 GATEWAY TIMEOUT' : 'ACTIVE / COMPLIANT',
        thresholdValue: 'STATUS == ACTIVE',
        verdictReason: isB7
          ? 'External GSTN registry gateway timed out after 3 exponential backoff attempts. Rule engine gracefully degraded into UNVERIFIABLE.'
          : 'GSTIN is active on national registry and all mandatory GSTR-3B filings are up to date.'
      },
      {
        id: 'REQ-003',
        requirement: 'Active Udyam Registration for EMD Exemption',
        clause: 'Clause 5.2',
        clauseTitle: 'MSME Statutory Exemption',
        category: 'Statutory Preference',
        sources: 'Udyam Registry API',
        evidence: isB3 ? 'Cancelled on Registry' : bidder.udyamNumber ? 'Active MSME' : 'Not Claimed',
        verdict: isB3 ? 'CONTRADICTED' : bidder.udyamNumber ? 'VERIFIED' : 'NOT_APPLICABLE',
        confidence: isB3 ? '100%' : '98.0%',
        freshness: isB3 ? 'Stale' : 'Current',
        actionLabel: isB3 ? 'Review →' : 'View →',
        isFlagged: isB3,
        claimASource: 'Udyam Certificate PDF',
        claimAValue: bidder.udyamNumber || 'N/A',
        claimBSource: 'Udyam Central Portal API',
        claimBValue: isB3 ? 'CANCELLED (Effective 31/08/2026)' : 'ACTIVE',
        thresholdValue: 'STATUS == ACTIVE on bid closing date',
        verdictReason: isB3
          ? 'Udyam Registration Certificate was revoked on the national portal prior to tender submission date. Self-submitted PDF is false on evaluation date.'
          : 'Udyam registration verified active on Ministry of MSME registry.'
      },
      {
        id: 'REQ-004',
        requirement: 'Debarment / Blacklisting Clearance on GeM & CPPP',
        clause: 'Clause 6.1',
        clauseTitle: 'Integrity & Clean Track Record',
        category: 'Integrity',
        sources: 'CPPP & GeM Debarment Watchlist',
        evidence: 'Clean (Zero Watchlist Hits)',
        verdict: 'VERIFIED',
        confidence: '99.9%',
        freshness: 'Current',
        actionLabel: 'View →',
        isFlagged: false,
        claimASource: 'Affidavit of Non-Blacklisting',
        claimAValue: 'Self-declaration clean',
        claimBSource: 'Central Vigilance / GeM API',
        claimBValue: 'CLEAN',
        thresholdValue: 'WATCHLIST_COUNT == 0',
        verdictReason: 'No adverse debarment records found on CPPP, GeM, or CPCL vendor blacklist.'
      },
      {
        id: 'REQ-005',
        requirement: 'OEM Authorization Covering API-6D Refinery Valves',
        clause: 'Clause 6.3',
        clauseTitle: 'OEM Equipment Scope Authorization',
        category: 'Technical Capability',
        sources: 'OEM Authorization Form',
        evidence: isB6 ? 'Residential Plumbing Valves' : 'API-6D High Pressure Valves',
        verdict: isB6 ? 'CONTRADICTED' : 'VERIFIED',
        confidence: isB6 ? '96.4%' : '97.5%',
        freshness: 'Current',
        actionLabel: isB6 ? 'Review →' : 'View →',
        isFlagged: isB6,
        claimASource: 'OEM Authorization Letter',
        claimAValue: isB6 ? 'Commercial Plumbing Butterfly & Gate Valves' : 'API-6D Trunnion Mounted Ball Valves',
        claimBSource: 'Tender Mandatory Technical Specification',
        claimBValue: 'API-6D Hydrocarbon Service Only',
        thresholdValue: 'EQUIPMENT_SCOPE == API_6D_REFINERY',
        verdictReason: isB6
          ? 'The OEM authorization letter authorizes low-pressure residential plumbing equipment, completely failing the refinery API-6D specification.'
          : 'OEM authorization explicitly validates API-6D pipeline valve manufacturing.'
      },
      {
        id: 'REQ-006',
        requirement: 'Make in India Local Content Percentage ≥ 50%',
        clause: 'Clause 7.1',
        clauseTitle: 'DPIIT Public Procurement Order',
        category: 'Preference',
        sources: 'Bill of Materials & CA Certificate',
        evidence: `${bid?.declaredMiiPercentage || 54.0}% Class-I Supplier`,
        verdict: 'VERIFIED',
        confidence: '96.0%',
        freshness: 'Current',
        actionLabel: 'View →',
        isFlagged: false,
        claimASource: 'MII Declaration Breakdown',
        claimAValue: `${bid?.declaredMiiPercentage || 54.0}% Local Content`,
        claimBSource: 'Recomputed BoM Table',
        claimBValue: `${bid?.declaredMiiPercentage || 54.0}% Domestic Origin`,
        thresholdValue: 'LOCAL_CONTENT >= 50.0%',
        verdictReason: 'Deterministic BoM arithmetic confirms domestic cost origin meets Class-I local supplier cutoff.'
      }
    ];
  };

  const matrixData = getMatrixDataForBidder();

  const filteredMatrix = matrixData.filter(item => {
    if (matrixFilter === 'VERIFIED' && item.verdict !== 'VERIFIED') return false;
    if (matrixFilter === 'CONTRADICTED' && item.verdict !== 'CONTRADICTED') return false;
    if (matrixFilter === 'UNVERIFIABLE' && item.verdict !== 'UNVERIFIABLE') return false;
    if (matrixFilter === 'NOT_APPLICABLE' && item.verdict !== 'NOT_APPLICABLE') return false;
    if (matrixSearch && !item.requirement.toLowerCase().includes(matrixSearch.toLowerCase()) && !item.id.toLowerCase().includes(matrixSearch.toLowerCase())) return false;
    return true;
  });

  const handleRowClick = (row: any) => {
    setSelectedReqData(row);
    setIsTraceModalOpen(true);
  };

  // Freshness counts
  const freshnessCounts = {
    current: matrixData.filter(m => m.freshness === 'Current' && m.verdict === 'VERIFIED').length,
    stale: matrixData.filter(m => m.freshness === 'Stale').length,
    requiringReview: matrixData.filter(m => m.verdict === 'CONTRADICTED').length,
    unverifiable: matrixData.filter(m => m.verdict === 'UNVERIFIABLE').length
  };

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto' }}>
      {/* 1. Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748B' }}>
          <button
            onClick={() => navigate('/tender')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--palette-teal)', fontWeight: 600, padding: 0 }}
          >
            <ArrowLeft size={14} />
            <span>Tender Queue</span>
          </button>
          <span>/</span>
          <button
            onClick={() => navigate('/tender/CPCL-2026-VALVES-7701/bidders')}
            style={{ color: '#64748B', fontWeight: 500, padding: 0 }}
          >
            Bidders
          </button>
          <span>/</span>
          <span style={{ color: '#0F172A', fontWeight: 600 }}>{bidder.legalName}</span>
        </div>

        <button
          onClick={() => alert(`[OFFICER DOSSIER EXPORT]\nGenerating Statutory Defensibility Package for ${bidder.legalName} (${bidder.id})\nIncludes: Extracted claims, CA certificates, OCR coordinates, and deterministic audit chain.`)}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Download size={14} />
          <span>Download Dossier</span>
        </button>
      </div>

      {/* 2. Bidder Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>
              {bidder.legalName}
            </h1>
            {bid?.overallVerdict === 'CONTRADICTED' && (
              <span className="verdict-badge verdict-contradicted">Requires Review</span>
            )}
            {bid?.overallVerdict === 'VERIFIED' && (
              <span className="verdict-badge verdict-verified">Compliant</span>
            )}
            {bid?.overallVerdict === 'UNVERIFIABLE' && (
              <span className="verdict-badge verdict-unverifiable">Unverifiable</span>
            )}
            {bid?.overallVerdict === 'PENDING_REVIEW' && (
              <span className="verdict-badge verdict-relationship">Flagged for Review</span>
            )}
          </div>
          <div style={{ fontSize: 12, color: '#64748B', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
            Bidder ID: <strong style={{ color: '#0F172A' }}>{bidder.id}</strong> · Submitted: 18 Aug 2026, 14:32 IST · Tender: CPCL/PROC/2026/047
          </div>
        </div>

        <div className="provenance-tag">
          SYNTHETIC DOSSIER · GROUND TRUTH
        </div>
      </div>

      {/* 3. Horizontal Sub-Tabs Row */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', marginBottom: 20 }}>
        {[
          { key: 'OVERVIEW', label: 'Overview' },
          { key: 'IDENTITY', label: 'Identity & Entities' },
          { key: 'REQUIREMENTS', label: `Requirements (${matrixData.length})` },
          { key: 'DOCUMENTS', label: `Documents (${bidder.documentsCount})` },
          { key: 'SOURCE', label: 'Source Verification' },
          { key: 'NOTES', label: 'Officer Notes' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              padding: '10px 18px',
              fontSize: 13,
              fontWeight: activeTab === tab.key ? 700 : 500,
              color: activeTab === tab.key ? 'var(--palette-teal)' : '#64748B',
              borderBottom: activeTab === tab.key ? '2px solid var(--palette-teal)' : '2px solid transparent',
              transition: 'all 150ms ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Top Grid: Identity Coordinates & 3-Node Identity Chain + Compact Evidence Health Donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
        {/* Left Column: Identity Coordinates & Identity Chain */}
        <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px 18px' }}>
          <div>
            <div className="panel-card-header" style={{ marginBottom: 12, paddingBottom: 10 }}>
              <span className="panel-title">Identity</span>
              <span style={{ fontSize: 11, color: 'var(--status-verified-text)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={13} color="var(--status-verified-dot)" />
                <span>Verified Entity</span>
              </span>
            </div>

            {/* Quick 4-Field Identity Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', fontSize: 12 }}>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>GSTIN</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2, fontSize: 11 }}>
                  {bidder.gstin}
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>PAN</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2, fontSize: 11 }}>
                  {bidder.pan}
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>CIN</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2, fontSize: 11 }}>
                  U29120MH2018PTC123456
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Bid Submission</div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: 2, fontSize: 11 }}>
                  18 Aug 2026
                </div>
              </div>
            </div>

            {/* Identity Chain & Entity Resolution (Reference UI Screen 2) */}
            <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                IDENTITY CHAIN & ENTITY RESOLUTION
              </div>

              {/* Connected small icon nodes: Bidder name → MCA record → GST record */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', padding: '5px 10px', fontSize: 11 }}>
                  <Building size={12} color="var(--border-accent)" />
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{bidder.legalName.substring(0, 18)}...</span>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Bid Form</span>
                </div>
                <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>→</span>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', padding: '5px 10px', fontSize: 11 }}>
                  <Users size={12} color="var(--status-verified-dot)" />
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>MCA Record</span>
                  <span style={{ fontSize: 9, color: 'var(--status-verified-text)' }}>Active</span>
                </div>
                <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>→</span>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', padding: '5px 10px', fontSize: 11 }}>
                  <Shield size={12} color="var(--status-verified-dot)" />
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>GST Record</span>
                  <span style={{ fontSize: 9, color: 'var(--status-verified-text)' }}>Active</span>
                </div>
              </div>

              {/* Resolution Note Underneath */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--status-verified-text)', fontWeight: 600, marginTop: 4 }}>
                <CheckCircle2 size={13} color="var(--status-verified-dot)" />
                <span>3 names resolved to the same canonical entity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Compact Evidence Health Donut Chart */}
        <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px 18px' }}>
          <div>
            <div className="panel-card-header" style={{ marginBottom: 12, paddingBottom: 10 }}>
              <span className="panel-title">Evidence Health</span>
              <button
                onClick={() => setActiveTab('REQUIREMENTS')}
                style={{ fontSize: 11, color: 'var(--border-accent)', fontWeight: 600, cursor: 'pointer' }}
              >
                View Details
              </button>
            </div>

            {/* Donut Chart Visual + Compact Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 6, marginBottom: 8 }}>
              {/* SVG Donut Chart */}
              <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
                <svg width="90" height="90" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                  {/* Background Circle */}
                  <circle cx="18" cy="18" r="14" fill="transparent" stroke="var(--border-subtle)" strokeWidth="4.5" />
                  {/* Current (Green) 65% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="transparent"
                    stroke="var(--status-verified-dot)"
                    strokeWidth="4.5"
                    strokeDasharray="57 31"
                    strokeDashoffset="0"
                  />
                  {/* Stale (Amber) 15% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="transparent"
                    stroke="var(--status-unverifiable-dot)"
                    strokeWidth="4.5"
                    strokeDasharray="13 75"
                    strokeDashoffset="-57"
                  />
                  {/* Require Review (Red) 12% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="transparent"
                    stroke="var(--status-contradicted-dot)"
                    strokeWidth="4.5"
                    strokeDasharray="10 78"
                    strokeDashoffset="-70"
                  />
                  {/* Unverifiable (Blue/Slate) 8% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="transparent"
                    stroke="var(--status-pending-dot)"
                    strokeWidth="4.5"
                    strokeDasharray="8 80"
                    strokeDashoffset="-80"
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', lineHeight: 1 }}>48</span>
                  <span style={{ fontSize: 8, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Items</span>
                </div>
              </div>

              {/* Donut Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--status-verified-dot)', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-secondary)' }}><strong>32</strong> Current</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--status-unverifiable-dot)', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-secondary)' }}><strong>5</strong> Stale</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--status-contradicted-dot)', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-secondary)' }}><strong>5</strong> Require Review</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--status-pending-dot)', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-secondary)' }}><strong>4</strong> Unverifiable</span>
                </div>
              </div>
            </div>

            {/* Entity Summary Badge */}
            <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
              <span style={{ color: 'var(--text-muted)' }}>Entity Clearance:</span>
              <span style={{ fontWeight: 700, color: bidder.id === 'BIDDER-002' ? 'var(--status-contradicted-text)' : 'var(--status-verified-text)' }}>
                {bidder.id === 'BIDDER-002' ? 'Flagged for Disqualification' : 'Eligible for Financial Bid'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. REQUIREMENT & EVIDENCE MATRIX (Reference UI Screen 2) */}
      <div className="panel-card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="panel-card-header">
          <div>
            <h3 className="panel-title">Requirement Compliance Matrix</h3>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              Interactive clause-by-clause compliance table. Clicking any row opens the Evidence Trace investigation view.
            </p>
          </div>

          {/* Filter Chips matching Reference Screenshot */}
          <div className="filter-chips-row">
            {[
              { key: 'ALL', label: `All (48)` },
              { key: 'VERIFIED', label: `Verified (32)` },
              { key: 'CONTRADICTED', label: `Contradicted (5)` },
              { key: 'UNVERIFIABLE', label: `Unverifiable (4)` },
              { key: 'NOT_APPLICABLE', label: `Not Applicable (7)` }
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setMatrixFilter(f.key as any)}
                className={`filter-chip ${matrixFilter === f.key ? 'active' : ''}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ position: 'relative', width: 300 }}>
            <Search size={13} style={{ position: 'absolute', left: 9, top: 8, color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Search clause, requirement, or document..."
              value={matrixSearch}
              onChange={(e) => setMatrixSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '5px 10px 5px 28px',
                fontSize: 11,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-default)',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
                color: 'var(--text-primary)',
                background: 'var(--bg-surface)'
              }}
            />
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Showing {filteredMatrix.length} requirement(s)
          </span>
        </div>

        {/* Table matching Requirement 3 specification */}
        {filteredMatrix.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            No evidence linked to this filter criteria.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 80 }}>#</th>
                <th>Requirement</th>
                <th style={{ width: 85 }}>Clause</th>
                <th>Source(s)</th>
                <th>Extracted Value</th>
                <th style={{ width: 130 }}>Verdict</th>
                <th style={{ width: 80 }}>Confidence</th>
                <th style={{ width: 80 }}>Freshness</th>
                <th style={{ width: 90, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatrix.map(row => (
                <tr
                  key={row.id}
                  onClick={() => handleRowClick(row)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: row.isFlagged ? 'rgba(254, 242, 242, 0.4)' : 'transparent'
                  }}
                >
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--border-accent)', fontSize: 12 }}>
                    {row.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row.requirement}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{row.category}</div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>
                    {row.clause}
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                    {row.sources}
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        fontWeight: 600,
                        color: row.verdict === 'CONTRADICTED' ? 'var(--status-contradicted-text)' : 'var(--text-primary)'
                      }}
                    >
                      {row.evidence}
                    </span>
                  </td>
                  <td>
                    {row.verdict === 'VERIFIED' && <span className="status-pill status-pill-verified">VERIFIED</span>}
                    {row.verdict === 'CONTRADICTED' && <span className="status-pill status-pill-contradicted">CONTRADICTED</span>}
                    {row.verdict === 'UNVERIFIABLE' && <span className="status-pill status-pill-unverifiable">UNVERIFIABLE</span>}
                    {row.verdict === 'NOT_APPLICABLE' && <span className="status-pill" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>N/A</span>}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>
                    {row.confidence}
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        fontFamily: 'var(--font-mono)',
                        color: row.freshness === 'Current' ? 'var(--status-verified-text)' : 'var(--status-unverifiable-text)'
                      }}
                    >
                      {row.freshness}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: row.verdict === 'CONTRADICTED' ? 'var(--status-contradicted-text)' : 'var(--border-accent)'
                      }}
                    >
                      {row.actionLabel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>


      {/* 6. Signature Split-Screen Evidence Trace Modal (Requirement 4) */}
      <EvidenceTraceModal
        isOpen={isTraceModalOpen}
        onClose={() => setIsTraceModalOpen(false)}
        bidderName={bidder.legalName}
        bidderId={bidder.id}
        requirementId={selectedReqData?.id}
        requirementTitle={selectedReqData?.requirement}
        clauseId={selectedReqData?.clause}
        clauseTitle={selectedReqData?.clauseTitle}
        claimASource={selectedReqData?.claimASource}
        claimAValue={selectedReqData?.claimAValue}
        claimBSource={selectedReqData?.claimBSource}
        claimBValue={selectedReqData?.claimBValue}
        thresholdValue={selectedReqData?.thresholdValue}
        verdict={selectedReqData?.verdict}
        verdictReason={selectedReqData?.verdictReason}
      />

      {/* 7. Reusable Global Evidence Drawer (Requirement 6) */}
      <EvidenceDrawer
        isOpen={isEvidenceDrawerOpen}
        onClose={() => setIsEvidenceDrawerOpen(false)}
        evidence={selectedEvidenceForDrawer}
        onOpenDocument={(docId, page) => {
          setIsEvidenceDrawerOpen(false);
          setSelectedDocIdForViewer(docId);
          setSelectedDocPageForViewer(page);
          setIsDocViewerOpen(true);
        }}
        onTraceRequirement={() => {
          setIsEvidenceDrawerOpen(false);
          setIsTraceModalOpen(true);
        }}
      />

      {/* 8. Reusable Document Viewer (Requirement 5) */}
      <DocumentViewerModal
        isOpen={isDocViewerOpen}
        onClose={() => setIsDocViewerOpen(false)}
        documentId={selectedDocIdForViewer}
        initialPage={selectedDocPageForViewer}
        onOpenEvidenceDrawer={() => {
          setIsDocViewerOpen(false);
          setSelectedEvidenceForDrawer({
            id: 'EVD-B2-CACERT-TURNOVER',
            documentId: 'DOC-B2-CA-CERT',
            bidderId: bidder.id,
            pageNumber: 2,
            boundingBox: [0.55, 0.15, 0.62, 0.85],
            claimField: 'certified_average_turnover',
            extractedValue: 90000000.00,
            rawTextSnippet: 'Average annual financial turnover of M/s Bharat Fluid Systems Pvt Ltd across FY 2021-22, 22-23, and 23-24 is INR 9.00 Crores. UDIN: 24089123AAAAA.',
            extractionConfidence: 0.982,
            provenanceType: 'OCR_EXTRACTION',
            provenanceBadge: 'SYNTHETIC',
            extractedAt: '2026-09-29T10:14:23Z'
          });
          setIsEvidenceDrawerOpen(true);
        }}
      />
    </div>
  );
};
