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
import { useForm } from '@/hooks/useForm';
import { ApiErrorResponse } from '@/domains/course/types/course.types';

interface LoginFormValues {
  email: string;
  password: string;
}

export function LoginForm() {
  const { login } = useCurrentUser();
  const { closeModal } = useModal();
  const navigate = useNavigate();
  const toast = useToast();

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: (values: LoginFormValues) => authApi.login(values),
    onSuccess: (response) => {
      login(response.user, response.accessToken);
      closeModal();
      toast.success('로그인되었습니다!');
      navigate({ to: '/' });
    },
    onError: (error: unknown) => {
      const err = error as ApiErrorResponse;
      toast.error(err.message || '로그인에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const form = useForm<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      loginMutation(values);
    },
  });

  const isFormValid = form.values.email && form.values.password;

  return (
    <Form onSubmit={form.handleSubmit}>
      <Fieldset>
        <Legend>로그인 정보</Legend>
        <FormFields>
          <Input
            type="email"
            label="이메일"
            {...form.getFieldProps('email')}
            placeholder="example@email.com"
          />
          <Input
            type="password"
            label="비밀번호"
            {...form.getFieldProps('password')}
            placeholder="비밀번호"
          />
        </FormFields>
      </Fieldset>
      <Button type="submit" fullWidth disabled={!isFormValid || isPending}>
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
