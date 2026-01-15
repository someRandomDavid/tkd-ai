import { test, expect } from '@playwright/test';

/**
 * E2E Tests for User Story 2: Navigate to Key Sections and Check Training Schedule
 * 
 * Acceptance Criteria:
 * - AC1: Hamburger menu appears on mobile (<768px), opens on tap
 * - AC2: Tapping menu item navigates to section/page
 * - AC3: Desktop view (≥768px) shows inline navigation without hamburger
 * - AC4: Menu auto-closes after navigation on mobile
 * - AC5: Schedule section displays all 3 programs with day, time, location
 * - AC6: Navigation links jump directly to program schedule sections
 */

test.describe('User Story 2: Navigation and Training Schedule', () => {
  const baseURL = 'http://localhost:4200';

  test.beforeEach(async ({ page }) => {
    await page.goto(baseURL);
    // Wait for data to load
    await page.waitForSelector('app-navigation-header', { timeout: 5000 });
  });

  // T071: Test AC1 - Hamburger menu appears on mobile (<768px), opens on tap
  test('AC1: Hamburger menu appears on mobile and opens on tap', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify hamburger button is visible
    const hamburger = page.locator('button[aria-label="Menu"]');
    await expect(hamburger).toBeVisible();
    
    // Verify desktop navigation is hidden
    const desktopNav = page.locator('.desktop-nav');
    await expect(desktopNav).not.toBeVisible();
    
    // Click hamburger to open menu
    await hamburger.click();
    
    // Verify sidenav opens
    const sidenav = page.locator('mat-sidenav');
    await expect(sidenav).toHaveClass(/mat-drawer-opened/);
    
    // Verify navigation items are visible in sidenav
    const navItems = page.locator('mat-sidenav mat-nav-list a');
    await expect(navItems.first()).toBeVisible();
  });

  // T072: Test AC2 - Tapping menu item navigates to section/page
  test('AC2: Tapping menu item navigates to section', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Open hamburger menu
    await page.click('button[aria-label="Menu"]');
    
    // Click on Taekwon-do link
    await page.click('mat-sidenav a:has-text("Taekwon-do")');
    
    // Wait for smooth scroll to complete
    await page.waitForTimeout(1000);
    
    // Verify we scrolled to the taekwondo section
    const taekwondoSection = page.locator('#taekwondo-schedule');
    await expect(taekwondoSection).toBeInViewport();
  });

  // T073: Test AC3 - Desktop view (≥768px) shows inline navigation without hamburger
  test('AC3: Desktop view shows inline navigation without hamburger', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // Verify hamburger button is NOT visible
    const hamburger = page.locator('button[aria-label="Menu"]');
    await expect(hamburger).not.toBeVisible();
    
    // Verify desktop navigation IS visible
    const desktopNav = page.locator('.desktop-nav');
    await expect(desktopNav).toBeVisible();
    
    // Verify navigation items are visible
    const navItems = page.locator('.desktop-nav a');
    const count = await navItems.count();
    expect(count).toBeGreaterThan(0);
    
    // Verify first nav item is visible and clickable
    await expect(navItems.first()).toBeVisible();
  });

  // T074: Test AC4 - Menu auto-closes after navigation on mobile
  test('AC4: Mobile menu auto-closes after navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Open hamburger menu
    await page.click('button[aria-label="Menu"]');
    
    // Verify menu is open
    const sidenav = page.locator('mat-sidenav');
    await expect(sidenav).toHaveClass(/mat-drawer-opened/);
    
    // Click navigation link
    await page.click('mat-sidenav a:has-text("Training")');
    
    // Wait for close animation
    await page.waitForTimeout(500);
    
    // Verify menu is closed
    await expect(sidenav).not.toHaveClass(/mat-drawer-opened/);
  });

  // T075: Test AC5 - Schedule section displays all 3 programs with day, time, location
  test('AC5: Schedule section displays all 3 programs with complete info', async ({ page }) => {
    // Scroll to schedules section
    await page.locator('#training-section').scrollIntoViewIfNeeded();
    
    // Verify Taekwon-do schedule
    const taekwondoSection = page.locator('#taekwondo-schedule');
    await expect(taekwondoSection).toBeVisible();
    
    // Verify at least one Taekwon-do session card with all details
    const taekwondoCards = taekwondoSection.locator('.session-card');
    await expect(taekwondoCards.first()).toBeVisible();
    await expect(taekwondoCards.first()).toContainText(/Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag/);
    await expect(taekwondoCards.first()).toContainText(/\d{2}:\d{2}/); // Time format
    await expect(taekwondoCards.first()).toContainText(/Sporthalle|Turnhalle/i); // Location
    
    // Verify Zumba schedule
    const zumbaSection = page.locator('#zumba-schedule');
    await expect(zumbaSection).toBeVisible();
    const zumbaCards = zumbaSection.locator('.session-card');
    await expect(zumbaCards.first()).toBeVisible();
    
    // Verify deepWORK schedule
    const deepworkSection = page.locator('#deepwork-schedule');
    await expect(deepworkSection).toBeVisible();
    const deepworkCards = deepworkSection.locator('.session-card');
    await expect(deepworkCards.first()).toBeVisible();
  });

  // T076: Test AC6 - Navigation links jump directly to program schedule sections
  test('AC6: Navigation links jump directly to specific program sections', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // Click Taekwon-do navigation link
    await page.click('.desktop-nav a:has-text("Taekwon-do")');
    await page.waitForTimeout(1000);
    
    // Verify Taekwon-do section is in viewport
    const taekwondoSection = page.locator('#taekwondo-schedule');
    await expect(taekwondoSection).toBeInViewport();
    
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    
    // Click Zumba navigation link
    await page.click('.desktop-nav a:has-text("Zumba")');
    await page.waitForTimeout(1000);
    
    // Verify Zumba section is in viewport
    const zumbaSection = page.locator('#zumba-schedule');
    await expect(zumbaSection).toBeInViewport();
    
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    
    // Click deepWORK navigation link
    await page.click('.desktop-nav a:has-text("deepWORK")');
    await page.waitForTimeout(1000);
    
    // Verify deepWORK section is in viewport
    const deepworkSection = page.locator('#deepwork-schedule');
    await expect(deepworkSection).toBeInViewport();
  });

  // T077: Test accessibility - NavigationHeader keyboard navigation and ARIA labels
  test('AC7: NavigationHeader has proper keyboard navigation and ARIA labels', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // Focus on first navigation link
    const firstLink = page.locator('.desktop-nav a').first();
    await firstLink.focus();
    
    // Verify link is focused
    await expect(firstLink).toBeFocused();
    
    // Tab through navigation items
    await page.keyboard.press('Tab');
    const secondLink = page.locator('.desktop-nav a').nth(1);
    await expect(secondLink).toBeFocused();
    
    // Verify ARIA labels on hamburger menu (mobile)
    await page.setViewportSize({ width: 375, height: 667 });
    const hamburger = page.locator('button[aria-label="Menu"]');
    await expect(hamburger).toHaveAttribute('aria-label', 'Menu');
    
    // Verify navigation has semantic role
    const nav = page.locator('mat-toolbar nav, nav');
    expect(await nav.count()).toBeGreaterThan(0);
  });

  // T078: Test accessibility - Schedule section has proper semantic structure
  test('AC8: Schedule section has proper semantic HTML structure', async ({ page }) => {
    // Scroll to schedules section
    await page.locator('#training-section').scrollIntoViewIfNeeded();
    
    // Verify section elements exist
    const trainingSection = page.locator('#training-section');
    await expect(trainingSection).toBeVisible();
    
    // Verify section has proper heading hierarchy
    const headings = page.locator('#training-section h2, #training-section h3');
    expect(await headings.count()).toBeGreaterThan(0);
    
    // Verify schedule cards have semantic structure
    const scheduleCards = page.locator('.session-card, mat-card');
    expect(await scheduleCards.count()).toBeGreaterThan(0);
    
    // Verify program sections have proper IDs for anchors
    await expect(page.locator('#taekwondo-schedule')).toBeVisible();
    await expect(page.locator('#zumba-schedule')).toBeVisible();
    await expect(page.locator('#deepwork-schedule')).toBeVisible();
  });
});
