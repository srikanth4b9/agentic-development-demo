import { afterEach, describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithClient } from '../../test/renderWithClient';
import { SupportRequestDashboard } from './SupportRequestDashboard';
import type { SupportRequest, SupportRequestListResponse } from './types';

const request = (overrides: Partial<SupportRequest>): SupportRequest => ({
  id: 'REQ-1001',
  title: 'Unable to export report',
  description: 'Export spinner never stops.',
  priority: 'high',
  status: 'open',
  requester: 'Priya N.',
  createdAt: '2026-11-01T09:00:00.000Z',
  ...overrides,
});

const listResponse: SupportRequestListResponse = {
  items: [
    request({}),
    request({ id: 'REQ-1002', title: 'Add dark mode support', status: 'in_progress' }),
  ],
  stats: { total: 24, open: 8, resolved: 16 },
};

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('SupportRequestDashboard', () => {
  it('shows a loading state, then requests with badges and stats', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json(200, listResponse)));
    renderWithClient(<SupportRequestDashboard />);

    expect(screen.getAllByText('Loading support requests…').length).toBeGreaterThan(0);
    const list = await screen.findByRole('list', { name: 'Support requests' });
    expect(within(list).getAllByRole('article')).toHaveLength(2);
    expect(screen.getByLabelText('Status: In progress')).toBeInTheDocument();
    expect(screen.getAllByLabelText('Priority: High')).toHaveLength(2);
    const summary = screen.getByRole('region', { name: 'Request summary' });
    expect(within(summary).getByText('24')).toBeInTheDocument();
    expect(within(summary).getByText('08')).toBeInTheDocument();
  });

  it('shows an error state with a working retry', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        json(500, { error: { code: 'internal_error', message: 'Service unavailable.' } }),
      )
      .mockResolvedValue(json(200, listResponse));
    vi.stubGlobal('fetch', fetchMock);
    renderWithClient(<SupportRequestDashboard />);

    expect(await screen.findByText('Service unavailable.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('list', { name: 'Support requests' })).toBeInTheDocument();
  });

  it('shows an empty state when there are no requests', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(json(200, { items: [], stats: { total: 0, open: 0, resolved: 0 } })),
    );
    renderWithClient(<SupportRequestDashboard />);
    expect(await screen.findByText('No support requests yet')).toBeInTheDocument();
  });

  it('validates the new request form before calling the API', async () => {
    const fetchMock = vi.fn().mockResolvedValue(json(200, listResponse));
    vi.stubGlobal('fetch', fetchMock);
    renderWithClient(<SupportRequestDashboard />);
    await screen.findByRole('list', { name: 'Support requests' });

    await userEvent.click(screen.getByRole('button', { name: 'New Request' }));
    const dialog = screen.getByRole('dialog', { name: 'New support request' });
    await userEvent.click(within(dialog).getByRole('button', { name: 'Submit Request' }));

    expect(within(dialog).getByText('Title is required.')).toBeInTheDocument();
    expect(within(dialog).getByText('Description is required.')).toBeInTheDocument();
    expect(within(dialog).getByLabelText('Title')).toHaveAttribute('aria-invalid', 'true');
    expect(fetchMock).toHaveBeenCalledTimes(1); // only the initial list load
  });
});
