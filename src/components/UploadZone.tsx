import React, { useRef, useState } from 'react';
import { CloudUpload, FolderOpen, Camera, Lock, FileText, X } from 'lucide-react';
import { AttachedPDF, Language } from '../types';
import { translations } from '../translations';

interface UploadZoneProps {
  currentLang: Language;
  onFilesSelected: (files: File[]) => void;
  onOpenCamera: () => void;
  attachedPdf: AttachedPDF | null;
  onRemoveAttachedPdf: () => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  currentLang,
  onFilesSelected,
  onOpenCamera,
  attachedPdf,
  onRemoveAttachedPdf
}) => {
  const t = translations[currentLang];
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
      e.target.value = '';
    }
  };

  return (
    <div className="w-full mb-8">
      {/* Attached PDF Notice if user uploaded an existing PDF to merge */}
      {attachedPdf && (
        <div className="mb-4 glass-panel border-rose-500/40 bg-rose-950/30 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-white truncate">
                {attachedPdf.name}
              </div>
              <div className="text-xs text-rose-300">
                {currentLang === 'ar'
                  ? `ملف PDF مرفق (${attachedPdf.pageCount} صفحة) - سيتم دمج صورك معه`
                  : currentLang === 'fr'
                  ? `Fichier PDF joint (${attachedPdf.pageCount} pages) - fusion avec vos images`
                  : `Attached PDF (${attachedPdf.pageCount} pages) - will be merged with your images`}
              </div>
            </div>
          </div>
          <button
            onClick={onRemoveAttachedPdf}
            className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-white transition-colors flex-shrink-0"
            title="إلغاء الملف المرفق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Main Drag-and-Drop Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 border-2 border-dashed backdrop-blur-xl relative overflow-hidden group ${
          isDragOver
            ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01] shadow-2xl shadow-cyan-500/30'
            : 'border-cyan-500/30 hover:border-cyan-400/60 bg-slate-900/50 hover:bg-slate-900/70 hover:shadow-2xl hover:shadow-cyan-500/15'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Central Circular Icon with pulsing ripple */}
        <div className="relative inline-block mb-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-cyan-500/10 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-gradient-to-tr group-hover:from-cyan-500 group-hover:to-purple-600 group-hover:text-white transition-all duration-300 shadow-xl shadow-cyan-500/20">
            <CloudUpload className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2]" />
          </div>
          <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping opacity-30 pointer-events-none" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
          {t.upload.dragDrop}
        </h3>

        <p className="text-sm sm:text-base text-slate-400 mb-6 max-w-md mx-auto">
          {t.upload.orChoose}
        </p>

        {/* Buttons Action Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-extrabold text-sm sm:text-base flex items-center gap-2.5 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <FolderOpen className="w-5 h-5" />
            <span>{t.upload.chooseBtn}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenCamera();
            }}
            className="px-5 sm:px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white font-extrabold text-sm sm:text-base flex items-center gap-2.5 shadow-lg shadow-black/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <Camera className="w-5 h-5 text-cyan-400" />
            <span>{t.upload.cameraBtn}</span>
          </button>
        </div>

        {/* Clipboard paste hint */}
        <div className="text-xs text-slate-400 mb-3 font-medium">
          {t.upload.pasteHint}
        </div>

        {/* Privacy Note */}
        <div className="inline-flex items-center gap-2 text-xs text-slate-400 font-medium px-4 py-1.5 rounded-full bg-slate-950/60 border border-slate-800">
          <Lock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>{t.upload.privacyNote}</span>
        </div>
      </div>
    </div>
  );
};
