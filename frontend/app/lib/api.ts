export type Role = 'CUSTOMER' | 'VENDOR' | 'ADMIN';

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
  user: UserSummary;
}

interface ApiErrorBody {
  message?: string;
  details?: string[];
}

export class ApiError extends Error {
  status: number;
  details: string[];

  constructor(message: string, status: number, details: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

async function postJson<TResponse>(path: string, body: unknown): Promise<TResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError('Could not reach the server. Please try again.', 0);
  }

  if (!response.ok) {
    const errorBody: ApiErrorBody = await response.json().catch(() => ({}));
    const detailMessage = errorBody.details?.[0];
    throw new ApiError(
      detailMessage ?? errorBody.message ?? 'Something went wrong. Please try again.',
      response.status,
      errorBody.details ?? []
    );
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return response.json() as Promise<TResponse>;
}

export function signup(request: SignupRequest): Promise<AuthResponse> {
  return postJson<AuthResponse>('/api/auth/signup', request);
}

export function signin(request: SigninRequest): Promise<AuthResponse> {
  return postJson<AuthResponse>('/api/auth/signin', request);
}

export function logout(refreshToken: string): Promise<void> {
  return postJson<void>('/api/auth/logout', { refreshToken });
}
