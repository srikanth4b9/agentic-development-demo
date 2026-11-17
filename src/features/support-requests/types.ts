/**
 * Support Request contracts — APPROVED, SHARED between the UI and API work streams.
 * Change only through a reviewed PR; both worktrees build against these types.
 *
 * Mock API (server/index.mjs):
 *   GET  /api/requests?search=<text>&status=<RequestStatus|'all'>  -> SupportRequestListResponse
 *   POST /api/requests  body: CreateSupportRequestInput             -> 201 SupportRequest
 *   Errors: { error: { code, message, fieldErrors? } } with 4xx/5xx status
 */

export type RequestStatus = 'open' | 'in_progress' | 'resolved';
export type RequestPriority = 'low' | 'medium' | 'high' | 'urgent';
export type StatusFilter = RequestStatus | 'all';

export interface SupportRequest {
  id: string;
  title: string;
  description: string;
  priority: RequestPriority;
  status: RequestStatus;
  requester: string;
  /** ISO-8601 timestamp */
  createdAt: string;
}

export interface SupportRequestFilters {
  search: string;
  status: StatusFilter;
}

/** Stats always describe the full dataset, not the filtered list. `open` = open + in_progress. */
export interface SupportRequestStats {
  total: number;
  open: number;
  resolved: number;
}

export interface SupportRequestListResponse {
  items: SupportRequest[];
  stats: SupportRequestStats;
}

export interface CreateSupportRequestInput {
  title: string;
  description: string;
  priority: RequestPriority;
}

export type FieldErrors = Partial<Record<keyof CreateSupportRequestInput, string>>;

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    fieldErrors?: FieldErrors;
  };
}

/** Validation limits — must match the server. */
export const LIMITS = {
  titleMin: 5,
  titleMax: 120,
  descriptionMin: 10,
  descriptionMax: 2000,
} as const;

export const STATUS_LABELS: Record<RequestStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  resolved: 'Resolved',
};

export const PRIORITY_LABELS: Record<RequestPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};
