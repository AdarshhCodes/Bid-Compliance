import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  X,
  Play,
  CheckCircle2,
  Compass,
  Sparkles,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export interface DemoStep {
  stepNumber: number;
  title: string;
  badge: 'OVERVIEW' | 'CONTRADICTION' | 'PROVENANCE' | 'NETWORK' | 'SIMILARITY' | 'STALENESS' | 'RESILIENCE' | 'OVERRIDE' | 'AUDIT';
  badgeColor: string;
  path: string;
  pitch: string;
  actionHint: string;
}

export const GUIDED_STEPS: DemoStep[] = [
  {
    stepNumber: 1,
    title: 'Command Centre & Triage Queue',
    badge: 'OVERVIEW',
    badgeColor: '#2563EB',
    path: '/tender',
    pitch: 'ANVESHA gives the CPCL officer a unified operational cockpit: 7 bidders, 48 requirements, 196 evidence objects, and priority-ranked Attention Queue.',
    actionHint: 'Notice the 7-step evidence flow and AN-001 at the top of the attention queue.'
  },
  {
    stepNumber: 2,
    title: 'Bidder 2: Turnover Contradiction',
    badge: 'CONTRADICTION',
    badgeColor: '#DC2626',
    path: '/tender/CPCL-2026-VALVES-7701/bidder/BIDDER-002?trigger=turnover',
    pitch: 'AI identified a ₹3.00 Cr discrepancy: Bidder declared ₹12 Cr in cover letter, but CA certified ₹9 Cr (failing the ₹10 Cr mandatory cutoff).',
    actionHint: 'Click "Review →" on Requirement 1 to inspect the conflicting claims.'
  },
  {
    stepNumber: 3,
    title: 'Split-Screen Evidence Trace',
    badge: 'PROVENANCE',
    badgeColor: '#059669',
    path: '/tender/CPCL-2026-VALVES-7701/bidder/BIDDER-002?trigger=turnover',
    pitch: 'Every claim is anchored to exact document pages, bounding boxes, and CA UDIN 24089123AAAAA. No ungrounded conclusions.',
    actionHint: 'Inspect the 3-pane split screen: Clause on Left, Conflicting Claims Middle, Decision on Right.'
  },
  {
    stepNumber: 4,
    title: 'Visual Provenance Pipeline',
    badge: 'PROVENANCE',
    badgeColor: '#059669',
    path: '/tender/CPCL-2026-VALVES-7701/bidder/BIDDER-002?trigger=turnover',
    pitch: 'Notice the 4-stage pipeline at the bottom: Raw PDF → OCR Extraction → LayoutLM Grounding → Deterministic Python Verification Rule.',
    actionHint: 'Observe the distinction: AI extracts coordinates, deterministic Python rule computes math.'
  },
  {
    stepNumber: 5,
    title: 'Network Intelligence: Shared Bank',
    badge: 'NETWORK',
    badgeColor: '#7C3AED',
    path: '/tender/CPCL-2026-VALVES-7701/network?trigger=shared_bank',
    pitch: 'ANVESHA investigates the tender as an interconnected network. Bidders 4 and 5 share an identical HDFC corporate account (50200088991122).',
    actionHint: 'Click the purple edge between Bidder 4 and 5 to open the Relationship Inspector.'
  },
  {
    stepNumber: 6,
    title: 'Document Boilerplate & Typo Fingerprint',
    badge: 'SIMILARITY',
    badgeColor: '#7C3AED',
    path: '/tender/CPCL-2026-VALVES-7701/network?trigger=fingerprint',
    pitch: 'Beyond shared banking, technical proposals share 94.2% cosine text similarity and an identical unique typo: "hydrolic pressure test".',
    actionHint: 'Click "Launch Fingerprint Comparison" to see verbatim side-by-side text diff.'
  },
  {
    stepNumber: 7,
    title: 'Bidder 3: Udyam Temporal Staleness',
    badge: 'STALENESS',
    badgeColor: '#D97706',
    path: '/tender/CPCL-2026-VALVES-7701/bidder/BIDDER-003?trigger=udyam',
    pitch: 'Bidder submitted an internally valid Udyam PDF, but external registry confirms registration was cancelled on 31/08/2026 before bid closing.',
    actionHint: 'Notice how registry temporal validation catches certificates revoked after printing.'
  },
  {
    stepNumber: 8,
    title: 'Bidder 7: GST Outage & Graceful Degradation',
    badge: 'RESILIENCE',
    badgeColor: '#D97706',
    path: '/tender/CPCL-2026-VALVES-7701/source-health?trigger=gst_outage',
    pitch: 'When the NIC GST portal returns 504 Gateway Timeout, ANVESHA marks the check UNVERIFIABLE rather than guessing or fabricating.',
    actionHint: 'Notice the circuit breaker tripping and the officer action [Use Existing Offline Filing].'
  },
  {
    stepNumber: 9,
    title: 'Officer Review & Reasoned Override',
    badge: 'OVERRIDE',
    badgeColor: '#2563EB',
    path: '/tender/CPCL-2026-VALVES-7701/review-queue',
    pitch: 'The statutory officer retains final decision authority. Any override requires entering a mandatory formal justification.',
    actionHint: 'Notice the review queue ranked by Uncertainty × Materiality and the override sign-off.'
  },
  {
    stepNumber: 10,
    title: 'Decision Reconstruction & SHA-256 Merkle Chain',
    badge: 'AUDIT',
    badgeColor: '#0F172A',
    path: '/tender/CPCL-2026-VALVES-7701/audit/reconstruction',
    pitch: 'Every fact, check, and officer action is hashed into an immutable Merkle ledger for total statutory defensibility before CVC / CAG.',
    actionHint: 'Press Play on the reconstruction timeline to replay the tender decision chronologically.'
  }
];

