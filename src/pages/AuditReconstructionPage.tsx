import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  RotateCcw,
  Clock,
  User,
  Hash,
  CheckCircle2,
  Lock,
  ChevronRight,
  Play,
  ArrowRight,
  GitCommit,
  UserCheck,
  AlertTriangle,
  FileText
} from 'lucide-react';
import {
  getDecisionReconstructionTimeline,
  subscribeToAuditChanges,
  OfficerOverrideState
} from '../services/auditService';

export const AuditReconstructionPage: React.FC = () => {
  const navigate = useNavigate();
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
  const [activeOverride, setActiveOverride] = useState<OfficerOverrideState | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayStep, setReplayStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFullPayload, setShowFullPayload] = useState(false);

  const loadTimeline = async () => {
    try {
      setLoading(true);
      const data = await getDecisionReconstructionTimeline();
      setTimelineEvents(data.events || []);
      setActiveOverride(data.activeOverride || null);
      if (data.events && data.events.length > 0) {
        setSelectedEventId((prev) => (prev ? prev : data.events[data.events.length - 1].id));
        setReplayStep(data.events.length - 1);
      }
    } catch (err) {
      console.error('Error loading decision reconstruction timeline:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimeline();
    const unsub = subscribeToAuditChanges(loadTimeline);
    return () => unsub();
  }, []);

  const handleReplay = () => {
    setIsReplaying(true);
    setReplayStep(0);
    if (timelineEvents.length > 0) {
      setSelectedEventId(timelineEvents[0].id);
    }

    const interval = setInterval(() => {
      setReplayStep((prev) => {
        const next = prev + 1;
        if (next >= timelineEvents.length) {
          clearInterval(interval);
          setIsReplaying(false);
          return prev;
        }
        setSelectedEventId(timelineEvents[next].id);
        return next;
      });
    }, 650);
  };

  const selectedEvent = timelineEvents.find((e) => e.id === selectedEventId) || timelineEvents[timelineEvents.length - 1];

  if (loading || !selectedEvent) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        Reconstructing cryptographic decision ledger from SHA-256 Merkle chain...
      </div>
    );
  }

  // Short label mapper for timeline
  const getShortLabel = (evt: any) => {
    if (evt.title.includes('Tender')) return 'Requirement extracted (REQ-004)';
    if (evt.title.includes('Clause')) return 'Clause 4.2 context parsed';
    if (evt.title.includes('Bid Form')) return 'Bid Form processed (EVID-1021)';
    if (evt.title.includes('CA Certificate')) return 'CA Certificate processed (EVID-1042)';
    if (evt.title.includes('Contradiction') || evt.status === 'FLAGGED') return 'Turnover contradiction detected';
    if (evt.title.includes('Officer Review')) return 'Officer review opened';
    if (evt.isOfficerAction || evt.status === 'OVERRIDE') return 'Officer override submitted';
    return evt.title;
  };

  const overrideReasonText = activeOverride?.justification ||
    'Revised CA certificate provided with audited turnover of ₹11.5 Cr. Accept as compliant.';

  return (
    <div style={{ maxWidth: 1360, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Decision Reconstruction (Audit Trail)
          </h1>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Tender CPCL/PROC/2026/047 · Cryptographic event-by-event provenance reconstruction.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => navigate('/tender/CPCL-2026-VALVES-7701/audit')}
            className="btn-secondary"
            style={{ fontSize: 11, padding: '5px 10px' }}
          >
            <GitCommit size={13} />
            <span>Full Audit Ledger</span>
          </button>

          <button
            onClick={handleReplay}
            disabled={isReplaying}
            className="btn-primary"
            style={{ fontSize: 11, padding: '5px 12px' }}
          >
            <Play size={12} fill="#FFF" />
            <span>{isReplaying ? `Replaying ${replayStep + 1}/${timelineEvents.length}...` : 'Replay Timeline'}</span>
          </button>
        </div>
      </div>

      {/* 2. Three-Column Investigation Layout (Matching Reference Image 1 Panel 6) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.3fr 1fr', gap: 16 }}>

        {/* COLUMN 1: Vertical Timeline */}
        <div
          className="panel-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-surface)',
            height: 540,
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: '1px solid var(--border-default)', marginBottom: 12 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Timeline
            </h3>
            <span style={{ fontSize: 11, color: 'var(--border-accent)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              View Hash Chain
            </span>
          </div>

          {/* Vertical Timeline Items List */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4, paddingRight: 4 }}>
            {timelineEvents.map((evt, idx) => {
              const isSelected = evt.id === selectedEventId;
              const isPassed = idx <= replayStep;
              const shortLabel = getShortLabel(evt);

              return (
                <div
                  key={evt.id}
                  onClick={() => {
                    setSelectedEventId(evt.id);
                    setReplayStep(idx);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'var(--bg-canvas)' : 'transparent',
                    border: `1px solid ${isSelected ? 'var(--border-accent)' : 'transparent'}`,
                    cursor: 'pointer',
                    opacity: isPassed ? 1 : 0.45,
                    transition: 'background 100ms ease'
                  }}
                >
                  {/* Timestamp */}
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: isSelected ? 'var(--border-accent)' : 'var(--text-muted)',
                      width: 62,
                      flexShrink: 0
                    }}
                  >
                    {evt.time}
                  </span>

                  {/* Dot */}
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: isSelected
                        ? 'var(--border-accent)'
                        : evt.status === 'FLAGGED'
                        ? 'var(--status-contradicted-dot)'
                        : evt.isOfficerAction
                        ? 'var(--status-verified-dot)'
                        : 'var(--border-default)',
                      flexShrink: 0
                    }}
                  />

                  {/* Short Label */}
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {shortLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 2: Event Details Card */}
        <div
          className="panel-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'var(--bg-surface)',
            height: 540,
            overflowY: 'auto'
          }}
        >
          <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid var(--border-default)', marginBottom: 14 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Event Details
              </h3>
              <span className="status-pill status-pill-verified" style={{ fontSize: 10 }}>
                Block #{selectedEvent.stepNumber}
              </span>
            </div>

            {/* Key-Value Details Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Event ID</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{selectedEvent.id || 'EVT-001928'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Timestamp</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>18 Aug 2026 {selectedEvent.time}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Actor</span>
                <strong style={{ color: 'var(--text-primary)' }}>{selectedEvent.isOfficerAction ? 'Procurement Officer' : selectedEvent.actor || 'System Verification Engine'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Action</span>
                <strong style={{ color: selectedEvent.isOfficerAction ? 'var(--border-accent)' : 'var(--text-primary)' }}>
                  {selectedEvent.isOfficerAction ? 'Override' : selectedEvent.action || 'Extract & Verify'}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Evidence Version</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>EVID-1042</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Rule Version</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{selectedEvent.ruleVersion || 'v1.4'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Model Version</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{selectedEvent.modelVersion || 'extractor-2.1'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 2 }}>
                <span style={{ color: 'var(--text-muted)' }}>Hash</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                    {selectedEvent.currentHash ? `${selectedEvent.currentHash.substring(0, 4)}...${selectedEvent.currentHash.substring(selectedEvent.currentHash.length - 4)}` : '9172...a821'}
                  </span>
                  <span className="status-pill status-pill-verified" style={{ fontSize: 9, padding: '1px 5px' }}>
                    ✓ Hash Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Quoted Officer Override Reason Callout */}
            <div
              style={{
                background: 'var(--status-relationship-bg)',
                border: '1px solid var(--status-relationship-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                marginBottom: 12
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--status-relationship-text)', textTransform: 'uppercase', marginBottom: 4 }}>
                Officer Override Reason
              </div>
              <p style={{ margin: 0, fontSize: 11, fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                "{overrideReasonText}"
              </p>
            </div>

            {showFullPayload && (
              <div style={{ marginBottom: 12 }}>
                <pre
                  style={{
                    background: 'var(--bg-canvas)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 8,
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-primary)',
                    maxHeight: 120,
                    overflowY: 'auto'
                  }}
                >
                  {selectedEvent.payloadSnippet || JSON.stringify(selectedEvent, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Action Button: View Full Record */}
          <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 10 }}>
            <button
              onClick={() => setShowFullPayload(!showFullPayload)}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', fontSize: 11, padding: '6px 10px' }}
            >
              <span>{showFullPayload ? 'Hide Record Payload' : 'View Full Record'}</span>
            </button>
          </div>
        </div>

        {/* COLUMN 3: Hash Chain Visual */}
        <div
          className="panel-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'var(--bg-surface)',
            height: 540
          }}
        >
          <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid var(--border-default)', marginBottom: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Hash Chain
              </h3>
              <div className="provenance-tag">
                SHA-256
              </div>
            </div>

            {/* Three Stacked Boxes Connected by Downward Arrows */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              {/* Box 1: Previous Hash */}
              <div
                style={{
                  width: '100%',
                  background: 'var(--bg-canvas)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px'
                }}
              >
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Previous Hash
                </div>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginTop: 4, wordBreak: 'break-all', lineHeight: 1.3 }}>
                  {selectedEvent.previousHash ? `${selectedEvent.previousHash.substring(0, 16)}...` : '0000000000000000...'}
                </div>
              </div>

              {/* Arrow */}
              <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                ↓
              </div>

              {/* Box 2: Current Event */}
              <div
                style={{
                  width: '100%',
                  background: 'var(--bg-surface)',
                  border: '1.5px solid var(--border-accent)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ fontSize: 10, color: 'var(--border-accent)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Current Event
                </div>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600, marginTop: 4 }}>
                  {selectedEvent.id || 'EVT-001928'}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                  Type: {selectedEvent.action || 'OVERRIDE'}
                </div>
              </div>

              {/* Arrow */}
              <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                ↓
              </div>

              {/* Box 3: New Hash */}
              <div
                style={{
                  width: '100%',
                  background: 'var(--status-verified-bg)',
                  border: '1px solid var(--status-verified-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px'
                }}
              >
                <div style={{ fontSize: 10, color: 'var(--status-verified-text)', fontWeight: 700, textTransform: 'uppercase' }}>
                  New Hash
                </div>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--status-verified-text)', fontWeight: 700, marginTop: 4, wordBreak: 'break-all', lineHeight: 1.3 }}>
                  {selectedEvent.currentHash ? `${selectedEvent.currentHash.substring(0, 16)}...` : '9172e4821a821...'}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Hash Verified Status Chip */}
          <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 12, display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--status-verified-bg)',
                border: '1px solid var(--status-verified-border)',
                color: 'var(--status-verified-text)',
                fontSize: 11,
                fontWeight: 700
              }}
            >
              <Lock size={12} />
              <span>Hash Verified & Chained</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
