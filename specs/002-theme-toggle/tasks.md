# Implementation Tasks: Dark/Light Theme Toggle

**Feature**: 002-theme-toggle | **Branch**: `002-theme-toggle` | **Date**: 2026-01-13

## Overview

Break down implementation into granular, testable tasks. Each task should be completable in 15-60 minutes and independently verifiable.

**Estimated Total Time**: 8 hours

---

## Phase 0: Setup & Foundation (1 hour)

### T001: Create theme constants and types
**Estimate**: 15 min | **Priority**: P0 | **Dependencies**: None

Create type definitions and constants for theme system.

**Files**:
- `src/app/core/models/theme.types.ts` (new)

**Acceptance**:
- [ ] `ThemePreference` type defined as `'dark' | 'light'`
- [ ] `THEME_STORAGE_KEY` constant = `'theme-preference'`
- [ ] `DEFAULT_THEME` constant = `'dark'`
- [ ] `LIGHT_THEME_CLASS` constant = `'light-theme'`
- [ ] All types exported

**Test**: Import types in another file, TypeScript compiles without errors

---

### T002: Define CSS custom properties for dark theme
**Estimate**: 30 min | **Priority**: P0 | **Dependencies**: None

Create dark theme color palette using black/white/red scheme.

**Files**:
- `src/styles/_themes.scss` (new)

**Acceptance**:
- [ ] `:root` selector with dark theme CSS variables
- [ ] `--surface-bg: #000000` (pure black)
- [ ] `--surface-card: #1a1a1a` (dark gray)
- [ ] `--text-primary: #ffffff` (white)
- [ ] `--text-secondary: #b3b3b3` (light gray)
- [ ] `--primary-main: #dc143c` (crimson red)
- [ ] `--primary-light: #ff4757` (light red)
- [ ] `--primary-dark: #a00000` (dark red)
- [ ] `--border-color` and `--divider-color` defined

**Test**: Run `ng serve`, inspect `:root` in DevTools, verify variables exist

---

### T003: Define CSS custom properties for light theme
**Estimate**: 15 min | **Priority**: P0 | **Dependencies**: T002

Create light theme color palette using black/white/red scheme.

**Files**:
- `src/styles/_themes.scss` (update)

**Acceptance**:
- [ ] `body.light-theme` selector with light theme overrides
- [ ] `--surface-bg: #ffffff` (pure white)
- [ ] `--surface-card: #f5f5f5` (light gray)
- [ ] `--text-primary: #000000` (black)
- [ ] `--text-secondary: #4d4d4d` (dark gray)
- [ ] `--primary-main: #c81e1e` (strong red)
- [ ] All color variables overridden for light mode

**Test**: Add `light-theme` class to `<body>` manually, verify colors change

---

## Phase 1: ThemeService Implementation (2 hours)

### T004: Create ThemeService skeleton
**Estimate**: 20 min | **Priority**: P1 | **Dependencies**: T001

Create service with basic structure and dependency injection.

**Files**:
- `src/app/core/services/theme.service.ts` (new)
- `src/app/core/services/theme.service.spec.ts` (new)

**Acceptance**:
- [ ] `@Injectable({ providedIn: 'root' })` decorator
- [ ] Constructor defined
- [ ] Import theme types from T001
- [ ] Basic unit test file created with describe block

**Test**: `ng test` runs, ThemeService can be injected

---

### T005: Implement getCurrentTheme() method
**Estimate**: 15 min | **Priority**: P1 | **Dependencies**: T004

Add method to retrieve current theme state.

**Files**:
- `src/app/core/services/theme.service.ts` (update)
- `src/app/core/services/theme.service.spec.ts` (update)

**Acceptance**:
- [ ] `private themeSubject = new BehaviorSubject<ThemePreference>('dark')`
- [ ] `public readonly themeChanged$ = this.themeSubject.asObservable()`
- [ ] `getCurrentTheme(): ThemePreference` method returns `themeSubject.value`
- [ ] Unit test: defaults to 'dark'

**Test**: Unit test passes, service returns 'dark' by default

---

### T006: Implement setTheme() method with DOM manipulation
**Estimate**: 30 min | **Priority**: P1 | **Dependencies**: T005

