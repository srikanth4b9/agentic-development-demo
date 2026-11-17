import { useState, type FormEvent } from 'react';
import { Button, Dialog, Select, TextArea, TextField } from '../../../components/ui';
import { ApiError } from '../../../services/apiClient';
import { useCreateSupportRequest } from '../hooks';
import {
  LIMITS,
  PRIORITY_LABELS,
  type CreateSupportRequestInput,
  type FieldErrors,
  type RequestPriority,
  type SupportRequest,
} from '../types';
import { hasErrors, validateCreateInput } from '../validation';

const PRIORITY_OPTIONS = (Object.keys(PRIORITY_LABELS) as RequestPriority[]).map((value) => ({
  value,
  label: PRIORITY_LABELS[value],
}));

const EMPTY: CreateSupportRequestInput = { title: '', description: '', priority: 'medium' };

export interface NewRequestDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: (request: SupportRequest) => void;
}

export function NewRequestDialog({ open, onClose, onCreated }: NewRequestDialogProps) {
  const [form, setForm] = useState<CreateSupportRequestInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const createRequest = useCreateSupportRequest();

  function close() {
    setForm(EMPTY);
    setErrors({});
    setFormError(null);
    createRequest.reset();
    onClose();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clientErrors = validateCreateInput(form);
    setErrors(clientErrors);
    setFormError(null);
    if (hasErrors(clientErrors)) return;

    createRequest.mutate(form, {
      onSuccess: (created) => {
        setForm(EMPTY);
        setErrors({});
        onCreated(created);
      },
      onError: (error) => {
        if (error instanceof ApiError && error.fieldErrors) setErrors(error.fieldErrors);
        setFormError(error.message);
      },
    });
  }

  return (
    <Dialog open={open} title="New support request" onClose={close}>
      <form className="stack" onSubmit={handleSubmit} noValidate>
        {formError && (
          <p className="field__error" role="alert">
            {formError}
          </p>
        )}
        <TextField
          label="Title"
          hint={`${LIMITS.titleMin}–${LIMITS.titleMax} characters`}
          value={form.title}
          error={errors.title}
          maxLength={LIMITS.titleMax}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <TextArea
          label="Description"
          hint={`${LIMITS.descriptionMin}–${LIMITS.descriptionMax} characters`}
          value={form.description}
          error={errors.description}
          maxLength={LIMITS.descriptionMax}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <Select
          label="Priority"
          value={form.priority}
          options={PRIORITY_OPTIONS}
          error={errors.priority}
          onChange={(priority) => setForm({ ...form, priority })}
        />
        <div className="row row--end">
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createRequest.isPending}
            aria-busy={createRequest.isPending}
          >
            Submit Request
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
