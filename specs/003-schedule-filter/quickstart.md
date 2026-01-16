# Quickstart Guide: Training Schedule Filter

**Feature**: 003-schedule-filter  
**Date**: 2026-01-13

## Overview

This feature implements a multi-select filter for training schedules with:
- Filter by level (Anfänger, Fortgeschrittene, etc.)
- Filter by age group (Kinder, Jugendliche, Erwachsene, etc.)
- OR logic (ANY match shows session)
- Persistent user selection (localStorage)
- Dynamic option generation with counts
- Material expansion panel UI
- <100ms filter response time

---

## For Developers

### 1. Adding Filter Attributes to Sessions

#### Update TrainingSession Model

```typescript
// models/training-session.ts
export interface TrainingSession {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  location: string;
  instructor?: string;
  
  // NEW: Filter attributes
  level: string;        // "beginner", "intermediate", "advanced", "expert", "all"
  ageGroup: string;     // "kids", "teens", "adults", "seniors", "all"
  levelAgeKey: string;  // "{level}_{ageGroup}" for efficient filtering
}
```

#### Update Session Data

```json
{
  "sessions": [
    {
      "id": "session-001",
      "dayOfWeek": "monday",
      "startTime": "17:00",
      "endTime": "18:00",
      "location": "Haupthalle",
      "instructor": "Anna Schmidt",
      "level": "beginner",
      "ageGroup": "kids",
      "levelAgeKey": "beginner_kids"
    },
    {
      "id": "session-002",
      "dayOfWeek": "monday",
      "startTime": "18:00",
      "endTime": "19:30",
      "location": "Haupthalle",
      "instructor": "Hans Müller",
      "level": "intermediate",
      "ageGroup": "teens",
      "levelAgeKey": "intermediate_teens"
    }
  ]
}
```

**Helper Function** to generate `levelAgeKey`:
```typescript
function generateLevelAgeKey(level: string, ageGroup: string): string {
  return `${level}_${ageGroup}`;
}

// Apply to all sessions
sessions.forEach(session => {
  session.levelAgeKey = generateLevelAgeKey(session.level, session.ageGroup);
});
```

---

### 2. Using FilterService

#### Basic Usage in Component

```typescript
import { Component, OnInit } from '@angular/core';
import { FilterService } from './services/filter.service';
import { TrainingSession } from './models/training-session';

@Component({
  selector: 'app-schedule',
  template: `
    <app-schedule-filter 
      [sessions]="allSessions"
      (filtersApplied)="onFiltersApplied($event)">
    </app-schedule-filter>
    
    <div class="sessions-grid">
      <app-session-card 
        *ngFor="let session of filteredSessions" 
        [session]="session">
      </app-session-card>
    </div>
    
    <p *ngIf="filteredSessions.length === 0">
      {{ 'filter.results.noResults' | translate }}
    </p>
  `
})
export class ScheduleComponent implements OnInit {
  allSessions: TrainingSession[] = [];
  filteredSessions: TrainingSession[] = [];
  
  constructor(private filterService: FilterService) {}
  
  ngOnInit() {
    this.loadSessions();
    
    // Initialize filters from storage
    const savedFilters = this.filterService.initializeFilters();
    
    // Listen for filter changes
    this.filterService.filtersChanged$.subscribe(filters => {
      this.applyFilters(filters);
    });
    
    // Apply initial filters
    this.applyFilters(savedFilters);
  }
  
  loadSessions() {
    // Load from service/API
    this.allSessions = this.sessionService.getSessions();
  }
  
  applyFilters(filters: string[]) {
    this.filteredSessions = this.filterService.applyFilters(
      this.allSessions,
      filters
    );
    console.log(`Showing ${this.filteredSessions.length} of ${this.allSessions.length} sessions`);
  }
  
  onFiltersApplied(filters: string[]) {
    console.log('Filters applied:', filters);
  }
}
```

#### Direct Service Calls

