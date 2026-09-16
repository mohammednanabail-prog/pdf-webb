import React, { useState } from 'react';
import { FileText, Globe, Info, Sparkles, Sliders } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenInstructions: () => void;
  onOpenSettings: () => void;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  onOpenInstructions,
  onOpenSettings,
  hasApiKey
}) => {
  const t = translations[currentLang];
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' }
  ];

  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between z-40 relative">
      {/* Logo */}
      <div className="flex items-center gap-3.5 cursor-pointer group">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-300">
          <FileText className="w-6 h-6 stroke-[2.2]" />
        </div>
        <div>
          <h2 className="text-xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent tracking-tight">
            {t.appTitle}
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            {t.appSubtitle}
          </span>
        </div>
      </div>

      {/* Navigation & Controls */}
      <nav className="flex items-center gap-2 sm:gap-3 bg-slate-900/70 border border-cyan-500/20 rounded-2xl p-1.5 backdrop-blur-xl shadow-lg shadow-black/40">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:text-white hover:bg-cyan-500/10 transition-colors border border-transparent hover:border-cyan-500/20"
            title="Change Language / تغيير اللغة"
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="uppercase">{currentLang}</span>
          </button>

          {langMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setLangMenuOpen(false)}
              />
              <div
                className={`absolute top-full mt-2 ${
                  currentLang === 'ar' ? 'left-0' : 'right-0'
                } z-50 bg-slate-900/95 border border-cyan-500/30 rounded-2xl shadow-2xl p-1.5 min-w-[140px] backdrop-blur-2xl`}
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      currentLang === lang.code
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30'
                        : 'text-slate-300 hover:bg-cyan-500/10 hover:text-white'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* AI Settings Trigger */}
        <button
          onClick={onOpenSettings}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all relative ${
            hasApiKey
              ? 'text-purple-300 bg-purple-500/15 border border-purple-500/30 hover:bg-purple-500/25'
              : 'text-slate-300 hover:text-white hover:bg-cyan-500/10 border border-transparent'
          }`}
          title={t.ai.settingsTitle}
        >
          <Sparkles className={`w-4 h-4 ${hasApiKey ? 'text-purple-400 animate-pulse' : 'text-purple-400'}`} />
          <span className="hidden sm:inline">{t.nav.aiSettings}</span>
          {hasApiKey && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
          )}
        </button>

        {/* Instructions */}
        <button
          onClick={onOpenInstructions}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:text-white hover:bg-cyan-500/10 transition-colors border border-transparent hover:border-cyan-500/20"
          title={t.nav.instructions}
        >
          <Info className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">{t.nav.instructions}</span>
        </button>
      </nav>
    </header>
  );
};
