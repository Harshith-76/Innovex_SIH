import React from 'react';
import { ParcelStatus, CompensationStatus, RiskLevel, AlertSeverity } from '../../types';

interface StatusBadgeProps {
  status: ParcelStatus | CompensationStatus | AlertSeverity | 'In Progress' | 'Approved' | 'Delayed' | 'Completed' | 'Pending' | 'Verified' | 'Pending Verification' | 'Rejected' | 'Active' | 'Inactive' | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  let colorClass = 'neutral';
  let dotColor = '#64748b';

  switch (status) {
    case 'Acquired':
    case 'Paid':
    case 'Completed':
    case 'Verified':
    case 'Active':
      colorClass = 'green';
      dotColor = '#16a34a';
      break;

    case 'Under Acquisition':
    case 'Processing':
    case 'In Progress':
    case 'Approved':
    case 'Information':
      colorClass = 'blue';
      dotColor = '#1d5cb0';
      break;

    case 'Notification':
    case 'Compensation Pending':
    case 'Pending Approval':
    case 'Pending Verification':
    case 'Warning':
      colorClass = 'amber';
      dotColor = '#d97706';
      break;

    case 'Possession Pending':
    case 'R&R Pending':
      colorClass = 'purple';
      dotColor = '#9333ea';
      break;

    case 'Payment Failed':
    case 'Delayed':
    case 'Critical':
    case 'Rejected':
    case 'Inactive':
      colorClass = 'red';
      dotColor = '#dc2626';
      break;

    default:
      colorClass = 'neutral';
      dotColor = '#64748b';
  }

  return (
    <span
      className={`status-badge ${colorClass}`}
      style={{
        fontSize: size === 'sm' ? '10px' : '11px',
        padding: size === 'sm' ? '1px 6px' : '2px 8px'
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: dotColor,
          display: 'inline-block'
        }}
      />
      {status}
    </span>
  );
};

interface RiskBadgeProps {
  score: number;
  level: RiskLevel;
  showScore?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ score, level, showScore = true }) => {
  return (
    <span className={`risk-pill ${level}`}>
      <span>●</span>
      {level} Risk {showScore ? `(${score}/100)` : ''}
    </span>
  );
};
