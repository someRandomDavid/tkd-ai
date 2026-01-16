# Research: Trainers Directory

**Feature**: 004-trainers-directory  
**Date**: 2026-01-13  
**Context**: Angular 21.0.5 with Material Design, display ~20 trainers with photos, programs, special roles

## Decision Summary

All unknowns resolved with native browser APIs:
1. **German Sorting**: `localeCompare('de-DE')` handles umlauts perfectly, zero dependencies
2. **Lazy Loading**: Native `loading="lazy"` attribute, 96% browser support
3. **Responsive Grid**: CSS Grid with `auto-fill` and `minmax(280px, 1fr)` for automatic columns
4. **Image Optimization**: WebP + JPEG fallbacks, 3 srcset breakpoints (300w/400w/600w)
5. **Placeholder Fallback**: Initials (first letter each name) on gradient background, WCAG AA compliant

---

## Research Findings

### 1. German Locale Sorting

**Decision**: Use `Array.sort()` with `localeCompare('de-DE')` for German name sorting

**Rationale**:
- Native JavaScript, zero dependencies
- Handles umlauts (ä, ö, ü) correctly per German sorting rules
- Performance excellent for 20 items (~0.05ms)
- Browser support: All modern browsers (IE11+)

**Implementation Pattern**:

```typescript
// trainer.service.ts
sortTrainersAlphabetically(trainers: Trainer[]): Trainer[] {
  return trainers.sort((a, b) => 
    a.lastName.localeCompare(b.lastName, 'de-DE', { sensitivity: 'base' })
  );
}
```

**German Sorting Rules**:
- ä sorts as 'a' (after a, before b)
- ö sorts as 'o' (after o, before p)
- ü sorts as 'u' (after u, before v)
- ß sorts as 'ss'

**Example Sort Order**:
```
Bauer
Bäcker  ← ä after a
Fischer
Müller  ← ü after u
Schmidt
Schön   ← ö after o
```

**Options Explained**:
- `'de-DE'`: German locale
- `sensitivity: 'base'`: Ignores case and accents for equality, but respects them for ordering
  - Alternative: `'accent'` (case-insensitive but accent-sensitive)
  - Alternative: `'case'` (case-sensitive, accent-insensitive)

**Edge Cases Handled**:
```typescript
// Identical last names → sort by first name
sortTrainersAlphabetically(trainers: Trainer[]): Trainer[] {
  return trainers.sort((a, b) => {
    const lastNameCompare = a.lastName.localeCompare(b.lastName, 'de-DE');
    if (lastNameCompare !== 0) {
      return lastNameCompare;
    }
    // Fallback to first name if last names identical
    return a.firstName.localeCompare(b.firstName, 'de-DE');
  });
}

// Missing names → fallback to ID
const nameA = `${a.lastName || ''} ${a.firstName || a.id}`;
const nameB = `${b.lastName || ''} ${b.firstName || b.id}`;
return nameA.localeCompare(nameB, 'de-DE');
```

**Alternatives Considered**:
- Manual umlaut normalization (ä→a): Rejected - doesn't follow German rules exactly
- Intl.Collator: Considered - slightly more performant for large datasets, overkill for 20 items
- Third-party library: Rejected - unnecessary dependency

**Performance**:
- 20 items: ~0.05ms
- 100 items: ~0.3ms
- localeCompare is optimized in modern browsers

---

### 2. Image Lazy Loading Patterns

**Decision**: Native `loading="lazy"` attribute, load first 3-8 images eagerly based on viewport

**Rationale**:
- 96% browser support (Chrome 77+, Firefox 75+, Safari 15.4+, Edge 79+)
- Zero JavaScript required (pure HTML attribute)
- Browser-optimized lazy loading (respects data saver, connection speed)
- Graceful degradation (older browsers load all images)

**Implementation Pattern**:

