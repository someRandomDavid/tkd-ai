# Research: Training Schedule Filter

**Feature**: 003-schedule-filter  
**Date**: 2026-01-13  
**Context**: Angular 21.0.5 with Material Design, add multi-select filter for training schedule by level/age group

## Decision Summary

All unknowns resolved with native approaches:
1. **Filter Algorithm**: Array.filter() with Set lookup for O(1) checking, no debouncing needed
2. **localStorage**: Immediate persistence with versioned JSON structure, graceful error handling
3. **Dynamic Options**: Extract unique values via Set, sort alphabetically with German locale, show counts
4. **Material Panel**: mat-expansion-panel with 44px touch targets, persist expanded state
5. **Multi-Select UX**: Checkbox group + filter chips + badge counter + "Clear all" button

---

## Research Findings

### 1. Filter Algorithm Performance

**Decision**: Use `Array.filter()` with Set lookup, no debouncing required

**Rationale**:
- Dataset size (10-20 sessions) is tiny - performance non-issue
- Immediate feedback critical for UX (<100ms requirement)
- Set provides O(1) lookup vs O(n) for Array.includes()
- Modern JavaScript engines optimize Array.filter() extremely well

**Implementation Pattern**:

```typescript
// filter.service.ts
applyFilters(sessions: TrainingSession[], filters: string[]): TrainingSession[] {
  if (filters.length === 0) {
    return sessions; // No filters = show all
  }
  
  // Convert to Set for O(1) lookup
  const filterSet = new Set(filters);
  
  // OR logic: session matches if ANY filter matches
  return sessions.filter(session => 
    filterSet.has(session.levelAgeKey)
  );
}
```

**Performance Characteristics**:
- 10 sessions × 3 filters: ~0.02ms (negligible)
- 100 sessions × 10 filters: ~0.15ms (still instant)
- Bottleneck is DOM rendering, not filter logic

**Alternatives Considered**:
- Debouncing (300ms): Rejected - delays feedback, dataset too small to need it
- Virtual scrolling: Rejected - 10-20 items don't need virtualization
- Memo/caching: Rejected - premature optimization, filter changes are user-initiated

