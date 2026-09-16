import pptxgen from 'pptxgenjs';
import JSZip from 'jszip';
import { ImageItem } from '../types';
import { processImageToCanvas } from './imageProcessing';

export async function generatePowerPoint(
  images: ImageItem[],
  fileName: string = 'Presentation.pptx'
): Promise<Blob> {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

  for (let i = 0; i < images.length; i++) {
    const item = images[i];
    const processed = await processImageToCanvas(item, 0.92);
    const slide = pptx.addSlide();

    // Set dark/clean background
    slide.background = { color: '0A0F1D' };

    // Add image fitting into slide bounds
    slide.addImage({
      data: processed.dataUrl,
      x: 0.5,
      y: 0.5,
      w: 12.33,
      h: 6.5,
      sizing: { type: 'contain', w: 12.33, h: 6.5 }
    });

    // Add subtle slide indicator footer
    slide.addText(`Slide ${i + 1} of ${images.length} • ${item.originalName}`, {
      x: 0.5,
      y: 7.0,
      w: 12.33,
      h: 0.4,
      fontSize: 10,
      color: '64748B',
      align: 'right'
    });
  }

  const output = await pptx.write({ outputType: 'blob' });
  return output as Blob;
}

export async function generateZipArchive(
  images: ImageItem[],
  fileName: string = 'Images_Archive.zip'
): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder('processed_images') || zip;

  for (let i = 0; i < images.length; i++) {
    const item = images[i];
    const processed = await processImageToCanvas(item, 0.95);
    const base64Data = processed.dataUrl.split('base64,')[1];
    const pageNum = String(i + 1).padStart(3, '0');
    const cleanName = item.originalName.replace(/\.[^/.]+$/, '');
    folder.file(`${pageNum}_${cleanName}.jpg`, base64Data, { base64: true });
  }

  const content = await zip.generateAsync({ type: 'blob' });
  return content;
}
