import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import { PDFDocument } from 'pdf-lib';
import { SmartDocumentAnalysis, SmartDocumentItem } from '../types';
import { analyzeAndRenameDocument } from '../services/geminiService';

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

// Fallback heuristic classification when offline or AI key missing
export function generateHeuristicFallback(
  originalName: string,
  lang: 'ar' | 'en' | 'fr' = 'ar'
): SmartDocumentAnalysis {
  const cleanName = originalName.replace(/\.[^/.]+$/, '').trim();
  const lower = cleanName.toLowerCase();

  let docType = lang === 'ar' ? 'مستند' : lang === 'fr' ? 'Document' : 'Document';
  let personName = '';

  if (lower.includes('pass') || lower.includes('جواز')) {
    docType = lang === 'ar' ? 'جواز_سفر' : 'Passport';
  } else if (lower.includes('birth') || lower.includes('ميلاد') || lower.includes('naissance')) {
    docType = lang === 'ar' ? 'شهادة_ميلاد' : 'Birth_Certificate';
  } else if (lower.includes('id') || lower.includes('هوية') || lower.includes('بطاقة') || lower.includes('carte')) {
    docType = lang === 'ar' ? 'بطاقة_هوية' : 'National_ID';
  } else if (lower.includes('invoice') || lower.includes('فاتورة') || lower.includes('facture') || lower.includes('bill')) {
    docType = lang === 'ar' ? 'فاتورة' : 'Invoice';
  } else if (lower.includes('degree') || lower.includes('تخرج') || lower.includes('شهادة') || lower.includes('diplome')) {
    docType = lang === 'ar' ? 'شهادة' : 'Certificate';
  } else if (lower.includes('contract') || lower.includes('عقد')) {
    docType = lang === 'ar' ? 'عقد' : 'Contract';
  } else if (lower.includes('medical') || lower.includes('طبي')) {
    docType = lang === 'ar' ? 'تقرير_طبي' : 'Medical_Report';
  }

  // Extract name parts from original filename
  const parts = cleanName.replace(/[_\-+]/g, ' ').split(/\s+/).filter(Boolean);
  if (parts.length > 1) {
    personName = parts.slice(1).join('_');
  }

  let finalName = '';
  if (personName) {
    finalName = `${docType}_${personName}.pdf`;
  } else {
    finalName = `${docType}_${cleanName.replace(/\s+/g, '_')}.pdf`;
  }

  return {
    documentType: docType.replace(/_/g, ' '),
    documentTypeEn: 'Document',
    personOrEntityName: personName.replace(/_/g, ' ') || 'غير محدد',
    countryOrLanguage: '',
    documentSummary: 'تم تصنيف المستند تلقائياً من البيانات المتاحة',
    suggestedFileName: finalName
  };
}

// Convert an uploaded SmartDocumentItem into a downloadable PDF Blob
export async function getDocumentAsPdfBlob(item: SmartDocumentItem): Promise<Blob> {
  if (item.fileType === 'pdf') {
    // Return original PDF file directly
    return item.originalFile;
  }

  // If it is an image, convert to high-resolution single-page PDF
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const isLandscape = img.width > img.height;
      const pdf = new jsPDF({
        orientation: isLandscape ? 'l' : 'p',
        unit: 'px',
        format: [img.width, img.height]
      });
      pdf.addImage(img, 'JPEG', 0, 0, img.width, img.height);
      const blob = pdf.output('blob');
      resolve(blob);
    };
    img.onerror = () => {
      // fallback to original file
      resolve(item.originalFile);
    };
    img.src = item.previewUrl;
  });
}

// Download a single document with its smart AI name
export async function downloadSingleSmartDocument(item: SmartDocumentItem): Promise<void> {
  const blob = await getDocumentAsPdfBlob(item);
  let fileName = item.customFileName || item.analysis?.suggestedFileName || item.originalName;
  if (!fileName.toLowerCase().endsWith('.pdf') && item.fileType === 'pdf') {
    fileName += '.pdf';
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Package all processed documents into a single ZIP archive and trigger download
export async function downloadAllSmartDocumentsZip(
  items: SmartDocumentItem[],
  zipArchiveName = 'المستندات_المفحوصة_والمرتبة.zip',
  onProgress?: (percent: number, currentFileName: string) => void
): Promise<void> {
  const zip = new JSZip();
  const usedNames = new Set<string>();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    let desiredName = (item.customFileName || item.analysis?.suggestedFileName || item.originalName).trim();
    if (!desiredName.toLowerCase().endsWith('.pdf')) {
      desiredName += '.pdf';
    }

    // Prevent duplicate filenames in ZIP
    let uniqueName = desiredName;
    let counter = 2;
    while (usedNames.has(uniqueName)) {
      const extIndex = desiredName.lastIndexOf('.');
      if (extIndex !== -1) {
        uniqueName = `${desiredName.substring(0, extIndex)}_${counter}${desiredName.substring(extIndex)}`;
      } else {
        uniqueName = `${desiredName}_${counter}`;
      }
      counter++;
    }
    usedNames.add(uniqueName);

    if (onProgress) {
      const percent = Math.round(((i + 0.5) / items.length) * 100);
      onProgress(percent, uniqueName);
    }

    const blob = await getDocumentAsPdfBlob(item);
    const arrayBuffer = await blob.arrayBuffer();
    zip.file(uniqueName, arrayBuffer);
  }

  if (onProgress) {
    onProgress(95, 'جاري ضغط الحزمة...');
  }

  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  if (onProgress) {
    onProgress(100, 'اكتمل التحميل');
  }

  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = zipArchiveName.endsWith('.zip') ? zipArchiveName : `${zipArchiveName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// Process a batch of files into initial SmartDocumentItem list
export async function prepareSmartDocumentItems(files: File[]): Promise<SmartDocumentItem[]> {
  const items: SmartDocumentItem[] = [];

  for (const file of files) {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const previewUrl = URL.createObjectURL(file);
    let pageCount = 1;

    if (isPdf) {
      try {
        const buffer = await fileToArrayBuffer(file);
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        pageCount = doc.getPageCount();
      } catch (err) {
        console.warn('Could not inspect PDF pages:', err);
      }
    }

    items.push({
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      originalFile: file,
      originalName: file.name,
      fileType: isPdf ? 'pdf' : 'image',
      size: file.size,
      previewUrl,
      mimeType: file.type || (isPdf ? 'application/pdf' : 'image/jpeg'),
      status: 'pending',
      pageCount
    });
  }

  return items;
}
