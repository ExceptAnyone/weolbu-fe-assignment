import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const ENROLLED_COURSES_KEY = 'enrolledCourses';

interface EnrolledCoursesContextType {
  enrolledCourseIds: number[];
  addEnrolledCourse: (courseId: number) => void;
  addEnrolledCourses: (courseIds: number[]) => void;
  isEnrolled: (courseId: number) => boolean;
  clearEnrolledCourses: () => void;
}

const EnrolledCoursesContext = createContext<EnrolledCoursesContextType | null>(null);

export function EnrolledCoursesProvider({ children }: { children: ReactNode }) {
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>(() => {
    // localStorage에서 초기값 로드
    const stored = localStorage.getItem(ENROLLED_COURSES_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // enrolledCourseIds가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(ENROLLED_COURSES_KEY, JSON.stringify(enrolledCourseIds));
  }, [enrolledCourseIds]);

  const addEnrolledCourse = (courseId: number) => {
    setEnrolledCourseIds((prev) => {
      if (prev.includes(courseId)) return prev;
      return [...prev, courseId];
    });
  };

  const addEnrolledCourses = (courseIds: number[]) => {
    setEnrolledCourseIds((prev) => {
      const newIds = courseIds.filter((id) => !prev.includes(id));
      if (newIds.length === 0) return prev;
      return [...prev, ...newIds];
    });
  };

  const isEnrolled = (courseId: number) => enrolledCourseIds.includes(courseId);

  const clearEnrolledCourses = () => {
    setEnrolledCourseIds([]);
    localStorage.removeItem(ENROLLED_COURSES_KEY);
  };

  return (
    <EnrolledCoursesContext.Provider
      value={{
        enrolledCourseIds,
        addEnrolledCourse,
        addEnrolledCourses,
        isEnrolled,
        clearEnrolledCourses,
      }}
    >
      {children}
    </EnrolledCoursesContext.Provider>
  );
}

export function useEnrolledCourses() {
  const context = useContext(EnrolledCoursesContext);
  if (!context) {
    throw new Error('useEnrolledCourses must be used within EnrolledCoursesProvider');
  }
  return context;
}
