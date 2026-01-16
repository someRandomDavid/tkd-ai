# Implementation Tasks: Training Schedule Filter

**Feature**: 003-schedule-filter | **Branch**: `003-schedule-filter` | **Date**: 2026-01-13

## Overview

Break down implementation into granular, testable tasks for multi-select filter with OR logic and localStorage persistence.

**Estimated Total Time**: 11.5 hours

---

## Phase 0: Setup & Data Model (1.5 hours)

### T001: Extend TrainingSession model with filter attributes
**Estimate**: 30 min | **Priority**: P0 | **Dependencies**: None

Add level and ageGroup fields to existing session model.

**Files**:
- `src/app/core/models/training-session.ts` (update)

**Acceptance**:
- [ ] Add `level: string` property (values: "beginner", "intermediate", "advanced", "expert", "all")
- [ ] Add `ageGroup: string` property (values: "kids", "teens", "adults", "seniors", "all")
- [ ] Add `levelAgeKey: string` property (computed from level_ageGroup)
- [ ] Add JSDoc comments for each field
- [ ] Export helper function `generateLevelAgeKey(level, ageGroup)`

**Test**: TypeScript compiles, can create session with new fields

---

### T002: Create filter types and constants
**Estimate**: 20 min | **Priority**: P0 | **Dependencies**: None

Define types for filter state and criteria.

**Files**:
- `src/app/core/models/filter.types.ts` (new)

**Acceptance**:
- [ ] `FilterCriteria` type = `string[]`
- [ ] `FilterState` interface with `version`, `selectedFilters`, `isPanelExpanded?`
- [ ] `LevelAgeOption` interface with `label`, `value`, `count`
- [ ] `FILTER_STORAGE_KEY` constant = `'schedule-filter-state'`
- [ ] `FILTER_STATE_VERSION` constant = `1`
- [ ] `VALID_LEVELS` and `VALID_AGE_GROUPS` arrays

**Test**: Import types, TypeScript compiles without errors

---

### T003: Update existing session data with filter attributes
**Estimate**: 40 min | **Priority**: P0 | **Dependencies**: T001

Add level/ageGroup to all existing training sessions in JSON data.

**Files**:
- `src/assets/data/schedule.json` (update) or wherever session data lives

**Acceptance**:
- [ ] Each session has `level` field
- [ ] Each session has `ageGroup` field
- [ ] Each session has `levelAgeKey` field (format: `{level}_{ageGroup}`)
- [ ] All values are from valid sets
- [ ] At least 2-3 different levels represented
- [ ] At least 2-3 different age groups represented

**Test**: Load sessions in app, verify new fields exist and have valid values

---

## Phase 1: FilterService Implementation (2.5 hours)

### T004: Create FilterService skeleton
**Estimate**: 20 min | **Priority**: P1 | **Dependencies**: T002

Create service with basic structure.

**Files**:
- `src/app/core/services/filter.service.ts` (new)
- `src/app/core/services/filter.service.spec.ts` (new)

**Acceptance**:
- [ ] `@Injectable({ providedIn: 'root' })` decorator
- [ ] Constructor defined
- [ ] Import filter types from T002
- [ ] Basic unit test file with describe block

**Test**: `ng test` runs, FilterService can be injected

---

### T005: Implement getSelectedFilters() and setFilters() methods
**Estimate**: 30 min | **Priority**: P1 | **Dependencies**: T004

Add methods for filter state management.

**Files**:
- `src/app/core/services/filter.service.ts` (update)
- `src/app/core/services/filter.service.spec.ts` (update)

**Acceptance**:
- [ ] `private filtersSubject = new BehaviorSubject<FilterCriteria>([])`
- [ ] `public readonly filtersChanged$ = this.filtersSubject.asObservable()`
- [ ] `getSelectedFilters(): FilterCriteria` returns current filters
- [ ] `setFilters(filters: FilterCriteria): boolean` validates and sets filters
- [ ] Unit test: defaults to empty array
- [ ] Unit test: setFilters updates state

**Test**: Unit tests pass, service manages filter state

---

### T006: Implement localStorage persistence
**Estimate**: 40 min | **Priority**: P1 | **Dependencies**: T005

Add save/load methods with versioned JSON format.

