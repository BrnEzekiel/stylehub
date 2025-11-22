// src/orders/pdf-generator.service.ts

import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Order } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { applyWatermark } from '../utils/pdfUtils';

// Define a type for the detailed order data
type DetailedOrder = Order & {
  user: { name: string; email: string; phone?: string };
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: any; // Prisma.Decimal
  }>;
};

@Injectable()
export class PdfGeneratorService {
  async generateReceipt(order: DetailedOrder): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 50,
          font: 'Helvetica',
        });

        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);
        // Apply watermark across pages
        applyWatermark(doc);

        // --- Header with logo ---
        const logoPath = path.resolve(process.cwd(), '../stylehub-client/public/logo192.png');
        const headerY = 50;
        if (fs.existsSync(logoPath)) {
          try {
            doc.image(logoPath, 50, headerY, { width: 80 });
          } catch (e) {
            // ignore image errors
          }
        }

        // Company name and title to the right of the logo
        doc.font('Helvetica-Bold').fontSize(20).fillColor('#222').text('StyleHub', 140, headerY + 10);
        doc.font('Helvetica').fontSize(12).fillColor('#666').text('Order Receipt', 140, headerY + 36);
        // Right aligned: order created date
        const createdAt = order?.createdAt ? new Date(order.createdAt) : new Date();
        const dateStr = createdAt.toLocaleString();
        doc.font('Helvetica').fontSize(10).fillColor('#444').text(`Date: ${dateStr}`, 50, headerY + 10, { align: 'right', width: 495 });
        doc.moveDown(2);

        // Horizontal rule
        doc.moveTo(50, headerY + 100).lineTo(545, headerY + 100).strokeColor('#eeeeee').stroke();
        doc.moveDown(1.5);

        // --- Two-column layout for order details ---
        const startX = 50;
        const colGap = 20;
        const colWidth = (545 - startX - colGap) / 2;

        // Left column: Order Details
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

        // Right column: Shipping Address
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

        // Customer information below order details
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

        // --- Items Table ---
        const itemsStartY = Math.max(yCustomer, yRight) + 10;
        doc.font('Helvetica-Bold').fontSize(12).fillColor('#fa0f8c').text('Order Items', startX, itemsStartY);
        doc.moveDown(1);

        const tableTop = doc.y;
        doc.fontSize(10).fillColor('#222');
        doc.text('Item', startX, tableTop, { width: 200, continued: true });
        doc.text('Qty', startX + 200, tableTop, { width: 50, align: 'center', continued: true });
        doc.text('Unit Price', startX + 250, tableTop, { width: 100, align: 'right', continued: true });
        doc.text('Total', startX + 350, tableTop, { width: 100, align: 'right' });

        // --- Table Divider ---
        doc.moveTo(startX, doc.y + 2).lineTo(545, doc.y + 2).strokeColor('#ccc').stroke();
        doc.moveDown(0.5);

        // --- Items Table Rows ---
        let itemsY = doc.y;
        doc.fontSize(10).fillColor('#444');
        for (const item of order.items) {
          const itemTotal = (item.unitPrice as any).toNumber() * item.quantity;
          doc.text(item.productName, startX, itemsY, { width: 200, continued: true });
          doc.text(item.quantity.toString(), startX + 200, itemsY, { width: 50, align: 'center', continued: true });
          doc.text(`KSh ${item.unitPrice}`, startX + 250, itemsY, { width: 100, align: 'right', continued: true });
          doc.text(`KSh ${itemTotal.toFixed(2)}`, startX + 350, itemsY, { width: 100, align: 'right' });
          itemsY += 18;
        }

        // --- Total box at bottom-right ---
        const totalAmount = typeof order.totalAmount === 'string' ? parseFloat(order.totalAmount) : order.totalAmount;
        const boxWidth = 180;
        const boxX = 545 - boxWidth;
        const boxY = itemsY + 20;
        doc.rect(boxX, boxY, boxWidth, 60).fillOpacity(0.03).fillAndStroke('#fafafa', '#eee');
        doc.fillOpacity(1);
        doc.fontSize(12).fillColor('#444').text('Grand Total', boxX + 10, boxY + 12);
        doc.fontSize(16).fillColor('#fa0f8c').text(`KSh ${totalAmount.toFixed(2)}`, boxX + 10, boxY + 28);

        // --- Footer ---
        doc.fontSize(10).fillColor('#999').text('Thank you for shopping with StyleHub!', 50, 750, { align: 'center' });
        doc.fontSize(9).fillColor('#bbb').text('Please keep this receipt for your records.', 50, 765, { align: 'center' });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}