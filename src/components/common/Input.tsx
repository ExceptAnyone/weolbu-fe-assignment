import styled from '@emotion/styled';
import { InputHTMLAttributes } from 'react';
import { theme } from '@/styles/theme';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  // aria-describedby 설정: error가 있으면 error, 없으면 helperText
  const describedBy = error ? errorId : helperText ? helperId : undefined;

  return (
    <InputContainer>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <StyledInput
        id={inputId}
        hasError={!!error}
        aria-describedby={describedBy}
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <ErrorText id={errorId} role="alert">
          {error}
        </ErrorText>
      )}
      {helperText && !error && <HelperText id={helperId}>{helperText}</HelperText>}
    </InputContainer>
  );
}

const InputContainer = styled.div`
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

const StyledInput = styled.input<{ hasError: boolean }>`
  /* 모바일 친화적 크기 */
  min-height: 48px;
  padding: ${theme.spacing.sm} ${theme.spacing.md};

  /* 폰트 */
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.text.primary};

  /* 테두리 */
  border: 1px solid ${(props) => (props.hasError ? theme.colors.error : theme.colors.border)};
  border-radius: ${theme.borderRadius.md};

  /* 배경 */
  background-color: ${theme.colors.background.primary};

  /* 트랜지션 */
  transition: all 0.2s ease-in-out;

  /* 포커스 상태 */
  &:focus {
    outline: none;
    border-color: ${(props) => (props.hasError ? theme.colors.error : theme.colors.primary)};
    box-shadow: 0 0 0 3px
      ${(props) => (props.hasError ? `${theme.colors.error}20` : `${theme.colors.primary}20`)};
  }

  /* 비활성 상태 */
  &:disabled {
    background-color: ${theme.colors.background.disabled};
    color: ${theme.colors.text.disabled};
    cursor: not-allowed;
  }

  /* Placeholder */
  &::placeholder {
    color: ${theme.colors.text.disabled};
  }
`;

const ErrorText = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.error};
`;

const HelperText = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.text.secondary};
`;
