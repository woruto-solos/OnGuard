import React, { useState, useEffect, useCallback } from 'react';
import { generateScenarios } from '../services/geminiService';
import type { Scenario } from '../types';
import { RiskLevel } from '../types';
import { CheckCircleIcon, XCircleIcon, LightbulbIcon, GraduationCapIcon, RefreshCwIcon } from './icons';

type UserChoice = 'Safe' | 'Unsafe';

export const ScenarioSimulator: React.FC = () => {
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userChoice, setUserChoice] = useState<UserChoice | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchScenarios = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setUserChoice(null);
        try {
            const newScenarios = await generateScenarios(5);
            setScenarios(newScenarios);
            setCurrentIndex(0);
        } catch (err) {
            setError('Could not load new scenarios. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchScenarios();
    }, [fetchScenarios]);
    
    const handleChoice = (choice: UserChoice) => {
        if (!userChoice) {
            setUserChoice(choice);
        }
    };
    
    const handleNext = () => {
        setUserChoice(null);
        if (currentIndex < scenarios.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // fetch more scenarios if we reach the end
            fetchScenarios();
        }
    }

    const currentScenario = scenarios[currentIndex];
    const isCorrect = userChoice ? (currentScenario.risk_level === RiskLevel.Dangerous ? 'Unsafe' : 'Safe') === userChoice : false;

    if (isLoading && scenarios.length === 0) {
        return (
            <div className="card text-center">
                 <div className="flex justify-center items-center gap-2 text-gray-400">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading interactive scenarios...</span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
          <div className="card bg-red-900/30 border-red-500/50 text-red-300 p-6 text-center">
            <p>{error}</p>
          </div>
        );
      }

    if (!currentScenario) {
        return null; // Should be handled by loading/error states
    }

    return (
        <div className="card">
            <h2 className="text-2xl font-bold text-white">Scenario Simulator</h2>
            <p className="mt-2 text-gray-400">Test your skills. Is this message safe or unsafe?</p>
            
            <div className="p-6 border-t border-white/10 mt-4 -mx-6">
                <div className="bg-[#121926] p-4 rounded-lg border border-white/10">
                    <p className="text-gray-200 whitespace-pre-wrap italic">"{currentScenario.message}"</p>
                </div>
                
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => handleChoice('Safe')}
                      disabled={!!userChoice}
                      className="w-full flex justify-center items-center gap-2 bg-green-600/10 hover:bg-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed border border-green-500 text-green-300 font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                      Mark as Safe
                    </button>
                    <button
                      onClick={() => handleChoice('Unsafe')}
                      disabled={!!userChoice}
                      className="w-full flex justify-center items-center gap-2 bg-red-600/10 hover:bg-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed border border-red-500 text-red-300 font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                      Mark as Unsafe
                    </button>
                </div>

                {userChoice && (
                    <div className="mt-6 border-t border-white/10 pt-6 animate-fade-in-up space-y-4">
                        {isCorrect ? (
                             <div className="flex items-center gap-3 text-[#20C997]">
                                <CheckCircleIcon className="w-8 h-8"/>
                                <h3 className="text-xl font-bold">Correct!</h3>
                             </div>
                        ) : (
                            <div className="flex items-center gap-3 text-[#DC3545]">
                                <XCircleIcon className="w-8 h-8"/>
                                <h3 className="text-xl font-bold">Not quite.</h3>
                             </div>
                        )}

                        <div>
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                <LightbulbIcon className="w-5 h-5" />
                                Explanation
                            </h4>
                            <p className="mt-1 text-gray-300">{currentScenario.explanation}</p>
                        </div>
                        
                        <div className="bg-[#1E90FF]/10 border border-[#1E90FF]/30 p-4 rounded-lg">
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-[#1E90FF] uppercase tracking-wider">
                                <GraduationCapIcon className="w-5 h-5" />
                                Learning Tip
                            </h4>
                            <p className="mt-2 text-gray-300">{currentScenario.learning_tip}</p>
                        </div>

                        <button 
                         onClick={handleNext}
                         className="w-full flex justify-center items-center gap-2 bg-[#1E90FF] hover:bg-opacity-80 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 mt-4"
                        >
                            <RefreshCwIcon className="w-5 h-5" />
                            Next Scenario
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};