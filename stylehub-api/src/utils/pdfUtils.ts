import * as fs from 'fs';
import * as path from 'path';

/**
 * Apply a tiled faint watermark (logo) across the current page and on subsequent pages.
 * This draws the watermark directly into the PDF content so it's part of the page stream.
 */
export function applyWatermark(doc: any, options?: {
  logoPath?: string;
  tileSize?: number;
  tileGap?: number;
  opacity?: number;
}) {
  const logoPath = options?.logoPath || path.resolve(process.cwd(), '../stylehub-client/public/logo192.png');
  const tileSize = options?.tileSize ?? 40;
  const tileGap = options?.tileGap ?? 30;
  const opacity = options?.opacity ?? 0.06;

  const draw = () => {
    if (!fs.existsSync(logoPath)) return;
    try {
      doc.save();
      if (typeof (doc as any).opacity === 'function') (doc as any).opacity(opacity);
      const pageWidth = doc.page?.width ?? 595;
      const pageHeight = doc.page?.height ?? 842;
      for (let y = -tileSize; y < pageHeight + tileSize; y += tileSize + tileGap) {
        for (let x = -tileSize; x < pageWidth + tileSize; x += tileSize + tileGap) {
          try {
            doc.image(logoPath, x, y, { width: tileSize, height: tileSize });
          } catch (e) {
            // ignore single tile failures
          }
        }
      }
      if (typeof (doc as any).opacity === 'function') (doc as any).opacity(1);
      doc.restore();
    } catch (e) {
      // ignore watermark failures
    }
  };

  // Draw immediately for the current page
  draw();

  // Also draw on each new page
  if (typeof doc.on === 'function') {
    doc.on('page', draw);
  }
}
