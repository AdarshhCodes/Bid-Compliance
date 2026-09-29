import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Shield,
  UserCheck,
  RotateCcw,
  Check,
  X,
  GitCommit,
  Send,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import {
  recordOfficerAction,
  getOfficerOverride,
  subscribeToAuditChanges,
  OfficerOverrideState
} from '../services/auditService';

interface ReviewQueueRow {
  id: string;
  priority: 'P1' | 'P2' | 'P3';
  bidderId: string;
  bidder: string;
  requirementId: string;
  requirement: string;
  clause: string;
  issue: string;
  status: 'CONTRADICTED' | 'UNVERIFIABLE' | 'RELATIONSHIP' | 'RESOLVED';
  suggestedAction: string;
  assignedTo: string;
  dueDate: string;
  targetPath: string;
}

export const ReviewQueuePage: React.FC = () => {
  const navigate = useNavigate();

  // Filter Tab State: All / High Priority / Pending / Resolved
  const [activeTab, setActiveTab] = useState<'ALL' | 'HIGH_PRIORITY' | 'PENDING' | 'RESOLVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // 11 Review Queue Items (Matching Reference Image 1 Panel 5)
  const initialItems: ReviewQueueRow[] = [
    {
      id: 'REV-001',
      priority: 'P1',
      bidderId: 'BIDDER-002',
      bidder: 'Apex Process Systems Pvt Ltd',
      requirementId: 'REQ-004',
      requirement: 'Turnover ≥ ₹10 Cr',
      clause: 'Clause 4.2',
      issue: 'Conflicting values (₹12 Cr vs ₹9 Cr)',
      status: 'CONTRADICTED',
      suggestedAction: 'Review documents',
      assignedTo: 'A. Sharma',
      dueDate: '19 Aug 2026',
      targetPath: '/tender/CPCL-2026-VALVES-7701/bidder/BIDDER-002?trigger=turnover'
    },
    {
      id: 'REV-002',
      priority: 'P1',
      bidderId: 'BIDDER-007',
      bidder: 'Eastern Process Equipments',
      requirementId: 'REQ-007',
      requirement: 'GST Registration',
      clause: 'Clause 7.2',
      issue: 'Source unavailable (504 timeout)',
      status: 'UNVERIFIABLE',
      suggestedAction: 'Retry verification',
      assignedTo: 'A. Sharma',
      dueDate: '19 Aug 2026',
      targetPath: '/tender/CPCL-2026-VALVES-7701/source-health?trigger=gst_outage'
    },
    {
      id: 'REV-003',
      priority: 'P1',
      bidderId: 'BIDDER-003',
      bidder: 'Bharat Industrial Controls',
      requirementId: 'REQ-006',
      requirement: 'Udyam Registration',
      clause: 'Clause 6.3',
      issue: 'Certificate cancelled in registry',
      status: 'CONTRADICTED',
      suggestedAction: 'Review documents',
      assignedTo: 'R. Kumar',
      dueDate: '19 Aug 2026',
      targetPath: '/tender/CPCL-2026-VALVES-7701/bidder/BIDDER-003?trigger=udyam'
    },
    {
      id: 'REV-004',
      priority: 'P1',
      bidderId: 'BIDDER-006',
      bidder: 'Dynamic Flow Solutions',
      requirementId: 'REQ-005',
      requirement: 'OEM Authorization',
      clause: 'Clause 5.1',
      issue: 'Category mismatch (Water vs Refinery)',
      status: 'CONTRADICTED',
      suggestedAction: 'Review authorization',
      assignedTo: 'A. Sharma',
      dueDate: '20 Aug 2026',
      targetPath: '/tender/CPCL-2026-VALVES-7701/bidder/BIDDER-006?trigger=oem'
    },
    {
      id: 'REV-005',
      priority: 'P2',
      bidderId: 'BIDDER-004',
      bidder: 'Bidder 4 & Bidder 5',
      requirementId: 'REL-001',
      requirement: 'Bank Account Integrity',
      clause: 'Integrity Pact',
      issue: 'Shared HDFC account (XXXXX9821)',
      status: 'RELATIONSHIP',
      suggestedAction: 'Investigate link',
      assignedTo: 'R. Kumar',
      dueDate: '20 Aug 2026',
      targetPath: '/tender/CPCL-2026-VALVES-7701/network?trigger=shared_bank'
    },
    {
      id: 'REV-006',
      priority: 'P2',
      bidderId: 'BIDDER-005',
      bidder: 'Industrial Process Systems',
      requirementId: 'REL-002',
      requirement: 'Technical Proposal Similarity',
      clause: 'GTC 4.14',
      issue: '94% verbatim text match with B-04',
      status: 'RELATIONSHIP',
      suggestedAction: 'Investigate link',
      assignedTo: 'R. Kumar',
      dueDate: '20 Aug 2026',
      targetPath: '/tender/CPCL-2026-VALVES-7701/network?trigger=fingerprint'
    },
    {
      id: 'REV-007',
      priority: 'P3',
      bidderId: 'BIDDER-001',
      bidder: 'Hindustan Heavy Valves Ltd',
      requirementId: 'REQ-008',
      requirement: 'PAN & ITR Verification',
      clause: 'Clause 7.3',
      issue: 'ITR acknowledgement verified',
      status: 'RESOLVED',
      suggestedAction: 'Automated match',
      assignedTo: 'A. Sharma',
      dueDate: '18 Aug 2026',
      targetPath: '/tender/CPCL-2026-VALVES-7701/bidder/BIDDER-001'
    },
    {
      id: 'REV-008',
      priority: 'P3',
      bidderId: 'BIDDER-001',
      bidder: 'Hindustan Heavy Valves Ltd',
      requirementId: 'REQ-009',
      requirement: 'MSE Preference Eligibility',
      clause: 'Clause 8.1',
      issue: 'Udyam validated Class 1 Local',
      status: 'RESOLVED',
      suggestedAction: 'Automated match',
      assignedTo: 'A. Sharma',
      dueDate: '18 Aug 2026',
      targetPath: '/tender/CPCL-2026-VALVES-7701/bidder/BIDDER-001'
    },
    {
      id: 'REV-009',
      priority: 'P3',
      bidderId: 'BIDDER-002',
      bidder: 'Apex Process Systems Pvt Ltd',
      requirementId: 'REQ-008',
      requirement: 'PAN & ITR Compliance',
      clause: 'Clause 7.3',
      issue: 'CBDT database return match',
      status: 'RESOLVED',
      suggestedAction: 'Automated match',
      assignedTo: 'A. Sharma',
      dueDate: '18 Aug 2026',
      targetPath: '/tender/CPCL-2026-VALVES-7701/bidder/BIDDER-002'
    },
    {
      id: 'REV-010',
      priority: 'P3',
      bidderId: 'BIDDER-003',
      bidder: 'Bharat Industrial Controls',
      requirementId: 'REQ-001',
      requirement: 'Turnover Criteria (₹10 Cr)',
      clause: 'Clause 4.2',
      issue: 'Audited CA turnover ₹14.2 Cr',
      status: 'RESOLVED',
      suggestedAction: 'Automated match',
      assignedTo: 'R. Kumar',
      dueDate: '18 Aug 2026',
      targetPath: '/tender/CPCL-2026-VALVES-7701/bidder/BIDDER-003'
    },
    {
      id: 'REV-011',
      priority: 'P3',
      bidderId: 'BIDDER-004',
      bidder: 'Northern Equipment Co.',
      requirementId: 'REQ-002',
      requirement: 'Security Deposit Exemption',
      clause: 'Clause 3.1',
      issue: 'Valid NSIC registration certificate',
      status: 'RESOLVED',
      suggestedAction: 'Automated match',
      assignedTo: 'R. Kumar',
      dueDate: '18 Aug 2026',
      targetPath: '/tender/CPCL-2026-VALVES-7701/bidder/BIDDER-004'
    }
  ];

  // Action Dialog State
  const [activeItemForAction, setActiveItemForAction] = useState<ReviewQueueRow | null>(null);
  const [selectedActionType, setSelectedActionType] = useState<
    'OVERRIDE_TO_VERIFIED' | 'ACCEPT_SYSTEM_VERDICT' | 'REQUEST_CLARIFICATION' | 'RERUN_VERIFICATION'
  >('OVERRIDE_TO_VERIFIED');
  const [justificationInput, setJustificationInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  // Live overrides state
  const [overridesState, setOverridesState] = useState<Record<string, OfficerOverrideState>>({});

  // Sync with central auditService
  useEffect(() => {
    const refreshOverrides = () => {
      const map: Record<string, OfficerOverrideState> = {};
      initialItems.forEach((item) => {
        const ovr = getOfficerOverride(item.bidderId, item.requirementId);
        if (ovr) {
          map[item.id] = ovr;
        }
      });
      setOverridesState(map);
    };

    refreshOverrides();
    const unsubscribe = subscribeToAuditChanges(refreshOverrides);
    return () => unsubscribe();
  }, []);

  const handleOpenActionModal = (
    item: ReviewQueueRow,
    action: 'OVERRIDE_TO_VERIFIED' | 'ACCEPT_SYSTEM_VERDICT' | 'REQUEST_CLARIFICATION' | 'RERUN_VERIFICATION'
  ) => {
    setActiveItemForAction(item);
    setSelectedActionType(action);
    setJustificationInput('');
    setFeedbackSuccess(null);
  };

  const handleExecuteOfficerAction = async () => {
    if (!activeItemForAction) return;

    if (!justificationInput.trim() || justificationInput.trim().length < 15) {
      alert('Statutory Governance Rule: A typed justification of at least 15 characters is required. Silent overrides are prohibited under CVC guidelines.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await recordOfficerAction({
        bidderId: activeItemForAction.bidderId,
        requirementId: activeItemForAction.requirementId,
        action: selectedActionType,
        justification: justificationInput.trim(),
        officerId: 'CPCL-OFFICER-7749',
        officerName: 'A. Sharma (Procurement Officer · CPCL Manali)',
        previousVerdict: activeItemForAction.status === 'RESOLVED' ? 'VERIFIED' : activeItemForAction.status,
        newVerdict: selectedActionType === 'OVERRIDE_TO_VERIFIED' ? 'VERIFIED' : 'CONTRADICTED'
      });

      setFeedbackSuccess(`Decision committed to Tamper-Evident Hash Chain in Block #${res.auditEvent.eventIndex}`);
      setTimeout(() => {
        setActiveItemForAction(null);
        setFeedbackSuccess(null);
      }, 1200);
    } catch (err: any) {
      alert(err.message || 'Failed to record officer action.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter items
  const filteredItems = initialItems.filter((item) => {
    const isOverride = overridesState[item.id] !== undefined;
    const effectiveStatus = isOverride ? 'RESOLVED' : item.status;

    if (activeTab === 'HIGH_PRIORITY' && item.priority !== 'P1') return false;
    if (activeTab === 'PENDING' && effectiveStatus === 'RESOLVED') return false;
    if (activeTab === 'RESOLVED' && effectiveStatus !== 'RESOLVED') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.bidder.toLowerCase().includes(q) ||
        item.requirement.toLowerCase().includes(q) ||
        item.issue.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    }

    return true;
  });

  return (
    <div style={{ maxWidth: 1360, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 1. Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Officer Review Queue
          </h1>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Prioritized inbox of unresolved findings requiring formal statutory procurement officer determination.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => navigate('/tender/CPCL-2026-VALVES-7701/audit/reconstruction')}
            className="btn-secondary"
            style={{ fontSize: 11, padding: '5px 10px' }}
          >
            <RotateCcw size={13} />
            <span>Decision Reconstruction</span>
          </button>
          <div className="provenance-tag">
            STATUTORY AUTHORITY
          </div>
        </div>
      </div>

      {/* 2. Main Data Table Panel with Filter Tabs Header */}
      <div className="panel-card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Table Topbar: Search & Filter Tabs */}
        <div
          style={{
            padding: '10px 16px',
            borderBottom: '1px solid var(--border-default)',
            background: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Filter Tabs (All / High Priority / Pending / Resolved) */}
          <div className="filter-chips-row">
            {[
              { key: 'ALL', label: 'All', count: 11 },
              { key: 'HIGH_PRIORITY', label: 'High Priority', count: 4 },
              { key: 'PENDING', label: 'Pending', count: 4 },
              { key: 'RESOLVED', label: 'Resolved', count: 7 }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`filter-chip ${activeTab === tab.key ? 'filter-chip-active' : ''}`}
              >
                <span>{tab.label}</span>
                <span style={{ opacity: 0.8, fontSize: 10, fontFamily: 'var(--font-mono)' }}>({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Search box */}
          <div style={{ position: 'relative', width: 220 }}>
            <Search size={12} style={{ position: 'absolute', left: 8, top: 8, color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Filter queue items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '4px 8px 4px 26px',
                fontSize: 11,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-canvas)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Real Data Table (Columns: Priority, Bidder, Requirement, Issue, Status, Suggested Action, Assigned To, Due Date) */}
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 70 }}>Priority</th>
              <th style={{ width: 200 }}>Bidder</th>
              <th style={{ width: 170 }}>Requirement</th>
              <th>Issue</th>
              <th style={{ width: 130 }}>Status</th>
              <th style={{ width: 140 }}>Suggested Action</th>
              <th style={{ width: 100 }}>Assigned To</th>
              <th style={{ width: 90 }}>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {
              const isOverridden = overridesState[item.id] !== undefined;
              const displayStatus = isOverridden ? 'RESOLVED' : item.status;

              return (
                <tr
                  key={item.id}
                  onClick={() => handleOpenActionModal(item, 'OVERRIDE_TO_VERIFIED')}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Priority Badge */}
                  <td>
                    <span className={item.priority === 'P1' ? 'priority-tag-p1' : item.priority === 'P2' ? 'priority-tag-p2' : 'priority-tag-p3'}>
                      {item.priority}
                    </span>
                  </td>

                  {/* Bidder */}
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.bidder}
                  </td>

                  {/* Requirement */}
                  <td>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.requirement}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.clause}</div>
                  </td>

                  {/* Issue */}
                  <td style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                    {item.issue}
                  </td>

                  {/* Status Badge */}
                  <td>
                    {displayStatus === 'CONTRADICTED' && (
                      <span className="status-pill status-pill-contradicted">CONTRADICTED</span>
                    )}
                    {displayStatus === 'UNVERIFIABLE' && (
                      <span className="status-pill status-pill-unverifiable">UNVERIFIABLE</span>
                    )}
                    {displayStatus === 'RELATIONSHIP' && (
                      <span className="status-pill status-pill-relationship">RELATIONSHIP</span>
                    )}
                    {displayStatus === 'RESOLVED' && (
                      <span className="status-pill status-pill-verified">RESOLVED</span>
                    )}
                  </td>

                  {/* Suggested Action */}
                  <td>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--border-accent)' }}>
                      {item.suggestedAction} →
                    </span>
                  </td>

                  {/* Assigned To */}
                  <td style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                    {item.assignedTo}
                  </td>

                  {/* Due Date */}
                  <td style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {item.dueDate}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Officer Action Modal */}
      {activeItemForAction && (
        <div
          className="drawer-backdrop"
          onClick={() => setActiveItemForAction(null)}
          style={{ zIndex: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            className="modal-panel"
            style={{
              width: 580,
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              padding: 24,
              boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
              border: '1px solid var(--border-default)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <UserCheck size={18} color="var(--border-accent)" />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Officer Review: {activeItemForAction.requirement}
                </h3>
              </div>
              <button onClick={() => setActiveItemForAction(null)} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', fontSize: 11, marginBottom: 14 }}>
              <div>Bidder: <strong style={{ color: 'var(--text-primary)' }}>{activeItemForAction.bidder}</strong></div>
              <div style={{ marginTop: 2, color: 'var(--text-secondary)' }}>Issue: {activeItemForAction.issue}</div>
            </div>

            {/* Action Type Select */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                Statutory Determination Action:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <button
                  onClick={() => setSelectedActionType('OVERRIDE_TO_VERIFIED')}
                  className={selectedActionType === 'OVERRIDE_TO_VERIFIED' ? 'btn-primary' : 'btn-secondary'}
                  style={{ justifyContent: 'center', fontSize: 11, padding: '6px 8px' }}
                >
                  <span>Override to Verified</span>
                </button>
                <button
                  onClick={() => setSelectedActionType('ACCEPT_SYSTEM_VERDICT')}
                  className={selectedActionType === 'ACCEPT_SYSTEM_VERDICT' ? 'btn-primary' : 'btn-secondary'}
                  style={{ justifyContent: 'center', fontSize: 11, padding: '6px 8px' }}
                >
                  <span>Accept Verdict</span>
                </button>
              </div>
            </div>

            {/* Mandatory Justification */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Mandatory Statutory Justification:
                </label>
                <span style={{ fontSize: 10, color: justificationInput.length >= 15 ? 'var(--status-verified-text)' : 'var(--status-contradicted-text)' }}>
                  {justificationInput.length}/15 chars min
                </span>
              </div>
              <textarea
                autoFocus
                rows={3}
                value={justificationInput}
                onChange={(e) => setJustificationInput(e.target.value)}
                placeholder="Type statutory rationale (e.g. Physical CA certificate verified in audited JV ledger, satisfying minimum threshold under Clause 4.2)..."
                style={{
                  width: '100%',
                  padding: 8,
                  fontSize: 11,
                  fontFamily: 'var(--font-sans)',
                  border: `1px solid ${justificationInput.length >= 15 ? 'var(--border-default)' : 'var(--status-contradicted-border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-canvas)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            {feedbackSuccess && (
              <div style={{ background: 'var(--status-verified-bg)', border: '1px solid var(--status-verified-border)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', fontSize: 11, color: 'var(--status-verified-text)', marginBottom: 12 }}>
                ✓ {feedbackSuccess}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border-default)' }}>
              <button
                onClick={() => navigate(activeItemForAction.targetPath)}
                className="btn-secondary"
                style={{ fontSize: 11 }}
              >
                <span>Open Evidence Dossier</span>
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setActiveItemForAction(null)} className="btn-secondary" style={{ fontSize: 11 }}>
                  Cancel
                </button>
                <button
                  onClick={handleExecuteOfficerAction}
                  disabled={isSubmitting || justificationInput.trim().length < 15}
                  className="btn-primary"
                  style={{ fontSize: 11 }}
                >
                  <GitCommit size={13} />
                  <span>{isSubmitting ? 'Signing...' : 'Sign & Commit Decision'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