**Files**:
- `src/app/core/services/filter.service.ts` (update)
- `src/app/core/services/filter.service.spec.ts` (update)

**Acceptance**:
- [ ] `private saveState(state: FilterState): boolean` method
- [ ] Saves JSON with version, selectedFilters, isPanelExpanded
- [ ] Try-catch around localStorage operations
- [ ] `private loadState(): FilterState` method
- [ ] Validates loaded state (checks version, validates filters)
- [ ] Returns default state if load fails
- [ ] Unit tests for save/load/error cases

**Test**: Call setFilters(), check localStorage in DevTools, verify JSON format

---

### T007: Implement add/remove/clear filter methods
**Estimate**: 30 min | **Priority**: P1 | **Dependencies**: T006

Add convenience methods for single filter operations.

**Files**:
- `src/app/core/services/filter.service.ts` (update)
- `src/app/core/services/filter.service.spec.ts` (update)

**Acceptance**:
- [ ] `addFilter(filterValue: string): boolean` adds to array
- [ ] `removeFilter(filterValue: string): boolean` removes from array
- [ ] `clearFilters(): boolean` resets to empty array
- [ ] `isFilterSelected(filterValue: string): boolean` checks if active
- [ ] `getFilterCount(): number` returns count
- [ ] All methods persist changes to localStorage
- [ ] Unit tests for each method

**Test**: Add filter, check localStorage updated; remove filter, verify updated

---

### T008: Implement applyFilters() with OR logic
**Estimate**: 30 min | **Priority**: P1 | **Dependencies**: T005

Add filtering algorithm using Set for O(1) lookup.

**Files**:
- `src/app/core/services/filter.service.ts` (update)
- `src/app/core/services/filter.service.spec.ts` (update)

**Acceptance**:
- [ ] `applyFilters(sessions: TrainingSession[], filters?: FilterCriteria): TrainingSession[]`
- [ ] If filters empty, return all sessions
- [ ] Build Set from filter criteria
- [ ] Filter sessions where `level` OR `ageGroup` in Set
- [ ] Return filtered array (does not mutate original)
- [ ] Unit test: no filters returns all
- [ ] Unit test: single filter works
- [ ] Unit test: multiple filters use OR logic

**Test**: Apply filters to mock data, verify OR logic (ANY match shows session)

---

### T009: Implement generateOptions() for dynamic filter UI
**Estimate**: 40 min | **Priority**: P1 | **Dependencies**: T001

Extract unique levels/age groups with counts.

**Files**:
- `src/app/core/services/filter.service.ts` (update)
- `src/app/core/services/filter.service.spec.ts` (update)

**Acceptance**:
- [ ] `generateOptions(sessions: TrainingSession[], category: 'level' | 'ageGroup'): LevelAgeOption[]`
- [ ] Count occurrences using Map
- [ ] Translate labels using ngx-translate
- [ ] Sort alphabetically by label (German locale 'de-DE')
- [ ] Unit test: extracts unique values
- [ ] Unit test: counts correct
- [ ] Unit test: sorts alphabetically

**Test**: Generate options from mock sessions, verify counts and German sort order

---

### T010: Implement initializeFilters() for app startup
**Estimate**: 20 min | **Priority**: P1 | **Dependencies**: T006

Load saved filters on app initialization.

**Files**:
- `src/app/core/services/filter.service.ts` (update)
- `src/app/core/services/filter.service.spec.ts` (update)

**Acceptance**:
- [ ] `initializeFilters(): FilterCriteria` method
- [ ] Loads from localStorage
- [ ] Validates loaded filters
- [ ] Emits via filtersSubject
- [ ] Returns initialized filters
- [ ] Unit test: loads saved filters
- [ ] Unit test: defaults to empty if no saved state

**Test**: Set localStorage manually, call initializeFilters(), verify filters loaded

---

## Phase 2: ScheduleFilter Component (3 hours)

### T011: Generate ScheduleFilter component
**Estimate**: 10 min | **Priority**: P1 | **Dependencies**: T004

Create component files.

**Files**:
- `src/app/shared/components/schedule-filter/` (new directory)

**Acceptance**:
- [ ] Run `ng generate component shared/components/schedule-filter --standalone`
- [ ] Component generated with .ts, .html, .scss, .spec.ts
- [ ] Component is standalone