interface GuidedDemoBarProps {
  currentStepIndex: number;
  onSetStepIndex: (idx: number) => void;
  onExitGuidedDemo: () => void;
}

export const GuidedDemoBar: React.FC<GuidedDemoBarProps> = ({
  currentStepIndex,
  onSetStepIndex,
  onExitGuidedDemo
}) => {
  const navigate = useNavigate();
  const step = GUIDED_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < GUIDED_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      onSetStepIndex(nextIdx);
      navigate(GUIDED_STEPS[nextIdx].path);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      onSetStepIndex(prevIdx);
      navigate(GUIDED_STEPS[prevIdx].path);
    }
  };

  const handleJump = (idx: number) => {
    onSetStepIndex(idx);
    navigate(GUIDED_STEPS[idx].path);
  };

  return (
    <aside
      aria-label="Guided Demo Control Bar"
      style={{
        position: 'fixed',
        bottom: 16,
        left: 'calc(var(--sidebar-width) + 20px)',
        right: 20,
        zIndex: 100,
        background: '#0C1527',
        border: '1px solid #1E2D4A',
        borderRadius: 10,
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
        color: '#FFFFFF',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        animation: 'slideUp 200ms ease-out'
      }}
    >
      {/* Left: Step Info & Narrative */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            borderRadius: 8,
            background: '#1A2849',
            border: '1px solid #3B82F6',
            color: '#60A5FA',
            fontWeight: 800,
            fontSize: 14,
            flexShrink: 0
          }}
        >
          {step.stepNumber}
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: 3,
                background: step.badgeColor,
                color: '#FFFFFF',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {step.badge}
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>
              Step {step.stepNumber} of {GUIDED_STEPS.length}: {step.title}
            </span>
          </div>
          <div style={{ fontSize: 11, color: '#CBD5E1', lineHeight: 1.4, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <strong>Jury Talk:</strong> {step.pitch}
          </div>
        </div>
      </div>

      {/* Center: Step Dots (Quick Jump) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {GUIDED_STEPS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleJump(idx)}
            style={{
              width: idx === currentStepIndex ? 18 : 8,
              height: 8,
              borderRadius: 4,
              background: idx === currentStepIndex ? '#3B82F6' : idx < currentStepIndex ? '#10B981' : '#334155',
              cursor: 'pointer',
              transition: 'all 150ms'
            }}
            title={`Step ${s.stepNumber}: ${s.title}`}
          />
        ))}
      </div>

      {/* Right: Controls & Opt-out */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <button
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '6px 12px',
            borderRadius: 6,
            background: currentStepIndex === 0 ? '#1E293B' : '#1A2849',
            border: '1px solid #334155',
            color: currentStepIndex === 0 ? '#64748B' : '#E2E8F0',
            fontSize: 12,
            fontWeight: 600,
            cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          <ArrowLeft size={13} />
          <span>Prev</span>
        </button>

        <button
          onClick={handleNext}
          disabled={currentStepIndex === GUIDED_STEPS.length - 1}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 6,
            background: '#2563EB',
            border: '1px solid #3B82F6',
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: 700,
            cursor: currentStepIndex === GUIDED_STEPS.length - 1 ? 'not-allowed' : 'pointer'
          }}
        >
          <span>Next Step</span>
          <ArrowRight size={13} />
        </button>

        <div style={{ width: 1, height: 24, background: '#334155', margin: '0 4px' }} />

        {/* Explore Freely (Opt-out, never forced) */}
        <button
          onClick={onExitGuidedDemo}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '6px 10px',
            borderRadius: 6,
            background: 'transparent',
            border: '1px solid #334155',
            color: '#94A3B8',
            fontSize: 11,
            cursor: 'pointer'
          }}
          title="Exit guided sequence and explore freely"
        >
          <X size={13} />
          <span>Explore Freely</span>
        </button>
      </div>
    </aside>
  );
};
