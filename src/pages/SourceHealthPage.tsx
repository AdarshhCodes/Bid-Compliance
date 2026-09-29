import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Shield,
  Zap,
  Building,
  FileCheck,
  Send,
  Database,
  Cpu,
  Layers,
  Lock,
  Search,
  Server
} from 'lucide-react';
import { ADAPTER_FAULT_STATE, verifyGST } from '../adapters/governmentAdapters';

export const SourceHealthPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Outage simulation state
  const [gstTimeoutActive, setGstTimeoutActive] = useState<boolean>(ADAPTER_FAULT_STATE.forceGstTimeout);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [retryResult, setRetryResult] = useState<string | null>(null);
  const [clarificationSent, setClarificationSent] = useState<boolean>(false);

  // Handle trigger query params
  useEffect(() => {
    const trigger = searchParams.get('trigger');
    if (trigger === 'gst_outage') {
      ADAPTER_FAULT_STATE.forceGstTimeout = true;
      setGstTimeoutActive(true);
    }
  }, [searchParams]);

  const toggleGstTimeout = () => {
    const newState = !gstTimeoutActive;
    ADAPTER_FAULT_STATE.forceGstTimeout = newState;
    setGstTimeoutActive(newState);
    setRetryResult(null);
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryResult(null);
    try {
      const res = await verifyGST('36AAACD9900N1Z1');
      if (res.status === 'UNAVAILABLE') {
        setRetryResult('Retry attempt returned 504 Gateway Timeout. External server remains unreachable.');
      } else {
        setRetryResult('Retry successful. Registry connection re-established.');
      }
    } finally {
      setIsRetrying(false);
    }
  };

  const handleClarification = () => {
    setClarificationSent(true);
    setTimeout(() => {
      alert("Clarification Notice Dispatched via GeM Portal to Eastern Process Equipments (Bidder 7):\n'GSTIN verification failed due to registry gateway timeout. Please submit latest GSTR-3B return filing acknowledgment within 48 hours.'");
    }, 80);
  };

  const governmentSources = [
    {
      id: 'GST',
      name: 'GST (Mock Adapter)',
      fullName: 'GSTN Gateway API',
      status: gstTimeoutActive ? 'UNAVAILABLE' : 'AVAILABLE',
      latency: gstTimeoutActive ? '5,024ms' : '280ms',
      lastChecked: '18 Aug 2026, 10:25:14',
      reason: 'Gateway timeout (504 NIC-GSTN-TXN)',
      impact: 'Requirement cannot be verified (REQ-007 falls to UNVERIFIABLE)'
    },
    {
      id: 'UDYAM',
      name: 'Udyam (Mock Adapter)',
      fullName: 'Udyam MSME Registry',
      status: 'AVAILABLE',
      latency: '310ms',
      lastChecked: '18 Aug 2026, 10:29:42'
    },
    {
      id: 'MCA21',
      name: 'MCA21 (Mock Adapter)',
      fullName: 'MCA21 Master Company Data',
      status: 'AVAILABLE',
      latency: '420ms',
      lastChecked: '18 Aug 2026, 10:27:18'
    },
    {
      id: 'EPFO',
      name: 'EPFO (Mock Adapter)',
      fullName: 'EPFO Shram Suvidha Portal',
      status: 'AVAILABLE',
      latency: '350ms',
      lastChecked: '18 Aug 2026, 10:25:01'
    },
    {
      id: 'DIGILOCKER',
      name: 'DigiLocker (Mock Adapter)',
      fullName: 'DigiLocker Authority Gateway',
      status: 'AVAILABLE',
      latency: '1.2s',
      lastChecked: '18 Aug 2026, 10:22:15'
    },
    {
      id: 'BLACKLIST',
      name: 'Blacklist Registry (Mock Adapter)',
      fullName: 'CPPP & GeM Debarment Feed',
      status: 'AVAILABLE',
      latency: '210ms',
      lastChecked: '18 Aug 2026, 10:20:00'
    }
  ];

  const systemComponents = [
    {
      name: 'AI Extraction Engine (Mock Adapter)',
      tech: 'LayoutLMv3 + Bounding Box Pipeline',
      status: 'AVAILABLE',
      latency: '310ms',
      detail: 'Confidence threshold ≥ 85.0%'
    },
    {
      name: 'Deterministic Verification Rules',
      tech: 'Pure Deterministic Python Predicates',
      status: 'AVAILABLE',
      latency: '4ms',
      detail: 'Arithmetic & threshold evaluation (Zero LLM math)'
    },
    {
      name: 'Cryptographic Hash Chain Engine',
      tech: 'SHA-256 Merkle Chained Ledger',
      status: 'AVAILABLE',
      latency: '8ms',
      detail: 'Chained Block #14 verified authentic'
    },
    {
      name: 'Prompt Injection Defense Sandbox',
      tech: 'Untrusted Data Isolation Layer',
      status: 'AVAILABLE',
      latency: '2ms',
      detail: 'Zero code execution on extracted text'
    },
    {
      name: 'GeM Clarification Notice Dispatcher',
      tech: 'Government e-Marketplace API Bridge',
      status: 'AVAILABLE',
      latency: '140ms',
      detail: 'Formal statutory notification channel'
    },
    {
      name: 'Entity Resolution & Relationship Engine',
      tech: 'Cross-Bidder Graph Intelligence',
      status: 'AVAILABLE',
      latency: '18ms',
      detail: '7-bidder network topology analysis'
    }
  ];

  return (
    <div style={{ maxWidth: 1360, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Source Health & System Status
          </h1>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Real-time status of government statutory registry connectors and core ANVESHA system components.
          </div>
        </div>

        {/* Live Simulation Control Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={toggleGstTimeout}
            className={gstTimeoutActive ? 'btn-secondary' : 'btn-primary'}
            style={{ fontSize: 11, padding: '6px 12px' }}
          >
            <Zap size={13} />
            <span>{gstTimeoutActive ? 'Restore GST Gateway Connection' : 'Simulate GST Outage (Bidder 7)'}</span>
          </button>
          <div className="provenance-tag">
            FAIL-SAFE V2
          </div>
        </div>
      </div>

      {/* 2. Institutional Notice Banner */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 11
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={15} color="var(--border-accent)" />
          <span style={{ color: 'var(--text-primary)' }}>
            <strong>Graceful Degradation Standard:</strong> When external government sources time out or return errors, ANVESHA assigns <strong>UNVERIFIABLE</strong>. Never converts uncertainty into an automated false pass or fail.
          </span>
        </div>
        <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>GFR Rule 144 Compliant</span>
      </div>

      {/* 3. Two Side-by-Side Lists (Government Sources & System Components) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* LIST 1: Government Sources */}
        <div
          className="panel-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: '1px solid var(--border-default)', marginBottom: 12 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Government Sources
            </h3>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              6 External Connectors
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {governmentSources.map((source) => {
              const isUnavailable = source.status === 'UNAVAILABLE';

              return (
                <div
                  key={source.id}
                  style={{
                    border: `1px solid ${isUnavailable ? 'var(--status-contradicted-border)' : 'var(--border-default)'}`,
                    borderRadius: 'var(--radius-sm)',
                    background: isUnavailable ? 'var(--status-contradicted-bg)' : 'var(--bg-canvas)',
                    padding: '10px 12px',
                    transition: 'border 120ms ease'
                  }}
                >
                  {/* Top Row: Name, Status Pill, Latency */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Building size={14} color={isUnavailable ? 'var(--status-contradicted-text)' : 'var(--border-accent)'} />
                      <strong style={{ fontSize: 12, color: 'var(--text-primary)' }}>
                        {source.name}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: isUnavailable ? 'var(--status-contradicted-text)' : 'var(--text-muted)' }}>
                        {source.latency}
                      </span>
                      <span
                        className={isUnavailable ? 'status-pill status-pill-contradicted' : 'status-pill status-pill-verified'}
                        style={{ fontSize: 10, padding: '2px 8px' }}
                      >
                        {isUnavailable ? 'Unavailable' : 'Available'}
                      </span>
                    </div>
                  </div>

                  {/* Inline Expanded Details for UNAVAILABLE Source */}
                  {isUnavailable && (
                    <div
                      style={{
                        marginTop: 10,
                        paddingTop: 10,
                        borderTop: '1px dashed var(--status-contradicted-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        fontSize: 11
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Reason:</span>
                        <strong style={{ color: 'var(--status-contradicted-text)' }}>{source.reason}</strong>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Last Checked:</span>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{source.lastChecked}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Impact:</span>
                        <strong style={{ color: 'var(--status-unverifiable-text)' }}>{source.impact}</strong>
                      </div>

                      {/* Next Action Buttons */}
                      <div style={{ display: 'flex', gap: 8, marginTop: 6, paddingTop: 6, borderTop: '1px solid var(--border-subtle)' }}>
                        <button
                          onClick={handleRetry}
                          disabled={isRetrying}
                          className="btn-primary"
                          style={{ fontSize: 11, padding: '4px 10px', flex: 1, justifyContent: 'center' }}
                        >
                          <RefreshCw size={11} className={isRetrying ? 'spin' : ''} />
                          <span>{isRetrying ? 'Retrying...' : 'Retry Verification'}</span>
                        </button>
                        <button
                          onClick={handleClarification}
                          className="btn-secondary"
                          style={{ fontSize: 11, padding: '4px 10px', flex: 1, justifyContent: 'center' }}
                        >
                          <Send size={11} />
                          <span>{clarificationSent ? 'Clarification Sent' : 'Request Clarification'}</span>
                        </button>
                      </div>

                      {retryResult && (
                        <div style={{ marginTop: 4, padding: '4px 8px', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', fontSize: 10, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                          ℹ {retryResult}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* LIST 2: System Components */}
        <div
          className="panel-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: '1px solid var(--border-default)', marginBottom: 12 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              System Components
            </h3>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Core ANVESHA Services
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {systemComponents.map((comp, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-canvas)',
                  padding: '10px 12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Server size={14} color="var(--border-accent)" />
                    <div>
                      <strong style={{ fontSize: 12, color: 'var(--text-primary)' }}>
                        {comp.name}
                      </strong>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>
                        {comp.tech}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {comp.latency}
                    </span>
                    <span className="status-pill status-pill-verified" style={{ fontSize: 10, padding: '2px 8px' }}>
                      Available
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: 6, fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  • {comp.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
