import React from 'react';
import type { ConversationAnalysisResponse, MessageRisk } from '../types';
import { RiskLevel } from '../types';
import { RiskBadge } from './RiskBadge';
import { AlertTriangleIcon, LightbulbIcon, ShieldCheckIcon } from './icons';

const getAccentColorClass = (riskLevel: RiskLevel): { border: string, text: string } => {
    switch (riskLevel) {
      case RiskLevel.Safe:
        return { border: 'border-t-[#20C997]', text: 'text-[#20C997]' };
      case RiskLevel.Suspicious:
        return { border: 'border-t-[#FFC107]', text: 'text-[#FFC107]' };
      case RiskLevel.Dangerous:
        return { border: 'border-t-[#DC3545]', text: 'text-[#DC3545]' };
      default:
        return { border: 'border-t-white/20', text: 'text-gray-400' };
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


const MessageRiskItem: React.FC<{ messageRisk: MessageRisk }> = ({ messageRisk }) => {
    return (
        <div className="p-4 bg-[#121926]/60 rounded-lg border border-white/10">
            <div className="mb-3">
                <HighlightedMessage text={messageRisk.message_content} phrases={messageRisk.highlighted_phrases} />
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-3">
                <p className="text-sm text-gray-400 italic">{messageRisk.explanation}</p>
                <RiskBadge riskLevel={messageRisk.risk_level} />
            </div>
        </div>
    );
};

export const ConversationResultDisplay: React.FC<{ result: ConversationAnalysisResponse }> = ({ result }) => {
    const accent = getAccentColorClass(result.overall_risk_level);

    return (
        <div className={`card border-t-4 ${accent.border} animate-fade-in-up`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-bold text-white">Conversation Analysis</h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-400">Overall Risk:</span>
                    <RiskBadge riskLevel={result.overall_risk_level} />
                </div>
            </div>
            <div className="mt-4 border-t border-white/10 pt-4 space-y-6">
                <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        <LightbulbIcon className="w-5 h-5" />
                        Overall Explanation
                    </h3>
                    <p className="mt-1 text-[#E0E0E0]">{result.overall_explanation}</p>
                </div>

                <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        <ShieldCheckIcon className="w-5 h-5" />
                        Message-by-Message Breakdown
                    </h3>
                    <div className="space-y-4">
                        {result.message_risks.map((msgRisk, index) => (
                            <MessageRiskItem key={index} messageRisk={msgRisk} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};