import React, { useState } from 'react';
import {
  RotateCw,
  Trash2,
  Sliders,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Sparkles,
  FileSearch,
  GripVertical,
  Crop,
  Layers,
  ArrowRightLeft
} from 'lucide-react';
import { ImageItem, Language } from '../types';
import { translations } from '../translations';

interface ImagesManagerProps {
  currentLang: Language;
  images: ImageItem[];
  onRemoveImage: (id: string) => void;
  onRotateImage: (id: string) => void;
  onOpenEditor: (image: ImageItem) => void;
  onMoveStep: (id: string, step: number) => void;
  onReorder: (sourceIndex: number, destinationIndex: number) => void;
  onMoveToPosition: (sourceIndex: number, targetIndex: number) => void;
  onClearAll: () => void;
  onReverseOrder: () => void;
  onSortByName: () => void;
  onOcrImage?: (image: ImageItem) => void;
  hasApiKey: boolean;
}

export const ImagesManager: React.FC<ImagesManagerProps> = ({
  currentLang,
  images,
  onRemoveImage,
  onRotateImage,
  onOpenEditor,
  onMoveStep,
  onReorder,
  onMoveToPosition,
  onClearAll,
  onReverseOrder,
  onSortByName,
  onOcrImage,
  hasApiKey
}) => {
  const t = translations[currentLang];
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    if (draggedIndex !== targetIndex) {
      onReorder(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-5 sm:p-7 mb-10 shadow-2xl shadow-black/50">
      {/* Top Header & Batch Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full" />
          <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <span>{t.manage.filesCount}:</span>
            <span className="text-cyan-400 bg-cyan-500/15 border border-cyan-500/30 px-3 py-0.5 rounded-xl font-mono text-sm sm:text-base">
              {images.length}
            </span>
          </h3>
          <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-400 font-semibold bg-slate-900/60 px-3 py-1 rounded-xl border border-slate-800">
            <GripVertical className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {currentLang === 'ar'
                ? 'يمكنك سحب وإفلات أي بطاقة لإعادة ترتيبها أو تغيير رقم الصفحة'
                : 'Drag & drop cards to reorder or change page numbers'}
            </span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={onReverseOrder}
                className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title={t.manage.reverseOrder}
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.manage.reverseOrder}</span>
              </button>

              <button
                type="button"
                onClick={onSortByName}
                className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title={t.manage.sortByName}
              >
                <span>{t.manage.sortByName}</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onClearAll}
            className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.manage.clearAll}</span>
          </button>
        </div>
      </div>

      {/* Grid of Image Cards with Drag and Drop & Visual Numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {images.map((item, index) => {
          const isFlipped = item.flipH || item.flipV;
          const transformStyles = `rotate(${item.rotation}deg) scale(${item.flipH ? -1 : 1}, ${item.flipV ? -1 : 1})`;
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index;

          return (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`group relative bg-slate-950/80 border rounded-2xl overflow-hidden flex flex-col transition-all duration-300 select-none ${
                isDragging
                  ? 'opacity-40 scale-95 border-purple-500'
                  : isDragOver
                  ? 'border-cyan-400 scale-105 shadow-2xl shadow-cyan-500/30 ring-2 ring-cyan-400'
                  : 'border-cyan-500/15 hover:border-cyan-400/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/20'
              }`}
            >
              {/* Image Preview Box */}
              <div
                onClick={() => onOpenEditor(item)}
                className="relative aspect-square w-full bg-slate-900/90 flex items-center justify-center overflow-hidden cursor-pointer"
              >
                <img
                  src={item.dataUrl}
                  alt={item.originalName}
                  style={{
                    transform: transformStyles,
                    filter:
                      item.filter === 'grayscale'
                        ? 'grayscale(100%)'
                        : item.filter === 'scanner'
                        ? 'contrast(160%) brightness(110%) grayscale(80%)'
                        : item.filter === 'contrast'
                        ? 'contrast(140%)'
                        : item.filter === 'sepia'
                        ? 'sepia(80%)'
                        : 'none'
                  }}
                  className="max-w-full max-h-full object-contain p-1 transition-transform duration-300 group-hover:scale-105 pointer-events-none select-none"
                />

                {/* Prominent Page Number Pill with Jump Select */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-2 right-2 flex items-center gap-1 bg-black/85 border border-cyan-400/50 rounded-xl px-2 py-0.5 shadow-lg backdrop-blur-md"
                >
                  <span className="text-[10px] font-bold text-cyan-300 uppercase">
                    {t.manage.page}
                  </span>
                  <select
                    value={index}
                    onChange={(e) => onMoveToPosition(index, parseInt(e.target.value, 10))}
                    className="bg-transparent text-white font-mono font-black text-xs outline-none cursor-pointer"
                    title={currentLang === 'ar' ? 'تغيير رقم الصفحة' : 'Change page number'}
                  >
                    {images.map((_, i) => (
                      <option key={i} value={i} className="bg-slate-900 text-white">
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Crop Badge if cropped */}
                {item.crop && (
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-lg bg-cyan-950/90 border border-cyan-400/60 text-[9px] font-bold text-cyan-300 flex items-center gap-1 shadow-md">
                    <Crop className="w-2.5 h-2.5" />
                    <span>{currentLang === 'ar' ? 'مقصوص' : 'Cropped'}</span>
                  </div>
                )}

                {/* Filter Tag if applied */}
                {item.filter !== 'original' && (
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/40 text-[9px] font-bold text-purple-300">
                    {t.filters[item.filter]}
                  </div>
                )}

                {/* Drag Handle Indicator */}
                <div
                  className="absolute bottom-2 left-2 p-1 rounded-lg bg-black/60 text-slate-400 group-hover:text-cyan-400 group-hover:bg-black/90 transition-all cursor-grab active:cursor-grabbing"
                  title={currentLang === 'ar' ? 'اسحب للترتيب' : 'Drag to reorder'}
                >
                  <GripVertical className="w-3.5 h-3.5" />
                </div>

                {/* Quick Delete X button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveImage(item.id);
                  }}
                  className="absolute top-10 left-2 w-7 h-7 rounded-lg bg-red-600/90 hover:bg-red-500 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md hover:scale-110 cursor-pointer"
                  title={t.manage.delete}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Rotate 90 Button Overlay */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRotateImage(item.id);
                  }}
                  className="absolute top-18 left-2 w-7 h-7 rounded-lg bg-cyan-600/90 hover:bg-cyan-500 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md hover:scale-110 cursor-pointer"
                  title={t.manage.rotate}
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>

                {/* AI OCR Icon Button on card */}
                {hasApiKey && onOcrImage && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOcrImage(item);
                    }}
                    className="absolute top-26 left-2 w-7 h-7 rounded-lg bg-purple-600/90 hover:bg-purple-500 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md hover:scale-110 cursor-pointer"
                    title={t.ai.ocrSummaryBtn}
                  >
                    <FileSearch className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Bottom Bar: Step Navigation & Full Editor */}
              <div className="p-2 bg-slate-950 flex items-center justify-between border-t border-slate-800/80">
                {/* Step Move Backward */}
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => onMoveStep(item.id, -1)}
                  className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                  title={t.manage.moveUp}
                >
                  {currentLang === 'ar' ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronLeft className="w-4 h-4" />
                  )}
                </button>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => onOpenEditor(item)}
                  className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-purple-500/20 text-slate-300 hover:text-purple-300 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  title={t.manage.edit}
                >
                  <Sliders className="w-3 h-3 text-purple-400" />
                  <span>{t.manage.edit}</span>
                </button>

                {/* Step Move Forward */}
                <button
                  type="button"
                  disabled={index === images.length - 1}
                  onClick={() => onMoveStep(item.id, 1)}
                  className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                  title={t.manage.moveDown}
                >
                  {currentLang === 'ar' ? (
                    <ChevronLeft className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
