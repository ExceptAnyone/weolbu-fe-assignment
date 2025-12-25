import { useQuery } from '@tanstack/react-query';
import { courseApi } from '../api/courseApi';
import { Course } from '../types/course.types';

/**
 * 특정 강의의 상세 정보를 조회하는 훅
 */
export function useCourse(courseId: number | null) {
  return useQuery<Course, Error>({
    queryKey: ['course', courseId],
    queryFn: () => {
      if (courseId === null) {
        throw new Error('Course ID is required');
      }
      return courseApi.getCourse(courseId);
    },
    enabled: courseId !== null,
    staleTime: 1000 * 60 * 5,
  });
}
