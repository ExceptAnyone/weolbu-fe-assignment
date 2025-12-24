import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { User } from '../types/user.types';
import { tokenStorage } from '@/lib/httpClient';

interface UserContextValue {
  user: User | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

const USER_STORAGE_KEY = 'user';

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로드 시 localStorage에서 사용자 정보 복원
  useEffect(() => {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    const savedToken = tokenStorage.getToken();

    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        // 파싱 실패 시 로컬 스토리지 정리
        localStorage.removeItem(USER_STORAGE_KEY);
        tokenStorage.removeToken();
      }
    }

    setIsLoading(false);
  }, []);

  // 로그인 (회원가입 후 자동 로그인 포함)
  const login = useCallback((newUser: User, token: string) => {
    setUser(newUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    tokenStorage.setToken(token);
  }, []);

  // 로그아웃
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    tokenStorage.removeToken();
  }, []);

  const value: UserContextValue = {
    user,
    isLoading,
    login,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// 사용자 정보를 가져오는 훅
export function useCurrentUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useCurrentUser must be used within UserProvider');
  }

  return context;
}
