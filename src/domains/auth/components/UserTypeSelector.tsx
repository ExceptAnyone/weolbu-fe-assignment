import styled from '@emotion/styled';
import { UserRole } from '@/domains/user/types/user.types';
import { theme } from '@/styles/theme';

interface UserTypeSelectorProps {
  value: UserRole;
  onChange: (value: UserRole) => void;
}

export function UserTypeSelector({ value, onChange }: UserTypeSelectorProps) {
  return (
    <Container>
      <Label>회원 유형</Label>
      <RadioGroup>
        <RadioLabel>
          <input
            type="radio"
            name="userType"
            value="STUDENT"
            checked={value === 'STUDENT'}
            onChange={(e) => onChange(e.target.value as UserRole)}
          />
          <span>수강생</span>
        </RadioLabel>
        <RadioLabel>
          <input
            type="radio"
            name="userType"
            value="INSTRUCTOR"
            checked={value === 'INSTRUCTOR'}
            onChange={(e) => onChange(e.target.value as UserRole)}
          />
          <span>강사</span>
        </RadioLabel>
      </RadioGroup>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.text.primary};
`;

const RadioGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  cursor: pointer;

  input[type='radio'] {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  span {
    font-size: ${theme.fontSize.md};
    color: ${theme.colors.text.primary};
  }

  &:hover span {
    color: ${theme.colors.primary};
  }
`;
