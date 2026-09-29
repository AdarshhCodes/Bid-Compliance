import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Clock, ArrowLeft, Shield } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  category: string;
  phaseScheduled: string;
  description: string;
}

export const PlaceholderPage: React.FC<PlaceholderProps> = ({
  title,
  category,
  phaseScheduled,
  description
}) => {
  const location = useLocation();

  return (
    <div style={{ maxWidth: 880, margin: '40px auto' }}>
      <div className="panel-card" style={{ padding: 40, textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            padding: 16,
            background: 'rgba(49, 170, 169, 0.08)',
            border: '1px solid rgba(49, 170, 169, 0.3)',
            borderRadius: 12,
            color: 'var(--palette-teal)',
            marginBottom: 20
          }}
        >
          <Clock size={32} />
        </div>

        <div
          style={{
            fontSize: 11,
            color: 'var(--palette-teal)',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 8
          }}
        >
          {category} · Scheduled for {phaseScheduled}
        </div>

        <h2 style={{ fontSize: 22, color: '#0F172A', fontWeight: 700, marginBottom: 12 }}>
          {title}
        </h2>

        <p style={{ fontSize: 14, color: '#475569', maxWidth: 620, margin: '0 auto 24px', lineHeight: 1.6 }}>
          {description}
        </p>

        <div
          style={{
            background: '#F8FAFC',
            border: '1px solid #CBD5E1',
            borderRadius: 6,
            padding: '10px 16px',
            maxWidth: 480,
            margin: '0 auto 28px',
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
            color: '#64748B'
          }}
        >
          Active Route: <span style={{ color: '#0F172A', fontWeight: 600 }}>{location.pathname}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
          <Link to="/tender" className="btn-secondary">
            <ArrowLeft size={14} />
            <span>Return to Tender Overview</span>
          </Link>
          <Link to="/tender/CPCL-2026-VALVES-7701/bidder/BIDDER-002" className="btn-primary">
            <span>Investigate Bidder B-02 (Apex Process)</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