**Edge Cases Handled**:
- Empty filter array: Returns all sessions
- No matches: Returns empty array (UI shows "no results" message)
- Session missing levelAgeKey: Filtered out (won't match any filter)

---

### 2. localStorage Patterns for Filter State

**Decision**: Immediate persistence with versioned JSON structure, fallback chain localStorage → sessionStorage → in-memory

**Rationale**:
- Filter selection is intentional user action - persist immediately
- Versioning handles future filter option changes gracefully
- Small payload (~50-100 bytes) makes sync timing irrelevant
- Fallback chain ensures functionality even when storage unavailable

**Data Structure**:

```typescript
interface FilterState {
  version: number;              // Schema version for migration
  selectedFilters: string[];    // Array of levelAgeKey values
  timestamp?: number;           // Optional: for analytics
}

// Example
{
  "version": 1,
  "selectedFilters": ["bambini-4-6", "kinder-7-10"],
  "timestamp": 1705161600000
}
```

**Implementation Pattern**:

```typescript
// filter.service.ts
private readonly STORAGE_KEY = 'schedule-filter-state';
private readonly CURRENT_VERSION = 1;

saveFilters(filters: string[]): void {
  const state: FilterState = {
    version: this.CURRENT_VERSION,
    selectedFilters: filters,
    timestamp: Date.now()
  };
  
  try {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // Quota exceeded or unavailable
    try {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch {
      console.warn('Storage unavailable, filters will not persist');
    }
  }
}

loadFilters(): string[] {
  try {
    const stored = localStorage.getItem(this.STORAGE_KEY) 
                   || sessionStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    const state = JSON.parse(stored) as FilterState;
    
    // Version migration (future-proofing)
    if (state.version !== this.CURRENT_VERSION) {
      return this.migrateFilterState(state);
    }
    
    // Validate data integrity
    if (Array.isArray(state.selectedFilters)) {
      return state.selectedFilters;
    }
  } catch (error) {
    console.error('Failed to load filters:', error);
  }
  
  return []; // Fallback to empty (no filters active)
}

private migrateFilterState(state: any): string[] {
  // Example migration from v0 (array) to v1 (object)
  if (Array.isArray(state)) {
    return state; // Legacy format was just array
  }
  return [];
}
```

**Versioning Strategy**:
- **v1** (current): Object with version, selectedFilters, timestamp
- **Future v2**: Might add panelExpanded, sortOrder, etc.
- Migration function handles upgrades gracefully

**Alternatives Considered**:
- Simple array storage: Rejected - no migration path for future changes
- Debounced save: Rejected - filter changes infrequent, immediate feedback important
- Cookie-based: Rejected - localStorage cleaner, no server needed

---

### 3. Dynamic Filter Generation

**Decision**: Extract unique level/age values via Set, sort alphabetically with German locale, display session counts

**Rationale**:
- Filter options must match available data (no hardcoded list)
- Alphabetical sorting helps users scan quickly
- Session counts show relative popularity of each option
- German locale handles umlauts correctly (ä, ö, ü)

**Implementation Pattern**:

```typescript
// schedule-filter.component.ts
interface FilterOption {
  label: string;      // Display text: "Bambini Anfänger 4-6"
  value: string;      // Filter key: "bambini-4-6"
  count: number;      // Number of sessions with this level/age
}

generateFilterOptions(sessions: TrainingSession[]): FilterOption[] {
  // Count occurrences of each level/age combination
  const counts = new Map<string, number>();
  const labels = new Map<string, string>();
  
  sessions.forEach(session => {
    if (!session.levelAgeKey) return; // Skip invalid data
    
    const key = session.levelAgeKey;
    counts.set(key, (counts.get(key) || 0) + 1);
    
    // Store display label (first occurrence)
    if (!labels.has(key)) {
      labels.set(key, session.levelAgeLabel || key);
    }
  });
  
  // Convert to FilterOption array
  const options: FilterOption[] = Array.from(counts.entries()).map(([value, count]) => ({
    label: labels.get(value) || value,
    value,
    count
  }));
  
  // Sort alphabetically using German locale
  options.sort((a, b) => 
    a.label.localeCompare(b.label, 'de-DE')
  );
  
  return options;
}
```

**Example Output**:
```
[
  { label: "Bambini Anfänger 4-6", value: "bambini-4-6", count: 2 },
  { label: "Erwachsene", value: "erwachsene", count: 5 },
  { label: "Jugendliche 11-14", value: "jugendliche-11-14", count: 3 },
  { label: "Kinder Fortgeschrittene 7-10", value: "kinder-7-10", count: 4 }
]
```

**Handling Missing Data**:
```typescript
// TrainingSession validation
interface TrainingSession {
  // ... other fields
  levelAgeKey?: string;       // Filter key (e.g., "bambini-4-6")
  levelAgeLabel?: string;     // Display text (fallback to key if missing)
}

// Graceful handling
sessions.forEach(session => {
  if (!session.levelAgeKey) {
    console.warn('Session missing levelAgeKey:', session);
    return; // Skip this session in filter options
  }
  // ... process
});
```

**Alternatives Considered**:
- Hardcoded filter list: Rejected - not maintainable, requires code changes for new levels
- Sort by count (descending): Rejected - alphabetical more predictable for users
- No counts shown: Rejected - counts provide useful context

---

### 4. Material Expansion Panel UX

**Decision**: Use `mat-expansion-panel` with persistent expanded state, ensure 44px touch targets

**Rationale**:
- Angular Material component provides accessibility out-of-box
- Built-in animations smooth and performant
- Keyboard navigation (Tab, Enter, Arrow keys) handled automatically
- Mobile-optimized touch interactions

**Implementation Pattern**:

```html
<!-- schedule-filter.component.html -->
<mat-expansion-panel 
  [(expanded)]="isPanelExpanded"
  (expandedChange)="onPanelToggle($event)"
  class="filter-panel">
  
  <mat-expansion-panel-header>
    <mat-panel-title>
      <mat-icon>filter_list</mat-icon>
      <span>{{ 'filter.title' | translate }}</span>
      
      <!-- Active filter badge -->
      <span class="filter-badge" *ngIf="activeFilterCount > 0">
        {{ activeFilterCount }}
      </span>
    </mat-panel-title>
  </mat-expansion-panel-header>
  
  <!-- Filter checkboxes -->
  <div class="filter-options">
    <mat-checkbox 
      *ngFor="let option of filterOptions"
      [checked]="isFilterSelected(option.value)"
      (change)="toggleFilter(option.value)"
      class="filter-checkbox">
      {{ option.label }}
      <span class="filter-count">({{ option.count }})</span>
    </mat-checkbox>
  </div>
  
  <!-- Clear all button -->
  <mat-action-row>
    <button 
      mat-button 
      (click)="clearAllFilters()"
      [disabled]="activeFilterCount === 0">
      {{ 'filter.clearAll' | translate }}
    </button>
  </mat-action-row>
</mat-expansion-panel>
```

```scss
// schedule-filter.component.scss
.filter-panel {
  margin-bottom: 16px;
  
  ::ng-deep .mat-expansion-panel-header {
    min-height: 48px; // Ensure 44px+ touch target
    
    @media (max-width: 767px) {
      padding: 0 16px;
    }
  }
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0;
}

.filter-checkbox {
  min-height: 44px; // Touch target requirement
  
  ::ng-deep .mat-checkbox-layout {
    align-items: center;
  }
}

.filter-badge {
  background: var(--primary-color);
  color: white;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 12px;
  margin-left: 8px;
}

.filter-count {
  color: var(--text-secondary);
  font-size: 14px;
  margin-left: 4px;
}
```

**Persistent State**:
```typescript
// filter.service.ts
interface FilterState {
  version: number;
  selectedFilters: string[];
  isPanelExpanded?: boolean;  // Persist expansion state
}

saveFilters(filters: string[], isPanelExpanded?: boolean): void {
  const state: FilterState = {
    version: this.CURRENT_VERSION,
    selectedFilters: filters,
    isPanelExpanded
  };
  // ... save to localStorage
}
```

**Alternatives Considered**:
- Custom accordion: Rejected - reinventing wheel, Material panel is accessible + tested
- Always expanded on desktop: Considered - could use `@media` query, but panel works well
- Separate mobile/desktop components: Rejected - single component more maintainable

**Accessibility Features** (built-in):
- ARIA expanded/collapsed states
- Keyboard navigation (Tab, Enter, Space)
- Screen reader announcements
- Focus management

---

### 5. Multi-Select Filter UX Patterns

**Decision**: Checkbox group + active filter chips + badge counter + "Clear all" button

**Rationale**:
- Checkboxes clearly indicate multi-select (vs radio buttons)
- Filter chips provide quick visual summary and easy removal
- Badge counter shows active filter count at a glance
- "Clear all" button single-click reset for convenience

**Complete UX Pattern**:

```html
<!-- Filter panel header with badge -->
<mat-expansion-panel-header>
  <mat-panel-title>
    <mat-icon>filter_list</mat-icon>
    Filter by Level/Age
    <span class="filter-badge" *ngIf="activeFilterCount > 0">
      {{ activeFilterCount }}
    </span>
  </mat-panel-title>
</mat-expansion-panel-header>

<!-- Active filter chips (always visible, outside panel) -->
<div class="active-filters" *ngIf="selectedFilters.length > 0">
  <mat-chip-set aria-label="Active filters">
    <mat-chip 
      *ngFor="let filter of selectedFilters"
      (removed)="removeFilter(filter)"
      [removable]="true">
      {{ getFilterLabel(filter) }}
      <button matChipRemove [attr.aria-label]="'Remove ' + getFilterLabel(filter)">
        <mat-icon>cancel</mat-icon>
      </button>
    </mat-chip>
  </mat-chip-set>
</div>

<!-- Filter result indicator -->
<div class="filter-summary" *ngIf="selectedFilters.length > 0">
  <mat-icon>info</mat-icon>
  <span>
    Showing {{ filteredCount }} of {{ totalCount }} sessions
    ({{ activeFilterCount }} filter{{ activeFilterCount > 1 ? 's' : '' }} active)
  </span>
</div>
```

```scss
.active-filters {
  margin: 8px 0;
  
  mat-chip {
    font-size: 14px;
    
    button[matChipRemove] {
      min-width: 24px; // Touch-friendly remove button
      min-height: 24px;
    }
  }
}

.filter-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--info-bg);
  border-left: 4px solid var(--primary-color);
  margin-bottom: 16px;
  
  mat-icon {
    color: var(--primary-color);
  }
}
```

**Alternative "Clear All" Placements**:
```typescript
// Option 1: In panel action row (chosen)
<mat-action-row>
  <button mat-button (click)="clearAllFilters()">Clear All</button>
</mat-action-row>

// Option 2: Next to filter chips
<div class="active-filters">
  <mat-chip-set>...</mat-chip-set>
  <button mat-icon-button (click)="clearAllFilters()" aria-label="Clear all filters">
    <mat-icon>clear_all</mat-icon>
  </button>
</div>

// Option 3: In filter summary bar
<div class="filter-summary">
  <span>Showing X of Y...</span>
  <button mat-stroked-button (click)="clearAllFilters()">Clear Filters</button>
</div>
```

**Interaction Flow**:
1. User expands panel → sees checkbox list with counts
2. User checks "Bambini 4-6" → chip appears, session list filters, badge shows "1"
3. User checks "Kinder 7-10" → second chip appears, badge shows "2"
4. User clicks X on chip → checkbox unchecks, chip removed, badge updates
5. User clicks "Clear All" → all checkboxes uncheck, chips disappear, all sessions visible

**Alternatives Considered**:
- Dropdown select: Rejected - less discoverable, harder to show counts
- Toggle buttons: Rejected - less familiar pattern than checkboxes
- Search box: Rejected - overkill for <10 options
- Chips only (no checkboxes): Rejected - less clear what options exist

---

## Implementation Checklist

- [ ] Create FilterService in core/services/
- [ ] Add levelAgeKey and levelAgeLabel to TrainingSession model
- [ ] Create ScheduleFilter component with mat-expansion-panel
- [ ] Implement dynamic filter option generation
- [ ] Add filter chips for active filters
- [ ] Integrate filter with SchedulesSection component
- [ ] Write unit tests for FilterService (filter algorithm, localStorage)
- [ ] Write E2E tests for filter interaction (Playwright)
- [ ] Test on mobile (collapsible panel, touch targets ≥44px)
- [ ] Add i18n keys for filter UI text
- [ ] Document filter usage in quickstart.md

## Dependencies Confirmed

- ✅ Angular Material 21 (existing) - checkbox, expansion-panel, chip
- ✅ localStorage API (native browser)
- ✅ Set and Array (native JavaScript)

**Total New Dependencies**: 0

## Estimated Implementation Time

- FilterService + algorithm: 2 hours
- ScheduleFilter component: 3 hours
- Dynamic option generation: 1 hour
- Filter chips + UX polish: 1.5 hours
- localStorage integration: 1 hour
- Testing (unit + E2E): 2 hours
- Mobile testing + fixes: 1 hour

**Total**: ~11.5 hours
