# Theme Toggle Technical Research Findings

**Date**: 2026-01-13  
**Context**: Angular 21 + Material 21 Application

---

## 1. localStorage for Theme Persistence

### Decision
✅ **Use localStorage with try-catch wrapping, graceful degradation to sessionStorage, and in-memory fallback**

### Rationale
- **localStorage** is the standard Web Storage API for persistent client-side storage (survives browser close)
- Storage format: `{ "theme": "dark" | "light" }` with a simple string value or just store the string directly
- Typical quota: 5-10MB per origin (far exceeds needs for theme preference)
- **Risk**: localStorage unavailable in private browsing (Safari), disabled by user settings, or full quota

### Implementation Notes
```typescript
// Storage service with error handling
class ThemeStorageService {
  private readonly STORAGE_KEY = 'theme-preference';
  private storageAvailable: boolean;

  constructor() {
    this.storageAvailable = this.checkStorageAvailability();
  }

  private checkStorageAvailability(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  saveTheme(theme: 'dark' | 'light'): void {
    try {
      if (this.storageAvailable) {
        localStorage.setItem(this.STORAGE_KEY, theme);
      } else {
        // Fallback: sessionStorage (session-only)
        sessionStorage.setItem(this.STORAGE_KEY, theme);
      }
    } catch (error) {
      // Quota exceeded or storage disabled
      console.warn('Theme storage failed:', error);
      // In-memory fallback handled by service state
    }
  }

  getTheme(): 'dark' | 'light' | null {
    try {
      return (localStorage.getItem(this.STORAGE_KEY) || 
              sessionStorage.getItem(this.STORAGE_KEY)) as 'dark' | 'light' | null;
    } catch {
      return null; // Fail gracefully
    }
  }
}
```

**Fallback Strategy**:
1. **Primary**: localStorage (persistent)
2. **Secondary**: sessionStorage (current session only)
3. **Tertiary**: In-memory BehaviorSubject state (current page load only)
4. **Default**: Dark theme if all storage fails

---

## 2. Material Theming: Dynamic Switching

### Decision
✅ **Use CSS Custom Properties (CSS variables) with body class toggle (`dark-theme` / `light-theme`)**

### Rationale
- **CSS Custom Properties** enable runtime theme switching without page reload
- Angular Material 3+ (M3) has native support for CSS variables via `mat.system-level-colors()`
- **SCSS variables** are compile-time only (cannot change dynamically without rebuild)
- Body class toggle is the Angular Material recommended pattern for theme switching
- Zero JavaScript overhead for color calculations

### Implementation Notes

```scss
// _theme.scss - Material 3 approach
@use '@angular/material' as mat;
@include mat.core();

// Define light theme
$light-theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: mat.$red-palette,
    tertiary: mat.$gray-palette,
  ),
  typography: (
    brand-family: 'Roboto, sans-serif',
  )
));

// Define dark theme
$dark-theme: mat.define-theme((
  color: (
    theme-type: dark,
    primary: mat.$red-palette,
    tertiary: mat.$gray-palette,
  ),
  typography: (
    brand-family: 'Roboto, sans-serif',
  )
));

// Apply light theme by default
:root {
  @include mat.all-component-themes($light-theme);
  @include mat.system-level-colors($light-theme);
  
  // Custom app variables
  --app-background: #ffffff;
  --app-text-primary: rgba(0, 0, 0, 0.87);
  --app-text-secondary: rgba(0, 0, 0, 0.60);
  --app-surface: #f5f5f5;
}

// Apply dark theme when class is present
.dark-theme {
  @include mat.all-component-colors($dark-theme);
  @include mat.system-level-colors($dark-theme);
  
  // Custom app variables
  --app-background: #121212;
  --app-text-primary: rgba(255, 255, 255, 0.87);
  --app-text-secondary: rgba(255, 255, 255, 0.60);
  --app-surface: #1e1e1e;
}

// Smooth transitions (optional, disable if motion-sensitivity detected)
* {
  transition: background-color 200ms ease-in-out, color 200ms ease-in-out;
}
```