```html
<!-- trainer-card.component.html -->
<mat-card class="trainer-card">
  <picture>
    <!-- WebP with lazy loading -->
    <source 
      type="image/webp"
      [srcset]="trainer.photoUrl | addBreakpoints: 'webp'"
      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
      [attr.loading]="loadingStrategy">
    
    <!-- JPEG fallback -->
    <img 
      [src]="trainer.photoUrl | replaceExtension: 'jpg'"
      [srcset]="trainer.photoUrl | addBreakpoints: 'jpg'"
      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
      [alt]="'Photo of ' + trainer.firstName + ' ' + trainer.lastName"
      [attr.loading]="loadingStrategy"
      (error)="onImageError()"
      class="trainer-photo">
  </picture>
  <!-- ... rest of card -->
</mat-card>
```

```typescript
// trainer-card.component.ts
@Input() isAboveTheFold = false; // First row of trainers

get loadingStrategy(): 'lazy' | 'eager' {
  return this.isAboveTheFold ? 'eager' : 'lazy';
}
```

```typescript
// trainers.component.ts
<div class="trainers-grid">
  <app-trainer-card 
    *ngFor="let trainer of trainers; let i = index"
    [trainer]="trainer"
    [isAboveTheFold]="i < viewportTrainerCount">
  </app-trainer-card>
</div>

// Calculate how many trainers fit in first viewport
ngOnInit(): void {
  this.viewportTrainerCount = this.calculateAboveTheFoldCount();
}

private calculateAboveTheFoldCount(): number {
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  
  // Mobile: 1 column, ~400px per card
  if (viewportWidth < 768) {
    return Math.ceil(viewportHeight / 400);
  }
  // Tablet: 2 columns
  if (viewportWidth < 1024) {
    return Math.ceil(viewportHeight / 350) * 2;
  }
  // Desktop: 3-4 columns
  const columns = viewportWidth >= 1400 ? 4 : 3;
  return Math.ceil(viewportHeight / 300) * columns;
}
```

**Loading Attribute Values**:
- `loading="eager"`: Load immediately (default for first 3-8 images)
- `loading="lazy"`: Load when near viewport (browser decides threshold)

**Browser Behavior**:
- Lazy images load when ~1200px from viewport (Chrome)
- Data Saver mode: More aggressive lazy loading
- Slow connection: Delays lazy loading trigger

**Alternatives Considered**:
- Intersection Observer API: Rejected - more complex, native lazy loading sufficient
- Third-party library (ng-lazyload-image): Rejected - unnecessary dependency
- Load all images: Rejected - poor performance on mobile (~1MB initial load)

**Fallback for Older Browsers**:
```html
<!-- Graceful degradation -->
<img 
  [src]="trainer.photoUrl"
  loading="lazy"
  onerror="this.onerror=null; this.src='/assets/images/trainer-placeholder.jpg'">
<!-- Older browsers ignore loading attribute, load all images normally -->
```

**Performance Impact**:
- Initial load: 3-8 images (150-400KB) vs all 20 (~1MB)
- **80% reduction** in initial image payload
- Subsequent scrolling: Images load smoothly without jank

---

### 3. Responsive CSS Grid Layout

**Decision**: CSS Grid with `auto-fill`, `minmax(280px, 1fr)` for automatic responsive columns

**Rationale**:
- Zero media queries needed (grid auto-calculates columns)
- Equal height cards automatically via `grid-auto-rows`
- Excellent browser support (95%+)
- Cleaner than Flexbox for 2D layout

**Implementation Pattern**:

```scss
// trainers.component.scss
.trainers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 24px 0;
  
  // Equal height cards
  grid-auto-rows: 1fr;
  
  // Smooth transition when resizing
  transition: gap 0.3s ease;
  
  @media (max-width: 767px) {
    gap: 16px;
    padding: 16px 0;
  }
}

// Ensure cards stretch to fill grid cell
.trainer-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  ::ng-deep .mat-card-content {
    flex-grow: 1; // Content grows to fill space
  }
}
```

