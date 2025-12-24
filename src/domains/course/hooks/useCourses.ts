import { useInfiniteQuery } from '@tanstack/react-query';
import { courseApi } from '../api/courseApi';
import { CourseSortType } from '../types/course.types';

const ITEMS_PER_PAGE = 20;

export function useCourses(sortType: CourseSortType = 'recent') {
  return useInfiniteQuery({
    queryKey: ['courses', sortType],
    queryFn: ({ pageParam = 0 }) =>
      courseApi.getCourses({
        page: pageParam,
        size: ITEMS_PER_PAGE,
        sort: sortType,
      }),
    getNextPageParam: (lastPage) => {
      // 마지막 페이지가 아니면 다음 페이지 번호 반환
      return !lastPage.last ? lastPage.pageable.pageNumber + 1 : undefined;
    },
    initialPageParam: 0,
  });
}
