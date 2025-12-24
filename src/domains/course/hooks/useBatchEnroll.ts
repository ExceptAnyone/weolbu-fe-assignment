import { useMutation, useQueryClient } from '@tanstack/react-query';
import { courseApi } from '../api/courseApi';

export function useBatchEnroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseIds: number[]) => courseApi.batchEnroll({ courseIds }),
    onSuccess: () => {
      // 강의 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}