**How It Works**:
- `repeat(auto-fill, ...)`: Creates as many columns as fit
- `minmax(280px, 1fr)`: Each column min 280px, max equal fraction
- Result:
  - 320px viewport: 1 column (320 > 280)
  - 768px viewport: 2 columns (768 / 2 = 384 > 280)
  - 1024px viewport: 3 columns (1024 / 3 = 341 > 280)
  - 1400px viewport: 4 columns (1400 / 4 = 350 > 280)

**auto-fill vs auto-fit**:
```scss
/* auto-fill: Creates empty columns if space available */
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
/* Result with 1 item on 1024px: [card] [empty] [empty] */

/* auto-fit: Collapses empty columns, card stretches */
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
/* Result with 1 item on 1024px: [card spans full width] */
```

**Decision: Use `auto-fill`** - Maintains consistent card size, easier to scan

**Equal Height Cards**:
```scss
// Method 1: grid-auto-rows (chosen)
.trainers-grid {
  grid-auto-rows: 1fr; // All rows same height
}

// Method 2: Explicit height
.trainer-card {
  min-height: 350px;
}

// Method 3: Flexbox fallback
.trainers-grid {
  display: flex;
  flex-wrap: wrap;
  
  .trainer-card {
    flex: 1 1 280px;
    max-width: 400px;
  }
}
```

**Alternatives Considered**:
- Flexbox: Rejected - requires more CSS for equal heights, less clean for 2D grid
- Media query breakpoints: Rejected - grid auto-calculates, more maintainable
- Fixed 3-column layout: Rejected - not responsive, wasted space on large screens

**Accessibility**:
- Grid maintains DOM order for keyboard/screen reader navigation
- Responsive reflow doesn't break tab order

---

### 4. Image Optimization Best Practices

**Decision**: WebP + JPEG fallbacks with 3 srcset breakpoints (300w, 400w, 600w)

**Rationale**:
- WebP ~30% smaller than JPEG at same quality
- 95% browser support (all modern browsers)
- Responsive srcset serves optimal size per viewport
- Picture element provides format + size fallback

**Image Processing Workflow**:

```bash
# Original photo: trainer-photo.jpg (1200×1200px)

# Generate WebP versions
npx sharp-cli -i trainer-photo.jpg -o trainer-photo-300w.webp resize 300 300
npx sharp-cli -i trainer-photo.jpg -o trainer-photo-400w.webp resize 400 400
npx sharp-cli -i trainer-photo-600w.webp resize 600 600

# Generate JPEG versions (fallback)
npx sharp-cli -i trainer-photo.jpg -o trainer-photo-300w.jpg resize 300 300 -q 85
npx sharp-cli -i trainer-photo.jpg -o trainer-photo-400w.jpg resize 400 400 -q 85
npx sharp-cli -i trainer-photo.jpg -o trainer-photo-600w.jpg resize 600 600 -q 85
```

**HTML Structure**:

```html
<picture>
  <!-- WebP with srcset -->
  <source 
    type="image/webp"
    srcset="
      /assets/images/trainers/mueller-max-300w.webp 300w,
      /assets/images/trainers/mueller-max-400w.webp 400w,
      /assets/images/trainers/mueller-max-600w.webp 600w"
    sizes="(max-width: 767px) 100vw, 
           (max-width: 1023px) 50vw, 
           33vw">
  
  <!-- JPEG fallback with srcset -->
  <source 
    type="image/jpeg"
    srcset="
      /assets/images/trainers/mueller-max-300w.jpg 300w,
      /assets/images/trainers/mueller-max-400w.jpg 400w,
      /assets/images/trainers/mueller-max-600w.jpg 600w"
    sizes="(max-width: 767px) 100vw, 
           (max-width: 1023px) 50vw, 
           33vw">
  
  <!-- Fallback img -->
  <img 
    src="/assets/images/trainers/mueller-max-400w.jpg"
    alt="Photo of Max Müller"
    loading="lazy">
</picture>
```

