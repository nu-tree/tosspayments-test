'use client';
import {
  loadTossPayments,
  type TossPaymentsWidgets,
  type WidgetPaymentMethodWidget,
  type WidgetAgreementWidget,
} from '@tosspayments/tosspayments-sdk';
import { useEffect, useRef, useState } from 'react';

/**
 * 우리 훅의 파라미터 타입 (SDK에는 없는 커스텀 타입)
 */
type UseTossPaymentsParams = {
  clientKey: string;
  customerKey: string;
};

/**
 * SDK 메서드 파라미터 타입들 (SDK에서 추출)
 */
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
   * 결제 금액 설정
   * @param amount - 결제 금액 정보 (SDK의 setAmount 파라미터 타입 사용)
   */
  const setAmount = async (amount: SetAmountParams) => {
    if (!widgetsRef.current) {
      throw new Error('Widgets not initialized');
    }

    try {
      await widgetsRef.current.setAmount(amount);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to set amount');
    }
  };

  /**
   * 결제 위젯 렌더링
   * @param params - 위젯 렌더링 파라미터 (SDK의 renderPaymentMethods 파라미터 타입 사용)
   */
  const renderPaymentWidget = async ({ selector, variantKey = 'DEFAULT' }: RenderPaymentMethodsParams) => {
    if (!widgetsRef.current) {
      throw new Error('Widgets not initialized');
    }

    try {
      const widget = await widgetsRef.current.renderPaymentMethods({ selector, variantKey });
      paymentMethodWidgetRef.current = widget;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to render payment widget');
    }
  };

  /**
   * 이용약관 위젯 렌더링
   * @param params - 약관 렌더링 파라미터 (SDK의 renderAgreement 파라미터 타입 사용)
   */
  const renderAgreement = async ({ selector, variantKey = 'AGREEMENT' }: RenderAgreementParams) => {
    if (!widgetsRef.current) {
      throw new Error('Widgets not initialized');
    }

    try {
      const widget = await widgetsRef.current.renderAgreement({ selector, variantKey });
      agreementWidgetRef.current = widget;
      setIsReady(true);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to render agreement widget');
    }
  };

  /**
   * 결제 요청
   * @param params - 결제 요청 파라미터 (SDK의 requestPayment 파라미터 타입 사용)
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
    setAmount,
    renderPaymentWidget,
    renderAgreement,
    requestPayment,
    getSelectedPaymentMethod,
  };
};

