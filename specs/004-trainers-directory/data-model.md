# Data Model: Trainers Directory

**Feature**: 004-trainers-directory  
**Date**: 2026-01-13

## Overview

Trainers directory displaying ~20 trainer profiles with photos, training programs, special roles, and contact information. Uses static JSON data with client-side German alphabetical sorting and responsive CSS Grid layout.

---

## Type Definitions

### Trainer

Individual trainer profile with photo and program information.

```typescript
/**
 * Trainer profile
 * 
 * @property id - Unique identifier (kebab-case of name)
 * @property firstName - First name
 * @property lastName - Last name (used for German alphabetical sorting)
 * @property photoUrl - Relative path to profile photo
 * @property programs - Array of training program keys
 * @property specialRoles - Array of special role keys (optional)
 * @property email - Contact email (optional)
 * @property phone - Contact phone (optional)
 * @property bio - Short biography (optional)
 * @property certifications - Array of certification keys (optional)
 * @property sortKey - Pre-computed sort key for German locale (optional, auto-generated)
 */
export interface Trainer {
  /**
   * Unique identifier (kebab-case)
   * Example: "hans-mueller", "anna-schmidt"
   */
  id: string;
  
  /**
   * First name
   */
  firstName: string;
  
  /**
   * Last name (used for German alphabetical sorting)
   */
  lastName: string;
  
  /**
   * Profile photo URL (relative path)
   * Example: "assets/images/trainers/hans-mueller.webp"
   */
  photoUrl: string;
  
  /**
   * Training programs this trainer teaches
   * Values: "kids", "teens", "adults", "competition", "forms", "selfdefense"
   */
  programs: string[];
  
  /**
   * Special roles/titles
   * Values: "head-instructor", "assistant", "competition-coach", "forms-specialist"
   * Optional
   */
  specialRoles?: string[];
  
  /**
   * Contact email (optional)
   */
  email?: string;
  
  /**
   * Contact phone (optional)
   */
  phone?: string;
  
  /**
   * Short biography in German (optional)
   * 2-3 sentences max
   */
  bio?: string;
  
  /**
   * Certifications/qualifications
   * Values: "dan-1", "dan-2", "dan-3", "dan-4", "dan-5", "instructor-license"
   * Optional
   */
  certifications?: string[];
  
  /**
   * Pre-computed sort key for German locale
   * Auto-generated from lastName if not provided
   * Used for efficient sorting without repeated localeCompare calls
   */
  sortKey?: string;
}
```

---

### TrainersData

Root data structure for trainers JSON file.

```typescript
/**
 * Trainers data file structure
 */
export interface TrainersData {
  /**
   * Schema version for future migrations
   */
  version: number;
  
  /**
   * Last updated timestamp (ISO 8601)
   */
  lastUpdated: string;
  
  /**
   * Array of trainer profiles
   */
  trainers: Trainer[];
}
```

**Example JSON**:
```json
{
  "version": 1,
  "lastUpdated": "2026-01-13T10:00:00Z",
  "trainers": [
    {
      "id": "hans-mueller",
      "firstName": "Hans",
      "lastName": "Müller",
      "photoUrl": "assets/images/trainers/hans-mueller.webp",
      "programs": ["adults", "competition"],
      "specialRoles": ["head-instructor"],
      "email": "hans.mueller@example.com",
      "phone": "+49 123 456789",
      "bio": "Trainiert seit 1995 Taekwon-do. Mehrfacher deutscher Meister in Formen und Kampf.",
      "certifications": ["dan-5", "instructor-license"],
      "sortKey": "mueller"
    },
    {
      "id": "anna-schmidt",
      "firstName": "Anna",
      "lastName": "Schmidt",
      "photoUrl": "assets/images/trainers/anna-schmidt.webp",
      "programs": ["kids", "forms"],
      "specialRoles": ["forms-specialist"],
      "certifications": ["dan-3", "instructor-license"],
      "sortKey": "schmidt"
    }
  ]
}
```

---

## Constants

