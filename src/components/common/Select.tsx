import styled from '@emotion/styled';
import { SelectHTMLAttributes } from 'react';
import { theme } from '@/styles/theme';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export function Select({ label, options, error, id, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const errorId = `${selectId}-error`;

  return (
    <SelectContainer>
      {label && <Label htmlFor={selectId}>{label}</Label>}
      <StyledSelect
        id={selectId}
        hasError={!!error}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={!!error}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
      {error && (
        <ErrorText id={errorId} role="alert">
          {error}
        </ErrorText>
      )}
    </SelectContainer>
  );
}

const SelectContainer = styled.div`
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

const StyledSelect = styled.select<{ hasError: boolean }>`
  /* 모바일 친화적 크기 */
  min-height: 48px;
  padding: ${theme.spacing.sm} ${theme.spacing.md};

  /* 폰트 */
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.text.primary};

  /* 테두리 */
  border: 1px solid
    ${(props) => (props.hasError ? theme.colors.error : theme.colors.border)};
  border-radius: ${theme.borderRadius.md};

  /* 배경 */
  background-color: ${theme.colors.background.primary};

  /* 커서 */
  cursor: pointer;

  /* 트랜지션 */
  transition: all 0.2s ease-in-out;

  /* 포커스 상태 */
  &:focus {
    outline: none;
    border-color: ${(props) =>
      props.hasError ? theme.colors.error : theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.hasError
          ? `${theme.colors.error}20`
          : `${theme.colors.primary}20`};
  }

  /* 비활성 상태 */
  &:disabled {
    background-color: ${theme.colors.background.disabled};
    color: ${theme.colors.text.disabled};
    cursor: not-allowed;
  }
`;

const ErrorText = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.error};
`;
