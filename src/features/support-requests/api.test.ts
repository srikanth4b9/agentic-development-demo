import { describe, expect, it } from 'vitest';
import { buildListUrl } from './api';

describe('buildListUrl', () => {
  it('omits empty search and the "all" status', () => {
    expect(buildListUrl({ search: '  ', status: 'all' })).toBe('/api/requests');
  });

  it('encodes trimmed search and a specific status', () => {
    expect(buildListUrl({ search: ' export & csv ', status: 'in_progress' })).toBe(
      '/api/requests?search=export+%26+csv&status=in_progress',
    );
  });
});
