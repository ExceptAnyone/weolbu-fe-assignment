import { QueryClient } from '@tanstack/react-query';

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5분
const DEFAULT_GC_TIME = 1000 * 60 * 10; // 10분

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_STALE_TIME, // 5분간 fresh 상태 유지
      gcTime: DEFAULT_GC_TIME, // 10분간 캐시 유지
      retry: 1, // 실패 시 1번 재시도
      refetchOnWindowFocus: false, // 윈도우 포커스 시 재조회 비활성화
    },
    mutations: {
      retry: 0, // mutation은 재시도하지 않음
    },
  },
});
