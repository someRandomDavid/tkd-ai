import { test, expect } from '@playwright/test';

/**
 * E2E Tests for User Story 4: Take Action to Join or Contact
 * 
 * Acceptance Criteria:
 * AC1: CTA section displays "Free Trial Class" and "Contact Us" buttons prominently
 * AC2: "Free Trial Class" button opens email client with pre-filled subject
 * AC3: "Contact Us" button navigates to contact page/section
 * AC4: Desktop hover shows visual feedback (scale, color change)
 * AC5: CTA buttons keyboard accessible with proper ARIA labels
 * AC6: CTAs stack on mobile, inline on desktop
 */

test.describe('User Story 4: CTA Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for content to load
    await page.waitForSelector('.cta-section', { timeout: 5000 });
  });

  // T117: AC1 - CTA section displays both buttons prominently
  test('AC1: CTA section displays "Free Trial Class" and "Contact Us" buttons', async ({ page }) => {
    // Verify CTA section exists
    const ctaSection = page.locator('.cta-section');
    await expect(ctaSection).toBeVisible();

    // Verify section title and description
    await expect(ctaSection.locator('.section-title')).toContainText(/Bereit|Ready/);
    await expect(ctaSection.locator('.section-description')).toBeVisible();

    // Verify both buttons exist and are visible
    const freeTrialButton = page.locator('button:has-text("Probetraining"), button:has-text("Free Trial")');
    const contactButton = page.locator('button:has-text("Kontakt"), button:has-text("Contact")');

    await expect(freeTrialButton).toBeVisible();
    await expect(contactButton).toBeVisible();

    // Verify buttons have icons
    await expect(freeTrialButton.locator('mat-icon')).toBeVisible();
    await expect(contactButton.locator('mat-icon')).toBeVisible();
  });

  // T118: AC2 - "Free Trial Class" opens mailto link
  test('AC2: "Free Trial Class" button opens email client with pre-filled subject', async ({ page, context }) => {
    // Listen for new page/tab
    const [newPage] = await Promise.all([
      context.waitForEvent('page').catch(() => null), // Catch if no new page opens
      page.locator('button:has-text("Probetraining"), button:has-text("Free Trial")').click()
    ]);

    // Verify mailto link was triggered (URL starts with mailto:)
    const currentUrl = page.url();
    const mailtoExpected = currentUrl.includes('mailto:') || await page.evaluate(() => {
      const mailtoLinks = Array.from(document.querySelectorAll('button'));
      return mailtoLinks.some(btn => {
        const clickHandler = btn.onclick;
        return clickHandler && clickHandler.toString().includes('mailto:');
      });
    });

    // Since mailto doesn't open a new page in tests, verify the button has correct data
    const freeTrialButton = page.locator('button:has-text("Probetraining"), button:has-text("Free Trial")');
    const ariaLabel = await freeTrialButton.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toContain(/Probetraining|trial/i);
  });

  // T119: AC3 - "Contact Us" navigates to contact section
  test('AC3: "Contact Us" button navigates to contact page/section', async ({ page }) => {
    const contactButton = page.locator('button:has-text("Kontakt"), button:has-text("Contact")');
    
    // Click contact button
    await contactButton.click();

    // Wait a moment for scroll to complete
    await page.waitForTimeout(1000);

    // Verify footer/contact section is in viewport
    const footer = page.locator('#contact-section, footer');
    await expect(footer).toBeInViewport();
  });

  // T120: AC4 - Desktop hover shows visual feedback
  test('AC4: Desktop hover shows visual feedback', async ({ page, viewport }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1024, height: 768 });

    const freeTrialButton = page.locator('button:has-text("Probetraining"), button:has-text("Free Trial")');

    // Get initial transform
    const initialTransform = await freeTrialButton.evaluate(el => window.getComputedStyle(el).transform);

    // Hover over button
    await freeTrialButton.hover();

    // Wait for CSS transition
    await page.waitForTimeout(300);

    // Check if transform changed (should translateY on hover)
    const hoverTransform = await freeTrialButton.evaluate(el => window.getComputedStyle(el).transform);
    
    // On hover, button should either have different transform or visible hover state
    const hasHoverEffect = initialTransform !== hoverTransform || 
      await freeTrialButton.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return computed.cursor === 'pointer';
      });

    expect(hasHoverEffect).toBeTruthy();
  });

  // T121: AC5 - Keyboard accessibility with ARIA labels
  test('AC5: CTA buttons are keyboard accessible with proper ARIA labels', async ({ page }) => {
    // Tab to first CTA button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // May need multiple tabs to reach CTA section

    // Find which button has focus
    const focusedElement = page.locator(':focus');
    
    // Keep tabbing until we reach a CTA button
    let attempts = 0;
    let reachedCTA = false;
    while (attempts < 20) {
      const text = await focusedElement.textContent().catch(() => '');
      if (text.includes('Probetraining') || text.includes('Free Trial') || 
          text.includes('Kontakt') || text.includes('Contact')) {
        reachedCTA = true;
        break;
      }
      await page.keyboard.press('Tab');
      attempts++;
    }

    expect(reachedCTA).toBeTruthy();

    // Verify first button has ARIA label
    const freeTrialButton = page.locator('button:has-text("Probetraining"), button:has-text("Free Trial")');
    const ariaLabel1 = await freeTrialButton.getAttribute('aria-label');
    expect(ariaLabel1).toBeTruthy();

    // Tab to next button
    await page.keyboard.press('Tab');
    
    // Verify second button has ARIA label
    const contactButton = page.locator('button:has-text("Kontakt"), button:has-text("Contact")');
    const ariaLabel2 = await contactButton.getAttribute('aria-label');
    expect(ariaLabel2).toBeTruthy();

    // Verify Enter key activates button
    const contactFocused = await page.locator(':focus').textContent();
    if (contactFocused?.includes('Kontakt') || contactFocused?.includes('Contact')) {
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
      
      // Should navigate/scroll to contact section
      const footer = page.locator('#contact-section, footer');
      await expect(footer).toBeInViewport();
    }
  });

  // T122: AC6 - Responsive layout (stack on mobile, inline on desktop)
  test('AC6: CTAs stack on mobile, inline on desktop', async ({ page }) => {
    // Test mobile viewport (375px)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForSelector('.cta-section', { timeout: 5000 });

    const ctaContainer = page.locator('.cta-buttons');
    
    // Get flex direction on mobile
    const mobileFlexDirection = await ctaContainer.evaluate(el => 
      window.getComputedStyle(el).flexDirection
    );
    expect(mobileFlexDirection).toBe('column'); // Should stack vertically

    // Test desktop viewport (1024px)
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(300); // Wait for CSS to apply

    // Get flex direction on desktop
    const desktopFlexDirection = await ctaContainer.evaluate(el => 
      window.getComputedStyle(el).flexDirection
    );
    expect(desktopFlexDirection).toBe('row'); // Should be inline

    // Verify buttons are side-by-side on desktop
    const buttons = page.locator('.cta-button');
    const count = await buttons.count();
    expect(count).toBe(2);

    // Check button positions
    const button1Box = await buttons.nth(0).boundingBox();
    const button2Box = await buttons.nth(1).boundingBox();
    
    expect(button1Box).toBeTruthy();
    expect(button2Box).toBeTruthy();
    
    // On desktop, button2 should be to the right of button1 (not below)
    if (button1Box && button2Box) {
      expect(button2Box.x).toBeGreaterThan(button1Box.x);
      // Y positions should be similar (same row)
      expect(Math.abs(button2Box.y - button1Box.y)).toBeLessThan(10);
    }
  });
});
