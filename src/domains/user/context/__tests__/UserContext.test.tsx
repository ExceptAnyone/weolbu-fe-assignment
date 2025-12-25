import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { UserProvider, useCurrentUser } from '../UserContext';
import { tokenStorage } from '@/lib/httpClient';
import { User } from '../../types/user.types';

const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  name: '테스트',
  phone: '010-1234-5678',
  role: 'STUDENT',
};

describe('UserContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('UserProvider - 초기 로드', () => {
    it('localStorage에 사용자 정보가 없으면 user는 null이다', async () => {
      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: UserProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
    });

    it('localStorage에 사용자 정보가 있으면 복원한다', async () => {
      localStorage.setItem('user', JSON.stringify(mockUser));
      tokenStorage.setToken('test-token');

      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: UserProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
    });

    it('토큰이 없으면 사용자 정보를 복원하지 않는다', async () => {
      localStorage.setItem('user', JSON.stringify(mockUser));
      // 토큰 없음

      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: UserProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
    });

    it('잘못된 JSON이면 localStorage를 정리한다', async () => {
      localStorage.setItem('user', 'invalid-json');
      tokenStorage.setToken('test-token');

      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: UserProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(tokenStorage.getToken()).toBeNull();
    });
  });

  describe('login', () => {
    it('사용자 정보를 설정한다', async () => {
      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: UserProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.login(mockUser, 'test-token');
      });

      expect(result.current.user).toEqual(mockUser);
    });

    it('localStorage에 사용자 정보를 저장한다', async () => {
      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: UserProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.login(mockUser, 'test-token');
      });

      const savedUser = localStorage.getItem('user');
      expect(savedUser).toBeTruthy();
      expect(JSON.parse(savedUser!)).toEqual(mockUser);
    });

    it('토큰을 저장한다', async () => {
      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: UserProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.login(mockUser, 'test-token');
      });

      expect(tokenStorage.getToken()).toBe('test-token');
    });

    it('기존 사용자 정보를 덮어쓴다', async () => {
      localStorage.setItem('user', JSON.stringify(mockUser));
      tokenStorage.setToken('old-token');

      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: UserProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const newUser: User = {
        id: 2,
        email: 'new@example.com',
        name: '새사용자',
        phone: '010-9999-8888',
        role: 'INSTRUCTOR',
      };

      act(() => {
        result.current.login(newUser, 'new-token');
      });

      expect(result.current.user).toEqual(newUser);
      expect(tokenStorage.getToken()).toBe('new-token');
    });
  });

  describe('logout', () => {
    it('사용자 정보를 null로 설정한다', async () => {
      localStorage.setItem('user', JSON.stringify(mockUser));
      tokenStorage.setToken('test-token');

      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: UserProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);

      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
    });

    it('localStorage에서 사용자 정보를 제거한다', async () => {
      localStorage.setItem('user', JSON.stringify(mockUser));
      tokenStorage.setToken('test-token');

      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: UserProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.logout();
      });

      expect(localStorage.getItem('user')).toBeNull();
    });

    it('토큰을 제거한다', async () => {
      localStorage.setItem('user', JSON.stringify(mockUser));
      tokenStorage.setToken('test-token');

      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: UserProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.logout();
      });

      expect(tokenStorage.getToken()).toBeNull();
    });

    it('모든 정보를 완전히 정리한다', async () => {
      localStorage.setItem('user', JSON.stringify(mockUser));
      tokenStorage.setToken('test-token');

      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: UserProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).not.toBeNull();
      expect(localStorage.getItem('user')).not.toBeNull();
      expect(tokenStorage.getToken()).not.toBeNull();

      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(tokenStorage.getToken()).toBeNull();
    });
  });

  describe('useCurrentUser - 에러 처리', () => {
    it('Provider 외부에서 사용하면 에러를 던진다', () => {
      expect(() => {
        renderHook(() => useCurrentUser());
      }).toThrow('useCurrentUser must be used within UserProvider');
    });
  });

  describe('통합 시나리오', () => {
    it('로그인 → 로그아웃 → 다시 로그인 시나리오', async () => {
      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: UserProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // 초기 상태
      expect(result.current.user).toBeNull();

      // 로그인
      act(() => {
        result.current.login(mockUser, 'token-1');
      });
      expect(result.current.user).toEqual(mockUser);
      expect(tokenStorage.getToken()).toBe('token-1');

      // 로그아웃
      act(() => {
        result.current.logout();
      });
      expect(result.current.user).toBeNull();
      expect(tokenStorage.getToken()).toBeNull();

      // 다시 로그인 (다른 사용자)
      const anotherUser: User = {
        id: 2,
        email: 'another@example.com',
        name: '다른사용자',
        phone: '010-5555-6666',
        role: 'INSTRUCTOR',
      };
      act(() => {
        result.current.login(anotherUser, 'token-2');
      });
      expect(result.current.user).toEqual(anotherUser);
      expect(tokenStorage.getToken()).toBe('token-2');
    });
  });
});
