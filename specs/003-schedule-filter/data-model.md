# Data Model: Training Schedule Filter

**Feature**: 003-schedule-filter  
**Date**: 2026-01-13

## Overview

Multi-select filter system for training schedules allowing users to filter by level (e.g., "Anfänger", "Fortgeschrittene") and age group (e.g., "Kinder", "Erwachsene"). Uses OR logic within each category - if user selects multiple levels, sessions matching ANY selected level are shown.

---

## Type Definitions

### FilterCriteria

Array of selected filter values (strings).

```typescript
/**
 * Selected filter values
 * Each string is a level or age group key (e.g., "beginner", "kids")
 */
export type FilterCriteria = string[];
```

**Examples**:
```typescript
// No filters selected
const noFilters: FilterCriteria = [];

// Single filter
const singleFilter: FilterCriteria = ['beginner'];

// Multiple filters
const multiFilters: FilterCriteria = ['beginner', 'advanced', 'kids'];
```

---

### FilterState

Persisted filter state including version for migrations.

```typescript
/**
 * Filter state stored in localStorage
 * 
 * @property version - State version for future migrations
 * @property selectedFilters - Array of selected filter keys
 * @property isPanelExpanded - Whether filter panel is open (optional)
 */
export interface FilterState {
  /**
   * Schema version for migrations
   * Current: 1
   */
  version: number;
  
  /**
   * Selected filter keys (e.g., ["beginner", "kids"])
   */
  selectedFilters: string[];
  
  /**
   * Whether filter panel is expanded (Material expansion panel state)
   * Optional - defaults to false
   */
  isPanelExpanded?: boolean;
}
```

**Storage Key**: `'schedule-filter-state'`

**Example JSON**:
```json
{
  "version": 1,
  "selectedFilters": ["beginner", "advanced"],
  "isPanelExpanded": true
}
```

---

### LevelAgeOption

Filter option with label, value, and count of matching sessions.

```typescript
/**
 * Filter option displayed in UI
 * 
 * @property label - Display text (translated)
 * @property value - Internal key for filtering
 * @property count - Number of sessions matching this filter
 */
export interface LevelAgeOption {
  /**
   * Display label (translated)
   * Example: "Anfänger (12)" or "Kinder (8)"
   */
  label: string;
  
  /**
   * Internal value for filtering
   * Example: "beginner", "kids"
   */
  value: string;
  
  /**
   * Number of sessions matching this option
   * Used to show "(12)" count in UI
   */
  count: number;
}
```

**Example**:
```typescript
const levelOptions: LevelAgeOption[] = [
  { label: 'Anfänger', value: 'beginner', count: 12 },
  { label: 'Fortgeschrittene', value: 'advanced', count: 8 },
  { label: 'Experten', value: 'expert', count: 4 }
];

const ageOptions: LevelAgeOption[] = [
  { label: 'Kinder', value: 'kids', count: 10 },
  { label: 'Jugendliche', value: 'teens', count: 7 },
  { label: 'Erwachsene', value: 'adults', count: 15 }
];
```

---

### TrainingSession

Extended training session model with level and age group.

```typescript
/**
 * Training session with filter attributes
 * Extends existing TrainingSession model
 */
export interface TrainingSession {
  // Existing properties
  id: string;
  dayOfWeek: string;           // e.g., "monday"
  startTime: string;           // e.g., "18:00"
  endTime: string;             // e.g., "19:30"
  location: string;            // e.g., "Haupthalle"
  instructor?: string;         // e.g., "Hans Müller"
  
  // NEW: Filter attributes
  /**
   * Skill level for this session
   * Values: "beginner", "intermediate", "advanced", "expert", "all"
   */
  level: string;
  
  /**
   * Target age group for this session
   * Values: "kids", "teens", "adults", "seniors", "all"
   */
  ageGroup: string;
  
  /**
   * Combined key for efficient filtering: "{level}_{ageGroup}"
   * Example: "beginner_kids", "advanced_adults"
   * Used for O(1) Set lookups
   */
  levelAgeKey: string;
}
```

