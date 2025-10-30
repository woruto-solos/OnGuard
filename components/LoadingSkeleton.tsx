import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="card mt-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-5 bg-white/10 rounded w-1/3"></div>
        <div className="h-7 bg-white/10 rounded-full w-24"></div>
      </div>
      <div className="mt-4 border-t border-white/10 pt-4">
        <div className="space-y-6">
          <div>
            <div className="h-4 bg-white/10 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-white/5 rounded w-full"></div>
            <div className="h-4 bg-white/5 rounded w-5/6 mt-2"></div>
          </div>
          <div>
            <div className="h-4 bg-white/10 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-white/5 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};