export interface Course {
  id: number;
  title: string;
  description?: string;
  instructorName: string;
  maxStudents: number;
  currentStudents: number;
  availableSeats: number;
  isFull: boolean;
  price: number;
  createdAt: string;
}

export interface CreateCourseRequest {
  title: string;
  description?: string;
  instructorName: string;
  maxStudents: number;
  price: number;
}

export interface CreateCourseResponse extends Course {}

export interface CoursesResponse {
  content: Course[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export type CourseSortType = 'recent' | 'popular' | 'rate';

export interface EnrollmentResponse {
  enrollmentId: number;
  courseId: number;
  courseTitle: string;
  instructorName: string;
  userId: number;
  userName: string;
  enrolledAt: string;
  message: string;
}

export interface BatchEnrollmentRequest {
  courseIds: number[];
}

export interface BatchEnrollmentResponse {
  success: Array<{
    enrollmentId: number;
    courseId: number;
    courseTitle: string;
  }>;
  failed: Array<{
    courseId: number;
    reason: string;
  }>;
}

// API 에러 응답 타입
export interface ApiErrorResponse {
  code: string;
  message: string;
  timestamp: string;
}
