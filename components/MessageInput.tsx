import React from 'react';

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ message, setMessage, onAnalyze, isLoading }) => {
  return (
    <div className="flex flex-col gap-4">
      <label htmlFor="message-input" className="sr-only">
        Paste the message you want to analyze
      </label>
      <textarea
        id="message-input"
        rows={6}
        className="w-full p-4 bg-[#121926] border border-white/20 rounded-lg text-[#E0E0E0] focus:ring-2 focus:ring-[#1E90FF] focus:border-[#1E90FF] transition-all duration-200 placeholder-gray-500 resize-none"
        placeholder="Paste a message here to check if it's safe..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isLoading}
      />
      <button
        onClick={onAnalyze}
        disabled={isLoading || !message.trim()}
        className="w-full flex justify-center items-center gap-2 bg-[#1E90FF] hover:bg-opacity-80 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121926] focus:ring-[#1E90FF]"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          'Analyze Message'
        )}
      </button>
    </div>
  );
};