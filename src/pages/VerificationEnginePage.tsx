import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  Layers,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Sliders,
  Calculator,
  FileText,
  Building,
  ChevronRight,
  Info
} from 'lucide-react';
import { EvidenceDrawer } from '../components/investigation/EvidenceDrawer';
import { Evidence } from '../types';

export const VerificationEnginePage: React.FC = () => {
  const navigate = useNavigate();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'MII_DERIVATION' | 'FRESHNESS_TIMELINE' | 'OEM_CHAIN' | 'CONDITIONAL_RULES'>('MII_DERIVATION');

  // MII Case Toggle: Case 1 (Verified 62%) vs Case 2 (Contradicted 68% declared vs 61.2% recomputed)
  const [miiCase, setMiiCase] = useState<'VERIFIED' | 'CONTRADICTED'>('CONTRADICTED');
  const [selectedBomItem, setSelectedBomItem] = useState<string | null>(null);

  // Evidence Drawer state
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);
  const [selectedEvidenceForDrawer, setSelectedEvidenceForDrawer] = useState<Evidence | null>(null);

  // Bill of Materials Line Items for MII
  const bomItemsVerified = [
    { id: 'BOM-01', item: 'Forged ASTM A105 Valve Body Shell', costInr: 4500000, origin: 'DOMESTIC', supplier: 'Bharat Forge Ltd, Pune', pct: 45.0 },
    { id: 'BOM-02', item: 'Stainless Steel Trim & Trunnion Plates', costInr: 1700000, origin: 'DOMESTIC', supplier: 'Salem Steel Plant, SAIL', pct: 17.0 },
    { id: 'BOM-03', item: 'Electric Actuator Assembly (415V)', costInr: 2800000, origin: 'IMPORTED', supplier: 'Rotork Controls, UK', pct: 28.0 },
    { id: 'BOM-04', item: 'Elastomer O-Rings & Gaskets (Viton)', costInr: 1000000, origin: 'IMPORTED', supplier: 'Freudenberg Sealing, Germany', pct: 10.0 }
  ];

  // In the contradicted case, bidder declared 68%, but independent BoM summation reveals 61.2%
  const bomItemsContradicted = [
    { id: 'BOM-C1', item: 'Forged Body Castings (A216 WCB)', costInr: 4100000, origin: 'DOMESTIC', supplier: 'L&T Foundry, Coimbatore', pct: 41.0 },
    { id: 'BOM-C2', item: 'Internal Stellite Hardfaced Trim', costInr: 2020000, origin: 'DOMESTIC', supplier: 'Kirloskar Corrocoat, Pune', pct: 20.2 },
    { id: 'BOM-C3', item: 'Pneumatic Scotch Yoke Actuator', costInr: 2680000, origin: 'IMPORTED', supplier: 'Bettis Actuation, USA', pct: 26.8 },
    { id: 'BOM-C4', item: 'Specialty Inconel Fasteners & Springs', costInr: 1200000, origin: 'IMPORTED', supplier: 'Special Metals Corp, USA', pct: 12.0 }
  ];

  const currentBomItems = miiCase === 'VERIFIED' ? bomItemsVerified : bomItemsContradicted;
  const totalCost = currentBomItems.reduce((acc, i) => acc + i.costInr, 0);
  const domesticCost = currentBomItems.filter(i => i.origin === 'DOMESTIC').reduce((acc, i) => acc + i.costInr, 0);
  const recomputedPct = ((domesticCost / totalCost) * 100).toFixed(1);
  const declaredPct = miiCase === 'VERIFIED' ? '62.0' : '68.0';

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto' }}>
      {/* 1. Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>
              Verification Engine & Forensic Predicate Intelligence
            </h1>
            <span className="verdict-badge verdict-verified">
              DETERMINISTIC VERIFICATION
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>
            Tender-wide verification predicates: Mathematical BoM re-derivation, temporal document freshness, OEM scope validation, and conditional exemptions.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="provenance-tag">GFR RULE ENGINE V1.4</span>
        </div>
      </div>

      {/* 2. Sub-Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', marginBottom: 20 }}>
        {[
          { key: 'MII_DERIVATION', label: '1. Local Content (MII) Re-Derivation' },
          { key: 'FRESHNESS_TIMELINE', label: '2. Evidence Freshness Timeline (Bidder 3)' },
          { key: 'OEM_CHAIN', label: '3. OEM Authorization Chain (Bidder 6)' },
          { key: 'CONDITIONAL_RULES', label: '4. Conditional Rules & MSE Exemption' }
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
              transition: 'all 150ms ease',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* =========================================================================
          MODULE 1: LOCAL CONTENT (MII) RE-DERIVATION (Phase 3 Requirement 3)
          ========================================================================= */}
      {activeTab === 'MII_DERIVATION' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '12px 18px', borderRadius: 6, border: '1px solid #CBD5E1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Calculator size={18} color="var(--palette-teal)" />
              <strong style={{ fontSize: 13, color: '#0F172A' }}>Select Test Verification Case:</strong>
              <div style={{ display: 'flex', background: '#F1F5F9', padding: 2, borderRadius: 5 }}>
                <button
                  onClick={() => setMiiCase('CONTRADICTED')}
                  style={{
                    padding: '4px 12px',
                    fontSize: 11,
                    fontWeight: miiCase === 'CONTRADICTED' ? 700 : 500,
                    borderRadius: 4,
                    background: miiCase === 'CONTRADICTED' ? 'var(--palette-crimson)' : 'transparent',
                    color: miiCase === 'CONTRADICTED' ? '#FFFFFF' : '#475569'
                  }}
                >
                  Case 1: Inflated Claim (Declared 68% vs Recomputed 61.2% → CONTRADICTED)
                </button>
                <button
                  onClick={() => setMiiCase('VERIFIED')}
                  style={{
                    padding: '4px 12px',
                    fontSize: 11,
                    fontWeight: miiCase === 'VERIFIED' ? 700 : 500,
                    borderRadius: 4,
                    background: miiCase === 'VERIFIED' ? '#16A34A' : 'transparent',
                    color: miiCase === 'VERIFIED' ? '#FFFFFF' : '#475569'
                  }}
                >
                  Case 2: Honest BoM (Declared 62% vs Recomputed 62% → VERIFIED)
                </button>
              </div>
            </div>

            <span className="provenance-tag">CLAUSE 7.1 / DPIIT PPP-MII</span>
          </div>

          {/* Comparison Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: 20 }}>
            {/* Left Card: Declared vs Recomputed Hero Comparison */}
            <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="panel-card-header">
                  <span className="panel-title">MII Percentage Verification</span>
                  <span className={`verdict-badge ${miiCase === 'CONTRADICTED' ? 'verdict-contradicted' : 'verdict-verified'}`}>
                    {miiCase === 'CONTRADICTED' ? 'CONTRADICTED' : 'VERIFIED'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: 14, borderRadius: 6 }}>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Declared Self-Claim</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                      {declaredPct}%
                    </div>
                    <div style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>From Bidder Self-Declaration Form</div>
                  </div>

                  <div style={{ background: miiCase === 'CONTRADICTED' ? '#FEF2F2' : '#ECFDF5', border: `1px solid ${miiCase === 'CONTRADICTED' ? '#FCA5A5' : '#A7F3D0'}`, padding: 14, borderRadius: 6 }}>
                    <div style={{ fontSize: 10, color: miiCase === 'CONTRADICTED' ? '#991B1B' : '#065F46', fontWeight: 700, textTransform: 'uppercase' }}>
                      ANVESHA Recomputed
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: miiCase === 'CONTRADICTED' ? 'var(--palette-crimson)' : '#16A34A', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                      {recomputedPct}%
                    </div>
                    <div style={{ fontSize: 10, color: miiCase === 'CONTRADICTED' ? '#991B1B' : '#047857', marginTop: 2 }}>
                      Independent line-item BoM summation
                    </div>
                  </div>
                </div>

                {/* Arithmetic Formula Box */}
                <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 6, padding: '12px 14px', fontSize: 11, fontFamily: 'var(--font-mono)', marginBottom: 14 }}>
                  <div style={{ color: '#475569', fontWeight: 700, marginBottom: 4 }}>Mathematical Re-Derivation Formula:</div>
                  <div style={{ color: '#0F172A', fontSize: 12 }}>
                    Local % = (₹{(domesticCost / 100000).toFixed(2)} Lakhs Domestic / ₹{(totalCost / 100000).toFixed(2)} Lakhs Total) × 100
                  </div>
                  <div style={{ color: miiCase === 'CONTRADICTED' ? 'var(--palette-crimson)' : '#16A34A', fontWeight: 700, marginTop: 4 }}>
                    Result = {recomputedPct}% {miiCase === 'CONTRADICTED' ? `≠ Declared ${declaredPct}% (Discrepancy: -${(parseFloat(declaredPct) - parseFloat(recomputedPct)).toFixed(1)}%)` : `== Declared ${declaredPct}% (Exact Match)`}
                  </div>
                </div>

                {/* Plain Language Finding */}
                <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
                  {miiCase === 'CONTRADICTED'
                    ? 'The bidder claimed 68.0% local content to secure Class-I preference priority, but independent mathematical re-derivation across all Bill of Materials invoices reveals actual domestic contribution is only 61.2%. The self-declaration is contradicted by the bidder\'s own cost breakout.'
                    : 'The declared 62.0% local content perfectly reconciles with domestic material invoices from Bharat Forge and Salem Steel Plant. Confirmed as Class-I Local Supplier (≥ 50%).'}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedEvidenceForDrawer({
                    id: 'EVD-MII-BOM-RECOMPUTE',
                    documentId: 'DOC-MII-BOM-BREAKDOWN',
                    bidderId: 'BIDDER-002',
                    pageNumber: 4,
                    boundingBox: [0.20, 0.10, 0.70, 0.90],
                    claimField: 'local_content_percentage',
                    extractedValue: `${recomputedPct}% (Declared: ${declaredPct}%)`,
                    rawTextSnippet: `Total Domestic Cost: INR ${domesticCost.toLocaleString('en-IN')}; Total Item Cost: INR ${totalCost.toLocaleString('en-IN')}. Calculated Domestic Ratio: ${recomputedPct}%.`,
                    extractionConfidence: 0.99,
                    provenanceType: 'TABLE_PARSER',
                    provenanceBadge: 'SYNTHETIC',
                    extractedAt: '2026-09-29T10:14:25Z'
                  });
                  setIsEvidenceDrawerOpen(true);
                }}
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center', fontSize: 11 }}
              >
                <span>Inspect BoM Evidence in Drawer</span>
              </button>
            </div>

            {/* Right Card: Clickable Bill of Materials Line Items Table */}
            <div className="panel-card">
              <div className="panel-card-header">
                <div>
                  <span className="panel-title">Clickable Bill of Materials (BoM) Line Items</span>
                  <div style={{ fontSize: 11, color: '#64748B' }}>Click any component to inspect cost origin and supplier certification</div>
                </div>
                <span style={{ fontSize: 11, color: 'var(--palette-teal)', fontFamily: 'var(--font-mono)' }}>
                  Total Package: ₹{(totalCost / 100000).toFixed(2)} Lakhs
                </span>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Component Item</th>
                    <th>Supplier / Origin</th>
                    <th>Classification</th>
                    <th style={{ textAlign: 'right' }}>Cost (INR)</th>
                    <th style={{ textAlign: 'right' }}>Cost %</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBomItems.map(item => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedBomItem(item.id)}
                      style={{
                        cursor: 'pointer',
                        background: selectedBomItem === item.id ? '#EFF6FF' : 'transparent'
                      }}
                    >
                      <td>
                        <strong style={{ color: '#0F172A' }}>{item.item}</strong>
                        <div style={{ fontSize: 10, color: '#64748B', fontFamily: 'var(--font-mono)' }}>{item.id}</div>
                      </td>
                      <td style={{ fontSize: 12, color: '#334155' }}>
                        {item.supplier}
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: 3,
                            background: item.origin === 'DOMESTIC' ? '#ECFDF5' : '#FEF2F2',
                            color: item.origin === 'DOMESTIC' ? '#065F46' : '#991B1B',
                            border: `1px solid ${item.origin === 'DOMESTIC' ? '#A7F3D0' : '#FECACA'}`
                          }}
                        >
                          {item.origin}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        ₹{(item.costInr / 100000).toFixed(2)} Lakh
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700, color: item.origin === 'DOMESTIC' ? '#16A34A' : 'var(--palette-crimson)' }}>
                        {item.pct}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 5, marginTop: 14, fontSize: 11, color: '#475569' }}>
                💡 <strong>Audit Traceability:</strong> Every BoM line item is mathematically linked to vendor invoice numbers and customs import bills. No LLM arithmetic involved.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 2: EVIDENCE FRESHNESS TIMELINE (Phase 3 Requirement 5)
          ========================================================================= */}
      {activeTab === 'FRESHNESS_TIMELINE' && (
        <div className="panel-card">
          <div className="panel-card-header">
            <div>
              <h3 className="panel-title">Evidence Freshness Timeline — Bidder 3 Udyam Certificate</h3>
              <p style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                Distinguishing between DOCUMENT STATE (valid on its face) and AUTHORITATIVE SOURCE STATE (cancelled on national registry).
              </p>
            </div>
            <span className="verdict-badge verdict-contradicted">
              TEMPORAL STALENESS DETECTED
            </span>
          </div>

          {/* Side-by-Side State Contrast (Document State vs Authoritative Source State) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            {/* Left: Document State */}
            <div style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: 8, padding: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#16A34A', background: '#ECFDF5', padding: '2px 8px', borderRadius: 4 }}>
                  1. Document State (Static PDF)
                </span>
                <span style={{ fontSize: 11, color: '#64748B' }}>Submitted: 15-Sep-2026</span>
              </div>

              <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
                UDYAM-TN-02-0055443
              </div>

              <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.6, marginBottom: 12 }}>
                <div>• Enterprise Name: <strong>Chennai Petro Controls Pvt Ltd</strong></div>
                <div>• Category: <strong>Small Enterprise (Manufacturing)</strong></div>
                <div>• Issue Date: <strong>14-Nov-2023</strong></div>
                <div>• PDF Expiry Field: <strong>Permanent / No Expiry Stated</strong></div>
                <div>• Visual Authenticity: <strong>Valid QR Code & Government Watermark</strong></div>
              </div>

              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '8px 12px', borderRadius: 4, fontSize: 11, color: '#15803D' }}>
                ✓ On visual inspection alone, the document appears 100% authentic and valid.
              </div>
            </div>

            {/* Right: Authoritative Source State */}
            <div style={{ background: '#FFFDFD', border: '1.5px solid #FCA5A5', borderRadius: 8, padding: 18, boxShadow: '0 2px 8px rgba(220,38,38,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--palette-crimson)', background: 'var(--status-contradicted-bg)', padding: '2px 8px', borderRadius: 4 }}>
                  2. Authoritative Source State (Live Udyam Registry)
                </span>
                <span style={{ fontSize: 11, color: '#991B1B', fontWeight: 600 }}>Revocation: 31-Aug-2026</span>
              </div>

              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--palette-crimson)', marginBottom: 6 }}>
                STATUS: CANCELLED / DE-REGISTERED
              </div>

              <div style={{ fontSize: 12, color: '#7F1D1D', lineHeight: 1.6, marginBottom: 12 }}>
                <div>• Registry Portal: <strong>Ministry of MSME Central Database</strong></div>
                <div>• Cancellation Date: <strong>31-Aug-2026 (2 weeks before bid closing)</strong></div>
                <div>• Official Reason: <strong>Non-filing of mandatory Form MSME-1 & annual returns</strong></div>
                <div>• Validity on Evaluation Date: <strong>FALSE (Revoked Certificate)</strong></div>
                <div>• Registry Transaction Ref: <strong>UDYAM-REVOKE-REG-88192</strong></div>
              </div>

              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '8px 12px', borderRadius: 4, fontSize: 11, color: '#991B1B' }}>
                🚨 Ground Truth Conflict: Internally authentic PDF is externally false and revoked.
              </div>
            </div>
          </div>

          {/* Chronological Event Timeline */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 12 }}>
              Temporal Chronology (Issued → Checked → Registry Status Changed → Bid Submission)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: 14, borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: '#64748B', fontFamily: 'var(--font-mono)' }}>14-Nov-2023</div>
                <strong style={{ fontSize: 12, color: '#0F172A', display: 'block', margin: '4px 0' }}>Udyam Certificate Issued</strong>
                <div style={{ fontSize: 11, color: '#64748B' }}>Issued by Ministry of MSME to Chennai Petro Controls.</div>
              </div>

              <div style={{ background: '#FEF2F2', border: '1.5px solid #FCA5A5', padding: 14, borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: 'var(--palette-crimson)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>31-Aug-2026 (CRITICAL)</div>
                <strong style={{ fontSize: 12, color: '#991B1B', display: 'block', margin: '4px 0' }}>Cancelled on Registry</strong>
                <div style={{ fontSize: 11, color: '#7F1D1D' }}>De-registered due to non-filing of MSME returns.</div>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: 14, borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: '#64748B', fontFamily: 'var(--font-mono)' }}>15-Sep-2026 (10:15)</div>
                <strong style={{ fontSize: 12, color: '#0F172A', display: 'block', margin: '4px 0' }}>Bid Packet Submitted</strong>
                <div style={{ fontSize: 11, color: '#64748B' }}>Bidder attaches old PDF claiming statutory EMD exemption.</div>
              </div>

              <div style={{ background: 'rgba(49, 170, 169, 0.08)', border: '1.5px solid var(--palette-teal)', padding: 14, borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: 'var(--palette-teal)', fontFamily: 'var(--font-mono)' }}>29-Sep-2026 (10:14)</div>
                <strong style={{ fontSize: 12, color: 'var(--palette-teal)', display: 'block', margin: '4px 0' }}>ANVESHA Live Query</strong>
                <div style={{ fontSize: 11, color: '#1E3A8A' }}>Adapter catches revocation date &lt; bid closing date $\to$ CONTRADICTED.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 3: OEM AUTHORIZATION CHAIN (Phase 3 Requirement 4)
          ========================================================================= */}
      {activeTab === 'OEM_CHAIN' && (
        <div className="panel-card">
          <div className="panel-card-header">
            <div>
              <h3 className="panel-title">OEM Authorization Chain — Bidder 6 (Precision Piping Solutions)</h3>
              <p style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                Validating the supply chain path: OEM Manufacturer → Authorized Distributor → Tender Item Specification.
              </p>
            </div>
            <span className="verdict-badge verdict-contradicted">
              SCOPE MISMATCH: CONTRADICTED
            </span>
          </div>

          {/* The Supply Chain Stepper */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
            {/* Step 1: OEM */}
            <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 8, padding: 18 }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--palette-teal)' }}>Tier 1: OEM Manufacturer</span>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: '6px 0 2px' }}>
                L&T Valves Limited
              </div>
              <div style={{ fontSize: 11, color: '#64748B', marginBottom: 10 }}>Manapakkam, Chennai · Approved GeM Manufacturer</div>
              <div style={{ fontSize: 11, color: '#334155', background: '#FFFFFF', padding: 8, borderRadius: 4, border: '1px solid #E2E8F0' }}>
                Valid Manufacturer Authorization Form (MAF) issued under Reference: <code>LTV/DL/AUTH/2026/089</code>.
              </div>
            </div>

            {/* Step 2: Distributor / Bidder */}
            <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 8, padding: 18 }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--palette-teal)' }}>Tier 2: Authorized Bidder</span>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: '6px 0 2px' }}>
                Precision Piping Solutions Pvt Ltd
              </div>
              <div style={{ fontSize: 11, color: '#64748B', marginBottom: 10 }}>Bidder 6 · Okhla Industrial Area, New Delhi</div>
              <div style={{ fontSize: 11, color: '#334155', background: '#FFFFFF', padding: 8, borderRadius: 4, border: '1px solid #E2E8F0' }}>
                Authorized line item in submitted letter: <em>"Commercial Plumbing Butterfly & Gate Valves"</em>.
              </div>
            </div>

            {/* Step 3: Tender Specification Target */}
            <div style={{ background: '#FFFDFD', border: '1.5px solid #FCA5A5', borderRadius: 8, padding: 18 }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--palette-crimson)' }}>Tier 3: Tender Mandatory Spec</span>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#991B1B', margin: '6px 0 2px' }}>
                API-6D High-Pressure Pipeline Valves
              </div>
              <div style={{ fontSize: 11, color: '#991B1B', marginBottom: 10 }}>Clause 6.3 Mandatory Technical Requirement</div>
              <div style={{ fontSize: 11, color: '#7F1D1D', background: '#FEF2F2', padding: 8, borderRadius: 4, border: '1px solid #FECACA' }}>
                Hydrocarbon refinery service · Class 600/900 Trunnion Mounted Pipeline Ball Valves.
              </div>
            </div>
          </div>

          {/* Finding Banner */}
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6, padding: '14px 18px', fontSize: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#991B1B', fontWeight: 700, marginBottom: 4 }}>
              <AlertTriangle size={16} />
              <span>DETERMINISTIC FINDING: AUTHORIZATION SCOPE DOES NOT COVER TENDER ITEM CATEGORY</span>
            </div>
            <p style={{ color: '#7F1D1D', lineHeight: 1.5 }}>
              While the submitted Manufacturer Authorization Form (MAF) from L&T Valves is an authentic signed document, it explicitly restricts authorization to <strong>low-pressure commercial plumbing valves for municipal water projects</strong>. The tender requires <strong>API-6D high-pressure hydrocarbon pipeline valves</strong>. The semantic scope test fails under Clause 6.3 $\to$ Assigned verdict <strong>CONTRADICTED</strong>.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 4: REQUIREMENT APPLICABILITY & CONDITIONAL RULES (Phase 3 Requirement 7)
          ========================================================================= */}
      {activeTab === 'CONDITIONAL_RULES' && (
        <div className="panel-card">
          <div className="panel-card-header">
            <div>
              <h3 className="panel-title">Requirement Applicability — Conditional Exemption Decision Engine</h3>
              <p style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                Evaluating statutory conditional clauses: Clause → Condition → Evidence → Applicability → Result.
              </p>
            </div>
            <span className="verdict-badge verdict-unverifiable">
              EXEMPTION CANNOT BE ESTABLISHED
            </span>
          </div>

          {/* Explicit 5-Stage Conditional Logic Breakdown (Phase 3 Requirement 7) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, alignItems: 'center', textAlign: 'center' }}>
              {/* Stage 1: Clause */}
              <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: 14, borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700 }}>1. CLAUSE</div>
                <strong style={{ fontSize: 13, color: '#0F172A', display: 'block', margin: '4px 0' }}>Clause 5.2</strong>
                <div style={{ fontSize: 10, color: '#64748B' }}>EMD / Tender Fee Exemption for MSEs</div>
              </div>
              <span style={{ color: '#94A3B8', fontWeight: 700, fontSize: 16 }}>→</span>

              {/* Stage 2: Condition */}
              <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: 14, borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700 }}>2. CONDITION</div>
                <strong style={{ fontSize: 13, color: 'var(--palette-teal)', display: 'block', margin: '4px 0' }}>Udyam == ACTIVE</strong>
                <div style={{ fontSize: 10, color: '#64748B' }}>Must be active on bid submission date</div>
              </div>
              <span style={{ color: '#94A3B8', fontWeight: 700, fontSize: 16 }}>→</span>

              {/* Stage 3: Evidence */}
              <div style={{ background: '#FEF2F2', border: '1.5px solid #FCA5A5', padding: 14, borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: '#991B1B', fontWeight: 700 }}>3. EVIDENCE</div>
                <strong style={{ fontSize: 13, color: 'var(--palette-crimson)', display: 'block', margin: '4px 0' }}>CANCELLED</strong>
                <div style={{ fontSize: 10, color: '#991B1B' }}>Revoked on 31-Aug-2026 (MSME API)</div>
              </div>
              <span style={{ color: '#94A3B8', fontWeight: 700, fontSize: 16 }}>→</span>

              {/* Stage 4: Applicability */}
              <div style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', padding: 14, borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: '#92400E', fontWeight: 700 }}>4. APPLICABILITY</div>
                <strong style={{ fontSize: 13, color: '#B45309', display: 'block', margin: '4px 0' }}>INELIGIBLE</strong>
                <div style={{ fontSize: 10, color: '#92400E' }}>Exemption predicate fails</div>
              </div>
              <span style={{ color: '#94A3B8', fontWeight: 700, fontSize: 16 }}>→</span>

              {/* Stage 5: Result */}
              <div style={{ background: '#FEF2F2', border: '2px solid #EF4444', padding: 14, borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: '#991B1B', fontWeight: 700 }}>5. RESULT</div>
                <strong style={{ fontSize: 12, color: 'var(--palette-crimson)', display: 'block', margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
                  CANNOT BE ESTABLISHED
                </strong>
                <div style={{ fontSize: 9, color: '#991B1B' }}>Full EMD of ₹37 Lakhs Mandatory</div>
              </div>
            </div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: 16, borderRadius: 6, fontSize: 12, color: '#334155', lineHeight: 1.6 }}>
            <strong>Why Conditional Transparency Matters:</strong> Rather than a simplistic binary "Exempt / Not Exempt" radio toggle, ANVESHA exposes the exact evidentiary dependencies. Because Bidder 3's Udyam registration was cancelled in the authoritative registry prior to bid closing, the statutory condition cannot be satisfied. Consequently, the bidder was legally required to furnish the ₹37.00 Lakh Earnest Money Deposit (EMD). Having failed to attach EMD payment proof, Bidder 3 is non-responsive.
          </div>
        </div>
      )}

      {/* Sub-Drawer: Global Evidence Drawer */}
      <EvidenceDrawer
        isOpen={isEvidenceDrawerOpen}
        onClose={() => setIsEvidenceDrawerOpen(false)}
        evidence={selectedEvidenceForDrawer}
        requirementTitle="Local Content (MII) Verification & BoM Derivation"
        requirementId="REQ-006"
        clauseReference="Clause 7.1 / DPIIT Public Procurement Order"
        verdictImpact="Deterministic recomputation confirms domestic component cost origin against claimed threshold."
      />
    </div>
  );
};
