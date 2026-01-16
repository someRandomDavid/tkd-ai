# Data Model: Dark/Light Theme Toggle

**Feature**: 002-theme-toggle  
**Date**: 2026-01-13

## Type Definitions

### ThemePreference

User's selected theme choice.

```typescript
/**
 * Theme preference type
 * @type {'dark' | 'light'}
 */
export type ThemePreference = 'dark' | 'light';
```

**Values**:
- `'dark'`: Dark theme (default)
- `'light'`: Light theme

**Storage**: localStorage key `'theme-preference'`

**Validation**:
```typescript
function isValidTheme(value: unknown): value is ThemePreference {
  return value === 'dark' || value === 'light';
}

function sanitizeTheme(value: unknown): ThemePreference {
  return isValidTheme(value) ? value : 'dark';
}
```

---

## Storage Format

### localStorage Structure

**Key**: `'theme-preference'`  
**Value**: `'dark'` | `'light'` (raw string, not JSON)

**Example**:
```typescript
// Save
localStorage.setItem('theme-preference', 'light');

// Load
const theme = localStorage.getItem('theme-preference'); // 'light' | null
```

**Rationale for Simple String**:
- Minimal storage footprint (4-5 bytes)
- No JSON parsing overhead
- Direct comparison without deserialization
- Easier debugging in DevTools

**Alternative: JSON Format** (if expanding state in future):
```typescript
interface ThemeState {
  preference: ThemePreference;
  version: number;
  timestamp?: number;
}

// Would allow future expansion like:
{
  "preference": "dark",
  "version": 1,
  "timestamp": 1705161600000,
  "autoSwitch": false  // Future: time-based switching
}
```

---

## Constants

```typescript
// theme.constants.ts

/**
 * localStorage key for theme preference
 */
export const THEME_STORAGE_KEY = 'theme-preference';

/**
 * Default theme when no preference saved
 */
export const DEFAULT_THEME: ThemePreference = 'dark';

/**
 * CSS class applied to body for light theme
 */
export const LIGHT_THEME_CLASS = 'light-theme';

/**
 * Theme toggle transition duration (milliseconds)
 */
export const THEME_TRANSITION_DURATION = 200;
```

---

## CSS Custom Properties

### Theme Variables

```scss
// _themes.scss

// Dark Theme (default)
:root {
  // Surface colors
  --surface-bg: #000000;           // Pure black
  --surface-card: #1a1a1a;         // Very dark gray
  --surface-elevated: #2d2d2d;     // Dark gray
  
  // Text colors
  --text-primary: #ffffff;         // White
  --text-secondary: #b3b3b3;       // Light gray
  --text-disabled: #666666;        // Medium gray
  
  // Primary palette (red-based)
  --primary-main: #dc143c;         // Crimson red
  --primary-light: #ff4757;        // Lighter red
  --primary-dark: #a00000;         // Dark red
  
  // Accent colors
  --accent-main: #ff6b6b;          // Coral red
  --error-main: #ff0000;           // Pure red
  --warning-main: #ff8c00;         // Dark orange
  
  // Borders & dividers
  --border-color: rgba(255, 255, 255, 0.12);
  --divider-color: rgba(255, 255, 255, 0.12);
}

// Light Theme
body.light-theme {
  // Surface colors
  --surface-bg: #ffffff;           // Pure white
  --surface-card: #f5f5f5;         // Very light gray
  --surface-elevated: #ffffff;     // White
  
  // Text colors
  --text-primary: #000000;         // Black
  --text-secondary: #4d4d4d;       // Dark gray
  --text-disabled: #999999;        // Medium gray
  
  // Primary palette (red-based)
  --primary-main: #c81e1e;         // Strong red
  --primary-light: #e53935;        // Bright red
  --primary-dark: #8b0000;         // Dark red
  
  // Accent colors
  --accent-main: #d32f2f;          // Red accent
  --error-main: #c62828;           // Dark red
  --warning-main: #e64a19;         // Red-orange
  
  // Borders & dividers
  --border-color: rgba(0, 0, 0, 0.12);
  --divider-color: rgba(0, 0, 0, 0.12);
}
```

---

## Component Models

### ThemeToggle Component

**Inputs**: None (uses service state)

**Outputs**:
```typescript
@Output() themeChanged = new EventEmitter<ThemePreference>();
```

**Internal State**:
```typescript
export class ThemeToggleComponent {
  currentTheme: ThemePreference = 'dark';
  
  // Icon changes based on theme
  get icon(): string {
    return this.currentTheme === 'dark' ? 'light_mode' : 'dark_mode';
  }
  
  // ARIA label for screen readers
  get ariaLabel(): string {
    return this.currentTheme === 'dark' 
      ? 'Switch to light mode' 
      : 'Switch to dark mode';
  }
}
```