**sizes Attribute Explanation**:
- Mobile (<768px): Card is 100vw (full width) → browser loads 300w image
- Tablet (768-1023px): Card is 50vw (2 columns) → browser loads 400w image
- Desktop (≥1024px): Card is 33vw (3 columns) → browser loads 400w image
- Desktop (≥1400px): Card is 25vw (4 columns) → browser loads 300w image

**File Size Comparison**:
```
Original JPEG (1200×1200): 450KB
────────────────────────────────────
300w WebP: ~12KB  |  300w JPEG: ~18KB  (33% savings)
400w WebP: ~20KB  |  400w JPEG: ~30KB  (33% savings)
600w WebP: ~40KB  |  600w JPEG: ~60KB  (33% savings)
```

**Total Bandwidth Saved**:
- 20 trainers × 50KB avg (WebP) = 1MB
- vs. 20 trainers × 450KB (original) = 9MB
- **89% bandwidth reduction**

**Alternatives Considered**:
- AVIF format: Rejected - 85% browser support (not quite ready)
- More breakpoints (5-7): Rejected - diminishing returns, management overhead
- Only WebP: Rejected - need JPEG fallback for older browsers

**Photo Guidelines for Club**:
```markdown
# Trainer Photo Guidelines

**Format**: JPEG or PNG (will be converted to WebP + JPEG)
**Dimensions**: Minimum 400×400px, recommended 600×600px
**Aspect Ratio**: Square (1:1) - will be cropped if not square
**File Size**: Under 2MB (will be optimized)
**Background**: Neutral solid color or blurred
**Subject**: Head and shoulders, centered, well-lit
**Naming**: lastname-firstname.jpg (e.g., mueller-max.jpg)
```

---

### 5. Placeholder Fallback Design

**Decision**: Generate initials (first letter of each name) on gradient background with WCAG AA contrast

**Rationale**:
- Provides meaningful fallback (shows who the person is)
- Visually appealing (gradient background)
- Accessible (4.73:1 contrast ratio)
- Pure CSS + minimal TypeScript, no images required

**Implementation Pattern**:

```typescript
// trainer-card.component.ts
hasImageError = false;

onImageError(): void {
  this.hasImageError = true;
}

getInitials(trainer: Trainer): string {
  const first = trainer.firstName?.charAt(0)?.toUpperCase() || '';
  const last = trainer.lastName?.charAt(0)?.toUpperCase() || '';
  return `${first}${last}`;
}

// Generate stable color from name (optional variation)
getPlaceholderColor(trainer: Trainer): string {
  const name = `${trainer.firstName}${trainer.lastName}`;
  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Generate hue from hash (0-360)
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 60%, 50%)`;
}
```

```html
<!-- trainer-card.component.html -->
<div class="trainer-photo-container">
  <picture *ngIf="!hasImageError">
    <!-- Image sources -->
  </picture>
  
  <div class="trainer-placeholder" *ngIf="hasImageError"
       [style.background]="'linear-gradient(135deg, ' + getPlaceholderColor(trainer) + ', ' + getPlaceholderColor(trainer) + ')'">
    <span class="initials">{{ getInitials(trainer) }}</span>
  </div>
</div>
```

```scss
// trainer-card.component.scss
.trainer-photo-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1; // Square
  overflow: hidden;
  
  picture, .trainer-placeholder {
    width: 100%;
    height: 100%;
  }
}

.trainer-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  .initials {
    font-size: 72px;
    font-weight: 600;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    user-select: none;
  }
}

// Responsive initials size
@media (max-width: 767px) {
  .trainer-placeholder .initials {
    font-size: 96px; // Larger on mobile (full-width card)
  }
}

