import { test, expect } from '@playwright/test';

test.describe('Persistence', () => {
  test('tasks persist across page reloads', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[placeholder*="Add a task"]');

    // Create a task
    const input = page.getByPlaceholder(/Add a task/);
    await input.fill('Persistent task');
    await input.press('Enter');
    await expect(page.getByText('Persistent task')).toBeVisible();

    // Reload page
    await page.reload();
    await page.waitForSelector('[placeholder*="Add a task"]');

    // Task should still be there
    await expect(page.getByText('Persistent task')).toBeVisible();
  });

  test('completed state persists across reloads', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[placeholder*="Add a task"]');

    // Create and complete
    const input = page.getByPlaceholder(/Add a task/);
    await input.fill('Complete me');
    await input.press('Enter');
    await page.getByLabel('Mark complete').click();

    // Reload
    await page.reload();
    await page.waitForSelector('[placeholder*="Add a task"]');

    // Should still be done
    await expect(page.getByText('Complete me')).toHaveClass(/line-through/);
  });
});
