import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sliders,
  ChevronDown,
  ChevronUp,
  Sparkles,
  AlertTriangle,
  Clock,
  Network,
  Shield,
  Activity,
  RotateCcw,
  Compass,
  Layers,
  TrendingUp,
  Lock,
  X,
  Keyboard,
  Info
} from 'lucide-react';
import { DEMO_SCENARIOS } from '../../services/scenarioEngine';
import { ADAPTER_FAULT_STATE } from '../../adapters/governmentAdapters';

interface DemoControlPanelProps {
  isPresenterModeActive: boolean;
  onTogglePresenterMode: () => void;
  onStartGuidedDemo: () => void;
  onOpenWhyThisMatters: () => void;
  onOpenImpactModal: () => void;
  onOpenPsCoverage: () => void;
}

export const DemoControlPanel: React.FC<DemoControlPanelProps> = ({
  isPresenterModeActive,
  onTogglePresenterMode,
  onStartGuidedDemo,
  onOpenWhyThisMatters,
  onOpenImpactModal,
  onOpenPsCoverage
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastTriggeredScenario, setLastTriggeredScenario] = useState<string | null>(null);

  const handleTriggerScenario = (scenarioKey: string) => {
    const scenario = DEMO_SCENARIOS[scenarioKey];
    if (!scenario) return;

    setLastTriggeredScenario(scenario.shortLabel);

    if (scenarioKey === 'source_unavailable') {
      ADAPTER_FAULT_STATE.forceGstTimeout = true;
    }

    navigate(scenario.targetPath);
  };

  // If presenter mode is completely disabled and not expanded, render nothing or small discreet pill
  if (!isPresenterModeActive) {
    return (
      <div style={{ position: 'fixed', bottom: 12, right: 12, zIndex: 90 }}>
        <button
          onClick={onTogglePresenterMode}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 10px',
            background: 'rgba(12, 21, 39, 0.85)',
            border: '1px solid #1E2D4A',
            borderRadius: 20,
            color: '#94A3B8',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'all 150ms'
          }}
          title="Press 'P' or click to enable Presenter Mode & Demo Controls"
        >
          <Sliders size={12} color="#60A5FA" />
          <span>Presenter Mode (Press 'P')</span>
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 64,
        right: 20,
        zIndex: 95,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 8
      }}
    >
      {/* Top Toggle Strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#0C1527',
          border: '1px solid #1E2D4A',
          borderRadius: 8,
          padding: '6px 12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
          color: '#FFFFFF'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#60A5FA', letterSpacing: '0.04em' }}>
            PRESENTER CONTROL
          </span>
        </div>

        {lastTriggeredScenario && (
          <span
            style={{
              fontSize: 10,
              padding: '2px 6px',
              borderRadius: 3,
              background: '#1E293B',
              border: '1px solid #334155',
              color: '#F8FAFC',
              fontFamily: 'var(--font-mono)'
            }}
          >
            Last: {lastTriggeredScenario}
          </span>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            background: '#1A2849',
            border: '1px solid #334155',
            padding: '3px 8px',
            borderRadius: 4,
            color: '#FFFFFF',
            fontSize: 11,
            cursor: 'pointer'
          }}
        >
          <span>{isExpanded ? 'Hide Panel' : 'Scenarios & Tools'}</span>
          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        <button
          onClick={onTogglePresenterMode}
          style={{
            background: 'transparent',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: 2
          }}
          title="Exit Presenter Mode"
        >
          <X size={14} />
        </button>
      </div>

      {/* Expanded Control Box */}
      {isExpanded && (
        <div
          style={{
            width: 440,
            background: '#0C1527',
            border: '1px solid #1E2D4A',
            borderRadius: 10,
            boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
            color: '#FFFFFF',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            animation: 'fadeIn 150ms ease-out'
          }}
        >
          {/* Quick Jury Scenario Triggers */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Deterministic Scenario Triggers
              </span>
              <span style={{ fontSize: 10, color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                Direct State Jump
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {/* Trigger 1: Turnover Contradiction */}
              <button
                onClick={() => handleTriggerScenario('turnover_contradiction')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 10px',
                  background: '#1E293B',
                  border: '1px solid #DC2626',
                  borderRadius: 6,
                  color: '#FECACA',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                title="Bidder 2: ₹12 Cr declared vs ₹9 Cr CA certified"
              >
                <AlertTriangle size={14} color="#EF4444" style={{ flexShrink: 0 }} />
                <span>Turnover Contradiction</span>
              </button>

              {/* Trigger 2: Udyam Staleness */}
              <button
                onClick={() => handleTriggerScenario('stale_udyam')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 10px',
                  background: '#1E293B',
                  border: '1px solid #D97706',
                  borderRadius: 6,
                  color: '#FDE68A',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                title="Bidder 3: Udyam cancelled on registry 31/08/2026"
              >
                <Clock size={14} color="#F59E0B" style={{ flexShrink: 0 }} />
                <span>Udyam Staleness</span>
              </button>

              {/* Trigger 3: Reveal Bidder Relationship */}
              <button
                onClick={() => handleTriggerScenario('shared_bank')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 10px',
                  background: '#1E293B',
                  border: '1px solid #7C3AED',
                  borderRadius: 6,
                  color: '#DDD6FE',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                title="Bidder 4 ↔ 5: Shared HDFC Bank Account 50200088991122"
              >
                <Network size={14} color="#A78BFA" style={{ flexShrink: 0 }} />
                <span>Bidder Relationship</span>
              </button>

              {/* Trigger 4: Simulate GST Outage */}
              <button
                onClick={() => handleTriggerScenario('source_unavailable')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 10px',
                  background: '#1E293B',
                  border: '1px solid #2563EB',
                  borderRadius: 6,
                  color: '#BFDBFE',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                title="Simulates GST 504 Timeout and UNVERIFIABLE cascade"
              >
                <Activity size={14} color="#60A5FA" style={{ flexShrink: 0 }} />
                <span>Simulate GST Outage</span>
              </button>

              {/* Trigger 5: Run Security Test */}
              <button
                onClick={() => handleTriggerScenario('prompt_injection')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 10px',
                  background: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: 6,
                  color: '#E2E8F0',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                title="Screens adversarial prompt instruction inside PDF metadata"
              >
                <Lock size={14} color="#94A3B8" style={{ flexShrink: 0 }} />
                <span>Run Security Test</span>
              </button>

              {/* Trigger 6: Open Decision Reconstruction */}
              <button
                onClick={() => handleTriggerScenario('decision_reconstruction')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 10px',
                  background: '#1E293B',
                  border: '1px solid #10B981',
                  borderRadius: 6,
                  color: '#A7F3D0',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                title="Replay SHA-256 Merkle chain timeline"
              >
                <RotateCcw size={14} color="#34D399" style={{ flexShrink: 0 }} />
                <span>Decision Reconstruction</span>
              </button>
            </div>
          </div>

          {/* Institutional Presentation & Jury Tools */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              SIH Jury Defense Tooling
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              <button
                onClick={onStartGuidedDemo}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 10px',
                  background: '#2563EB',
                  border: '1px solid #3B82F6',
                  borderRadius: 6,
                  color: '#FFFFFF',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Compass size={14} />
                <span>Start Guided Demo</span>
              </button>

              <button
                onClick={onOpenWhyThisMatters}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 10px',
                  background: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: 6,
                  color: '#E2E8F0',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Info size={14} color="#60A5FA" />
                <span>Why This Matters</span>
              </button>

              <button
                onClick={onOpenImpactModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 10px',
                  background: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: 6,
                  color: '#E2E8F0',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <TrendingUp size={14} color="#10B981" />
                <span>Impact Simulation</span>
              </button>

              <button
                onClick={onOpenPsCoverage}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 10px',
                  background: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: 6,
                  color: '#E2E8F0',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Layers size={14} color="#F59E0B" />
                <span>SIH Scope Matrix</span>
              </button>
            </div>
          </div>

          {/* Keyboard Shortcuts Reference */}
          <div style={{ background: '#101B33', borderRadius: 6, padding: '8px 10px', border: '1px solid #1E2D4A' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, color: '#8496B3', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>
              <Keyboard size={12} />
              <span>Presenter Live Hotkeys</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, fontSize: 10, fontFamily: 'var(--font-mono)', color: '#CBD5E1' }}>
              <div><kbd style={{ background: '#1E293B', padding: '1px 5px', borderRadius: 3, border: '1px solid #334155', color: '#60A5FA' }}>1</kbd> Tender Overview</div>
              <div><kbd style={{ background: '#1E293B', padding: '1px 5px', borderRadius: 3, border: '1px solid #334155', color: '#60A5FA' }}>2</kbd> Turnover Contradiction</div>
              <div><kbd style={{ background: '#1E293B', padding: '1px 5px', borderRadius: 3, border: '1px solid #334155', color: '#60A5FA' }}>3</kbd> Network Graph</div>
              <div><kbd style={{ background: '#1E293B', padding: '1px 5px', borderRadius: 3, border: '1px solid #334155', color: '#60A5FA' }}>4</kbd> Udyam Freshness</div>
              <div><kbd style={{ background: '#1E293B', padding: '1px 5px', borderRadius: 3, border: '1px solid #334155', color: '#60A5FA' }}>5</kbd> GST Outage</div>
              <div><kbd style={{ background: '#1E293B', padding: '1px 5px', borderRadius: 3, border: '1px solid #334155', color: '#60A5FA' }}>6</kbd> Decision Recon</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
