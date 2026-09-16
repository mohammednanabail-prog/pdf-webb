import { ImageFilter, ImageItem } from '../types';

export function processImageToCanvas(
  imageItem: ImageItem,
  quality = 0.92
): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const rotation = ((imageItem.rotation % 360) + 360) % 360;
      const isQuarterTurn = rotation === 90 || rotation === 270;

      const canvas = document.createElement('canvas');
      const targetWidth = isQuarterTurn ? img.naturalHeight : img.naturalWidth;
      const targetHeight = isQuarterTurn ? img.naturalWidth : img.naturalHeight;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context not available'));
        return;
      }

      // Center translation and rotation
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      // Flips
      const scaleX = imageItem.flipH ? -1 : 1;
      const scaleY = imageItem.flipV ? -1 : 1;
      ctx.scale(scaleX, scaleY);

      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

      // Reset transform for pixel manipulation
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      // Apply brightness, contrast & filters
      applyFilters(ctx, canvas.width, canvas.height, imageItem);

      // Apply Crop if defined
      if (imageItem.crop && (imageItem.crop.width < 100 || imageItem.crop.height < 100 || imageItem.crop.x > 0 || imageItem.crop.y > 0)) {
        const cropX = Math.round((imageItem.crop.x / 100) * canvas.width);
        const cropY = Math.round((imageItem.crop.y / 100) * canvas.height);
        const cropW = Math.max(10, Math.round((imageItem.crop.width / 100) * canvas.width));
        const cropH = Math.max(10, Math.round((imageItem.crop.height / 100) * canvas.height));

        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = cropW;
        croppedCanvas.height = cropH;
        const cropCtx = croppedCanvas.getContext('2d');
        if (cropCtx) {
          cropCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
          resolve({
            dataUrl: croppedCanvas.toDataURL('image/jpeg', quality),
            width: cropW,
            height: cropH
          });
          return;
        }
      }

      resolve({
        dataUrl: canvas.toDataURL('image/jpeg', quality),
        width: canvas.width,
        height: canvas.height
      });
    };
    img.onerror = () => reject(new Error('Failed to load image for rendering'));
    img.src = imageItem.dataUrl;
  });
}

function applyFilters(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  item: ImageItem
) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  const brightnessMul = (item.brightness || 100) / 100;
  const contrastFactor = ((item.contrast || 100) - 100) * 1.5; // -75 to +75
  const contrastFactorCalc = (259 * (contrastFactor + 255)) / (255 * (259 - contrastFactor));
  const filter = item.filter || 'original';

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // 1. Brightness
    if (brightnessMul !== 1) {
      r = Math.min(255, Math.max(0, r * brightnessMul));
      g = Math.min(255, Math.max(0, g * brightnessMul));
      b = Math.min(255, Math.max(0, b * brightnessMul));
    }

    // 2. Contrast
    if (contrastFactor !== 0) {
      r = Math.min(255, Math.max(0, contrastFactorCalc * (r - 128) + 128));
      g = Math.min(255, Math.max(0, contrastFactorCalc * (g - 128) + 128));
      b = Math.min(255, Math.max(0, contrastFactorCalc * (b - 128) + 128));
    }

    // 3. Preset Filters
    if (filter === 'grayscale') {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = gray;
      g = gray;
      b = gray;
    } else if (filter === 'scanner') {
      // Document Scanner: high-pass thresholding with clear paper whitening
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      if (luminance > 140) {
        // Brighten background towards paper white
        const boost = (luminance - 140) * 1.8;
        r = Math.min(255, r + boost);
        g = Math.min(255, g + boost);
        b = Math.min(255, b + boost);
      } else {
        // Darken text to crisp black/dark gray
        const factor = Math.max(0.4, luminance / 140);
        r = r * factor * 0.8;
        g = g * factor * 0.8;
        b = b * factor * 0.8;
      }
    } else if (filter === 'contrast') {
      const avg = (r + g + b) / 3;
      r = avg > 128 ? Math.min(255, r * 1.25) : Math.max(0, r * 0.8);
      g = avg > 128 ? Math.min(255, g * 1.25) : Math.max(0, g * 0.8);
      b = avg > 128 ? Math.min(255, b * 1.25) : Math.max(0, b * 0.8);
    } else if (filter === 'sepia') {
      const sr = r * 0.393 + g * 0.769 + b * 0.189;
      const sg = r * 0.349 + g * 0.686 + b * 0.168;
      const sb = r * 0.272 + g * 0.534 + b * 0.131;
      r = Math.min(255, sr);
      g = Math.min(255, sg);
      b = Math.min(255, sb);
    }

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }

  ctx.putImageData(imgData, 0, 0);
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = dataUrl;
  });
}
