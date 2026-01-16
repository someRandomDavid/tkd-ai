# Quickstart Guide: Dark/Light Theme Toggle

**Feature**: 002-theme-toggle  
**Date**: 2026-01-13

## Overview

This feature implements a dark/light theme toggle with:
- Dark theme as default
- Persistent user preference (localStorage)
- Zero-flash initialization (inline script)
- Material Design integration
- WCAG AA compliant contrast ratios
- <10ms theme switching performance

---

## For Developers

### 1. Using ThemeService

#### Basic Usage

```typescript
import { Component, OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-my-component',
  template: `
    <div class="themed-container">
      <p>Current theme: {{ currentTheme }}</p>
      <button (click)="toggleTheme()">Toggle Theme</button>
    </div>
  `
})
export class MyComponent implements OnInit {
  currentTheme: 'dark' | 'light' = 'dark';
  
  constructor(private themeService: ThemeService) {}
  
  ngOnInit() {
    // Get current theme
    this.currentTheme = this.themeService.getCurrentTheme();
    
    // Listen for theme changes
    this.themeService.themeChanged$.subscribe(theme => {
      this.currentTheme = theme;
      console.log('Theme changed to:', theme);
    });
  }
  
  toggleTheme() {
    const newTheme = this.themeService.toggleTheme();
    console.log('Toggled to:', newTheme);
  }
  
  setSpecificTheme() {
    const success = this.themeService.setTheme('light');
    if (!success) {
      console.error('Failed to apply theme');
    }
  }
}
```

#### In AppComponent (Initialization)

```typescript
// app.component.ts
import { Component, OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet />'
})
export class AppComponent implements OnInit {
  constructor(private themeService: ThemeService) {}
  
  ngOnInit() {
    // Initialize theme on app startup
    const initialTheme = this.themeService.initializeTheme();
    console.log('App initialized with theme:', initialTheme);
  }
}
```

---

### 2. Adding ThemeToggle Component

#### In Header/Navigation

```typescript
// header.component.ts
import { Component } from '@angular/core';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ThemeToggleComponent],
  template: `
    <header>
      <nav>
        <a routerLink="/">Home</a>
        <a routerLink="/trainers">Trainers</a>
        
        <!-- Add theme toggle button -->
        <app-theme-toggle 
          (themeChanged)="onThemeChange($event)">
        </app-theme-toggle>
      </nav>
    </header>
  `
})
export class HeaderComponent {
  onThemeChange(theme: 'dark' | 'light') {
    console.log('Theme changed to:', theme);
    // Optional: trigger animations, analytics, etc.
  }
}
```

#### Standalone Usage

```html
<!-- Any template -->
<app-theme-toggle />

<!-- With event handler -->
<app-theme-toggle (themeChanged)="handleThemeChange($event)" />

<!-- With custom styling -->
<app-theme-toggle class="custom-position" />
```

---

### 3. Defining Theme-Aware Colors

#### Component-Specific SCSS

```scss
// my-component.component.scss

.themed-container {
  // Use CSS custom properties
  background-color: var(--surface-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.card {
  background-color: var(--surface-card);
  color: var(--text-primary);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  // Light theme override
  :host-context(.light-theme) & {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
}

.primary-button {
  background-color: var(--primary-main);
  color: var(--text-primary);
  
  &:hover {
    background-color: var(--primary-dark);
  }
}
```

#### Global Theme Variables

```scss
// styles/_themes.scss

:root {
  // Dark theme (default) - Black/White/Red palette
  --surface-bg: #000000;        // Pure black
  --surface-card: #1a1a1a;      // Very dark gray
  --text-primary: #ffffff;      // White
  --text-secondary: #b3b3b3;    // Light gray
  --primary-main: #dc143c;      // Crimson red
  --accent-main: #ff6b6b;       // Coral red
}

body.light-theme {
  // Light theme overrides - Black/White/Red palette
  --surface-bg: #ffffff;        // Pure white
  --surface-card: #f5f5f5;      // Very light gray
  --text-primary: #000000;      // Black
  --text-secondary: #4d4d4d;    // Dark gray
  --primary-main: #c81e1e;      // Strong red
  --accent-main: #d32f2f;       // Red accent
}
```

#### Material Component Theming

```scss
// styles.scss
@use '@angular/material' as mat;

// Define palettes (using red-based colors)
$dark-primary: mat.define-palette(mat.$red-palette);
$dark-accent: mat.define-palette(mat.$red-palette, A200);
$dark-theme: mat.define-dark-theme((
  color: (
    primary: $dark-primary,
    accent: $dark-accent,
  )
));

$light-primary: mat.define-palette(mat.$red-palette, 700);
$light-accent: mat.define-palette(mat.$red-palette, 500);
$light-theme: mat.define-light-theme((
  color: (
    primary: $light-primary,
    accent: $light-accent,
  )
));

// Apply dark theme by default
@include mat.all-component-themes($dark-theme);

// Apply light theme when class present
.light-theme {
  @include mat.all-component-colors($light-theme);
}
```

