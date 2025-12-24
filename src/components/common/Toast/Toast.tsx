import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useToastContext, Toast as ToastType } from './ToastContext';
import { theme } from '@/styles/theme';

export function ToastContainer() {
  const { toasts, removeToast } = useToastContext();

  if (toasts.length === 0) return null;

  return (
    <Container>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </Container>
  );
}

interface ToastItemProps {
  toast: ToastType;
  onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  return (
    <StyledToast type={toast.type}>
      <Message>{toast.message}</Message>
      <CloseButton onClick={onClose} aria-label="닫기">
        ×
      </CloseButton>
    </StyledToast>
  );
}

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const Container = styled.div`
  position: fixed;
  top: ${theme.spacing.lg};
  right: ${theme.spacing.lg};
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  max-width: 400px;
  width: calc(100% - ${theme.spacing.lg} * 2);

  @media (max-width: 480px) {
    left: ${theme.spacing.md};
    right: ${theme.spacing.md};
    width: calc(100% - ${theme.spacing.md} * 2);
  }
`;

const getToastColor = (type: ToastType['type']) => {
  switch (type) {
    case 'success':
      return {
        bg: '#10b981',
        border: '#059669',
      };
    case 'error':
      return {
        bg: '#ef4444',
        border: '#dc2626',
      };
    case 'warning':
      return {
        bg: '#f59e0b',
        border: '#d97706',
      };
    case 'info':
      return {
        bg: '#3b82f6',
        border: '#2563eb',
      };
  }
};

const StyledToast = styled.div<{ type: ToastType['type'] }>`
  background-color: ${(props) => getToastColor(props.type).bg};
  color: white;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  border-left: 4px solid ${(props) => getToastColor(props.type).border};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  animation: ${slideIn} 0.3s ease-out;
`;

const Message = styled.span`
  flex: 1;
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.medium};
  line-height: 1.5;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;