**Test**: `ng build` succeeds, component can be imported

---

### T012: Implement ScheduleFilter component logic
**Estimate**: 40 min | **Priority**: P1 | **Dependencies**: T011, T009

Add filter service integration and option generation.

**Files**:
- `src/app/shared/components/schedule-filter/schedule-filter.component.ts` (update)
- `src/app/shared/components/schedule-filter/schedule-filter.component.spec.ts` (update)

**Acceptance**:
- [ ] Inject FilterService and TranslateService
- [ ] `@Input() sessions: TrainingSession[] = []`
- [ ] `@Output() filtersApplied = new EventEmitter<string[]>()`
- [ ] `levelOptions: LevelAgeOption[]` property
- [ ] `ageGroupOptions: LevelAgeOption[]` property
- [ ] `ngOnChanges()` regenerates options when sessions change
- [ ] Subscribe to `filterService.filtersChanged$`
- [ ] Unit test: generates options from sessions

**Test**: Pass sessions to component, verify options generated

---

### T013: Create ScheduleFilter template with Material expansion panel
**Estimate**: 50 min | **Priority**: P1 | **Dependencies**: T012

Build collapsible filter UI with checkboxes.

**Files**:
- `src/app/shared/components/schedule-filter/schedule-filter.component.html` (update)

**Acceptance**:
- [ ] `<mat-expansion-panel>` wrapper
- [ ] Panel header with "Filter" title and active count badge
- [ ] Two filter groups: "Stufe" (level) and "Altersgruppe" (age group)
- [ ] `<mat-checkbox>` for each option
- [ ] Checkbox checked state bound to `filterService.isFilterSelected()`
- [ ] `(change)` calls `onFilterToggle(value)`
- [ ] "Clear all" button at bottom
- [ ] Active filter chips below panel showing selected filters
- [ ] Data attributes for E2E testing

**Test**: View in browser, panel expands/collapses, checkboxes appear

---

### T014: Implement filter toggle and clear logic
**Estimate**: 30 min | **Priority**: P1 | **Dependencies**: T013

Connect UI interactions to service methods.

**Files**:
- `src/app/shared/components/schedule-filter/schedule-filter.component.ts` (update)
- `src/app/shared/components/schedule-filter/schedule-filter.component.spec.ts` (update)

**Acceptance**:
- [ ] `onFilterToggle(value: string)` method
- [ ] If checked: call `filterService.addFilter(value)`
- [ ] If unchecked: call `filterService.removeFilter(value)`
- [ ] `onClearAll()` calls `filterService.clearFilters()`
- [ ] `onRemoveFilter(value)` removes single chip
- [ ] Emit `filtersApplied` event when filters change
- [ ] Unit test: toggles call service methods

**Test**: Check/uncheck boxes, verify service state updates

---

### T015: Style ScheduleFilter component
**Estimate**: 40 min | **Priority**: P2 | **Dependencies**: T013

Add styles for expansion panel and checkboxes.

**Files**:
- `src/app/shared/components/schedule-filter/schedule-filter.component.scss` (update)

**Acceptance**:
- [ ] Expansion panel background uses `var(--surface-card)`
- [ ] Filter groups in CSS Grid (1 col mobile, 2 col desktop)
- [ ] Checkbox touch targets ≥44px
- [ ] Active count badge styled (circular, primary color)
- [ ] Filter chips styled (rounded, removable)
- [ ] "Clear all" button styled
- [ ] Responsive: full width on mobile
- [ ] Smooth transitions on expand/collapse

**Test**: View on mobile and desktop, verify layout and touch targets

---

### T016: Add filter to schedule page/component
**Estimate**: 20 min | **Priority**: P1 | **Dependencies**: T014

Integrate filter into existing schedule view.

**Files**:
- `src/app/features/home/schedule/schedule.component.ts` (update)
- `src/app/features/home/schedule/schedule.component.html` (update)

**Acceptance**:
- [ ] Import ScheduleFilterComponent
- [ ] Add `<app-schedule-filter>` above schedule grid
- [ ] Pass `[sessions]="allSessions"` input
- [ ] Listen to `(filtersApplied)` event
- [ ] Apply filters to sessions for display
- [ ] Show filtered count: "Zeigt X von Y Trainingseinheiten"

