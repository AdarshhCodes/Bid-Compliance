import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Search,
  Filter,
  FileText,
  ExternalLink,
  ChevronRight,
  Database,
  Layers,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Eye
} from 'lucide-react';
import { DocumentViewerModal } from '../components/investigation/DocumentViewerModal';
import { EvidenceDrawer } from '../components/investigation/EvidenceDrawer';
import { Evidence } from '../types';

interface EvidenceCardItem {
  id: string;
  bidderId: string;
  bidderName: string;
  documentTitle: string;
  pageNumber: number;
  extractedField: string;
  extractedValue: string;
  boundingBox: [number, number, number, number];
  confidence: number;
  verdictImpact: 'VERIFIED' | 'CONTRADICTED' | 'UNVERIFIABLE';
  registryCrossCheck: string;
  snippet: string;
}

export const EvidenceExplorerPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBidderFilter, setSelectedBidderFilter] = useState<string>('ALL');
  const [selectedImpactFilter, setSelectedImpactFilter] = useState<string>('ALL');

  // Modal State
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [viewerDocId, setViewerDocId] = useState('DOC-B2-CA-CERT');
  const [viewerDocPage, setViewerDocPage] = useState(2);

  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);
  const [drawerEvidence, setDrawerEvidence] = useState<Evidence | null>(null);

  // Representative subset of the 196 Evidence objects with rich metadata
  const evidenceItems: EvidenceCardItem[] = [
    {
      id: 'EVD-B2-CACERT-TURNOVER',
      bidderId: 'BIDDER-002',
      bidderName: 'Bharat Fluid Systems Pvt Ltd',
      documentTitle: 'CA_Turnover_Certificate_B2.pdf',
      pageNumber: 2,
      extractedField: 'Average 3-Year Annual Turnover',
      extractedValue: 'INR 9,00,00,000 (₹9.00 Cr)',
      boundingBox: [0.42, 0.58, 0.46, 0.88],
      confidence: 0.982,
      verdictImpact: 'CONTRADICTED',
      registryCrossCheck: 'ICAI UDIN Registry: 24089123AAAAA (Verified Authentic)',
      snippet: 'Average annual financial turnover during preceding 3 financial years: Rs. 9,00,00,000/- (Rupees Nine Crores Only).'
    },
    {
      id: 'EVD-B2-BIDFORM-TURNOVER',
      bidderId: 'BIDDER-002',
      bidderName: 'Bharat Fluid Systems Pvt Ltd',
      documentTitle: 'Bid_Cover_Letter_B2.pdf',
      pageNumber: 3,
      extractedField: 'Declared Average Turnover',
      extractedValue: 'INR 12,00,00,000 (₹12.00 Cr)',
      boundingBox: [0.65, 0.20, 0.70, 0.60],
      confidence: 0.991,
      verdictImpact: 'CONTRADICTED',
      registryCrossCheck: 'Self-declaration letter (Refuted by CA Certificate)',
      snippet: 'We confirm our average turnover for the preceding 3 financial years is INR 12.00 Crores.'
    },
    {
      id: 'EVD-B3-UDYAM-DOC',
      bidderId: 'BIDDER-003',
      bidderName: 'Chennai Petro Controls Pvt Ltd',
      documentTitle: 'Udyam_Registration_Certificate.pdf',
      pageNumber: 1,
      extractedField: 'Udyam Registration Number',
      extractedValue: 'UDYAM-TN-02-0055443',
      boundingBox: [0.18, 0.35, 0.22, 0.75],
      confidence: 0.994,
      verdictImpact: 'CONTRADICTED',
      registryCrossCheck: 'National Udyam Registry: CANCELLED on 31/08/2026',
      snippet: 'Enterprise Name: CHENNAI PETRO CONTROLS PVT LTD · Registration No: UDYAM-TN-02-0055443'
    },
    {
      id: 'EVD-B1-CACERT-TURNOVER',
      bidderId: 'BIDDER-001',
      bidderName: 'Hindustan Valves Corp Ltd',
      documentTitle: 'Annual_Audited_Turnover_Cert.pdf',
      pageNumber: 1,
      extractedField: 'Average 3-Year Annual Turnover',
      extractedValue: 'INR 16,50,00,000 (₹16.50 Cr)',
      boundingBox: [0.50, 0.40, 0.54, 0.85],
      confidence: 0.996,
      verdictImpact: 'VERIFIED',
      registryCrossCheck: 'ICAI UDIN Registry: 24011234AAAAA (Valid & Active)',
      snippet: 'Average annual financial turnover: INR 16.50 Crores, exceeding mandatory INR 10.00 Crores cutoff.'
    },
    {
      id: 'EVD-B4-BANK-MANDATE',
      bidderId: 'BIDDER-004',
      bidderName: 'Apex Industrial Tech Pvt Ltd',
      documentTitle: 'Bank_Mandate_Form_RTGS.pdf',
      pageNumber: 1,
      extractedField: 'Corporate Bank Account & IFSC',
      extractedValue: 'Acc: 50200088991122 · IFSC: HDFC0001234',
      boundingBox: [0.38, 0.45, 0.44, 0.88],
      confidence: 0.989,
      verdictImpact: 'CONTRADICTED',
      registryCrossCheck: 'Cross-Bidder Anomaly: Identical account submitted by Bidder 5',
      snippet: 'Account Name: Apex Industrial Tech Pvt Ltd · Account No: 50200088991122 · Bank: HDFC Bank Ltd'
    },
    {
      id: 'EVD-B5-BANK-MANDATE',
      bidderId: 'BIDDER-005',
      bidderName: 'Zenith Flow Equipments LLP',
      documentTitle: 'Cancelled_Cheque_Bank_Mandate.pdf',
      pageNumber: 1,
      extractedField: 'Corporate Bank Account & IFSC',
      extractedValue: 'Acc: 50200088991122 · IFSC: HDFC0001234',
      boundingBox: [0.35, 0.40, 0.42, 0.85],
      confidence: 0.992,
      verdictImpact: 'CONTRADICTED',
      registryCrossCheck: 'Cross-Bidder Anomaly: Identical account submitted by Bidder 4',
      snippet: 'Payee: Zenith Flow Equipments LLP · Account No: 50200088991122 · IFSC: HDFC0001234'
    },
    {
      id: 'EVD-B6-OEM-LETTER',
      bidderId: 'BIDDER-006',
      bidderName: 'Precision Piping Solutions Pvt Ltd',
      documentTitle: 'OEM_Authorization_Letter_L&T.pdf',
      pageNumber: 1,
      extractedField: 'OEM Equipment Product Scope',
      extractedValue: 'Commercial Plumbing Butterfly & Gate Valves',
      boundingBox: [0.55, 0.25, 0.62, 0.85],
      confidence: 0.978,
      verdictImpact: 'CONTRADICTED',
      registryCrossCheck: 'Semantic Scope Check: Excludes API-6D Refinery Pipeline Ball Valves',
      snippet: 'We hereby authorize M/s Precision Piping Solutions to supply L&T Commercial Water & HVAC Valves.'
    },
    {
      id: 'EVD-B7-GST-RETURN',
      bidderId: 'BIDDER-007',
      bidderName: 'Deccan Heavy Engineering Corp Ltd',
      documentTitle: 'GST_Filing_Declaration.pdf',
      pageNumber: 1,
      extractedField: 'GSTIN Registration Status',
      extractedValue: '36AAACD9900N1Z1 (Portal Unresponsive)',
      boundingBox: [0.22, 0.40, 0.28, 0.78],
      confidence: 0.965,
      verdictImpact: 'UNVERIFIABLE',
      registryCrossCheck: 'NIC GST Gateway 504 Timeout: Connection refused',
      snippet: 'GSTIN: 36AAACD9900N1Z1 · State: Telangana · Legal Name: Deccan Heavy Engineering Corp Ltd'
    }
  ];

  const filteredItems = evidenceItems.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bidderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.extractedField.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.extractedValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.documentTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBidder = selectedBidderFilter === 'ALL' || item.bidderId === selectedBidderFilter;
    const matchesImpact = selectedImpactFilter === 'ALL' || item.verdictImpact === selectedImpactFilter;

    return matchesSearch && matchesBidder && matchesImpact;
  });

  const handleOpenDocViewer = (docTitle: string, page: number) => {
    setViewerDocId(docTitle.includes('CA') ? 'DOC-B2-CA-CERT' : 'DOC-B2-BID-FORM');
    setViewerDocPage(page);
    setIsDocViewerOpen(true);
  };

  const handleOpenDrawer = (item: EvidenceCardItem) => {
    const mockEvd: Evidence = {
      id: item.id,
      documentId: 'DOC-MOCK',
      bidderId: item.bidderId,
      pageNumber: item.pageNumber,
      boundingBox: item.boundingBox,
      claimField: item.extractedField,
      extractedValue: item.extractedValue,
      rawTextSnippet: item.snippet,
      extractionConfidence: item.confidence,
      provenanceType: 'OCR_EXTRACTION',
      provenanceBadge: 'SYNTHETIC',
      extractedAt: '2026-09-29T10:14:22Z'
    };
    setDrawerEvidence(mockEvd);
    setIsEvidenceDrawerOpen(true);
  };

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748B', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
          <span>CPCL/PROC/2026/047</span>
          <ChevronRight size={12} />
          <span>FORENSIC SCRUTINY</span>
          <ChevronRight size={12} />
          <span style={{ color: '#0F172A', fontWeight: 600 }}>EVIDENCE PROVENANCE EXPLORER</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Shield size={22} color="#059669" />
              <span>Clause-to-Evidence Provenance Explorer (196 Objects)</span>
            </h1>
            <p style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
              Every extracted fact links strictly to a document page, bounding box coordinates, and external registry cross-reference.
            </p>
          </div>

          <div className="provenance-tag">
            <Database size={12} color="#2563EB" />
            <span>DEMO DATA — 196 Evidence Objects Indexed</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #CBD5E1',
          borderRadius: 8,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginBottom: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <Search size={16} color="#64748B" />
          <input
            type="text"
            placeholder="Search by evidence ID, extracted value, bidder, or document..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', border: 'none', outline: 'none', fontSize: 13, color: '#0F172A' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B' }}>
            <Filter size={14} />
            <span>Bidder:</span>
          </div>
          <select
            value={selectedBidderFilter}
            onChange={(e) => setSelectedBidderFilter(e.target.value)}
            style={{ border: '1px solid #CBD5E1', borderRadius: 4, padding: '4px 8px', fontSize: 12, color: '#0F172A' }}
          >
            <option value="ALL">All Bidders (7)</option>
            <option value="BIDDER-001">Bidder 1: Hindustan Valves</option>
            <option value="BIDDER-002">Bidder 2: Bharat Fluid</option>
            <option value="BIDDER-003">Bidder 3: Chennai Petro</option>
            <option value="BIDDER-004">Bidder 4: Apex Industrial</option>
            <option value="BIDDER-005">Bidder 5: Zenith Flow</option>
            <option value="BIDDER-006">Bidder 6: Precision Piping</option>
            <option value="BIDDER-007">Bidder 7: Deccan Heavy</option>
          </select>

          <select
            value={selectedImpactFilter}
            onChange={(e) => setSelectedImpactFilter(e.target.value)}
            style={{ border: '1px solid #CBD5E1', borderRadius: 4, padding: '4px 8px', fontSize: 12, color: '#0F172A' }}
          >
            <option value="ALL">All Verdicts</option>
            <option value="VERIFIED">Verified Only</option>
            <option value="CONTRADICTED">Contradicted Only</option>
            <option value="UNVERIFIABLE">Unverifiable Only</option>
          </select>
        </div>
      </div>

      {/* Grid of Evidence Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="panel-card"
            style={{
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderLeft: `4px solid ${
                item.verdictImpact === 'VERIFIED'
                  ? '#10B981'
                  : item.verdictImpact === 'CONTRADICTED'
                  ? '#DC2626'
                  : '#D97706'
              }`
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      fontWeight: 700,
                      background: '#F1F5F9',
                      padding: '2px 6px',
                      borderRadius: 4,
                      color: '#0F172A'
                    }}
                  >
                    {item.id}
                  </span>
                  <span style={{ fontSize: 11, color: '#64748B' }}>
                    Page {item.pageNumber}
                  </span>
                </div>

                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background:
                      item.verdictImpact === 'VERIFIED'
                        ? '#ECFDF5'
                        : item.verdictImpact === 'CONTRADICTED'
                        ? '#FEF2F2'
                        : '#FFFBEB',
                    color:
                      item.verdictImpact === 'VERIFIED'
                        ? '#065F46'
                        : item.verdictImpact === 'CONTRADICTED'
                        ? '#DC2626'
                        : '#D97706',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {item.verdictImpact}
                </span>
              </div>

              <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>
                {item.extractedField}
              </div>

              <div style={{ fontSize: 13, fontWeight: 700, color: '#2563EB', fontFamily: 'var(--font-mono)', margin: '4px 0 8px' }}>
                {item.extractedValue}
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 4, padding: '8px 10px', fontSize: 11, color: '#334155', fontFamily: 'var(--font-mono)', lineHeight: 1.4, marginBottom: 8 }}>
                "{item.snippet}"
              </div>

              <div style={{ fontSize: 11, color: '#64748B', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div><strong>Entity:</strong> {item.bidderName}</div>
                <div><strong>Document:</strong> {item.documentTitle}</div>
                <div><strong>Registry Cross-Check:</strong> {item.registryCrossCheck}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: 10, marginTop: 12 }}>
              <span style={{ fontSize: 10, color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                Coords: [{item.boundingBox.join(', ')}] · Conf: {(item.confidence * 100).toFixed(1)}%
              </span>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => handleOpenDrawer(item)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 8px',
                    borderRadius: 4,
                    background: '#F1F5F9',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer'
                  }}
                >
                  <Eye size={12} />
                  <span>Drawer</span>
                </button>

                <button
                  onClick={() => handleOpenDocViewer(item.documentTitle, item.pageNumber)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 8px',
                    borderRadius: 4,
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#2563EB',
                    cursor: 'pointer'
                  }}
                >
                  <FileText size={12} />
                  <span>View PDF</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Embedded Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={isDocViewerOpen}
        onClose={() => setIsDocViewerOpen(false)}
        documentId={viewerDocId}
        initialPage={viewerDocPage}
        onOpenEvidenceDrawer={() => {
          setIsDocViewerOpen(false);
          setIsEvidenceDrawerOpen(true);
        }}
      />

      {/* Embedded Evidence Drawer */}
      <EvidenceDrawer
        isOpen={isEvidenceDrawerOpen}
        onClose={() => setIsEvidenceDrawerOpen(false)}
        evidence={drawerEvidence}
        onOpenDocument={(docId: string, page: number) => {
          setIsEvidenceDrawerOpen(false);
          handleOpenDocViewer(docId, page);
        }}
      />
    </div>
  );
};
