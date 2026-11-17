import { apiRequest } from '../../services/apiClient';
import type {
  CreateSupportRequestInput,
  SupportRequest,
  SupportRequestFilters,
  SupportRequestListResponse,
} from './types';

export const supportRequestKeys = {
  all: ['support-requests'] as const,
  list: (filters: SupportRequestFilters) => [...supportRequestKeys.all, 'list', filters] as const,
};

export function buildListUrl(filters: SupportRequestFilters): string {
  const params = new URLSearchParams();
  const search = filters.search.trim();
  if (search) params.set('search', search);
  if (filters.status !== 'all') params.set('status', filters.status);
  const query = params.toString();
  return query ? `/api/requests?${query}` : '/api/requests';
}

export function fetchSupportRequests(filters: SupportRequestFilters, signal?: AbortSignal) {
  return apiRequest<SupportRequestListResponse>(buildListUrl(filters), { signal });
}

export function createSupportRequest(input: CreateSupportRequestInput) {
  return apiRequest<SupportRequest>('/api/requests', { method: 'POST', body: input });
}