```typescript
// Get current filters
const activeFilters = this.filterService.getSelectedFilters();
console.log(activeFilters); // ["beginner", "kids"]

// Set specific filters
this.filterService.setFilters(['advanced', 'adults']);

// Add single filter
this.filterService.addFilter('intermediate');

// Remove single filter
this.filterService.removeFilter('beginner');

// Clear all filters
this.filterService.clearFilters();

// Check if filter is active
const isActive = this.filterService.isFilterSelected('beginner');

// Get count for badge
const count = this.filterService.getFilterCount(); // 3
```

---

### 3. Adding ScheduleFilter Component

#### In Schedule Page

```typescript
// schedule.component.ts
import { Component } from '@angular/core';
import { ScheduleFilterComponent } from './components/schedule-filter/schedule-filter.component';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [ScheduleFilterComponent],
  template: `
    <section class="schedule-page">
      <h1>{{ 'schedule.title' | translate }}</h1>
      
      <!-- Filter Component -->
      <app-schedule-filter 
        [sessions]="allSessions"
        (filtersApplied)="handleFiltersApplied($event)">
      </app-schedule-filter>
      
      <!-- Sessions Display -->
      <div class="sessions-container">
        <app-session-card 
          *ngFor="let session of filteredSessions" 
          [session]="session">
        </app-session-card>
      </div>
      
      <!-- No Results -->
      <div *ngIf="filteredSessions.length === 0" class="no-results">
        <p>{{ 'filter.results.noResults' | translate }}</p>
        <button (click)="clearFilters()">
          {{ 'filter.clearAll' | translate }}
        </button>
      </div>
      
      <!-- Results Count -->
      <p class="results-count">
        {{ 'filter.results.showing' | translate: {count: filteredSessions.length} }}
      </p>
    </section>
  `
})
export class ScheduleComponent {
  allSessions: TrainingSession[] = [];
  filteredSessions: TrainingSession[] = [];
  
  constructor(private filterService: FilterService) {}
  
  handleFiltersApplied(filters: string[]) {
    console.log('Active filters:', filters);
  }
  
  clearFilters() {
    this.filterService.clearFilters();
  }
}
```

#### Standalone Usage

```html
<!-- Minimal -->
<app-schedule-filter [sessions]="sessions" />

<!-- With event handler -->
<app-schedule-filter 
  [sessions]="sessions" 
  (filtersApplied)="onFiltersChange($event)">
</app-schedule-filter>

<!-- With custom styling -->
<app-schedule-filter 
  [sessions]="sessions" 
  class="custom-filter">
</app-schedule-filter>
```

---

### 4. Styling Filter Component

#### Component-Specific SCSS

```scss
// schedule-filter.component.scss

.filter-container {
  margin-bottom: 2rem;
}

.filter-panel {
  // Material expansion panel is styled by theme
  background-color: var(--surface-card);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  
  .filter-title {
    font-size: 1.125rem;
    font-weight: 500;
    color: var(--text-primary);
  }
  
  .active-count {
    background-color: var(--primary-main);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 600;
  }
}

.filter-content {
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.filter-group {
  .group-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    margin-bottom: 0.75rem;
  }
  
  .filter-options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}

.filter-option {
  display: flex;
  align-items: center;
  
  mat-checkbox {
    width: 100%;
    
    ::ng-deep .mat-checkbox-label {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
  }
  
  .option-label {
    color: var(--text-primary);
  }
  
  .option-count {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  
  button {
    min-height: 44px; // Touch target
  }
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  
  .filter-chip {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: var(--primary-main);
    color: white;
    border-radius: 16px;
    font-size: 0.875rem;
    
    button {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
  }
}

// Mobile optimizations
@media (max-width: 767px) {
  .filter-panel {
    // Full width on mobile
    margin: 0 -1rem;
    border-radius: 0;
  }
  
  .filter-content {
    grid-template-columns: 1fr;
  }
}
```

---

### 5. Testing Filters

#### Manual Testing Checklist

