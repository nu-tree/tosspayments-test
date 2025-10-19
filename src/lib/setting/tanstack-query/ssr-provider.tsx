import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getQueryClient } from './query-client';

export async function TanstackQuerySSRProvider({
  children,
  queryClient = getQueryClient(),
  prefetchs = [],
}: {
  children: React.ReactNode;
  queryClient?: QueryClient;
  prefetchs?: ((queryClient: QueryClient) => Promise<void>)[];
}) {
  const results = await Promise.allSettled(prefetchs.map((prefetch) => prefetch(queryClient)));
  const rejectedList = results.filter((result) => result.status === 'rejected');
  if (rejectedList.length > 0) {
    console.log('rejectedList Length', rejectedList.length);
    console.log(
      'rejectedList',
      rejectedList.map((result) => result.reason),
    );
  }

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
