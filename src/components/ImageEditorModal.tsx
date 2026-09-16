import React, { useState } from 'react';
import {
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Check,
  X,
  Undo2,
  Sliders,
  Sun,
  Contrast
} from 'lucide-react';
import { CropBox, ImageFilter, ImageItem, Language } from '../types';
import { translations } from '../translations';

interface ImageEditorModalProps {
  image: ImageItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: ImageItem) => void;
  currentLang: Language;
  hasApiKey: boolean;
}

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({
  image,
  isOpen,
  onClose,
  onSave,
  currentLang
}) => {
  const t = translations[currentLang];

  if (!isOpen || !image) return null;

  const [rotation, setRotation] = useState(image.rotation || 0);
  const [filter, setFilter] = useState<ImageFilter>(image.filter || 'original');
  const [brightness, setBrightness] = useState(image.brightness || 100);
  const [contrast, setContrast] = useState(image.contrast || 100);
  const [flipH, setFlipH] = useState(image.flipH || false);
  const [flipV, setFlipV] = useState(image.flipV || false);
  const [crop, setCrop] = useState<CropBox | undefined>(image.crop);

  const handleReset = () => {
    setRotation(0);
    setFilter('original');
    setBrightness(100);
    setContrast(100);
    setFlipH(false);
    setFlipV(false);
    setCrop(undefined);
  };

  const handleSave = () => {
    onSave({
      ...image,
      rotation,
      filter,
      brightness,
      contrast,
      flipH,
      flipV,
      crop
    });
    onClose();
  };

  const filtersList: { key: ImageFilter; label: string; icon: string }[] = [
    { key: 'original', label: t.filters.original, icon: '🎨' },
    { key: 'scanner', label: t.filters.scanner, icon: '📄' },
    { key: 'grayscale', label: t.filters.grayscale, icon: '⚪' },
    { key: 'contrast', label: t.filters.contrast, icon: '✨' },
    { key: 'sepia', label: t.filters.sepia, icon: '☕' }
  ];

  const previewTransform = `rotate(${rotation}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`;
  const filterString = `brightness(${brightness}%) contrast(${contrast}%) ${
    filter === 'grayscale'
      ? 'grayscale(100%)'
      : filter === 'scanner'
      ? 'contrast(170%) brightness(115%) grayscale(80%)'
      : filter === 'contrast'
      ? 'contrast(140%)'
      : filter === 'sepia'
      ? 'sepia(80%)'
      : ''
  }`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[95vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>{t.editor.title}</span>
            <span className="text-xs text-slate-400 font-mono">({image.originalName})</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview viewport with Crop Overlay */}
        <div className="relative bg-slate-950 p-6 flex items-center justify-center min-h-[260px] max-h-[42vh] overflow-hidden select-none">
          <div className="relative inline-block max-h-[36vh] max-w-full">
            <img
              src={image.dataUrl}
              alt="Preview"
              style={{
                transform: previewTransform,
                filter: filterString
              }}
              className="max-h-[36vh] max-w-full object-contain transition-all duration-200 select-none shadow-xl block"
            />

            {/* Document Crop Overlay Box */}
            {crop && (
              <div
                style={{
                  left: `${crop.x}%`,
                  top: `${crop.y}%`,
                  width: `${crop.width}%`,
                  height: `${crop.height}%`
                }}
                className="absolute border-2 border-dashed border-cyan-400 bg-cyan-400/10 pointer-events-none transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
              >
                {/* 4 Corners */}
                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-cyan-400 rounded-sm" />
                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-cyan-400 rounded-sm" />
                <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-cyan-400 rounded-sm" />
                <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-cyan-400 rounded-sm" />

                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-bold text-cyan-300">
                  {t.editor.cropDoc}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tools Section */}
        <div className="p-5 bg-slate-900 space-y-4 overflow-y-auto border-t border-slate-800">
          {/* Preset Filters Row */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2">
              {t.editor.filter}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {filtersList.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    filter === f.key
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span className="text-base">{f.icon}</span>
                  <span className="truncate w-full text-center">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders: Brightness & Contrast */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  {t.editor.brightness}
                </span>
                <span className="font-mono text-cyan-400">{brightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Contrast className="w-3.5 h-3.5 text-purple-400" />
                  {t.editor.contrast}
                </span>
                <span className="font-mono text-purple-400">{contrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>
          </div>

          {/* Quick Transformations Bar: Rotate, Flip */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRotation((prev) => (prev - 90 + 360) % 360)}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Rotate -90°"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Rotate +90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setFlipH((prev) => !prev)}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  flipH
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                }`}
                title={t.editor.flipH}
              >
                <FlipHorizontal className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setFlipV((prev) => !prev)}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  flipV
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                }`}
                title={t.editor.flipV}
              >
                <FlipVertical className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>{t.editor.reset}</span>
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
          >
            {t.editor.cancel}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{t.editor.save}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