- [ ] Filter options generate dynamically from session data
- [ ] Selecting filter immediately updates session display
- [ ] Multiple filters use OR logic (ANY match shows session)
- [ ] Filters persist after page reload
- [ ] Filter count badge shows correct number
- [ ] "Clear all" button removes all filters
- [ ] Filter chips display active filters with remove button
- [ ] Expansion panel state persists (open/closed)
- [ ] Touch targets ≥44px on mobile
- [ ] Keyboard accessible (Tab, Space, Enter)
- [ ] Screen reader announces filter changes
- [ ] Works on mobile, tablet, desktop

#### Unit Tests

```typescript
// filter.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { FilterService } from './filter.service';
import { TrainingSession } from './models/training-session';

describe('FilterService', () => {
  let service: FilterService;
  let mockSessions: TrainingSession[];
  
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterService);
    localStorage.clear();
    
    mockSessions = [
      {
        id: 's1',
        dayOfWeek: 'monday',
        startTime: '17:00',
        endTime: '18:00',
        location: 'Hall A',
        level: 'beginner',
        ageGroup: 'kids',
        levelAgeKey: 'beginner_kids'
      },
      {
        id: 's2',
        dayOfWeek: 'monday',
        startTime: '18:00',
        endTime: '19:00',
        location: 'Hall A',
        level: 'intermediate',
        ageGroup: 'teens',
        levelAgeKey: 'intermediate_teens'
      },
      {
        id: 's3',
        dayOfWeek: 'wednesday',
        startTime: '19:00',
        endTime: '20:30',
        location: 'Hall B',
        level: 'advanced',
        ageGroup: 'adults',
        levelAgeKey: 'advanced_adults'
      }
    ];
  });
  
  it('should default to no filters', () => {
    const filters = service.initializeFilters();
    expect(filters).toEqual([]);
  });
  
  it('should add filter', () => {
    service.addFilter('beginner');
    expect(service.getSelectedFilters()).toContain('beginner');
    expect(service.getFilterCount()).toBe(1);
  });
  
  it('should remove filter', () => {
    service.setFilters(['beginner', 'intermediate']);
    service.removeFilter('beginner');
    expect(service.getSelectedFilters()).toEqual(['intermediate']);
  });
  
  it('should clear all filters', () => {
    service.setFilters(['beginner', 'kids']);
    service.clearFilters();
    expect(service.getSelectedFilters()).toEqual([]);
  });
  
  it('should check if filter is selected', () => {
    service.setFilters(['beginner']);
    expect(service.isFilterSelected('beginner')).toBe(true);
    expect(service.isFilterSelected('advanced')).toBe(false);
  });
  
  it('should persist filters to localStorage', () => {
    service.setFilters(['beginner', 'kids']);
    const stored = localStorage.getItem('schedule-filter-state');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.selectedFilters).toEqual(['beginner', 'kids']);
  });
  
  it('should load filters from localStorage', () => {
    localStorage.setItem('schedule-filter-state', JSON.stringify({
      version: 1,
      selectedFilters: ['advanced', 'adults']
    }));
    const filters = service.initializeFilters();
    expect(filters).toEqual(['advanced', 'adults']);
  });
  
  it('should emit filter changes', (done) => {
    service.filtersChanged$.subscribe(filters => {
      expect(filters).toEqual(['beginner']);
      done();
    });
    service.setFilters(['beginner']);
  });
  
  describe('applyFilters', () => {
    it('should show all sessions when no filters', () => {
      const filtered = service.applyFilters(mockSessions, []);
      expect(filtered.length).toBe(3);
    });
    
    it('should filter by single level', () => {
      const filtered = service.applyFilters(mockSessions, ['beginner']);
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('s1');
    });
    
    it('should filter by single age group', () => {
      const filtered = service.applyFilters(mockSessions, ['kids']);
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('s1');
    });
    
    it('should use OR logic for multiple filters', () => {
      const filtered = service.applyFilters(mockSessions, ['beginner', 'intermediate']);
      expect(filtered.length).toBe(2);
      expect(filtered.map(s => s.id)).toEqual(['s1', 's2']);
    });
    
    it('should use OR logic across categories', () => {
      const filtered = service.applyFilters(mockSessions, ['advanced', 'kids']);
      expect(filtered.length).toBe(2);
      // s1 (kids) + s3 (advanced)
      expect(filtered.map(s => s.id)).toContain('s1');
      expect(filtered.map(s => s.id)).toContain('s3');
    });
  });
  
  describe('generateOptions', () => {
    it('should generate level options with counts', () => {
      const options = service.generateOptions(mockSessions, 'level');
      expect(options.length).toBe(3);
      expect(options.find(o => o.value === 'beginner')?.count).toBe(1);
    });
    
    it('should generate age group options with counts', () => {
      const options = service.generateOptions(mockSessions, 'ageGroup');
      expect(options.length).toBe(3);
      expect(options.find(o => o.value === 'kids')?.count).toBe(1);
    });
    
    it('should sort options alphabetically (German locale)', () => {
      const options = service.generateOptions(mockSessions, 'level');
      const labels = options.map(o => o.label);
      const sorted = [...labels].sort((a, b) => a.localeCompare(b, 'de-DE'));
      expect(labels).toEqual(sorted);
    });
  });
});
```

