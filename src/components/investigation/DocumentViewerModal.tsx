import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  FileText,
  Shield,
  Download,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  Layers
} from 'lucide-react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId?: string;
  initialPage?: number;
  highlightBbox?: [number, number, number, number];
  evidenceMarkerLabel?: string;
  onOpenEvidenceDrawer?: (evidenceId: string) => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  documentId = 'DOC-B2-CA-CERT',
  initialPage = 2,
  highlightBbox = [0.55, 0.15, 0.62, 0.85],
  evidenceMarkerLabel = 'EVIDENCE E-1042',
  onOpenEvidenceDrawer
}) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDoc, setActiveDoc] = useState<'CA_CERT' | 'BID_FORM'>(
    documentId.includes('BID') ? 'BID_FORM' : 'CA_CERT'
  );
  const [showBbox, setShowBbox] = useState<boolean>(true);
  const [markerTooltipOpen, setMarkerTooltipOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  const totalPages = activeDoc === 'CA_CERT' ? 4 : 8;

  const isEvidenceOnCurrentPage =
    (activeDoc === 'CA_CERT' && currentPage === 2) ||
    (activeDoc === 'BID_FORM' && currentPage === 3);

  return (
    <div className="drawer-backdrop" onClick={onClose} style={{ zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 1200,
          maxWidth: '96vw',
          height: '92vh',
          background: '#0F172A',
          borderRadius: 8,
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
          border: '1px solid #334155',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* 1. Top Viewer Toolbar */}
        <div
          style={{
            height: 52,
            background: '#1E293B',
            borderBottom: '1px solid #334155',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#E2E8F0',
            flexShrink: 0
          }}
        >
          {/* Document Switcher & Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', background: '#0F172A', padding: 2, borderRadius: 5 }}>
              <button
                onClick={() => {
                  setActiveDoc('CA_CERT');
                  setCurrentPage(2);
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: activeDoc === 'CA_CERT' ? 700 : 500,
                  background: activeDoc === 'CA_CERT' ? '#2563EB' : 'transparent',
                  color: '#FFFFFF'
                }}
              >
                CA Certificate (DOC-B2-CA-CERT)
              </button>
              <button
                onClick={() => {
                  setActiveDoc('BID_FORM');
                  setCurrentPage(3);
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: activeDoc === 'BID_FORM' ? 700 : 500,
                  background: activeDoc === 'BID_FORM' ? '#2563EB' : 'transparent',
                  color: '#FFFFFF'
                }}
              >
                Bid Cover Form (DOC-B2-BID-COVER)
              </button>
            </div>

            <span className="provenance-tag" style={{ fontSize: 10, background: '#334155', color: '#93C5FD', borderColor: '#475569' }}>
              SHA-256: 4f98...e1b2
            </span>
          </div>

          {/* Page Controls & Zoom */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Search */}
            <div style={{ position: 'relative', width: 170 }}>
              <Search size={13} style={{ position: 'absolute', left: 8, top: 7, color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Find in document..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: '#0F172A',
                  border: '1px solid #475569',
                  borderRadius: 4,
                  padding: '3px 8px 3px 26px',
                  fontSize: 11,
                  color: '#FFFFFF',
                  outline: 'none'
                }}
              />
            </div>

            {/* Page Nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                style={{ padding: '3px 6px', background: '#334155', borderRadius: 3, opacity: currentPage <= 1 ? 0.4 : 1 }}
              >
                <ChevronLeft size={14} />
              </button>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                style={{ padding: '3px 6px', background: '#334155', borderRadius: 3, opacity: currentPage >= totalPages ? 0.4 : 1 }}
              >
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Zoom */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, borderLeft: '1px solid #475569', paddingLeft: 12 }}>
              <button onClick={() => setZoomLevel(z => Math.max(70, z - 15))} style={{ padding: 3 }}>
                <ZoomOut size={14} />
              </button>
              <span style={{ fontFamily: 'var(--font-mono)', width: 34, textAlign: 'center' }}>
                {zoomLevel}%
              </span>
              <button onClick={() => setZoomLevel(z => Math.min(160, z + 15))} style={{ padding: 3 }}>
                <ZoomIn size={14} />
              </button>
            </div>

            {/* Highlight Toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, cursor: 'pointer', color: '#94A3B8' }}>
              <input
                type="checkbox"
                checked={showBbox}
                onChange={(e) => setShowBbox(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <span>Highlight Evidence</span>
            </label>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            style={{ padding: 6, color: '#94A3B8', hover: { color: '#FFF' } } as any}
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. Main Workspace: Thumbnails Left + PDF Sheet Center */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#334155' }}>
          {/* Left Thumbnails Rail */}
          <div
            style={{
              width: 140,
              background: '#1E293B',
              borderRight: '1px solid #334155',
              padding: '14px 10px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.05em' }}>
              Thumbnails
            </div>

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              const isSelected = p === currentPage;
              const hasEvidence =
                (activeDoc === 'CA_CERT' && p === 2) ||
                (activeDoc === 'BID_FORM' && p === 3);

              return (
                <div
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <div
                    style={{
                      width: 90,
                      height: 120,
                      background: '#FFFFFF',
                      borderRadius: 3,
                      border: isSelected ? '2px solid #3B82F6' : '1px solid #475569',
                      padding: 6,
                      boxShadow: isSelected ? '0 0 10px rgba(59, 130, 246, 0.4)' : 'none',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Simulated miniature text lines */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, opacity: 0.6 }}>
                      <div style={{ height: 4, background: '#0F172A', width: '70%' }}></div>
                      <div style={{ height: 2, background: '#94A3B8', width: '90%' }}></div>
                      <div style={{ height: 2, background: '#94A3B8', width: '85%' }}></div>
                      <div style={{ height: 2, background: '#94A3B8', width: '60%' }}></div>
                    </div>

                    {hasEvidence && (
                      <div
                        style={{
                          height: 14,
                          background: 'rgba(239, 68, 68, 0.2)',
                          border: '1px solid #EF4444',
                          borderRadius: 2
                        }}
                      />
                    )}

                    <div style={{ height: 3, background: '#CBD5E1', width: '40%' }}></div>

                    {hasEvidence && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#EF4444'
                        }}
                        title="Contains Contradicted Evidence"
                      />
                    )}
                  </div>
                  <span style={{ fontSize: 10, color: isSelected ? '#60A5FA' : '#94A3B8', marginTop: 4, fontWeight: isSelected ? 700 : 500 }}>
                    Page {p}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Center Document Viewport */}
          <div
            style={{
              flex: 1,
              overflow: 'auto',
              padding: '30px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start'
            }}
          >
            {/* The Document Paper Sheet */}
            <div
              style={{
                width: `${595 * (zoomLevel / 100)}px`,
                minHeight: `${842 * (zoomLevel / 100)}px`,
                background: '#FFFFFF',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
                borderRadius: 3,
                padding: '40px 48px',
                position: 'relative',
                color: '#0F172A',
                fontFamily: 'serif',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'width 100ms ease, min-height 100ms ease'
              }}
            >
              {/* DOCUMENT CONTENT: CA CERTIFICATE (PAGE 2) */}
              {activeDoc === 'CA_CERT' && currentPage === 2 && (
                <div>
                  <div style={{ borderBottom: '2px solid #0F172A', paddingBottom: 10, marginBottom: 18, textAlign: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      R. S. MEHTA & ASSOCIATES
                    </div>
                    <div style={{ fontSize: 10, color: '#475569' }}>
                      Chartered Accountants · 402, Dalamal Chambers, Marine Lines, Mumbai - 400020
                    </div>
                    <div style={{ fontSize: 9, color: '#64748B', fontFamily: 'monospace' }}>
                      Firm Reg. No.: 106244W · Peer Reviewed Practice Unit
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: 18 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, textDecoration: 'underline' }}>
                      TURNOVER CERTIFICATE
                    </span>
                  </div>

                  <p style={{ fontSize: 11, lineHeight: 1.6, textAlign: 'justify', marginBottom: 14 }}>
                    We have examined the audited books of accounts and statutory records of <strong>M/s Bharat Fluid Systems Private Limited</strong> (formerly Apex Process Systems Pvt Ltd), having registered office at Gala 108, Marol Bhavan, Andheri East, Mumbai 400059, for the preceding three financial years.
                  </p>

                  {/* Financial Table */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, marginBottom: 16 }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderTop: '1px solid #000', borderBottom: '1px solid #000' }}>
                        <th style={{ padding: '6px 8px', textAlign: 'left' }}>Financial Year</th>
                        <th style={{ padding: '6px 8px', textAlign: 'right' }}>Audited Annual Turnover (INR)</th>
                        <th style={{ padding: '6px 8px', textAlign: 'right' }}>Turnover in INR Crores</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '6px 8px' }}>FY 2021-2022</td>
                        <td style={{ padding: '6px 8px', textAlign: 'right', fontFamily: 'monospace' }}>8,40,00,000.00</td>
                        <td style={{ padding: '6px 8px', textAlign: 'right' }}>₹8.40 Cr</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '6px 8px' }}>FY 2022-2023</td>
                        <td style={{ padding: '6px 8px', textAlign: 'right', fontFamily: 'monospace' }}>9,10,00,000.00</td>
                        <td style={{ padding: '6px 8px', textAlign: 'right' }}>₹9.10 Cr</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #000' }}>
                        <td style={{ padding: '6px 8px' }}>FY 2023-2024</td>
                        <td style={{ padding: '6px 8px', textAlign: 'right', fontFamily: 'monospace' }}>9,50,00,000.00</td>
                        <td style={{ padding: '6px 8px', textAlign: 'right' }}>₹9.50 Cr</td>
                      </tr>
                      <tr style={{ fontWeight: 700, background: '#FEF2F2' }}>
                        <td style={{ padding: '8px 8px' }}>Three-Year Average Annual Turnover</td>
                        <td style={{ padding: '8px 8px', textAlign: 'right', fontFamily: 'monospace', color: '#DC2626' }}>
                          9,00,00,000.00
                        </td>
                        <td style={{ padding: '8px 8px', textAlign: 'right', color: '#DC2626' }}>
                          ₹9.00 Cr
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Highlighted Bounding Box Area over the certified average */}
                  {showBbox && isEvidenceOnCurrentPage && (
                    <div
                      style={{
                        position: 'relative',
                        border: '2px solid #EF4444',
                        background: 'rgba(239, 68, 68, 0.12)',
                        padding: '10px 14px',
                        borderRadius: 4,
                        marginBottom: 16
                      }}
                    >
                      {/* Evidence Pin Tag */}
                      <div
                        onClick={() => {
                          setMarkerTooltipOpen(!markerTooltipOpen);
                          if (onOpenEvidenceDrawer) {
                            onOpenEvidenceDrawer('EVD-B2-CACERT-TURNOVER');
                          }
                        }}
                        style={{
                          position: 'absolute',
                          top: -12,
                          right: 12,
                          background: '#DC2626',
                          color: '#FFFFFF',
                          padding: '2px 8px',
                          borderRadius: 3,
                          fontSize: 10,
                          fontWeight: 700,
                          fontFamily: 'monospace',
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(220, 38, 38, 0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <Shield size={11} />
                        <span>{evidenceMarkerLabel}</span>
                      </div>

                      <div style={{ fontSize: 11, fontWeight: 700, color: '#991B1B' }}>
                        CERTIFIED AVERAGE ANNUAL TURNOVER: INR 9,00,00,000 (RUPEES NINE CRORES ONLY)
                      </div>
                      <div style={{ fontSize: 9, color: '#64748B', fontFamily: 'monospace', marginTop: 2 }}>
                        UDIN: 24089123AAAAA · Grounded OCR Extraction Token ID: TOK-8812
                      </div>
                    </div>
                  )}

                  <p style={{ fontSize: 10, lineHeight: 1.5, textAlign: 'justify', color: '#475569' }}>
                    This certificate is issued at the specific request of the company for submission to Chennai Petroleum Corporation Limited against Tender Ref: CPCL/PROC/2026/047.
                  </p>
                </div>
              )}

              {/* DOCUMENT CONTENT: BID FORM (PAGE 3) */}
              {activeDoc === 'BID_FORM' && currentPage === 3 && (
                <div>
                  <div style={{ borderBottom: '1px solid #CBD5E1', paddingBottom: 10, marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>
                      BHARAT FLUID SYSTEMS PRIVATE LIMITED
                    </div>
                    <div style={{ fontSize: 10, color: '#64748B' }}>
                      FORM A-1: STATUTORY BID DECLARATION & COMMERCIAL CREDENTIALS
                    </div>
                  </div>

                  <div style={{ fontSize: 11, marginBottom: 14 }}>
                    <strong>Tender Reference:</strong> CPCL/PROC/2026/047 · Manali Refinery Valves Package
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10, fontSize: 11, marginBottom: 16 }}>
                    <div style={{ padding: '8px 10px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <span style={{ color: '#64748B' }}>1. Bidder Legal Entity: </span>
                      <strong>Bharat Fluid Systems Private Limited</strong>
                    </div>

                    {showBbox && (
                      <div
                        style={{
                          position: 'relative',
                          border: '2px solid #EF4444',
                          background: 'rgba(239, 68, 68, 0.12)',
                          padding: '10px 14px',
                          borderRadius: 4
                        }}
                      >
                        <div
                          onClick={() => {
                            if (onOpenEvidenceDrawer) {
                              onOpenEvidenceDrawer('EVD-B2-BIDFORM-TURNOVER');
                            }
                          }}
                          style={{
                            position: 'absolute',
                            top: -12,
                            right: 12,
                            background: '#2563EB',
                            color: '#FFFFFF',
                            padding: '2px 8px',
                            borderRadius: 3,
                            fontSize: 10,
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            cursor: 'pointer'
                          }}
                        >
                          EVIDENCE E-1021
                        </div>
                        <span style={{ color: '#64748B' }}>2. Declared Average Annual Turnover: </span>
                        <strong style={{ color: '#DC2626', fontSize: 13, fontFamily: 'monospace' }}>
                          INR 12,00,00,000.00 (Rupees Twelve Crores Only)
                        </strong>
                        <div style={{ fontSize: 10, color: '#991B1B', marginTop: 3 }}>
                          Declared figure refutes attached CA Certificate figure of ₹9.00 Cr!
                        </div>
                      </div>
                    )}

                    <div style={{ padding: '8px 10px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <span style={{ color: '#64748B' }}>3. Minimum Local Content (MII): </span>
                      <strong>54.0% Class-I Local Supplier</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* FALLBACK / OTHER PAGES */}
              {((activeDoc === 'CA_CERT' && currentPage !== 2) || (activeDoc === 'BID_FORM' && currentPage !== 3)) && (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748B' }}>
                  <FileText size={36} style={{ margin: '0 auto 12px', color: '#94A3B8' }} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>
                    {activeDoc === 'CA_CERT' ? 'Chartered Accountant Certificate' : 'Bid Declaration Form'}
                  </div>
                  <div style={{ fontSize: 11, marginTop: 4 }}>
                    Page {currentPage} of {totalPages} (Annexures & Statutory Disclosures)
                  </div>
                  <button
                    onClick={() => setCurrentPage(activeDoc === 'CA_CERT' ? 2 : 3)}
                    className="btn-primary"
                    style={{ margin: '20px auto 0', fontSize: 11 }}
                  >
                    Jump to Flagged Evidence Page (Page {activeDoc === 'CA_CERT' ? 2 : 3})
                  </button>
                </div>
              )}

              {/* Bottom Signatures & Stamp */}
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 10 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>For R. S. Mehta & Associates</div>
                  <div style={{ color: '#64748B' }}>Chartered Accountants</div>
                  <div style={{ fontFamily: 'monospace', color: '#16A34A', marginTop: 4 }}>
                    [DIGITALLY SIGNED & UDIN VERIFIED]
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700 }}>R. S. Mehta, FCA</div>
                  <div style={{ color: '#64748B' }}>Partner · Membership No: 042891</div>
                  <div style={{ fontFamily: 'monospace', color: '#64748B' }}>Place: Mumbai · Date: 12-08-2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
