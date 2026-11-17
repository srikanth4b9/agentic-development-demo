import { Select, TextField, type SelectOption } from '../../../components/ui';
import { STATUS_LABELS, type StatusFilter, type SupportRequestFilters } from '../types';

const STATUS_OPTIONS: SelectOption<StatusFilter>[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: STATUS_LABELS.open },
  { value: 'in_progress', label: STATUS_LABELS.in_progress },
  { value: 'resolved', label: STATUS_LABELS.resolved },
];

export interface RequestFiltersProps {
  value: SupportRequestFilters;
  onChange: (next: SupportRequestFilters) => void;
}

export function RequestFilters({ value, onChange }: RequestFiltersProps) {
  return (
    <div role="search" className="filters" aria-label="Filter requests">
      <TextField
        label="Search requests"
        type="search"
        placeholder="Search by title or ID…"
        value={value.search}
        onChange={(e) => onChange({ ...value, search: e.target.value })}
      />
      <Select
        label="Status"
        value={value.status}
        options={STATUS_OPTIONS}
        onChange={(status) => onChange({ ...value, status })}
      />
    </div>
  );
}