**Test**: View schedule page, filter appears and works

---

## Phase 3: Translation & Polish (1.5 hours)

### T017: Add German translations for filter UI
**Estimate**: 20 min | **Priority**: P2 | **Dependencies**: T013

Add all filter-related translation keys.

**Files**:
- `src/assets/i18n/de.json` (update)

**Acceptance**:
- [ ] `"filter.title"` = "Filter"
- [ ] `"filter.clearAll"` = "Alle löschen"
- [ ] `"filter.activeFilters"` = "Aktive Filter: {{count}}"
- [ ] `"filter.level.label"` = "Stufe"
- [ ] Level values: beginner, intermediate, advanced, expert, all
- [ ] `"filter.ageGroup.label"` = "Altersgruppe"
- [ ] Age group values: kids, teens, adults, seniors, all
- [ ] `"filter.results.showing"` = "{{count}} Trainingseinheiten werden angezeigt"
- [ ] `"filter.results.noResults"` = "Keine Trainingseinheiten gefunden"

**Test**: View filter in German, all labels show correctly

---

### T018: Add English translations for filter UI
**Estimate**: 15 min | **Priority**: P3 | **Dependencies**: T017

Add English translations.

**Files**:
- `src/assets/i18n/en.json` (update)

**Acceptance**:
- [ ] Same keys as German with English values
- [ ] `"filter.level.beginner"` = "Beginner"
- [ ] `"filter.ageGroup.kids"` = "Kids (5-12)"

**Test**: Switch to English, verify filter translations

---

### T019: Enhance accessibility with ARIA attributes
**Estimate**: 30 min | **Priority**: P2 | **Dependencies**: T014

Add proper ARIA labels and live regions.

**Files**:
- `src/app/shared/components/schedule-filter/schedule-filter.component.html` (update)

**Acceptance**:
- [ ] Expansion panel has `aria-label="Filter-Einstellungen"`
- [ ] Each checkbox group has `role="group"` with `aria-labelledby`
- [ ] Count badge has `aria-label` describing filter count
- [ ] Live region (`aria-live="polite"`) announces filter changes
- [ ] "Clear all" button has descriptive `aria-label`

**Test**: Use screen reader, verify all elements announce correctly

---

### T020: Add keyboard shortcuts hint
**Estimate**: 15 min | **Priority**: P3 | **Dependencies**: T019

Display keyboard navigation hints.

**Files**:
- `src/app/shared/components/schedule-filter/schedule-filter.component.html` (update)

**Acceptance**:
- [ ] Tooltip or small text: "Tab + Space zum Auswählen"
- [ ] Only visible on keyboard focus
- [ ] Uses CSS `:focus-visible`

**Test**: Tab through checkboxes, verify hint appears

---

### T021: Optimize filter performance for large session lists
**Estimate**: 30 min | **Priority**: P2 | **Dependencies**: T008

Add memoization or optimization if needed.

**Files**:
- `src/app/core/services/filter.service.ts` (update)

**Acceptance**:
- [ ] Profile filter performance with 50+ sessions
- [ ] If >100ms, add memoization or debounce
- [ ] Consider RxJS operators (distinctUntilChanged, debounceTime)
- [ ] Measure and log performance in dev mode
- [ ] Target: <100ms for typical session count

**Test**: Profile with Chrome DevTools, verify <100ms response

---

## Phase 4: Testing & Validation (2.5 hours)

### T022: Write unit tests for FilterService
**Estimate**: 45 min | **Priority**: P1 | **Dependencies**: T010

Comprehensive unit tests for all service methods.

**Files**:
- `src/app/core/services/filter.service.spec.ts` (update)

**Acceptance**:
- [ ] Test: defaults to empty filters
- [ ] Test: setFilters() updates state
- [ ] Test: addFilter() adds to array
- [ ] Test: removeFilter() removes from array
- [ ] Test: clearFilters() empties array
- [ ] Test: isFilterSelected() checks correctly
- [ ] Test: applyFilters() with OR logic
- [ ] Test: generateOptions() extracts unique values
- [ ] Test: localStorage persistence
- [ ] Test: handles corrupted localStorage data
- [ ] All tests pass, 100% coverage

