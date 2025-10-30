import React, { useState, useCallback } from 'react';
import { generateQuiz } from '../services/geminiService';
import type { QuizResponse, QuizQuestion } from '../types';
import { HelpCircleIcon, CheckCircleIcon, XCircleIcon, RefreshCwIcon, AwardIcon } from './icons';

export const Quiz: React.FC = () => {
    const [quizData, setQuizData] = useState<QuizResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isQuizStarted, setIsQuizStarted] = useState(false);

    const fetchQuiz = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setQuizData(null);
        try {
            const data = await generateQuiz();
            setQuizData(data);
            setCurrentIndex(0);
            setScore(0);
            setSelectedAnswer(null);
            setIsQuizStarted(true);
        } catch (err) {
            console.error(err);
            setError("Failed to generate a new quiz. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleAnswerSelect = (option: string) => {
        if (selectedAnswer) return; // Prevent changing answer

        setSelectedAnswer(option);
        if (option === quizData?.questions[currentIndex]?.correct_answer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        setSelectedAnswer(null);
        setCurrentIndex(prev => prev + 1);
    };

    const handleRestart = () => {
        setIsQuizStarted(false);
    };

    const currentQuestion = quizData?.questions[currentIndex];
    const isQuizFinished = quizData && currentIndex >= quizData.questions.length;

    const getButtonClass = (option: string) => {
        if (!selectedAnswer) {
            return 'bg-white/5 hover:bg-white/10 border-white/20';
        }
        const isCorrect = option === currentQuestion?.correct_answer;
        const isSelected = option === selectedAnswer;

        if (isCorrect) return 'bg-green-500/20 border-green-500 text-white';
        if (isSelected && !isCorrect) return 'bg-red-500/20 border-red-500 text-white';
        return 'bg-white/5 border-white/20 opacity-60';
    };

    if (!isQuizStarted) {
        return (
            <div className="card text-center">
                 <h2 className="text-2xl font-bold text-white mb-2">Ready for a Challenge?</h2>
                 <p className="text-gray-400 mb-4">Test your cyber safety knowledge and earn points!</p>
                 <button 
                    onClick={fetchQuiz}
                    disabled={isLoading}
                    className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-[#1E90FF] hover:bg-opacity-80 disabled:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                 >
                    {isLoading ? 'Generating...' : 'Start Quiz'}
                 </button>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="card text-center">
                 <div className="flex justify-center items-center gap-2 text-gray-400">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating your quiz...</span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
          <div className="card bg-red-900/30 border-red-500/50 text-red-300 text-center">
            <p>{error}</p>
            <button onClick={handleRestart} className="mt-4 text-white underline">Go Back</button>
          </div>
        );
    }

    return (
        <div className="card">
            <div className="p-0">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <HelpCircleIcon className="w-8 h-8"/>
                    {isQuizFinished ? 'Quiz Complete!' : quizData?.quiz_title}
                </h2>
                {!isQuizFinished && <p className="mt-2 text-gray-400">Question {currentIndex + 1} of {quizData?.questions.length}</p>}
            </div>

            <div className="p-0 border-t border-white/10 mt-4 pt-4">
            {isQuizFinished ? (
                <div className="text-center space-y-4 animate-fade-in-up">
                    <h3 className="text-xl text-white">Your Score: <span className="font-bold text-[#1E90FF]">{score} / {quizData?.questions.length}</span></h3>
                    <div className="flex items-center justify-center gap-2 text-lg text-[#20C997]">
                        <AwardIcon className="w-6 h-6"/>
                        <span>You earned {quizData?.gamification_points} Knowledge Points!</span>
                    </div>
                    <button 
                        onClick={fetchQuiz}
                        disabled={isLoading}
                        className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-[#1E90FF] hover:bg-opacity-80 disabled:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                         <RefreshCwIcon className="w-5 h-5"/>
                         {isLoading ? 'Generating...' : 'Try Another Quiz'}
                    </button>
                </div>
            ) : (
                currentQuestion && (
                    <div className="space-y-4 animate-fade-in-up">
                        <p className="text-lg text-[#E0E0E0] font-medium">{currentQuestion.question}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(option)}
                                    disabled={!!selectedAnswer}
                                    className={`p-3 rounded-lg border text-left transition-all duration-200 disabled:cursor-not-allowed ${getButtonClass(option)}`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        {selectedAnswer && (
                             <div className="mt-4 p-4 bg-[#121926] rounded-lg border border-white/10 animate-fade-in-up">
                                {selectedAnswer === currentQuestion.correct_answer ? (
                                    <div className="flex items-center gap-2 text-[#20C997] font-bold">
                                        <CheckCircleIcon /> Correct!
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-[#DC3545] font-bold">
                                        <XCircleIcon /> Incorrect.
                                    </div>
                                )}
                                <p className="mt-2 text-gray-300">{currentQuestion.explanation}</p>
                                <button
                                    onClick={handleNextQuestion}
                                    className="mt-4 w-full bg-[#1E90FF] hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-lg"
                                >
                                    Next Question
                                </button>
                            </div>
                        )}
                    </div>
                )
            )}
            </div>
        </div>
    );
};