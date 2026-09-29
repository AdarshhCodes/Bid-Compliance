import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  Search,
  ExternalLink,
  Building,
  CreditCard,
  FileText,
  Phone,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Fingerprint,
  Users,
  MapPin,
  Briefcase
} from 'lucide-react';
import { DocumentFingerprintModal } from '../components/investigation/DocumentFingerprintModal';
import { EvidenceDrawer } from '../components/investigation/EvidenceDrawer';
import { Evidence } from '../types';

interface GraphNode {
  id: string;
  label: string;
  sublabel?: string;
  type: 'BIDDER' | 'BANK' | 'DIRECTOR' | 'ADDRESS' | 'DOCUMENT' | 'PHONE' | 'OEM';
  x: number;
  y: number;
  isFlagged?: boolean;
  metadata?: any;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type: 'SHARED_BANK' | 'SIMILAR_DOC' | 'SAME_ADDRESS' | 'SAME_DIRECTOR' | 'SAME_PHONE' | 'COMMON_OEM';
  confidence: string;
  isSignal?: boolean;
  detectionA?: string;
  detectionB?: string;
  accountMasked?: string;
  ifsc?: string;
  similarityPct?: number;
}

const INITIAL_NODES: GraphNode[] = [
  {
    id: 'B4',
    label: 'Bidder 4',
    sublabel: 'Northern Equipment Co.',
    type: 'BIDDER',
    x: 180,
    y: 240,
    isFlagged: true,
    metadata: { pan: 'AADCA3344P', gstin: '29AADCA3344P1Z8', city: 'Bangalore', legalEntity: 'Private Limited' }
  },
  {
    id: 'B5',
    label: 'Bidder 5',
    sublabel: 'Industrial Process Systems',
    type: 'BIDDER',
    x: 520,
    y: 240,
    isFlagged: true,
    metadata: { pan: 'AAEFZ8899L', gstin: '29AAEFZ8899L1Z5', city: 'Bangalore', legalEntity: 'Limited Liability Partnership' }
  },
  {
    id: 'BANK1',
    label: 'HDFC0001234',
    sublabel: 'Shared Bank Account',
    type: 'BANK',
    x: 350,
    y: 190,
    isFlagged: true,
    metadata: { ifsc: 'HDFC0001234', branch: 'Richmond Road, Bangalore', accountMasked: 'XXXXX9821' }
  },
  {
    id: 'ADDR1',
    label: 'Same Address',
    sublabel: 'Residency Rd / Mission Rd, Bangalore',
    type: 'ADDRESS',
    x: 230,
    y: 90,
    metadata: { pin: '560025 / 560027', distance: '1.2 km radius' }
  },
  {
    id: 'DIR1',
    label: 'Same Director',
    sublabel: 'S. Deshmukh (DIN: 05847362)',
    type: 'DIRECTOR',
    x: 470,
    y: 90,
    metadata: { din: '05847362', companies: 'Past advisory on MCA filings' }
  },
  {
    id: 'DOC1',
    label: 'Similar Documents',
    sublabel: '94% similarity',
    type: 'DOCUMENT',
    x: 240,
    y: 380,
    isFlagged: true,
    metadata: { matchScore: '94%', typo: 'Shared typo "hydrolic"' }
  },
  {
    id: 'PHONE1',
    label: 'Same Phone',
    sublabel: '+91 80 4112 55XX',
    type: 'PHONE',
    x: 460,
    y: 380,
    metadata: { tel: '+91 80 4112 5544 / 5599', telecomCircle: 'Karnataka' }
  },
  {
    id: 'OEM1',
    label: 'Common OEM',
    sublabel: 'L&T Valves Limited',
    type: 'OEM',
    x: 350,
    y: 430,
    metadata: { approvedOEM: 'Yes', category: 'API-6D Valves' }
  }
];