#### E2E Tests

```typescript
// schedule-filter.e2e.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Schedule Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/schedule');
  });
  
  test('should filter sessions by level', async ({ page }) => {
    // Get initial session count
    const initialCount = await page.locator('.session-card').count();
    expect(initialCount).toBeGreaterThan(0);
    
    // Open filter panel
    await page.click('[data-testid="filter-panel-header"]');
    
    // Select "Anfänger" filter
    await page.click('mat-checkbox:has-text("Anfänger")');
    
    // Session count should decrease
    const filteredCount = await page.locator('.session-card').count();
    expect(filteredCount).toBeLessThan(initialCount);
    
    // All visible sessions should be beginner level
    const sessions = await page.locator('.session-card').all();
    for (const session of sessions) {
      const level = await session.getAttribute('data-level');
      expect(level).toBe('beginner');
    }
  });
  
  test('should persist filters across page reloads', async ({ page }) => {
    // Open filter and select
    await page.click('[data-testid="filter-panel-header"]');
    await page.click('mat-checkbox:has-text("Kinder")');
    
    // Reload page
    await page.reload();
    
    // Filter should still be active
    const checkbox = page.locator('mat-checkbox:has-text("Kinder")');
    await expect(checkbox).toBeChecked();
  });
  
  test('should show filter count badge', async ({ page }) => {
    await page.click('[data-testid="filter-panel-header"]');
    
    // Select 3 filters
    await page.click('mat-checkbox:has-text("Anfänger")');
    await page.click('mat-checkbox:has-text("Fortgeschrittene")');
    await page.click('mat-checkbox:has-text("Kinder")');
    
    // Badge should show "3"
    const badge = page.locator('[data-testid="filter-count-badge"]');
    await expect(badge).toHaveText('3');
  });
  
  test('should clear all filters', async ({ page }) => {
    await page.click('[data-testid="filter-panel-header"]');
    
    // Select filters
    await page.click('mat-checkbox:has-text("Anfänger")');
    await page.click('mat-checkbox:has-text("Kinder")');
    
    // Click "Clear all"
    await page.click('button:has-text("Alle löschen")');
    
    // All checkboxes should be unchecked
    const checkboxes = await page.locator('mat-checkbox').all();
    for (const checkbox of checkboxes) {
      await expect(checkbox).not.toBeChecked();
    }
  });
  
  test('should use OR logic for multiple filters', async ({ page }) => {
    await page.click('[data-testid="filter-panel-header"]');
    
    // Select "Anfänger" only
    await page.click('mat-checkbox:has-text("Anfänger")');
    const beginnerCount = await page.locator('.session-card').count();
    
    // Add "Fortgeschrittene"
    await page.click('mat-checkbox:has-text("Fortgeschrittene")');
    const bothCount = await page.locator('.session-card').count();
    
    // Should show MORE sessions (OR logic, not AND)
    expect(bothCount).toBeGreaterThan(beginnerCount);
  });
  
  test('should be keyboard accessible', async ({ page }) => {
    // Tab to filter panel
    await page.keyboard.press('Tab');
    
    // Enter to expand
    await page.keyboard.press('Enter');
    
    // Tab to first checkbox
    await page.keyboard.press('Tab');
    
    // Space to check
    await page.keyboard.press('Space');
    
    // Verify filter applied
    const badge = page.locator('[data-testid="filter-count-badge"]');
    await expect(badge).toHaveText('1');
  });
});
```

