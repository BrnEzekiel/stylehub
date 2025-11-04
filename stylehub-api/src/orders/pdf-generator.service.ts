// src/orders/pdf-generator.service.ts

import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Order } from '@prisma/client';

// Define a type for the detailed order data
type DetailedOrder = Order & {
  user: { name: string; email: string };
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
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      font: 'Helvetica',
    });

    // --- Header ---
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

    // --- Order Details ---
    doc.fontSize(12).fillColor('#333');
    doc.text(`Order ID:`, { continued: true }).fillColor('#555').text(` ${order.id.substring(0, 8)}...`);
    doc.text(`Date:`, { continued: true }).fillColor('#555').text(` ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.text(`Status:`, { continued: true }).fillColor('#555').text(` ${order.status}`);
    doc.moveDown(1.5);

    // --- Shipping & Billing ---
    doc.fontSize(14).fillColor('#0f35df').text('Shipping To:');
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#444');
    doc.text(order.shippingAddress.fullName);
    doc.text(order.shippingAddress.street);
    doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`);
    doc.text(order.shippingAddress.country);
    doc.text(`Phone: ${order.shippingAddress.phone}`);
    doc.moveDown(1.5);

    // --- Items Table Header ---
    doc.fontSize(14).fillColor('#0f35df').text('Order Summary');
    doc.moveDown(0.5);
    const tableTop = doc.y;
    doc.fontSize(11).fillColor('#222');
    doc.text('Item', 50, tableTop, { width: 250, continued: true });
    doc.text('Qty', 300, tableTop, { width: 50, align: 'center', continued: true });
    doc.text('Unit Price', 350, tableTop, { width: 100, align: 'right', continued: true });
    doc.text('Total', 450, tableTop, { width: 100, align: 'right' });

    // --- Table Divider ---
    doc
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .strokeColor('#ccc')
      .stroke();
    doc.moveDown(0.5);

    // --- Items Table Rows ---
    let itemsY = doc.y;
    doc.fontSize(10).fillColor('#444');
    for (const item of order.items) {
      const itemTotal = (item.unitPrice as any).toNumber() * item.quantity;
      doc.text(item.productName, 50, itemsY, { width: 250, continued: true });
      doc.text(item.quantity.toString(), 300, itemsY, { width: 50, align: 'center', continued: true });
      doc.text(`Ksh ${item.unitPrice}`, 350, itemsY, { width: 100, align: 'right', continued: true });
      doc.text(`Ksh ${itemTotal.toFixed(2)}`, 450, itemsY, { width: 100, align: 'right' });
      itemsY += 20;
    }

    // --- Table Total ---
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

    // --- Footer ---
    doc.fontSize(10).fillColor('#888').text('Thank you for shopping with StyleHub!', 50, 750, { align: 'center' });

    // --- Finalize PDF ---
    // We use a buffer to stream the file back to the client
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    
    return new Promise((resolve) => {
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.end();
    });
  }
}