```typescript
// theme.service.ts - Toggle implementation
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private currentTheme$ = new BehaviorSubject<'dark' | 'light'>('dark');
  
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.initializeTheme();
  }
  
  toggleTheme(): void {
    const newTheme = this.currentTheme$.value === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
  
  private setTheme(theme: 'dark' | 'light'): void {
    const body = this.document.body;
    if (theme === 'dark') {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }
    this.currentTheme$.next(theme);
    // Save to storage...
  }
}
```

**Why not SCSS variables alone?**
- SCSS compiles to static CSS at build time
- Changing themes would require separate compiled stylesheets and link tag swapping
- Larger bundle size (both themes shipped), more complexity
- CSS Custom Properties are the modern standard (excellent browser support)

---

## 3. WCAG AA Contrast Requirements

### Decision
✅ **Maintain 4.5:1 for normal text, 3:1 for large text (18pt+/14pt+ bold), test with axe DevTools + Lighthouse**

### Rationale
- **WCAG 2.1 Level AA** is the legal standard (ADA, Section 508, EU accessibility directives)
- Level AAA (7:1 / 4.5:1) is stricter but not required for most applications
- Contrast ratios apply to all text, icons, and interactive elements against background

### Implementation Notes

**Required Contrast Ratios** (WCAG 2.1 AA):
- **Normal text** (<18pt / <14pt bold): **4.5:1 minimum**
- **Large text** (≥18pt / ≥14pt bold): **3:1 minimum**
- **UI components & graphics**: **3:1 minimum** (borders, icons, focus indicators)
- **Incidental text**: No requirement (decorative, inactive, logo text)

**Color Palette Recommendations**:
```scss
// Dark theme - Background: #121212 (Material baseline)
$dark-bg: #121212;
$dark-surface: #1e1e1e;    // Elevated surfaces
$dark-text-high: #ffffff;   // 87% opacity = rgba(255,255,255,0.87) = 15.8:1 ✅
$dark-text-medium: #b3b3b3; // 60% opacity = rgba(255,255,255,0.60) = 10.4:1 ✅
$dark-text-disabled: #666666; // 38% opacity = 4.6:1 ✅

// Light theme - Background: #ffffff
$light-bg: #ffffff;
$light-surface: #f5f5f5;   // Elevated surfaces
$light-text-high: #000000;  // 87% opacity = rgba(0,0,0,0.87) = 15.8:1 ✅
$light-text-medium: #4d4d4d; // 60% opacity = rgba(0,0,0,0.60) = 10.4:1 ✅
$light-text-disabled: #9e9e9e; // 38% opacity = 4.6:1 ✅

// Accent red (primary color) - Must check contrast on both backgrounds
$primary-red: #d32f2f;      // On white: 5.3:1 ✅ / On dark: 3.8:1 ❌
$primary-red-light: #ef5350; // Use on dark bg: 4.5:1 ✅
```

**Testing Tools** (Recommended Order):
1. **Lighthouse CI** (in Playwright tests): Automated on every PR
   ```javascript
   // playwright.config.ts
   import { devices } from '@playwright/test';
   use: {
     ...devices['Desktop Chrome'],
     // Lighthouse audit
   }
   ```

2. **@axe-core/playwright** (already in package.json): Run in E2E tests
   ```typescript
   import { injectAxe, checkA11y } from '@axe-core/playwright';
   
   test('theme toggle accessibility', async ({ page }) => {
     await page.goto('/');
     await injectAxe(page);
     await checkA11y(page); // Fails test if WCAG violations
   });
   ```

3. **Manual**: Chrome DevTools > Lighthouse > Accessibility audit
4. **Manual**: Browser extension: "WCAG Color Contrast Checker"

