import { test, expect } from '@playwright/test';

test.describe('Full CRUD flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for app to load (skeleton disappears)
    await page.waitForSelector('[placeholder*="Add a task"]');
  });

  test('create a task', async ({ page }) => {
    const input = page.getByPlaceholder(/Add a task/);
    await input.fill('Buy groceries');
    await input.press('Enter');

    await expect(page.getByText('Buy groceries')).toBeVisible();
    await expect(page.getByText('Task created')).toBeVisible();
  });

  test('create task with priority', async ({ page }) => {
    const input = page.getByPlaceholder(/Add a task/);
    await input.click();
    await page.getByLabel('Priority').selectOption('high');
    await input.fill('Urgent item');
    await input.press('Enter');

    await expect(page.getByText('Urgent item')).toBeVisible();
    await expect(page.getByText('High')).toBeVisible();
  });

  test('complete and uncomplete a task', async ({ page }) => {
    // Create a task first
    const input = page.getByPlaceholder(/Add a task/);
    await input.fill('Toggle task');
    await input.press('Enter');
    await expect(page.getByText('Toggle task')).toBeVisible();

    // Complete it
    await page.getByLabel('Mark complete').click();

    // Verify done state (strikethrough)
    const title = page.getByText('Toggle task');
    await expect(title).toHaveClass(/line-through/);

    // Uncomplete
    await page.getByLabel('Mark incomplete').click();
    await expect(title).not.toHaveClass(/line-through/);
  });

  test('edit a task via detail panel', async ({ page }) => {
    // Create a task
    const input = page.getByPlaceholder(/Add a task/);
    await input.fill('Edit me');
    await input.press('Enter');
    await expect(page.getByText('Edit me')).toBeVisible();

    // Open detail panel by clicking the task
    await page.getByText('Edit me').click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Edit title
    const titleInput = page.getByLabel('Title');
    await titleInput.clear();
    await titleInput.fill('Edited task');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('Edited task')).toBeVisible();
    await expect(page.getByText('Task updated')).toBeVisible();
  });

  test('delete a task via detail panel', async ({ page }) => {
    // Create a task
    const input = page.getByPlaceholder(/Add a task/);
    await input.fill('Delete me');
    await input.press('Enter');
    await expect(page.getByText('Delete me')).toBeVisible();

    // Open detail panel
    await page.getByText('Delete me').click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Delete
    await page.getByRole('button', { name: 'Delete' }).click();

    await expect(page.getByText('Delete me')).not.toBeVisible();
  });

  test('full lifecycle: create → edit → complete → delete', async ({ page }) => {
    // Create
    const input = page.getByPlaceholder(/Add a task/);
    await input.fill('Lifecycle task');
    await input.press('Enter');
    await expect(page.getByText('Lifecycle task')).toBeVisible();

    // Edit via actions menu
    await page.getByText('Lifecycle task').click();
    const titleInput = page.getByLabel('Title');
    await titleInput.clear();
    await titleInput.fill('Updated lifecycle');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Updated lifecycle')).toBeVisible();

    // Complete
    await page.getByLabel('Mark complete').click();
    await expect(page.getByText('Updated lifecycle')).toHaveClass(/line-through/);

    // Delete via detail panel
    await page.getByText('Updated lifecycle').click();
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByText('Updated lifecycle')).not.toBeVisible();
  });
});
