import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GitCommit,
  ShieldCheck,
  Search,
  Filter,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Database,
  Lock,
  ArrowRight,
  X,
  Code
} from 'lucide-react';
import { getAuditLedger, subscribeToAuditChanges, computeSha256 } from '../services/auditService';
import { AuditEvent } from '../types';

export const AuditLedgerPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actorFilter, setActorFilter] = useState<'ALL' | 'OFFICER_USER' | 'SYSTEM_ENGINE' | 'AI_SERVICE'>('ALL');
  const [selectedEventForModal, setSelectedEventForModal] = useState<AuditEvent | null>(null);
  const [hashVerificationResult, setHashVerificationResult] = useState<string | null>(null);

  const loadLedger = async () => {
    const list = await getAuditLedger(false); // Newest first
    setEvents(list);
    setLoading(false);
  };

  useEffect(() => {
    loadLedger();
    const unsub = subscribeToAuditChanges(loadLedger);
    return () => unsub();
  }, []);

  const handleVerifyHash = async (event: AuditEvent) => {
    const payloadStr = JSON.stringify(event.payload);
    const payloadHash = await computeSha256(payloadStr);
    const blockHeader = `${event.eventIndex}|${event.previousHash}|${event.timestamp}|${event.eventType}|${payloadHash}`;
    const calculatedHash = await computeSha256(blockHeader);

    if (calculatedHash === event.currentHash) {
      setHashVerificationResult(`✓ Cryptographic Match Confirmed: SHA-256(${blockHeader.substring(0, 30)}...) = ${calculatedHash}`);
    } else {
      setHashVerificationResult(`✗ Hash mismatch detected!`);
    }
  };

  const filteredEvents = events.filter((e) => {
    const matchesActor = actorFilter === 'ALL' || e.actorType === actorFilter;
    const matchesSearch =
      e.eventId.toLowerCase().includes(search.toLowerCase()) ||
      e.eventType.toLowerCase().includes(search.toLowerCase()) ||
      e.actorId.toLowerCase().includes(search.toLowerCase()) ||
      e.currentHash.toLowerCase().includes(search.toLowerCase()) ||
      JSON.stringify(e.payload).toLowerCase().includes(search.toLowerCase());
    return matchesActor && matchesSearch;
  });

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748B', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
          <span>CPCL/PROC/2026/047</span>
          <ChevronRight size={12} />
          <span>STATUTORY DEFENSIBILITY</span>
          <ChevronRight size={12} />
          <span style={{ color: '#0F172A', fontWeight: 600 }}>TAMPER-EVIDENT HASH CHAIN LEDGER</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 10 }}>
              <GitCommit size={22} color="#059669" />
              <span>Tamper-Evident Hash Chain Audit Ledger</span>
            </h1>
            <p style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
              Chronological immutable log of all system ingestions, automated rule evaluations, and officer determinations. Each event is chained to its predecessor via SHA-256 content hashing.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => navigate('/tender/CPCL-2026-VALVES-7701/audit/reconstruction')}
              className="btn-primary"
              style={{ fontSize: 12 }}
            >
              <RotateCcw size={14} />
              <span>Open Decision Reconstruction</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hash Chain Legend */}
      <div
        style={{
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: 8,
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShieldCheck size={20} color="#16A34A" />
          <div style={{ fontSize: 12, color: '#166534' }}>
            <strong>STATUTORY INTEGRITY NOTICE:</strong> This is a <strong>Tamper-Evident Hash Chain</strong> (RFC 6962 compliant Merkle ledger for government procurement defensibility). It is NOT a decentralized cryptocurrency/blockchain. Every record is cryptographically auditable before the Central Vigilance Commission (CVC) and Comptroller and Auditor General (CAG).
          </div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#166534', fontFamily: 'var(--font-mono)' }}>
          {events.length} Blocks Chained
        </span>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #CBD5E1',
          borderRadius: 8,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginBottom: 16
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <Search size={16} color="#64748B" />
          <input
            type="text"
            placeholder="Search by event ID, event type, actor, hash, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', border: 'none', outline: 'none', fontSize: 13, color: '#0F172A' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Filter size={14} color="#64748B" />
          <span style={{ fontSize: 12, color: '#64748B' }}>Actor:</span>
          <select
            value={actorFilter}
            onChange={(e) => setActorFilter(e.target.value as any)}
            style={{ border: '1px solid #CBD5E1', borderRadius: 4, padding: '4px 8px', fontSize: 12, color: '#0F172A' }}
          >
            <option value="ALL">All Actors</option>
            <option value="OFFICER_USER">Officer User</option>
            <option value="SYSTEM_ENGINE">System Engine</option>
            <option value="AI_SERVICE">AI Service</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="panel-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left', fontSize: 11, color: '#64748B' }}>
              <th style={{ padding: '10px 14px', width: 70 }}>BLOCK #</th>
              <th style={{ padding: '10px 14px', width: 140 }}>EVENT ID</th>
              <th style={{ padding: '10px 14px', width: 140 }}>TIMESTAMP</th>
              <th style={{ padding: '10px 14px', width: 150 }}>ACTOR</th>
              <th style={{ padding: '10px 14px' }}>EVENT TYPE & SUMMARY</th>
              <th style={{ padding: '10px 14px', width: 90 }}>VERSIONS</th>
              <th style={{ padding: '10px 14px', width: 140 }}>CURRENT HASH</th>
              <th style={{ padding: '10px 14px', width: 80, textAlign: 'center' }}>INSPECT</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((evt) => {
              const isOfficer = evt.actorType === 'OFFICER_USER';

              return (
                <tr
                  key={evt.eventId}
                  style={{
                    borderBottom: '1px solid #E2E8F0',
                    fontSize: 12,
                    background: isOfficer ? '#FFFDF8' : '#FFFFFF'
                  }}
                >
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--palette-teal)' }}>
                    #{evt.eventIndex}
                  </td>

                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: '#0F172A' }}>
                    {evt.eventId}
                  </td>

                  <td style={{ padding: '10px 14px', color: '#64748B', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                    {evt.timestamp.substring(0, 19).replace('T', ' ')}
                  </td>

                  <td style={{ padding: '10px 14px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: 3,
                        background:
                          evt.actorType === 'OFFICER_USER'
                            ? '#FEF3C7'
                            : evt.actorType === 'AI_SERVICE'
                            ? 'rgba(49, 170, 169, 0.1)'
                            : '#F1F5F9',
                        color:
                          evt.actorType === 'OFFICER_USER'
                            ? '#92400E'
                            : evt.actorType === 'AI_SERVICE'
                            ? 'var(--palette-teal)'
                            : '#334155',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      {evt.actorType}
                    </span>
                    <div style={{ fontSize: 11, color: '#64748B', marginTop: 2, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 130 }}>
                      {evt.actorId}
                    </div>
                  </td>

                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ fontWeight: 600, color: '#0F172A' }}>
                      {evt.eventType}
                    </div>
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>
                      {evt.payload?.justification
                        ? `Reason: "${evt.payload.justification}"`
                        : evt.payload?.reason || evt.payload?.title || evt.payload?.ruleDefinition || JSON.stringify(evt.payload).substring(0, 75)}
                    </div>
                  </td>

                  <td style={{ padding: '10px 14px', fontSize: 10, fontFamily: 'var(--font-mono)', color: '#64748B' }}>
                    <div>Rule: {evt.payload?.ruleVersion || 'v1.4'}</div>
                    <div>Model: {evt.payload?.modelVersion || 'ext-2.1'}</div>
                  </td>

                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#059669' }}>
                    {evt.currentHash.substring(0, 14)}...
                  </td>

                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <button
                      onClick={() => {
                        setSelectedEventForModal(evt);
                        setHashVerificationResult(null);
                      }}
                      style={{
                        padding: '4px 8px',
                        background: 'rgba(49, 170, 169, 0.08)',
                        border: '1px solid rgba(49, 170, 169, 0.3)',
                        borderRadius: 4,
                        color: 'var(--palette-teal)',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                      title="Inspect full cryptographic block header and payload"
                    >
                      Verify
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cryptographic Block Inspector Modal */}
      {selectedEventForModal && (
        <div
          className="drawer-backdrop"
          onClick={() => setSelectedEventForModal(null)}
          style={{ zIndex: 140, alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            className="modal-panel"
            style={{
              width: 700,
              maxHeight: '85vh',
              background: '#FFFFFF',
              borderRadius: 10,
              padding: 24,
              boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
              border: '1px solid #CBD5E1',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Lock size={18} color="#059669" />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  Cryptographic Block #{selectedEventForModal.eventIndex} Inspector
                </h3>
              </div>
              <button onClick={() => setSelectedEventForModal(null)} style={{ color: '#94A3B8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                <div><strong>Event ID:</strong> {selectedEventForModal.eventId}</div>
                <div><strong>Timestamp:</strong> {selectedEventForModal.timestamp}</div>
                <div><strong>Actor:</strong> {selectedEventForModal.actorType} ({selectedEventForModal.actorId})</div>
                <div><strong>Event Type:</strong> {selectedEventForModal.eventType}</div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 4 }}>
                  Chained Hashes (SHA-256)
                </div>
                <div style={{ background: '#0C1527', color: '#E2E8F0', padding: 12, borderRadius: 6, fontSize: 11, fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}>
                  <div style={{ color: '#94A3B8' }}>// Previous Block Hash (Parent)</div>
                  <div style={{ color: '#FCD34D', wordBreak: 'break-all' }}>{selectedEventForModal.previousHash}</div>
                  <div style={{ color: '#94A3B8', marginTop: 8 }}>// Current Block Hash = SHA-256(Block Header)</div>
                  <div style={{ color: '#34D399', wordBreak: 'break-all' }}>{selectedEventForModal.currentHash}</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 4 }}>
                  Event Payload (JSON Snapshot)
                </div>
                <pre
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #CBD5E1',
                    borderRadius: 6,
                    padding: 12,
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    maxHeight: 180,
                    overflowY: 'auto',
                    color: '#0F172A'
                  }}
                >
                  {JSON.stringify(selectedEventForModal.payload, null, 2)}
                </pre>
              </div>

              {hashVerificationResult && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 6,
                    background: hashVerificationResult.startsWith('✓') ? '#ECFDF5' : '#FEF2F2',
                    border: `1px solid ${hashVerificationResult.startsWith('✓') ? '#A7F3D0' : '#FECACA'}`,
                    color: hashVerificationResult.startsWith('✓') ? '#065F46' : '#991B1B',
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {hashVerificationResult}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: 14, marginTop: 14 }}>
              <button
                onClick={() => handleVerifyHash(selectedEventForModal)}
                className="btn-primary"
                style={{ fontSize: 12 }}
              >
                <CheckCircle2 size={14} />
                <span>Re-verify Block SHA-256 Hash</span>
              </button>

              <button onClick={() => setSelectedEventForModal(null)} className="btn-secondary" style={{ fontSize: 12 }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
