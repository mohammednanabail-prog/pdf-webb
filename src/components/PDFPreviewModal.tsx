import React from 'react';
import { X, Download, Share2, FileText } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfBlob: Blob | null;
  fileName: string;
  currentLang: Language;
}

export const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({
  isOpen,
  onClose,
  pdfBlob,
  fileName,
  currentLang
}) => {
  const t = translations[currentLang];

  if (!isOpen || !pdfBlob) return null;

  const pdfUrl = URL.createObjectURL(pdfBlob);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-6 overflow-hidden">
      <div className="relative w-full max-w-4xl h-[92vh] bg-slate-900 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base min-w-0">
            <FileText className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <span className="truncate">{fileName}</span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t.share.download}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Frame */}
        <div className="flex-1 bg-slate-950 overflow-hidden">
          <iframe
            src={pdfUrl}
            title={fileName}
            className="w-full h-full border-none"
          />
        </div>
      </div>
    </div>
  );
};
