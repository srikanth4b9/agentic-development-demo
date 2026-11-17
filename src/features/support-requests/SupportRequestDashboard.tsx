import { useState } from 'react';
import { Button, EmptyState, ErrorState, LoadingState } from '../../components/ui';
import { useDebouncedValue } from '../../lib/useDebouncedValue';
import { NewRequestDialog } from './components/NewRequestDialog';
import { RequestFilters } from './components/RequestFilters';
import { RequestList } from './components/RequestList';
import { StatsSummary } from './components/StatsSummary';
import { useSupportRequests } from './hooks';
import type { SupportRequest, SupportRequestFilters } from './types';
import './support-requests.css';

const DEFAULT_FILTERS: SupportRequestFilters = { search: '', status: 'all' };

export function SupportRequestDashboard() {
  const [filters, setFilters] = useState<SupportRequestFilters>(DEFAULT_FILTERS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const debouncedSearch = useDebouncedValue(filters.search);
  const query = useSupportRequests({ ...filters, search: debouncedSearch });

  const hasActiveFilters = filters.search.trim() !== '' || filters.status !== 'all';

  function handleCreated(request: SupportRequest) {
    setDialogOpen(false);
    // Reset filters so the new (open) request is guaranteed to be visible in the list.
    setFilters(DEFAULT_FILTERS);
    setAnnouncement(`Request "${request.title}" created.`);
  }

  return (
    <main className="app-shell stack">
      <header className="row row--between">
        <h1 className="page-title">Support Requests</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <span aria-hidden="true">+</span> New Request
        </Button>
      </header>

      <p className="visually-hidden" role="status" aria-live="polite">
        {announcement}
      </p>

      {query.data && <StatsSummary stats={query.data.stats} />}

      <RequestFilters value={filters} onChange={setFilters} />

      {query.isPending ? (
        <LoadingState label="Loading support requests…" />
      ) : query.isError ? (
        <ErrorState
          title="Could not load support requests"
          message={query.error.message}
          action={
            <Button variant="secondary" onClick={() => query.refetch()}>
              Try again
            </Button>
          }
        />
      ) : query.data.items.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            title="No requests match your filters"
            description="Try a different search term or status."
            action={
              <Button variant="secondary" onClick={() => setFilters(DEFAULT_FILTERS)}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <EmptyState
            title="No support requests yet"
            description="Create the first request to get started."
            action={<Button onClick={() => setDialogOpen(true)}>New Request</Button>}
          />
        )
      ) : (
        <RequestList requests={query.data.items} isRefreshing={query.isFetching} />
      )}

      <NewRequestDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={handleCreated}
      />
    </main>
  );
}
