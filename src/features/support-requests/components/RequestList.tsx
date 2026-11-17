import type { SupportRequest } from '../types';
import { SupportRequestCard } from './SupportRequestCard';

export interface RequestListProps {
  requests: SupportRequest[];
  isRefreshing?: boolean;
}

export function RequestList({ requests, isRefreshing = false }: RequestListProps) {
  return (
    <ul className="request-list" aria-label="Support requests" aria-busy={isRefreshing}>
      {requests.map((request) => (
        <li key={request.id}>
          <SupportRequestCard request={request} />
        </li>
      ))}
    </ul>
  );
}
