import { useMutation } from '@tanstack/react-query';
import type { ConfirmPaymentBody, ConfirmPaymentResponse } from '@/lib/hono/api/schema/payments-schema';

/**
 * 결제 승인 API 호출 훅
 */
export const usePaymentsConfirm = () => {
  return useMutation({
    mutationFn: async (params: ConfirmPaymentBody) => {
      const response = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return (await response.json()) as ConfirmPaymentResponse;
    },
  });
};

