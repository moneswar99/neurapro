import React from 'react';
import { DatabaseService } from '../services/db';
import { NeuraMorphixLogo } from './NeuraMorphixLogo';
import { Search, UserPlus } from 'lucide-react';

interface HeaderProps {
  currentTab: 'home' | 'apply' | 'track' | 'admin';
  onSelectTab: (tab: 'home' | 'apply' | 'track' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab }) => {
  const windowStatus = DatabaseService.isRecruitmentOpen();
  const [timeStr, setTimeStr] = React.useState('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFF5DF]/95 border-b-[3px] border-[#5C3928] backdrop-blur-md shadow-[0_4px_16px_rgba(92,57,40,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2 sm:gap-3.5 cursor-pointer group shrink-0"
        >
          <NeuraMorphixLogo size={42} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-xl font-black tracking-wider text-[#3D2316] font-cartoon uppercase group-hover:text-[#527A58] transition-colors">
                NEURAMORPHIX
              </span>
            </div>
            {/* Full subtitle — desktop only */}
            <div className="hidden sm:flex items-center gap-2 text-[10px] text-[#A96F45] font-black uppercase tracking-widest font-cartoon">
              <span>Recruitment 2026</span>
              <span>•</span>
              <span className="text-[#5C3928]">05 Sep – 18 Sep 2026</span>
              {timeStr && (
                <>
                  <span>•</span>
                  <span className="text-[#527A58] font-mono font-bold">{timeStr}</span>
                </>
              )}
            </div>
            {/* Compact — mobile only */}
            <div className="flex sm:hidden text-[9px] text-[#A96F45] font-black uppercase tracking-wide font-cartoon">
              Recruitment 2026
            </div>
          </div>
        </div>

        {/* Navigation Tabs — desktop only */}
        <nav className="hidden md:flex items-center gap-2 bg-[#FFFDF7] p-1.5 rounded-2xl border-2 border-[#5C3928] shadow-[2px_2px_0px_#5C3928]">
          <button
            type="button"
            onClick={() => onSelectTab('home')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider font-cartoon transition-all cursor-pointer ${
              currentTab === 'home'
                ? 'bg-[#527A58] text-white shadow-[2px_2px_0px_#5C3928] scale-105'
                : 'text-[#5C3928] hover:text-[#3D2316] hover:bg-[#FFF5DF]'
            }`}
          >
            Explore Squads
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('apply')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider font-cartoon transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'apply'
                ? 'bg-[#527A58] text-white shadow-[2px_2px_0px_#5C3928] scale-105'
                : 'text-[#5C3928] hover:text-[#3D2316] hover:bg-[#FFF5DF]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
            Apply Now
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('track')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider font-cartoon transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'track'
                ? 'bg-[#527A58] text-white shadow-[2px_2px_0px_#5C3928] scale-105'
                : 'text-[#5C3928] hover:text-[#3D2316] hover:bg-[#FFF5DF]'
            }`}
          >
            <Search className="w-3.5 h-3.5 stroke-[2.5]" />
            Track Status
          </button>
        </nav>

        {/* Recruitment Status Pill */}
        <div className="flex items-center shrink-0">
          <span
            className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider font-cartoon flex items-center gap-1.5 border-2 border-[#5C3928] shadow-[2px_2px_0px_#5C3928] ${
              windowStatus.isOpen
                ? 'bg-[#527A58] text-white'
                : 'bg-[#D96B4C] text-white'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 border border-white/40 ${
                windowStatus.isOpen ? 'bg-[#FFFDF7] animate-pulse' : 'bg-[#FFFDF7]'
              }`}
            ></span>
            <span className="hidden sm:inline">{windowStatus.isOpen ? 'RECRUITMENT OPEN' : 'RECRUITMENT CLOSED'}</span>
            <span className="sm:hidden">{windowStatus.isOpen ? 'OPEN' : 'CLOSED'}</span>
          </span>
        </div>
      </div>

      {/* Mobile bottom nav tabs — only visible on mobile */}
      <div className="flex md:hidden border-t-2 border-[#5C3928] bg-[#FFF5DF]">
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          className={`flex-1 py-2.5 text-[11px] font-black uppercase font-cartoon transition-all flex flex-col items-center gap-0.5 ${
            currentTab === 'home' ? 'text-[#527A58] bg-[#FFFDF7] border-b-4 border-[#527A58]' : 'text-[#A96F45]'
          }`}
        >
          <span>🏠</span>
          <span>Squads</span>
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('apply')}
          className={`flex-1 py-2.5 text-[11px] font-black uppercase font-cartoon transition-all flex flex-col items-center gap-0.5 ${
            currentTab === 'apply' ? 'text-[#527A58] bg-[#FFFDF7] border-b-4 border-[#527A58]' : 'text-[#A96F45]'
          }`}
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>Apply</span>
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('track')}
          className={`flex-1 py-2.5 text-[11px] font-black uppercase font-cartoon transition-all flex flex-col items-center gap-0.5 ${
            currentTab === 'track' ? 'text-[#527A58] bg-[#FFFDF7] border-b-4 border-[#527A58]' : 'text-[#A96F45]'
          }`}
        >
          <Search className="w-4 h-4 stroke-[2.5]" />
          <span>Track</span>
        </button>
      </div>
    </header>
  );
};
