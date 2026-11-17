import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Badge, Button, Select, TextField } from '.';

describe('shared UI', () => {
  it('Button defaults to type="button" and fires onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('type', 'button');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('Badge renders its tone class', () => {
    render(<Badge tone="success">Resolved</Badge>);
    expect(screen.getByText('Resolved')).toHaveClass('badge--success');
  });

  it('TextField links label, hint and error for assistive tech', () => {
    render(<TextField label="Title" hint="5–120 characters" error="Title is required" />);
    const input = screen.getByLabelText('Title');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('5–120 characters Title is required');
  });

  it('Select is labelled and reports typed changes', async () => {
    const onChange = vi.fn();
    render(
      <Select
        label="Status"
        value="all"
        onChange={onChange}
        options={[
          { value: 'all', label: 'All' },
          { value: 'open', label: 'Open' },
        ]}
      />,
    );
    await userEvent.selectOptions(screen.getByLabelText('Status'), 'open');
    expect(onChange).toHaveBeenCalledWith('open');
  });
});
