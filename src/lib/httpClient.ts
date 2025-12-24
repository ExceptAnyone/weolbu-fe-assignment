const BASE_URL = 'http://localhost:8080/api';

// LocalStorage 키
const AUTH_TOKEN_KEY = 'accessToken';

// 토큰 저장/조회/삭제
export const tokenStorage = {
  getToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },
  setToken: (token: string): void => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },
  removeToken: (): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },
};

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { requiresAuth = false, headers = {}, ...restOptions } = options;

    const url = `${this.baseUrl}${endpoint}`;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>),
    };

    // 인증이 필요한 경우 토큰 추가
    if (requiresAuth) {
      const token = tokenStorage.getToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, {
      ...restOptions,
      headers: requestHeaders,
    });

    // 에러 처리
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    // 204 No Content의 경우 빈 응답 반환
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async get<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', requiresAuth });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    requiresAuth = false
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      requiresAuth,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    requiresAuth = false
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      requiresAuth,
    });
  }

  async delete<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', requiresAuth });
  }
}

export const httpClient = new HttpClient(BASE_URL);
