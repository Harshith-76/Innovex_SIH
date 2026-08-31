import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  highlight?: boolean;
  accentColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon,
  highlight,
  accentColor
}) => {
  return (
    <div
      className={`kpi-card ${highlight ? 'highlight' : ''}`}
      style={{
        borderLeft: accentColor
          ? `3px solid ${accentColor}`
          : highlight
          ? '3px solid var(--gov-blue-600)'
          : undefined
      }}
    >
      <div className="kpi-top">
        <span className="kpi-label">{label}</span>
        {icon && <span className="kpi-icon-wrap">{icon}</span>}
      </div>
      <div className="kpi-bottom">
        <div className="kpi-value">{value}</div>
        {subtext && <div className="kpi-subtext">{subtext}</div>}
      </div>
    </div>
  );
};

