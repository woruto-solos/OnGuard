import React, { useState, useEffect } from 'react';
import { getDashboardData } from '../services/geminiService';
import type { DashboardData, RecentMessageSummary } from '../types';
import { RiskLevel } from '../types';
import { RiskBadge } from './RiskBadge';
import { AlertTriangleIcon, ActivityIcon } from './icons';

const SafetyScoreGauge: React.FC<{ score: number }> = ({ score }) => {
    const circumference = 2 * Math.PI * 52; // 2 * pi * radius
    const offset = circumference - (score / 100) * circumference;
  
    const getColor = () => {
      if (score > 80) return 'text-[#20C997]';
      if (score > 60) return 'text-[#FFC107]';
      return 'text-[#DC3545]';
    };
  
    return (
      <div className="relative flex items-center justify-center w-40 h-40">
        <svg className="absolute w-full h-full" viewBox="0 0 120 120">
          <circle
            className="text-white/10"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="52"
            cx="60"
            cy="60"
          />
          <circle
            className={`${getColor()} transition-all duration-1000 ease-out`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={circumference} // Start with full offset
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="52"
            cx="60"
            cy="60"
            transform="rotate(-90 60 60)"
            style={{ strokeDashoffset: offset }}
          />
        </svg>
        <div className="flex flex-col items-center">
            <span className={`text-4xl font-bold ${getColor()}`}>{score}</span>
            <span className="text-sm text-gray-400">Safety Score</span>
        </div>
      </div>
    );
};

const RecentActivityItem: React.FC<{ item: RecentMessageSummary }> = ({ item }) => (
    <div className="flex items-center justify-between p-3 bg-[#121926]/50 rounded-lg">
        <div>
            <p className="text-gray-300 truncate italic">"{item.message_snippet}"</p>
            <p className="text-xs text-gray-500 mt-1">{item.timestamp}</p>
        </div>
        <RiskBadge riskLevel={item.risk_level} />
    </div>
);

const DashboardLoadingSkeleton: React.FC = () => (
    <div className="space-y-8 animate-pulse">
        <div className="card flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-6 h-48">
            <div className="w-40 h-40 bg-white/5 rounded-full"></div>
            <div className="flex-1 w-full sm:w-auto">
                <div className="h-6 bg-white/10 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-white/5 rounded w-full mb-2"></div>
                <div className="h-4 bg-white/5 rounded w-5/6"></div>
            </div>
        </div>
        <div className="card h-64">
            <div className="h-5 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
                <div className="h-12 bg-white/5 rounded-lg"></div>
                <div className="h-12 bg-white/5 rounded-lg"></div>
                <div className="h-12 bg-white/5 rounded-lg"></div>
            </div>
        </div>
    </div>
);

export const DashboardPage: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const data = await getDashboardData();
          setDashboardData(data);
        } catch (err) {
          console.error("Failed to fetch dashboard data:", err);
          setError("Could not load your dashboard. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    if (isLoading) {
      return <DashboardLoadingSkeleton />;
    }
  
    if (error) {
      return (
        <div className="card bg-red-900/30 border-red-500/50 text-red-300 text-center">
          <p>{error}</p>
        </div>
      );
    }
  
    if (!dashboardData) return null;
  
    return (
      <div className="space-y-8">
        <div className="card flex flex-col sm:flex-row items-center gap-6">
            <SafetyScoreGauge score={dashboardData.safety_score} />
            <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                    <AlertTriangleIcon className="w-6 h-6 text-[#FFC107]" />
                    Predicted Risks
                </h2>
                <ul className="mt-2 text-[#E0E0E0] list-disc list-inside space-y-1">
                    {dashboardData.predicted_risks.map((risk, index) => (
                        <li key={index}>{risk}</li>
                    ))}
                </ul>
            </div>
        </div>

        <div className="card">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <ActivityIcon className="w-6 h-6" />
                Recent Activity
            </h2>
            <div className="space-y-3">
                {dashboardData.recent_messages_summary.map((item, index) => (
                    <RecentActivityItem key={index} item={item} />
                ))}
            </div>
        </div>
      </div>
    );
};