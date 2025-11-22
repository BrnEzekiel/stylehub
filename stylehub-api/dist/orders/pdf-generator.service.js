"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfGeneratorService = void 0;
const common_1 = require("@nestjs/common");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const pdfUtils_1 = require("../utils/pdfUtils");
let PdfGeneratorService = class PdfGeneratorService {
    async generateReceipt(order) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    size: 'A4',
                    margin: 50,
                    font: 'Helvetica',
                });
                const chunks = [];
                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);
                (0, pdfUtils_1.applyWatermark)(doc);
                const logoPath = path.resolve(process.cwd(), '../stylehub-client/public/logo192.png');
                const headerY = 50;
                if (fs.existsSync(logoPath)) {
                    try {
                        doc.image(logoPath, 50, headerY, { width: 80 });
                    }
                    catch (e) {
                    }
                }
                doc.font('Helvetica-Bold').fontSize(20).fillColor('#222').text('StyleHub', 140, headerY + 10);
                doc.font('Helvetica').fontSize(12).fillColor('#666').text('Order Receipt', 140, headerY + 36);
                const createdAt = order?.createdAt ? new Date(order.createdAt) : new Date();
                const dateStr = createdAt.toLocaleString();
                doc.font('Helvetica').fontSize(10).fillColor('#444').text(`Date: ${dateStr}`, 50, headerY + 10, { align: 'right', width: 495 });
                doc.moveDown(2);
                doc.moveTo(50, headerY + 100).lineTo(545, headerY + 100).strokeColor('#eeeeee').stroke();
                doc.moveDown(1.5);
                const startX = 50;
                const colGap = 20;
                const colWidth = (545 - startX - colGap) / 2;
                let y = headerY + 120;
                doc.font('Helvetica-Bold').fontSize(12).fillColor('#fa0f8c').text('Order Details', startX, y);
                y += 18;
                doc.font('Helvetica').fontSize(10).fillColor('#333').text('Order ID: ', startX, y, { continued: true });
                doc.font('Helvetica-Bold').text(order.id.substring(0, 12));
                y += 14;
                doc.font('Helvetica').fontSize(10).fillColor('#333').text('Status: ', startX, y, { continued: true });
                doc.font('Helvetica-Bold').fillColor(order.status === 'cancelled' ? '#d9534f' : order.status === 'completed' ? '#28a745' : '#0f35df').text(order.status);
                doc.font('Helvetica').fillColor('#333');
                y += 14;
                doc.font('Helvetica').fontSize(10).fillColor('#333').text('Order Date: ', startX, y, { continued: true });
                doc.font('Helvetica-Bold').text(new Date(order.createdAt).toLocaleDateString());
                y += 20;
                const rightX = startX + colWidth + colGap;
                let yRight = headerY + 120;
                doc.font('Helvetica-Bold').fontSize(12).fillColor('#fa0f8c').text('Shipping Address', rightX, yRight);
                yRight += 18;
                doc.font('Helvetica').fontSize(10).fillColor('#333').text('Name: ', rightX, yRight, { continued: true });
                doc.font('Helvetica-Bold').text(order.shippingAddress.fullName);
                yRight += 14;
                doc.font('Helvetica').fontSize(10).fillColor('#333').text('Phone: ', rightX, yRight, { continued: true });
                doc.font('Helvetica-Bold').text(order.shippingAddress.phone);
                yRight += 14;
                doc.font('Helvetica').fontSize(10).fillColor('#333').text('Street: ', rightX, yRight, { continued: true });
                const streetHeight = doc.heightOfString(order.shippingAddress.street, { width: colWidth - 50 });
                doc.font('Helvetica-Bold').text(order.shippingAddress.street, { width: colWidth - 50 });
                yRight += Math.max(14, streetHeight) + 6;
                doc.font('Helvetica').fontSize(10).fillColor('#333').text('City: ', rightX, yRight, { continued: true });
                doc.font('Helvetica-Bold').text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`);
                yRight += 14;
                doc.font('Helvetica').fontSize(10).fillColor('#333').text('Country: ', rightX, yRight, { continued: true });
                doc.font('Helvetica-Bold').text(order.shippingAddress.country);
                yRight += 20;
                doc.font('Helvetica-Bold').fontSize(12).fillColor('#fa0f8c').text('Customer', startX, Math.max(y, yRight));
                let yCustomer = Math.max(y, yRight) + 18;
                doc.font('Helvetica').fontSize(10).fillColor('#333').text('Name: ', startX, yCustomer, { continued: true });
                doc.font('Helvetica-Bold').text(order.user?.name || 'N/A');
                yCustomer += 14;
                doc.font('Helvetica').fontSize(10).fillColor('#333').text('Email: ', startX, yCustomer, { continued: true });
                doc.font('Helvetica-Bold').text(order.user?.email || 'N/A');
                yCustomer += 14;
                doc.font('Helvetica').fontSize(10).fillColor('#333').text('Phone: ', startX, yCustomer, { continued: true });
                doc.font('Helvetica-Bold').text(order.user?.phone || 'N/A');
                yCustomer += 20;
                const itemsStartY = Math.max(yCustomer, yRight) + 10;
                doc.font('Helvetica-Bold').fontSize(12).fillColor('#fa0f8c').text('Order Items', startX, itemsStartY);
                doc.moveDown(1);
                const tableTop = doc.y;
                doc.fontSize(10).fillColor('#222');
                doc.text('Item', startX, tableTop, { width: 200, continued: true });
                doc.text('Qty', startX + 200, tableTop, { width: 50, align: 'center', continued: true });
                doc.text('Unit Price', startX + 250, tableTop, { width: 100, align: 'right', continued: true });
                doc.text('Total', startX + 350, tableTop, { width: 100, align: 'right' });
                doc.moveTo(startX, doc.y + 2).lineTo(545, doc.y + 2).strokeColor('#ccc').stroke();
                doc.moveDown(0.5);
                let itemsY = doc.y;
                doc.fontSize(10).fillColor('#444');
                for (const item of order.items) {
                    const itemTotal = item.unitPrice.toNumber() * item.quantity;
                    doc.text(item.productName, startX, itemsY, { width: 200, continued: true });
                    doc.text(item.quantity.toString(), startX + 200, itemsY, { width: 50, align: 'center', continued: true });
                    doc.text(`KSh ${item.unitPrice}`, startX + 250, itemsY, { width: 100, align: 'right', continued: true });
                    doc.text(`KSh ${itemTotal.toFixed(2)}`, startX + 350, itemsY, { width: 100, align: 'right' });
                    itemsY += 18;
                }
                const totalAmount = typeof order.totalAmount === 'string' ? parseFloat(order.totalAmount) : order.totalAmount;
                const boxWidth = 180;
                const boxX = 545 - boxWidth;
                const boxY = itemsY + 20;
                doc.rect(boxX, boxY, boxWidth, 60).fillOpacity(0.03).fillAndStroke('#fafafa', '#eee');
                doc.fillOpacity(1);
                doc.fontSize(12).fillColor('#444').text('Grand Total', boxX + 10, boxY + 12);
                doc.fontSize(16).fillColor('#fa0f8c').text(`KSh ${totalAmount.toFixed(2)}`, boxX + 10, boxY + 28);
                doc.fontSize(10).fillColor('#999').text('Thank you for shopping with StyleHub!', 50, 750, { align: 'center' });
                doc.fontSize(9).fillColor('#bbb').text('Please keep this receipt for your records.', 50, 765, { align: 'center' });
                doc.end();
            }
            catch (error) {
                reject(error);
            }
        });
    }
};
exports.PdfGeneratorService = PdfGeneratorService;
exports.PdfGeneratorService = PdfGeneratorService = __decorate([
    (0, common_1.Injectable)()
], PdfGeneratorService);
//# sourceMappingURL=pdf-generator.service.js.map