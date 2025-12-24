import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { authApi } from '../api/authApi';
import { SignupRequest } from '../types/auth.types';
import { useCurrentUser } from '@/domains/user/context/UserContext';
import { useToast } from '@/components/common/Toast';

export function useSignup() {
  const navigate = useNavigate();
  const { login } = useCurrentUser();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: SignupRequest) => authApi.signup(data),
    onSuccess: async (_response, variables) => {
      // 회원가입 성공 후 자동 로그인
      // 로그인 API 호출하여 토큰 받기
      const loginResponse = await authApi.login({
        email: variables.email,
        password: variables.password,
      });

      // 사용자 정보와 토큰 저장
      login(loginResponse.user, loginResponse.accessToken);

      // 성공 메시지 표시
      toast.success('회원가입이 완료되었습니다!');

      // 강의 목록 페이지로 이동
      navigate({ to: '/' });
    },
    onError: () => {
      // 다른 에러는 클라이언트단에서 처리가능
      // 중복된 이메일에 대한 에러처리만 필요
      toast.error('이미 가입된 이메일입니다. 다른 이메일을 사용해주세요.');
    },
  });
}
