import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { courseApi } from '../api/courseApi';
import { CreateCourseRequest } from '../types/course.types';

export function useCreateCourse() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateCourseRequest) => courseApi.createCourse(data),
    onSuccess: () => {
      // 강의 목록 쿼리 무효화 (새로고침)
      queryClient.invalidateQueries({ queryKey: ['courses'] });

      // 강의 목록 페이지로 이동
      navigate({ to: '/' });
    },
  });
}
