import { test, expect } from '@playwright/test';

test('app shell loads and the mock API is healthy', async ({ page, request }) => {
  const health = await request.get('/api/health');
  expect(health.ok()).toBeTruthy();

  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Support Requests' })).toBeVisible();
});
