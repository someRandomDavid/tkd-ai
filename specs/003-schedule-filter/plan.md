# Implementation Plan: Training Schedule Filter

**Branch**: `003-schedule-filter` | **Date**: 2026-01-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-schedule-filter/spec.md`

## Summary

Add multi-select filter to training schedule allowing users to filter sessions by level/age group across all three programs (Taekwon-do, Zumba, deepWORK). Filter uses OR logic (match ANY selected filter), persists to localStorage, and features collapsible mobile UI. Generates filter options dynamically from session data. Zero new dependencies - uses Angular Material checkboxes and expansion panel.

## Technical Context

**Language/Version**: TypeScript 5.x, Angular 21.0.5
**Primary Dependencies**: @angular/core, @angular/material (existing - checkbox, expansion-panel), localStorage API (native)
**Storage**: Client-side localStorage (key: 'schedule-filter-state', value: JSON with selected filters)
**Testing**: Jasmine/Karma for unit tests, Playwright for E2E filter interaction testing
**Target Platform**: Web (mobile-first responsive, last 2 browser versions)
**Project Type**: Single-page application (static pre-rendered)
**Performance Goals**: Filter response <100ms, smooth collapse/expand <300ms
**Constraints**: Zero new dependencies, touch targets ≥44px mobile, keyboard accessible
**Scale/Scope**: Filters ~10-20 training sessions, <10 unique filter options

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Taekwon-do Ailingen Website Constitution:

- **Mobile-First Design**: [x] Mobile breakpoints designed first (collapsible panel, ≥44px touch targets) [x] Touch targets ≥44px [x] Mobile testing planned (E2E tests on mobile viewport)
- **Minimal Dependencies**: [x] New dependencies justified (NONE - uses existing Material checkbox/expansion panel) [x] Bundle size impact measured (0KB new dependencies) [x] Angular built-ins preferred (native array filter methods, localStorage)
- **Component-First**: [x] Components single-responsibility (ScheduleFilter component + FilterService) [x] Reusable & independently testable (filter component works with any session list) [x] Clear @Input/@Output contracts (@Input sessions, @Output filteredSessions)
- **Static-First**: [x] Content pre-rendered where possible (filter operates on already-loaded data) [x] API calls minimized (none - client-side only) [x] No server runtime required (localStorage is client-side)
- **Accessibility**: [x] WCAG 2.1 AA compliance planned (proper checkbox labels, keyboard nav) [x] Semantic HTML (native checkboxes) [x] Keyboard navigation (Tab + Space) [x] Automated a11y tests (Lighthouse CI)
- **Performance**: [x] Performance budget considered (<100ms filter response, no new bundle size) [x] Images optimized (N/A for this feature)

**GATE STATUS**: ✅ PASS - No constitution violations. Zero new dependencies, uses existing Material components, mobile-first collapsible UI, fully accessible.

## Project Structure

### Documentation (this feature)

```text
specs/003-schedule-filter/
├── plan.md              # This file
├── research.md          # Phase 0 output - filter algorithms, localStorage patterns, UX patterns
├── data-model.md        # Phase 1 output - FilterState, FilterCriteria, LevelAgeOption types
├── quickstart.md        # Phase 1 output - how to add filter to other lists
├── contracts/           # Phase 1 output - FilterService API contract
└── checklists/
    └── requirements.md  # Quality checklist (COMPLETE)
```

### Source Code (repository root)

```text
tkd-ailingen-website/src/
├── app/
│   ├── core/
│   │   └── services/
│   │       └── filter.service.ts            # FilterService: manage filter state + localStorage
│   │       └── filter.service.spec.ts
│   ├── shared/
│   │   └── components/
│   │       └── schedule-filter/
│   │           ├── schedule-filter.component.ts      # Filter UI component
│   │           ├── schedule-filter.component.html
│   │           ├── schedule-filter.component.scss
│   │           └── schedule-filter.component.spec.ts
│   └── pages/
│       └── home/
│           └── sections/
│               └── schedules-section/
│                   └── schedules-section.component.html  # Updated to include filter
│                   └── schedules-section.component.ts    # Updated to handle filtered sessions
└── assets/
    └── i18n/
        ├── de.json               # German translations for filter UI
        └── en.json               # English translations for filter UI

