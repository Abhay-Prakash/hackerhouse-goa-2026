// ─── Image Processor ──────────────────────────────────────────────────────────
// Normalises any uploaded photo into a square, face-centred crop.
// Works client-side only (no server round-trips).

export interface ProcessedImage {
  dataUrl: string;       // base64 PNG
  width: number;
  height: number;
}

/**
 * Convert HEIC → PNG via heic2any (dynamic import to avoid SSR issues).
 */
export async function heicToDataUrl(file: File): Promise<string> {
  const heic2any = (await import('heic2any')).default;
  const blob = await heic2any({ blob: file, toType: 'image/png' }) as Blob;
  return blobToDataUrl(blob);
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Load an image element from a data URL or object URL.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Process a user photo:
 * 1. Converts HEIC if necessary.
 * 2. Auto-crops to square by centering on the image (top-biased for portraits
 *    so faces are captured even without ML face detection).
 * 3. Returns a 600×600 PNG data URL ready for canvas rendering.
 */
export async function processPhoto(file: File): Promise<ProcessedImage> {
  let dataUrl: string;

  const isHeic =
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    file.name.toLowerCase().endsWith('.heic') ||
    file.name.toLowerCase().endsWith('.heif');

  if (isHeic) {
    dataUrl = await heicToDataUrl(file);
  } else {
    dataUrl = await blobToDataUrl(file);
  }

  const img = await loadImage(dataUrl);

  const OUTPUT_SIZE = 600;
  const canvas = document.createElement('canvas');
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const ctx = canvas.getContext('2d')!;

  const { naturalWidth: w, naturalHeight: h } = img;
  const side = Math.min(w, h);

  // Center X; for portraits bias Y upward (top 40% → face region)
  const sx = (w - side) / 2;
  const sy = h > w ? (h - side) * 0.25 : (h - side) / 2;

  ctx.drawImage(img, sx, sy, side, side, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

  return {
    dataUrl: canvas.toDataURL('image/png'),
    width: OUTPUT_SIZE,
    height: OUTPUT_SIZE,
  };
}
