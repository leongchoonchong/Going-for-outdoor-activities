import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenPlanner: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigate,
  isDarkMode,
  onToggleTheme,
  onOpenPlanner
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('advisor');
          }}
          className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 hover:opacity-90"
        >
          SG Weather & Outdoor
        </a>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
          <button
            onClick={() => onNavigate('advisor')}
            className={`hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'advisor' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            Activity Advisor
          </button>
          <button
            onClick={() => onNavigate('map')}
            className={`hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'map' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            Radar Map
          </button>
          <button
            onClick={() => onNavigate('destinations')}
            className={`hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'destinations' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            Destinations
          </button>
          <button
            onClick={() => onNavigate('forecast')}
            className={`hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'forecast' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            Forecast
          </button>
        </nav>

        {/* Zone 3: 1 primary action button + theme toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleTheme}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenPlanner}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 dark:text-white" />
            <span>AI Route Coach</span>
          </button>
        </div>
      </div>
    </header>
  );
};
