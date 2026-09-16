import React, { useState } from 'react';
import {
  Sparkles,
  Key,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Trash2,
  X,
  ShieldCheck,
  HelpCircle,
  Wand2,
  FileText
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { getStoredApiKey, saveApiKey, removeApiKey, testApiKey } from '../services/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onKeyStatusChange: (hasKey: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onKeyStatusChange
}) => {
  const t = translations[currentLang];
  const [keyInput, setKeyInput] = useState(() => getStoredApiKey());
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!keyInput.trim()) {
      removeApiKey();
      onKeyStatusChange(false);
      setMessage(t.ai.keyRemoved);
      return;
    }
    saveApiKey(keyInput.trim());
    onKeyStatusChange(true);
    setMessage(t.ai.keySaved);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRemove = () => {
    removeApiKey();
    setKeyInput('');
    onKeyStatusChange(false);
    setMessage(t.ai.keyRemoved);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleTest = async () => {
    if (!keyInput.trim()) return;
    setTestStatus('testing');
    const isValid = await testApiKey(keyInput.trim());
    setTestStatus(isValid ? 'success' : 'failed');
    setTimeout(() => setTestStatus('idle'), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5 text-white font-bold text-base sm:text-lg">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>{t.ai.settingsTitle}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Status / feedback message */}
          {message && (
            <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>{message}</span>
            </div>
          )}

          {/* API Key Input Section */}
          <div className="glass-panel rounded-2xl p-4 sm:p-5">
            <label className="block text-xs sm:text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-400" />
              <span>{t.ai.apiKeyLabel}</span>
            </label>

            <div className="relative mb-3">
              <input
                type={showKey ? 'text' : 'password'}
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder={t.ai.apiKeyPlaceholder}
                className="w-full bg-slate-950/90 border border-purple-500/30 focus:border-purple-400 rounded-xl py-3 px-4 text-xs sm:text-sm text-white font-mono outline-none transition-all pr-12 pl-4"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute top-1/2 -translate-y-1/2 right-3 p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={showKey ? 'Hide' : 'Show'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Buttons Row */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-purple-500/20 cursor-pointer"
              >
                {t.ai.saveKey}
              </button>

              <button
                type="button"
                onClick={handleTest}
                disabled={testStatus === 'testing' || !keyInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {testStatus === 'testing' ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t.ai.testing}</span>
                  </>
                ) : testStatus === 'success' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">{t.ai.testSuccess}</span>
                  </>
                ) : testStatus === 'failed' ? (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span className="text-rose-400">{t.ai.testFailed}</span>
                  </>
                ) : (
                  <span>{t.ai.testKey}</span>
                )}
              </button>

              {keyInput && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs sm:text-sm flex items-center gap-1 transition-colors cursor-pointer"
                  title={t.ai.removeKey}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Privacy note */}
            <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{t.ai.privacyNotice}</span>
            </div>
          </div>

          {/* How to get API Key Tutorial */}
          <div className="glass-panel rounded-2xl p-4 sm:p-5 border-cyan-500/20">
            <h4 className="text-sm font-bold text-cyan-300 mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>{t.ai.howToGetTitle}</span>
            </h4>

            <div className="space-y-2 text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                {t.ai.steps.step1}
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                {t.ai.steps.step2}
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                {t.ai.steps.step3}
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                {t.ai.steps.step4}
              </div>
            </div>

            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-200 text-xs sm:text-sm font-bold transition-all"
            >
              <span>{t.ai.directLink}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* AI Features List */}
          <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20">
            <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2.5">
              {t.ai.aiFeaturesTitle}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                <span>{t.ai.smartRenameBtn}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span>{t.ai.ocrSummaryBtn}</span>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-slate-400">
              * {t.ai.disabledNote}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors cursor-pointer"
          >
            {t.editor.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};
