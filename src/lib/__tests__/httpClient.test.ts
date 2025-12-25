import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { httpClient, tokenStorage } from '../httpClient';

describe('tokenStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getToken', () => {
    it('토큰이 있으면 반환한다', () => {
      localStorage.setItem('accessToken', 'test-token');
      expect(tokenStorage.getToken()).toBe('test-token');
    });

    it('토큰이 없으면 null을 반환한다', () => {
      expect(tokenStorage.getToken()).toBeNull();
    });
  });

  describe('setToken', () => {
    it('토큰을 저장한다', () => {
      tokenStorage.setToken('new-token');
      expect(localStorage.getItem('accessToken')).toBe('new-token');
    });
  });

  describe('removeToken', () => {
    it('토큰을 삭제한다', () => {
      localStorage.setItem('accessToken', 'test-token');
      tokenStorage.removeToken();
      expect(localStorage.getItem('accessToken')).toBeNull();
    });
  });
});

describe('httpClient', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    localStorage.clear();
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  describe('GET 요청', () => {
    it('기본 GET 요청을 보낸다', async () => {
      const mockData = { id: 1, name: 'Test' };
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await httpClient.get('/test');

      expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual(mockData);
    });

    it('requiresAuth=true일 때 Authorization 헤더를 포함한다', async () => {
      tokenStorage.setToken('test-token');
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await httpClient.get('/protected', true);

      expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/protected', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
      });
    });

    it('requiresAuth=true이지만 토큰이 없으면 Authorization 헤더가 없다', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await httpClient.get('/protected', true);

      expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/protected', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('POST 요청', () => {
    it('body와 함께 POST 요청을 보낸다', async () => {
      const requestData = { email: 'test@example.com', password: 'password123' };
      const responseData = { token: 'abc123' };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => responseData,
      });

      const result = await httpClient.post('/login', requestData);

      expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/login', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual(responseData);
    });

    it('requiresAuth=true일 때 Authorization 헤더를 포함한다', async () => {
      tokenStorage.setToken('test-token');
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await httpClient.post('/courses', { title: 'Test Course' }, true);

      expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/courses', {
        method: 'POST',
        body: JSON.stringify({ title: 'Test Course' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
      });
    });

    it('body 없이 POST 요청을 보낼 수 있다', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await httpClient.post('/endpoint');

      expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/endpoint', {
        method: 'POST',
        body: undefined,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('PUT 요청', () => {
    it('body와 함께 PUT 요청을 보낸다', async () => {
      const requestData = { name: 'Updated Name' };
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => requestData,
      });

      const result = await httpClient.put('/users/1', requestData);

      expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/users/1', {
        method: 'PUT',
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual(requestData);
    });

    it('requiresAuth=true일 때 Authorization 헤더를 포함한다', async () => {
      tokenStorage.setToken('test-token');
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await httpClient.put('/profile', { name: 'New Name' }, true);

      expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/profile', {
        method: 'PUT',
        body: JSON.stringify({ name: 'New Name' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
      });
    });
  });

  describe('DELETE 요청', () => {
    it('DELETE 요청을 보낸다', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await httpClient.delete('/courses/1');

      expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/courses/1', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('requiresAuth=true일 때 Authorization 헤더를 포함한다', async () => {
      tokenStorage.setToken('test-token');
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await httpClient.delete('/courses/1', true);

      expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/courses/1', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
      });
    });
  });

  describe('에러 처리', () => {
    it('400 에러를 던진다', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: '잘못된 요청입니다.' }),
      });

      await expect(httpClient.get('/test')).rejects.toThrow('잘못된 요청입니다.');
    });

    it('401 에러를 던진다', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ message: '인증이 필요합니다.' }),
      });

      await expect(httpClient.get('/protected')).rejects.toThrow('인증이 필요합니다.');
    });

    it('500 에러를 던진다', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ message: '서버 오류가 발생했습니다.' }),
      });

      await expect(httpClient.get('/test')).rejects.toThrow('서버 오류가 발생했습니다.');
    });

    it('에러 응답에 message가 없으면 기본 메시지를 사용한다', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({}),
      });

      await expect(httpClient.get('/test')).rejects.toThrow('HTTP 404: Not Found');
    });

    it('에러 응답 JSON 파싱 실패 시 기본 메시지를 사용한다', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(httpClient.get('/test')).rejects.toThrow('HTTP 500: Internal Server Error');
    });
  });

  describe('204 No Content 처리', () => {
    it('204 응답 시 빈 객체를 반환한다', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => {
          throw new Error('No content');
        },
      });

      const result = await httpClient.delete('/resource');

      expect(result).toEqual({});
    });
  });
});
