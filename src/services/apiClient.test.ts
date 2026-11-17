import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, apiRequest, normalizeError } from './apiClient';

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('apiRequest', () => {
  it('returns parsed JSON on success and sends JSON bodies', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(201, { id: 'REQ-1' }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiRequest('/api/x', { method: 'POST', body: { a: 1 } })).resolves.toEqual({
      id: 'REQ-1',
    });
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.body).toBe('{"a":1}');
    expect(init.headers).toMatchObject({ 'Content-Type': 'application/json' });
  });

  it('normalizes server error bodies, including field errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(400, {
          error: {
            code: 'validation_error',
            message: 'Fix it',
            fieldErrors: { title: 'Too short' },
          },
        }),
      ),
    );

    const error = await apiRequest('/api/x').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 400,
      code: 'validation_error',
      message: 'Fix it',
      fieldErrors: { title: 'Too short' },
    });
  });

  it('maps network failures to a network_error ApiError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(apiRequest('/api/x')).rejects.toMatchObject({ status: 0, code: 'network_error' });
  });
});

describe('normalizeError', () => {
  it('falls back to a friendly server_error for 5xx without a body', () => {
    expect(normalizeError(503, null)).toMatchObject({ status: 503, code: 'server_error' });
  });

  it('falls back to http_error for other statuses', () => {
    expect(normalizeError(404, 'nope')).toMatchObject({ status: 404, code: 'http_error' });
  });
});
