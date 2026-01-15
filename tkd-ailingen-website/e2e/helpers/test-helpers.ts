import { Page, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E test helpers for common actions and assertions
 * Promotes DRY principle and consistent testing patterns
 */

/**
 * Navigation helpers
 */
export async function navigateToHomePage(page: Page): Promise<void> {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
}

export async function waitForHydration(page: Page): Promise<void> {
  // Wait for Angular to be bootstrapped (SSR hydration complete)
  await page.waitForFunction(() => {
    return (window as any).ng !== undefined;
  });
}

/**
 * Accessibility testing helper
 * Runs axe-core accessibility audit on current page
 * @param page Playwright Page object
 * @param excludeSelectors Optional array of selectors to exclude from scan
 */
export async function checkAccessibility(
  page: Page,
  excludeSelectors?: string[]
): Promise<void> {
  let axeBuilder = new AxeBuilder({ page });

  if (excludeSelectors) {
    excludeSelectors.forEach((selector) => {
      axeBuilder = axeBuilder.exclude(selector);
    });
  }

  const accessibilityScanResults = await axeBuilder.analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
}

/**
 * Visual regression helpers
 */
export async function takeScreenshot(
  page: Page,
  name: string,
  fullPage = false
): Promise<void> {
  await expect(page).toHaveScreenshot(`${name}.png`, {
    fullPage,
    maxDiffPixels: 100,
  });
}

/**
 * Content assertion helpers
 */
export async function expectVisibleText(
  page: Page,
  text: string | RegExp
): Promise<void> {
  await expect(page.getByText(text)).toBeVisible();
}

export async function expectHeading(
  page: Page,
  text: string | RegExp,
  level?: number
): Promise<void> {
  const selector = level ? `h${level}` : 'h1, h2, h3, h4, h5, h6';
  await expect(page.locator(selector).filter({ hasText: text })).toBeVisible();
}

/**
 * Interactive element helpers
 */
export async function clickButton(page: Page, text: string | RegExp): Promise<void> {
  await page.getByRole('button', { name: text }).click();
}

export async function clickLink(page: Page, text: string | RegExp): Promise<void> {
  await page.getByRole('link', { name: text }).click();
}

/**
 * Form helpers
 */
export async function fillInput(
  page: Page,
  label: string | RegExp,
  value: string
): Promise<void> {
  await page.getByLabel(label).fill(value);
}

/**
 * Mobile-specific helpers
 */
export async function isMobileViewport(page: Page): Promise<boolean> {
  const viewport = page.viewportSize();
  return viewport ? viewport.width < 768 : false;
}

export async function openMobileMenu(page: Page): Promise<void> {
  const menuButton = page.getByRole('button', { name: /menu|navigation/i });
  await menuButton.click();
}

/**
 * Language/Translation helpers
 */
export async function switchLanguage(page: Page, lang: 'de' | 'en'): Promise<void> {
  const langButton = page.getByRole('button', { name: new RegExp(lang, 'i') });
  await langButton.click();
  // Wait for translations to load
  await page.waitForTimeout(500);
}

/**
 * Performance helpers
 */
export async function measurePageLoad(page: Page): Promise<number> {
  const navigationTiming = await page.evaluate(() =>
    JSON.stringify(window.performance.timing)
  );
  const timing = JSON.parse(navigationTiming);
  return timing.loadEventEnd - timing.navigationStart;
}

/**
 * Scroll helpers
 */
export async function scrollToSection(page: Page, sectionId: string): Promise<void> {
  await page.locator(`#${sectionId}`).scrollIntoViewIfNeeded();
  await page.waitForTimeout(300); // Allow for smooth scroll animation
}
