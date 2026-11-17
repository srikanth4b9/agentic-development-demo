import { LIMITS, PRIORITY_LABELS, type CreateSupportRequestInput, type FieldErrors } from './types';

/** Client-side validation. Mirrors server rules so users get instant feedback. */
export function validateCreateInput(input: CreateSupportRequestInput): FieldErrors {
  const errors: FieldErrors = {};
  const title = input.title.trim();
  const description = input.description.trim();

  if (!title) errors.title = 'Title is required.';
  else if (title.length < LIMITS.titleMin || title.length > LIMITS.titleMax) {
    errors.title = `Title must be between ${LIMITS.titleMin} and ${LIMITS.titleMax} characters.`;
  }

  if (!description) errors.description = 'Description is required.';
  else if (
    description.length < LIMITS.descriptionMin ||
    description.length > LIMITS.descriptionMax
  ) {
    errors.description = `Description must be between ${LIMITS.descriptionMin} and ${LIMITS.descriptionMax} characters.`;
  }

  if (!(input.priority in PRIORITY_LABELS)) errors.priority = 'Choose a valid priority.';

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.values(errors).some(Boolean);
}