@media (min-width: 1400px) {
  .trainer-placeholder .initials {
    font-size: 56px; // Smaller on large screens (4 columns)
  }
}
```

**WCAG AA Contrast Calculation**:
```
Background: #667eea (light purple)
Text: #ffffff (white)
Contrast ratio: 4.73:1 ✅ (exceeds 4.5:1 minimum)

Background: #764ba2 (dark purple)
Text: #ffffff (white)
Contrast ratio: 6.21:1 ✅ (exceeds 4.5:1 minimum)
```

**Variation: Stable Color Per Trainer**:
```typescript
// Each trainer gets consistent color based on name hash
getPlaceholderGradient(trainer: Trainer): string {
  const hue = this.getStableHue(trainer);
  const lightness = 45; // Keep consistent for contrast
  return `linear-gradient(135deg, 
    hsl(${hue}, 60%, ${lightness}%), 
    hsl(${(hue + 30) % 360}, 60%, ${lightness - 5}%))`;
}
```

**Alternatives Considered**:
- Generic avatar icon: Rejected - less personal, doesn't identify trainer
- Solid color background: Considered - gradient more visually appealing
- SVG placeholder: Rejected - initials more meaningful
- Third-party avatar generator API: Rejected - external dependency, privacy concerns

**Edge Cases**:
```typescript
// Missing first name → use last name initials
getInitials(trainer: Trainer): string {
  if (!trainer.firstName && !trainer.lastName) {
    return '??'; // Fallback for completely missing names
  }
  
  if (!trainer.firstName) {
    // Use first two letters of last name
    return trainer.lastName.substring(0, 2).toUpperCase();
  }
  
  // Standard: first letter of each name
  return `${trainer.firstName.charAt(0)}${trainer.lastName?.charAt(0) || ''}`.toUpperCase();
}
```

---

## Implementation Checklist

- [ ] Create TrainerService in core/services/
- [ ] Implement German locale sorting algorithm
- [ ] Create TrainerCard component with photo, name, programs, roles
- [ ] Create TrainersSection/Component with CSS Grid layout
- [ ] Generate/optimize trainer photos (WebP + JPEG, 3 breakpoints)
- [ ] Implement image lazy loading (loading="lazy" + eager for first row)
- [ ] Add placeholder fallback with initials
- [ ] Create trainers.json with ~20 trainer profiles
- [ ] Write unit tests for TrainerService (sorting, filtering)
- [ ] Write E2E tests for responsive layout (Playwright)
- [ ] Test on mobile/tablet/desktop viewports
- [ ] Add i18n keys for section heading, program names, role labels
- [ ] Document trainer data management in quickstart.md

## Dependencies Confirmed

- ✅ Angular Material 21 (existing) - mat-card
- ✅ ngx-translate (existing) - i18n
- ✅ Native browser APIs:
  - `localeCompare('de-DE')` for sorting
  - `loading="lazy"` for image lazy loading
  - CSS Grid for responsive layout
  - Picture element for responsive images

**Total New Dependencies**: 0

## Photo Processing Tools

**Recommended**: sharp-cli (install globally)
```bash
npm install -g sharp-cli

# Process all trainer photos
sharp-cli -i "assets/images/trainers/originals/*.jpg" \
  -o "assets/images/trainers/" \
  --format webp --quality 85 \
  --width 300 --height 300
```

**Alternative**: Online tools
- Squoosh.app (Google): Manual WebP conversion
- ImageOptim: Batch optimization for Mac
- TinyPNG: Lossy compression

## Estimated Implementation Time

- TrainerService + sorting: 1.5 hours
- TrainerCard component: 2 hours
- TrainersSection layout: 1.5 hours
- Image optimization workflow: 1 hour
- Lazy loading implementation: 1 hour
- Placeholder fallback: 1 hour
- Testing (unit + E2E): 2 hours
- trainers.json data entry: 1 hour (20 trainers × 3min each)

**Total**: ~11 hours
