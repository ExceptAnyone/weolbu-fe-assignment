import { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { CourseItem } from './CourseItem';
import { useCourses } from '../hooks/useCourses';
import { CourseSortType } from '../types/course.types';
import { theme } from '@/styles/theme';

interface CourseListProps {
  sortType: CourseSortType;
  selectedCourseIds: Set<number>;
  onSelectChange: (courseId: number, checked: boolean) => void;
}

export function CourseList({ sortType, selectedCourseIds, onSelectChange }: CourseListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useCourses(sortType);

  const observerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer를 사용한 무한 스크롤
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 관찰 대상이 화면에 보이고, 다음 페이지가 있으며, 로딩 중이 아닐 때
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 } // 10% 보일 때 트리거
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 로딩 상태
  if (isLoading) {
    return <LoadingMessage>강의 목록을 불러오는 중...</LoadingMessage>;
  }

  // 에러 상태
  if (error) {
    return <ErrorMessage>강의 목록을 불러오는데 실패했습니다.</ErrorMessage>;
  }

  // 데이터 없음
  if (!data || data.pages[0].content.length === 0) {
    return <EmptyMessage>등록된 강의가 없습니다.</EmptyMessage>;
  }

  return (
    <Container>
      {data.pages.map((page) =>
        page.content.map((course) => (
          <CourseItem
            key={course.id}
            course={course}
            isSelected={selectedCourseIds.has(course.id)}
            onSelectChange={onSelectChange}
          />
        ))
      )}

      {/* Intersection Observer 타겟 */}
      <Observer ref={observerRef} />

      {/* 다음 페이지 로딩 중 */}
      {isFetchingNextPage && <LoadingMessage>더 불러오는 중...</LoadingMessage>}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
`;

const Observer = styled.div`
  height: 20px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSize.md};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.error};
  font-size: ${theme.fontSize.md};
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.fontSize.md};
`;
