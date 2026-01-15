import { test, expect } from '@playwright/test';

/**
 * E2E Tests for User Story 3: Access Downloads and Registration Forms
 * 
 * Acceptance Criteria:
 * - AC1: Downloads section displays member registration form with description
 * - AC2: Downloads section displays International Bodensee Cup form with description
 * - AC3: Tapping download link opens or downloads PDF
 * - AC4: PDFs viewable/saveable on mobile devices
 * - AC5: Each download shows label, description, file size/type indicator
 */

test.describe('User Story 3: Downloads and Registration Forms', () => {
  const baseURL = 'http://localhost:4200';

  test.beforeEach(async ({ page }) => {
    await page.goto(baseURL);
    // Wait for data to load
    await page.waitForSelector('app-downloads-section', { timeout: 5000 });
    // Scroll to downloads section
    await page.locator('#downloads-section').scrollIntoViewIfNeeded();
  });

  // T096: Test AC1 - Downloads section displays member registration form with description
  test('AC1: Member registration form displayed with description', async ({ page }) => {
    // Verify downloads section is visible
    const downloadsSection = page.locator('#downloads-section');
    await expect(downloadsSection).toBeVisible();

    // Verify section title
    const sectionTitle = downloadsSection.locator('h2');
    await expect(sectionTitle).toContainText(/Downloads/i);

    // Verify member registration download item
    const memberRegItem = page.locator('app-download-item').filter({ hasText: 'Mitgliedsantrag' });
    await expect(memberRegItem).toBeVisible();

    // Verify it has a description
    const description = memberRegItem.locator('.download-description');
    await expect(description).toBeVisible();
    await expect(description).toContainText(/Formular zur Anmeldung/i);

    // Verify it has file metadata
    const fileType = memberRegItem.locator('.file-type');
    await expect(fileType).toContainText('PDF');
  });

  // T097: Test AC2 - Downloads section displays International Bodensee Cup form
  test('AC2: International Bodensee Cup form displayed with description', async ({ page }) => {
    // Verify International Bodensee Cup download item
    const bodenseeCupItem = page.locator('app-download-item').filter({ hasText: 'International Bodensee Cup' });
    await expect(bodenseeCupItem).toBeVisible();

    // Verify it has title
    const title = bodenseeCupItem.locator('.download-title');
    await expect(title).toContainText(/International Bodensee Cup/i);

    // Verify it has description
    const description = bodenseeCupItem.locator('.download-description');
    await expect(description).toBeVisible();
    await expect(description).toContainText(/Anmeldeformular/i);

    // Verify file icon is present
    const fileIcon = bodenseeCupItem.locator('.file-icon');
    await expect(fileIcon).toBeVisible();
  });

  // T098: Test AC3 - Tapping download link opens or downloads PDF
  test('AC3: Download link opens PDF in new tab', async ({ page, context }) => {
    // Listen for new page/tab opening
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      // Click the first download item
      page.locator('app-download-item').first().click()
    ]);

    // Wait for new page to load
    await newPage.waitForLoadState();

    // Verify new page URL contains the PDF path
    expect(newPage.url()).toContain('/assets/forms/');
    expect(newPage.url()).toContain('.pdf');

    // Close the new page
    await newPage.close();
  });

  // T099: Test AC4 - PDFs viewable/saveable on mobile devices
  test('AC4: Download works on mobile viewport', async ({ page, context }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Scroll to downloads section
    await page.locator('#downloads-section').scrollIntoViewIfNeeded();

    // Verify downloads are visible and tappable
    const firstDownload = page.locator('app-download-item').first();
    await expect(firstDownload).toBeVisible();

    // Verify tap target size (should be at least 44px)
    const downloadButton = firstDownload.locator('.download-button');
    const boundingBox = await downloadButton.boundingBox();
    expect(boundingBox).not.toBeNull();
    if (boundingBox) {
      expect(boundingBox.width).toBeGreaterThanOrEqual(44);
      expect(boundingBox.height).toBeGreaterThanOrEqual(44);
    }

    // Test tap interaction
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      firstDownload.click()
    ]);

    // Verify PDF opens
    await newPage.waitForLoadState();
    expect(newPage.url()).toContain('.pdf');
    await newPage.close();
  });

  // T100: Test AC5 - Each download shows label, description, file size/type
  test('AC5: Downloads show complete metadata', async ({ page }) => {
    const downloadItems = page.locator('app-download-item');
    const count = await downloadItems.count();
    
    // Should have at least 2 downloads
    expect(count).toBeGreaterThanOrEqual(2);

    // Check each download item has required info
    for (let i = 0; i < count; i++) {
      const item = downloadItems.nth(i);

      // Label (title)
      const title = item.locator('.download-title');
      await expect(title).toBeVisible();
      const titleText = await title.textContent();
      expect(titleText?.length).toBeGreaterThan(0);

      // Description
      const description = item.locator('.download-description');
      await expect(description).toBeVisible();
      const descText = await description.textContent();
      expect(descText?.length).toBeGreaterThan(0);

      // File type
      const fileType = item.locator('.file-type');
      await expect(fileType).toBeVisible();
      await expect(fileType).toContainText(/PDF|DOC/i);

      // File size
      const fileSize = item.locator('.file-size');
      await expect(fileSize).toBeVisible();
      const sizeText = await fileSize.textContent();
      expect(sizeText).toMatch(/\d+\s*(KB|MB)/i);

      // File icon
      const icon = item.locator('.file-icon');
      await expect(icon).toBeVisible();

      // Download button
      const downloadBtn = item.locator('.download-button');
      await expect(downloadBtn).toBeVisible();
    }
  });

  // T101: Test accessibility - Download links have proper ARIA labels and keyboard access
  test('AC6: Downloads have proper accessibility', async ({ page }) => {
    // Test keyboard navigation
    const firstDownload = page.locator('app-download-item').first();
    
    // Tab to first download
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // May need multiple tabs to reach downloads
    
    // Verify download item is focusable
    await firstDownload.focus();
    
    // Verify download button has aria-label
    const downloadButton = firstDownload.locator('.download-button');
    await expect(downloadButton).toHaveAttribute('aria-label', 'Download');

    // Test Enter key download
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      page.keyboard.press('Enter')
    ]);

    await newPage.waitForLoadState();
    expect(newPage.url()).toContain('.pdf');
    await newPage.close();
  });

  // T102: Test responsive - Downloads stack vertically on mobile, grid on desktop
  test('AC7: Downloads are responsive (mobile stack, desktop grid)', async ({ page }) => {
    // Test mobile layout (1 column)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.locator('#downloads-section').scrollIntoViewIfNeeded();

    const downloadsList = page.locator('.downloads-grid');
    const computedStyleMobile = await downloadsList.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        gridTemplateColumns: style.gridTemplateColumns,
        display: style.display
      };
    });

    // Verify grid display
    expect(computedStyleMobile.display).toBe('grid');
    // Mobile should be 1 column
    expect(computedStyleMobile.gridTemplateColumns).toContain('1fr');

    // Test desktop layout (2 columns)
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(500); // Wait for responsive styles to apply

    const computedStyleDesktop = await downloadsList.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        gridTemplateColumns: style.gridTemplateColumns
      };
    });

    // Desktop should have 2 columns
    const columns = computedStyleDesktop.gridTemplateColumns.split(' ').length;
    expect(columns).toBeGreaterThanOrEqual(2);
  });

  // Additional test: Verify downloads section has proper section anchor
  test('AC8: Downloads section has navigation anchor', async ({ page }) => {
    // Verify section has ID for navigation
    const downloadsSection = page.locator('#downloads-section');
    await expect(downloadsSection).toBeVisible();

    // Verify section has proper heading hierarchy
    const heading = downloadsSection.locator('h2').first();
    await expect(heading).toBeVisible();

    // Test direct anchor navigation
    await page.goto(`${baseURL}#downloads-section`);
    await page.waitForTimeout(1000); // Wait for scroll

    // Verify downloads section is in viewport
    await expect(downloadsSection).toBeInViewport();
  });
});
