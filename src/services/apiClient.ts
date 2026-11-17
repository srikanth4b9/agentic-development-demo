/**
 * Shared HTTP client. Every API call goes through `apiRequest`, which normalizes all failures
 * (network, HTTP, malformed body) into a single `ApiError` shape the UI can rely on.
 */

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors?: Record<string, string>;

  constructor(status: number, code: string, message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

export interface RequestOptions {
  method?: 'GET' | 'POST';
  body?: unknown;
  signal?: AbortSignal;
}

interface ErrorBodyShape {
  error: { code: string; message: string; fieldErrors?: Record<string, string> };
}

function isErrorBody(value: unknown): value is ErrorBodyShape {
  if (typeof value !== 'object' || value === null || !('error' in value)) return false;
  const error = (value as { error: unknown }).error;
  return (
    typeof error === 'object' &&
    error !== null &&
    typeof (error as { code?: unknown }).code === 'string' &&
    typeof (error as { message?: unknown }).message === 'string'
  );
}

export function normalizeError(status: number, body: unknown): ApiError {
  if (isErrorBody(body)) {
    return new ApiError(status, body.error.code, body.error.message, body.error.fieldErrors);
  }
  if (status >= 500) {
    return new ApiError(status, 'server_error', 'The server had a problem. Please try again.');
  }
  return new ApiError(status, 'http_error', `Request failed with status ${status}.`);
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal } = options;
  let response: Response;
  try {
    response = await fetch(path, {
      method,
      signal,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause;
    throw new ApiError(
      0,
      'network_error',
      'Unable to reach the server. Check your connection and try again.',
    );
  }

  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) throw normalizeError(response.status, data);
  return data as T;
}
