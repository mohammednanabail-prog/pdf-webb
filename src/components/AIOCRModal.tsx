import React, { useState } from 'react';
import { Sparkles, Copy, Check, X, FileText, Bookmark } from 'lucide-react';
import { AIAnalysisResult, Language } from '../types';
import { translations } from '../translations';

interface AIOCRModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AIAnalysisResult | null;
  isLoading: boolean;
  currentLang: Language;
}

export const AIOCRModal: React.FC<AIOCRModalProps> = ({
  isOpen,
  onClose,
  result,
  isLoading,
  currentLang
}) => {
  const t = translations[currentLang];
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!result) return;
    const fullText = `[${result.detectedTitle || 'Document'}]\n\nSummary:\n${
      result.summary || ''
    }\n\nExtracted Text:\n${result.extractedText || ''}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5 text-white font-bold text-base">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>{t.ai.ocrModalTitle}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-purple-300">
              <div className="w-8 h-8 border-3 border-purple-400/20 border-t-purple-400 rounded-full animate-spin" />
              <p className="text-sm font-semibold">{t.ai.analyzingImage}</p>
            </div>
          ) : result ? (
            <>
              {/* Document metadata */}
              {result.detectedTitle && (
                <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/25">
                  <div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{result.documentType || 'Document'}</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-white">
                    {result.detectedTitle}
                  </h4>
                </div>
              )}

              {/* Summary */}
              {result.summary && (
                <div className="glass-panel rounded-2xl p-4">
                  <h5 className="text-xs font-bold text-cyan-300 mb-2">
                    {currentLang === 'ar' ? 'ملخص المحتوى الذكي' : currentLang === 'fr' ? 'Résumé intelligent' : 'Smart Summary'}
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {result.summary}
                  </p>
                </div>
              )}

              {/* Extracted Text */}
              {result.extractedText && (
                <div className="glass-panel rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{currentLang === 'ar' ? 'النص الكامل المقروء' : currentLang === 'fr' ? 'Texte extrait' : 'Extracted Text'}</span>
                    </h5>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">{t.ai.textCopied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{t.ai.copyText}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-950/80 rounded-xl text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto border border-slate-800">
                    {result.extractedText}
                  </pre>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-slate-400 py-8 text-sm">
              {currentLang === 'ar' ? 'لم يتم العثور على نص' : 'No text could be extracted'}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            {t.ai.ocrClose}
          </button>
        </div>
      </div>
    </div>
  );
};
