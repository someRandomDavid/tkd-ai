# Implementation Plan: Dark/Light Theme Toggle

**Branch**: `002-theme-toggle` | **Date**: 2026-01-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-theme-toggle/spec.md`

## Summary

Add dark/light theme toggle to website with dark mode as default. Users can switch themes via button in header, with preference persisted in localStorage. Theme applies globally using CSS custom properties for instant switching (<200ms). Both themes maintain WCAG AA contrast ratios. Zero new dependencies - uses Angular Material theming already in place.

## Technical Context

**Language/Version**: TypeScript 5.x, Angular 21.0.5
**Primary Dependencies**: @angular/core, @angular/material (existing), localStorage API (native)
**Storage**: Client-side localStorage (key: 'theme-preference', values: 'dark' | 'light')
**Testing**: Jasmine/Karma for unit tests, Playwright for E2E theme toggle testing
**Target Platform**: Web (mobile-first responsive, last 2 browser versions)
**Project Type**: Single-page application (static pre-rendered)
**Performance Goals**: Theme switch <200ms, no impact on FCP/TTI
**Constraints**: Zero new dependencies, WCAG 2.1 AA compliance both themes
**Scale/Scope**: Global feature affecting all components/pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Taekwon-do Ailingen Website Constitution:

- **Mobile-First Design**: [x] Mobile breakpoints designed first (toggle in header, ≥44px touch target) [x] Touch targets ≥44px [x] Mobile testing planned (E2E tests)
- **Minimal Dependencies**: [x] New dependencies justified (NONE - uses existing Material + native localStorage) [x] Bundle size impact measured (0KB new dependencies) [x] Angular built-ins preferred (native localStorage, CSS custom properties)
- **Component-First**: [x] Components single-responsibility (ThemeToggle component + ThemeService) [x] Reusable & independently testable (toggle can be in header/footer/anywhere) [x] Clear @Input/@Output contracts (@Output themeChanged event)
- **Static-First**: [x] Content pre-rendered where possible (theme CSS in styles.scss at build time) [x] API calls minimized (none - client-side only) [x] No server runtime required (localStorage is client-side)
- **Accessibility**: [x] WCAG 2.1 AA compliance planned (both themes tested for 4.5:1 contrast) [x] Semantic HTML (button element) [x] Keyboard navigation (Tab + Enter/Space) [x] Automated a11y tests (Lighthouse CI)
- **Performance**: [x] Performance budget considered (0KB new JS, instant theme switch via CSS vars) [x] Images optimized (N/A for this feature)

**GATE STATUS**: ✅ PASS - No constitution violations. Zero new dependencies, uses existing Material theming, mobile-first toggle, fully accessible.

## Project Structure

### Documentation (this feature)

```text
specs/002-theme-toggle/
├── plan.md              # This file
├── research.md          # Phase 0 output - theming patterns, localStorage best practices
├── data-model.md        # Phase 1 output - ThemePreference type, ThemeColors interface
├── quickstart.md        # Phase 1 output - how to add theme toggle to new components
├── contracts/           # Phase 1 output - ThemeService API contract
└── checklists/
    └── requirements.md  # Quality checklist (COMPLETE)
```

### Source Code (repository root)

```text
tkd-ailingen-website/src/
├── app/
│   ├── core/
│   │   └── services/
│   │       └── theme.service.ts             # ThemeService: manage theme state + localStorage
│   │       └── theme.service.spec.ts
│   ├── shared/
│   │   └── components/
│   │       └── theme-toggle/
│   │           ├── theme-toggle.component.ts      # Toggle button component
│   │           ├── theme-toggle.component.html
│   │           ├── theme-toggle.component.scss
│   │           └── theme-toggle.component.spec.ts
│   └── layouts/
│       └── navigation-header/
│           └── navigation-header.component.html   # Updated to include <app-theme-toggle>
├── styles/
│   ├── _themes.scss              # Dark/light theme color definitions
│   ├── _variables.scss           # CSS custom properties for theming
│   └── styles.scss               # Import themes, apply default
└── assets/
    └── i18n/
        ├── de.json               # German translations for theme toggle
        └── en.json               # English translations for theme toggle

e2e/
└── src/
    └── theme-toggle.e2e-spec.ts  # E2E tests: toggle, persistence, visual consistency
