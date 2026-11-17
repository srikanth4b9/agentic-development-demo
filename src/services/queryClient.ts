import { QueryClient } from '@tanstack/react-query';

/**
 * App-wide TanStack Query client. All server state goes through TanStack Query —
 * UI components never call fetch directly (see CLAUDE.md).
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