---

### 6. Adding Translation Keys

#### Update German Translations

```json
{
  "filter": {
    "title": "Filter",
    "clearAll": "Alle löschen",
    "activeFilters": "Aktive Filter: {{count}}",
    "apply": "Anwenden",
    "reset": "Zurücksetzen",
    
    "level": {
      "label": "Stufe",
      "beginner": "Anfänger",
      "intermediate": "Mittelstufe",
      "advanced": "Fortgeschrittene",
      "expert": "Experten",
      "all": "Alle Stufen"
    },
    
    "ageGroup": {
      "label": "Altersgruppe",
      "kids": "Kinder (5-12)",
      "teens": "Jugendliche (13-17)",
      "adults": "Erwachsene (18+)",
      "seniors": "Senioren (60+)",
      "all": "Alle Altersgruppen"
    },
    
    "results": {
      "showing": "{{count}} Trainingseinheiten werden angezeigt",
      "noResults": "Keine Trainingseinheiten entsprechen den ausgewählten Filtern",
      "clearToSeeAll": "Filter löschen, um alle Einheiten anzuzeigen"
    },
    
    "aria": {
      "filterPanel": "Filter-Einstellungen",
      "levelFilter": "Nach Stufe filtern",
      "ageGroupFilter": "Nach Altersgruppe filtern",
      "removeFilter": "{{filter}} entfernen",
      "clearAll": "Alle Filter entfernen"
    }
  }
}
```

---

### 7. Extending Filters to Other Attributes

#### Add New Filter Category (e.g., Location)

**Step 1**: Update data model
```typescript
// Add to TrainingSession
interface TrainingSession {
  // ...existing
  location: string;  // Already exists
}

// Update VALID constants
export const VALID_LOCATIONS = [
  'haupthalle',
  'sporthalle-nord',
  'gymnastikhalle'
] as const;
```

**Step 2**: Update FilterService
```typescript
// Update applyFilters to check location
applyFilters(sessions: TrainingSession[], filters?: FilterCriteria): TrainingSession[] {
  // ... existing logic
  return sessions.filter(session => 
    filterSet.has(session.level) || 
    filterSet.has(session.ageGroup) ||
    filterSet.has(session.location)  // NEW
  );
}

// Update generateOptions to support 'location'
generateOptions(
  sessions: TrainingSession[], 
  category: 'level' | 'ageGroup' | 'location'  // NEW
): LevelAgeOption[] {
  // ... existing logic handles this dynamically
}
```

**Step 3**: Add to UI
```html
<div class="filter-group">
  <label class="group-label">{{ 'filter.location.label' | translate }}</label>
  <div class="filter-options">
    <mat-checkbox 
      *ngFor="let option of locationOptions"
      [checked]="filterService.isFilterSelected(option.value)"
      (change)="toggleFilter(option.value)">
      <span class="option-label">{{ option.label }}</span>
      <span class="option-count">({{ option.count }})</span>
    </mat-checkbox>
  </div>
</div>
```

**Step 4**: Add translations
```json
{
  "filter": {
    "location": {
      "label": "Standort",
      "haupthalle": "Haupthalle",
      "sporthalle-nord": "Sporthalle Nord",
      "gymnastikhalle": "Gymnastikhalle"
    }
  }
}
```

---

### 8. Troubleshooting

#### Filters Not Persisting

**Problem**: Filters reset after page reload

**Solution**: Check localStorage in DevTools:
1. Open DevTools > Application tab
2. Check localStorage for `schedule-filter-state` key
3. If missing, check for storage errors in console
4. Verify `setFilters()` is called on filter change

