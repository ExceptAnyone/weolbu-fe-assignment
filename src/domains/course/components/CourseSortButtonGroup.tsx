import styled from '@emotion/styled';
import { Button } from '@/components/common/Button';
import { CourseSortType } from '../types/course.types';
import { theme } from '@/styles/theme';

interface CourseSortButtonGroupProps {
  value: CourseSortType;
  onChange: (value: CourseSortType) => void;
}

const SORT_OPTIONS = [
  { value: 'recent' as const, label: '최근 등록순' },
  { value: 'popular' as const, label: '신청자 많은 순' },
  { value: 'rate' as const, label: '신청률 높은 순' },
];

export function CourseSortButtonGroup({ value, onChange }: CourseSortButtonGroupProps) {
  return (
    <Container>
      <Label>정렬 기준</Label>
      <ButtonGroup role="group" aria-label="정렬 기준 선택">
        {SORT_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={option.value === value ? 'primary' : 'secondary'}
            onClick={() => onChange(option.value)}
            aria-pressed={option.value === value}
          >
            {option.label}
          </Button>
        ))}
      </ButtonGroup>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  width: 100%;
`;

const Label = styled.label`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.text.primary};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};

  > button {
    flex: 1;
    min-height: ${theme.minTouchSize};
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    font-size: ${theme.fontSize.sm};
  }
`;