```typescript
// trainer.constants.ts

/**
 * Valid training program keys
 */
export const VALID_PROGRAMS = [
  'kids',
  'teens',
  'adults',
  'competition',
  'forms',
  'selfdefense'
] as const;

/**
 * Valid special role keys
 */
export const VALID_ROLES = [
  'head-instructor',
  'assistant',
  'competition-coach',
  'forms-specialist',
  'selfdefense-instructor'
] as const;

/**
 * Valid certification keys
 */
export const VALID_CERTIFICATIONS = [
  'dan-1',
  'dan-2',
  'dan-3',
  'dan-4',
  'dan-5',
  'dan-6',
  'instructor-license',
  'referee-license'
] as const;

/**
 * Default trainer photo (placeholder/fallback)
 */
export const DEFAULT_TRAINER_PHOTO = 'assets/images/trainers/placeholder.svg';

/**
 * Trainer photo dimensions (square)
 */
export const TRAINER_PHOTO_SIZE = {
  width: 400,
  height: 400,
  minWidth: 300,
  minHeight: 300
} as const;

/**
 * Number of trainers to load eagerly (rest lazy-loaded)
 */
export const EAGER_LOAD_COUNT = 6;
```

---

## German Alphabetical Sorting

### Sort Key Generation

```typescript
/**
 * Generate German locale sort key from last name
 * Handles umlauts (ä, ö, ü) correctly
 * 
 * @param lastName - Trainer's last name
 * @returns Normalized sort key
 */
function generateSortKey(lastName: string): string {
  return lastName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove diacritics
}

// Examples:
generateSortKey('Müller');  // 'muller'
generateSortKey('Öztürk');  // 'ozturk'
generateSortKey('Schmidt'); // 'schmidt'
```

### Sorting Implementation

```typescript
/**
 * Sort trainers alphabetically by last name (German locale)
 * 
 * @param trainers - Array of trainers
 * @returns Sorted array (does not mutate original)
 */
function sortTrainersAlphabetically(trainers: Trainer[]): Trainer[] {
  return [...trainers].sort((a, b) => 
    a.lastName.localeCompare(b.lastName, 'de-DE')
  );
}

// With pre-computed sort keys (more efficient for large lists):
function sortTrainersWithKeys(trainers: Trainer[]): Trainer[] {
  return [...trainers].sort((a, b) => {
    const keyA = a.sortKey || generateSortKey(a.lastName);
    const keyB = b.sortKey || generateSortKey(b.lastName);
    return keyA.localeCompare(keyB, 'de-DE');
  });
}
```

**Performance**: O(n log n) where n = number of trainers (~20)  
**Typical**: <5ms for 20 trainers

---

## Photo Management

### Photo Naming Convention

```
assets/images/trainers/
├── {id}.webp         # WebP format (primary)
├── {id}.jpg          # JPEG fallback
├── placeholder.svg   # Fallback for missing photos
```

**Examples**:
- `hans-mueller.webp`
- `anna-schmidt.webp`
- `maria-weber.webp`

### Responsive Images

```html
<picture>
  <source 
    srcset="
      assets/images/trainers/hans-mueller-300w.webp 300w,
      assets/images/trainers/hans-mueller-400w.webp 400w,
      assets/images/trainers/hans-mueller-600w.webp 600w
    "
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    type="image/webp">
  <source 
    srcset="
      assets/images/trainers/hans-mueller-300w.jpg 300w,
      assets/images/trainers/hans-mueller-400w.jpg 400w,
      assets/images/trainers/hans-mueller-600w.jpg 600w
    "
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    type="image/jpeg">
  <img 
    src="assets/images/trainers/hans-mueller-400w.jpg"
    alt="Hans Müller"
    loading="lazy"
    width="400"
    height="400">
</picture>
```

### Lazy Loading Strategy

```typescript
/**
 * Determine if trainer photo should be lazy-loaded
 * First N trainers load eagerly, rest lazily
 * 
 * @param index - Trainer index in sorted array
 * @returns 'eager' or 'lazy'
 */
function getLoadingStrategy(index: number): 'eager' | 'lazy' {
  return index < EAGER_LOAD_COUNT ? 'eager' : 'lazy';
}

// Usage in template:
// <img [loading]="getLoadingStrategy(i)" />
```

**Eager Load**: First 6 trainers (above fold)  
**Lazy Load**: Remaining trainers (below fold)  
**Bandwidth Savings**: ~80% reduction for initial load

---

