import { test, expect } from '@playwright/test';

test.describe('Keyboard shortcuts', () => {
  test('Enter creates a task', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[placeholder*="Add a task"]');

    const input = page.getByPlaceholder(/Add a task/);
    await input.fill('Keyboard task');
    await input.press('Enter');

    await expect(page.getByText('Keyboard task')).toBeVisible();
  });

  test('Escape cancels form expansion', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[placeholder*="Add a task"]');

    const input = page.getByPlaceholder(/Add a task/);
    await input.click();
    await expect(page.getByLabel('Priority')).toBeVisible();

    await input.press('Escape');
    await expect(page.getByLabel('Priority')).not.toBeVisible();
  });

  test('Escape closes detail panel', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[placeholder*="Add a task"]');

    // Create and open
    const input = page.getByPlaceholder(/Add a task/);
    await input.fill('Esc test');
    await input.press('Enter');
    await page.getByText('Esc test').click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});
