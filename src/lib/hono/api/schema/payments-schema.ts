import { z } from 'zod';

/**
 * 결제 승인 요청 스키마
 */
export const confirmPaymentBodySchema = z.object({
  paymentKey: z.string().min(1, '결제 키가 필요합니다.'),
  orderId: z.string().min(1, '주문번호가 필요합니다.'),
  amount: z.string().min(1, '결제 금액이 필요합니다.'),
});

/**
 * 결제 승인 응답 스키마 (Toss Payments API 공식 응답)
 */
export const confirmPaymentResponseSchema = z.object({
  version: z.string(),
  paymentKey: z.string(),
  type: z.string(),
  orderId: z.string(),
  orderName: z.string(),
  mId: z.string(),
  currency: z.string(),
  method: z.string(),
  totalAmount: z.number(),
  balanceAmount: z.number(),
  status: z.string(),
  requestedAt: z.string(),
  approvedAt: z.string(),
  useEscrow: z.boolean(),
  lastTransactionKey: z.string().nullable(),
  suppliedAmount: z.number(),
  vat: z.number(),
  cultureExpense: z.boolean(),
  taxFreeAmount: z.number(),
  taxExemptionAmount: z.number(),
  cancels: z.array(z.any()).nullable(),
  isPartialCancelable: z.boolean(),
  card: z
    .object({
      amount: z.number(),
      issuerCode: z.string(),
      acquirerCode: z.string().nullable(),
      number: z.string(),
      installmentPlanMonths: z.number(),
      approveNo: z.string(),
      useCardPoint: z.boolean(),
      cardType: z.string(),
      ownerType: z.string(),
      acquireStatus: z.string(),
      isInterestFree: z.boolean(),
      interestPayer: z.string().nullable(),
    })
    .nullable(),
  virtualAccount: z
    .object({
      accountType: z.string(),
      accountNumber: z.string(),
      bankCode: z.string(),
      customerName: z.string(),
      dueDate: z.string(),
      refundStatus: z.string(),
      expired: z.boolean(),
      settlementStatus: z.string(),
      refundReceiveAccount: z.any().nullable(),
    })
    .nullable(),
  transfer: z
    .object({
      bankCode: z.string(),
      settlementStatus: z.string(),
    })
    .nullable(),
  receipt: z.object({
    url: z.string(),
  }),
  checkout: z.object({
    url: z.string(),
  }),
  easyPay: z
    .object({
      provider: z.string(),
      amount: z.number(),
      discountAmount: z.number(),
    })
    .nullable(),
  country: z.string(),
  failure: z.any().nullable(),
  cashReceipt: z.any().nullable(),
  cashReceipts: z.array(z.any()).nullable(),
  discount: z.any().nullable(),
});

export type ConfirmPaymentBody = z.infer<typeof confirmPaymentBodySchema>;
export type ConfirmPaymentResponse = z.infer<typeof confirmPaymentResponseSchema>;

