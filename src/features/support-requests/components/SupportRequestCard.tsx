import { Badge, Card } from '../../../components/ui';
import { PRIORITY_TONES, STATUS_TONES } from '../tones';
import { PRIORITY_LABELS, STATUS_LABELS, type SupportRequest } from '../types';

const dateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' });

export interface SupportRequestCardProps {
  request: SupportRequest;
}

export function SupportRequestCard({ request }: SupportRequestCardProps) {
  const titleId = `${request.id}-title`;
  return (
    <Card as="article" padding="sm" aria-labelledby={titleId}>
      <div className="row row--between">
        <div className="stack stack--sm">
          <h3 id={titleId} className="request-card__title">
            {request.title}
          </h3>
          <p className="text-muted text-sm">
            {request.id} · {request.requester} ·{' '}
            <time dateTime={request.createdAt}>
              {dateFormat.format(new Date(request.createdAt))}
            </time>
          </p>
        </div>
        <div className="row">
          <Badge
            tone={PRIORITY_TONES[request.priority]}
            aria-label={`Priority: ${PRIORITY_LABELS[request.priority]}`}
          >
            {PRIORITY_LABELS[request.priority]}
          </Badge>
          <Badge
            tone={STATUS_TONES[request.status]}
            aria-label={`Status: ${STATUS_LABELS[request.status]}`}
          >
            {STATUS_LABELS[request.status]}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
