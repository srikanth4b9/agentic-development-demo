import { describe, expect, it } from 'vitest';
import { hasErrors, validateCreateInput } from './validation';

const valid = {
  title: 'Export fails on Safari',
  description: 'The export button does not download the report.',
  priority: 'medium' as const,
};

describe('validateCreateInput', () => {
  it('accepts valid input', () => {
    expect(hasErrors(validateCreateInput(valid))).toBe(false);
  });

  it('requires title and description (whitespace counts as empty)', () => {
    expect(validateCreateInput({ ...valid, title: '   ', description: '' })).toEqual({
      title: 'Title is required.',
      description: 'Description is required.',
    });
  });

  it('enforces length limits', () => {
    const errors = validateCreateInput({ ...valid, title: 'Bug', description: 'Too short' });
    expect(errors.title).toMatch(/between 5 and 120/);
    expect(errors.description).toMatch(/between 10 and 2000/);
    expect(validateCreateInput({ ...valid, title: 'x'.repeat(121) }).title).toBeDefined();
  });
});
