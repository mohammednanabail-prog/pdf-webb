import React from 'react';
import { HelpCircle, Check, X } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  isOpen,
  onClose,
  currentLang
}) => {
  const t = translations[currentLang];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5 text-white font-bold text-base sm:text-lg">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span>{t.instructions.title}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of items */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3">
          {t.instructions.items.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3 hover:border-cyan-500/30 transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                {item}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-center">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
          >
            {t.instructions.understood}
          </button>
        </div>
      </div>
    </div>
  );
};
