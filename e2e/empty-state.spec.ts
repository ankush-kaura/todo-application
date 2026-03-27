import { test, expect } from '@playwright/test';

test.describe('Empty state', () => {
  test('shows empty state when no tasks exist', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[placeholder*="Add a task"]');

    await expect(page.getByText('No tasks yet')).toBeVisible();
    await expect(page.getByText('Create your first task')).toBeVisible();
  });

  test('empty state disappears after creating a task', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[placeholder*="Add a task"]');

    const input = page.getByPlaceholder(/Add a task/);
    await input.fill('First task');
    await input.press('Enter');

    await expect(page.getByText('No tasks yet')).not.toBeVisible();
    await expect(page.getByText('First task')).toBeVisible();
  });
});