Add method to apply theme by manipulating body class.

**Files**:
- `src/app/core/services/theme.service.ts` (update)
- `src/app/core/services/theme.service.spec.ts` (update)

**Acceptance**:
- [ ] `setTheme(theme: ThemePreference): void` method
- [ ] Adds/removes `light-theme` class on `document.body`
- [ ] Dark theme: remove class, Light theme: add class
- [ ] Emits new theme via `themeSubject.next(theme)`
- [ ] Unit test: body class updates correctly
- [ ] Unit test: themeChanged$ observable emits

**Test**: Call `setTheme('light')`, verify body has `light-theme` class

---

### T007: Implement localStorage persistence
**Estimate**: 30 min | **Priority**: P1 | **Dependencies**: T006

Add save/load methods with error handling.

**Files**:
- `src/app/core/services/theme.service.ts` (update)
- `src/app/core/services/theme.service.spec.ts` (update)

**Acceptance**:
- [ ] `private saveTheme(theme: ThemePreference): void` method
- [ ] Try-catch around `localStorage.setItem()`
- [ ] Fallback to sessionStorage if localStorage fails
- [ ] `private loadTheme(): ThemePreference` method
- [ ] Try-catch around `localStorage.getItem()`
- [ ] Returns DEFAULT_THEME if load fails
- [ ] Unit tests for save/load/error cases

**Test**: Call `setTheme()`, check localStorage in DevTools, reload and verify persistence

---

### T008: Implement toggleTheme() convenience method
**Estimate**: 10 min | **Priority**: P2 | **Dependencies**: T006

Add helper method to switch between themes.

**Files**:
- `src/app/core/services/theme.service.ts` (update)
- `src/app/core/services/theme.service.spec.ts` (update)

**Acceptance**:
- [ ] `toggleTheme(): ThemePreference` method
- [ ] If current is 'dark', set to 'light' and vice versa
- [ ] Returns new theme value
- [ ] Unit test: toggles correctly both directions

**Test**: Call toggle twice, verify returns to original theme

---

### T009: Implement initializeTheme() for app startup
**Estimate**: 15 min | **Priority**: P1 | **Dependencies**: T007

Add initialization method to load saved preference on app start.

**Files**:
- `src/app/core/services/theme.service.ts` (update)
- `src/app/core/services/theme.service.spec.ts` (update)

**Acceptance**:
- [ ] `initializeTheme(): ThemePreference` method
- [ ] Loads theme from localStorage
- [ ] Falls back to DEFAULT_THEME if none saved
- [ ] Calls `setTheme()` to apply
- [ ] Returns initialized theme
- [ ] Unit test: loads saved theme
- [ ] Unit test: defaults to dark if no saved theme

**Test**: Set localStorage manually, call `initializeTheme()`, verify theme applied

---

## Phase 2: ThemeToggle Component (1.5 hours)

### T010: Generate ThemeToggle component
**Estimate**: 10 min | **Priority**: P1 | **Dependencies**: T005

Create component files and basic structure.

**Files**:
- `src/app/shared/components/theme-toggle/` (new directory)

**Acceptance**:
- [ ] Run `ng generate component shared/components/theme-toggle --standalone`
- [ ] Component generated with .ts, .html, .scss, .spec.ts
- [ ] Component is standalone

**Test**: `ng build` succeeds, component can be imported

---

### T011: Implement ThemeToggle component logic
**Estimate**: 30 min | **Priority**: P1 | **Dependencies**: T010, T008

Add theme service integration and toggle logic.

**Files**:
- `src/app/shared/components/theme-toggle/theme-toggle.component.ts` (update)
- `src/app/shared/components/theme-toggle/theme-toggle.component.spec.ts` (update)

**Acceptance**:
- [ ] Inject ThemeService in constructor
- [ ] `currentTheme: ThemePreference` property
- [ ] Subscribe to `themeService.themeChanged$` in ngOnInit
- [ ] `onToggle()` method calls `themeService.toggleTheme()`
- [ ] `@Output() themeChanged = new EventEmitter<ThemePreference>()`
- [ ] Emit when theme changes
- [ ] Unit test: calls service on toggle
- [ ] Unit test: emits themeChanged event

**Test**: Unit tests pass, component toggles theme

