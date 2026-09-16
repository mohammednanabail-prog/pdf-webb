import React from 'react';
import {
  CheckCircle,
  Share2,
  Download,
  Copy,
  Mail,
  Eye,
  X,
  FileText
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfBlob: Blob | null;
  fileName: string;
  pageCount: number;
  currentLang: Language;
  onPreview: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  pdfBlob,
  fileName,
  pageCount,
  currentLang,
  onPreview,
  onShowToast
}) => {
  const t = translations[currentLang];

  if (!isOpen || !pdfBlob) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
    onShowToast(t.toasts.pdfGenerated, 'success');
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      onShowToast('Web Share API not supported on this device', 'info');
      return;
    }

    try {
      const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: fileName,
          text: t.appTitle
        });
      } else {
        await navigator.share({
          title: fileName,
          url: window.location.href
        });
      }
      onShowToast(t.share.shareSuccess, 'success');
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err);
      }
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`📄 ${fileName}\nCreated with Image → PDF Pro: ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleTelegram = () => {
    const text = encodeURIComponent(`📄 ${fileName}`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(fileName);
    const body = encodeURIComponent(`PDF Document created with Image → PDF Pro.\n${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleCopyFile = async () => {
    try {
      if (navigator.clipboard && (window as any).ClipboardItem) {
        const item = new (window as any).ClipboardItem({ 'application/pdf': pdfBlob });
        await navigator.clipboard.write([item]);
        onShowToast(t.share.copySuccess, 'success');
      } else {
        onShowToast('Direct clipboard file copy not supported', 'info');
      }
    } catch (err) {
      console.error(err);
      onShowToast('Failed to copy file to clipboard', 'error');
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 text-center my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-cyan-500/30">
          <CheckCircle className="w-9 h-9 stroke-[2.5]" />
        </div>

        <h3 className="text-xl font-black text-white mb-1.5">
          {t.share.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mb-6">
          {t.share.desc}
        </p>

        {/* File Info Box */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-cyan-500/20 mb-6 flex items-center gap-3 text-right">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs sm:text-sm font-bold text-white truncate">
              {fileName}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {formatFileSize(pdfBlob.size)} • {pageCount} {t.manage.page}
            </div>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {/* Download */}
          <button
            onClick={handleDownload}
            className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t.share.download}</span>
          </button>

          {/* In-app Preview */}
          <button
            onClick={onPreview}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 border border-cyan-500/20 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>{t.share.preview}</span>
          </button>

          {/* Native Web Share */}
          {hasNativeShare && (
            <button
              onClick={handleNativeShare}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>{t.share.quickShare}</span>
            </button>
          )}

          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="p-3 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-emerald-500/30 transition-all cursor-pointer"
          >
            <span className="text-base">💬</span>
            <span>{t.share.whatsapp}</span>
          </button>

          {/* Telegram */}
          <button
            onClick={handleTelegram}
            className="p-3 rounded-2xl bg-sky-950/40 hover:bg-sky-900/50 text-sky-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-sky-500/30 transition-all cursor-pointer"
          >
            <span className="text-base">✈️</span>
            <span>{t.share.telegram}</span>
          </button>

          {/* Email */}
          <button
            onClick={handleEmail}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
          >
            <Mail className="w-4 h-4 text-amber-400" />
            <span>{t.share.email}</span>
          </button>
        </div>

        {/* Copy File Option */}
        <button
          onClick={handleCopyFile}
          className="w-full py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-950 text-slate-400 hover:text-white border border-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer mb-3"
        >
          <Copy className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t.share.copyFile}</span>
        </button>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-xl text-slate-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
        >
          {t.share.close}
        </button>
      </div>
    </div>
  );
};
