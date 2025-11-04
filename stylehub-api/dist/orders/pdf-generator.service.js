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
let PdfGeneratorService = class PdfGeneratorService {
    async generateReceipt(order) {
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50,
            font: 'Helvetica',
        });
        doc
            .fontSize(24)
            .fillColor('#0f35df')
            .text('StyleHub', { align: 'center' });
        doc.moveDown(0.5);
        doc
            .fontSize(18)
            .fillColor('#222')
            .text('Order Receipt', { align: 'center' });
        doc.moveDown(2);
        doc.fontSize(12).fillColor('#333');
        doc.text(`Order ID:`, { continued: true }).fillColor('#555').text(` ${order.id.substring(0, 8)}...`);
        doc.text(`Date:`, { continued: true }).fillColor('#555').text(` ${new Date(order.createdAt).toLocaleDateString()}`);
        doc.text(`Status:`, { continued: true }).fillColor('#555').text(` ${order.status}`);
        doc.moveDown(1.5);
        doc.fontSize(14).fillColor('#0f35df').text('Shipping To:');
        doc.moveDown(0.5);
        doc.fontSize(12).fillColor('#444');
        doc.text(order.shippingAddress.fullName);
        doc.text(order.shippingAddress.street);
        doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`);
        doc.text(order.shippingAddress.country);
        doc.text(`Phone: ${order.shippingAddress.phone}`);
        doc.moveDown(1.5);
        doc.fontSize(14).fillColor('#0f35df').text('Order Summary');
        doc.moveDown(0.5);
        const tableTop = doc.y;
        doc.fontSize(11).fillColor('#222');
        doc.text('Item', 50, tableTop, { width: 250, continued: true });
        doc.text('Qty', 300, tableTop, { width: 50, align: 'center', continued: true });
        doc.text('Unit Price', 350, tableTop, { width: 100, align: 'right', continued: true });
        doc.text('Total', 450, tableTop, { width: 100, align: 'right' });
        doc
            .moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .strokeColor('#ccc')
            .stroke();
        doc.moveDown(0.5);
        let itemsY = doc.y;
        doc.fontSize(10).fillColor('#444');
        for (const item of order.items) {
            const itemTotal = item.unitPrice.toNumber() * item.quantity;
            doc.text(item.productName, 50, itemsY, { width: 250, continued: true });
            doc.text(item.quantity.toString(), 300, itemsY, { width: 50, align: 'center', continued: true });
            doc.text(`Ksh ${item.unitPrice}`, 350, itemsY, { width: 100, align: 'right', continued: true });
            doc.text(`Ksh ${itemTotal.toFixed(2)}`, 450, itemsY, { width: 100, align: 'right' });
            itemsY += 20;
        }
        doc.y = itemsY + 10;
        doc
            .moveTo(350, doc.y)
            .lineTo(550, doc.y)
            .strokeColor('#555')
            .stroke();
        doc.moveDown(0.5);
        doc.fontSize(14).fillColor('#000');
        doc.text('Grand Total:', 350, doc.y, { width: 100, align: 'right', continued: true });
        doc.text(`Ksh ${order.totalAmount}`, 450, doc.y, { width: 100, align: 'right' });
        doc.fontSize(10).fillColor('#888').text('Thank you for shopping with StyleHub!', 50, 750, { align: 'center' });
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        return new Promise((resolve) => {
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
            doc.end();
        });
    }
};
exports.PdfGeneratorService = PdfGeneratorService;
exports.PdfGeneratorService = PdfGeneratorService = __decorate([
    (0, common_1.Injectable)()
], PdfGeneratorService);
//# sourceMappingURL=pdf-generator.service.js.map