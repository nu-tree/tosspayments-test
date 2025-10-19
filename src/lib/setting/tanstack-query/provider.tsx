// Next.js에서는 이 파일을 app/providers.jsx로 명명합니다.
'use client';

// QueryClientProvider는 내부적으로 useContext를 사용하므로, 파일 상단에 'use client'를 반드시 선언해야 합니다.
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from './query-client';

export function TanstackQueryProvider({ children }: { children: React.ReactNode }) {
  // NOTE: 쿼리 클라이언트를 초기화할 때 useState를 사용하지 마세요.
  //       이 컴포넌트와 suspend될 수 있는 코드 사이에 suspense boundary가 없다면,
  //       React가 초기 렌더링 시 클라이언트를 버릴 수 있습니다.
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
