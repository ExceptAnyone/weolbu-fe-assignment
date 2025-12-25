import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useCourses } from '../useCourses';
import { courseApi } from '../../api/courseApi';
import { CoursesResponse, CourseSortType } from '../../types/course.types';

// courseApi 모킹
vi.mock('../../api/courseApi', () => ({
  courseApi: {
    getCourses: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return Wrapper;
};

const createMockResponse = (
  page: number,
  totalPages: number,
  itemsCount = 20
): CoursesResponse => ({
  content: Array.from({ length: itemsCount }, (_, i) => ({
    id: page * 20 + i + 1,
    title: `강의 ${page * 20 + i + 1}`,
    description: `강의 설명 ${page * 20 + i + 1}`,
    instructorName: `강사 ${page % 3 + 1}`,
    maxStudents: 30,
    currentStudents: Math.floor(Math.random() * 30),
    availableSeats: Math.floor(Math.random() * 30),
    isFull: false,
    price: 50000,
    createdAt: new Date().toISOString(),
  })),
  pageable: {
    pageNumber: page,
    pageSize: 20,
  },
  totalElements: totalPages * 20,
  totalPages,
  first: page === 0,
  last: page === totalPages - 1,
});

describe('useCourses', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('초기 로드', () => {
    it('첫 페이지 데이터를 로드한다', async () => {
      const mockResponse = createMockResponse(0, 3);
      vi.mocked(courseApi.getCourses).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useCourses('recent'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(courseApi.getCourses).toHaveBeenCalledWith({
        page: 0,
        size: 20,
        sort: 'recent',
      });

      expect(result.current.data?.pages).toHaveLength(1);
      expect(result.current.data?.pages[0].content).toHaveLength(20);
      expect(result.current.data?.pages[0].pageable.pageNumber).toBe(0);
    });

    it('sortType이 변경되면 새로운 쿼리를 실행한다', async () => {
      const recentResponse = createMockResponse(0, 3);
      const popularResponse = createMockResponse(0, 3);

      vi.mocked(courseApi.getCourses).mockResolvedValueOnce(recentResponse);

      const { result, rerender } = renderHook(
        ({ sortType }) => useCourses(sortType),
        {
          wrapper: createWrapper(),
          initialProps: { sortType: 'recent' as CourseSortType },
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(courseApi.getCourses).toHaveBeenCalledWith({
        page: 0,
        size: 20,
        sort: 'recent',
      });

      // sortType 변경
      vi.mocked(courseApi.getCourses).mockResolvedValueOnce(popularResponse);
      rerender({ sortType: 'popular' as CourseSortType });

      await waitFor(() => {
        expect(courseApi.getCourses).toHaveBeenCalledWith({
          page: 0,
          size: 20,
          sort: 'popular',
        });
      });
    });
  });

  describe('페이지네이션', () => {
    it('다음 페이지를 로드할 수 있다', async () => {
      const page0Response = createMockResponse(0, 3);
      const page1Response = createMockResponse(1, 3);

      vi.mocked(courseApi.getCourses)
        .mockResolvedValueOnce(page0Response)
        .mockResolvedValueOnce(page1Response);

      const { result } = renderHook(() => useCourses('recent'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.hasNextPage).toBe(true);

      // 다음 페이지 로드
      result.current.fetchNextPage();

      await waitFor(() => {
        expect(result.current.data?.pages).toHaveLength(2);
      });

      expect(courseApi.getCourses).toHaveBeenCalledTimes(2);
      expect(courseApi.getCourses).toHaveBeenNthCalledWith(2, {
        page: 1,
        size: 20,
        sort: 'recent',
      });

      expect(result.current.data?.pages[1].pageable.pageNumber).toBe(1);
    });

    it('마지막 페이지에서는 hasNextPage가 false이다', async () => {
      const lastPageResponse = createMockResponse(2, 3); // 마지막 페이지 (last: true)

      vi.mocked(courseApi.getCourses).mockResolvedValueOnce(lastPageResponse);

      const { result } = renderHook(() => useCourses('recent'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.hasNextPage).toBe(false);
    });

    it('중간 페이지에서는 hasNextPage가 true이다', async () => {
      const middlePageResponse = createMockResponse(1, 3); // 중간 페이지 (last: false)

      vi.mocked(courseApi.getCourses).mockResolvedValueOnce(middlePageResponse);

      const { result } = renderHook(() => useCourses('recent'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.hasNextPage).toBe(true);
    });
  });

  describe('정렬 타입', () => {
    it('recent 정렬을 사용한다', async () => {
      const mockResponse = createMockResponse(0, 1);
      vi.mocked(courseApi.getCourses).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useCourses('recent'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(courseApi.getCourses).toHaveBeenCalledWith({
        page: 0,
        size: 20,
        sort: 'recent',
      });
    });

    it('popular 정렬을 사용한다', async () => {
      const mockResponse = createMockResponse(0, 1);
      vi.mocked(courseApi.getCourses).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useCourses('popular'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(courseApi.getCourses).toHaveBeenCalledWith({
        page: 0,
        size: 20,
        sort: 'popular',
      });
    });

    it('rate 정렬을 사용한다', async () => {
      const mockResponse = createMockResponse(0, 1);
      vi.mocked(courseApi.getCourses).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useCourses('rate'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(courseApi.getCourses).toHaveBeenCalledWith({
        page: 0,
        size: 20,
        sort: 'rate',
      });
    });

    it('정렬 타입을 지정하지 않으면 recent가 기본값이다', async () => {
      const mockResponse = createMockResponse(0, 1);
      vi.mocked(courseApi.getCourses).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useCourses(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(courseApi.getCourses).toHaveBeenCalledWith({
        page: 0,
        size: 20,
        sort: 'recent',
      });
    });
  });

  describe('에러 처리', () => {
    it('API 에러를 처리한다', async () => {
      const error = new Error('Network error');
      vi.mocked(courseApi.getCourses).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useCourses('recent'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('로딩 상태', () => {
    it('초기 로딩 중에는 isLoading이 true이다', () => {
      vi.mocked(courseApi.getCourses).mockImplementation(
        () => new Promise(() => {}) // 영원히 pending
      );

      const { result } = renderHook(() => useCourses('recent'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSuccess).toBe(false);
    });
  });
});
