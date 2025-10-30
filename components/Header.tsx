import React from 'react';
import { SettingsIcon, UserCircleIcon } from './icons';

interface HeaderProps {
  currentPageTitle: string;
}

export const Header: React.FC<HeaderProps> = ({ currentPageTitle }) => {
  return (
    <header className="flex-shrink-0 bg-[#0A0F1F]/80 backdrop-blur-sm border-b border-white/10">
      <div className="flex items-center justify-between p-4 h-16">
        <h1 className="text-xl font-bold text-white tracking-wide">
          {currentPageTitle}
        </h1>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-[#1E90FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E90FF] rounded-full">
            <SettingsIcon className="w-6 h-6" />
            <span className="sr-only">Settings</span>
          </button>
          <button className="text-gray-400 hover:text-[#1E90FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E90FF] rounded-full">
            <UserCircleIcon className="w-7 h-7" />
            <span className="sr-only">Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
};