// ─── QR Code Generator ───────────────────────────────────────────────────────
// Thin wrapper around the `qrcode` package for canvas or data-URL output.
// Client-side only.

import QRCode from 'qrcode';

const QR_OPTIONS: QRCode.QRCodeToDataURLOptions = {
  errorCorrectionLevel: 'M',
  margin: 1,
  color: {
    dark: '#0a0a1a',
    light: '#ffffff00', // transparent background
  },
  width: 200,
};

/**
 * Returns a QR code as a PNG data URL.
 */
export async function generateQRDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, QR_OPTIONS);
}

/**
 * Draws a QR code directly onto an existing canvas context.
 */
export async function drawQROnCanvas(
  ctx: CanvasRenderingContext2D,
  url: string,
  x: number,
  y: number,
  size: number
): Promise<void> {
  const dataUrl = await generateQRDataUrl(url);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, x, y, size, size);
      resolve();
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}
