import React from 'react';
import type { View } from '../App';
import { ShieldCheckIcon } from './icons';

interface NavItem {
  id: View;
  label: string;
  icon: React.ReactNode;
}

interface NavigationProps {
  activeView: View;
  setActiveView: (view: View) => void;
  navItems: NavItem[];
}

const NavLink: React.FC<{
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
  isSidebar: boolean;
}> = ({ item, isActive, onClick, isSidebar }) => {
  const baseClasses = 'flex items-center gap-3 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E90FF] rounded-md';
  const activeClasses = 'bg-[#1E90FF]/10 text-[#20C997]';
  const inactiveClasses = 'text-gray-400 hover:bg-white/5 hover:text-white';
  
  const sidebarClasses = `px-3 py-2 ${isActive ? activeClasses : inactiveClasses}`;
  const bottomNavClasses = `flex-col justify-center text-xs p-2 w-full ${isActive ? 'text-[#20C997]' : 'text-gray-400 hover:text-white'}`;
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isSidebar ? sidebarClasses : bottomNavClasses}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {item.icon}
      <span className={isSidebar ? 'font-medium' : 'mt-1'}>{isSidebar ? item.label : item.label}</span>
    </button>
  );
};


export const Navigation: React.FC<NavigationProps> = ({ activeView, setActiveView, navItems }) => {
  
  const Sidebar: React.FC = () => (
    <aside className="hidden md:flex flex-col w-64 bg-[#0A0F1F] border-r border-white/10">
        <div className="flex items-center gap-3 h-16 px-4 border-b border-white/10 flex-shrink-0">
            <ShieldCheckIcon className="w-8 h-8 text-[#20C997]" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
            OnGuard
            </h1>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
            <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                <NavLink
                    key={item.id}
                    item={item}
                    isActive={activeView === item.id}
                    onClick={() => setActiveView(item.id)}
                    isSidebar={true}
                />
                ))}
            </nav>
        </div>
    </aside>
  );

  const BottomNav: React.FC = () => (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A0F1F] border-t border-white/10 flex justify-around p-1 z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.id}
          item={item}
          isActive={activeView === item.id}
          onClick={() => setActiveView(item.id)}
          isSidebar={false}
        />
      ))}
    </nav>
  );

  return (
    <>
      <Sidebar />
      <BottomNav />
    </>
  );
};