**Example JSON**:
```json
{
  "id": "session-001",
  "dayOfWeek": "monday",
  "startTime": "18:00",
  "endTime": "19:30",
  "location": "Haupthalle",
  "instructor": "Hans Müller",
  "level": "beginner",
  "ageGroup": "kids",
  "levelAgeKey": "beginner_kids"
}
```

---

## Storage Format

### localStorage Structure

**Key**: `'schedule-filter-state'`  
**Value**: JSON string of `FilterState`

**Example**:
```typescript
// Save
const state: FilterState = {
  version: 1,
  selectedFilters: ['beginner', 'kids'],
  isPanelExpanded: true
};
localStorage.setItem('schedule-filter-state', JSON.stringify(state));

// Load
const stored = localStorage.getItem('schedule-filter-state');
if (stored) {
  const state: FilterState = JSON.parse(stored);
  console.log(state.selectedFilters); // ['beginner', 'kids']
}
```

**Versioning Strategy**:
```typescript
// v1 (current)
interface FilterStateV1 {
  version: 1;
  selectedFilters: string[];
  isPanelExpanded?: boolean;
}

// v2 (future example: add timestamp)
interface FilterStateV2 {
  version: 2;
  selectedFilters: string[];
  isPanelExpanded?: boolean;
  lastModified?: number;
}

// Migration function
function migrateFilterState(stored: string): FilterState {
  try {
    const parsed = JSON.parse(stored);
    
    if (parsed.version === 2) {
      // Already v2
      return parsed as FilterStateV2;
    }
    
    if (parsed.version === 1) {
      // Migrate v1 → v2
      return {
        version: 2,
        selectedFilters: parsed.selectedFilters,
        isPanelExpanded: parsed.isPanelExpanded,
        lastModified: Date.now()
      };
    }
    
    // Unknown version, reset
    return getDefaultFilterState();
  } catch {
    return getDefaultFilterState();
  }
}
```

---

## Constants

```typescript
// filter.constants.ts

/**
 * localStorage key for filter state
 */
export const FILTER_STORAGE_KEY = 'schedule-filter-state';

/**
 * Current filter state schema version
 */
export const FILTER_STATE_VERSION = 1;

/**
 * Default filter state (no filters selected)
 */
export const DEFAULT_FILTER_STATE: FilterState = {
  version: FILTER_STATE_VERSION,
  selectedFilters: [],
  isPanelExpanded: false
};

/**
 * Filter categories
 */
export const FILTER_CATEGORIES = {
  LEVEL: 'level',
  AGE_GROUP: 'ageGroup'
} as const;

/**
 * Predefined level values (for validation)
 */
export const VALID_LEVELS = [
  'beginner',
  'intermediate',
  'advanced',
  'expert',
  'all'
] as const;

/**
 * Predefined age group values (for validation)
 */
export const VALID_AGE_GROUPS = [
  'kids',
  'teens',
  'adults',
  'seniors',
  'all'
] as const;
```

---

## Filter Logic

### OR Logic Within Category

When multiple filters are selected, ANY match shows the session.

```typescript
/**
 * Filter sessions by selected criteria (OR logic)
 * 
 * @param sessions - All training sessions
 * @param selectedFilters - Selected filter keys
 * @returns Filtered sessions
 * 
 * @example
 * // User selects: ["beginner", "kids"]
 * // Shows sessions that are:
 * //   - beginner level (any age) OR
 * //   - kids age group (any level)
 */
function filterSessions(
  sessions: TrainingSession[],
  selectedFilters: string[]
): TrainingSession[] {
  // No filters = show all
  if (selectedFilters.length === 0) {
    return sessions;
  }
  
  // Build Set for O(1) lookups
  const filterSet = new Set(selectedFilters);
  
  // Filter sessions
  return sessions.filter(session => {
    // Match if level OR ageGroup is in filter set
    return filterSet.has(session.level) || filterSet.has(session.ageGroup);
  });
}
```