---

### 4. Testing Themes

#### Manual Testing Checklist

- [ ] Toggle switches between dark and light
- [ ] Preference persists after page reload
- [ ] No flash of wrong theme on initial load
- [ ] All text meets WCAG AA contrast (4.5:1 normal, 3:1 large)
- [ ] Theme applies to all pages/components
- [ ] Toggle button shows correct icon (sun/moon)
- [ ] Touch target is ≥44px on mobile
- [ ] Keyboard accessible (Tab + Enter/Space)
- [ ] Screen reader announces current mode

#### Unit Tests

```typescript
// theme.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
    localStorage.clear();
  });
  
  it('should default to dark theme', () => {
    const theme = service.initializeTheme();
    expect(theme).toBe('dark');
  });
  
  it('should toggle between themes', () => {
    service.setTheme('dark');
    const newTheme = service.toggleTheme();
    expect(newTheme).toBe('light');
    
    const anotherToggle = service.toggleTheme();
    expect(anotherToggle).toBe('dark');
  });
  
  it('should persist theme to localStorage', () => {
    service.setTheme('light');
    const stored = localStorage.getItem('theme-preference');
    expect(stored).toBe('light');
  });
  
  it('should load theme from localStorage', () => {
    localStorage.setItem('theme-preference', 'light');
    const theme = service.initializeTheme();
    expect(theme).toBe('light');
  });
  
  it('should emit theme changes', (done) => {
    service.themeChanged$.subscribe(theme => {
      expect(theme).toBe('light');
      done();
    });
    service.setTheme('light');
  });
  
  it('should apply light-theme class to body', () => {
    service.setTheme('light');
    expect(document.body.classList.contains('light-theme')).toBe(true);
    
    service.setTheme('dark');
    expect(document.body.classList.contains('light-theme')).toBe(false);
  });
});
```

#### E2E Tests

```typescript
// theme.e2e.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  
  test('should toggle theme on button click', async ({ page }) => {
    // Initial theme should be dark
    const body = page.locator('body');
    await expect(body).not.toHaveClass(/light-theme/);
    
    // Click toggle button
    await page.click('[data-testid="theme-toggle"]');
    
    // Should switch to light
    await expect(body).toHaveClass(/light-theme/);
    
    // Click again
    await page.click('[data-testid="theme-toggle"]');
    
    // Should switch back to dark
    await expect(body).not.toHaveClass(/light-theme/);
  });
  
  test('should persist theme across page reloads', async ({ page }) => {
    // Set to light theme
    await page.click('[data-testid="theme-toggle"]');
    await expect(page.locator('body')).toHaveClass(/light-theme/);
    
    // Reload page
    await page.reload();
    
    // Should still be light
    await expect(page.locator('body')).toHaveClass(/light-theme/);
  });
  
  test('should have no theme flash on initial load', async ({ page }) => {
    // Set theme to light
    await page.evaluate(() => {
      localStorage.setItem('theme-preference', 'light');
    });
    
    // Navigate to page
    await page.goto('/');
    
    // Body should have light-theme class immediately
    const body = page.locator('body');
    await expect(body).toHaveClass(/light-theme/);
  });
  
  test('should meet WCAG AA contrast requirements', async ({ page }) => {
    // Test both themes for contrast violations
    await page.click('[data-testid="theme-toggle"]');
    
    const results = await page.evaluate(async () => {
      // @ts-ignore - axe-core loaded in test setup
      return await axe.run();
    });
    
    const contrastViolations = results.violations.filter(
      v => v.id === 'color-contrast'
    );
    
    expect(contrastViolations).toHaveLength(0);
  });
});
```

#### Accessibility Testing

```typescript
// theme-toggle.a11y.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Theme Toggle Accessibility', () => {
  test('should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Tab to toggle button
    await page.keyboard.press('Tab');
    const toggle = page.locator('[data-testid="theme-toggle"]');
    await expect(toggle).toBeFocused();
    
    // Activate with Enter
    await page.keyboard.press('Enter');
    await expect(page.locator('body')).toHaveClass(/light-theme/);
    
    // Activate with Space
    await page.keyboard.press('Space');
    await expect(page.locator('body')).not.toHaveClass(/light-theme/);
  });
  
  test('should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('[data-testid="theme-toggle"]');
    
    // Should have aria-label
    const label = await toggle.getAttribute('aria-label');
    expect(label).toContain('mode');
    
    // Should have role="button" (if not <button>)
    const role = await toggle.getAttribute('role');
    expect(role === 'button' || await toggle.evaluate(el => el.tagName === 'BUTTON')).toBeTruthy();
  });
  
  test('should announce theme change to screen readers', async ({ page }) => {
    await page.goto('/');
    
    // Click toggle
    await page.click('[data-testid="theme-toggle"]');
    
    // Check for live region announcement
    const announcement = page.locator('[aria-live="polite"]');
    await expect(announcement).toContainText(/light mode|theme/i);
  });
});
```

