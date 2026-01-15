# Feature Specification: Dark/Light Theme Toggle

**Feature Branch**: `002-theme-toggle`  
**Created**: 2026-01-13  
**Status**: Draft  
**Input**: User description: "Add a dark/light theme toggle switch to the website with dark mode as the default theme for reduced eye strain. Users should be able to switch between themes, and their preference should persist across sessions using localStorage. The theme should apply to all pages and components with appropriate color schemes for both modes while maintaining WCAG AA contrast ratios."

## Constitution Compliance

*(Reference Taekwon-do Ailingen Website Constitution principles)*

- **Mobile-First Design**: Theme toggle accessible on mobile via icon button in header/footer. Touch target ≥44px. Visual feedback on tap. Both themes optimized for mobile viewing with appropriate contrast for outdoor/bright light conditions.
- **Minimal Dependencies**: No new dependencies required. Uses Angular Material theming system already in place. localStorage is native browser API (no library needed).
- **Component-First**: Reusable ThemeToggle component that can be placed in header, footer, or settings. ThemeService handles state management and persistence, can be used across entire application.
- **Static-First**: Theme preference stored client-side in localStorage. No server/API required. Themes defined in CSS/SCSS variables at build time.
- **Accessibility**: Toggle labeled with ARIA attributes. Keyboard accessible (Tab + Enter/Space). Visual state indication (icon changes). Maintains WCAG AA contrast in both modes. Respects prefers-color-scheme media query for initial load if no saved preference.
- **Performance**: Zero bundle impact - theme switching uses CSS custom properties (CSS variables). No JavaScript-heavy color calculations. Instant theme switching without page reload.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Switch Between Themes for Eye Comfort (Priority: P1)

A user visits the website and wants to change from dark mode (default) to light mode, or vice versa, to match their viewing environment or personal preference. Their choice should persist across visits.

**Why this priority**: Core feature value - reduces eye strain and improves accessibility. Essential for user comfort and demonstrates the feature works. Without this, the feature has no value.

**Independent Test**: Can be fully tested by clicking the theme toggle button, verifying visual change occurs immediately, reloading the page, and confirming theme persists. No other features needed.

**Acceptance Scenarios**:

1. **Given** a user visits the website for the first time (no saved preference), **When** the page loads, **Then** dark mode is applied as the default theme
2. **Given** a user sees the website in dark mode, **When** they click the theme toggle button, **Then** the theme immediately switches to light mode across all visible components
3. **Given** a user has switched to light mode, **When** they click the toggle again, **Then** the theme switches back to dark mode
4. **Given** a user has selected light mode, **When** they close and reopen the website, **Then** light mode is still active (preference persisted via localStorage)
5. **Given** a user has never visited before and has OS dark mode preference set, **When** the page loads, **Then** dark mode is used (respecting prefers-color-scheme)
6. **Given** a user has never visited before and has OS light mode preference set, **When** the page loads with no saved localStorage preference, **Then** dark mode is still used as default (explicit default overrides OS preference)

---

### User Story 2 - Visual Consistency Across All Components (Priority: P2)

As a user switches themes, all components (hero, navigation, cards, buttons, footer) should reflect the new color scheme consistently without visual glitches or partially-themed sections.

**Why this priority**: Ensures professional appearance and complete feature coverage. Incomplete theming would create a poor user experience, but testing basic toggle (P1) confirms the mechanism works.

**Independent Test**: Can be tested by switching themes and visually inspecting each section/component of the website for consistent color application. Compare against a checklist of all components.

**Acceptance Scenarios**:

1. **Given** a user switches from dark to light mode, **When** viewing the hero section, **Then** background, text, and overlay colors update to light theme values
2. **Given** light mode is active, **When** viewing the navigation header, **Then** toolbar, menu items, and icons use light theme colors
3. **Given** light mode is active, **When** viewing training schedule cards, **Then** card backgrounds, text, and borders use light theme colors
4. **Given** light mode is active, **When** viewing the downloads section, **Then** list items, icons, and hover states use light theme colors
5. **Given** light mode is active, **When** viewing CTA buttons, **Then** button colors, text, and hover effects use light theme contrast-compliant colors
6. **Given** light mode is active, **When** viewing the footer, **Then** background and text colors update to light theme values

---

### User Story 3 - Accessible Theme Toggle (Priority: P3)

A user relying on keyboard navigation or screen reader can successfully toggle between themes without using a mouse.

**Why this priority**: Critical for accessibility compliance but can be tested independently after basic toggle (P1) and visual consistency (P2) are working. Ensures WCAG AA compliance.

**Independent Test**: Can be tested using only keyboard (Tab to toggle, Enter/Space to activate) and screen reader (NVDA/VoiceOver) to verify announcements and state.

**Acceptance Scenarios**:

1. **Given** a user navigates with Tab key, **When** the theme toggle button receives focus, **Then** a visible focus indicator appears
2. **Given** the toggle has keyboard focus, **When** user presses Enter or Space, **Then** the theme switches
3. **Given** a screen reader user encounters the toggle, **When** it receives focus, **Then** the screen reader announces "Theme toggle, button, currently [dark/light] mode"
4. **Given** a user activates the toggle, **When** theme changes, **Then** screen reader announces "Theme switched to [dark/light] mode"
5. **Given** a user has high contrast mode enabled in OS, **When** viewing either theme, **Then** colors adapt while maintaining theme distinction

