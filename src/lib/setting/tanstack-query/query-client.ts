import { QueryClient } from '@tanstack/react-query';

function makeQueryClient(staleTime: number) {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        // SSR(서버 사이드 렌더링)에서는 일반적으로 기본 staleTime을
        // 0보다 크게 설정하여 클라이언트에서 즉시 다시 가져오는 것을 방지하고자 합니다.
        // 최소 500ms 이상 설정하여 데이터 캐시 유지 시간을 보장합니다.
        staleTime: Math.max(staleTime * 1000, 500),
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient(staleTime: number = 5) {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient(staleTime);
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient(staleTime);
    return browserQueryClient;
  }
}