```

**Structure Decision**: ThemeService in `core/services` as singleton managing global theme state. ThemeToggle component in `shared/components` for reusability (can be placed in header, footer, settings page). Themes defined in SCSS files following Material Design theming patterns.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - all Constitution principles followed.

---

## Phase 0: Outline & Research

### Unknowns from Technical Context

1. **localStorage best practices** for theme persistence
   - How to handle quota exceeded errors?
   - When to sync changes (immediately on toggle or debounced)?
   - Fallback strategy when unavailable?

2. **Angular Material theming patterns**
   - How to define custom dark/light palettes?
   - CSS custom properties vs. SCSS variables?
   - How to switch themes dynamically without page reload?

3. **WCAG AA contrast requirements**
   - What are exact contrast ratios for both themes?
   - How to test automated contrast checking?
   - Common pitfalls in light mode color selection?

4. **Theme flash prevention**
   - How to load saved theme before Angular bootstraps?
   - Script injection timing in index.html?
   - Critical CSS inlining strategy?

5. **prefers-color-scheme integration**
   - Should OS preference override localStorage?
   - Initial load logic priority: localStorage > OS pref > default?
   - Best practice for respecting user choice vs. system setting?

### Research Tasks

1. **Theme Persistence Research**
   - Task: Research localStorage best practices for theme preference persistence
   - Focus: Error handling (quota, unavailable, corrupted), sync timing, fallback to sessionStorage
   - Expected Output: Decision on storage key naming, value format, error handling strategy

2. **Material Theming Patterns**
   - Task: Research Angular Material custom theming for dark/light modes
   - Focus: CSS custom properties approach, theme mixin usage, dynamic switching without reload
   - Expected Output: Theme architecture decision (SCSS vs. CSS vars), palette definitions

3. **WCAG AA Compliance**
   - Task: Find best practices for WCAG AA contrast in dark/light themes
   - Focus: Text/background combinations, color palette selection, automated testing tools
   - Expected Output: Color palette for both themes with contrast ratios documented

4. **Flash-of-Wrong-Theme Prevention**
   - Task: Research techniques to prevent theme flash on initial page load
   - Focus: Script injection timing, critical CSS, localStorage read before Angular bootstrap
   - Expected Output: Implementation strategy for flash prevention (inline script or other)

5. **System Preference Integration**
   - Task: Research prefers-color-scheme media query integration with localStorage
   - Focus: Priority order (saved pref vs. OS pref), initial load logic, best practices
   - Expected Output: Decision on default theme hierarchy and OS preference respect

---

## Phase 1: Design & Contracts

### Data Model

**Output File**: `data-model.md`

**Entities**:
1. **ThemePreference** (type alias)
   - Type: `'dark' | 'light'`
   - Description: User's selected theme
   - Storage: localStorage key 'theme-preference'

2. **ThemeColors** (interface - if needed for programmatic color access)
   - Properties: primary, accent, warn, background, foreground, card, etc.
   - Description: Color values for current theme
   - Usage: May not be needed if using CSS custom properties

**Validation Rules**:
- ThemePreference must be exactly 'dark' or 'light', fallback to 'dark' if corrupted

### API Contracts

**Output Dir**: `contracts/`

**Contract**: `ThemeService` API

```typescript
// contracts/theme-service.interface.ts

export interface IThemeService {
  /**
   * Get current active theme
   * @returns Current theme preference ('dark' or 'light')
   */
  getCurrentTheme(): ThemePreference;

  /**
   * Set and persist theme preference
   * @param theme Theme to activate
   * @emits themeChanged$ observable
   */
  setTheme(theme: ThemePreference): void;

  /**
   * Toggle between dark and light themes
   * @emits themeChanged$ observable
   */
  toggleTheme(): void;

  /**
   * Observable stream of theme changes
   * @returns Observable emitting theme on change
   */
  themeChanged$: Observable<ThemePreference>;

  /**
   * Initialize theme from localStorage or default
   * Called on app initialization
   */
  initializeTheme(): void;
}
```

**OpenAPI/REST**: N/A - Client-side only service, no HTTP endpoints

### Agent Context Update

**Action**: Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType copilot`

**New Technology to Add**:
- CSS Custom Properties for theming (already widely supported, document usage pattern)
- localStorage API for theme persistence (native API, document error handling approach)
- Angular Material custom theming (already exists, document dark/light palette approach)

**Manual Additions to Preserve**: Any existing project structure notes, component patterns, or testing strategies between markers.

### Quickstart Guide

**Output File**: `quickstart.md`

**Content**:
- How to use ThemeService in a new component
- How to add ThemeToggle component to a page
- How to define theme-aware colors in component SCSS
- How to test theme switching in E2E tests
- How to verify WCAG contrast ratios for new colors

---

## Phase 2: NOT EXECUTED (Command stops after Phase 1)

**Note**: Phase 2 (task breakdown) is handled by `/speckit.tasks` command, not `/speckit.plan`.

---

## Implementation Notes

### Key Architecture Decisions

1. **Theme Storage Strategy**: localStorage with 'theme-preference' key, fallback to 'dark' default if unavailable
2. **Theme Application**: CSS custom properties defined in SCSS, applied to document root, instant switching
3. **Flash Prevention**: Inline script in index.html reads localStorage and sets theme class before Angular loads
4. **Component Integration**: ThemeToggle component communicates with ThemeService, no direct localStorage access in components
5. **Theme Scope**: Global themes only (not per-page), single source of truth in ThemeService

### Risk Mitigations

1. **localStorage Unavailable**: Fallback to in-memory storage for session, still functional but doesn't persist
2. **WCAG Contrast Failures**: Pre-defined color palette tested with contrast checker tools before implementation
3. **Theme Flash**: Inline script execution before Angular bootstrap ensures correct theme loads immediately
4. **Cross-Component Consistency**: All components use CSS custom properties, ensuring automatic theme application

### Dependencies on Other Features

- **Homepage (001-homepage)**: Theme toggle added to NavigationHeader component, all homepage sections must support theming
- **Future Features**: All new components must use CSS custom properties for theme compatibility

### Post-Design Constitution Re-Check

**After Phase 1 Design Complete**:
- [ ] Mobile-first: Theme toggle component designed for mobile (≥44px button)
- [ ] Minimal deps: Confirmed zero new dependencies
- [ ] Component-first: ThemeToggle reusable, ThemeService singleton
- [ ] Static-first: All theme definitions static CSS, no API calls
- [ ] Accessibility: ARIA labels, keyboard nav, contrast ratios verified
- [ ] Performance: CSS custom properties ensure <200ms switching
