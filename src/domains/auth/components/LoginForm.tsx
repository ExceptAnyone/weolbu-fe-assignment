import { useState, FormEvent } from 'react';
import styled from '@emotion/styled';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useCurrentUser } from '@/domains/user/context/UserContext';
import { useModal } from '@/components/common/Modal/ModalContext';
import { useNavigate } from '@tanstack/react-router';
import { useToast } from '@/components/common/Toast';
import { theme } from '@/styles/theme';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useCurrentUser();
  const { closeModal } = useModal();
  const navigate = useNavigate();
  const toast = useToast();

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: () => authApi.login({ email, password }),
    onSuccess: (response) => {
      login(response.user, response.accessToken);
      closeModal();
      toast.success('로그인되었습니다!');
      navigate({ to: '/' });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      if (err.response?.status === 401) {
        toast.error('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        toast.error(err.response?.data?.message || '로그인에 실패했습니다. 다시 시도해주세요.');
      }
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    loginMutation();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Fieldset>
        <Legend>로그인 정보</Legend>
        <FormFields>
          <Input
            type="email"
            label="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
          />
          <Input
            type="password"
            label="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
          />
        </FormFields>
      </Fieldset>
      <Button type="submit" fullWidth disabled={!email || !password || isPending}>
        {isPending ? '로그인 중...' : '로그인'}
      </Button>
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const Fieldset = styled.fieldset`
  border: none;
  padding: 0;
  margin: 0;
`;

const Legend = styled.legend`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
  padding: 0;
`;

const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;
