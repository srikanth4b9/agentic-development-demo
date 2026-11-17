import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createSupportRequest, fetchSupportRequests, supportRequestKeys } from './api';
import type { SupportRequestFilters } from './types';

export function useSupportRequests(filters: SupportRequestFilters) {
  return useQuery({
    queryKey: supportRequestKeys.list(filters),
    queryFn: ({ signal }) => fetchSupportRequests(filters, signal),
    // Keep showing the previous results while a new search/filter loads (no flashing).
    placeholderData: keepPreviousData,
  });
}

export function useCreateSupportRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSupportRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: supportRequestKeys.all }),
  });
}