---

### T012: Create ThemeToggle component template
**Estimate**: 20 min | **Priority**: P1 | **Dependencies**: T011

Build accessible button with icon and ARIA attributes.

**Files**:
- `src/app/shared/components/theme-toggle/theme-toggle.component.html` (update)

**Acceptance**:
- [ ] `<button>` element with `(click)="onToggle()"`
- [ ] `[attr.aria-label]` bound to descriptive text
- [ ] `mat-icon-button` directive
- [ ] `<mat-icon>` showing sun (light_mode) or moon (dark_mode)
- [ ] Icon changes based on `currentTheme`
- [ ] Data attribute `data-testid="theme-toggle"` for E2E

**Test**: Toggle button visible in browser, icon changes on click

---

### T013: Style ThemeToggle component
**Estimate**: 20 min | **Priority**: P2 | **Dependencies**: T012

Add styles for button appearance and touch targets.

**Files**:
- `src/app/shared/components/theme-toggle/theme-toggle.component.scss` (update)

**Acceptance**:
- [ ] Button minimum 44x44px touch target
- [ ] Visible focus indicator (outline)
- [ ] Smooth transition on icon change (200ms)
- [ ] Hover state styling
- [ ] Color uses CSS custom properties

**Test**: Button is at least 44px, focus visible with Tab key

---

### T014: Add theme toggle to navigation header
**Estimate**: 10 min | **Priority**: P1 | **Dependencies**: T012

Place toggle button in header component.

**Files**:
- `src/app/layouts/navigation-header/navigation-header.component.ts` (update)
- `src/app/layouts/navigation-header/navigation-header.component.html` (update)

**Acceptance**:
- [ ] Import ThemeToggleComponent in header
- [ ] Add `<app-theme-toggle>` to toolbar
- [ ] Position in top-right area
- [ ] Visible on all viewport sizes

**Test**: Toggle appears in header on homepage

---

## Phase 3: Global Theme Application (1.5 hours)

### T015: Add inline script to index.html for flash prevention
**Estimate**: 20 min | **Priority**: P1 | **Dependencies**: T007

Prevent flash of wrong theme on initial load.

**Files**:
- `src/index.html` (update)

**Acceptance**:
- [ ] `<script>` tag in `<head>` before other scripts
- [ ] IIFE reads `localStorage.getItem('theme-preference')`
- [ ] If value is 'light', adds `light-theme` class to body
- [ ] Wrapped in try-catch (ignore errors)
- [ ] Executes before Angular bootstraps

**Test**: Set localStorage to 'light', reload page, no flash of dark theme

---

### T016: Initialize theme in AppComponent
**Estimate**: 15 min | **Priority**: P1 | **Dependencies**: T009

Call theme initialization on app startup.

**Files**:
- `src/app/app.component.ts` (update)

**Acceptance**:
- [ ] Inject ThemeService in constructor
- [ ] Call `themeService.initializeTheme()` in ngOnInit or constructor
- [ ] Log initial theme to console (for debugging)

**Test**: Open app, check console for theme log, verify correct theme applied

---

### T017: Update existing components to use CSS custom properties
**Estimate**: 45 min | **Priority**: P2 | **Dependencies**: T003

Refactor component styles to use theme variables.

**Files**:
- `src/app/features/home/hero/hero.component.scss` (update)
- `src/app/features/home/schedule/schedule.component.scss` (update)
- `src/app/features/home/downloads/downloads.component.scss` (update)
- `src/app/features/home/cta/cta.component.scss` (update)
- `src/app/layouts/footer/footer.component.scss` (update)

**Acceptance**:
- [ ] Replace hardcoded colors with CSS variables
- [ ] Background colors use `var(--surface-bg)` or `var(--surface-card)`
- [ ] Text colors use `var(--text-primary)` or `var(--text-secondary)`
- [ ] Primary colors use `var(--primary-main)`
- [ ] Borders use `var(--border-color)`

**Test**: Toggle theme, verify all components update colors correctly

---

### T018: Configure Material theme palettes
**Estimate**: 30 min | **Priority**: P2 | **Dependencies**: T003

Set up Angular Material to use red-based theme colors.

**Files**:
- `src/styles.scss` (update)

