import styled from '@emotion/styled';
import { ButtonHTMLAttributes } from 'react';
import { theme } from '@/styles/theme';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <StyledButton variant={variant} fullWidth={fullWidth} {...props}>
      {children}
    </StyledButton>
  );
}

const StyledButton = styled.button<{ variant: 'primary' | 'secondary'; fullWidth: boolean }>`
  /* 모바일 터치 친화적 크기 */
  min-height: ${theme.minTouchSize};
  padding: ${theme.spacing.sm} ${theme.spacing.smPlus};

  /* 폰트 */
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};

  /* 테두리 */
  border-radius: ${theme.borderRadius.md};
  border: none;

  /* 너비 */
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};

  /* 커서 */
  cursor: pointer;

  /* 트랜지션 */
  transition: all 0.2s ease-in-out;

  /* variant에 따른 스타일 */
  ${(props) =>
    props.variant === 'primary'
      ? `
    background-color: ${theme.colors.primary};
    color: white;

    &:hover:not(:disabled) {
      background-color: ${theme.colors.primaryHover};
    }
  `
      : `
    background-color: ${theme.colors.background.secondary};
    color: ${theme.colors.text.primary};
    border: 1px solid ${theme.colors.border};

    &:hover:not(:disabled) {
      background-color: ${theme.colors.background.disabled};
    }
  `}

  /* 비활성 상태 */
  &:disabled {
    background-color: ${theme.colors.background.disabled};
    color: ${theme.colors.text.disabled};
    cursor: not-allowed;
  }

  /* 포커스 상태 */
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`;
