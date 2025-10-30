import React from 'react';
import type { AnalysisResponse } from '../types';
import { RiskLevel } from '../types';
import { RiskBadge } from './RiskBadge';
import { AlertTriangleIcon, LightbulbIcon, ShieldCheckIcon, GraduationCapIcon, AwardIcon } from './icons';

interface AnalysisResultDisplayProps {
  result: AnalysisResponse;
  originalMessage: string;
}

const getAccentColorClass = (riskLevel: RiskLevel): { border: string, text: string, bg: string } => {
  switch (riskLevel) {
    case RiskLevel.Safe:
      return { border: 'border-[#20C997]', text: 'text-[#20C997]', bg: 'bg-green-900/30' };
    case RiskLevel.Suspicious:
      return { border: 'border-[#FFC107]', text: 'text-[#FFC107]', bg: 'bg-yellow-900/30' };
    case RiskLevel.Dangerous:
      return { border: 'border-[#DC3545]', text: 'text-[#DC3545]', bg: 'bg-red-900/30' };
    default:
      return { border: 'border-white/20', text: 'text-gray-400', bg: 'bg-gray-900/30' };
  }
};

const HighlightedMessage: React.FC<{ text: string; phrases: string[] }> = ({ text, phrases }) => {
    if (!phrases || phrases.length === 0) {
      return <p className="text-[#E0E0E0] whitespace-pre-wrap">{text}</p>;
    }
    
    const escapedPhrases = phrases.map(phrase => phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    
    const regex = new RegExp(`(${escapedPhrases.join('|')})`, 'gi');
    const parts = text.split(regex);
  
    return (
      <p className="text-[#E0E0E0] whitespace-pre-wrap leading-relaxed">
        {parts.map((part, index) => {
          const isHighlighted = escapedPhrases.some(p => new RegExp(`^${p}$`, 'i').test(part));
          return isHighlighted ? (
            <mark key={index} className="bg-[#FFC107]/20 text-[#FFC107] rounded px-1 py-0.5">
              {part}
            </mark>
          ) : (
            <span key={index}>{part}</span>
          );
        })}
      </p>
    );
  };

export const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ result, originalMessage }) => {
  const accentColors = getAccentColorClass(result.risk_level);
  
  return (
    <div className={`card border-t-4 ${accentColors.border} animate-fade-in-up mt-6`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold text-white">Analysis Result</h2>
        <RiskBadge riskLevel={result.risk_level} />
      </div>
      <div className="mt-4 border-t border-white/10 pt-4 space-y-6">
        
        {result.highlighted_phrases && result.highlighted_phrases.length > 0 && (
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
              <AlertTriangleIcon className="w-5 h-5 text-[#FFC107]" />
              Highlighted Phrases
            </h3>
            <div className="mt-2 text-gray-200 bg-[#121926]/50 p-4 rounded-md border border-white/10">
                <HighlightedMessage text={originalMessage} phrases={result.highlighted_phrases} />
            </div>
          </div>
        )}

        <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
              <LightbulbIcon className="w-5 h-5" />
              Explanation
            </h3>
            <p className="mt-1 text-[#E0E0E0]">{result.explanation}</p>
            <p className="mt-2 text-xs text-gray-500">
              Confidence: <span className="font-medium text-gray-400">{(result.confidence * 100).toFixed(0)}%</span>
            </p>
        </div>
        
        <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
              <ShieldCheckIcon className="w-5 h-5" />
              Suggested Action
            </h3>
            <p className="mt-1 text-[#E0E0E0] bg-[#121926]/50 p-3 rounded-md border border-white/10">{result.suggested_action}</p>
        </div>
        
        {result.learning_tip && (
            <div className="bg-[#1E90FF]/10 border border-[#1E90FF]/30 p-4 rounded-lg">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[#1E90FF] uppercase tracking-wider">
                    <GraduationCapIcon className="w-5 h-5" />
                    Learning Tip
                </h3>
                <p className="mt-2 text-[#E0E0E0]">{result.learning_tip}</p>
            </div>
        )}

        {result.gamification_feedback && (
            <div className="bg-[#20C997]/10 border border-[#20C997]/30 p-4 rounded-lg">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[#20C997] uppercase tracking-wider">
                    <AwardIcon className="w-5 h-5" />
                    Well Done!
                </h3>
                <p className="mt-2 text-[#E0E0E0]">{result.gamification_feedback}</p>
            </div>
        )}
      </div>
    </div>
  );
};