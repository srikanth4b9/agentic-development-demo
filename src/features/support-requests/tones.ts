import type { BadgeTone } from '../../components/ui';
import type { RequestPriority, RequestStatus } from './types';

/** Single place that maps domain values to design-system badge tones. */
export const STATUS_TONES: Record<RequestStatus, BadgeTone> = {
  open: 'warning',
  in_progress: 'accent',
  resolved: 'success',
};

export const PRIORITY_TONES: Record<RequestPriority, BadgeTone> = {
  low: 'neutral',
  medium: 'info',
  high: 'warning',
  urgent: 'danger',
};
