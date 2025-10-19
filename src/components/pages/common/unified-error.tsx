'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Home, RefreshCw, ArrowLeft, LifeBuoy } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * 에러 타입 정의
 */
type ErrorType = 'general' | 'auth' | 'platform' | 'global' | 'not-found' | 'api';

/**
 * 에러 컨텍스트 정의
 */
interface ErrorContext {
  error?: Error & { digest?: string };
  reset?: () => void;
  errorCode?: number;
  pathname?: string;
}

/**
 * 통합 에러 컴포넌트 Props
 */
interface UnifiedErrorProps {
  /** 에러 타입 - 자동으로 적절한 메시지와 액션을 결정 */
  type?: ErrorType;
  /** 에러 컨텍스트 정보 */
  context?: ErrorContext;
  /** 커스텀 제목 (옵션) */
  customTitle?: string;
  /** 커스텀 설명 (옵션) */
  customDescription?: string;
  /** Global error용 html wrapper 여부 */
  isGlobalError?: boolean;
}

/**
 * 통합 에러 컴포넌트
 * - 모든 에러 상황을 하나의 컴포넌트로 통합 관리
 * - 에러 타입에 따른 자동 메시지 및 액션 제공
 * - 커스터마이징 가능한 유연한 구조
 * - Hydration 에러 방지를 위한 안전한 시간 표시
 */
export function UnifiedError({
  type = 'general',
  context = {},
  customTitle,
  customDescription,
  isGlobalError = false,
}: UnifiedErrorProps) {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<string>('');

  // 클라이언트에서만 시간을 설정하여 Hydration 에러 방지
  useEffect(() => {
    setCurrentTime(new Date().toLocaleString('ko-KR'));
  }, []);

  // 에러 로깅 (type별로 다른 로그 레벨)
  useEffect(() => {
    if (context.error) {
      const logLevel = type === 'global' ? 'CRITICAL' : type === 'auth' ? 'WARNING' : 'ERROR';
      console.error(`[${logLevel}] ${type.toUpperCase()} Error:`, context.error);

      // 에러 리포팅 서비스 연동 (type별 우선순위)
      // if (type === 'global') reportCriticalError(context.error);
      // else reportError(context.error, { type, context });
    }
  }, [context.error, type]);

  /**
   * 에러 타입별 설정 정보를 반환
   */
  const getErrorConfig = () => {
    const configs = {
      'not-found': {
        code: 404,
        title: '페이지를 찾을 수 없습니다',
        description: '요청하신 페이지가 존재하지 않거나 이동되었습니다.',
        showHome: true,
        showRefresh: false,
        showSupport: true,
      },
      auth: {
        code: 403,
        title: '인증 오류가 발생했습니다',
        description: '로그인 또는 인증 처리 중 문제가 발생했습니다. 다시 로그인하거나 잠시 후 시도해주세요.',
        showHome: true,
        showRefresh: true,
        showSupport: true,
      },
      platform: {
        code: 500,
        title: '상품 정보를 불러올 수 없습니다',
        description: '상품 정보를 가져오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
        showHome: true,
        showRefresh: true,
        showSupport: false,
      },
      global: {
        code: 500,
        title: '심각한 오류가 발생했습니다',
        description: '앱에 예상치 못한 문제가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.',
        showHome: true,
        showRefresh: true,
        showSupport: true,
      },
      api: {
        code: 500,
        title: 'API 오류가 발생했습니다',
        description: '서버와의 통신 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
        showHome: true,
        showRefresh: true,
        showSupport: true,
      },
      general: {
        code: 500,
        title: '문제가 발생했습니다',
        description: '예상치 못한 오류가 발생했습니다.',
        showHome: true,
        showRefresh: true,
        showSupport: true,
      },
    };

    const config = configs[type];

    // 개발 환경에서 상세 에러 정보 추가
    if (process.env.NODE_ENV === 'development' && context.error) {
      return {
        ...config,
        title: customTitle || `에러: ${context.error.message}`,
        description: customDescription || `디버그 정보: ${context.error.stack?.split('\n')[0] || '스택 정보 없음'}`,
      };
    }

    return {
      ...config,
      title: customTitle || config.title,
      description: customDescription || config.description,
      code: context.errorCode || config.code,
    };
  };

  const errorConfig = getErrorConfig();

  /**
   * 에러 페이지 콘텐츠
   */
  const ErrorContent = () => (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        {/* 에러 아이콘 */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <div className="mb-2 text-6xl font-bold text-gray-300">{errorConfig.code}</div>
        </div>

        {/* 에러 메시지 카드 */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-xl text-gray-900">{errorConfig.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="leading-relaxed text-gray-600">{errorConfig.description}</p>

            {/* 액션 버튼들 */}
            <div className="space-y-3">
              {/* 주요 액션 버튼 */}
              <div className="grid grid-cols-1 gap-3">
                {errorConfig.showHome && (
                  <Button
                    onClick={() => router.push('/')}
                    className="bg-primary-75 hover:bg-primary-100 w-full text-white"
                    size="lg"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    홈으로 이동
                  </Button>
                )}

                {errorConfig.showRefresh && context.reset && (
                  <Button onClick={context.reset} variant="outline" className="w-full" size="lg">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    다시 시도
                  </Button>
                )}
              </div>

              {/* 보조 액션 버튼 */}
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => router.back()} variant="ghost" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  뒤로가기
                </Button>

                {errorConfig.showSupport && (
                  <Button onClick={() => window.open('/support', '_blank')} variant="ghost" className="w-full">
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    지원
                  </Button>
                )}
              </div>
            </div>

            {/* 추가 정보 */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400">
                문제가 계속 발생하면{' '}
                <button
                  onClick={() => window.open('mailto:support@example.com')}
                  className="text-primary-75 hover:text-primary-100 underline"
                >
                  고객지원팀
                </button>
                에 문의해주세요.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 하단 도움말 */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-4 text-sm text-gray-500">
            <span>오류 코드: {errorConfig.code}</span>
            <span>타입: {type.toUpperCase()}</span>
            {currentTime && (
              <>
                <span>•</span>
                <span>시간: {currentTime}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Global error의 경우 html wrapper 추가
  if (isGlobalError) {
    return (
      <html>
        <body>
          <ErrorContent />
        </body>
      </html>
    );
  }

  return <ErrorContent />;
}

/**
 * 편의 함수들 - 각 에러 타입별 쉬운 사용을 위한 래퍼 함수들
 */

export function NotFoundError() {
  return <UnifiedError type="not-found" />;
}

export function AuthError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <UnifiedError type="auth" context={{ error, reset }} />;
}

export function PlatformError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <UnifiedError type="platform" context={{ error, reset }} />;
}

export function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <UnifiedError type="global" context={{ error, reset }} isGlobalError={true} />;
}

export function GeneralError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <UnifiedError type="general" context={{ error, reset }} />;
}

export function ApiError({ message, statusCode = 500 }: { message?: string; statusCode?: number }) {
  return (
    <UnifiedError
      type="api"
      context={{ errorCode: statusCode }}
      customTitle="API 오류"
      customDescription={message || 'API 요청 중 문제가 발생했습니다.'}
    />
  );
}
