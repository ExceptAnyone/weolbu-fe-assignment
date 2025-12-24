import { httpClient } from '@/lib/httpClient';
import {
  Course,
  CreateCourseRequest,
  CreateCourseResponse,
  CoursesResponse,
  CourseSortType,
  EnrollmentResponse,
  BatchEnrollmentRequest,
  BatchEnrollmentResponse,
} from '../types/course.types';

export const courseApi = {
  // 강의 목록 조회
  getCourses: async (params: {
    page: number;
    size: number;
    sort: CourseSortType;
  }): Promise<CoursesResponse> => {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      size: params.size.toString(),
      sort: params.sort,
    });
    return httpClient.get<CoursesResponse>(`/courses?${queryParams}`);
  },

  // 강의 상세 조회
  getCourse: async (courseId: number): Promise<Course> => {
    return httpClient.get<Course>(`/courses/${courseId}`);
  },

  // 강의 등록 (강사 전용)
  createCourse: async (
    data: CreateCourseRequest
  ): Promise<CreateCourseResponse> => {
    return httpClient.post<CreateCourseResponse>('/courses', data, true);
  },

  // 수강 신청
  enrollCourse: async (courseId: number): Promise<EnrollmentResponse> => {
    return httpClient.post<EnrollmentResponse>(
      `/courses/${courseId}/enroll`,
      undefined,
      true
    );
  },

  // 배치 수강 신청
  batchEnroll: async (
    data: BatchEnrollmentRequest
  ): Promise<BatchEnrollmentResponse> => {
    return httpClient.post<BatchEnrollmentResponse>(
      '/enrollments/batch',
      data,
      true
    );
  },
};