**Test**: Run `ng test`, verify all FilterService tests pass

---

### T023: Write unit tests for ScheduleFilter component
**Estimate**: 40 min | **Priority**: P1 | **Dependencies**: T015

Unit tests for component behavior.

**Files**:
- `src/app/shared/components/schedule-filter/schedule-filter.component.spec.ts` (update)

**Acceptance**:
- [ ] Test: component creates successfully
- [ ] Test: generates options from sessions input
- [ ] Test: toggles filter on checkbox change
- [ ] Test: clears all filters on button click
- [ ] Test: emits filtersApplied event
- [ ] Test: updates UI when filters change
- [ ] All tests pass

**Test**: Run `ng test`, all ScheduleFilter tests pass

---

### T024: Create E2E test for filter interaction
**Estimate**: 45 min | **Priority**: P1 | **Dependencies**: T016

End-to-end test for complete filter flow.

**Files**:
- `e2e/schedule-filter.spec.ts` (new)

**Acceptance**:
- [ ] Test: filter panel expands/collapses
- [ ] Test: selecting filter reduces session count
- [ ] Test: multiple filters use OR logic (count increases)
- [ ] Test: "Clear all" removes all filters
- [ ] Test: filters persist after page reload
- [ ] Test: keyboard navigation works (Tab + Space)
- [ ] Test: mobile viewport (panel full width)
- [ ] All E2E tests pass

**Test**: Run `npx playwright test`, all filter tests pass

---

### T025: Test filter with edge cases
**Estimate**: 30 min | **Priority**: P2 | **Dependencies**: T024

Test unusual scenarios.

**Files**:
- Add test cases to existing spec files

**Acceptance**:
- [ ] Test: no sessions (empty array) - no options shown
- [ ] Test: all sessions have same level - only 1 option
- [ ] Test: select all options - all sessions shown
- [ ] Test: corrupted localStorage - graceful fallback
- [ ] Test: very long filter labels - truncated or wrapped

**Test**: All edge case tests pass

---

### T026: Manual cross-device testing
**Estimate**: 10 min | **Priority**: P2 | **Dependencies**: T024

Verify filter works on different devices.

**Files**:
- N/A (manual testing)

**Acceptance**:
- [ ] Desktop: panel and checkboxes work
- [ ] Tablet: responsive layout (2 columns)
- [ ] Mobile: panel full width, touch targets ≥44px
- [ ] Landscape/portrait both work

**Test**: Test on 3+ viewport sizes, verify responsive behavior

---

## Phase 5: Documentation & Cleanup (30 min)

### T027: Update README with filter feature
**Estimate**: 15 min | **Priority**: P3 | **Dependencies**: T026

Document the filter feature.

**Files**:
- `README.md` (update)

**Acceptance**:
- [ ] Add "Schedule Filter" to features list
- [ ] Brief description: "Multi-select filter by level and age group"
- [ ] Link to quickstart.md for usage

**Test**: Read README, verify information is accurate

---

### T028: Create PR and merge checklist
**Estimate**: 15 min | **Priority**: P3 | **Dependencies**: T027

Prepare for code review.

**Files**:
- GitHub PR (create)

**Acceptance**:
- [ ] PR title: "Feature: Training Schedule Filter"
- [ ] Description references feature spec
- [ ] Checklist: All unit tests pass
- [ ] Checklist: All E2E tests pass
- [ ] Checklist: Keyboard accessible
- [ ] Checklist: Mobile responsive
- [ ] Request review

**Test**: Create PR, verify CI/CD runs successfully

---

## Summary

**Total Tasks**: 28
**Estimated Time**: 11.5 hours
**Critical Path**: T001 → T002 → T003 → T004 → T005 → T006 → T008 → T011 → T012 → T013 → T016 → T022 → T024

**Priorities**:
- **P0 (Must-have)**: Data model setup (T001-T003)
- **P1 (Critical)**: Core functionality (T004-T016, T022-T024)
- **P2 (Important)**: Polish & optimization (T015, T017, T019, T021, T025-T026)
- **P3 (Nice-to-have)**: Documentation (T018, T020, T027-T028)

**Quick Start**: Begin with T001 to extend session model, then proceed through each phase. Test filtering logic early (T008) before building UI.
