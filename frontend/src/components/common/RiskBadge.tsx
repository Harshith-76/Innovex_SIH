import React from 'react';
import { RiskLevel } from '../../types';

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
export default RiskBadge;
