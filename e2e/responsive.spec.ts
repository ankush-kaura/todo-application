import { test, expect } from '@playwright/test';

test.describe('Mobile responsive', () => {
  test('app works at mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('[placeholder*="Add a task"]');

    // Can create tasks at mobile size
    const input = page.getByPlaceholder(/Add a task/);
    await input.fill('Mobile task');
    await input.press('Enter');

    await expect(page.getByText('Mobile task')).toBeVisible();
  });

  test('task creation form works on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForSelector('[placeholder*="Add a task"]');

    const input = page.getByPlaceholder(/Add a task/);
    await input.click();
    await expect(page.getByLabel('Priority')).toBeVisible();

    await input.fill('Tablet task');
    await input.press('Enter');
    await expect(page.getByText('Tablet task')).toBeVisible();
  });
});
