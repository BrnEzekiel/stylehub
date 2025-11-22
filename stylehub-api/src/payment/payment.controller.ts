// src/payment/payment.controller.ts

import { Controller, Post, Body, UseGuards, Request, Patch } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // --------------------------------------------------
  // 🛑 POST /api/payment/intent (Initiates Payment)
  // --------------------------------------------------
  @UseGuards(JwtAuthGuard)
  @Post('intent')
  createPaymentIntent(@Request() req, @Body() dto: CreatePaymentIntentDto) {
    return this.paymentService.createPaymentIntent(req.user.sub, dto);
  }

  // --------------------------------------------------
  // 🛑 PATCH /api/payment/confirm (Simulates Confirmation)
  // Note: In production, this would be a secure webhook
  // --------------------------------------------------
  @Patch('confirm')
  confirmPayment(@Body('orderId') orderId: string, @Body('paymentId') paymentId: string) {
    // Note: We skip the guard here to simulate an external webhook callback, 
    // but in a real webhook, proper signature verification is REQUIRED.
    return this.paymentService.confirmPayment(orderId, paymentId);
  }
}