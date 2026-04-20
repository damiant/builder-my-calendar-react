import { test, expect } from '@playwright/test';

test.describe('New Appointment Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto('/');
    // Wait for the calendar page to load
    await page.waitForSelector('.calendar-page');
  });

  test('should open appointment modal when New Appointment button is clicked', async ({
    page,
  }) => {
    // Click the New Appointment button
    await page.click('button:has-text("New Appointment")');

    // Verify the modal appears with the correct title
    await expect(page.locator('.ant-modal-title')).toContainText('New Appointment');

    // Verify key form elements are visible
    await expect(page.locator('input[placeholder="Enter appointment title"]')).toBeVisible();
    await expect(page.locator('text=Category')).toBeVisible();
    await expect(page.locator('text=Create Appointment')).toBeVisible();
  });

  test('should create a new appointment with all fields', async ({ page }) => {
    // Click the New Appointment button
    await page.click('button:has-text("New Appointment")');

    // Wait for modal to be visible
    await page.waitForSelector('.ant-modal');

    // Fill in the title
    await page.fill('input[placeholder="Enter appointment title"]', 'Team Meeting');

    // Set the date (click on date input and select a date)
    await page.click('input[placeholder="Select date"]');
    await page.waitForSelector('.ant-picker-panel-date');
    // Click on the 15th of the current month
    await page.click('.ant-picker-cell[title*="15"]');

    // Set the time
    await page.click('input[placeholder="Select time"]');
    await page.waitForSelector('.ant-picker-time-panel');
    // Select 2:00 PM (14:00)
    await page.click('.ant-picker-time-panel-column:has(text="14")');

    // Select Work category
    await page.click('label:has-text("Work")');

    // Add notes
    await page.fill('textarea[placeholder="Add notes (optional)"]', 'Discuss Q1 roadmap');

    // Click Create Appointment button
    await page.click('button:has-text("Create Appointment")');

    // Modal should close after successful creation
    await expect(page.locator('.ant-modal')).not.toBeVisible({ timeout: 5000 });

    // Verify the appointment appears in the calendar/planner view
    // The exact verification depends on which view is active
    await expect(page.locator('text=Team Meeting')).toBeVisible({ timeout: 5000 });
  });

  test('should create an all-day appointment', async ({ page }) => {
    // Click the New Appointment button
    await page.click('button:has-text("New Appointment")');

    // Wait for modal
    await page.waitForSelector('.ant-modal');

    // Fill in the title
    await page.fill('input[placeholder="Enter appointment title"]', 'Company Holiday');

    // Set the date
    await page.click('input[placeholder="Select date"]');
    await page.waitForSelector('.ant-picker-panel-date');
    await page.click('.ant-picker-cell[title*="20"]');

    // Toggle All Day Event
    const allDaySwitch = page.locator('text=All Day Event').locator('..').locator('input[type="checkbox"]');
    await allDaySwitch.check();

    // Verify time picker is hidden
    await expect(page.locator('input[placeholder="Select time"]')).not.toBeVisible();

    // Select Home category
    await page.click('label:has-text("Home")');

    // Submit
    await page.click('button:has-text("Create Appointment")');

    // Verify modal closes and appointment appears
    await expect(page.locator('.ant-modal')).not.toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Company Holiday')).toBeVisible({ timeout: 5000 });
  });

  test('should close modal when Cancel button is clicked', async ({ page }) => {
    // Click the New Appointment button
    await page.click('button:has-text("New Appointment")');

    // Wait for modal
    await page.waitForSelector('.ant-modal');

    // Fill in a title
    await page.fill('input[placeholder="Enter appointment title"]', 'Test Appointment');

    // Click Cancel button
    await page.click('button:has-text("Cancel")');

    // Modal should close
    await expect(page.locator('.ant-modal')).not.toBeVisible();

    // The appointment should not be created
    await expect(page.locator('text=Test Appointment')).not.toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Click the New Appointment button
    await page.click('button:has-text("New Appointment")');

    // Wait for modal
    await page.waitForSelector('.ant-modal');

    // Try to submit without filling required fields
    await page.click('button:has-text("Create Appointment")');

    // Verify validation errors appear
    await expect(page.locator('text=Please enter a title')).toBeVisible();
    await expect(page.locator('text=Please select a date')).toBeVisible();

    // Modal should still be open
    await expect(page.locator('.ant-modal')).toBeVisible();
  });
});
