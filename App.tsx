import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { MessageInput } from './components/MessageInput';
import { AnalysisResultDisplay } from './components/AnalysisResultDisplay';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { analyzeMessage } from './services/geminiService';
import type { AnalysisResponse } from './types';
import { sanitizeMessage } from './utils/sanitizer';
import { Navigation } from './components/Navigation';
import { LearningHub } from './components/LearningHub';
import { TrendsPage } from './components/TrendsPage';
import { TutorPage } from './components/TutorPage';
import { DashboardPage } from './components/DashboardPage';
import { ConversationAnalyzerPage } from './components/ConversationAnalyzerPage';
import { BehaviorAnalyticsPage } from './components/BehaviorAnalyticsPage';
import { HomeIcon, ClipboardListIcon, BookOpenIcon, TrendingUpIcon, MessageCircleIcon, MessagesSquareIcon, UserCheckIcon } from './components/icons';

export type View = 'dashboard' | 'analyzer' | 'conversation' | 'learn' | 'trends' | 'tutor' | 'behavior';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon className="w-6 h-6" /> },
  { id: 'analyzer', label: 'Message Analyzer', icon: <ClipboardListIcon className="w-6 h-6" /> },
  { id: 'conversation', label: 'Conversation Analyzer', icon: <MessagesSquareIcon className="w-6 h-6" /> },
  { id: 'learn', label: 'Learning Hub', icon: <BookOpenIcon className="w-6 h-6" /> },
  { id: 'trends', label: 'Trends & Analytics', icon: <TrendingUpIcon className="w-6 h-6" /> },
  { id: 'tutor', label: 'AI Safety Tutor', icon: <MessageCircleIcon className="w-6 h-6" /> },
  { id: 'behavior', label: 'Behavioral Insights', icon: <UserCheckIcon className="w-6 h-6" /> },
];

const App: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>('dashboard');

  const handleAnalyze = useCallback(async () => {
    if (!message.trim()) {
      setError('Please enter a message to analyze.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const sanitized = sanitizeMessage(message);
      const result = await analyzeMessage(sanitized);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Failed to analyze the message. The AI may be unavailable, or the request was blocked. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [message]);
  
  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'analyzer':
        return (
          <div className="card animate-fade-in-up">
            <MessageInput
              message={message}
              setMessage={setMessage}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
            {error && (
              <div className="mt-6 bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center">
                <p>{error}</p>
              </div>
            )}
            {isLoading && <LoadingSkeleton />}
            {analysisResult && !isLoading && (
              <div className="mt-6">
                <AnalysisResultDisplay result={analysisResult} originalMessage={message} />
              </div>
            )}
            {!isLoading && !analysisResult && !error && (
               <div className="mt-10 text-center text-gray-500">
                 <p>Your analysis results will appear here.</p>
               </div>
            )}
          </div>
        );
      case 'conversation':
        return <ConversationAnalyzerPage />;
      case 'learn':
        return <LearningHub />;
      case 'trends':
        return <TrendsPage />;
      case 'tutor':
        return <TutorPage />;
      case 'behavior':
        return <BehaviorAnalyticsPage />;
      default:
        return null;
    }
  }
  
  const currentPageTitle = navItems.find(item => item.id === activeView)?.label || 'Dashboard';

  return (
    <div className="flex h-screen bg-[#0A0F1F] text-[#E0E0E0]">
      <Navigation activeView={activeView} setActiveView={setActiveView} navItems={navItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentPageTitle={currentPageTitle} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#121926] p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;