**Performance**: O(n) where n = number of sessions  
**Typical**: ~20-50 sessions, <100ms response time

---

### Dynamic Option Generation

Extract unique levels and age groups from sessions with counts.

```typescript
/**
 * Generate filter options from sessions
 * 
 * @param sessions - All training sessions
 * @param category - 'level' or 'ageGroup'
 * @returns Sorted options with counts
 */
function generateOptions(
  sessions: TrainingSession[],
  category: 'level' | 'ageGroup'
): LevelAgeOption[] {
  // Count occurrences
  const counts = new Map<string, number>();
  
  for (const session of sessions) {
    const value = category === 'level' ? session.level : session.ageGroup;
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  
  // Convert to options
  const options: LevelAgeOption[] = [];
  for (const [value, count] of counts) {
    options.push({
      label: translateKey(`filter.${category}.${value}`), // e.g., "Anfänger"
      value,
      count
    });
  }
  
  // Sort alphabetically (German locale)
  options.sort((a, b) => a.label.localeCompare(b.label, 'de-DE'));
  
  return options;
}
```

**Example Output**:
```typescript
// For levels
[
  { label: 'Anfänger', value: 'beginner', count: 12 },
  { label: 'Fortgeschrittene', value: 'advanced', count: 8 },
  { label: 'Alle Stufen', value: 'all', count: 5 }
]

// For age groups
[
  { label: 'Erwachsene', value: 'adults', count: 15 },
  { label: 'Jugendliche', value: 'teens', count: 7 },
  { label: 'Kinder', value: 'kids', count: 10 }
]
```

---

## Validation Rules

### FilterCriteria Validation

```typescript
/**
 * Validate filter criteria array
 * 
 * @param criteria - Filter values to validate
 * @returns Valid filter criteria (removes invalid values)
 */
function validateFilterCriteria(criteria: unknown): FilterCriteria {
  if (!Array.isArray(criteria)) {
    return [];
  }
  
  // Filter out non-strings and invalid values
  const validValues = new Set([...VALID_LEVELS, ...VALID_AGE_GROUPS]);
  
  return criteria.filter(
    (item): item is string => 
      typeof item === 'string' && validValues.has(item as any)
  );
}
```

### FilterState Validation

```typescript
/**
 * Validate and sanitize filter state from storage
 * 
 * @param stored - Parsed JSON from localStorage
 * @returns Valid FilterState or default
 */
function validateFilterState(stored: unknown): FilterState {
  if (!stored || typeof stored !== 'object') {
    return DEFAULT_FILTER_STATE;
  }
  
  const state = stored as Partial<FilterState>;
  
  // Validate version
  if (typeof state.version !== 'number' || state.version < 1) {
    return DEFAULT_FILTER_STATE;
  }
  
  // Validate selectedFilters
  const selectedFilters = validateFilterCriteria(state.selectedFilters);
  
  // Validate isPanelExpanded (optional)
  const isPanelExpanded = typeof state.isPanelExpanded === 'boolean'
    ? state.isPanelExpanded
    : false;
  
  return {
    version: state.version,
    selectedFilters,
    isPanelExpanded
  };
}
```

---

## Translation Keys

### Filter Labels

```json
{
  "filter": {
    "title": "Filter",
    "clearAll": "Alle löschen",
    "activeFilters": "Aktive Filter",
    
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
      "showing": "{{count}} Trainingseinheiten",
      "noResults": "Keine Trainingseinheiten gefunden"
    }
  }
}
```

---

## Example Data

### Sample Training Sessions

```json
[
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
  },
  {
    "id": "session-003",
    "dayOfWeek": "wednesday",
    "startTime": "19:00",
    "endTime": "20:30",
    "location": "Sporthalle Nord",
    "instructor": "Maria Weber",
    "level": "advanced",
    "ageGroup": "adults",
    "levelAgeKey": "advanced_adults"
  },
  {
    "id": "session-004",
    "dayOfWeek": "friday",
    "startTime": "17:00",
    "endTime": "18:30",
    "location": "Haupthalle",
    "instructor": "Klaus Fischer",
    "level": "all",
    "ageGroup": "all",
    "levelAgeKey": "all_all"
  }
]
```

