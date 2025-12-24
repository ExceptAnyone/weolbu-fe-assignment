import { ReactNode } from 'react';
import styled from '@emotion/styled';
import { useModal } from './ModalContext';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { theme } from '@/styles/theme';

interface ModalProps {
  children: ReactNode;
}

export function Modal({ children }: ModalProps) {
  const { isOpen, closeModal } = useModal();

  // ESC 키로 닫기
  useEscapeKey(closeModal, isOpen);

  // body 스크롤 방지
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <Overlay onClick={closeModal}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>{children}</ModalContainer>
    </Overlay>
  );
}

Modal.Header = function ModalHeader({ children }: { children: ReactNode }) {
  return <Header>{children}</Header>;
};

Modal.Body = function ModalBody({ children }: { children: ReactNode }) {
  return <Body>{children}</Body>;
};

Modal.Footer = function ModalFooter({ children }: { children: ReactNode }) {
  return <Footer>{children}</Footer>;
};

Modal.CloseButton = function ModalCloseButton() {
  const { closeModal } = useModal();
  return (
    <CloseButton onClick={closeModal} aria-label="닫기">
      ×
    </CloseButton>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${theme.spacing.md};
`;

const ModalContainer = styled.div`
  background-color: ${theme.colors.background.primary};
  border-radius: ${theme.borderRadius.lg};
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const Header = styled.div`
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: ${theme.fontSize.xl};
    font-weight: ${theme.fontWeight.bold};
    color: ${theme.colors.text.primary};
  }
`;

const Body = styled.div`
  padding: ${theme.spacing.lg};

  form {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.lg};
  }
`;

const Footer = styled.div`
  padding: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.border};
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 32px;
  line-height: 1;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: ${theme.colors.text.primary};
  }
`;