**Acceptance**:
- [ ] Import Material theming functions
- [ ] Define `$dark-primary` using `mat.$red-palette`
- [ ] Define `$dark-accent` using `mat.$red-palette`
- [ ] Create `$dark-theme` with `mat.define-dark-theme()`
- [ ] Include `@include mat.all-component-themes($dark-theme)`
- [ ] Define light theme palettes similarly
- [ ] Wrap light theme in `.light-theme { ... }`
- [ ] Include `@include mat.all-component-colors($light-theme)`

**Test**: Material components (buttons, cards) change color with theme toggle

---

## Phase 4: Translation & Accessibility (1 hour)

### T019: Add German translations for theme toggle
**Estimate**: 15 min | **Priority**: P2 | **Dependencies**: T012

Add translation keys for theme toggle UI.

**Files**:
- `src/assets/i18n/de.json` (update)

**Acceptance**:
- [ ] `"theme.toggle"` key with value "Theme umschalten"
- [ ] `"theme.dark"` key with value "Dunkles Design"
- [ ] `"theme.light"` key with value "Helles Design"
- [ ] `"theme.switchToDark"` key with value "Zu dunklem Design wechseln"
- [ ] `"theme.switchToLight"` key with value "Zu hellem Design wechseln"

**Test**: Change language to German, verify toggle shows German text

---

### T020: Add English translations for theme toggle
**Estimate**: 10 min | **Priority**: P2 | **Dependencies**: T019

Add English translations for accessibility.

**Files**:
- `src/assets/i18n/en.json` (update)

**Acceptance**:
- [ ] Same keys as German with English values
- [ ] `"theme.switchToDark"` = "Switch to dark mode"
- [ ] `"theme.switchToLight"` = "Switch to light mode"

**Test**: Change language to English, verify toggle shows English text

---

### T021: Enhance ARIA labels with translations
**Estimate**: 20 min | **Priority**: P2 | **Dependencies**: T020

Make toggle fully accessible with dynamic ARIA labels.

**Files**:
- `src/app/shared/components/theme-toggle/theme-toggle.component.ts` (update)
- `src/app/shared/components/theme-toggle/theme-toggle.component.html` (update)

**Acceptance**:
- [ ] Getter `ariaLabel()` returns translated string
- [ ] If dark mode: return 'theme.switchToLight' translation
- [ ] If light mode: return 'theme.switchToDark' translation
- [ ] Bind to `[attr.aria-label]` in template
- [ ] Button has `role="button"` (implicit from `<button>`)

**Test**: Use screen reader (NVDA), verify announces current mode and action

---

### T022: Add live region for theme change announcements
**Estimate**: 15 min | **Priority**: P3 | **Dependencies**: T021

Announce theme changes to screen reader users.

**Files**:
- `src/app/shared/components/theme-toggle/theme-toggle.component.html` (update)
- `src/app/shared/components/theme-toggle/theme-toggle.component.ts` (update)

**Acceptance**:
- [ ] Hidden `<div>` with `aria-live="polite"`
- [ ] Property `announcementText: string`
- [ ] Update text when theme changes: "Dunkles Design aktiviert" or "Helles Design aktiviert"
- [ ] Bind to hidden div content

**Test**: Toggle theme with screen reader active, verify announcement

---

## Phase 5: Testing & Validation (2 hours)

### T023: Write unit tests for ThemeService
**Estimate**: 30 min | **Priority**: P1 | **Dependencies**: T009

Comprehensive unit tests for service methods.

**Files**:
- `src/app/core/services/theme.service.spec.ts` (update)

**Acceptance**:
- [ ] Test: defaults to dark theme
- [ ] Test: setTheme() changes theme
- [ ] Test: setTheme() updates body class
- [ ] Test: setTheme() saves to localStorage
- [ ] Test: toggleTheme() switches between themes
- [ ] Test: loadTheme() retrieves saved preference
- [ ] Test: loadTheme() handles corrupted data
- [ ] Test: initializeTheme() applies saved theme
- [ ] Test: themeChanged$ observable emits on change
- [ ] All tests pass

**Test**: Run `ng test`, verify 100% code coverage for ThemeService

---