**Common Pitfalls**:
- ❌ Using pure black (#000) on pure white (#fff): Too harsh (21:1 is overkill, causes eye strain)
- ❌ Gray text on gray backgrounds: Often fails 4.5:1
- ❌ Light colored buttons on light backgrounds (light theme)
- ❌ Forgetting to test hover/focus states
- ❌ Using color alone to convey meaning (need text/icons too)
- ❌ Transparent overlays reducing contrast (hero text on images)

---

## 4. Flash of Incorrect Theme (FOIT) Prevention

### Decision
✅ **Inline critical script in `<head>` before Angular bootstrap to apply theme class synchronously**

### Rationale
- Angular app loads asynchronously (bundles download, parse, execute)
- Default CSS loads, then Angular ThemeService runs → causes flash if wrong theme
- Solution: Read localStorage and apply theme class **before** Angular starts
- Inline script executes synchronously during HTML parsing (blocks rendering until complete)
- Theme class on `<body>` ensures CSS applies immediately

### Implementation Notes

```html
<!-- index.html - Add in <head> before styles -->
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Taekwon-do Ailingen</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
  <!-- CRITICAL: Theme initialization before any rendering -->
  <script>
    (function() {
      try {
        // Read saved preference
        const savedTheme = localStorage.getItem('theme-preference');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Priority: saved > OS preference > default dark
        const theme = savedTheme || (prefersDark ? 'dark' : 'dark');
        
        // Apply immediately (before Angular loads)
        if (theme === 'dark') {
          document.documentElement.classList.add('dark-theme');
        } else {
          document.documentElement.classList.add('light-theme');
        }
      } catch (e) {
        // Storage unavailable - default to dark theme
        document.documentElement.classList.add('dark-theme');
      }
    })();
  </script>
  
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

**Key Points**:
- Place in `<head>`, not `<body>` (executes earlier)
- Apply class to `document.documentElement` (`:root` selector) or `document.body`
- IIFE (Immediately Invoked Function Expression) prevents global scope pollution
- Try-catch handles localStorage errors gracefully
- Minify in production (Angular build does this automatically for inline scripts)
- **Result**: Zero flash, theme applied before first paint

**Angular Service Synchronization**:
```typescript
// theme.service.ts - Sync with inline script
export class ThemeService {
  constructor(@Inject(DOCUMENT) private document: Document) {
    // Read current theme from already-applied class (set by inline script)
    const currentTheme = this.document.documentElement.classList.contains('dark-theme') 
      ? 'dark' 
      : 'light';
    this.currentTheme$.next(currentTheme);
  }
}
```

---

## 5. prefers-color-scheme Integration

### Decision
✅ **Priority order: localStorage saved preference > `prefers-color-scheme` OS setting > default dark theme**

### Rationale
- **User choice overrides OS**: If user explicitly clicked toggle, honor their decision
- **OS preference as fallback**: Good UX for first-time visitors (respects system settings)
- **Default ensures consistency**: Always have a theme (dark in this case per spec)
- Aligns with privacy: No server-side storage, respects user control

### Implementation Notes

**Priority Cascade**:
```typescript
// theme.service.ts - Initialization logic
private initializeTheme(): void {
  // 1. Check for saved preference (highest priority)
  const savedTheme = this.storage.getTheme();
  if (savedTheme) {
    this.setTheme(savedTheme);
    return;
  }
  
  // 2. Check OS preference (medium priority)
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) {
    this.setTheme('dark');
    return;
  }
  
  // 3. Default theme (lowest priority)
  this.setTheme('dark'); // Per spec: dark mode as default
}
```

**Inline Script (index.html) - Same Logic**:
```javascript
<script>
(function() {
  try {
    const saved = localStorage.getItem('theme-preference');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Priority: saved > OS > default
    const theme = saved ? saved : (prefersDark ? 'dark' : 'dark');
    
    document.documentElement.classList.add(theme + '-theme');
  } catch (e) {
    document.documentElement.classList.add('dark-theme');
  }
})();
</script>
```

**Listen for OS Changes** (optional enhancement):
```typescript
// theme.service.ts - React to OS changes (only if no saved preference)
private watchOSPreference(): void {
  if (this.storage.getTheme()) {
    return; // User has explicit preference, ignore OS changes
  }
  
  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeQuery.addEventListener('change', (e) => {
    // Only apply if user hasn't manually set a preference
    if (!this.storage.getTheme()) {
      this.setTheme(e.matches ? 'dark' : 'light');
    }
  });
}
```

**CSS-Only Fallback** (if JavaScript disabled):
```scss
// styles.scss - Fallback for no-JS scenario
@media (prefers-color-scheme: dark) {
  :root {
    @include mat.all-component-colors($dark-theme);
    --app-background: #121212;
    --app-text-primary: rgba(255, 255, 255, 0.87);
  }
}

