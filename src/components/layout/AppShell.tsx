import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FileText,
  Users,
  CheckSquare,
  Shield,
  Network,
  AlertTriangle,
  Clock,
  GitCommit,
  RotateCcw,
  Activity,
  Lock,
  Search,
  X,
  ExternalLink,
  ChevronRight,
  Database,
  Sliders,
  TrendingUp,
  Layers,
  Info,
  CheckCircle2,
  Building,
  CreditCard,
  UserCheck,
  Cpu
} from 'lucide-react';
import { ADAPTER_FAULT_STATE } from '../../adapters/governmentAdapters';
import { DemoControlPanel } from '../demo/DemoControlPanel';
import { GuidedDemoBar } from '../demo/GuidedDemoBar';
import { WhyThisMattersDrawer } from '../demo/WhyThisMattersDrawer';
import { ImpactModal } from '../demo/ImpactModal';
import { PsCoveragePanel } from '../demo/PsCoveragePanel';

interface GlobalSearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'BIDDER' | 'CLAUSE' | 'BANK / CARTEL' | 'EVIDENCE' | 'ANOMALY' | 'SECURITY' | 'AUDIT' | 'NAVIGATION';
  path: string;
  keywords: string[];
  badge?: string;
  badgeColor?: string;
}

export const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const tenderId = 'CPCL-2026-VALVES-7701';

  // Demo & Presenter State
  const [isPresenterModeActive, setIsPresenterModeActive] = useState(false);
  const [isGuidedDemoActive, setIsGuidedDemoActive] = useState(false);
  const [guidedStepIndex, setGuidedStepIndex] = useState(0);

  // Modals & Drawers State
  const [isWhyThisMattersOpen, setIsWhyThisMattersOpen] = useState(false);
  const [isImpactModalOpen, setIsImpactModalOpen] = useState(false);
  const [isPsCoverageOpen, setIsPsCoverageOpen] = useState(false);

  // Global Omnibar Search
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');

  // Toast notifications for presenter hotkeys
  const [activeToast, setActiveToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setActiveToast(message);
    setTimeout(() => {
      setActiveToast((current) => (current === message ? null : current));
    }, 2800);
  };

  // Keyboard listeners: Ctrl+K, Escape, and Presenter Hotkeys (1-6, P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Omnibar Ctrl+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        return;
      }

      // 2. Ignore single-key shortcuts if typing in form inputs
      const target = e.target as HTMLElement;
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName) || target?.isContentEditable;
      if (isInput) return;

      // 3. Presenter Mode Hotkeys
      if (e.key === '1') {
        navigate('/tender');
        showToast('Presenter Hotkey [1]: Tender Command Centre');
      } else if (e.key === '2') {
        navigate(`/tender/${tenderId}/bidder/BIDDER-002?trigger=turnover`);
        showToast('Presenter Hotkey [2]: Turnover Contradiction (Bidder 2)');
      } else if (e.key === '3') {
        navigate(`/tender/${tenderId}/network?trigger=shared_bank`);
        showToast('Presenter Hotkey [3]: Cross-Bidder Relationship Graph');
      } else if (e.key === '4') {
        navigate(`/tender/${tenderId}/bidder/BIDDER-003?trigger=udyam`);
        showToast('Presenter Hotkey [4]: Udyam Temporal Staleness');
      } else if (e.key === '5') {
        navigate(`/tender/${tenderId}/source-health?trigger=gst_outage`);
        showToast('Presenter Hotkey [5]: GST Outage & Unverifiable Cascade');
      } else if (e.key === '6') {
        navigate(`/tender/${tenderId}/audit/reconstruction`);
        showToast('Presenter Hotkey [6]: Decision Reconstruction & SHA-256 Ledger');
      } else if (e.key.toLowerCase() === 'p') {
        setIsPresenterModeActive((prev) => {
          const next = !prev;
          showToast(next ? 'Presenter Mode Activated (Hotkeys 1–6 Ready)' : 'Presenter Mode Deactivated');
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, tenderId]);

  // Master Comprehensive Search Index (Indexing all Phase 1-4 data)
  const masterSearchIndex: GlobalSearchItem[] = useMemo(
    () => [
      // 1. All 7 Bidders & Directors
      {
        id: 'B1',
        title: 'Hindustan Valves Corp Limited (Bidder 1)',
        subtitle: 'PAN: AAACH1234F · GSTIN: 33AAACH1234F1Z4 · Director: R.K. Ramanathan',
        category: 'BIDDER',
        path: `/tender/${tenderId}/bidder/BIDDER-001`,
        keywords: ['hindustan', 'valves', 'b1', 'aaach1234f', '33aaach1234f1z4', 'ramanathan', '00192834', 'chennai', 'clean'],
        badge: 'VERIFIED',
        badgeColor: '#31AAA9'
      },
      {
        id: 'B2',
        title: 'Bharat Fluid Systems Private Limited (Bidder 2)',
        subtitle: 'PAN: AABCB5678G · GSTIN: 27AABCB5678G1Z2 · Turnover Contradiction (₹12 Cr vs ₹9 Cr)',
        category: 'BIDDER',
        path: `/tender/${tenderId}/bidder/BIDDER-002?trigger=turnover`,
        keywords: ['bharat', 'fluid', 'b2', 'aabcb5678g', '27aabcb5678g1z2', 'vikram', 'shah', '01928374', 'turnover', 'contradiction', 'mumbai'],
        badge: 'CONTRADICTED',
        badgeColor: '#A82020'
      },
      {
        id: 'B3',
        title: 'Chennai Petro Controls Private Limited (Bidder 3)',
        subtitle: 'PAN: AACCC9012K · Udyam: UDYAM-TN-02-0055443 (Cancelled on 31/08/2026)',
        category: 'BIDDER',
        path: `/tender/${tenderId}/bidder/BIDDER-003?trigger=udyam`,
        keywords: ['chennai', 'petro', 'controls', 'b3', 'aaccc9012k', 'udyam-tn-02-0055443', 'balasubramanian', '03847561', 'stale', 'cancelled'],
        badge: 'CONTRADICTED',
        badgeColor: '#A82020'
      },
      {
        id: 'B4',
        title: 'Apex Industrial Tech Private Limited (Bidder 4)',
        subtitle: 'PAN: AADCA3344P · Shared Bank: 50200088991122 · Director: Sanjay Deshmukh',
        category: 'BIDDER',
        path: `/tender/${tenderId}/bidder/BIDDER-004`,
        keywords: ['apex', 'industrial', 'b4', 'aadca3344p', '50200088991122', 'hdfc0001234', 'sanjay', 'deshmukh', '05847362', 'bangalore'],
        badge: 'RELATIONSHIP',
        badgeColor: '#6C1A1A'
      },
      {
        id: 'B5',
        title: 'Zenith Flow Equipments LLP (Bidder 5)',
        subtitle: 'PAN: AAEFZ8899L · Shared Bank: 50200088991122 · Partner: Naveen Kumar Shetty',
        category: 'BIDDER',
        path: `/tender/${tenderId}/bidder/BIDDER-005`,
        keywords: ['zenith', 'flow', 'b5', 'aaefz8899l', '50200088991122', 'hdfc0001234', 'naveen', 'shetty', '07483920', 'bangalore', 'cartel'],
        badge: 'RELATIONSHIP',
        badgeColor: '#6C1A1A'
      },
      {
        id: 'B6',
        title: 'Precision Piping Solutions Private Limited (Bidder 6)',
        subtitle: 'PAN: AABCP7788M · OEM Scope Mismatch (Commercial Water Valves vs API-6D)',
        category: 'BIDDER',
        path: `/tender/${tenderId}/bidder/BIDDER-006?trigger=oem`,
        keywords: ['precision', 'piping', 'b6', 'aabcp7788m', 'harpreet', 'sethi', '04938271', 'oem', 'l&t', 'scope', 'mismatch', 'delhi'],
        badge: 'CONTRADICTED',
        badgeColor: '#A82020'
      },
      {
        id: 'B7',
        title: 'Deccan Heavy Engineering Corporation Limited (Bidder 7)',
        subtitle: 'PAN: AAACD9900N · GSTIN: 36AAACD9900N1Z1 · GST Gateway 504 Timeout',
        category: 'BIDDER',
        path: `/tender/${tenderId}/bidder/BIDDER-007`,
        keywords: ['deccan', 'heavy', 'b7', 'aaacd9900n', '36aaacd9900n1z1', 'venkat', 'rao', '02938475', 'hyderabad', 'unverifiable', 'timeout'],
        badge: 'UNVERIFIABLE',
        badgeColor: '#966010'
      },

      // 2. Shared Banking Coordinates & Cartel Clues
      {
        id: 'BANK-50200088991122',
        title: 'Shared HDFC Corporate Account: 50200088991122',
        subtitle: 'IFSC: HDFC0001234 (Richmond Road) · Linked to Bidder 4 (Apex) & Bidder 5 (Zenith)',
        category: 'BANK / CARTEL',
        path: `/tender/${tenderId}/network?trigger=shared_bank`,
        keywords: ['50200088991122', 'hdfc0001234', 'hdfc', 'bank', 'shared', 'cartel', 'apex', 'zenith', 'rtgs', 'account'],
        badge: 'RELATIONSHIP SIGNAL',
        badgeColor: '#6C1A1A'
      },
      {
        id: 'BANK-ICIC0000029',
        title: 'Hindustan Valves ICICI Bank Account: 002905001234',
        subtitle: 'IFSC: ICIC0000029 · Ambattur Industrial Estate Branch · Bidder 1',
        category: 'BANK / CARTEL',
        path: `/tender/${tenderId}/bidder/BIDDER-001`,
        keywords: ['002905001234', 'icic0000029', 'icici', 'hindustan'],
        badge: 'VERIFIED',
        badgeColor: '#31AAA9'
      },

      // 3. Clauses & Mandatory Requirements
      {
        id: 'CLS-4.2',
        title: 'Clause 4.2: Financial Turnover Criteria (≥ INR 10.00 Cr)',
        subtitle: 'REQ-001 · 3-year CA audited average annual turnover with valid UDIN',
        category: 'CLAUSE',
        path: `/tender/${tenderId}/requirements`,
        keywords: ['clause 4.2', 'req-001', 'turnover', '10.00', '10 cr', 'crores', 'ca', 'udin', 'financial', 'eligibility'],
        badge: 'MANDATORY',
        badgeColor: '#0F172A'
      },
      {
        id: 'CLS-5.1',
        title: 'Clause 5.1: Statutory GST Registration & Active Filing',
        subtitle: 'REQ-002 · GSTIN must be active on evaluation date with current GSTR-3B filings',
        category: 'CLAUSE',
        path: `/tender/${tenderId}/source-health`,
        keywords: ['clause 5.1', 'req-002', 'gst', 'gstin', 'gstr-3b', 'registration', 'active'],
        badge: 'MANDATORY',
        badgeColor: '#0F172A'
      },
      {
        id: 'CLS-5.2',
        title: 'Clause 5.2: Udyam Registration for EMD Exemption',
        subtitle: 'REQ-003 · Valid MSME certificate on date of tender closing for statutory exemption',
        category: 'CLAUSE',
        path: `/tender/${tenderId}/requirements`,
        keywords: ['clause 5.2', 'req-003', 'udyam', 'msme', 'emd', 'exemption'],
        badge: 'PREFERENCE',
        badgeColor: '#2563EB'
      },
      {
        id: 'CLS-6.1',
        title: 'Clause 6.1: Non-Debarred & Clean Registry Status',
        subtitle: 'REQ-004 · Cross-check against CPPP debarred list and GeM incident watchlist',
        category: 'CLAUSE',
        path: `/tender/${tenderId}/requirements`,
        keywords: ['clause 6.1', 'req-004', 'debarment', 'blacklist', 'cppp', 'gem'],
        badge: 'MANDATORY',
        badgeColor: '#0F172A'
      },
      {
        id: 'CLS-6.3',
        title: 'Clause 6.3: OEM Authorization for API-6D Refinery Valves',
        subtitle: 'REQ-005 · OEM authorization explicitly covering API-6D high-pressure pipeline valves',
        category: 'CLAUSE',
        path: `/tender/${tenderId}/requirements`,
        keywords: ['clause 6.3', 'req-005', 'oem', 'api-6d', 'valves', 'authorization', 'l&t'],
        badge: 'MANDATORY',
        badgeColor: '#0F172A'
      },
      {
        id: 'CLS-7.1',
        title: 'Clause 7.1: Make in India (MII) BoM Re-derivation (≥ 50%)',
        subtitle: 'REQ-006 · Deterministic recalculation confirming ≥ 50% domestic cost origin',
        category: 'CLAUSE',
        path: `/tender/${tenderId}/requirements`,
        keywords: ['clause 7.1', 'req-006', 'mii', 'make in india', 'bom', 'local content', '50%'],
        badge: 'MANDATORY',
        badgeColor: '#0F172A'
      },

      // 4. Evidence IDs
      {
        id: 'EVD-001',
        title: 'EVD-B2-CACERT-TURNOVER: CA Certificate (UDIN 24089123AAAAA)',
        subtitle: 'Page 2 · Bounding Box [0.42, 0.58, 0.46, 0.88] · Confirms ₹9.00 Cr',
        category: 'EVIDENCE',
        path: `/tender/${tenderId}/evidence`,
        keywords: ['evd-b2-cacert-turnover', 'udin', '24089123aaaaa', 'ca certificate', 'page 2', '9.00 cr'],
        badge: 'CONTRADICTED',
        badgeColor: '#A82020'
      },
      {
        id: 'EVD-002',
        title: 'EVD-B3-UDYAM-DOC: Revoked Udyam Certificate',
        subtitle: 'Page 1 · Bounding Box [0.18, 0.35, 0.22, 0.75] · Revoked 31/08/2026',
        category: 'EVIDENCE',
        path: `/tender/${tenderId}/evidence`,
        keywords: ['evd-b3-udyam-doc', 'udyam-tn-02-0055443', 'cancelled', 'page 1'],
        badge: 'CONTRADICTED',
        badgeColor: '#A82020'
      },
      {
        id: 'EVD-003',
        title: 'EVD-B6-OEM-LETTER: L&T Authorization Letter',
        subtitle: 'Page 1 · Authorizes Commercial Water Valves (Mismatch)',
        category: 'EVIDENCE',
        path: `/tender/${tenderId}/evidence`,
        keywords: ['evd-b6-oem-letter', 'oem', 'l&t', 'commercial', 'page 1'],
        badge: 'CONTRADICTED',
        badgeColor: '#A82020'
      },

      // 5. Anomalies & Collusion Signals
      {
        id: 'CTR-001',
        title: 'CTR-001: Financial Turnover Contradiction',
        subtitle: 'Bidder 2: Bid Form claimed ₹12 Cr vs CA Certificate verified ₹9 Cr',
        category: 'ANOMALY',
        path: `/tender/${tenderId}/anomalies`,
        keywords: ['ctr-001', 'turnover', 'contradiction', 'bidder 2', '₹12 cr', '₹9 cr'],
        badge: 'CRITICAL',
        badgeColor: '#A82020'
      },
      {
        id: 'CTR-002',
        title: 'CTR-002: Temporal Staleness: Revoked Udyam',
        subtitle: 'Bidder 3: Udyam certificate cancelled 2 weeks prior to bid submission',
        category: 'ANOMALY',
        path: `/tender/${tenderId}/anomalies`,
        keywords: ['ctr-002', 'udyam', 'staleness', 'bidder 3', 'revocation'],
        badge: 'CRITICAL',
        badgeColor: '#A82020'
      },
      {
        id: 'REL-001',
        title: 'REL-001: Shared Bank Account & RTGS Mandate',
        subtitle: 'Bidder 4 & 5: Identical HDFC Account 50200088991122',
        category: 'ANOMALY',
        path: `/tender/${tenderId}/network?trigger=shared_bank`,
        keywords: ['rel-001', 'shared bank', 'cartel', '50200088991122', 'apex', 'zenith'],
        badge: 'RELATIONSHIP',
        badgeColor: '#6C1A1A'
      },
      {
        id: 'ANOM-001',
        title: 'ANOM-001: Adversarial Prompt-Injection Quarantined',
        subtitle: 'Bidder 2 PDF metadata instruction quarantined in isolated sandbox',
        category: 'SECURITY',
        path: `/tender/${tenderId}/security`,
        keywords: ['anom-001', 'prompt injection', 'security', 'system instruction', 'ignore constraints', 'quarantined'],
        badge: 'SECURITY',
        badgeColor: '#475569'
      },

      // 6. Audit & Defensibility
      {
        id: 'AUD-001',
        title: 'Cryptographic Decision Reconstruction Ledger',
        subtitle: 'Tamper-evident SHA-256 Merkle chain timeline with officer replay',
        category: 'AUDIT',
        path: `/tender/${tenderId}/audit/reconstruction`,
        keywords: ['audit', 'reconstruction', 'merkle', 'sha-256', 'hash', 'genesis', 'timeline'],
        badge: 'TAMPER-EVIDENT',
        badgeColor: '#0F172A'
      },

      // 7. Navigation Hubs
      {
        id: 'NAV-001',
        title: 'Tender Investigation Command Centre',
        subtitle: 'Executive Cockpit · 7 Bidders · 48 Requirements · Attention Queue',
        category: 'NAVIGATION',
        path: '/tender',
        keywords: ['command centre', 'tender', 'overview', 'dashboard', 'home', 'queue'],
        badge: 'HUB',
        badgeColor: '#31AAA9'
      },
      {
        id: 'NAV-002',
        title: 'Source Health & Connectivity Monitor',
        subtitle: 'Circuit breakers for GSTN, Udyam, MCA21, CPPP, GeM registries',
        category: 'NAVIGATION',
        path: `/tender/${tenderId}/source-health`,
        keywords: ['source health', 'adapters', 'gateways', 'circuit breaker', 'gst 504'],
        badge: 'SYSTEM',
        badgeColor: '#31AAA9'
      },
      {
        id: 'NAV-003',
        title: 'Officer Priority Review Queue',
        subtitle: 'Statutory decision triage ranked by Uncertainty × Materiality',
        category: 'NAVIGATION',
        path: `/tender/${tenderId}/review-queue`,
        keywords: ['review queue', 'officer', 'override', 'triage', 'pending'],
        badge: 'GOVERNANCE',
        badgeColor: '#966010'
      },
      {
        id: 'NAV-004',
        title: 'Production Readiness & 11-Portal Integration Map',
        subtitle: 'Data provenance, synthetic disclosure, and enterprise pipeline scaling',
        category: 'NAVIGATION',
        path: `/tender/${tenderId}/production`,
        keywords: ['production', 'readiness', 'provenance', 'scaling', 'pipeline', 'architecture', 'integration', 'udyam', 'gstn', 'mca21'],
        badge: 'PROD',
        badgeColor: '#31AAA9'
      },
      {
        id: 'NAV-005',
        title: 'Tamper-Evident Hash Chain Audit Ledger',
        subtitle: 'Cryptographic SHA-256 Merkle chain for statutory CVC / CAG audit defense',
        category: 'AUDIT',
        path: `/tender/${tenderId}/audit`,
        keywords: ['audit', 'ledger', 'hash chain', 'sha256', 'cvc', 'cag', 'tamper evident', 'blockchain'],
        badge: 'DEFENSIBILITY',
        badgeColor: '#31AAA9'
      },
      {
        id: 'NAV-006',
        title: 'Security Events & Adversarial Prompt Injection Defense',
        subtitle: 'Quarantining instruction-like text embedded in uploaded tender documents',
        category: 'SECURITY',
        path: `/tender/${tenderId}/security`,
        keywords: ['security', 'prompt injection', 'jailbreak', 'ignore instructions', 'adversarial', 'sandbox'],
        badge: 'ISOLATION',
        badgeColor: '#A82020'
      }
    ],
    [tenderId]
  );

  const filteredCommands = useMemo(() => {
    if (!commandSearch.trim()) {
      return masterSearchIndex.slice(0, 10);
    }
    const q = commandSearch.toLowerCase().trim();
    return masterSearchIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.includes(q))
    );
  }, [commandSearch, masterSearchIndex]);

  return (
    <div className="app-container">
      {/* 1. Left Navigation Rail (Dark Navy Institutional #0B1220) */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-title">ANVESHA</div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/tender" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FileText size={15} />
            <span>Tender Overview</span>
          </NavLink>
          <NavLink to={`/tender/${tenderId}/bidders`} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users size={15} />
            <span>Bidders (7)</span>
          </NavLink>
          <NavLink to={`/tender/${tenderId}/requirements`} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <CheckSquare size={15} />
            <span>Requirements (48)</span>
          </NavLink>
          <NavLink to={`/tender/${tenderId}/evidence`} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Shield size={15} />
            <span>Evidence (196)</span>
          </NavLink>
          <NavLink to={`/tender/${tenderId}/network`} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Network size={15} />
            <span>Relationships (3)</span>
          </NavLink>
          <NavLink to={`/tender/${tenderId}/anomalies`} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <AlertTriangle size={15} />
            <span>Anomalies (11)</span>
          </NavLink>
          <NavLink to={`/tender/${tenderId}/review-queue`} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Clock size={15} />
            <span>Review Queue (4)</span>
          </NavLink>
          <NavLink to={`/tender/${tenderId}/audit`} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <GitCommit size={15} />
            <span>Audit Ledger</span>
          </NavLink>
          <NavLink to={`/tender/${tenderId}/audit/reconstruction`} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <RotateCcw size={15} />
            <span>Decision Reconstruction</span>
          </NavLink>

          <div className="nav-section-title">SYSTEM</div>
          <NavLink to={`/tender/${tenderId}/source-health`} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Activity size={15} />
            <span>Source Health</span>
          </NavLink>
          <NavLink to={`/tender/${tenderId}/security`} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Lock size={15} />
            <span>Security Events</span>
          </NavLink>
          <NavLink to={`/tender/${tenderId}/production`} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Cpu size={15} />
            <span>Production Readiness</span>
          </NavLink>
        </nav>

        {/* Sidebar Footer: Pinned Demo Mode Pill & Officer Identity */}
        <div className="sidebar-footer">
          {/* Demo Mode Pill */}
          <div
            onClick={() => setIsPresenterModeActive(!isPresenterModeActive)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--sidebar-surface)',
              border: '1px solid var(--sidebar-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 10px',
              cursor: 'pointer',
              transition: 'all 120ms ease'
            }}
            title="Toggle Demo Mode (Shortcut: 'P')"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: 'var(--sidebar-text)' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: isPresenterModeActive ? 'var(--status-verified-dot)' : 'var(--text-dim)',
                  boxShadow: isPresenterModeActive ? '0 0 6px rgba(16, 185, 129, 0.6)' : 'none'
                }}
              />
              <span>Demo Mode</span>
            </div>
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                padding: '1px 5px',
                borderRadius: 2,
                background: isPresenterModeActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.15)',
                color: isPresenterModeActive ? 'var(--status-verified-dot)' : 'var(--sidebar-text-muted)',
                letterSpacing: '0.04em'
              }}
            >
              {isPresenterModeActive ? 'LIVE' : 'STANDBY'}
            </span>
          </div>

          {/* Officer Identity Profile */}
          <div className="officer-badge">
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'var(--sidebar-surface-elevated)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold)',
                fontWeight: 700,
                fontSize: 11,
                border: '1px solid var(--sidebar-border)'
              }}
            >
              AS
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, color: 'var(--sidebar-text)', fontSize: 12 }}>A. Sharma</div>
              <div style={{ fontSize: 10, color: 'var(--sidebar-text-muted)', whiteSpace: 'nowrap' }}>Procurement Officer · CPCL</div>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Workspace Area */}
      <div className="main-wrapper">
        {/* Topbar: Reference Investigation Console Header */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="tender-title-link">
              <span>CPCL / Industrial Pumping & Process Equipment</span>
              <span className="stage-badge">Technical Evaluation</span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              ID: CPCL/PROC/2026/047 · Published: 12 Aug 2026 · Bid Submission: 18 Aug 2026
            </span>
          </div>

          <div className="topbar-right">
            {/* Global Search Omnibar Trigger */}
            <button
              className="search-command-btn"
              onClick={() => setIsCommandPaletteOpen(true)}
              style={{ width: 280, justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Search size={13} color="var(--text-muted)" />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Search bidder, GSTIN, requirement...</span>
              </div>
              <span className="kbd-shortcut">Ctrl+K</span>
            </button>

            {/* Icon-only action buttons */}
            <button
              onClick={() => setIsWhyThisMattersOpen(true)}
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
              title="7-Pillar Institutional Overview"
            >
              <Info size={14} />
            </button>

            <button
              onClick={() => setIsImpactModalOpen(true)}
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
              title="Target Simulation & Impact KPIs"
            >
              <TrendingUp size={14} />
            </button>

          </div>
        </header>

        {/* Content Viewport */}
        <main className="content-workspace">
          <Outlet />
        </main>
      </div>

      {/* Floating Presenter Hotkey Toast Notification */}
      {activeToast && (
        <div
          style={{
            position: 'fixed',
            top: 68,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--sidebar-surface)',
            border: '1px solid var(--palette-teal)',
            color: '#FFFFFF',
            padding: '8px 18px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            animation: 'fadeIn 150ms ease-out'
          }}
        >
          <CheckCircle2 size={15} color="var(--palette-teal)" />
          <span>{activeToast}</span>
        </div>
      )}

      {/* Demo Control Panel (Presenter Mode) */}
      <DemoControlPanel
        isPresenterModeActive={isPresenterModeActive}
        onTogglePresenterMode={() => setIsPresenterModeActive(!isPresenterModeActive)}
        onStartGuidedDemo={() => {
          setIsGuidedDemoActive(true);
          setGuidedStepIndex(0);
          navigate('/tender');
        }}
        onOpenWhyThisMatters={() => setIsWhyThisMattersOpen(true)}
        onOpenImpactModal={() => setIsImpactModalOpen(true)}
        onOpenPsCoverage={() => setIsPsCoverageOpen(true)}
      />

      {/* Guided Demo Walkthrough Bar */}
      {isGuidedDemoActive && (
        <GuidedDemoBar
          currentStepIndex={guidedStepIndex}
          onSetStepIndex={(idx) => setGuidedStepIndex(idx)}
          onExitGuidedDemo={() => setIsGuidedDemoActive(false)}
        />
      )}

      {/* Why This Matters Drawer */}
      <WhyThisMattersDrawer
        isOpen={isWhyThisMattersOpen}
        onClose={() => setIsWhyThisMattersOpen(false)}
        onOpenImpact={() => setIsImpactModalOpen(true)}
        onOpenPsCoverage={() => setIsPsCoverageOpen(true)}
      />

      {/* Impact Simulation Modal */}
      <ImpactModal
        isOpen={isImpactModalOpen}
        onClose={() => setIsImpactModalOpen(false)}
        onOpenPsCoverage={() => setIsPsCoverageOpen(true)}
      />

      {/* Problem Statement Coverage Panel */}
      <PsCoveragePanel
        isOpen={isPsCoverageOpen}
        onClose={() => setIsPsCoverageOpen(false)}
        onOpenImpact={() => setIsImpactModalOpen(true)}
      />

      {/* Upgraded Omnibar Global Search Modal (Ctrl + K) */}
      {isCommandPaletteOpen && (
        <div
          className="drawer-backdrop"
          onClick={() => setIsCommandPaletteOpen(false)}
          style={{ alignItems: 'flex-start', justifyContent: 'center', paddingTop: '8vh', zIndex: 140 }}
        >
          <div
            style={{
              width: 640,
              background: '#FFFFFF',
              borderRadius: 8,
              boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
              border: '1px solid var(--border-default)',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '1px solid var(--border-default)' }}>
              <Search size={18} color="var(--palette-teal)" />
              <input
                autoFocus
                type="text"
                placeholder="Search bidders, GSTIN, PAN, clauses, bank accounts, evidence IDs, directors..."
                value={commandSearch}
                onChange={(e) => setCommandSearch(e.target.value)}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: 14, fontFamily: 'var(--font-sans)', color: 'var(--text-primary)' }}
              />
              {commandSearch && (
                <button onClick={() => setCommandSearch('')} style={{ color: 'var(--text-muted)', fontSize: 11, padding: '2px 4px' }}>
                  Clear
                </button>
              )}
              <button onClick={() => setIsCommandPaletteOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            </div>

            {/* Results List */}
            <div style={{ maxHeight: 380, overflowY: 'auto', padding: '8px' }}>
              {filteredCommands.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: '#64748B', fontSize: 13 }}>
                  No matching records found for "{commandSearch}". Try searching by PAN, GSTIN, Bank Account (e.g. 50200088991122), or Clause.
                </div>
              ) : (
                filteredCommands.map((item, i) => (
                  <div
                    key={item.id + i}
                    onClick={() => {
                      setIsCommandPaletteOpen(false);
                      navigate(item.path);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      transition: 'background 100ms',
                      marginBottom: 2
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#F1F5F9')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ flex: 1, minWidth: 0, paddingRight: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            padding: '1px 5px',
                            borderRadius: 3,
                            background: '#F1F5F9',
                            color: '#475569',
                            fontFamily: 'var(--font-mono)'
                          }}
                        >
                          {item.category}
                        </span>
                        {item.badge && (
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              padding: '1px 5px',
                              borderRadius: 3,
                              background: item.badgeColor ? `${item.badgeColor}15` : '#EFF6FF',
                              border: `1px solid ${item.badgeColor || '#2563EB'}40`,
                              color: item.badgeColor || '#2563EB',
                              fontFamily: 'var(--font-mono)'
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                        <span style={{ fontWeight: 600, color: '#0F172A', fontSize: 13, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {item.title}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {item.subtitle}
                      </div>
                    </div>
                    <ChevronRight size={14} color="#94A3B8" style={{ flexShrink: 0 }} />
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '8px 16px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748B' }}>
              <span>Press <kbd className="kbd-shortcut">ESC</kbd> to close · Use <kbd className="kbd-shortcut">1–6</kbd> for live hotkeys</span>
              <span>ANVESHA Global Search Index</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
