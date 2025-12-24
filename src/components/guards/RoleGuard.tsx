import { ReactNode, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCurrentUser } from '@/domains/user/context/UserContext';
import { UserRole } from '@/domains/user/types/user.types';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

/**
 * 권한 가드 컴포넌트
 * - allowedRoles에 포함된 역할만 접근 가능
 * - 권한이 없는 경우 redirectTo로 이동
 */
export function RoleGuard({
  children,
  allowedRoles,
  redirectTo = '/',
}: RoleGuardProps) {
  const { user, isLoading } = useCurrentUser();
  const navigate = useNavigate();

  const hasPermission = user && allowedRoles.includes(user.role);

  useEffect(() => {
    if (isLoading) return;

    if (!hasPermission) {
      navigate({ to: redirectTo });
    }
  }, [hasPermission, isLoading, redirectTo, navigate]);

  // 로딩 중이거나 권한이 없는 경우 null 반환
  if (isLoading || !hasPermission) {
    return null;
  }

  return <>{children}</>;
}