---

### 5. Adding New Theme Variables

#### Step 1: Define in `_themes.scss`

```scss
:root {
  // Existing variables...
  
  // New variable
  --new-surface: #2a2a2a;
}

body.light-theme {
  // Existing overrides...
  
  // New override
  --new-surface: #e0e0e0;
}
```

#### Step 2: Use in Components

```scss
.my-new-component {
  background-color: var(--new-surface);
}
```

#### Step 3: Document in `data-model.md`

Add to CSS Custom Properties section.

---

### 6. Troubleshooting

#### Theme Flash on Load

**Problem**: Brief flash of dark theme before light theme loads

**Solution**: Ensure inline script in `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>TKD AI</title>
  
  <!-- CRITICAL: Theme initialization before Angular loads -->
  <script>
    (function() {
      try {
        const theme = localStorage.getItem('theme-preference');
        if (theme === 'light') {
          document.body.classList.add('light-theme');
        }
      } catch (e) {
        // Ignore localStorage errors
      }
    })();
  </script>
  
  <!-- Rest of head... -->
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

#### Theme Not Persisting

**Problem**: Theme resets to dark after page reload

**Solution**: Check localStorage in DevTools:
1. Open DevTools > Application tab
2. Check localStorage for `theme-preference` key
3. If missing, check for QuotaExceededError in console
4. Verify ThemeService calls `saveTheme()` on change

#### Low Contrast Warnings

**Problem**: WCAG violations in certain components

**Solution**: Use contrast checker tool:
```typescript
// Minimum ratios:
// Normal text (< 18pt): 4.5:1
// Large text (≥ 18pt or 14pt bold): 3:1
// UI components: 3:1

// Check in DevTools:
// Inspect element > Contrast ratio in color picker
```

#### Material Components Not Theming

**Problem**: Material buttons/cards don't change with theme

**Solution**: Ensure Material theme included:

```scss
// styles.scss
@use '@angular/material' as mat;

// IMPORTANT: Include both themes
@include mat.all-component-themes($dark-theme);

.light-theme {
  @include mat.all-component-colors($light-theme);
}
```

---

## For Content Editors

### Viewing Different Themes

1. Click the sun/moon icon in the top-right corner
2. Theme preference is saved automatically
3. Reload the page to verify it persists

### Checking Content in Both Themes

When adding new content (text, images, colors):

1. Toggle to **dark theme**
   - Verify text is readable (light on dark)
   - Check image borders/backgrounds work
   - Ensure custom colors have good contrast

2. Toggle to **light theme**
   - Verify text is readable (dark on light)
   - Check image borders/backgrounds work
   - Ensure custom colors have good contrast

3. Use contrast checker for custom colors:
   - https://webaim.org/resources/contrastchecker/
   - Enter foreground and background colors
   - Ensure ratio is ≥ 4.5:1 for normal text

---

## Implementation Checklist

- [ ] ThemeService created and provided in root
- [ ] ThemeToggleComponent created with ≥44px touch target
- [ ] Inline script added to `index.html` (flash prevention)
- [ ] CSS custom properties defined in `_themes.scss`
- [ ] Material theme configured for both dark/light
- [ ] ThemeService initialized in AppComponent
- [ ] ThemeToggle added to header/navigation
- [ ] All custom components use CSS variables
- [ ] Unit tests written for ThemeService
- [ ] E2E tests written for theme persistence
- [ ] Accessibility tests passing (keyboard, screen reader)
- [ ] WCAG AA contrast verified in both themes
- [ ] Manual testing complete (all pages)
- [ ] Documentation updated

---

## Performance Targets

- **Theme switch**: <10ms (measured from click to DOM update)
- **Initial load**: No visible flash (0ms delay)
- **Storage write**: <5ms (localStorage.setItem)
- **Storage read**: <1ms (localStorage.getItem)

**Measurement**:
```typescript
console.time('theme-switch');
this.themeService.setTheme('light');
console.timeEnd('theme-switch');
// Should log: theme-switch: 2.5ms
```

---

## Related Files

- **Service**: `src/app/services/theme.service.ts`
- **Component**: `src/app/components/theme-toggle/theme-toggle.component.ts`
- **Styles**: `src/styles/_themes.scss`
- **Index**: `src/index.html` (inline script)
- **Tests**: `src/app/services/theme.service.spec.ts`
- **E2E**: `e2e/theme.e2e.spec.ts`

---

## Support

For questions or issues:
1. Check research.md for technical decisions
2. Review data-model.md for data structures
3. See contracts/theme-service.interface.ts for API
4. Consult plan.md for architecture overview