### Sample Filter State

```json
{
  "version": 1,
  "selectedFilters": ["beginner", "intermediate", "kids"],
  "isPanelExpanded": true
}
```

**Result**: Shows sessions matching:
- `level: "beginner"` OR
- `level: "intermediate"` OR
- `ageGroup: "kids"`

→ Sessions 001, 002 visible (session 001 matches both beginner+kids)

---

## Error Handling

### Storage Errors

```typescript
enum FilterStorageError {
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  UNAVAILABLE = 'UNAVAILABLE',
  CORRUPTED = 'CORRUPTED',
  PARSE_ERROR = 'PARSE_ERROR'
}

interface FilterError {
  type: FilterStorageError;
  message: string;
  fallback: FilterState;
}

/**
 * Load filter state with error handling
 */
function loadFilterStateSafely(): FilterState {
  try {
    const stored = localStorage.getItem(FILTER_STORAGE_KEY);
    
    if (!stored) {
      return DEFAULT_FILTER_STATE;
    }
    
    const parsed = JSON.parse(stored);
    return validateFilterState(parsed);
    
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('Filter state corrupted, resetting:', error);
      // Clear corrupted state
      try {
        localStorage.removeItem(FILTER_STORAGE_KEY);
      } catch {
        // Ignore
      }
    }
    
    return DEFAULT_FILTER_STATE;
  }
}

/**
 * Save filter state with error handling
 */
function saveFilterStateSafely(state: FilterState): boolean {
  try {
    const json = JSON.stringify(state);
    localStorage.setItem(FILTER_STORAGE_KEY, json);
    return true;
    
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded');
      // Try clearing old data
      try {
        localStorage.removeItem('old-unused-key');
        localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(state));
        return true;
      } catch {
        return false;
      }
    }
    
    console.error('Failed to save filter state:', error);
    return false;
  }
}
```

---

## Testing Data

### Unit Test Fixtures

```typescript
// filter.fixtures.ts

export const MOCK_SESSIONS: TrainingSession[] = [
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

export const FILTER_SCENARIOS = [
  {
    description: 'No filters - all sessions visible',
    selectedFilters: [],
    expectedIds: ['s1', 's2', 's3']
  },
  {
    description: 'Single level filter',
    selectedFilters: ['beginner'],
    expectedIds: ['s1']
  },
  {
    description: 'Single age filter',
    selectedFilters: ['kids'],
    expectedIds: ['s1']
  },
  {
    description: 'Multiple levels (OR logic)',
    selectedFilters: ['beginner', 'intermediate'],
    expectedIds: ['s1', 's2']
  },
  {
    description: 'Mixed level + age (OR logic)',
    selectedFilters: ['advanced', 'kids'],
    expectedIds: ['s1', 's3']  // s1 (kids) + s3 (advanced)
  }
];
```

---

## Summary

### Data Entities
- **FilterCriteria**: `string[]` of selected filter keys
- **FilterState**: Versioned state with `selectedFilters` and `isPanelExpanded`
- **LevelAgeOption**: Filter option with label, value, count
- **TrainingSession**: Extended with `level`, `ageGroup`, `levelAgeKey`

### Storage Strategy
- **Format**: JSON in localStorage
- **Key**: `'schedule-filter-state'`
- **Version**: Numbered for migrations
- **Persistence**: Immediate on every change

### Filter Algorithm
- **Logic**: OR within category (ANY match shows session)
- **Performance**: O(n) with Set for O(1) lookups
- **Response Time**: <100ms for ~50 sessions

### Validation
- Array type checking for `FilterCriteria`
- Whitelisted values from `VALID_LEVELS` and `VALID_AGE_GROUPS`
- Version validation with fallback to default

### No Server Component
- All client-side filtering
- No API calls required
- No backend persistence
