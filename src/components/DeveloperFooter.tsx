import React from 'react';
import { Heart } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface DeveloperFooterProps {
  currentLang: Language;
}

export const DeveloperFooter: React.FC<DeveloperFooterProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  return (
    <footer className="w-full mt-16 pt-10 border-t border-slate-800/80 text-center flex flex-col items-center relative">
      {/* Decorative gradient glowing bar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full shadow-lg shadow-cyan-500/50" />

      {/* Developer badge label */}
      <span className="text-[11px] sm:text-xs tracking-[0.25em] text-cyan-400 font-extrabold uppercase mb-2">
        {t.devFooter.devBy}
      </span>

      {/* Developer Name in Arabic Calligraphic Amiri */}
      <h2 className="font-['Amiri'] text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-cyan-100 to-purple-200 bg-clip-text text-transparent drop-shadow-[0_4px_25px_rgba(0,212,255,0.4)] my-1">
        {t.devFooter.nameAr}
      </h2>

      {/* Developer Name in English with flanking decorative lines */}
      <div className="relative text-xs sm:text-sm text-slate-400 tracking-[0.2em] font-medium uppercase mt-1 mb-4 px-10">
        <span className="hidden sm:inline-block w-8 h-px bg-gradient-to-r from-transparent to-cyan-500/60 align-middle mr-3" />
        <span>{t.devFooter.nameEn}</span>
        <span className="hidden sm:inline-block w-8 h-px bg-gradient-to-l from-transparent to-cyan-500/60 align-middle ml-3" />
      </div>

      {/* Love tag with pulsing heart */}
      <div className="flex flex-col items-center gap-1.5 text-xs sm:text-sm text-slate-400 font-semibold">
        <Heart className="w-5 h-5 text-pink-500 fill-pink-500/30 animate-pulse drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]" />
        <span>{t.devFooter.withLove}</span>
      </div>

      <div className="mt-8 text-[11px] text-slate-500">
        © {new Date().getFullYear()} Image → PDF Pro • All processing happens on-device
      </div>
    </footer>
  );
};
