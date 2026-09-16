import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { PDFDocument } from 'pdf-lib';
import {
  ImageItem,
  Language,
  PDFSettings,
  AttachedPdf,
  GeneratedPdfResult,
  ToastData,
  AIAnalysisResult,
  ExportFormat
} from './types';
import { translations } from './translations';
import { generatePDF } from './utils/pdfGenerator';
import { generatePowerPoint, generateZipArchive } from './utils/multiExport';
import { Sparkles, Layers } from 'lucide-react';
import {
  analyzeDocumentForRenaming,
  analyzeAndRenameDocument,
  extractTextAndSummarize,
  getStoredApiKey,
  checkServerHasApiKey
} from './services/geminiService';
import { generateHeuristicFallback } from './utils/smartDocumentRenamer';

// Components
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { QuickFeatures } from './components/QuickFeatures';
import { UploadZone } from './components/UploadZone';
import { ControlsBar } from './components/ControlsBar';
import { ImagesManager } from './components/ImagesManager';
import { WhyChooseUs } from './components/WhyChooseUs';
import { DeveloperFooter } from './components/DeveloperFooter';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ToastContainer } from './components/Toast';
import { SmartDocumentRenamerView } from './components/SmartDocumentRenamerView';

// Modals
import { CameraModal } from './components/CameraModal';
import { ImageEditorModal } from './components/ImageEditorModal';
import { SettingsModal } from './components/SettingsModal';
import { InstructionsModal } from './components/InstructionsModal';
import { ShareModal } from './components/ShareModal';
import { PDFPreviewModal } from './components/PDFPreviewModal';
import { AIOCRModal } from './components/AIOCRModal';

