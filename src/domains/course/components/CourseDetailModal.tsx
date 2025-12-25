import styled from '@emotion/styled';
import { Modal } from '@/components/common/Modal';
import { useModal } from '@/components/common/Modal/ModalContext';
import { useCourse } from '../hooks/useCourse';
import { formatPrice } from '@/utils/format';
import { theme } from '@/styles/theme';

export function CourseDetailModal() {
  const { isOpen, selectedCourseId } = useModal();
  const { data: course, isLoading, isError } = useCourse(selectedCourseId);

  // 강의 상세 모달이 아닌 경우 렌더링하지 않음
  if (!selectedCourseId || !isOpen) return null;

  return (
    <Modal>
      <Modal.Header>
        <h2>강의 상세 정보</h2>
        <Modal.CloseButton />
      </Modal.Header>

      <Modal.Body>
        {isLoading && <LoadingText>로딩 중...</LoadingText>}

        {isError && <ErrorText>강의 정보를 불러오는데 실패했습니다.</ErrorText>}

        {course && (
          <Content>
            <Title>{course.title}</Title>

            {course.description && (
              <Section>
                <SectionLabel>강의 설명</SectionLabel>
                <Description>{course.description}</Description>
              </Section>
            )}

            <InfoSection>
              <InfoRow>
                <InfoLabel>강사</InfoLabel>
                <InfoValue>{course.instructorName}</InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel>가격</InfoLabel>
                <InfoValue>{formatPrice(course.price)}</InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel>정원</InfoLabel>
                <InfoValue>{course.maxStudents}명</InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel>현재 수강 인원</InfoLabel>
                <InfoValue>{course.currentStudents}명</InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel>남은 자리</InfoLabel>
                <InfoValue highlight={course.availableSeats <= 5}>
                  {course.availableSeats}명
                  {course.isFull && <FullBadge>마감</FullBadge>}
                </InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel>등록일</InfoLabel>
                <InfoValue>
                  {new Date(course.createdAt).toLocaleDateString('ko-KR')}
                </InfoValue>
              </InfoRow>
            </InfoSection>
          </Content>
        )}
      </Modal.Body>
    </Modal>
  );
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const Title = styled.h2`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const SectionLabel = styled.h3`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text.secondary};
  margin: 0;
`;

const Description = styled.p`
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.text.primary};
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.md};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoLabel = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.text.secondary};
`;

const InfoValue = styled.span<{ highlight?: boolean }>`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.medium};
  color: ${(props) =>
    props.highlight ? theme.colors.error : theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const FullBadge = styled.span`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background-color: ${theme.colors.error};
  color: white;
  font-size: ${theme.fontSize.xs};
  border-radius: ${theme.borderRadius.sm};
`;

const LoadingText = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.text.secondary};
`;

const ErrorText = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.error};
`;