#### Wrong Sessions Showing

**Problem**: Incorrect sessions displayed with filters active

**Solution**: Verify OR logic implementation:
```typescript
// CORRECT (OR logic - ANY match)
return sessions.filter(session => 
  filterSet.has(session.level) || filterSet.has(session.ageGroup)
);

// INCORRECT (AND logic - ALL match)
return sessions.filter(session => 
  filterSet.has(session.level) && filterSet.has(session.ageGroup)
);
```

#### Filter Count Wrong

**Problem**: Option shows "(0)" but sessions exist

**Solution**: Check data consistency:
- Verify all sessions have `level` and `ageGroup` properties
- Check for typos in filter values ("beginer" vs "beginner")
- Use `levelAgeKey` generation helper to ensure consistency

#### Panel Not Expanding on Mobile

**Problem**: Expansion panel doesn't respond to touch

**Solution**: Ensure Material CDK gestures:
```typescript
// app.config.ts
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),  // Required for expansion panel
    // ...
  ]
};
```

---

## For Content Editors

### Adding New Sessions with Filters

When adding a new training session to `sessions.json`:

```json
{
  "id": "session-new",
  "dayOfWeek": "friday",
  "startTime": "18:00",
  "endTime": "19:30",
  "location": "Haupthalle",
  "instructor": "New Instructor",
  
  "level": "intermediate",     // ADD THIS
  "ageGroup": "adults",        // ADD THIS
  "levelAgeKey": "intermediate_adults"  // ADD THIS (level_ageGroup)
}
```

**Valid Level Values**:
- `beginner` - Anfänger
- `intermediate` - Mittelstufe
- `advanced` - Fortgeschrittene
- `expert` - Experten
- `all` - Alle Stufen

**Valid Age Group Values**:
- `kids` - Kinder (5-12)
- `teens` - Jugendliche (13-17)
- `adults` - Erwachsene (18+)
- `seniors` - Senioren (60+)
- `all` - Alle Altersgruppen

**levelAgeKey Format**: Always `{level}_{ageGroup}`  
Example: `beginner_kids`, `advanced_adults`, `all_all`

---

## Implementation Checklist

- [ ] FilterService created and provided in root
- [ ] TrainingSession model updated with level, ageGroup, levelAgeKey
- [ ] Session data updated with filter attributes
- [ ] ScheduleFilterComponent created
- [ ] Filter UI with Material expansion panel
- [ ] Dynamic option generation with counts
- [ ] OR logic filtering implemented
- [ ] localStorage persistence working
- [ ] Filter chips display active filters
- [ ] "Clear all" button functional
- [ ] Filter count badge showing
- [ ] Unit tests written for FilterService
- [ ] E2E tests written for filter interaction
- [ ] Keyboard accessibility verified
- [ ] Screen reader announcements working
- [ ] Mobile responsive design tested
- [ ] Translation keys added
- [ ] Documentation updated

---

## Performance Targets

- **Filter response**: <100ms (from click to UI update)
- **Initial load**: <50ms (load from localStorage)
- **Option generation**: <20ms (extract unique values)
- **Storage write**: <10ms (JSON.stringify + localStorage.setItem)

**Measurement**:
```typescript
console.time('filter-apply');
const filtered = this.filterService.applyFilters(sessions, filters);
console.timeEnd('filter-apply');
// Should log: filter-apply: 15ms (for ~50 sessions)
```

---

## Related Files

- **Service**: `src/app/services/filter.service.ts`
- **Component**: `src/app/components/schedule-filter/schedule-filter.component.ts`
- **Model**: `src/app/models/training-session.ts`
- **Data**: `src/assets/data/sessions.json`
- **Tests**: `src/app/services/filter.service.spec.ts`
- **E2E**: `e2e/schedule-filter.e2e.spec.ts`
- **Translations**: `src/assets/i18n/de.json`

---

## Support

For questions or issues:
1. Check research.md for technical decisions
2. Review data-model.md for data structures
3. See contracts/filter-service.interface.ts for API
4. Consult plan.md for architecture overview