const INITIAL_EDGES: GraphEdge[] = [
  {
    id: 'EDGE-BANK-B4-BANK1',
    source: 'B4',
    target: 'BANK1',
    label: 'SHARES BANK ACCOUNT',
    type: 'SHARED_BANK',
    confidence: '98%',
    isSignal: true,
    accountMasked: 'XXXXX9821',
    ifsc: 'HDFC0001234',
    detectionA: 'Bidder 4 — Bank Declaration (Page 6)',
    detectionB: 'Bidder 5 — Bank Declaration (Page 5)'
  },
  {
    id: 'EDGE-BANK-B5-BANK1',
    source: 'B5',
    target: 'BANK1',
    label: 'SHARES BANK ACCOUNT',
    type: 'SHARED_BANK',
    confidence: '98%',
    isSignal: true,
    accountMasked: 'XXXXX9821',
    ifsc: 'HDFC0001234',
    detectionA: 'Bidder 5 — Bank Declaration (Page 5)',
    detectionB: 'Bidder 4 — Bank Declaration (Page 6)'
  },
  {
    id: 'EDGE-DOC-B4-DOC1',
    source: 'B4',
    target: 'DOC1',
    label: 'SIMILAR DOCUMENT',
    type: 'SIMILAR_DOC',
    confidence: '94%',
    isSignal: true,
    similarityPct: 94,
    detectionA: 'Bidder 4: Tech_Proposal_Apex.pdf (Page 14)',
    detectionB: 'Bidder 5: Tech_Bid_Zenith.pdf (Page 12)'
  },
  {
    id: 'EDGE-DOC-B5-DOC1',
    source: 'B5',
    target: 'DOC1',
    label: 'SIMILAR DOCUMENT',
    type: 'SIMILAR_DOC',
    confidence: '94%',
    isSignal: true,
    similarityPct: 94,
    detectionA: 'Bidder 5: Tech_Bid_Zenith.pdf (Page 12)',
    detectionB: 'Bidder 4: Tech_Proposal_Apex.pdf (Page 14)'
  },
  {
    id: 'EDGE-ADDR-B4',
    source: 'B4',
    target: 'ADDR1',
    label: 'SAME ADDRESS',
    type: 'SAME_ADDRESS',
    confidence: '88%'
  },
  {
    id: 'EDGE-DIR-B5',
    source: 'B5',
    target: 'DIR1',
    label: 'SAME DIRECTOR',
    type: 'SAME_DIRECTOR',
    confidence: '91%'
  },
  {
    id: 'EDGE-PHONE-B5',
    source: 'B5',
    target: 'PHONE1',
    label: 'SAME PHONE',
    type: 'SAME_PHONE',
    confidence: '82%'
  },
  {
    id: 'EDGE-OEM-B4',
    source: 'B4',
    target: 'OEM1',
    label: 'COMMON OEM',
    type: 'COMMON_OEM',
    confidence: '98%'
  },
  {
    id: 'EDGE-OEM-B5',
    source: 'B5',
    target: 'OEM1',
    label: 'COMMON OEM',
    type: 'COMMON_OEM',
    confidence: '98%'
  }
];

