import React from 'react';
import {
  FileText,
  Shield,
  Layers,
  Sparkles,
  Cpu,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { VerdictState } from '../../types';

export interface ChainNode {
  id: string;
  stepNumber: number;
  label: string;
  sublabel: string;
  type: 'CLAUSE' | 'REQUIREMENT' | 'DOCUMENT' | 'AI_EXTRACTION' | 'RULE_ENGINE' | 'CONTRADICTION' | 'OFFICER_REVIEW';
  status?: 'COMPLETED' | 'FLAGGED' | 'PENDING' | 'PASS';
  detailPayload?: any;
}

interface EvidenceChainProps {
  verdict: VerdictState;
  chainNodes?: ChainNode[];
  onSelectNode?: (node: ChainNode) => void;
  selectedNodeId?: string;
}

export const EvidenceChain: React.FC<EvidenceChainProps> = ({
  verdict,
  chainNodes,
  onSelectNode,
  selectedNodeId
}) => {
  // Default generic 8-step provenance chain matching Phase 2 specification
  const defaultNodes: ChainNode[] = [
    {
      id: 'node-1',
      stepNumber: 1,
      label: 'Clause 4.2',
      sublabel: 'Tender Mandatory Spec',
      type: 'CLAUSE',
      status: 'PASS'
    },
    {
      id: 'node-2',
      stepNumber: 2,
      label: 'REQ-001',
      sublabel: 'Turnover ≥ ₹10 Cr',
      type: 'REQUIREMENT',
      status: 'PASS'
    },
    {
      id: 'node-3',
      stepNumber: 3,
      label: 'Bid Cover Form',
      sublabel: 'Declared ₹12.00 Cr',
      type: 'DOCUMENT',
      status: 'PASS'
    },
    {
      id: 'node-4',
      stepNumber: 4,
      label: 'CA Certificate',
      sublabel: 'Certified ₹9.00 Cr',
      type: 'DOCUMENT',
      status: 'FLAGGED'
    },
    {
      id: 'node-5',
      stepNumber: 5,
      label: 'AI Token Extraction',
      sublabel: 'Confidence 98.2%',
      type: 'AI_EXTRACTION',
      status: 'PASS'
    },
    {
      id: 'node-6',
      stepNumber: 6,
      label: 'Comparison Rule v1.4',
      sublabel: 'Deterministic Predicate',
      type: 'RULE_ENGINE',
      status: 'FLAGGED'
    },
    {
      id: 'node-7',
      stepNumber: 7,
      label: 'Contradiction CTR-001',
      sublabel: 'Discrepancy: ₹3.0 Cr',
      type: 'CONTRADICTION',
      status: 'FLAGGED'
    },
    {
      id: 'node-8',
      stepNumber: 8,
      label: 'Officer Review',
      sublabel: 'Statutory Authority',
      type: 'OFFICER_REVIEW',
      status: 'PENDING'
    }
  ];

  const nodes = chainNodes || defaultNodes;

  const getNodeIcon = (type: ChainNode['type'], status?: ChainNode['status']) => {
    switch (type) {
      case 'CLAUSE':
        return <FileText size={14} />;
      case 'REQUIREMENT':
        return <Shield size={14} />;
      case 'DOCUMENT':
        return <FileText size={14} />;
      case 'AI_EXTRACTION':
        return <Sparkles size={14} />;
      case 'RULE_ENGINE':
        return <Cpu size={14} />;
      case 'CONTRADICTION':
        return <AlertTriangle size={14} />;
      case 'OFFICER_REVIEW':
        return <UserCheck size={14} />;
      default:
        return <Layers size={14} />;
    }
  };

  const getNodeColors = (type: ChainNode['type'], status?: ChainNode['status']) => {
    if (status === 'FLAGGED') {
      return {
        bg: 'var(--status-contradicted-bg)',
        border: 'var(--status-contradicted-border)',
        text: 'var(--status-contradicted-text)',
        iconBg: 'var(--palette-crimson)',
        iconColor: '#FFFFFF'
      };
    }
    if (type === 'AI_EXTRACTION') {
      return {
        bg: 'rgba(49, 170, 169, 0.08)',
        border: 'rgba(49, 170, 169, 0.3)',
        text: '#165E5D',
        iconBg: 'var(--palette-teal)',
        iconColor: '#FFFFFF'
      };
    }
    if (type === 'RULE_ENGINE') {
      return {
        bg: 'var(--status-relationship-bg)',
        border: 'var(--status-relationship-border)',
        text: 'var(--status-relationship-text)',
        iconBg: 'var(--palette-maroon)',
        iconColor: '#FFFFFF'
      };
    }
    return {
      bg: 'var(--bg-surface)',
      border: 'var(--border-default)',
      text: 'var(--text-primary)',
      iconBg: 'var(--bg-subtle)',
      iconColor: 'var(--text-secondary)'
    };
  };

  return (
    <div style={{ width: '100%', overflowX: 'auto', padding: '6px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 780 }}>
        {nodes.map((node, index) => {
          const colors = getNodeColors(node.type, node.status);
          const isSelected = selectedNodeId === node.id;

          return (
            <React.Fragment key={node.id}>
              <div
                onClick={() => onSelectNode && onSelectNode(node)}
                style={{
                  background: isSelected ? 'rgba(49, 170, 169, 0.1)' : colors.bg,
                  border: isSelected ? '2px solid var(--palette-teal)' : `1px solid ${colors.border}`,
                  borderRadius: 6,
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: onSelectNode ? 'pointer' : 'default',
                  flexShrink: 0,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  transition: 'all 120ms ease'
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    background: colors.iconBg,
                    color: colors.iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {getNodeIcon(node.type, node.status)}
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: colors.text, whiteSpace: 'nowrap' }}>
                    {node.label}
                  </div>
                  <div style={{ fontSize: 9, color: '#64748B', whiteSpace: 'nowrap' }}>
                    {node.sublabel}
                  </div>
                </div>
              </div>

              {index < nodes.length - 1 && (
                <div style={{ color: '#CBD5E1', fontSize: 11, flexShrink: 0, fontWeight: 600 }}>
                  →
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
