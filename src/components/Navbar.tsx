import React from 'react';
import { Award, Moon, Sun, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenCertificate: () => void;
  onOpenAITutor: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenCertificate,
  onOpenAITutor,
  isDark,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => onSelectTab('catalog')}>
          <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg shadow-sm">
            ن
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
            نِبراس التعليمية
          </span>
        </div>

        {/* Zone 2: 4–5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onSelectTab('catalog')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-amber-600 dark:hover:text-amber-400 ${
              currentTab === 'catalog' ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''
            }`}
          >
            المسارات والدورات
          </button>
          
          <button
            onClick={() => onSelectTab('lab')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-amber-600 dark:hover:text-amber-400 ${
              currentTab === 'lab' ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''
            }`}
          >
            مختبر المحاكاة التفاعلي
          </button>

          <button
            onClick={() => onSelectTab('flashcards')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-amber-600 dark:hover:text-amber-400 ${
              currentTab === 'flashcards' ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''
            }`}
          >
            بطاقات الاستذكار
          </button>

          <button
            onClick={onOpenAITutor}
            className="flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 text-amber-700 dark:text-amber-300 hover:text-amber-800 font-medium"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>المعلّم الذكي</span>
          </button>

          <button
            onClick={() => onSelectTab('progress')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-amber-600 dark:hover:text-amber-400 ${
              currentTab === 'progress' ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''
            }`}
          >
            لوحة إنجازي
          </button>
        </nav>

        {/* Zone 3: 1 primary action + theme toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleTheme}
            aria-label="تبديل المظهر"
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          <button
            onClick={onOpenCertificate}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <Award className="w-4 h-4" />
            <span>إصدار شهادة الإنجاز</span>
          </button>
        </div>

      </div>
    </header>
  );
};
