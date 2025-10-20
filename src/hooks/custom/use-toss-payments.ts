'use client';
import {
  loadTossPayments,
  type TossPaymentsWidgets,
  type WidgetPaymentMethodWidget,
  type WidgetAgreementWidget,
} from '@tosspayments/tosspayments-sdk';
import { useEffect, useRef, useState } from 'react';

type UseTossPaymentsParams = {
  clientKey: string;
  customerKey: string;
};

type SetAmountParams = Parameters<TossPaymentsWidgets['setAmount']>[0];
type RenderPaymentMethodsParams = Parameters<TossPaymentsWidgets['renderPaymentMethods']>[0];
type RenderAgreementParams = Parameters<TossPaymentsWidgets['renderAgreement']>[0];
type RequestPaymentParams = Parameters<TossPaymentsWidgets['requestPayment']>[0];

/**
 * Toss Payments 위젯을 초기화하고 결제 관련 기능을 제공하는 훅
 */
export const useTossPayments = ({ clientKey, customerKey }: UseTossPaymentsParams) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isReady, setIsReady] = useState(false);

  const widgetsRef = useRef<TossPaymentsWidgets | null>(null);
  const paymentMethodWidgetRef = useRef<WidgetPaymentMethodWidget | null>(null);
  const agreementWidgetRef = useRef<WidgetAgreementWidget | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const tossPayments = await loadTossPayments(clientKey);
        widgetsRef.current = tossPayments.widgets({ customerKey });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize Toss Payments'));
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [clientKey, customerKey]);

  const setAmount = async (amount: SetAmountParams) => {
    if (!widgetsRef.current) throw new Error('Widgets not initialized');
    await widgetsRef.current.setAmount(amount);
  };

  const renderPaymentWidget = async ({ selector, variantKey = 'DEFAULT' }: RenderPaymentMethodsParams) => {
    if (!widgetsRef.current) throw new Error('Widgets not initialized');
    const widget = await widgetsRef.current.renderPaymentMethods({ selector, variantKey });
    paymentMethodWidgetRef.current = widget;
  };

  const renderAgreement = async ({ selector, variantKey = 'AGREEMENT' }: RenderAgreementParams) => {
    if (!widgetsRef.current) throw new Error('Widgets not initialized');
    const widget = await widgetsRef.current.renderAgreement({ selector, variantKey });
    agreementWidgetRef.current = widget;
    setIsReady(true);
  };

  const requestPayment = async (params: RequestPaymentParams) => {
    if (!widgetsRef.current) throw new Error('Widgets not initialized');
    return await widgetsRef.current.requestPayment(params);
  };

  const getSelectedPaymentMethod = async () => {
    if (!paymentMethodWidgetRef.current) throw new Error('Payment method widget not rendered');
    return await paymentMethodWidgetRef.current.getSelectedPaymentMethod();
  };

  return {
    isLoading,
    error,
    isReady,
    setAmount,
    renderPaymentWidget,
    renderAgreement,
    requestPayment,
    getSelectedPaymentMethod,
  };
};