---

### Edge Cases

- What happens when localStorage is unavailable (private browsing, storage disabled)? → Default to dark mode, theme still works in current session but won't persist
- What happens if localStorage data is corrupted? → Gracefully handle by resetting to default (dark mode), log error to console
- How does the toggle appear during theme transition? → Use CSS transitions (~200ms) for smooth color changes, no flash of unstyled content
- What if a user has very high screen brightness? → Light mode provides optimal viewing in bright environments
- What if a user has motion sensitivity? → Theme transitions use opacity/color changes only, no transform/scale animations
- What happens when JavaScript is disabled? → Default dark theme still loads via CSS, toggle button hidden or shows fallback message

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a toggle button to switch between dark and light themes
- **FR-002**: System MUST apply dark mode as the default theme on first visit (when no localStorage preference exists)
- **FR-003**: System MUST persist user's theme preference in localStorage across sessions
- **FR-004**: System MUST apply the saved theme preference immediately on page load (no flash of wrong theme)
- **FR-005**: System MUST update all components and sections to reflect the selected theme consistently
- **FR-006**: System MUST respect browser's prefers-color-scheme media query as fallback when no localStorage preference exists
- **FR-007**: Theme toggle button MUST be accessible via keyboard (Tab + Enter/Space)
- **FR-008**: Theme toggle MUST include appropriate ARIA labels for screen readers
- **FR-009**: Both dark and light themes MUST meet WCAG 2.1 AA contrast requirements (4.5:1 for normal text, 3:1 for large text)
- **FR-010**: Theme switching MUST occur instantly (<200ms) without page reload
- **FR-011**: System MUST provide distinct visual indication of current theme on toggle button (e.g., icon changes)
- **FR-012**: Dark theme MUST use color palette optimized for low-light viewing (reduced blue light, higher contrast) based on black, white, red, and their shades
- **FR-013**: Light theme MUST use color palette optimized for bright-light viewing (sufficient contrast, readable in daylight) based on black, white, red, and their shades
- **FR-014**: Color scheme MUST use black (#000000), white (#FFFFFF), red (#DC143C or similar), and shades/tints of these base colors for both themes

### Key Entities

- **ThemePreference**: User's saved theme choice (`'dark' | 'light'`), stored in localStorage under key `'theme-preference'`
- **ThemeColors**: Color scheme object containing all themed CSS custom properties (background colors, text colors, border colors, accent colors)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can toggle between dark and light themes in under 2 seconds (1 click/tap)
- **SC-002**: Theme preference persists across 100% of page reloads and browser sessions
- **SC-003**: Theme change occurs within 200ms of toggle activation (perceivable as "instant")
- **SC-004**: Both themes achieve WCAG AA contrast compliance with 100% pass rate (checked via automated tools)
- **SC-005**: Theme toggle is keyboard accessible with 100% success rate (Tab + Enter/Space)
- **SC-006**: Screen reader users can successfully identify and operate toggle (verified via NVDA/VoiceOver testing)
- **SC-007**: No visual flash or theme flicker occurs on page load (0% occurrence rate)
- **SC-008**: Theme applies consistently across all components (100% visual coverage in both modes)

## Assumptions

- Users understand dark/light mode concepts from other websites/apps
- Users have modern browsers with localStorage support (IE11+ or any current browser)
- Users have JavaScript enabled (theme still loads in default mode if JS disabled)
- Material Design theme system already configured in Angular project (from homepage feature)
- Color palette is based on black, white, red, and their shades (not default Material purple/teal)
- Existing color palette can be extended to include light mode variants using the black/white/red scheme
- Users will primarily toggle theme once and leave it, not frequently switch
- No requirement for additional themes beyond dark/light (no "auto", "sepia", "high contrast" custom modes)
- Theme preference applies globally to entire site, not per-page
- Theme does not affect content (images, logos remain same)

## Out of Scope

- Multiple custom themes (e.g., blue theme, red theme, sepia)
- Per-page theme preferences
- Time-based auto-switching (e.g., dark at night, light during day)
- Theme customization/color picker for users
- Sync theme preference across devices (cloud sync)
- System-level theme API integration (OS-level dark mode toggle)
- Animated theme transition effects beyond simple fade
- High contrast mode as separate theme (relies on OS high contrast instead)

## Dependencies

- Angular Material theming system (already installed from homepage feature)
- CSS custom properties (CSS variables) support in target browsers
- localStorage API availability in target browsers
- SCSS build pipeline for theme variable definitions

## Risk Assessment

- **Low Risk**: Well-established pattern, minimal code complexity, no external dependencies
- **Potential Issues**:
  - localStorage unavailable → Mitigation: Fallback to session-based or in-memory storage
  - WCAG contrast failures in light mode → Mitigation: Color palette testing during planning phase
  - Performance impact from CSS variable updates → Mitigation: Profile and optimize, use GPU-accelerated properties
  - Inconsistent styling across components → Mitigation: Comprehensive visual regression testing