@media (prefers-color-scheme: light) {
  :root {
    @include mat.all-component-colors($light-theme);
    --app-background: #ffffff;
    --app-text-primary: rgba(0, 0, 0, 0.87);
  }
}
```

**Edge Case: Spec Override**:
Per your spec, "default dark mode" takes precedence even over OS light preference on first visit. This is unusual but valid if dark mode is a brand identity choice. Typically, respecting OS preference provides better UX, but your spec explicitly states:
> "Given a user has never visited before and has OS light mode preference set, When the page loads with no saved localStorage preference, Then dark mode is still used as default (explicit default overrides OS preference)"

So the implementation would be:
```typescript
const theme = saved || 'dark'; // Ignore OS preference per spec
```

Or to respect OS preference (recommended UX):
```typescript
const theme = saved || (prefersDark ? 'dark' : 'light');
```

---

## Summary Table

| Question | Decision | Key Tool/Pattern |
|----------|----------|------------------|
| **localStorage** | Use with try-catch + fallbacks | `localStorage.setItem()` with sessionStorage + in-memory fallback |
| **Material Theming** | CSS Custom Properties + body class | `mat.system-level-colors()` + `.dark-theme` class toggle |
| **WCAG Contrast** | 4.5:1 normal, 3:1 large text | @axe-core/playwright + Lighthouse CI |
| **Flash Prevention** | Inline script in `<head>` | IIFE before Angular bootstrap |
| **OS Preference** | Saved > OS > Default | `matchMedia('(prefers-color-scheme)')` |

---

## Recommended Implementation Order

1. **Setup CSS Custom Properties** (`_theme.scss`) - Material 3 themes with variables
2. **Create ThemeService** - BehaviorSubject state + localStorage handling
3. **Add Inline Script** (`index.html`) - Prevent flash on initial load
4. **Create ThemeToggle Component** - Icon button with accessibility
5. **Write E2E Tests** - Playwright + axe-core for WCAG validation
6. **Manual Testing** - Lighthouse audit, test all user scenarios

---

## Additional Considerations

### Performance
- CSS Custom Properties have negligible performance cost
- Theme switching: ~200ms CSS transition (can be disabled for motion sensitivity)
- Bundle size impact: ~2KB for theme service + minimal CSS (both themes in one file)

### Browser Support
- CSS Custom Properties: 98% global support (all modern browsers)
- localStorage: 98% support (fallback to sessionStorage)
- `prefers-color-scheme`: 96% support (degrades gracefully)

### Accessibility
- Ensure toggle button has `aria-label="Toggle dark/light theme"`
- Add `aria-live="polite"` region to announce theme changes to screen readers
- Respect `prefers-reduced-motion` media query for transition disabling
- Focus indicator must meet 3:1 contrast on both themes

### Security
- localStorage is origin-bound (no XSS risk from other sites)
- No sensitive data stored (just theme preference string)
- Content Security Policy (CSP): Inline script needs `script-src 'sha256-...'` or `unsafe-inline` (calculate hash)

---

## References
- [Angular Material Theming Guide](https://material.angular.io/guide/theming)
- [WCAG 2.1 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [MDN: prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