---

## Validation Rules

### ThemePreference Validation

1. **Type Safety**: Must be exactly `'dark'` or `'light'`
2. **Null Handling**: null/undefined defaults to `'dark'`
3. **Invalid Values**: Any other string defaults to `'dark'`
4. **Case Sensitivity**: Must be lowercase (no 'Dark' or 'LIGHT')

**Implementation**:
```typescript
class ThemeValidator {
  static validate(value: unknown): ThemePreference {
    if (typeof value !== 'string') {
      return DEFAULT_THEME;
    }
    
    const normalized = value.toLowerCase();
    return normalized === 'light' ? 'light' : DEFAULT_THEME;
  }
  
  static isValid(value: unknown): value is ThemePreference {
    return value === 'dark' || value === 'light';
  }
}
```

---

## Migration Strategy

### Future Expansion

If state needs to expand beyond simple string:

```typescript
// v1: Simple string
localStorage.setItem('theme-preference', 'dark');

// v2: JSON object (future)
interface ThemeStateV2 {
  version: 2;
  preference: ThemePreference;
  autoSwitch: boolean;
  schedule?: {
    darkStart: string;  // "18:00"
    lightStart: string; // "06:00"
  };
}

// Migration function
function migrateThemeState(): ThemePreference {
  const stored = localStorage.getItem('theme-preference');
  
  // v1: Simple string
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }
  
  // v2: JSON object
  try {
    const state = JSON.parse(stored || '{}') as ThemeStateV2;
    if (state.version === 2 && isValidTheme(state.preference)) {
      return state.preference;
    }
  } catch {
    // Invalid JSON, use default
  }
  
  return DEFAULT_THEME;
}
```

---

## Error Handling

### Storage Errors

```typescript
enum ThemeStorageError {
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  UNAVAILABLE = 'UNAVAILABLE',
  CORRUPTED = 'CORRUPTED',
}

interface ThemeError {
  type: ThemeStorageError;
  message: string;
  fallback: ThemePreference;
}

// Error handling examples
function handleStorageError(error: unknown): ThemeError {
  if (error instanceof DOMException && error.name === 'QuotaExceededError') {
    return {
      type: ThemeStorageError.QUOTA_EXCEEDED,
      message: 'localStorage quota exceeded',
      fallback: DEFAULT_THEME
    };
  }
  
  return {
    type: ThemeStorageError.UNAVAILABLE,
    message: 'localStorage unavailable',
    fallback: DEFAULT_THEME
  };
}
```

---

## Type Guard Examples

```typescript
// Type guard for ThemePreference
export function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'dark' || value === 'light';
}

// Safe theme loader
export function loadThemeSafely(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(stored) ? stored : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

// Safe theme saver
export function saveThemeSafely(theme: ThemePreference): boolean {
  if (!isThemePreference(theme)) {
    console.error('Invalid theme preference:', theme);
    return false;
  }
  
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    return true;
  } catch (error) {
    console.error('Failed to save theme:', error);
    
    // Try sessionStorage fallback
    try {
      sessionStorage.setItem(THEME_STORAGE_KEY, theme);
      return true;
    } catch {
      return false;
    }
  }
}
```

---

## Testing Data

### Unit Test Fixtures

```typescript
// theme.fixtures.ts

export const VALID_THEMES: ThemePreference[] = ['dark', 'light'];

export const INVALID_THEME_VALUES = [
  'Dark',           // Wrong case
  'LIGHT',          // Wrong case
  'blue',           // Invalid value
  'auto',           // Not supported
  '',               // Empty string
  null,             // Null
  undefined,        // Undefined
  123,              // Number
  {},               // Object
  [],               // Array
];

export const STORAGE_SCENARIOS = [
  { key: 'theme-preference', value: 'dark', expected: 'dark' },
  { key: 'theme-preference', value: 'light', expected: 'light' },
  { key: 'theme-preference', value: null, expected: 'dark' },
  { key: 'theme-preference', value: 'invalid', expected: 'dark' },
];
```

---

## Summary

### Data Entities
- **ThemePreference**: `'dark' | 'light'` type
- **Storage Key**: `'theme-preference'` string
- **CSS Class**: `'light-theme'` applied to body

### Storage Strategy
- **Format**: Simple string (not JSON)
- **Location**: localStorage primary, sessionStorage fallback
- **Default**: `'dark'` when no preference exists

### Validation
- Type guard: `isThemePreference()`
- Sanitizer: `sanitizeTheme()` defaults to 'dark'
- Case-insensitive loading with normalization

### No Server Component
- All client-side only
- No API calls required
- No backend persistence