## Placeholder/Fallback

### Initials Placeholder

When photo is missing or fails to load, show initials on gradient background.

```typescript
/**
 * Generate initials from trainer name
 * 
 * @param firstName - First name
 * @param lastName - Last name
 * @returns Initials (e.g., "HM", "AS")
 */
function generateInitials(firstName: string, lastName: string): string {
  const first = firstName.charAt(0).toUpperCase();
  const last = lastName.charAt(0).toUpperCase();
  return `${first}${last}`;
}

/**
 * Generate gradient background color based on name
 * Deterministic - same name always gets same color
 * 
 * @param name - Full name
 * @returns CSS linear-gradient string
 */
function generateGradient(name: string): string {
  const hash = name.split('').reduce((acc, char) => 
    acc + char.charCodeAt(0), 0
  );
  const hue = hash % 360;
  return `linear-gradient(135deg, hsl(${hue}, 50%, 45%), hsl(${hue + 40}, 50%, 55%))`;
}
```

**Example CSS**:
```scss
.trainer-photo-placeholder {
  width: 400px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, #3f51b5, #5c6bc0);
  border-radius: 8px;
}
```

**WCAG AA Compliance**:
- White text on gradient: 4.73:1 contrast ratio
- Minimum 4.5:1 required for normal text ✓

---

## Validation Rules

### Trainer Validation

```typescript
/**
 * Validate trainer object
 * 
 * @param trainer - Trainer to validate
 * @returns true if valid, false otherwise
 */
function validateTrainer(trainer: unknown): trainer is Trainer {
  if (!trainer || typeof trainer !== 'object') {
    return false;
  }
  
  const t = trainer as Partial<Trainer>;
  
  // Required fields
  if (!t.id || typeof t.id !== 'string') return false;
  if (!t.firstName || typeof t.firstName !== 'string') return false;
  if (!t.lastName || typeof t.lastName !== 'string') return false;
  if (!t.photoUrl || typeof t.photoUrl !== 'string') return false;
  if (!Array.isArray(t.programs) || t.programs.length === 0) return false;
  
  // Validate programs
  const validPrograms = new Set(VALID_PROGRAMS);
  if (!t.programs.every(p => validPrograms.has(p as any))) {
    return false;
  }
  
  // Validate special roles (optional)
  if (t.specialRoles) {
    if (!Array.isArray(t.specialRoles)) return false;
    const validRoles = new Set(VALID_ROLES);
    if (!t.specialRoles.every(r => validRoles.has(r as any))) {
      return false;
    }
  }
  
  // Validate certifications (optional)
  if (t.certifications) {
    if (!Array.isArray(t.certifications)) return false;
    const validCerts = new Set(VALID_CERTIFICATIONS);
    if (!t.certifications.every(c => validCerts.has(c as any))) {
      return false;
    }
  }
  
  return true;
}
```

### TrainersData Validation

```typescript
/**
 * Validate and sanitize trainers data from JSON
 * 
 * @param data - Parsed JSON data
 * @returns Valid TrainersData or default
 */
function validateTrainersData(data: unknown): TrainersData {
  if (!data || typeof data !== 'object') {
    return getDefaultTrainersData();
  }
  
  const d = data as Partial<TrainersData>;
  
  // Validate version
  if (typeof d.version !== 'number' || d.version < 1) {
    console.warn('Invalid trainers data version');
    return getDefaultTrainersData();
  }
  
  // Validate trainers array
  if (!Array.isArray(d.trainers)) {
    console.error('Trainers data missing trainers array');
    return getDefaultTrainersData();
  }
  
  // Filter out invalid trainers
  const validTrainers = d.trainers.filter(validateTrainer);
  
  if (validTrainers.length === 0) {
    console.error('No valid trainers found');
    return getDefaultTrainersData();
  }
  
  return {
    version: d.version,
    lastUpdated: d.lastUpdated || new Date().toISOString(),
    trainers: validTrainers
  };
}

function getDefaultTrainersData(): TrainersData {
  return {
    version: 1,
    lastUpdated: new Date().toISOString(),
    trainers: []
  };
}
```

---

## Translation Keys

### Trainer Labels