e2e/
└── src/
    └── schedule-filter.e2e-spec.ts  # E2E tests: filter, persistence, mobile UI
```

**Structure Decision**: FilterService in `core/services` as singleton managing filter state. ScheduleFilter component in `shared/components` for potential reuse with other lists (trainers, events). Integrates into existing SchedulesSection from homepage feature.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - all Constitution principles followed.

---

## Phase 0: Outline & Research

### Unknowns from Technical Context

1. **Filter Algorithm Performance**
   - How to efficiently filter 10-20 sessions with OR logic?
   - Array.filter() performance characteristics?
   - Should filter run on every checkbox toggle or debounced?

2. **localStorage Best Practices for Filter State**
   - What data structure for storing selected filters?
   - When to persist (every change or on page unload)?
   - How to handle version changes (filter options added/removed)?

3. **Dynamic Filter Generation**
   - How to extract unique level/age values from session data?
   - Should filter options be sorted (alphabetically, by count)?
   - How to handle sessions with missing level/age data?

4. **Mobile Collapsible UX Patterns**
   - Material expansion panel or custom accordion?
   - Should panel remember expanded/collapsed state?
   - Best practice for touch-friendly filter controls?

5. **OR Logic Implementation**
   - Best way to check if session matches ANY selected filter?
   - Should use Set for selected filters for performance?
   - How to display filter indicator (count logic)?

### Research Tasks

1. **Filter Algorithm Research**
   - Task: Research JavaScript array filtering performance and best practices for OR logic
   - Focus: Array.filter() vs. Array.some(), Set membership testing, performance with 10-20 items
   - Expected Output: Decision on filter algorithm implementation approach

2. **localStorage Filter State Patterns**
   - Task: Research patterns for storing filter state in localStorage
   - Focus: JSON structure, versioning strategy, migration handling when filters change
   - Expected Output: FilterState data structure, persistence timing decision

3. **Dynamic Option Generation**
   - Task: Research patterns for dynamically generating filter options from data
   - Focus: Extracting unique values, sorting strategies, handling missing data
   - Expected Output: Algorithm for generating LevelAgeOption[] from TrainingSession[]

4. **Material Expansion Panel UX**
   - Task: Research Angular Material expansion panel best practices for mobile
   - Focus: Touch targets, collapse behavior, state persistence, accessibility
   - Expected Output: Component architecture decision (use mat-expansion-panel or custom)

5. **Multi-Select Filter UX Patterns**
   - Task: Research best practices for multi-select filter UX on mobile
   - Focus: Checkbox groups, filter chips/tags, clear all button, active filter indicator
   - Expected Output: UI/UX design decision for filter controls and feedback

---

## Phase 1: Design & Contracts

### Data Model

**Output File**: `data-model.md`

**Entities**:

1. **FilterCriteria** (type alias)
   - Type: `string[]` (array of level/age values, e.g., `["bambini-4-6", "kinder-7-10"]`)
   - Description: User's currently selected filters
   - Storage: Part of FilterState in localStorage

2. **FilterState** (interface)
   - Properties:
     - `selectedFilters`: `string[]` (currently selected filter values)
     - `isPanelExpanded`: `boolean` (mobile panel state, optional)
   - Description: Complete filter state for persistence
   - Storage: localStorage key 'schedule-filter-state'

3. **LevelAgeOption** (interface)
   - Properties:
     - `label`: `string` (display text, e.g., "Bambini Anfänger 4-6")
     - `value`: `string` (unique identifier, e.g., "bambini-4-6")
     - `count`: `number` (number of sessions with this level/age)
   - Description: Filter checkbox option
   - Usage: Generated dynamically from TrainingSession data

4. **TrainingSession** (updated from homepage)
   - Add properties:
     - `level`: `string` (e.g., "anfänger", "fortgeschritten")
     - `ageGroup`: `string` (e.g., "4-6", "7-10", "11-14", "erwachsene")
     - `levelAgeKey`: `string` (computed, e.g., "bambini-4-6" for filtering)

**Validation Rules**:
- FilterCriteria values must match existing level/age keys in session data
- FilterState.selectedFilters array can be empty (no filters active)
- If FilterState corrupted in localStorage, reset to `{ selectedFilters: [], isPanelExpanded: false }`

### API Contracts

**Output Dir**: `contracts/`

**Contract**: `FilterService` API

```typescript
// contracts/filter-service.interface.ts

