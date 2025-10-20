'use client';
import { loadTossPayments, WidgetPaymentMethodWidget } from '@tosspayments/tosspayments-sdk';
import { useEffect, useRef, useState } from 'react';

type UseTossPaymentsParams = {
  clientKey: string;
  customerKey: string;
  amount: number;
};

type RenderPaymentWidgetParams = {
  selector: string;
};

type RequestPaymentParams = {
  orderId: string;
  orderName: string;
  successUrl: string;
  failUrl: string;
};

/**
 * Toss Payments 위젯을 초기화하고 결제 관련 기능을 제공하는 훅
 */
export const useTossPayments = ({ clientKey, customerKey, amount }: UseTossPaymentsParams) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isReady, setIsReady] = useState(false);

  const widgetsRef = useRef<any>(null);
  const paymentMethodWidgetRef = useRef<WidgetPaymentMethodWidget | null>(null);

  /**
   * 초기화: Toss Payments SDK 로드 및 위젯 인스턴스 생성
   */
  useEffect(() => {
    const initTossPayments = async () => {
      try {
        setIsLoading(true);
        const tossPayments = await loadTossPayments(clientKey);
        const widgetsInstance = tossPayments.widgets({ customerKey });
        widgetsRef.current = widgetsInstance;
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize Toss Payments'));
      } finally {
        setIsLoading(false);
      }
    };

    initTossPayments();
  }, [clientKey, customerKey]);

  /**
   * 결제 위젯 렌더링
   * @param selector - 위젯이 렌더링될 DOM 셀렉터
   */
  const renderPaymentWidget = async ({ selector }: RenderPaymentWidgetParams) => {
    if (!widgetsRef.current) {
      throw new Error('Widgets not initialized');
    }

    try {
      widgetsRef.current.setAmount({ currency: 'KRW', value: amount });
      const widget = await widgetsRef.current.renderPaymentMethods({ selector });
      paymentMethodWidgetRef.current = widget;
      setIsReady(true);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to render payment widget');
    }
  };

  /**
   * 결제 요청
   * @param params - 결제에 필요한 주문 정보
   */
  const requestPayment = async (params: RequestPaymentParams) => {
    if (!widgetsRef.current) {
      throw new Error('Widgets not initialized');
    }

    try {
      const result = await widgetsRef.current.requestPayment(params);
      return result;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Payment request failed');
    }
  };

  /**
   * 선택된 결제 수단 조회
   * @returns 사용자가 선택한 결제 수단 정보
   */
  const getSelectedPaymentMethod = async () => {
    if (!paymentMethodWidgetRef.current) {
      throw new Error('Payment method widget not rendered');
    }

    try {
      const selectedMethod = await paymentMethodWidgetRef.current.getSelectedPaymentMethod();
      return selectedMethod;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to get selected payment method');
    }
  };

  return {
    isLoading,
    error,
    isReady,
    renderPaymentWidget,
    requestPayment,
    getSelectedPaymentMethod,
  };
};