```json
{
  "trainers": {
    "title": "Unsere Trainer",
    "subtitle": "Erfahrene Instruktoren mit Leidenschaft für Taekwon-do",
    "loadMore": "Mehr laden",
    "contact": "Kontakt",
    "email": "E-Mail",
    "phone": "Telefon",
    "bio": "Über",
    
    "programs": {
      "label": "Trainingsprogramme",
      "kids": "Kindertraining",
      "teens": "Jugendtraining",
      "adults": "Erwachsenentraining",
      "competition": "Wettkampftraining",
      "forms": "Formen",
      "selfdefense": "Selbstverteidigung"
    },
    
    "roles": {
      "head-instructor": "Cheftrainer",
      "assistant": "Assistenztrainer",
      "competition-coach": "Wettkampftrainer",
      "forms-specialist": "Formen-Spezialist",
      "selfdefense-instructor": "Selbstverteidigungstrainer"
    },
    
    "certifications": {
      "label": "Qualifikationen",
      "dan-1": "1. Dan",
      "dan-2": "2. Dan",
      "dan-3": "3. Dan",
      "dan-4": "4. Dan",
      "dan-5": "5. Dan",
      "dan-6": "6. Dan",
      "instructor-license": "Trainerlizenz",
      "referee-license": "Kampfrichterlizenz"
    },
    
    "noPhoto": "Kein Foto verfügbar",
    "photoAlt": "Profilfoto von {{name}}"
  }
}
```

---

## Example Data

### Sample Trainers JSON

```json
{
  "version": 1,
  "lastUpdated": "2026-01-13T10:00:00Z",
  "trainers": [
    {
      "id": "hans-mueller",
      "firstName": "Hans",
      "lastName": "Müller",
      "photoUrl": "assets/images/trainers/hans-mueller.webp",
      "programs": ["adults", "competition"],
      "specialRoles": ["head-instructor"],
      "email": "hans.mueller@tkd-ailingen.de",
      "phone": "+49 7541 123456",
      "bio": "Trainiert seit 1995 Taekwon-do. Mehrfacher deutscher Meister in Formen und Kampf. Leitet das Wettkampfteam.",
      "certifications": ["dan-5", "instructor-license", "referee-license"],
      "sortKey": "mueller"
    },
    {
      "id": "anna-schmidt",
      "firstName": "Anna",
      "lastName": "Schmidt",
      "photoUrl": "assets/images/trainers/anna-schmidt.webp",
      "programs": ["kids", "forms"],
      "specialRoles": ["forms-specialist"],
      "email": "anna.schmidt@tkd-ailingen.de",
      "bio": "Spezialisiert auf Kindertraining und Formen. Bringt Kindern spielerisch Taekwon-do bei.",
      "certifications": ["dan-3", "instructor-license"],
      "sortKey": "schmidt"
    },
    {
      "id": "klaus-fischer",
      "firstName": "Klaus",
      "lastName": "Fischer",
      "photoUrl": "assets/images/trainers/klaus-fischer.webp",
      "programs": ["teens", "selfdefense"],
      "specialRoles": ["selfdefense-instructor"],
      "phone": "+49 7541 789012",
      "certifications": ["dan-4", "instructor-license"],
      "sortKey": "fischer"
    },
    {
      "id": "maria-weber",
      "firstName": "Maria",
      "lastName": "Weber",
      "photoUrl": "assets/images/trainers/maria-weber.webp",
      "programs": ["adults", "forms"],
      "email": "maria.weber@tkd-ailingen.de",
      "bio": "Trainiert seit über 15 Jahren. Schwerpunkt auf technisch sauberer Ausführung.",
      "certifications": ["dan-3", "instructor-license"],
      "sortKey": "weber"
    }
  ]
}
```

### Sorted Order

After sorting by `lastName` (German locale):
1. Fischer, Klaus
2. Müller, Hans (ü sorted as u)
3. Schmidt, Anna
4. Weber, Maria

---

## Image Optimization

### Bandwidth Calculations

**Original Photos** (20 trainers):
- Format: JPEG
- Size: ~450 KB each
- Total: 9 MB

**Optimized Photos** (20 trainers):
- Format: WebP + JPEG fallback
- Sizes: 300w (~25 KB), 400w (~40 KB), 600w (~70 KB)
- Lazy loading: Only first 6 eager
- Initial load: 6 × 40 KB = 240 KB
- Remaining: 14 × 40 KB = 560 KB (lazy)
- Total: 800 KB

