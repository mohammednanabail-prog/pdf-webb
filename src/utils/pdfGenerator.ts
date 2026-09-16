import { jsPDF } from 'jspdf';
import { PDFDocument } from 'pdf-lib';
import { AttachedPDF, ImageItem, PDFSettings } from '../types';
import { processImageToCanvas } from './imageProcessing';

export async function generatePDF(
  images: ImageItem[],
  attachedPdf: AttachedPDF | null,
  settings: PDFSettings,
  onProgress?: (current: number, total: number) => void
): Promise<{ blob: Blob; fileName: string; pageCount: number }> {
  let finalFileName = settings.fileName.trim();
  if (!finalFileName) finalFileName = 'Image_to_PDF_Document';
  if (!finalFileName.toLowerCase().endsWith('.pdf')) finalFileName += '.pdf';

  // Determine margin in mm
  let marginMm = 0;
  if (settings.margins === 'small') marginMm = 5;
  else if (settings.margins === 'normal') marginMm = 10;
  else if (settings.margins === 'large') marginMm = 20;

  // Case 1: If an existing PDF is attached to be merged
  if (attachedPdf) {
    const mergedPdf = await PDFDocument.create();

    // Copy pages from attached PDF
    const sourcePdf = await PDFDocument.load(attachedPdf.arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));

    // Append new images
    for (let i = 0; i < images.length; i++) {
      if (onProgress) onProgress(i + 1, images.length);
      const item = images[i];
      const processed = await processImageToCanvas(item, settings.quality);
      const jpgImage = await mergedPdf.embedJpg(processed.dataUrl);

      // Handle page size and fit
      let pWidth = jpgImage.width;
      let pHeight = jpgImage.height;

      const page = mergedPdf.addPage([pWidth, pHeight]);
      page.drawImage(jpgImage, {
        x: 0,
        y: 0,
        width: pWidth,
        height: pHeight
      });
    }

    const pdfBytes = await mergedPdf.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    return { blob, fileName: finalFileName, pageCount: mergedPdf.getPageCount() };
  }

  // Case 2: Standard jsPDF generation from image list
  let doc: jsPDF | null = null;
  const totalPages = images.length;

  for (let i = 0; i < images.length; i++) {
    if (onProgress) onProgress(i + 1, totalPages);
    const item = images[i];
    const processed = await processImageToCanvas(item, settings.quality);
    const imgWidth = processed.width;
    const imgHeight = processed.height;

    // Determine orientation
    let pageOrientation: 'p' | 'l' = 'p';
    if (settings.orientation === 'auto') {
      pageOrientation = imgWidth > imgHeight ? 'l' : 'p';
    } else {
      pageOrientation = settings.orientation;
    }

    if (i === 0) {
      if (settings.pageSize === 'fit') {
        doc = new jsPDF({
          orientation: pageOrientation,
          unit: 'px',
          format: [imgWidth, imgHeight],
          compress: settings.compressPdf
        });
      } else {
        doc = new jsPDF({
          orientation: pageOrientation,
          unit: 'mm',
          format: settings.pageSize,
          compress: settings.compressPdf
        });
      }
    } else if (doc) {
      if (settings.pageSize === 'fit') {
        doc.addPage([imgWidth, imgHeight], pageOrientation);
      } else {
        doc.addPage(settings.pageSize, pageOrientation);
      }
    }

    if (!doc) continue;

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    if (settings.pageSize === 'fit') {
      doc.addImage(processed.dataUrl, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
    } else {
      // Calculate aspect ratio fit within margins
      const availWidth = Math.max(10, pageWidth - marginMm * 2);
      const availHeight = Math.max(10, pageHeight - marginMm * 2 - (settings.headerTitle ? 10 : 0) - (settings.addPageNumbers ? 10 : 0));

      const imgRatio = imgWidth / imgHeight;
      const availRatio = availWidth / availHeight;

      let renderWidth = availWidth;
      let renderHeight = availHeight;

      if (imgRatio > availRatio) {
        renderWidth = availWidth;
        renderHeight = renderWidth / imgRatio;
      } else {
        renderHeight = availHeight;
        renderWidth = renderHeight * imgRatio;
      }

      const x = marginMm + (availWidth - renderWidth) / 2;
      const y = marginMm + (settings.headerTitle ? 8 : 0) + (availHeight - renderHeight) / 2;

      doc.addImage(processed.dataUrl, 'JPEG', x, y, renderWidth, renderHeight, undefined, 'FAST');
    }

    // Optional Header Title
    if (settings.headerTitle) {
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(settings.headerTitle, pageWidth / 2, Math.max(6, marginMm / 2), { align: 'center' });
    }

    // Optional Watermark
    if (settings.watermarkText.trim()) {
      doc.saveGraphicsState();
      doc.setFontSize(36);
      doc.setTextColor(180, 180, 180);
      try {
        // Set GState opacity if available
        (doc as any).setGState(new (doc as any).GState({ opacity: settings.watermarkOpacity || 0.2 }));
      } catch {
        // fallback
      }
      doc.text(settings.watermarkText, pageWidth / 2, pageHeight / 2, {
        align: 'center',
        angle: 45
      });
      doc.restoreGraphicsState();
    }

    // Optional Page Number
    if (settings.addPageNumbers) {
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      const pageText = `${i + 1} / ${totalPages}`;
      const posY = pageHeight - Math.max(4, marginMm / 2);
      let posX = pageWidth / 2;
      let alignOpt: 'center' | 'right' | 'left' = 'center';

      if (settings.pageNumberPosition === 'bottom-right') {
        posX = pageWidth - 10;
        alignOpt = 'right';
      } else if (settings.pageNumberPosition === 'bottom-left') {
        posX = 10;
        alignOpt = 'left';
      }

      doc.text(pageText, posX, posY, { align: alignOpt });
    }
  }

  if (!doc) {
    throw new Error('Failed to create PDF document');
  }

  const pdfBlob = doc.output('blob');
  return { blob: pdfBlob, fileName: finalFileName, pageCount: totalPages };
}
