import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import styled from '@emotion/styled';
import { AuthGuard } from '@/components/guards/AuthGuard';
import { CourseList } from '@/domains/course/components/CourseList';
import { CourseDetailModal } from '@/domains/course/components/CourseDetailModal';
import { CourseSortType } from '@/domains/course/types/course.types';
import { useCurrentUser } from '@/domains/user/context/UserContext';
import { useBatchEnroll } from '@/domains/course/hooks/useBatchEnroll';
import { useToast } from '@/components/common/Toast';
import { Button } from '@/components/common/Button';
import { theme } from '@/styles/theme';
import { CourseSortButtonGroup } from '@/domains/course/components/CourseSortButtonGroup';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

function IndexPage() {
  const [sortType, setSortType] = useState<CourseSortType>('recent');
  const [selectedCourseIds, setSelectedCourseIds] = useState<Set<number>>(new Set());
  const { user, logout } = useCurrentUser();
  const navigate = useNavigate();
  const toast = useToast();
  const { mutate: batchEnroll, isPending } = useBatchEnroll();

  const handleSelectChange = (courseId: number, checked: boolean) => {
    setSelectedCourseIds((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(courseId);
      } else {
        newSet.delete(courseId);
      }
      return newSet;
    });
  };

  const handleLogout = () => {
    logout();
    toast.info('로그아웃되었습니다.');
    navigate({ to: '/signup' });
  };

  const handleBatchEnroll = () => {
    if (selectedCourseIds.size === 0) {
      toast.warning('수강신청할 강의를 선택해주세요.');
      return;
    }

    const courseIds = Array.from(selectedCourseIds);
    batchEnroll(courseIds, {
      onSuccess: (response) => {
        const successCount = response.success.length;
        const failCount = response.failed.length;

        if (failCount === 0) {
          // 모두 성공
          toast.success(`${successCount}개 강의 수강신청이 완료되었습니다!`);
        } else if (successCount === 0) {
          // 모두 실패
          toast.error(`수강신청에 실패했습니다.`);
          // 실패 이유를 순차적으로 표시
          response.failed.forEach((f) => {
            setTimeout(() => toast.error(f.reason), 100);
          });
        } else {
          // 부분 성공
          toast.warning(`${successCount}개 성공, ${failCount}개 실패했습니다.`);
          // 실패한 강의 이유 표시
          response.failed.forEach((f) => {
            setTimeout(() => toast.error(f.reason), 100);
          });
        }

        setSelectedCourseIds(new Set());
      },
      onError: (error: unknown) => {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || '수강신청 중 오류가 발생했습니다.');
      },
    });
  };

  return (
    <AuthGuard requireAuth={true} redirectTo="/signup">
      <Container as="main">
        <Header>
          <Title>강의 목록</Title>

          <HeaderRight>
            {user && (
              <>
                <UserInfo>
                  {user.name}님 ({user.role === 'STUDENT' ? '수강생' : '강사'})
                </UserInfo>
                <Button variant="secondary" onClick={handleLogout}>
                  로그아웃
                </Button>
              </>
            )}
          </HeaderRight>
        </Header>
        {user?.role === 'INSTRUCTOR' && (
          <NewCourseWrapper
            style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}
          >
            {
              <Link to="/courses/new">
                <Button>강의 개설</Button>
              </Link>
            }
          </NewCourseWrapper>
        )}

        <Controls as="nav">
          <CourseSortButtonGroup value={sortType} onChange={setSortType} />
        </Controls>

        <CourseListSection>
          <CourseList
            sortType={sortType}
            selectedCourseIds={selectedCourseIds}
            onSelectChange={handleSelectChange}
          />
        </CourseListSection>

        {user?.role === 'STUDENT' && selectedCourseIds.size > 0 && (
          <FloatingButton onClick={handleBatchEnroll} disabled={isPending}>
            {isPending ? '신청 중...' : `선택한 강의 수강신청 (${selectedCourseIds.size})`}
          </FloatingButton>
        )}

        <CourseDetailModal />
      </Container>
    </AuthGuard>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.header`
  padding: ${theme.spacing.lg} ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.background.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const UserInfo = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.text.secondary};
`;

const Controls = styled.div`
  padding: ${theme.spacing.md};
  display: flex;
  gap: ${theme.spacing.md};
  align-items: flex-end;
  background-color: ${theme.colors.background.secondary};

  > * {
    flex: 1;
  }

  a {
    flex: 0 0 auto;
  }
`;

const CourseListSection = styled.section``;

const FloatingButton = styled(Button)`
  position: fixed;
  bottom: ${theme.spacing.lg};
  left: 50%;
  transform: translateX(-50%);
  max-width: calc(${theme.maxMobileWidth} - ${theme.spacing.lg} * 2);
  width: calc(100% - ${theme.spacing.lg} * 2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
`;

const NewCourseWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px;
`;
