import { useMutation, useQueryClient } from '@tanstack/react-query';
import { courseApi } from '../api/courseApi';

export function useEnrollCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: number) => courseApi.enrollCourse(courseId),
    onSuccess: () => {
      // 강의 목록 쿼리 무효화 (신청자 수 업데이트)
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}
