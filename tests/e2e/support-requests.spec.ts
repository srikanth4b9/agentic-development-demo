import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request, page }) => {
  await request.post('/api/__reset');
  await page.goto('/support-requests');
  await expect(page.getByRole('list', { name: 'Support requests' })).toBeVisible();
});

test('user can create a support request', async ({ page }) => {
  await page.getByRole('button', { name: 'New Request' }).click();
  await page.getByLabel('Title').fill('Export fails on Safari');
  await page.getByLabel('Description').fill('The export button does not download the report.');
  await page.getByRole('button', { name: 'Submit Request' }).click();

  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.getByRole('heading', { name: 'Export fails on Safari' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Request summary' })).toContainText('25');
});

test('user sees validation feedback for an invalid request', async ({ page }) => {
  await page.getByRole('button', { name: 'New Request' }).click();
  await page.getByLabel('Title').fill('Bug');
  await page.getByRole('button', { name: 'Submit Request' }).click();

  const dialog = page.getByRole('dialog', { name: 'New support request' });
  await expect(dialog.getByText('Title must be between 5 and 120 characters.')).toBeVisible();
  await expect(dialog.getByText('Description is required.')).toBeVisible();
});

test('new request is visible even when a status filter was active', async ({ page }) => {
  await page.getByRole('combobox', { name: 'Status' }).selectOption('resolved');
  await page.getByRole('button', { name: 'New Request' }).click();
  await page.getByLabel('Title').fill('Filter regression check');
  await page.getByLabel('Description').fill('Created while the Resolved filter was active.');
  await page.getByRole('button', { name: 'Submit Request' }).click();

  await expect(page.getByRole('heading', { name: 'Filter regression check' })).toBeVisible();
});

test('user can search and filter by status', async ({ page }) => {
  const list = page.getByRole('list', { name: 'Support requests' });

  await page.getByRole('combobox', { name: 'Status' }).selectOption('in_progress');
  await expect(list.getByRole('article')).toHaveCount(2);

  await page.getByRole('combobox', { name: 'Status' }).selectOption('all');
  await page.getByLabel('Search requests').fill('export');
  await expect(list.getByRole('heading', { name: 'Unable to export report' })).toBeVisible();
  await expect(list.getByRole('heading', { name: 'Add dark mode support' })).toBeHidden();

  await page.getByLabel('Search requests').fill('zzz-no-match');
  await expect(page.getByText('No requests match your filters')).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(list.getByRole('article')).toHaveCount(24);
});

test('dialog is keyboard accessible: Escape closes and focus returns', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'New Request' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByLabel('Title')).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('user sees an error state and can retry', async ({ page, request }) => {
  await request.post('/api/__mock', { data: { mode: 'error' } });
  await page.reload();
  await expect(page.getByText('Could not load support requests')).toBeVisible({ timeout: 10_000 });

  await request.post('/api/__mock', { data: { mode: 'normal' } });
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('list', { name: 'Support requests' })).toBeVisible();
});