**Savings**: 9 MB → 800 KB = **91% reduction**

---

## Error Handling

### Photo Load Errors

```typescript
/**
 * Handle photo load error
 * Show placeholder with initials
 */
function handlePhotoError(event: Event, trainer: Trainer): void {
  const img = event.target as HTMLImageElement;
  
  // Generate placeholder
  const initials = generateInitials(trainer.firstName, trainer.lastName);
  const gradient = generateGradient(`${trainer.firstName} ${trainer.lastName}`);
  
  // Replace with placeholder (SVG or CSS)
  img.src = DEFAULT_TRAINER_PHOTO;
  img.alt = `${trainer.firstName} ${trainer.lastName} (kein Foto)`;
  
  // Log error
  console.warn(`Failed to load photo for ${trainer.firstName} ${trainer.lastName}`);
}
```

### Data Load Errors

```typescript
enum TrainerDataError {
  FETCH_FAILED = 'FETCH_FAILED',
  PARSE_ERROR = 'PARSE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  EMPTY_DATA = 'EMPTY_DATA'
}

interface DataError {
  type: TrainerDataError;
  message: string;
  fallback: TrainersData;
}

/**
 * Load trainers data with error handling
 */
async function loadTrainersData(): Promise<TrainersData> {
  try {
    const response = await fetch('assets/data/trainers.json');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return validateTrainersData(data);
    
  } catch (error) {
    console.error('Failed to load trainers:', error);
    
    // Return default (empty) data
    return getDefaultTrainersData();
  }
}
```

---

## Testing Data

### Unit Test Fixtures

```typescript
// trainer.fixtures.ts

export const MOCK_TRAINERS: Trainer[] = [
  {
    id: 'anna-schmidt',
    firstName: 'Anna',
    lastName: 'Schmidt',
    photoUrl: 'assets/images/trainers/anna-schmidt.webp',
    programs: ['kids', 'forms'],
    certifications: ['dan-3'],
    sortKey: 'schmidt'
  },
  {
    id: 'hans-mueller',
    firstName: 'Hans',
    lastName: 'Müller',
    photoUrl: 'assets/images/trainers/hans-mueller.webp',
    programs: ['adults', 'competition'],
    specialRoles: ['head-instructor'],
    certifications: ['dan-5', 'instructor-license'],
    sortKey: 'mueller'
  },
  {
    id: 'klaus-fischer',
    firstName: 'Klaus',
    lastName: 'Fischer',
    photoUrl: 'assets/images/trainers/klaus-fischer.webp',
    programs: ['teens'],
    certifications: ['dan-4'],
    sortKey: 'fischer'
  }
];

export const SORT_SCENARIOS = [
  {
    description: 'German alphabetical order (umlauts)',
    unsorted: ['Müller', 'Schmidt', 'Öztürk', 'Fischer'],
    sorted: ['Fischer', 'Müller', 'Öztürk', 'Schmidt']
  }
];
```

---

## Summary

### Data Entities
- **Trainer**: Profile with id, name, photo, programs, roles, certifications
- **TrainersData**: Root structure with version, timestamp, trainers array

### Storage Strategy
- **Format**: Static JSON file
- **Location**: `assets/data/trainers.json`
- **Loading**: Fetch on component init
- **No persistence**: Read-only data

### Sorting
- **Algorithm**: German locale `localeCompare()`
- **Performance**: O(n log n), <5ms for 20 trainers
- **Key**: Pre-computed `sortKey` for efficiency

### Photo Management
- **Format**: WebP primary, JPEG fallback
- **Sizes**: 300w, 400w, 600w breakpoints
- **Lazy Loading**: First 6 eager, rest lazy
- **Placeholder**: Initials on gradient (WCAG AA 4.73:1)
- **Optimization**: 91% bandwidth reduction

### Validation
- Required: id, firstName, lastName, photoUrl, programs
- Optional: specialRoles, email, phone, bio, certifications
- Whitelist validation for programs, roles, certifications

### No Server Component
- All client-side rendering
- No API calls required
- No backend persistence
- Static data file
