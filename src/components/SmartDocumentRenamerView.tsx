import React, { useState, useRef } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  Archive,
  Trash2,
  Edit3,
  User,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  Eye,
  X,
  Layers,
  FolderArchive
} from 'lucide-react';
import { Language, SmartDocumentItem } from '../types';
import {
  fileToDataUrl,
  generateHeuristicFallback,
  downloadSingleSmartDocument,
  downloadAllSmartDocumentsZip,
  prepareSmartDocumentItems
} from '../utils/smartDocumentRenamer';
import { analyzeAndRenameDocument } from '../services/geminiService';

interface SmartDocumentRenamerViewProps {
  currentLang: Language;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hasApiKey: boolean;
  onOpenSettings: () => void;
}

export const SmartDocumentRenamerView: React.FC<SmartDocumentRenamerViewProps> = ({
  currentLang,
  onShowToast,
  hasApiKey,
  onOpenSettings
}) => {
  const [items, setItems] = useState<SmartDocumentItem[]>([]);
  const [isAnalyzingAll, setIsAnalyzingAll] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgressText, setZipProgressText] = useState('');
  const [previewModalItem, setPreviewModalItem] = useState<SmartDocumentItem | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle incoming files
  const handleFilesAdded = async (files: File[]) => {
    if (files.length === 0) return;
    try {
      const newItems = await prepareSmartDocumentItems(files);
      setItems((prev) => [...prev, ...newItems]);
      onShowToast(
        currentLang === 'ar'
          ? `تمت إضافة ${newItems.length} مستند بنجاح`
          : `Added ${newItems.length} document(s)`,
        'info'
      );

      // Auto-analyze newly added items
      analyzeBatch(newItems);
    } catch (err) {
      console.error(err);
      onShowToast('حدث خطأ أثناء قراءة الملفات', 'error');
    }
  };

  // Analyze single document
  const analyzeSingleItem = async (item: SmartDocumentItem) => {
    setItems((prev) =>
      prev.map((doc) =>
        doc.id === item.id ? { ...doc, status: 'analyzing', errorMessage: undefined } : doc
      )
    );

    try {
      const dataUrl = item.base64Data || (await fileToDataUrl(item.originalFile));

      const analysis = await analyzeAndRenameDocument(
        dataUrl,
        item.mimeType,
        item.originalName,
        currentLang
      );

      if (analysis) {
        setItems((prev) =>
          prev.map((doc) =>
            doc.id === item.id
              ? {
                  ...doc,
                  base64Data: dataUrl,
                  status: 'done',
                  analysis,
                  customFileName: analysis.suggestedFileName
                }
              : doc
          )
        );
      } else {
        // Fallback heuristic classification
        const fallback = generateHeuristicFallback(item.originalName, currentLang);
        setItems((prev) =>
          prev.map((doc) =>
            doc.id === item.id
              ? {
                  ...doc,
                  base64Data: dataUrl,
                  status: 'done',
                  analysis: fallback,
                  customFileName: fallback.suggestedFileName
                }
              : doc
          )
        );
      }
    } catch (err: any) {
      console.warn('Analysis error:', err);
      const fallback = generateHeuristicFallback(item.originalName, currentLang);
      setItems((prev) =>
        prev.map((doc) =>
          doc.id === item.id
            ? {
                ...doc,
                status: 'done',
                analysis: fallback,
                customFileName: fallback.suggestedFileName
              }
            : doc
        )
      );
    }
  };

  // Analyze a list of items sequentially/in batch
  const analyzeBatch = async (batch: SmartDocumentItem[]) => {
    setIsAnalyzingAll(true);
    for (const doc of batch) {
      await analyzeSingleItem(doc);
    }
    setIsAnalyzingAll(false);
  };

  // Analyze all pending or all items
  const handleAnalyzeAll = async () => {
    if (items.length === 0) return;
    setIsAnalyzingAll(true);
    for (const doc of items) {
      await analyzeSingleItem(doc);
    }
    setIsAnalyzingAll(false);
    onShowToast(
      currentLang === 'ar'
        ? 'اكتمل فحص وتسمية جميع المستندات بنجاح!'
        : 'All documents inspected and renamed!',
      'success'
    );
  };

  // Download single item
  const handleDownloadSingle = async (item: SmartDocumentItem) => {
    try {
      await downloadSingleSmartDocument(item);
      onShowToast(
        currentLang === 'ar'
          ? `جاري تحميل ${item.customFileName || item.analysis?.suggestedFileName}`
          : `Downloading ${item.customFileName || item.analysis?.suggestedFileName}`,
        'success'
      );
    } catch (err) {
      console.error(err);
      onShowToast('حدث خطأ أثناء تحميل الملف', 'error');
    }
  };

  // Download all as ZIP
  const handleDownloadZip = async () => {
    if (items.length === 0) return;
    setIsZipping(true);
    setZipProgressText(currentLang === 'ar' ? 'جاري تجهيز المستندات...' : 'Preparing docs...');

    try {
      const archiveName =
        currentLang === 'ar'
          ? `مستندات_مفحوصة_${new Date().toISOString().slice(0, 10)}.zip`
          : `Inspected_Documents_${new Date().toISOString().slice(0, 10)}.zip`;

      await downloadAllSmartDocumentsZip(items, archiveName, (percent, currentFile) => {
        setZipProgressText(`${percent}% - ${currentFile}`);
      });

      onShowToast(
        currentLang === 'ar'
          ? 'تم إنشاء وتحميل الملف المضغوط (ZIP) بنجاح!'
          : 'ZIP file created and downloaded successfully!',
        'success'
      );
    } catch (err) {
      console.error(err);
      onShowToast('حدث خطأ أثناء إنشاء ملف ZIP', 'error');
    } finally {
      setIsZipping(false);
      setZipProgressText('');
    }
  };

  const handleUpdateName = (id: string, newName: string) => {
    setItems((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, customFileName: newName } : doc))
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm(currentLang === 'ar' ? 'هل تريد مسح جميع المستندات المرفوعة؟' : 'Clear all?')) {
      setItems([]);
    }
  };

  const completedCount = items.filter((d) => d.status === 'done').length;

  return (
    <div className="w-full space-y-6">
      {/* Upload & Feature Introduction Area */}
      {items.length === 0 ? (
        <div
          onDragEnter={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragOver(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            const files = Array.from(e.dataTransfer.files) as File[];
            handleFilesAdded(files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 border-2 border-dashed backdrop-blur-xl relative overflow-hidden group ${
            isDragOver
              ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01] shadow-2xl shadow-cyan-500/30'
              : 'border-cyan-500/30 hover:border-cyan-400/60 bg-slate-900/60 hover:bg-slate-900/80 shadow-2xl shadow-cyan-500/10'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="application/pdf,image/*"
            onChange={(e) => {
              if (e.target.files) {
                handleFilesAdded(Array.from(e.target.files) as File[]);
                e.target.value = '';
              }
            }}
            className="hidden"
          />

          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-5 rounded-3xl bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-blue-500/20 border-2 border-cyan-400/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:border-cyan-300 transition-all duration-300 shadow-xl shadow-cyan-500/20">
            <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
            {currentLang === 'ar'
              ? 'رفع وفحص المستندات الذكية (PDF وصور)'
              : 'Upload & AI Inspect Documents (PDFs & Images)'}
          </h3>

          <p className="text-sm sm:text-base text-slate-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            {currentLang === 'ar'
              ? 'ارفع جوازات السفر، بطاقات الهوية، شهادات الميلاد، العقود، أو الفواتير دفعة واحدة. سيقوم الذكاء الاصطناعي بقراءة كل مستند وتسميته باسم الشخص ونوع المستند بدقة (مثل: جواز_سفر_محمد.pdf)، وتحميلها كملف ZIP أو تنزيل كل ملف بمفرده.'
              : 'Upload passports, IDs, birth certificates, bills, or contracts together. AI reads inside each doc and names it by the person name & doc type, with 1-click ZIP or individual download.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-extrabold text-sm sm:text-base flex items-center gap-2.5 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>{currentLang === 'ar' ? 'اختر المستندات للبدء' : 'Select Documents'}</span>
            </button>
          </div>

          {/* Feature Highlights Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-300">
            <span className="px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 flex items-center gap-1.5">
              <span>🛂</span>
              <span>{currentLang === 'ar' ? 'جوازات وبطاقات هوية' : 'Passports & IDs'}</span>
            </span>
            <span className="px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 flex items-center gap-1.5">
              <span>📜</span>
              <span>{currentLang === 'ar' ? 'شهادات ميلاد وتخرج' : 'Birth & Graduation'}</span>
            </span>
            <span className="px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 flex items-center gap-1.5">
              <span>📑</span>
              <span>{currentLang === 'ar' ? 'عقود وفواتير ووثائق' : 'Contracts & Invoices'}</span>
            </span>
            <span className="px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 flex items-center gap-1.5">
              <span>📦</span>
              <span>{currentLang === 'ar' ? 'تنزيل الكل ZIP بأسماء أصحابها' : 'ZIP Download with Person Names'}</span>
            </span>
          </div>
        </div>
      ) : (
        /* Batch Active Management Area */
        <div className="space-y-6">
          {/* Top Control Bar */}
          <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-cyan-500/30 bg-slate-900/80 shadow-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
                <Sparkles className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <span>{currentLang === 'ar' ? 'المستندات المفحوصة' : 'Inspected Documents'}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                    {items.length}
                  </span>
                </h4>
                <p className="text-xs text-slate-400">
                  {currentLang === 'ar'
                    ? `تم فحص وتسمية ${completedCount} من أصل ${items.length} مستند`
                    : `${completedCount} of ${items.length} inspected and named`}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Add more files */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="application/pdf,image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    handleFilesAdded(Array.from(e.target.files) as File[]);
                    e.target.value = '';
                  }
                }}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>{currentLang === 'ar' ? 'إضافة مستندات' : 'Add Files'}</span>
              </button>

              {/* Re-analyze all */}
              <button
                type="button"
                onClick={handleAnalyzeAll}
                disabled={isAnalyzingAll}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors border border-slate-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-purple-400 ${isAnalyzingAll ? 'animate-spin' : ''}`} />
                <span>{isAnalyzingAll ? (currentLang === 'ar' ? 'جاري الفحص...' : 'Analyzing...') : (currentLang === 'ar' ? 'إعادة فحص الكل' : 'Re-analyze All')}</span>
              </button>

              {/* Download All as ZIP */}
              <button
                type="button"
                onClick={handleDownloadZip}
                disabled={isZipping || items.length === 0}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
              >
                {isZipping ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FolderArchive className="w-4 h-4" />
                )}
                <span>
                  {isZipping
                    ? zipProgressText || (currentLang === 'ar' ? 'جاري الحزم...' : 'Zipping...')
                    : currentLang === 'ar'
                    ? 'تحميل الكل في ملف مضغوط (ZIP)'
                    : 'Download All in ZIP'}
                </span>
              </button>

              {/* Clear All */}
              <button
                type="button"
                onClick={handleClearAll}
                className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-white transition-colors"
                title={currentLang === 'ar' ? 'مسح الكل' : 'Clear all'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Documents Grid / List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((doc, idx) => {
              const isPdf = doc.fileType === 'pdf';
              const analysis = doc.analysis;
              const currentName = doc.customFileName || analysis?.suggestedFileName || doc.originalName;

              return (
                <div
                  key={doc.id}
                  className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 bg-slate-900/60 transition-all flex flex-col justify-between space-y-3 relative group"
                >
                  {/* Header: Thumbnail + Document Info */}
                  <div className="flex items-start gap-3">
                    {/* Visual Thumbnail / Icon */}
                    <div
                      onClick={() => setPreviewModalItem(doc)}
                      className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl bg-slate-950 border border-slate-800 flex-shrink-0 relative overflow-hidden cursor-pointer group-hover:border-cyan-500/50 transition-colors flex items-center justify-center"
                    >
                      {doc.fileType === 'image' ? (
                        <img
                          src={doc.previewUrl}
                          alt={doc.originalName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-2 text-center text-rose-400">
                          <FileText className="w-8 h-8" />
                          <span className="text-[10px] font-bold mt-1 text-slate-400">PDF</span>
                          {doc.pageCount && (
                            <span className="text-[9px] px-1 rounded bg-rose-500/20 text-rose-300">
                              {doc.pageCount} ص
                            </span>
                          )}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Metadata & Analysis Badges */}
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400 truncate max-w-[160px]" title={doc.originalName}>
                          #{idx + 1} {doc.originalName}
                        </span>

                        {/* Status Badge */}
                        {doc.status === 'analyzing' ? (
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold flex items-center gap-1 animate-pulse">
                            <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                            {currentLang === 'ar' ? 'جاري الفحص...' : 'Inspecting...'}
                          </span>
                        ) : doc.status === 'done' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            {currentLang === 'ar' ? 'تم الفحص' : 'Ready'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                            {currentLang === 'ar' ? 'قيد الانتظار' : 'Pending'}
                          </span>
                        )}
                      </div>

                      {/* Detected Document Type & Person Name */}
                      {analysis ? (
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {/* Document Type Badge */}
                            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-black flex items-center gap-1">
                              <span>📄</span>
                              <span>{analysis.documentType}</span>
                            </span>

                            {/* Person Name Badge */}
                            {analysis.personOrEntityName && (
                              <span className="px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-black flex items-center gap-1">
                                <User className="w-3 h-3 text-purple-400" />
                                <span>{analysis.personOrEntityName}</span>
                              </span>
                            )}

                            {/* Country / Distinctive Badge */}
                            {analysis.countryOrLanguage && (
                              <span className="px-2 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                                {analysis.countryOrLanguage}
                              </span>
                            )}
                          </div>

                          {/* Quick Summary */}
                          {analysis.documentSummary && (
                            <p className="text-[11px] text-slate-300 line-clamp-1 italic">
                              {analysis.documentSummary}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="py-2">
                          <p className="text-xs text-slate-400">
                            {currentLang === 'ar'
                              ? 'اضغط على فحص لاستخراج اسم المستند وصاحبه تلقائياً'
                              : 'Click inspect to read person name & document details'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Smart Filename Input Box */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <Edit3 className="w-3 h-3 text-cyan-400" />
                      <span>{currentLang === 'ar' ? 'اسم الملف الذكي الجديد:' : 'Smart File Name:'}</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={currentName}
                        onChange={(e) => handleUpdateName(doc.id, e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs font-bold text-cyan-200 outline-none transition-colors"
                        placeholder="اسم_المستند_صاحبه.pdf"
                      />
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {/* Re-analyze button */}
                      <button
                        type="button"
                        onClick={() => analyzeSingleItem(doc)}
                        disabled={doc.status === 'analyzing'}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                        title={currentLang === 'ar' ? 'إعادة الفحص بالذكاء الاصطناعي' : 'Re-inspect'}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${doc.status === 'analyzing' ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">{currentLang === 'ar' ? 'فحص' : 'Inspect'}</span>
                      </button>

                      {/* Preview Button */}
                      <button
                        type="button"
                        onClick={() => setPreviewModalItem(doc)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="hidden sm:inline">{currentLang === 'ar' ? 'معاينة' : 'Preview'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Download Single File */}
                      <button
                        type="button"
                        onClick={() => handleDownloadSingle(doc)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{currentLang === 'ar' ? 'تحميل المستند' : 'Download'}</span>
                      </button>

                      {/* Remove single file */}
                      <button
                        type="button"
                        onClick={() => handleRemove(doc.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title={currentLang === 'ar' ? 'حذف' : 'Remove'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom ZIP CTA */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-slate-950/80 border border-cyan-500/40 shadow-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <Archive className="w-6 h-6" />
              </div>
              <div>
                <h5 className="text-sm sm:text-base font-extrabold text-white">
                  {currentLang === 'ar'
                    ? 'هل انتهيت من فحص المستندات؟'
                    : 'Done reviewing your documents?'}
                </h5>
                <p className="text-xs text-slate-300">
                  {currentLang === 'ar'
                    ? `اضغط هنا لتنزيل جميع المستندات (${items.length} ملف) بحزمة مضغوطة واحدة بأسماء أصحابها المكتشفة.`
                    : `Click to download all ${items.length} documents neatly renamed inside a single ZIP archive.`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={isZipping || items.length === 0}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              {isZipping ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FolderArchive className="w-5 h-5" />
              )}
              <span>
                {currentLang === 'ar'
                  ? 'تحميل جميع المستندات في ملف مضغوط (ZIP)'
                  : 'Download All Documents as ZIP'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewModalItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span className="truncate max-w-md">
                  {previewModalItem.customFileName || previewModalItem.originalName}
                </span>
              </div>
              <button
                onClick={() => setPreviewModalItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-slate-950/60 min-h-[300px]">
              {previewModalItem.fileType === 'image' ? (
                <img
                  src={previewModalItem.previewUrl}
                  alt={previewModalItem.originalName}
                  className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-2xl"
                />
              ) : (
                <div className="w-full h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-slate-900 rounded-2xl border border-slate-800">
                  <FileText className="w-16 h-16 text-rose-400 mb-3" />
                  <h4 className="text-base font-bold text-white mb-1">
                    {previewModalItem.originalName}
                  </h4>
                  <p className="text-xs text-slate-400 mb-4">
                    {previewModalItem.pageCount} {currentLang === 'ar' ? 'صفحة' : 'pages'} - PDF Document
                  </p>
                  <iframe
                    src={previewModalItem.previewUrl}
                    title="PDF Preview"
                    className="w-full flex-1 rounded-xl border border-slate-800"
                  />
                </div>
              )}
            </div>

            {/* Analysis details footer */}
            {previewModalItem.analysis && (
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-cyan-300">
                    {previewModalItem.analysis.documentType}
                  </span>
                  {previewModalItem.analysis.personOrEntityName && (
                    <span className="font-bold text-purple-300">
                      • {previewModalItem.analysis.personOrEntityName}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleDownloadSingle(previewModalItem);
                    setPreviewModalItem(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{currentLang === 'ar' ? 'تحميل هذا المستند' : 'Download File'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