export interface IFilterService {
  /**
   * Get currently selected filter criteria
   * @returns Array of selected filter values
   */
  getSelectedFilters(): string[];

  /**
   * Set filter criteria and persist
   * @param filters Array of filter values to apply
   * @emits filtersChanged$ observable
   */
  setFilters(filters: string[]): void;

  /**
   * Add a filter to current selection
   * @param filterValue Filter value to add
   * @emits filtersChanged$ observable
   */
  addFilter(filterValue: string): void;

  /**
   * Remove a filter from current selection
   * @param filterValue Filter value to remove
   * @emits filtersChanged$ observable
   */
  removeFilter(filterValue: string): void;

  /**
   * Clear all filters
   * @emits filtersChanged$ observable
   */
  clearFilters(): void;

  /**
   * Observable stream of filter changes
   * @returns Observable emitting current filters on change
   */
  filtersChanged$: Observable<string[]>;

  /**
   * Initialize filters from localStorage or default
   * Called on app initialization
   */
  initializeFilters(): void;

  /**
   * Apply filters to session array (OR logic)
   * @param sessions Array of training sessions
   * @param filters Array of filter values (uses current if not provided)
   * @returns Filtered array of sessions
   */
  applyFilters(sessions: TrainingSession[], filters?: string[]): TrainingSession[];
}
```

**OpenAPI/REST**: N/A - Client-side only service, no HTTP endpoints

### Agent Context Update

**Action**: Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType copilot`

**New Technology to Add**:
- Angular Material Expansion Panel for collapsible mobile UI (already in Material, document usage pattern)
- Array filtering with OR logic (native JavaScript, document pattern for multi-criteria filtering)
- localStorage for filter state persistence (native API, document filter-specific error handling)

**Manual Additions to Preserve**: Any existing project structure notes, component patterns, or testing strategies between markers.

### Quickstart Guide

**Output File**: `quickstart.md`

**Content**:
- How to use FilterService in a component
- How to add ScheduleFilter component to a page
- How to add level/ageGroup attributes to session data
- How to test filter functionality in E2E tests
- How to extend filter to support other attributes (instructor, time, etc.)

---

## Phase 2: NOT EXECUTED (Command stops after Phase 1)

**Note**: Phase 2 (task breakdown) is handled by `/speckit.tasks` command, not `/speckit.plan`.

---

## Implementation Notes

### Key Architecture Decisions

1. **Filter Logic**: OR logic using `Array.some()` - session matches if ANY selected filter matches its levelAgeKey
2. **Dynamic Options**: Extract unique level/age combinations from session data on component init, sort alphabetically
3. **State Management**: FilterService manages filter state, ScheduleFilter component is presentational with @Input/@Output
4. **Persistence Strategy**: Save to localStorage immediately on filter change (not debounced) for immediate persistence
5. **Mobile UI**: Material expansion panel for collapsible filter on mobile, always-visible on desktop

### Risk Mitigations

1. **localStorage Unavailable**: Fallback to in-memory array, filter still works but doesn't persist
2. **Inconsistent Level/Age Data**: Validate session data structure, skip sessions with missing attributes
3. **Performance with Many Sessions**: Profile with 100+ sessions, implement virtual scrolling if needed
4. **Mobile Touch Targets**: Ensure checkbox hit area ≥44px with proper padding/margin

### Dependencies on Other Features

- **Homepage (001-homepage)**: Integrates with SchedulesSection component, requires TrainingSession data structure update
- **Theme Toggle (002-theme-toggle)**: Filter UI must support both dark/light themes using CSS custom properties

### Post-Design Constitution Re-Check

**After Phase 1 Design Complete**:
- [ ] Mobile-first: Filter panel collapsible on mobile, touch targets ≥44px
- [ ] Minimal deps: Confirmed zero new dependencies (uses existing Material)
- [ ] Component-first: ScheduleFilter reusable, FilterService singleton
- [ ] Static-first: All filtering client-side on pre-loaded data
- [ ] Accessibility: Keyboard nav (Tab + Space), proper labels, screen reader friendly
- [ ] Performance: <100ms filter response, no impact on page load
