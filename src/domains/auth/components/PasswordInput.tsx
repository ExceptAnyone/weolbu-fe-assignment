import { useState } from 'react';
import styled from '@emotion/styled';
import { Input } from '@/components/common/Input';
import { theme } from '@/styles/theme';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
}

export function PasswordInput({
  value,
  onChange,
  error,
  label = '비밀번호',
  placeholder = '비밀번호를 입력하세요',
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <PasswordContainer>
      <Input
        type={showPassword ? 'text' : 'password'}
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        error={error}
      />
      <ToggleButton
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
      >
        {showPassword ? '숨기기' : '보기'}
      </ToggleButton>
    </PasswordContainer>
  );
}

const PasswordContainer = styled.div`
  position: relative;
  width: 100%;
`;

const ToggleButton = styled.button`
  position: absolute;
  right: ${theme.spacing.md};
  top: calc(${theme.spacing.lg} + 10px); // label 높이 고려

  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
