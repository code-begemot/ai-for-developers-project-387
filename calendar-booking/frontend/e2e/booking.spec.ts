import { test, expect } from '@playwright/test';

test.describe('Calendar Booking - End-to-End', () => {
  test('full booking flow: admin creates event, guest books, admin sees booking', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page.getByRole('heading', { name: 'Event Types (Admin)' })).toBeVisible();

    await page.getByRole('button', { name: 'Add Event Type' }).click();
    await expect(page.getByRole('heading', { name: 'Add Event Type' })).toBeVisible();

    await page.getByLabel('Name').fill('Team Meeting');
    await page.getByLabel('Description').fill('Weekly team sync');
    await page.getByLabel('Duration (minutes)').fill('30');
    await page.getByRole('button', { name: 'Create' }).click();

    await expect(page.getByText('Team Meeting')).toBeVisible();

    await page.getByRole('link', { name: 'Guest' }).click();
    await expect(page.getByRole('heading', { name: 'Available Event Types' })).toBeVisible();
    await expect(page.getByText('Team Meeting')).toBeVisible();

    await page.getByRole('button', { name: 'Book' }).click();
    await expect(page.getByRole('heading', { name: 'Team Meeting' })).toBeVisible();

    await page.getByRole('button', { name: /Available/ }).first().click();

    await page.getByLabel('Name').fill('John Doe');
    await page.getByLabel('Email').fill('john@example.com');
    await page.getByRole('button', { name: 'Confirm Booking' }).click();

    await page.getByRole('link', { name: 'Admin' }).click();
    await page.getByRole('link', { name: 'Event Types' }).click();
    await expect(page.getByRole('heading', { name: 'Bookings (Admin)' })).toBeVisible();
    await expect(page.getByText('john@example.com')).toBeVisible();
    await expect(page.getByText('Team Meeting')).toBeVisible();
  });
});
