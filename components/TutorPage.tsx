
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { getTutorResponse } from '../services/geminiService';
import type { ChatMessage, TutorResponse } from '../types';
// FIX: Import ShieldCheckIcon to fix 'Cannot find name' errors.
import { SendIcon, LightbulbIcon, GraduationCapIcon, AwardIcon, ShieldCheckIcon } from './icons';

const isTutorResponse = (content: string | TutorResponse): content is TutorResponse => {
    return (content as TutorResponse).response_text !== undefined;
};

const initialMessage: ChatMessage = {
    role: 'assistant',
    content: {
        response_text: "Hello! I'm your OnGuard AI Tutor. Ask me anything about online safety, like 'what is phishing?' or 'how do I create a strong password?'.",
        learning_tip: "You can start by asking about a specific app or a type of message you've received.",
        suggested_exercise: "Try asking me to explain a cyber safety term you've heard before."
    }
};

export const TutorPage: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userInput }];
        setMessages(newMessages);
        setUserInput('');
        setIsLoading(true);
        setError(null);

        try {
            const tutorResponse = await getTutorResponse(userInput, messages);
            setMessages([...newMessages, { role: 'assistant', content: tutorResponse }]);
        } catch (err) {
            console.error(err);
            setError('The AI tutor is currently unavailable. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, [userInput, messages, isLoading]);
    
    return (
        <div className="flex flex-col h-[70vh] bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg animate-fade-in">
            <header className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white text-center">AI Safety Tutor</h2>
            </header>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                       {msg.role === 'assistant' && (
                           <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center mr-3 flex-shrink-0">
                               <ShieldCheckIcon className="w-6 h-6 text-white"/>
                           </div>
                       )}
                       <div className={`max-w-lg ${msg.role === 'user' ? 'bg-cyan-700 text-white rounded-l-lg rounded-br-lg' : 'bg-gray-700 text-gray-200 rounded-r-lg rounded-bl-lg'}`}>
                           {isTutorResponse(msg.content) ? (
                               <div className='p-4 space-y-4'>
                                   <p>{msg.content.response_text}</p>
                                   <div className="bg-cyan-900/30 border-t border-cyan-700/50 pt-3">
                                        <h4 className="flex items-center gap-2 text-sm font-semibold text-cyan-300 uppercase tracking-wider">
                                            <GraduationCapIcon className="w-5 h-5" />
                                            Learning Tip
                                        </h4>
                                        <p className="mt-2 text-cyan-200 text-sm">{msg.content.learning_tip}</p>
                                   </div>
                                   <div className="bg-purple-900/30 border-t border-purple-700/50 pt-3">
                                        <h4 className="flex items-center gap-2 text-sm font-semibold text-purple-300 uppercase tracking-wider">
                                            <AwardIcon className="w-5 h-5" />
                                            Suggested Exercise
                                        </h4>
                                        <p className="mt-2 text-purple-200 text-sm">{msg.content.suggested_exercise}</p>
                                   </div>
                               </div>
                           ) : (
                            <p className="px-4 py-2">{msg.content}</p>
                           )}
                       </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start">
                        <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center mr-3 flex-shrink-0">
                            <ShieldCheckIcon className="w-6 h-6 text-white"/>
                        </div>
                        <div className="bg-gray-700 text-gray-200 rounded-r-lg rounded-bl-lg p-4 flex items-center gap-2">
                           <span className="animate-pulse">AI is typing...</span>
                        </div>
                     </div>
                )}
                {error && <div className="text-red-400 text-center">{error}</div>}
                 <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 flex items-center gap-2">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask a safety question..."
                    disabled={isLoading}
                    className="flex-1 w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow duration-200 placeholder-gray-500"
                />
                <button
                    type="submit"
                    disabled={isLoading || !userInput.trim()}
                    className="p-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500"
                    aria-label="Send message"
                >
                    <SendIcon className="w-6 h-6"/>
                </button>
            </form>
        </div>
    );
};

// Add a simple fade-in animation using keyframes
const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
`;
document.head.appendChild(style);