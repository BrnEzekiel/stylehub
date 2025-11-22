"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyWatermark = applyWatermark;
const fs = require("fs");
const path = require("path");
function applyWatermark(doc, options) {
    const logoPath = options?.logoPath || path.resolve(process.cwd(), '../stylehub-client/public/logo192.png');
    const tileSize = options?.tileSize ?? 40;
    const tileGap = options?.tileGap ?? 30;
    const opacity = options?.opacity ?? 0.06;
    const draw = () => {
        if (!fs.existsSync(logoPath))
            return;
        try {
            doc.save();
            if (typeof doc.opacity === 'function')
                doc.opacity(opacity);
            const pageWidth = doc.page?.width ?? 595;
            const pageHeight = doc.page?.height ?? 842;
            for (let y = -tileSize; y < pageHeight + tileSize; y += tileSize + tileGap) {
                for (let x = -tileSize; x < pageWidth + tileSize; x += tileSize + tileGap) {
                    try {
                        doc.image(logoPath, x, y, { width: tileSize, height: tileSize });
                    }
                    catch (e) {
                    }
                }
            }
            if (typeof doc.opacity === 'function')
                doc.opacity(1);
            doc.restore();
        }
        catch (e) {
        }
    };
    draw();
    if (typeof doc.on === 'function') {
        doc.on('page', draw);
    }
}
//# sourceMappingURL=pdfUtils.js.map