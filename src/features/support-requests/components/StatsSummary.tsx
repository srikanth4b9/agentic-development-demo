import { Card } from '../../../components/ui';
import type { SupportRequestStats } from '../types';

const pad = (n: number) => String(n).padStart(2, '0');

export function StatsSummary({ stats }: { stats: SupportRequestStats }) {
  const items = [
    { label: 'Total', value: stats.total },
    { label: 'Open', value: stats.open },
    { label: 'Resolved', value: stats.resolved },
  ];
  return (
    <section aria-label="Request summary" className="grid-3">
      {items.map((item) => (
        <Card key={item.label} padding="sm">
          <p className="stat-card__value">{pad(item.value)}</p>
          <p className="stat-card__label">{item.label}</p>
        </Card>
      ))}
    </section>
  );
}
