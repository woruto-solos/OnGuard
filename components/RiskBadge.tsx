import React from 'react';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  riskLevel: RiskLevel;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ riskLevel }) => {
  const getRiskStyles = (): { dot: string; text: string } => {
    switch (riskLevel) {
      case RiskLevel.Safe:
        return { dot: 'bg-[#20C997]', text: 'text-[#20C997]' };
      case RiskLevel.Suspicious:
        return { dot: 'bg-[#FFC107]', text: 'text-[#FFC107]' };
      case RiskLevel.Dangerous:
        return { dot: 'bg-[#DC3545]', text: 'text-[#DC3545]' };
      default:
        return { dot: 'bg-gray-500', text: 'text-gray-400' };
    }
  };

  const { dot, text } = getRiskStyles();

  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full ${dot}`}></span>
      <span className={`text-sm font-bold ${text}`}>{riskLevel}</span>
    </div>
  );
};