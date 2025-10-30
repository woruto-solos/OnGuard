import React, { useState, useEffect } from 'react';
import { getBehaviorAnalytics } from '../services/geminiService';
import type { BehaviorAnalyticsResponse } from '../types';
import { LightbulbIcon, AlertTriangleIcon, ShieldCheckIcon, UserCheckIcon } from './icons';

const BehaviorAnalyticsLoadingSkeleton: React.FC = () => (
    <div className="space-y-8 animate-pulse">
        <div className="card h-36">
            <div className="h-6 bg-white/10 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-white/5 rounded w-full mb-2"></div>
            <div className="h-4 bg-white/5 rounded w-5/6"></div>
        </div>
        <div className="card h-40">
            <div className="h-5 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
                <div className="h-8 bg-white/5 rounded-lg"></div>
                <div className="h-8 bg-white/5 rounded-lg"></div>
            </div>
        </div>
        <div className="card h-40">
            <div className="h-5 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
                <div className="h-8 bg-white/5 rounded-lg"></div>
                <div className="h-8 bg-white/5 rounded-lg"></div>
            </div>
        </div>
    </div>
);


export const BehaviorAnalyticsPage: React.FC = () => {
    const [analytics, setAnalytics] = useState<BehaviorAnalyticsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getBehaviorAnalytics();
                setAnalytics(data);
            } catch (err) {
                console.error("Failed to fetch behavior analytics:", err);
                setError("Could not load your behavioral analysis. The AI may be unavailable.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (isLoading) {
        return <BehaviorAnalyticsLoadingSkeleton />;
    }

    if (error) {
        return (
            <div className="card bg-red-900/30 border-red-500/50 text-red-300 text-center">
                <p>{error}</p>
            </div>
        );
    }
    
    if (!analytics) return null;

    return (
        <div className="space-y-8">
            <div className="text-center">
                <p className="text-gray-400">Your personalized, AI-powered safety analysis.</p>
                <p className="mt-1 text-xs text-gray-500">(This is a simulation based on common user patterns for demonstration purposes.)</p>
            </div>

            <div className="card">
                <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                    <LightbulbIcon className="w-6 h-6 text-[#1E90FF]" />
                    Your Behavior Summary
                </h3>
                <p className="mt-3 text-[#E0E0E0] leading-relaxed">{analytics.behavior_summary}</p>
            </div>

            <div className="card bg-yellow-500/5 border border-yellow-500/20">
                <h3 className="flex items-center gap-2 text-lg font-bold text-[#FFC107]">
                    <AlertTriangleIcon className="w-6 h-6" />
                    Predicted Risks
                </h3>
                <ul className="mt-3 text-[#E0E0E0] list-disc list-inside space-y-2">
                    {analytics.predicted_risks.map((risk, index) => (
                        <li key={index}>{risk}</li>
                    ))}
                </ul>
            </div>

            <div className="card bg-green-500/5 border border-green-500/20">
                <h3 className="flex items-center gap-2 text-lg font-bold text-[#20C997]">
                    <ShieldCheckIcon className="w-6 h-6" />
                    Recommended Actions
                </h3>
                <ul className="mt-3 text-[#E0E0E0] list-disc list-inside space-y-2">
                    {analytics.recommended_actions.map((action, index) => (
                        <li key={index}>{action}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};