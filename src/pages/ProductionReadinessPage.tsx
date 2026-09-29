import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  Layers,
  Database,
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Shield,
  Zap,
  Server,
  Network,
  RotateCcw,
  Check,
  AlertTriangle,
  GitCommit,
  ArrowRight
} from 'lucide-react';

export const ProductionReadinessPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'PROVENANCE' | 'INTEGRATION_MAP' | 'ARCHITECTURE'>('PROVENANCE');

  const integrationMap = [
    {
      portal: 'Udyam MSME Registry',
      agency: 'Ministry of MSME',
      dataExchanged: 'Udyam Registration Number, Enterprise Category (Micro/Small/Medium), Revocation Status',
      tag: 'DEMO ADAPTER',
      tagColor: 'var(--palette-teal)',
      productionStatus: 'REST API via NIC National MSME Gateway with mTLS certification'
    },
    {
      portal: 'GSTN (Goods & Services Tax Network)',
      agency: 'GSTN / CBIC',
      dataExchanged: 'GSTIN Status, Legal Name, Return Filing Frequency (GSTR-1, GSTR-3B compliance)',
      tag: 'DEMO ADAPTER',
      tagColor: 'var(--palette-teal)',
      productionStatus: 'GSP (GST Suvidha Provider) authorized webhook with circuit breaker timeout'
    },
    {
      portal: 'PAN / Tax Information Network (TIN)',
      agency: 'Income Tax Department (ITD) / NSDL',
      dataExchanged: 'PAN-Aadhaar Linkage, Entity Legal Title, Active Tax Assessment Status',
      tag: 'DEMO ADAPTER',
      tagColor: 'var(--palette-teal)',
      productionStatus: 'Direct NSDL/UTIITSL verification endpoint'
    },
    {
      portal: 'MCA21 Registry',
      agency: 'Ministry of Corporate Affairs',
      dataExchanged: 'CIN/LLPIN, Director DINs, Authorized Capital, Registered Charges & Mortgages',
      tag: 'DEMO ADAPTER',
      tagColor: 'var(--palette-teal)',
      productionStatus: 'MCA API gateway integration via Open Data / Corporate Data Exchange'
    },
    {
      portal: 'DigiLocker CPSE Credential Vault',
      agency: 'MeitY / National e-Governance Division',
      dataExchanged: 'Digitally signed CA turnover certificates, Partnership deeds, Board resolutions',
      tag: 'PRODUCTION INTERFACE',
      tagColor: '#059669',
      productionStatus: 'OAuth2 DigiLocker Requester API ready for immediate production token exchange'
    },
    {
      portal: 'Make in India (MII) Local Content Registry',
      agency: 'DPIIT / MoP&NG',
      dataExchanged: 'Domestic BoM calculation percentage, Local supplier invoices, Tier-1 origin declarations',
      tag: 'PRODUCTION INTERFACE',
      tagColor: '#059669',
      productionStatus: 'Standardized XML/JSON BoM breakdown schema matching CPCL GTC specifications'
    },
    {
      portal: 'EPFO (Employees Provident Fund)',
      agency: 'Ministry of Labour & Employment',
      dataExchanged: 'Establishment Code, Active Wage-earners count, Monthly ECR filing receipts',
      tag: 'DEMO ADAPTER',
      tagColor: 'var(--palette-teal)',
      productionStatus: 'Unified Shram Suvidha Portal API integration'
    },
    {
      portal: 'ESIC (Employee State Insurance)',
      agency: 'Ministry of Labour & Employment',
      dataExchanged: 'Employer Code, Monthly contribution remittance, Statutory clearance certificate',
      tag: 'DEMO ADAPTER',
      tagColor: 'var(--palette-teal)',
      productionStatus: 'ESIC employer verification endpoint'
    },
    {
      portal: 'Startup India Hub',
      agency: 'DPIIT',
      dataExchanged: 'DPIIT Recognition Number, Tax Exemption Certificate, EMD exemption waiver',
      tag: 'NOT CONNECTED',
      tagColor: '#64748B',
      productionStatus: 'Roadmap Milestone Q3 2027 — Public search adapter currently supported'
    },
    {
      portal: 'NSIC (National Small Industries Corp)',
      agency: 'Ministry of MSME',
      dataExchanged: 'Single Point Registration Scheme (SPRS) certification, Monetary limit endorsement',
      tag: 'NOT CONNECTED',
      tagColor: '#64748B',
      productionStatus: 'Roadmap Milestone Q4 2027'
    },
    {
      portal: 'BIS / DPIIT Industrial Licencing',
      agency: 'Bureau of Indian Standards',
      dataExchanged: 'IS/ISO Certification validity, Pressure testing mark, Factory audit status',
      tag: 'NOT CONNECTED',
      tagColor: '#64748B',
      productionStatus: 'Roadmap Milestone Q4 2027'
    }
  ];

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748B', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
          <span>CPCL/PROC/2026/047</span>
          <ChevronRight size={12} />
          <span>PRODUCTION READINESS</span>
          <ChevronRight size={12} />
          <span style={{ color: '#0F172A', fontWeight: 600 }}>SYSTEM ARCHITECTURE & DATA PROVENANCE</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Cpu size={22} color="var(--palette-teal)" />
              <span>Production Readiness, Data Provenance & Integration Roadmap</span>
            </h1>
            <p style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
              Comprehensive answers to "How does this scale in production?" and "Where is this data from?" directly inside the platform.
            </p>
          </div>

          <div className="provenance-tag">
            <Database size={12} color="var(--palette-teal)" />
            <span>DEMO DATA — Synthetic dataset for SIH demonstration</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #E2E8F0', marginBottom: 20 }}>
        <button
          onClick={() => setActiveTab('PROVENANCE')}
          style={{
            padding: '8px 16px',
            fontSize: 12,
            fontWeight: 700,
            borderBottom: `2px solid ${activeTab === 'PROVENANCE' ? 'var(--palette-teal)' : 'transparent'}`,
            color: activeTab === 'PROVENANCE' ? 'var(--palette-teal)' : '#64748B',
            cursor: 'pointer'
          }}
        >
          1. Data Provenance & AI vs Deterministic Separation
        </button>

        <button
          onClick={() => setActiveTab('INTEGRATION_MAP')}
          style={{
            padding: '8px 16px',
            fontSize: 12,
            fontWeight: 700,
            borderBottom: `2px solid ${activeTab === 'INTEGRATION_MAP' ? 'var(--palette-teal)' : 'transparent'}`,
            color: activeTab === 'INTEGRATION_MAP' ? 'var(--palette-teal)' : '#64748B',
            cursor: 'pointer'
          }}
        >
          2. Production Integration Map (11 Portals)
        </button>

        <button
          onClick={() => setActiveTab('ARCHITECTURE')}
          style={{
            padding: '8px 16px',
            fontSize: 12,
            fontWeight: 700,
            borderBottom: `2px solid ${activeTab === 'ARCHITECTURE' ? 'var(--palette-teal)' : 'transparent'}`,
            color: activeTab === 'ARCHITECTURE' ? 'var(--palette-teal)' : '#64748B',
            cursor: 'pointer'
          }}
        >
          3. Scalable Production Pipeline Topology
        </button>
      </div>

      {/* TAB 1: DATA PROVENANCE & DEMO DATA SPECIFICATION */}
      {activeTab === 'PROVENANCE' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Statutory Benchmark Banner */}
          <div
            style={{
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: 8,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}
          >
            <AlertTriangle size={22} color="#D97706" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: 12, color: '#92400E', lineHeight: 1.5 }}>
              <strong>JURY ETHICAL DISCLOSURE:</strong> All bidders, documents, CA UDINs, and PANs in this demonstration are part of an authentic synthetic dataset modeled after real CPCL GeM tenders. No real CPCL commercial bids or actual private corporate financials are exposed.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
            {/* Table: What is Synthetic vs What Changes in Production */}
            <div className="panel-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Database size={18} color="var(--palette-teal)" />
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  Active Prototype vs Production Architecture Mapping
                </h3>
              </div>

              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left', color: '#64748B', fontSize: 11 }}>
                    <th style={{ padding: '8px 10px' }}>SUBSYSTEM</th>
                    <th style={{ padding: '8px 10px' }}>CURRENT PROTOTYPE</th>
                    <th style={{ padding: '8px 10px' }}>WHAT CHANGES IN PRODUCTION</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px', fontWeight: 700, color: '#0F172A' }}>Tenders & Bids</td>
                    <td style={{ padding: '10px', color: 'var(--palette-teal)' }}>1 Canonical CPCL Tender · 7 Synthetic Bidders</td>
                    <td style={{ padding: '10px', color: '#475569' }}>GeM Public API webhook ingest on tender closing date</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px', fontWeight: 700, color: '#0F172A' }}>Government Portals</td>
                    <td style={{ padding: '10px', color: 'var(--palette-teal)' }}>Mock Adapters with simulated 504 timeouts</td>
                    <td style={{ padding: '10px', color: '#475569' }}>Swap mock class with authorized NIC REST endpoint (zero logic change)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px', fontWeight: 700, color: '#0F172A' }}>Document Extraction</td>
                    <td style={{ padding: '10px', color: 'var(--palette-teal)' }}>Coordinate-anchored LayoutLM token groundings</td>
                    <td style={{ padding: '10px', color: '#475569' }}>Distributed Celery/RabbitMQ workers with OCR cache</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px', fontWeight: 700, color: '#0F172A' }}>Verification Rules</td>
                    <td style={{ padding: '10px', color: '#059669', fontWeight: 700 }}>Deterministic Python Logic (100% Real)</td>
                    <td style={{ padding: '10px', color: '#059669' }}>Identical — rules never run in LLMs, math is always deterministic</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px', fontWeight: 700, color: '#0F172A' }}>Audit Ledger</td>
                    <td style={{ padding: '10px', color: '#059669', fontWeight: 700 }}>Real WebCrypto SHA-256 Hash Chain</td>
                    <td style={{ padding: '10px', color: '#475569' }}>Write-once, append-only PostgreSQL ledger with hardware HSM signing</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* AI vs Deterministic Separation Card */}
            <div className="panel-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Layers size={18} color="#059669" />
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  Deterministic vs AI-Driven Boundary
                </h3>
              </div>

              <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, marginBottom: 14 }}>
                ANVESHA maintains an uncompromising boundary between perception (AI) and judgment (Rules & Officer):
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ background: 'rgba(49, 170, 169, 0.08)', border: '1px solid rgba(49, 170, 169, 0.3)', borderRadius: 6, padding: '10px 12px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--palette-teal)', fontFamily: 'var(--font-mono)' }}>
                    WHERE AI IS USED (PERCEPTION ONLY):
                  </div>
                  <ul style={{ fontSize: 11, color: '#334155', marginTop: 4, paddingLeft: 18, lineHeight: 1.5 }}>
                    <li>LayoutLM coordinate bounding box token extraction</li>
                    <li>OCR normalization on scanned balance sheet tables</li>
                    <li>Semantic embedding similarity on proposal text (Cosine 0.942)</li>
                  </ul>
                </div>

                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 6, padding: '10px 12px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#065F46', fontFamily: 'var(--font-mono)' }}>
                    WHERE DETERMINISTIC CODE IS USED (MATH & VERDICTS):
                  </div>
                  <ul style={{ fontSize: 11, color: '#334155', marginTop: 4, paddingLeft: 18, lineHeight: 1.5 }}>
                    <li>Turnover threshold checks (<code>value &gt;= threshold</code>)</li>
                    <li>BoM Make-in-India re-derivation (exact arithmetic summation)</li>
                    <li>Temporal date validations (submission &lt; revocation timestamp)</li>
                    <li>SHA-256 cryptographic block hash chaining</li>
                  </ul>
                </div>

                <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 6, padding: '10px 12px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#92400E', fontFamily: 'var(--font-mono)' }}>
                    WHERE HUMAN REMAINS SOLE AUTHORITY:
                  </div>
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>
                    Tender disqualification, overrides with typed reasons, showing cause, and final contract award.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTION INTEGRATION MAP */}
      {activeTab === 'INTEGRATION_MAP' && (
        <div className="panel-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                Statutory Government Portals: Integration Status & Technical Specifications
              </h3>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                11 national portals required for comprehensive CPSE bid compliance verification under GFR 2017.
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, fontSize: 10, fontFamily: 'var(--font-mono)' }}>
              <span style={{ background: 'rgba(49, 170, 169, 0.08)', border: '1px solid rgba(49, 170, 169, 0.3)', color: 'var(--palette-teal)', padding: '2px 6px', borderRadius: 3, fontWeight: 700 }}>
                DEMO ADAPTER (6)
              </span>
              <span style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '2px 6px', borderRadius: 3, fontWeight: 700 }}>
                PRODUCTION INTERFACE (2)
              </span>
              <span style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#475569', padding: '2px 6px', borderRadius: 3, fontWeight: 700 }}>
                NOT CONNECTED (3)
              </span>
            </div>
          </div>

          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left', color: '#64748B', fontSize: 11 }}>
                <th style={{ padding: '10px 14px', width: '22%' }}>PORTAL & REGISTRY</th>
                <th style={{ padding: '10px 14px', width: '24%' }}>DATA EXCHANGED</th>
                <th style={{ padding: '10px 14px', width: '15%' }}>ARCHITECTURE TAG</th>
                <th style={{ padding: '10px 14px', width: '39%' }}>PRODUCTION PROTOCOL & ROADMAP</th>
              </tr>
            </thead>
            <tbody>
              {integrationMap.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0', background: idx % 2 === 0 ? '#FFFFFF' : '#FAFBFD' }}>
                  <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{item.portal}</div>
                    <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{item.agency}</div>
                  </td>

                  <td style={{ padding: '12px 14px', verticalAlign: 'top', color: '#334155', lineHeight: 1.4 }}>
                    {item.dataExchanged}
                  </td>

                  <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 3,
                        background:
                          item.tag === 'PRODUCTION INTERFACE'
                            ? '#ECFDF5'
                            : item.tag === 'DEMO ADAPTER'
                            ? '#EFF6FF'
                            : '#F1F5F9',
                        border: `1px solid ${
                          item.tag === 'PRODUCTION INTERFACE'
                            ? '#A7F3D0'
                            : item.tag === 'DEMO ADAPTER'
                            ? '#BFDBFE'
                            : '#CBD5E1'
                        }`,
                        color: item.tagColor,
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      {item.tag}
                    </span>
                  </td>

                  <td style={{ padding: '12px 14px', verticalAlign: 'top', color: '#475569', lineHeight: 1.4 }}>
                    {item.productionStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: SCALABLE PRODUCTION PIPELINE TOPOLOGY */}
      {activeTab === 'ARCHITECTURE' && (
        <div className="panel-card" style={{ padding: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>
              End-to-End Enterprise Production Pipeline
            </h3>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
              Resilient distributed topology designed for CPCL Manali Refinery Procurement Division handling 50+ concurrent tenders.
            </div>
          </div>

          {/* Pipeline Flow Diagram */}
          <div
            style={{
              background: '#0C1527',
              borderRadius: 8,
              padding: '20px',
              color: '#FFFFFF',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              lineHeight: 1.6,
              overflowX: 'auto',
              marginBottom: 20
            }}
          >
            <div style={{ color: '#60A5FA', fontWeight: 700, marginBottom: 8 }}>
              // ANVESHA ENTERPRISE PRODUCTION ARCHITECTURE (TOPOLOGY)
            </div>
            <div style={{ color: '#34D399' }}>
              [GeM Webhook Ingestion] <br />
              &nbsp;&nbsp;↓ (HTTPS Post-Closing Push)<br />
              [Distributed Processing Queue: Celery / RabbitMQ]<br />
              &nbsp;&nbsp;↓ (Non-blocking async ingestion with backpressure)<br />
              [Document Sandbox & OCR/LayoutLM Token Extractor] ── (Cached in Redis)<br />
              &nbsp;&nbsp;↓ (Normalized coordinate bounding boxes [ymin, xmin, ymax, xmax])<br />
              [First-Class Evidence Store: PostgreSQL / JSONB]<br />
              &nbsp;&nbsp;↓ (Deterministic extraction vectors)<br />
              [ANVESHA Verification Engine] ⇄ [Source Adapter Circuit Breaker] (NIC/GSTN/MCA)<br />
              &nbsp;&nbsp;↓ (4-State Verdict Machine: VERIFIED / CONTRADICTED / UNVERIFIABLE / PENDING)<br />
              [Cross-Bidder Relationship Mining Engine] (Bank / Director / Boilerplate cosine match)<br />
              &nbsp;&nbsp;↓<br />
              [Officer Attention Queue] (Prioritized by Uncertainty × Materiality)<br />
              &nbsp;&nbsp;↓ (Mandatory typed statutory justification)<br />
              [Immutable SHA-256 Hash Chain Ledger] ── (CVC / CAG Tamper-Evident Defensibility)
            </div>
          </div>

          {/* Architectural Resilience Guarantees */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--palette-teal)', marginBottom: 4 }}>
                ASYNC QUEUEING & BACKPRESSURE
              </div>
              <p style={{ fontSize: 11, color: '#475569', lineHeight: 1.5, margin: 0 }}>
                Document parsing tasks run asynchronously via distributed worker pools. Large 300-page submissions do not block officer workstation responsiveness.
              </p>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#059669', marginBottom: 4 }}>
                CIRCUIT BREAKERS & IDEMPOTENCY
              </div>
              <p style={{ fontSize: 11, color: '#475569', lineHeight: 1.5, margin: 0 }}>
                Registry gateways route through fault-tolerant circuit breakers. Gateway timeouts degrade to UNVERIFIABLE; all officer actions carry unique idempotency tokens.
              </p>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#D97706', marginBottom: 4 }}>
                EVIDENCE IMMUTABILITY & HSM SIGNING
              </div>
              <p style={{ fontSize: 11, color: '#475569', lineHeight: 1.5, margin: 0 }}>
                Every extracted claim is pinned to raw byte hashes. In production, the Merkle chain roots are periodically anchored via CPCL Hardware Security Modules (HSM).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
