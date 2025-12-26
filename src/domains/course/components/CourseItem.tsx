import styled from '@emotion/styled';
import { Course } from '../types/course.types';
import { Checkbox } from '@/components/common/Checkbox';
import { formatPrice } from '@/utils/format';
import { theme } from '@/styles/theme';
import { useCurrentUser } from '@/domains/user/context/UserContext';
import { useEnrolledCourses } from '../context/EnrolledCoursesContext';
import { useModal } from '@/components/common/Modal/ModalContext';

interface CourseItemProps {
  course: Course;
  isSelected: boolean;
  onSelectChange: (courseId: number, checked: boolean) => void;
}

export function CourseItem({ course, isSelected, onSelectChange }: CourseItemProps) {
  const { user } = useCurrentUser();
  const { isEnrolled } = useEnrolledCourses();
  const { openModal } = useModal();

  // 강사는 체크박스를 보지 않음
  const showCheckbox = user?.role === 'STUDENT';
  const enrolled = isEnrolled(course.id);

  // 강의 카드 클릭 시 상세 모달 열기
  const handleCardClick = (e: React.MouseEvent) => {
    // 체크박스 클릭은 모달을 열지 않음
    if ((e.target as HTMLElement).closest('[data-checkbox]')) {
      return;
    }
    openModal(course.id);
  };

  return (
    <Container as="article" onClick={handleCardClick}>
      {showCheckbox && (
        <CheckboxWrapper data-checkbox>
          <Checkbox
            checked={isSelected}
            onChange={(e) => onSelectChange(course.id, e.target.checked)}
            disabled={course.isFull || enrolled}
          />
        </CheckboxWrapper>
      )}

      <Content>
        <TitleRow>
          <Title>{course.title}</Title>
          {enrolled && <EnrolledBadge>수강중</EnrolledBadge>}
        </TitleRow>

        <InfoList>
          <InfoGroup>
            <InfoTerm>강사</InfoTerm>
            <InfoDescription>{course.instructorName}</InfoDescription>
          </InfoGroup>

          <InfoGroup>
            <InfoTerm>수강 인원</InfoTerm>
            <InfoDescription>
              {course.currentStudents}명 / {course.maxStudents}명
            </InfoDescription>
          </InfoGroup>

          <InfoGroup>
            <InfoTerm>가격</InfoTerm>
            <InfoDescription>{formatPrice(course.price)}</InfoDescription>
          </InfoGroup>

          <InfoGroup>
            <InfoTerm>남은 자리</InfoTerm>
            <InfoDescription>{course.availableSeats}명</InfoDescription>
          </InfoGroup>
        </InfoList>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  padding: ${theme.spacing.lg};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.background.primary};

  display: flex;
  gap: ${theme.spacing.md};
  align-items: flex-start;

  cursor: pointer;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    transition: all 0.2s ease-in-out;
  }
`;

const CheckboxWrapper = styled.div`
  flex-shrink: 0;
  padding-top: ${theme.spacing.xs};
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  min-width: 0;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const Title = styled.h3`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const EnrolledBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  background-color: ${theme.colors.primary};
  color: white;
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.medium};
  white-space: nowrap;
`;

const InfoList = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.sm};
  margin: 0;
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const InfoTerm = styled.dt`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.text.secondary};
`;

const InfoDescription = styled.dd`
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.text.primary};
  font-weight: ${theme.fontWeight.medium};
  margin: 0;
`;
