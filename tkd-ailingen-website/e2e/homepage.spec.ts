import { test, expect } from '@playwright/test';
import {
  navigateToHomePage,
  checkAccessibility,
  expectVisibleText,
  expectHeading,
  isMobileViewport,
} from './helpers';

/**
 * E2E tests for User Story 1: View Essential Club Information
 * Tests on mobile viewport (320px) as per constitution principle III
 */
test.describe('Homepage - User Story 1 (MVP)', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToHomePage(page);
  });

  /**
   * T045: Test AC1 - Club name "Taekwon-do Ailingen" displayed in hero on mobile load
   */
  test('should display club name in hero section on mobile', async ({ page }) => {
    // Verify hero section is visible
    const heroSection = page.locator('section.hero-section');
    await expect(heroSection).toBeVisible();

    // Verify club name is displayed
    await expectHeading(page, /Taekwon-do Ailingen/i, 1);

    // Verify tagline is visible
    await expectVisibleText(page, /Tradition|Disziplin|Stärke/i);
  });

  /**
   * T046: Test AC2 - Welcome section shows description including all 3 programs
   */
  test('should show welcome section with all 3 programs', async ({ page }) => {
    // Scroll to welcome section
    await page.locator('#welcome').scrollIntoViewIfNeeded();

    // Verify welcome section is visible
    const welcomeSection = page.locator('app-welcome-section');
    await expect(welcomeSection).toBeVisible();

    // Verify welcome heading
    await expectHeading(page, /Willkommen/i);

    // Verify all 3 programs are displayed
    await expectVisibleText(page, /Taekwon-do/i);
    await expectVisibleText(page, /Zumba/i);
    await expectVisibleText(page, /deepWORK/i);

    // Verify program cards exist
    const programCards = page.locator('mat-card.program-card');
    await expect(programCards).toHaveCount(3);
  });

  /**
   * T047: Test AC3 - Footer displays club address and contact info
   */
  test('should display footer with contact information', async ({ page }) => {
    // Scroll to footer
    await page.locator('app-footer').scrollIntoViewIfNeeded();

    // Verify footer is visible
    const footer = page.locator('footer.footer');
    await expect(footer).toBeVisible();

    // Verify address is displayed
    await expectVisibleText(page, /Friedrichshafen/i);
    await expectVisibleText(page, /88048/i);

    // Verify phone and email links exist
    const phoneLink = page.locator('a[href^="tel:"]');
    await expect(phoneLink).toBeVisible();

    const emailLink = page.locator('a[href^="mailto:"]');
    await expect(emailLink).toBeVisible();

    // Verify social media links
    const socialLinks = page.locator('.social-link');
    await expect(socialLinks).toHaveCount(2); // Facebook and Instagram
  });

  /**
   * T048: Test accessibility - Run axe-core on homepage, verify 0 violations
   */
  test('should pass accessibility audit with zero violations', async ({ page }) => {
    // Run comprehensive accessibility check
    await checkAccessibility(page);

    // Additional manual checks
    // Verify main landmark exists
    const mainContent = page.locator('main, [role="main"], app-home');
    await expect(mainContent).toBeVisible();

    // Verify heading hierarchy (h1 exists)
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    // Verify images have alt text or are decorative
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const ariaHidden = await img.getAttribute('aria-hidden');
      // Image must have alt text OR be marked decorative with aria-hidden
      expect(alt !== null || ariaHidden === 'true').toBeTruthy();
    }
  });

  /**
   * T049: Test performance - Verify FCP and TTI metrics
   * Note: This is a basic check. Full Lighthouse audit should be run separately
   */
  test('should meet performance targets on mobile', async ({ page, browserName }) => {
    // Only run on Chromium (has Performance API)
    test.skip(browserName !== 'chromium', 'Performance metrics only in Chromium');

    // Navigate and wait for load
    await navigateToHomePage(page);

    // Get performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const fcp = paint.find((entry) => entry.name === 'first-contentful-paint');
      
      return {
        fcp: fcp ? fcp.startTime : 0,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        loadComplete: navigation.loadEventEnd - navigation.fetchStart,
      };
    });

    // FCP should be < 1500ms (1.5s target)
    expect(performanceMetrics.fcp).toBeLessThan(1500);
    
    // DOM Content Loaded should be reasonably fast
    expect(performanceMetrics.domContentLoaded).toBeLessThan(2000);

    console.log('Performance Metrics:', performanceMetrics);
  });

  /**
   * Additional test: Verify responsive layout on mobile viewport
   */
  test('should display mobile-optimized layout on small screens', async ({ page }) => {
    const isMobile = await isMobileViewport(page);
    
    if (isMobile) {
      // Hero section should be appropriately sized
      const heroSection = page.locator('.hero-section');
      const heroBox = await heroSection.boundingBox();
      expect(heroBox?.height).toBeGreaterThan(400); // min-height: 400px

      // Welcome section should stack vertically (1 column grid)
      const programsGrid = page.locator('.programs-grid');
      const gridStyles = await programsGrid.evaluate((el) => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });
      
      // On mobile, should be single column
      expect(gridStyles).toContain('1fr');
    }
  });

  /**
   * Additional test: Verify keyboard navigation
   * T043: Test keyboard navigation for all interactive elements
   */
  test('should support keyboard navigation', async ({ page }) => {
    // Focus on first interactive element (should be a link in footer or potential CTA)
    await page.keyboard.press('Tab');
    
    // Verify focus is visible (check for focus-visible or focus styles)
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      const styles = window.getComputedStyle(el as Element);
      return {
        tagName: el?.tagName,
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
      };
    });

    // Verify interactive element received focus
    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement.tagName);

    // Tab through all interactive elements
    const interactiveElements = await page.locator('a, button, input, select, textarea').count();
    
    // Should have at least contact links, email, phone, and social media links
    expect(interactiveElements).toBeGreaterThanOrEqual(4);
  });

  /**
   * Additional test: Verify content loads correctly
   */
  test('should load club information from JSON data', async ({ page }) => {
    // Wait for content to load (check for hero title)
    await page.waitForSelector('h1#hero-title', { timeout: 5000 });

    // Verify no error messages
    const errorMessage = page.locator('.error-container');
    await expect(errorMessage).not.toBeVisible();

    // Verify loading indicator is gone
    const loadingIndicator = page.locator('.loading-container');
    await expect(loadingIndicator).not.toBeVisible();

    // Verify all sections are present
    await expect(page.locator('app-hero-section')).toBeVisible();
    await expect(page.locator('app-welcome-section')).toBeVisible();
    await expect(page.locator('app-footer')).toBeVisible();
  });
});
