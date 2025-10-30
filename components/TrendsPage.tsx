import React, { useState, useEffect } from 'react';
import { getTrendAnalytics } from '../services/geminiService';
import type { TrendAnalyticsResponse, TopRisk, PlatformAnalysis } from '../types';
import { LightbulbIcon, TrendingUpIcon } from './icons';

const BarChart: React.FC<{ title: string, data: (TopRisk | PlatformAnalysis)[] }> = ({ title, data }) => {
    const isTopRisk = (item: any): item is TopRisk => typeof item.frequency !== 'undefined';
  
    const maxValue = 100; // Use a fixed 100 for percentage-like display
  
    return (
      <div className="card">
        <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
        <div className="space-y-4">
          {data.map((item, index) => {
            const label = isTopRisk(item) ? item.type : item.platform;
            const value = isTopRisk(item) ? item.frequency : item.risk_count;
            const widthPercentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
  
            return (
              <div key={index} className="flex items-center gap-4">
                <span className="text-sm text-gray-400 w-1/3 truncate">{label}</span>
                <div className="w-2/3 bg-white/5 rounded-full h-4">
                  <div
                    className="bg-[#20C997] h-4 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${widthPercentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

export const TrendsPage: React.FC = () => {
    const [analytics, setAnalytics] = useState<TrendAnalyticsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getTrendAnalytics();
                setAnalytics(data);
            } catch (err) {
                console.error("Failed to fetch trend analytics:", err);
                setError("Could not load threat intelligence data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="card h-36">
                    <div className="h-6 bg-white/10 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-white/5 rounded w-full mb-2"></div>
                    <div className="h-4 bg-white/5 rounded w-5/6"></div>
                </div>
                <div className="card h-48">
                    <div className="h-5 bg-white/10 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-white/5 rounded w-full mb-3"></div>
                    <div className="h-4 bg-white/5 rounded w-full mb-3"></div>
                    <div className="h-4 bg-white/5 rounded w-full"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card bg-red-900/30 border-red-500/50 text-red-300 p-6 text-center">
                <p>{error}</p>
            </div>
        );
    }
    
    if (!analytics) return null;

    return (
        <div className="space-y-8">
            <p className="text-center text-gray-400">AI-generated insights on the latest online safety trends.</p>
            
            <div className="card">
                <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                    <LightbulbIcon className="w-6 h-6 text-[#1E90FF]" />
                    Latest Summary
                </h3>
                <p className="mt-3 text-[#E0E0E0] leading-relaxed">{analytics.trend_summary}</p>
            </div>

            <BarChart title="Top Risks by Type" data={analytics.top_risks} />
            <BarChart title="Risks by Platform" data={analytics.platform_analysis} />
        </div>
    );
};