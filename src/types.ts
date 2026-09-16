export type Language = 'ar' | 'en' | 'fr';

export type PageSize = 'a4' | 'a3' | 'a5' | 'letter' | 'legal' | 'fit';

export type PageOrientation = 'auto' | 'p' | 'l';

export type MarginSize = 'none' | 'small' | 'normal' | 'large';

export type ImageFilter = 'original' | 'grayscale' | 'scanner' | 'contrast' | 'sepia';

export type ExportFormat = 'pdf' | 'pptx' | 'zip' | 'docx';

export interface CropBox {
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  width: number; // percentage 0 - 100
  height: number; // percentage 0 - 100
}

export interface ImageItem {
  id: string;
  dataUrl: string;
  originalName: string;
  size: number;
  width: number;
  height: number;
  rotation: number; // in degrees: 0, 90, 180, 270
  filter: ImageFilter;
  brightness: number; // 50 to 150 (100 is normal)
  contrast: number; // 50 to 150 (100 is normal)
  flipH: boolean;
  flipV: boolean;
  crop?: CropBox;
  notes?: string;
}

export interface PDFSettings {
  fileName: string;
  pageSize: PageSize;
  orientation: PageOrientation;
  margins: MarginSize;
  quality: number; // 0.6 to 1.0
  addPageNumbers: boolean;
  pageNumberPosition: 'bottom-center' | 'bottom-right' | 'bottom-left';
  watermarkText: string;
  watermarkOpacity: number;
  watermarkColor: string;
  compressPdf: boolean;
  headerTitle: string;
}

export interface AIAnalysisResult {
  detectedTitle?: string;
  summary?: string;
  extractedText?: string;
  documentType?: string;
  suggestedFileName?: string;
}

export interface AttachedPDF {
  name: string;
  size: number;
  pageCount: number;
  arrayBuffer: ArrayBuffer;
}

export type AttachedPdf = AttachedPDF;

export interface GeneratedPdfResult {
  blob: Blob;
  fileName: string;
  pageCount: number;
  fileSize: number;
}

export interface ToastData {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

export interface SmartDocumentAnalysis {
  documentType: string;
  documentTypeEn?: string;
  personOrEntityName: string;
  countryOrLanguage?: string;
  documentSummary: string;
  suggestedFileName: string;
}

export interface SmartDocumentItem {
  id: string;
  originalFile: File;
  originalName: string;
  fileType: 'pdf' | 'image';
  size: number;
  previewUrl: string;
  base64Data?: string;
  mimeType: string;
  status: 'pending' | 'analyzing' | 'done' | 'error';
  errorMessage?: string;
  analysis?: SmartDocumentAnalysis;
  customFileName?: string;
  pageCount?: number;
}

