/**
 * Fetch Client 유틸리티
 * 타입 안전성과 일관된 에러 처리를 제공하는 fetch 래퍼
 */

/**
 * 성공 응답 타입
 */
export type FetchSuccess<T> = {
  ok: true;
  data: T;
  status: number;
};

/**
 * 실패 응답 타입 (서버 응답과 일치)
 */
export type FetchFailure = {
  ok: false;
  error: {
    message: string;
    status: number;
    statusText?: string;
    details?: unknown;
    timestamp: string;
  };
};

/**
 * Fetch 결과 타입 (Result 패턴)
 */
export type FetchResult<T> = FetchSuccess<T> | FetchFailure;

type FetchOptions = Omit<RequestInit, 'body'> & {
  baseUrl?: string;
  params?: Record<string, string | number | boolean | undefined | null>;
  body?: BodyInit | Record<string, unknown>;
};

/**
 * 공통 fetch 래퍼
 */
export async function fetchClient<T>(url: string, options?: FetchOptions): Promise<FetchResult<T>> {
  try {
    const { params, body, baseUrl, ...fetchOptions } = options || {};

    const fetchBaseUrl = baseUrl ?? process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

    const urlArray = [fetchBaseUrl, url];

    // URL params 처리
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        urlArray.push(`?${queryString}`);
      }
    }
    const fullUrl = urlArray.join('');

    // 사용자가 지정한 헤더 content-type 확인
    const userHeaders = fetchOptions.headers;
    const hasUserContentType =
      userHeaders && Object.keys(userHeaders).some((key) => key.toLowerCase() === 'content-type');

    const autoHeaders: Record<string, string> = {};
    // 사용자가 지정한 content-type이 없고 body가 있으면 body의 타입에 따라 자동 설정
    if (!hasUserContentType && body) {
      if (body instanceof URLSearchParams) {
        autoHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
      } else if (body instanceof Blob) {
        autoHeaders['Content-Type'] = body.type || 'application/octet-stream';
      } else if (typeof body === 'object' || typeof body === 'string') {
        autoHeaders['Content-Type'] = 'application/json';
      }
      // FormData, ArrayBuffer 등은 기본값 없음
    }

    // body 타입에 따라 직렬화
    const isJsonBody = typeof body === 'object' && !(body instanceof FormData) && !(body instanceof Blob);
    const requestBody = body ? (isJsonBody ? JSON.stringify(body) : body) : undefined;

    // 요청 실행
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      headers: {
        ...autoHeaders,
        ...fetchOptions.headers,
      },
      credentials: 'include',
      body: requestBody,
    });

    // 204 No Content
    if (response.status === 204) {
      return {
        ok: true,
        data: {} as T,
        status: response.status,
      };
    }

    // Response 파싱
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!isJson) {
      // JSON이 아닌 응답은 에러로 처리 (외부 API 등)
      const text = await response.text();
      return {
        ok: false,
        error: {
          message: text || '서버에서 올바르지 않은 응답을 받았습니다.',
          status: response.status,
          statusText: response.statusText,
          timestamp: new Date().toISOString(),
        },
      };
    }

    // 서버 응답을 그대로 반환 (이미 { ok, data/error } 구조)
    const serverResponse = await response.json();

    // 서버 응답이 예상된 구조인지 확인
    if (typeof serverResponse === 'object' && serverResponse !== null && 'ok' in serverResponse) {
      return serverResponse as FetchResult<T>;
    }

    // 예상치 못한 응답 구조 (외부 API 등)
    return {
      ok: false,
      error: {
        message: '서버에서 올바르지 않은 형식의 응답을 받았습니다.',
        status: response.status,
        statusText: response.statusText,
        details: serverResponse,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    // 네트워크 에러 등

    console.log('error', error);
    return {
      ok: false,
      error: {
        message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        status: 0,
        statusText: 'Network Error',
        timestamp: new Date().toISOString(),
      },
    };
  }
}

/**
 * GET 요청
 */
export function fetchGet<T>(url: string, options?: Omit<FetchOptions, 'method' | 'body'>): Promise<FetchResult<T>> {
  return fetchClient<T>(url, { ...options, method: 'GET' });
}

/**
 * POST 요청
 */
export function fetchPost<T, B extends FetchOptions['body']>(url: string, body?: B): Promise<FetchResult<T>> {
  return fetchClient<T>(url, { method: 'POST', body });
}

/**
 * PUT 요청
 */
export function fetchPut<T, B extends FetchOptions['body']>(url: string, body?: B): Promise<FetchResult<T>> {
  return fetchClient<T>(url, { method: 'PUT', body });
}

/**
 * PATCH 요청
 */
export function fetchPatch<T, B extends FetchOptions['body']>(url: string, body?: B): Promise<FetchResult<T>> {
  return fetchClient<T>(url, { method: 'PATCH', body });
}

/**
 * DELETE 요청
 */
export function fetchDelete<T, B extends FetchOptions['body']>(
  url: string,
  body?: B,
  options?: Omit<FetchOptions, 'method' | 'body'>,
): Promise<FetchResult<T>> {
  return fetchClient<T>(url, { ...options, method: 'DELETE', body });
}
