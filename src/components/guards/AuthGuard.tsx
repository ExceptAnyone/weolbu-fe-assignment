import { ReactNode, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCurrentUser } from '@/domains/user/context/UserContext';

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

/**
 * 인증 가드 컴포넌트
 * - requireAuth가 true면 로그인이 필요하며, 비로그인 시 redirectTo로 이동
 * - requireAuth가 false면 로그인 상태에서 redirectTo로 이동 (예: 회원가입 페이지)
 */
export function AuthGuard({
  children,
  redirectTo = '/signup',
  requireAuth = true,
}: AuthGuardProps) {
  const { user, isLoading } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !user) {
      // 로그인이 필요한데 로그인하지 않은 경우
      navigate({ to: redirectTo });
    } else if (!requireAuth && user) {
      // 로그인 상태에서 접근하면 안 되는 페이지 (예: 회원가입)
      navigate({ to: redirectTo });
    }
  }, [user, isLoading, requireAuth, redirectTo, navigate]);

  // 로딩 중이거나 리디렉션 대상인 경우 null 반환
  if (isLoading) {
    return null;
  }

  if (requireAuth && !user) {
    return null;
  }

  if (!requireAuth && user) {
    return null;
  }

  return <>{children}</>;
}
