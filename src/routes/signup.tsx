import { createFileRoute } from '@tanstack/react-router';
import styled from '@emotion/styled';
import { AuthGuard } from '@/components/guards/AuthGuard';
import { SignupForm } from '@/domains/auth/components/SignupForm';
import { ModalProvider, useModal } from '@/components/common/Modal/ModalContext';
import { Modal } from '@/components/common/Modal/Modal';
import { LoginForm } from '@/domains/auth/components/LoginForm';
import { Button } from '@/components/common/Button';
import { theme } from '@/styles/theme';

export const Route = createFileRoute('/signup')({
  component: SignupPage,
});

function SignupPageContent() {
  const { openModal } = useModal();

  return (
    <AuthGuard requireAuth={false} redirectTo="/">
      <Container>
        <Header>
          <Title>회원가입</Title>
          <Button variant="secondary" onClick={openModal}>
            로그인
          </Button>
        </Header>

        <FormWrapper>
          <SignupForm />
        </FormWrapper>

        <Modal>
          <Modal.Header>
            <h2>로그인</h2>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <LoginForm />
          </Modal.Body>
        </Modal>
      </Container>
    </AuthGuard>
  );
}

function SignupPage() {
  return (
    <ModalProvider>
      <SignupPageContent />
    </ModalProvider>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.header`
  padding: ${theme.spacing.lg} ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.background.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const FormWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.md};
`;
