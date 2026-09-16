import React from 'react';
import { FolderPlus, Camera, Wand2, SlidersHorizontal, Settings } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface MobileBottomNavProps {
  currentLang: Language;
  imagesCount: number;
  onPickFiles: () => void;
  onOpenCamera: () => void;
  onConvert: () => void;
  onOpenOptions: () => void;
  onOpenSettings: () => void;
  isConverting: boolean;
  hasApiKey: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentLang,
  imagesCount,
  onPickFiles,
  onOpenCamera,
  onConvert,
  onOpenOptions,
  onOpenSettings,
  isConverting,
  hasApiKey: _hasApiKey
}) => {
  const t = translations[currentLang];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-cyan-500/20 backdrop-blur-2xl px-2 py-2 flex items-center justify-around sm:hidden shadow-2xl shadow-black">
      {/* Pick Files */}
      <button
        type="button"
        onClick={onPickFiles}
        className="flex-1 flex flex-col items-center gap-1 text-slate-300 hover:text-cyan-400 active:scale-95 transition-all cursor-pointer"
      >
        <FolderPlus className="w-5 h-5 text-cyan-400" />
        <span className="text-[10px] font-bold">
          {currentLang === 'ar' ? 'صور' : currentLang === 'fr' ? 'Photos' : 'Photos'}
        </span>
      </button>

      {/* Camera */}
      <button
        type="button"
        onClick={onOpenCamera}
        className="flex-1 flex flex-col items-center gap-1 text-slate-300 hover:text-cyan-400 active:scale-95 transition-all cursor-pointer"
      >
        <Camera className="w-5 h-5 text-cyan-400" />
        <span className="text-[10px] font-bold">
          {currentLang === 'ar' ? 'كاميرا' : currentLang === 'fr' ? 'Caméra' : 'Camera'}
        </span>
      </button>

      {/* Convert (Prominent center button) */}
      <div className="flex-1 flex justify-center">
        <button
          type="button"
          onClick={onConvert}
          disabled={isConverting || imagesCount === 0}
          className="relative -top-3 w-13 h-13 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 text-white flex items-center justify-center shadow-xl shadow-cyan-500/40 active:scale-90 transition-transform disabled:opacity-50 disabled:cursor-not-allowed border-2 border-slate-950 cursor-pointer"
          title={t.controls.convertBtn}
        >
          {isConverting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Wand2 className="w-6 h-6 stroke-[2.3]" />
          )}
          {imagesCount > 0 && !isConverting && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-slate-900 shadow-md">
              {imagesCount}
            </span>
          )}
        </button>
      </div>

      {/* Options (Scroll to ControlsBar / Options) */}
      <button
        type="button"
        onClick={onOpenOptions}
        className="flex-1 flex flex-col items-center gap-1 text-slate-300 hover:text-cyan-400 active:scale-95 transition-all cursor-pointer"
      >
        <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
        <span className="text-[10px] font-bold">
          {currentLang === 'ar' ? 'خيارات' : currentLang === 'fr' ? 'Options' : 'Options'}
        </span>
      </button>

      {/* Settings */}
      <button
        type="button"
        onClick={onOpenSettings}
        className="flex-1 flex flex-col items-center gap-1 text-slate-300 hover:text-purple-400 active:scale-95 transition-all cursor-pointer"
      >
        <Settings className="w-5 h-5 text-slate-400" />
        <span className="text-[10px] font-bold">
          {currentLang === 'ar' ? 'إعدادات' : currentLang === 'fr' ? 'Paramètres' : 'Settings'}
        </span>
      </button>
    </div>
  );
};