export function App() {
  // Language State (Defaults to Arabic as strictly requested)
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('image_pdf_lang') as Language;
      if (saved && (saved === 'ar' || saved === 'en' || saved === 'fr')) {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'ar';
  });

  const t = translations[currentLang];

  // Mode State: Smart AI Document Renamer vs Image to PDF Merger
  const [activeMode, setActiveMode] = useState<'smart_renamer' | 'image_to_pdf'>('smart_renamer');

  // Images and File State
  const [images, setImages] = useState<ImageItem[]>([]);
  const [attachedPdf, setAttachedPdf] = useState<AttachedPdf | null>(null);

  // Settings State
  const [pdfSettings, setPdfSettings] = useState<PDFSettings>({
    fileName: 'Document_Pro.pdf',
    pageSize: 'a4',
    orientation: 'auto',
    margins: 'none',
    quality: 0.9,
    addPageNumbers: true,
    pageNumberPosition: 'bottom-center',
    watermarkText: '',
    watermarkOpacity: 0.3,
    watermarkColor: '#64748b',
    compressPdf: true,
    headerTitle: ''
  });

  // Export format selection
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');

  // Conversion Status
  const [isConverting, setIsConverting] = useState(false);
  const [isExportingPptx, setIsExportingPptx] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [lastGeneratedPdf, setLastGeneratedPdf] = useState<GeneratedPdfResult | null>(null);

  // AI Key and analysis status
  const [hasApiKey, setHasApiKey] = useState<boolean>(() => !!getStoredApiKey());
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);

  // Smart Auto-Naming feature for Image to PDF
  const [isAutoRenameEnabled, setIsAutoRenameEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('image_pdf_auto_rename');
      return saved !== 'false';
    } catch {
      return true;
    }
  });
  const [hasUserManuallyEditedName, setHasUserManuallyEditedName] = useState<boolean>(false);
  const [aiDetectedInfo, setAiDetectedInfo] = useState<{
    docType?: string;
    personName?: string;
    summary?: string;
  } | null>(null);

  // Modals state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageItem | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // AI OCR state
  const [ocrModalOpen, setOcrModalOpen] = useState(false);
  const [ocrResult, setOcrResult] = useState<AIAnalysisResult | null>(null);
  const [isOcrLoading, setIsOcrLoading] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Hidden File input ref for mobile bottom bar
  const mainFileInputRef = useRef<HTMLInputElement | null>(null);

  // Check server API key on mount
  useEffect(() => {
    checkServerHasApiKey().then((hasServerKey) => {
      if (hasServerKey) {
        setHasApiKey(true);
      }
    });
  }, []);

  // Set RTL / LTR on language change
  useEffect(() => {
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
    try {
      localStorage.setItem('image_pdf_lang', currentLang);
    } catch {
      // ignore
    }
  }, [currentLang]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  // Clipboard paste listener
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            await handleAddFiles([file]);
            showToast(t.toasts.clipboardPasted, 'success');
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [t]);

  // Process incoming files (images or PDFs)
  const handleAddFiles = async (files: File[]) => {
    const newImages: ImageItem[] = [];

    for (const file of files) {
      if (file.type === 'application/pdf') {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const doc = await PDFDocument.load(arrayBuffer);
          const count = doc.getPageCount();
          setAttachedPdf({
            name: file.name,
            size: file.size,
            pageCount: count,
            arrayBuffer
          });
          showToast(t.toasts.pdfAdded, 'success');
        } catch (err) {
          console.error(err);
          showToast(t.toasts.pdfError, 'error');
        }
      } else if (file.type.startsWith('image/')) {
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        // Determine natural dimensions
        const dims = await new Promise<{ w: number; h: number }>((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
          img.onerror = () => resolve({ w: 800, h: 600 });
          img.src = dataUrl;
        });

        newImages.push({
          id: Math.random().toString(36).substring(2, 9) + Date.now(),
          dataUrl,
          originalName: file.name,
          size: file.size,
          width: dims.w,
          height: dims.h,
          rotation: 0,
          filter: 'original',
          brightness: 100,
          contrast: 100,
          flipH: false,
          flipV: false
        });
      }
    }

    if (newImages.length > 0) {
      const updated = [...images, ...newImages];
      setImages(updated);
      showToast(`${t.toasts.filesAdded} (${newImages.length})`, 'success');

      if (isAutoRenameEnabled && !hasUserManuallyEditedName) {
        setTimeout(() => {
          triggerSmartAutoRename(updated, false);
        }, 80);
      }
    }
  };

  // Image actions
  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    showToast(t.toasts.imageDeleted, 'info');
  };

  const handleRotateImage = (id: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, rotation: (img.rotation + 90) % 360 } : img
      )
    );
  };

  const handleUpdateImage = (updated: ImageItem) => {
    setImages((prev) => prev.map((img) => (img.id === updated.id ? updated : img)));
  };

  const handleMoveStep = (id: string, step: number) => {
    setImages((prev) => {
      const idx = prev.findIndex((img) => img.id === id);
      const targetIdx = idx + step;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  const handleReorder = (sourceIndex: number, destinationIndex: number) => {
    setImages((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(sourceIndex, 1);
      copy.splice(destinationIndex, 0, removed);
      return copy;
    });
  };

  const handleMoveToPosition = (sourceIndex: number, targetIndex: number) => {
    if (sourceIndex === targetIndex) return;
    setImages((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(sourceIndex, 1);
      copy.splice(targetIndex, 0, item);
      return copy;
    });
  };

  const handleClearAll = () => {
    setImages([]);
    setAttachedPdf(null);
    showToast(t.toasts.allCleared, 'info');
  };

  const handleReverseOrder = () => {
    setImages((prev) => [...prev].reverse());
  };

  const handleSortByName = () => {
    setImages((prev) =>
      [...prev].sort((a, b) => a.originalName.localeCompare(b.originalName))
    );
  };

  // Convert to PDF Handler
  const handleConvert = async () => {
    if (images.length === 0 && !attachedPdf) {
      showToast(t.toasts.selectPrompt, 'error');
      return;
    }

    setIsConverting(true);
    try {
      const result = await generatePDF(images, attachedPdf, pdfSettings);
      setLastGeneratedPdf(result);
      setIsConverting(false);
      setIsShareOpen(true);

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      showToast(t.toasts.pdfGenerated, 'success');
    } catch (err) {
      console.error(err);
      setIsConverting(false);
      showToast(t.toasts.processError, 'error');
    }
  };

  // PowerPoint Export Handler
  const handleExportPptx = async () => {
    if (images.length === 0) {
      showToast(t.toasts.selectPrompt, 'error');
      return;
    }

    setIsExportingPptx(true);
    try {
      const cleanName = (pdfSettings.fileName || 'Presentation').replace(/\.[^/.]+$/, '') + '.pptx';
      const blob = await generatePowerPoint(images, cleanName);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = cleanName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast(
        currentLang === 'ar' ? 'تم تنزيل عرض PowerPoint بنجاح!' : 'PowerPoint presentation downloaded!',
        'success'
      );
    } catch (err) {
      console.error('PPTX export error:', err);
      showToast(t.toasts.processError, 'error');
    } finally {
      setIsExportingPptx(false);
    }
  };

  // ZIP Archive Export Handler
  const handleExportZip = async () => {
    if (images.length === 0) {
      showToast(t.toasts.selectPrompt, 'error');
      return;
    }

    setIsExportingZip(true);
    try {
      const cleanName = (pdfSettings.fileName || 'Images_Archive').replace(/\.[^/.]+$/, '') + '.zip';
      const blob = await generateZipArchive(images, cleanName);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = cleanName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast(
        currentLang === 'ar' ? 'تم تنزيل أرشيف الصور ZIP بنجاح!' : 'Images ZIP archive downloaded!',
        'success'
      );
    } catch (err) {
      console.error('ZIP export error:', err);
      showToast(t.toasts.processError, 'error');
    } finally {
      setIsExportingZip(false);
    }
  };

  // Smart Auto-Renaming Engine for Image to PDF
  const triggerSmartAutoRename = async (items: ImageItem[] = images, force: boolean = false) => {
    if (!force && hasUserManuallyEditedName) {
      // User typed their own custom name; respect user's manual choice
      return;
    }
    if (items.length === 0) return;

    setIsAnalyzingAI(true);
    try {
      const target = items[0];
      const mimeType = target.originalName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

      let analysis = null;
      if (hasApiKey) {
        analysis = await analyzeAndRenameDocument(target.dataUrl, mimeType, target.originalName, currentLang);
      }
      if (!analysis) {
        analysis = generateHeuristicFallback(target.originalName, currentLang);
      }

      if (analysis && analysis.suggestedFileName) {
        setPdfSettings((prev) => ({ ...prev, fileName: analysis.suggestedFileName }));
        setAiDetectedInfo({
          docType: analysis.documentType,
          personName: analysis.personOrEntityName,
          summary: analysis.documentSummary
        });
        showToast(
          currentLang === 'ar'
            ? `تمت التسمية الذكية للمستند: ${analysis.suggestedFileName}`
            : `Smart AI named: ${analysis.suggestedFileName}`,
          'success'
        );
      }
    } catch (err) {
      console.warn('Smart auto-rename error:', err);
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  const handleToggleAutoRename = (enabled: boolean) => {
    setIsAutoRenameEnabled(enabled);
    try {
      localStorage.setItem('image_pdf_auto_rename', String(enabled));
    } catch {
      // ignore
    }
    showToast(
      enabled ? t.ai.autoRenameToggleOn : t.ai.autoRenameToggleOff,
      enabled ? 'success' : 'info'
    );
    if (enabled && images.length > 0 && !hasUserManuallyEditedName) {
      triggerSmartAutoRename(images, false);
    }
  };

  const handleFileNameChange = (newName: string) => {
    setPdfSettings((prev) => ({ ...prev, fileName: newName }));
    setHasUserManuallyEditedName(true);
  };

  const handleResetManualName = () => {
    setHasUserManuallyEditedName(false);
    if (images.length > 0) {
      triggerSmartAutoRename(images, true);
    }
  };

  // Smart AI Renaming (manual trigger)
  const handleSmartRename = async () => {
    if (images.length === 0) {
      showToast(t.toasts.selectPrompt, 'error');
      return;
    }
    await triggerSmartAutoRename(images, true);
  };

  // AI OCR and Document Text Summarizer
  const handleOcrImage = async (imageItem: ImageItem) => {
    if (!hasApiKey) {
      setIsSettingsOpen(true);
      return;
    }

    setOcrResult(null);
    setIsOcrLoading(true);
    setOcrModalOpen(true);

    try {
      const res = await extractTextAndSummarize(imageItem.dataUrl, currentLang);
      setOcrResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsOcrLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-[#f8fafc] flex flex-col items-center relative overflow-hidden pb-20 sm:pb-12">
      {/* Background aurora effects */}
      <div className="aurora-bg" />
      <div className="bg-grid-overlay" />

      {/* Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenInstructions={() => setIsInstructionsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasApiKey={hasApiKey}
      />

      {/* Hidden File Input for mobile bottom nav trigger */}
      <input
        ref={mainFileInputRef}
        type="file"
        multiple
        accept="image/*,application/pdf"
        onChange={(e) => {
          if (e.target.files) {
            handleAddFiles(Array.from(e.target.files));
            e.target.value = '';
          }
        }}
        className="hidden"
      />

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10 flex flex-col items-center">
        {/* Hero Section */}
        <Hero currentLang={currentLang} />

        {/* Quick Features Row */}
        <QuickFeatures currentLang={currentLang} />

        {/* Mode Switcher Navigation Tabs */}
        <div className="w-full max-w-2xl mx-auto mb-8 p-1.5 rounded-3xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl shadow-2xl flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveMode('smart_renamer')}
            className={`flex-1 py-3.5 px-3 sm:px-5 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
              activeMode === 'smart_renamer'
                ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white shadow-xl shadow-cyan-500/30 scale-[1.01]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>
              {currentLang === 'ar'
                ? 'فاحص ومسمّي المستندات الذكي (AI)'
                : currentLang === 'fr'
                ? 'Inspecteur & Renommage IA'
                : 'AI Document Inspector & Renamer'}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold hidden md:inline">
              {currentLang === 'ar' ? 'تسمية بأسماء الأشخاص + ZIP' : 'Person Names + ZIP'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('image_to_pdf')}
            className={`flex-1 py-3.5 px-3 sm:px-5 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
              activeMode === 'image_to_pdf'
                ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white shadow-xl shadow-cyan-500/30 scale-[1.01]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>
              {currentLang === 'ar'
                ? 'دمج وتحويل الصور إلى PDF'
                : currentLang === 'fr'
                ? 'Convertisseur Images en PDF'
                : 'Images to PDF Merger'}
            </span>
          </button>
        </div>

        {activeMode === 'smart_renamer' ? (
          <SmartDocumentRenamerView
            currentLang={currentLang}
            onShowToast={showToast}
            hasApiKey={hasApiKey}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        ) : (
          <>
            {/* Upload Zone */}
            <UploadZone
              currentLang={currentLang}
              onFilesSelected={handleAddFiles}
              onOpenCamera={() => setIsCameraOpen(true)}
              attachedPdf={attachedPdf}
              onRemoveAttachedPdf={() => setAttachedPdf(null)}
            />

            {/* Controls Bar with Multi-Format Exports */}
            <ControlsBar
              currentLang={currentLang}
              settings={pdfSettings}
              onSettingsChange={setPdfSettings}
              onConvert={handleConvert}
              onExportPptx={handleExportPptx}
              onExportZip={handleExportZip}
              isConverting={isConverting}
              isExportingPptx={isExportingPptx}
              isExportingZip={isExportingZip}
              onSmartRename={handleSmartRename}
              isAnalyzingAI={isAnalyzingAI}
              hasApiKey={hasApiKey}
              selectedFormat={selectedFormat}
              onSelectFormat={setSelectedFormat}
              autoRenameEnabled={isAutoRenameEnabled}
              onToggleAutoRename={handleToggleAutoRename}
              hasUserManuallyEditedName={hasUserManuallyEditedName}
              onResetManualName={handleResetManualName}
              aiDetectedInfo={aiDetectedInfo}
              onFileNameChange={handleFileNameChange}
            />

            {/* Images Manager (Cards grid with actions, drag-drop reordering, and direct page numbering) */}
            <ImagesManager
              currentLang={currentLang}
              images={images}
              onRemoveImage={handleRemoveImage}
              onRotateImage={handleRotateImage}
              onOpenEditor={(item) => setEditingImage(item)}
              onMoveStep={handleMoveStep}
              onReorder={handleReorder}
              onMoveToPosition={handleMoveToPosition}
              onClearAll={handleClearAll}
              onReverseOrder={handleReverseOrder}
              onSortByName={handleSortByName}
              onOcrImage={handleOcrImage}
              hasApiKey={hasApiKey}
            />
          </>
        )}

        {/* Why Choose Us feature boxes */}
        <WhyChooseUs currentLang={currentLang} />

        {/* Developer Footer Signature honoring Mohammed Nabil Al-Suhaigi */}
        <DeveloperFooter currentLang={currentLang} />
      </main>

      {/* Modals */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUrl) => {
          const newImg: ImageItem = {
            id: 'cam_' + Math.random().toString(36).substring(2, 9) + Date.now(),
            dataUrl,
            originalName: `Camera_Capture_${Date.now()}.jpg`,
            size: dataUrl.length * 0.75,
            width: 1280,
            height: 720,
            rotation: 0,
            filter: 'original',
            brightness: 100,
            contrast: 100,
            flipH: false,
            flipV: false
          };
          const updated = [...images, newImg];
          setImages(updated);
          showToast(t.toasts.filesAdded, 'success');

          if (isAutoRenameEnabled && !hasUserManuallyEditedName) {
            setTimeout(() => {
              triggerSmartAutoRename(updated, false);
            }, 80);
          }
        }}
        currentLang={currentLang}
      />

      <ImageEditorModal
        image={editingImage}
        isOpen={!!editingImage}
        onClose={() => setEditingImage(null)}
        onSave={handleUpdateImage}
        currentLang={currentLang}
        hasApiKey={hasApiKey}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentLang={currentLang}
        onKeyStatusChange={(hasKey) => setHasApiKey(hasKey)}
      />

      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
        currentLang={currentLang}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        pdfBlob={lastGeneratedPdf?.blob || null}
        fileName={lastGeneratedPdf?.fileName || pdfSettings.fileName}
        pageCount={lastGeneratedPdf?.pageCount || images.length}
        currentLang={currentLang}
        onPreview={() => {
          setIsShareOpen(false);
          setIsPreviewOpen(true);
        }}
        onShowToast={showToast}
      />

      <PDFPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        pdfBlob={lastGeneratedPdf?.blob || null}
        fileName={lastGeneratedPdf?.fileName || pdfSettings.fileName}
        currentLang={currentLang}
      />

      <AIOCRModal
        isOpen={ocrModalOpen}
        onClose={() => setOcrModalOpen(false)}
        result={ocrResult}
        isLoading={isOcrLoading}
        currentLang={currentLang}
      />

      {/* Mobile Bottom Navigation for Thumb Access */}
      <MobileBottomNav
        currentLang={currentLang}
        imagesCount={images.length}
        onPickFiles={() => mainFileInputRef.current?.click()}
        onOpenCamera={() => setIsCameraOpen(true)}
        onConvert={handleConvert}
        onOpenOptions={() => {
          const el = document.getElementById('controls-bar-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('ring-2', 'ring-cyan-400');
            setTimeout(() => {
              el.classList.remove('ring-2', 'ring-cyan-400');
            }, 1600);
          } else {
            setIsSettingsOpen(true);
          }
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isConverting={isConverting}
        hasApiKey={hasApiKey}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;