export const NetworkGraphPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State
  const [nodes, setNodes] = useState<GraphNode[]>(INITIAL_NODES);
  const [viewMode, setViewMode] = useState<'GRAPH' | 'LIST'>('GRAPH');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Dragging State
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  // Inspection Selection (defaults to the shared bank connection as in reference image)
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(INITIAL_NODES[2]);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(INITIAL_EDGES[0]);

  // Sub-Modals
  const [isFingerprintModalOpen, setIsFingerprintModalOpen] = useState(false);
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);
  const [evidenceForDrawer, setEvidenceForDrawer] = useState<Evidence | null>(null);

  // Handle trigger query params
  useEffect(() => {
    const trigger = searchParams.get('trigger');
    if (trigger === 'shared_bank') {
      setSelectedNode(INITIAL_NODES[2]);
      setSelectedEdge(INITIAL_EDGES[0]);
    } else if (trigger === 'fingerprint') {
      setIsFingerprintModalOpen(true);
    }
  }, [searchParams]);

  // Filtering
  const filteredNodes = nodes.filter(n => {
    if (searchQuery && !n.label.toLowerCase().includes(searchQuery.toLowerCase()) && !n.sublabel?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const filteredEdges = INITIAL_EDGES.filter(e => {
    if (filterType === 'BANK' && e.type !== 'SHARED_BANK') return false;
    if (filterType === 'DOCUMENT' && e.type !== 'SIMILAR_DOC') return false;
    if (filterType === 'ADDRESS' && e.type !== 'SAME_ADDRESS') return false;
    if (filterType === 'DIRECTOR' && e.type !== 'SAME_DIRECTOR') return false;
    if (filterType === 'PHONE' && e.type !== 'SAME_PHONE') return false;
    if (filterType === 'OEM' && e.type !== 'COMMON_OEM') return false;
    return true;
  });

  const getNodeFill = (type: GraphNode['type']) => {
    if (type === 'BANK') return 'var(--status-contradicted-dot)';
    if (type === 'BIDDER') return 'var(--border-accent)';
    if (type === 'DOCUMENT') return '#D946EF';
    if (type === 'DIRECTOR') return '#8B5CF6';
    if (type === 'ADDRESS') return '#0284C7';
    if (type === 'PHONE') return 'var(--status-verified-dot)';
    if (type === 'OEM') return '#1E293B';
    return 'var(--text-secondary)';
  };

  // Node Drag handlers
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setDraggingNodeId(nodeId);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleSvgMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !dragStart) return;
    const dx = (e.clientX - dragStart.x) / zoomLevel;
    const dy = (e.clientY - dragStart.y) / zoomLevel;
    setNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, x: n.x + dx, y: n.y + dy } : n));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleSvgMouseUp = () => {
    setDraggingNodeId(null);
    setDragStart(null);
  };

  return (
    <div style={{ maxWidth: 1360, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 1. Header Row (Matching Reference Image 1 Panel 4) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Bidder Relationship Intelligence
          </h1>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            Entity connections across bidders, documents and shared attributes.
          </div>
        </div>

        {/* View Mode & Filter Dropdowns */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
            <span>View:</span>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as any)}
              style={{
                fontSize: 11,
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600
              }}
            >
              <option value="GRAPH">Graph</option>
              <option value="LIST">List</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
            <span>Filter:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                fontSize: 11,
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600
              }}
            >
              <option value="ALL">All Relationships</option>
              <option value="BANK">Shared Bank Account</option>
              <option value="DOCUMENT">Document Similarity</option>
              <option value="ADDRESS">Same Address</option>
              <option value="DIRECTOR">Same Director</option>
              <option value="PHONE">Same Phone</option>
              <option value="OEM">Common OEM</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Investigation Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 16 }}>
        {/* Left: Interactive Draggable Force-Directed Graph Canvas */}
        <div
          className="panel-card"
          style={{
            position: 'relative',
            height: 560,
            overflow: 'hidden',
            background: 'var(--bg-canvas)',
            padding: 0,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Canvas Sub-toolbar */}
          <div
            style={{
              padding: '8px 14px',
              borderBottom: '1px solid var(--border-default)',
              background: 'var(--bg-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 11
            }}
          >
            {/* Search Box */}
            <div style={{ position: 'relative', width: 180 }}>
              <Search size={12} style={{ position: 'absolute', left: 7, top: 7, color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search entity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '3px 6px 3px 24px',
                  fontSize: 11,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-default)',
                  background: 'var(--bg-canvas)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
            </div>

            {/* Entity Types Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 10, color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--border-accent)' }}></span> Bidder</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--status-contradicted-dot)' }}></span> Bank</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#D946EF' }}></span> Document</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#8B5CF6' }}></span> Director</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#0284C7' }}></span> Address</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--status-verified-dot)' }}></span> Phone</span>
            </div>

            {/* Canvas Zoom Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'var(--bg-canvas)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)' }}>
              <button onClick={() => setZoomLevel(z => Math.max(0.7, z - 0.1))} style={{ padding: '3px 6px', color: 'var(--text-secondary)', cursor: 'pointer' }} title="Zoom Out">
                <ZoomOut size={12} />
              </button>
              <button onClick={() => { setZoomLevel(1); setPanOffset({ x: 0, y: 0 }); }} style={{ padding: '3px 6px', fontSize: 10, color: 'var(--text-secondary)', borderLeft: '1px solid var(--border-default)', borderRight: '1px solid var(--border-default)', cursor: 'pointer' }} title="Reset View">
                100%
              </button>
              <button onClick={() => setZoomLevel(z => Math.min(1.4, z + 0.1))} style={{ padding: '3px 6px', color: 'var(--text-secondary)', cursor: 'pointer' }} title="Zoom In">
                <ZoomIn size={12} />
              </button>
            </div>
          </div>

          {/* SVG Canvas Area */}
          <div
            style={{ flex: 1, width: '100%', height: '100%', overflow: 'hidden', cursor: draggingNodeId ? 'grabbing' : 'default' }}
            onMouseMove={handleSvgMouseMove}
            onMouseUp={handleSvgMouseUp}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 700 490"
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                transformOrigin: 'center center',
                transition: draggingNodeId ? 'none' : 'transform 100ms ease'
              }}
            >
              {/* Edges */}
              {filteredEdges.map(edge => {
                const sourceNode = nodes.find(n => n.id === edge.source);
                const targetNode = nodes.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const isSelected = selectedEdge?.id === edge.id;
                const isBank = edge.type === 'SHARED_BANK';
                const strokeColor = isBank ? 'var(--status-contradicted-border)' : edge.type === 'SIMILAR_DOC' ? '#E879F9' : 'var(--border-default)';
                const strokeWidth = isSelected ? 3 : isBank ? 2 : 1.5;
                const strokeDasharray = isBank ? '6 3' : edge.type === 'SIMILAR_DOC' ? '4 2' : 'none';

                return (
                  <g key={edge.id} cursor="pointer" onClick={() => { setSelectedEdge(edge); setSelectedNode(null); }}>
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={strokeDasharray}
                    />
                  </g>
                );
              })}

              {/* Nodes */}
              {filteredNodes.map(node => {
                const isSelected = selectedNode?.id === node.id;
                const isBank = node.type === 'BANK';
                const isBidder = node.type === 'BIDDER';
                const radius = isBank ? 28 : isBidder ? 22 : 18;
                const fill = getNodeFill(node.type);

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    cursor="grab"
                    onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                    onClick={() => { setSelectedNode(node); }}
                  >
                    {/* Pulsing ring for central bank node */}
                    {isBank && (
                      <circle
                        cx={0}
                        cy={0}
                        r={radius + 8}
                        fill="none"
                        stroke="var(--status-contradicted-border)"
                        strokeWidth={1.5}
                        strokeDasharray="4 2"
                        opacity={0.8}
                      />
                    )}

                    {/* Selection ring */}
                    {isSelected && (
                      <circle
                        cx={0}
                        cy={0}
                        r={radius + 5}
                        fill="none"
                        stroke="var(--border-accent)"
                        strokeWidth={2}
                        strokeDasharray="3 3"
                      />
                    )}

                    {/* Node circle */}
                    <circle
                      cx={0}
                      cy={0}
                      r={radius}
                      fill={fill}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))' }}
                    />

                    {/* Node Icon */}
                    {node.type === 'BANK' && <CreditCard size={18} x={-9} y={-9} color="#FFFFFF" />}
                    {node.type === 'ADDRESS' && <MapPin size={15} x={-7.5} y={-7.5} color="#FFFFFF" />}
                    {node.type === 'DIRECTOR' && <Users size={15} x={-7.5} y={-7.5} color="#FFFFFF" />}
                    {node.type === 'DOCUMENT' && <FileText size={15} x={-7.5} y={-7.5} color="#FFFFFF" />}
                    {node.type === 'PHONE' && <Phone size={15} x={-7.5} y={-7.5} color="#FFFFFF" />}
                    {node.type === 'OEM' && <Briefcase size={15} x={-7.5} y={-7.5} color="#FFFFFF" />}

                    {/* Bidder Number inside node */}
                    {node.type === 'BIDDER' && (
                      <text x={0} y={4} textAnchor="middle" fontSize={11} fontWeight={800} fill="#FFFFFF">
                        {node.id}
                      </text>
                    )}

                    {/* Primary Node Label Below */}
                    <text
                      x={0}
                      y={radius + 14}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight={700}
                      fill="var(--text-primary)"
                      style={{ pointerEvents: 'none' }}
                    >
                      {node.label}
                    </text>

                    {/* Secondary Node Label Below */}
                    {node.sublabel && (
                      <text
                        x={0}
                        y={radius + 26}
                        textAnchor="middle"
                        fontSize={8.5}
                        fontWeight={500}
                        fill="var(--text-muted)"
                        style={{ pointerEvents: 'none' }}
                      >
                        {node.sublabel}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right: Relationship Details Panel (Matching Reference Image 1 Panel 4) */}
        <div
          className="panel-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'var(--bg-surface)'
          }}
        >
          <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid var(--border-default)', marginBottom: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Relationship Details
              </h3>
            </div>

            {/* Connection Type + Confidence Pill */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--status-contradicted-bg)',
                    border: '1px solid var(--status-contradicted-border)',
                    color: 'var(--status-contradicted-text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CreditCard size={15} />
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                  Shared Bank Account
                </span>
              </div>
              <span className="status-pill status-pill-verified" style={{ fontSize: 10, padding: '2px 8px' }}>
                Confidence 98%
              </span>
            </div>

            {/* Masked Account / IFSC Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, background: 'var(--bg-canvas)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>IFSC</div>
                <div style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginTop: 2 }}>
                  HDFC0001234
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Account</div>
                <div style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginTop: 2 }}>
                  XXXXX9821
                </div>
              </div>
            </div>

            {/* "Detected In" Section */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Detected In
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, color: 'var(--text-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border-accent)' }} />
                  <span><strong>Bidder 4</strong> — Bank Declaration (Page 6)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border-accent)' }} />
                  <span><strong>Bidder 5</strong> — Bank Declaration (Page 5)</span>
                </div>
              </div>
            </div>

            {/* "Additional Signals" Section */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Additional Signals
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#D946EF' }} />
                  <span>Document similarity: <strong>94%</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#0284C7' }} />
                  <span>Same address cluster</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border-accent)' }} />
                  <span>Similar technical proposal structure</span>
                </div>
              </div>
            </div>

            {/* Persistent Amber Callout — MANDATORY STATUTORY LINE (Never remove or soften) */}
            <div
              style={{
                background: 'var(--status-relationship-bg)',
                border: '1px solid var(--status-relationship-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                fontSize: 11,
                lineHeight: 1.4,
                color: 'var(--status-relationship-text)',
                marginBottom: 16
              }}
            >
              <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <strong>This is a relationship signal. Not a determination of misconduct.</strong>
              </div>
            </div>
          </div>

          {/* Action Button Pinned at Bottom */}
          <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 12 }}>
            <button
              onClick={() => {
                setEvidenceForDrawer({
                  id: 'EVD-REL-SHARED-BANK',
                  documentId: 'DOC-B4-B5-BANK-MANDATE',
                  bidderId: 'BIDDER-004',
                  pageNumber: 6,
                  boundingBox: [0.35, 0.15, 0.45, 0.85],
                  claimField: 'shared_bank_account',
                  extractedValue: 'HDFC0001234 · XXXXX9821',
                  rawTextSnippet: 'RTGS Mandate Form: HDFC Bank, Richmond Road, Bangalore. Account: XXXXX9821.',
                  extractionConfidence: 0.98,
                  provenanceType: 'PDF_NATIVE_TEXT',
                  provenanceBadge: 'SYNTHETIC',
                  extractedAt: '2026-09-29T10:14:40Z'
                });
                setIsEvidenceDrawerOpen(true);
              }}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: 12, padding: '8px 12px' }}
            >
              <span>View Evidence</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Modal: Document Fingerprint Investigation */}
      <DocumentFingerprintModal
        isOpen={isFingerprintModalOpen}
        onClose={() => setIsFingerprintModalOpen(false)}
        onOpenEvidenceDrawer={(evId) => {
          setIsFingerprintModalOpen(false);
          setEvidenceForDrawer({
            id: evId,
            documentId: 'DOC-B4-B5-PROPOSAL',
            bidderId: 'BIDDER-004',
            pageNumber: 14,
            boundingBox: [0.25, 0.10, 0.65, 0.90],
            claimField: 'technical_proposal_qap',
            extractedValue: '94.2% Structural Match',
            rawTextSnippet: 'Prior to final hydrostatic shell testing, each valve assembly shall undergo comprehensive non-destructive examination... automated hydrolic pressure test rig...',
            extractionConfidence: 0.942,
            provenanceType: 'PDF_NATIVE_TEXT',
            provenanceBadge: 'SYNTHETIC',
            extractedAt: '2026-09-29T10:14:41Z'
          });
          setIsEvidenceDrawerOpen(true);
        }}
      />

      {/* Sub-Drawer: Global Evidence Drawer */}
      <EvidenceDrawer
        isOpen={isEvidenceDrawerOpen}
        onClose={() => setIsEvidenceDrawerOpen(false)}
        evidence={evidenceForDrawer}
        requirementTitle="Tender Integrity & Cross-Bidder Relationship Scrutiny"
        requirementId="INTEGRITY-001"
        clauseReference="Clause 6.1 / CPPP Guidelines"
        verdictImpact="Cross-bidder shared banking and boilerplate text detected. Emits RELATIONSHIP SIGNAL for statutory human review."
      />
    </div>
  );
};