### T024: Write unit tests for ThemeToggle component
**Estimate**: 20 min | **Priority**: P1 | **Dependencies**: T013

Unit tests for component behavior.

**Files**:
- `src/app/shared/components/theme-toggle/theme-toggle.component.spec.ts` (update)

**Acceptance**:
- [ ] Test: component creates successfully
- [ ] Test: displays correct icon for current theme
- [ ] Test: calls themeService.toggleTheme() on click
- [ ] Test: emits themeChanged event
- [ ] Test: updates currentTheme property
- [ ] All tests pass

**Test**: Run `ng test`, all ThemeToggle tests pass

---

### T025: Create E2E test for theme persistence
**Estimate**: 30 min | **Priority**: P1 | **Dependencies**: T016

End-to-end test for full theme toggle flow.

**Files**:
- `e2e/theme-toggle.spec.ts` (new)

**Acceptance**:
- [ ] Test: default theme is dark on first visit
- [ ] Test: clicking toggle switches to light mode
- [ ] Test: body has `light-theme` class when light
- [ ] Test: reload page, light theme persists
- [ ] Test: toggle back to dark, verify class removed
- [ ] Test: keyboard navigation (Tab + Enter)
- [ ] All E2E tests pass

**Test**: Run `npx playwright test`, all theme tests pass

---

### T026: Verify WCAG AA contrast compliance
**Estimate**: 30 min | **Priority**: P1 | **Dependencies**: T017

Check color contrast ratios meet accessibility standards.

**Files**:
- N/A (manual testing + tooling)

**Acceptance**:
- [ ] Run Lighthouse audit in dark mode, 100% accessibility score
- [ ] Run Lighthouse audit in light mode, 100% accessibility score
- [ ] Use Chrome DevTools contrast checker, all text ≥4.5:1 (normal) or ≥3:1 (large)
- [ ] No contrast warnings in axe DevTools
- [ ] Document any issues in GitHub issue

**Test**: Lighthouse and axe report no contrast violations

---

### T027: Manual cross-browser testing
**Estimate**: 10 min | **Priority**: P2 | **Dependencies**: T025

Verify theme toggle works in target browsers.

**Files**:
- N/A (manual testing)

**Acceptance**:
- [ ] Chrome/Edge: toggle works, theme persists
- [ ] Firefox: toggle works, theme persists
- [ ] Safari (if available): toggle works, theme persists
- [ ] Mobile Chrome (DevTools device mode): toggle works

**Test**: Open in 3+ browsers, toggle theme, reload, verify persistence

---

## Phase 6: Documentation & Cleanup (30 min)

### T028: Update README with theme toggle feature
**Estimate**: 15 min | **Priority**: P3 | **Dependencies**: T027

Document the new feature for developers.

**Files**:
- `README.md` (update)

**Acceptance**:
- [ ] Add "Theme Toggle" to features list
- [ ] Brief description: "Dark/light mode with localStorage persistence"
- [ ] Link to quickstart.md for usage details

**Test**: Read README, verify information is accurate

---

### T029: Create PR and merge checklist
**Estimate**: 15 min | **Priority**: P3 | **Dependencies**: T028

Prepare for code review and merge.

**Files**:
- GitHub PR (create)

**Acceptance**:
- [ ] PR title: "Feature: Dark/Light Theme Toggle"
- [ ] Description references feature spec
- [ ] Checklist: All unit tests pass
- [ ] Checklist: All E2E tests pass
- [ ] Checklist: Lighthouse accessibility 100%
- [ ] Checklist: Visual QA complete
- [ ] Request review from team

**Test**: Create PR, verify CI/CD pipeline runs successfully

---

## Summary

**Total Tasks**: 29
**Estimated Time**: 8 hours
**Critical Path**: T001 → T002 → T004 → T005 → T006 → T007 → T009 → T015 → T016 → T023 → T025

**Priorities**:
- **P0 (Must-have)**: Foundation setup (T001-T003)
- **P1 (Critical)**: Core functionality (T004-T016, T023-T026)
- **P2 (Important)**: Polish & refinement (T017-T022, T027)
- **P3 (Nice-to-have)**: Documentation (T028-T029)

**Quick Start**: Begin with T001, then proceed sequentially through each phase. Test after each phase completion before moving forward.
