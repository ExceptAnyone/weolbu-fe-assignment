import styled from '@emotion/styled';
import { InputHTMLAttributes } from 'react';
import { theme } from '@/styles/theme';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export function Checkbox({ label, id, ...props }: CheckboxProps) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <Container>
      <HiddenCheckbox id={checkboxId} type="checkbox" {...props} />
      <StyledCheckbox htmlFor={checkboxId} checked={props.checked} disabled={props.disabled}>
        {props.checked && <CheckIcon>✓</CheckIcon>}
      </StyledCheckbox>
      {label && <Label htmlFor={checkboxId}>{label}</Label>}
    </Container>
  );
}

const Container = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  cursor: pointer;
`;

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const StyledCheckbox = styled.label<{ checked?: boolean; disabled?: boolean }>`
  width: 24px;
  height: 24px;
  border: 2px solid
    ${(props) => (props.checked ? theme.colors.primary : theme.colors.border)};
  border-radius: ${theme.borderRadius.sm};
  background-color: ${(props) =>
    props.checked ? theme.colors.primary : theme.colors.background.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

  ${(props) =>
    props.disabled &&
    `
    background-color: ${theme.colors.background.disabled};
    border-color: ${theme.colors.border};
  `}

  &:hover {
    ${(props) =>
      !props.disabled &&
      `
      border-color: ${theme.colors.primary};
    `}
  }
`;

const CheckIcon = styled.span`
  color: white;
  font-size: 16px;
  font-weight: ${theme.fontWeight.bold};
  line-height: 1;
`;

const Label = styled.label`
  font-size: ${theme.fontSize.md};
  color: ${theme.colors.text.primary};
  cursor: pointer;
  user-select: none;
`;
