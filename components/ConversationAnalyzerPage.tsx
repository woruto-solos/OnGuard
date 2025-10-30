import React, { useState, useCallback } from 'react';
import { analyzeConversation } from '../services/geminiService';
import type { ConversationAnalysisResponse } from '../types';
import { ConversationResultDisplay } from './ConversationResultDisplay';
import { LoadingSkeleton } from './LoadingSkeleton';

export const ConversationAnalyzerPage: React.FC = () => {
    const [conversation, setConversation] = useState<string>('');
    const [analysisResult, setAnalysisResult] = useState<ConversationAnalysisResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = useCallback(async () => {
        if (!conversation.trim()) {
            setError('Please enter a conversation to analyze.');
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
    
        try {
          // No sanitization here as context might be lost and the AI needs to parse it.
          // The prompt will handle the privacy aspect.
          const result = await analyzeConversation(conversation);
          setAnalysisResult(result);
        } catch (err) {
          console.error('Conversation analysis failed:', err);
          setError('Failed to analyze the conversation. The AI may be unavailable or the request was blocked. Please try again.');
        } finally {
          setIsLoading(false);
        }
    }, [conversation]);

    return (
        <div className="space-y-6">
            <div className="card">
                <div className="flex flex-col gap-4">
                    <label htmlFor="conversation-input" className="text-center text-gray-400">
                        Paste the conversation thread below, with each message on a new line.
                    </label>
                    <textarea
                        id="conversation-input"
                        rows={10}
                        className="w-full p-4 bg-[#121926] border border-white/20 rounded-lg text-[#E0E0E0] focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] transition-all duration-200 placeholder-gray-500 resize-y"
                        placeholder="Alice: Hey, I have a surprise for you!
Bob: Oh really? What is it?
Alice: Just click this link to find out..."
                        value={conversation}
                        onChange={(e) => setConversation(e.target.value)}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading || !conversation.trim()}
                        className="w-full flex justify-center items-center gap-2 bg-[#1E90FF] hover:bg-opacity-80 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121926] focus:ring-[#1E90FF]"
                    >
                        {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing Conversation...
                        </>
                        ) : (
                        'Analyze Conversation'
                        )}
                    </button>
                </div>
            </div>

            {error && (
                <div className="card bg-red-900/30 border-red-500/50 text-red-300 text-center">
                    <p>{error}</p>
                </div>
            )}
            {isLoading && <LoadingSkeleton />}
            {analysisResult && !isLoading && (
                <div className="mt-6">
                    <ConversationResultDisplay result={analysisResult} />
                </div>
            )}
             {!isLoading && !analysisResult && !error && (
               <div className="mt-10 text-center text-gray-500">
                 <p>Your conversation analysis results will appear here.</p>
               </div>
            )}
        </div>
    );
};