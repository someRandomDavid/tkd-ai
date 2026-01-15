# Quickstart Guide: Trainers Directory

**Feature**: 004-trainers-directory  
**Date**: 2026-01-13

## Overview

This feature implements a trainers directory with:
- ~20 trainer profiles with photos, programs, roles
- German alphabetical sorting (handles umlauts)
- Responsive CSS Grid layout (1 → 2 → 3 → 4 columns)
- Lazy-loaded images (first 6 eager, rest lazy)
- 91% bandwidth reduction with WebP optimization
- Fallback placeholder with initials on gradient
- Static JSON data source (no backend required)

---

## For Developers

### 1. Creating Trainers Data File

#### File Structure

Create `src/assets/data/trainers.json`:

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
      "bio": "Trainiert seit 1995 Taekwon-do. Mehrfacher deutscher Meister in Formen und Kampf.",
      "certifications": ["dan-5", "instructor-license"],
      "sortKey": "mueller"
    }
  ]
}
```

#### Adding New Trainer

```json
{
  "id": "new-trainer",           // REQUIRED: kebab-case (firstname-lastname)
  "firstName": "Anna",            // REQUIRED
  "lastName": "Schmidt",          // REQUIRED
  "photoUrl": "assets/images/trainers/anna-schmidt.webp",  // REQUIRED
  "programs": ["kids", "forms"],  // REQUIRED: at least one
  "specialRoles": ["forms-specialist"],  // OPTIONAL
  "email": "anna.schmidt@tkd-ailingen.de",  // OPTIONAL
  "phone": "+49 7541 789012",     // OPTIONAL
  "bio": "Kurze Biografie...",    // OPTIONAL (2-3 Sätze)
  "certifications": ["dan-3", "instructor-license"],  // OPTIONAL
  "sortKey": "schmidt"            // OPTIONAL (auto-generated if missing)
}
```

**Valid Program Keys**:
- `kids` - Kindertraining
- `teens` - Jugendtraining
- `adults` - Erwachsenentraining
- `competition` - Wettkampftraining
- `forms` - Formen
- `selfdefense` - Selbstverteidigung

**Valid Role Keys**:
- `head-instructor` - Cheftrainer
- `assistant` - Assistenztrainer
- `competition-coach` - Wettkampftrainer
- `forms-specialist` - Formen-Spezialist
- `selfdefense-instructor` - Selbstverteidigungstrainer

**Valid Certification Keys**:
- `dan-1` through `dan-6` - Dan-Grade
- `instructor-license` - Trainerlizenz
- `referee-license` - Kampfrichterlizenz

---

### 2. Adding Trainer Photos

#### Photo Requirements

**Format**: WebP (primary) + JPEG (fallback)  
**Dimensions**: Square, minimum 400×400px  
**File Size**: Target <50 KB per image (WebP)  
**Naming**: `{id}.webp` and `{id}.jpg`

#### Directory Structure

```
src/assets/images/trainers/
├── hans-mueller.webp
├── hans-mueller.jpg
├── anna-schmidt.webp
├── anna-schmidt.jpg
├── placeholder.svg
```

#### Generating Responsive Images

Use ImageMagick or similar tool to create breakpoints:

```bash
# Convert and resize original photo
magick trainer-original.jpg -resize 600x600^ -gravity center -extent 600x600 hans-mueller-600w.jpg
magick hans-mueller-600w.jpg -resize 400x400 hans-mueller-400w.jpg
magick hans-mueller-400w.jpg -resize 300x300 hans-mueller-300w.jpg

# Convert to WebP
magick hans-mueller-600w.jpg -quality 85 hans-mueller-600w.webp
magick hans-mueller-400w.jpg -quality 85 hans-mueller-400w.webp
magick hans-mueller-300w.jpg -quality 85 hans-mueller-300w.webp
```

**Automated Script** (PowerShell):
```powershell
# optimize-trainer-photos.ps1
param([string]$InputDir, [string]$OutputDir)

Get-ChildItem -Path $InputDir -Filter *.jpg | ForEach-Object {
    $name = $_.BaseName
    
    # Generate breakpoints
    magick $_.FullName -resize 600x600^ -gravity center -extent 600x600 "$OutputDir\$name-600w.jpg"
    magick "$OutputDir\$name-600w.jpg" -resize 400x400 "$OutputDir\$name-400w.jpg"
    magick "$OutputDir\$name-400w.jpg" -resize 300x300 "$OutputDir\$name-300w.jpg"
    
    # Convert to WebP
    magick "$OutputDir\$name-600w.jpg" -quality 85 "$OutputDir\$name-600w.webp"
    magick "$OutputDir\$name-400w.jpg" -quality 85 "$OutputDir\$name-400w.webp"
    magick "$OutputDir\$name-300w.jpg" -quality 85 "$OutputDir\$name-300w.webp"
    
    Write-Host "Processed $name"
}
```

---

### 3. Using TrainerService

#### Basic Usage in Component

```typescript
import { Component, OnInit } from '@angular/core';
import { TrainerService } from './services/trainer.service';
import { Trainer } from './models/trainer';

@Component({
  selector: 'app-trainers',
  template: `
    <section class="trainers-page">
      <h1>{{ 'trainers.title' | translate }}</h1>
      <p class="subtitle">{{ 'trainers.subtitle' | translate }}</p>
      
      <div class="trainers-grid">
        <app-trainer-card 
          *ngFor="let trainer of trainers; let i = index" 
          [trainer]="trainer"
          [loading]="trainerService.getLoadingStrategy(i)">
        </app-trainer-card>
      </div>
      
      <div *ngIf="trainers.length === 0" class="no-trainers">
        <p>{{ 'trainers.noData' | translate }}</p>
      </div>
    </section>
  `
})
export class TrainersComponent implements OnInit {
  trainers: Trainer[] = [];
  
  constructor(public trainerService: TrainerService) {}
  
  ngOnInit() {
    // Load trainers from JSON
    this.trainerService.loadTrainers().subscribe({
      next: (trainers) => {
        this.trainers = trainers;
        console.log(`Loaded ${trainers.length} trainers`);
      },
      error: (error) => {
        console.error('Failed to load trainers:', error);
        this.showErrorMessage();
      }
    });
    
    // Or subscribe to observable
    this.trainerService.trainers$
      .pipe(takeUntilDestroyed())
      .subscribe(trainers => {
        this.trainers = trainers;
      });
  }
  
  showErrorMessage() {
    // Display user-friendly error
    alert('Fehler beim Laden der Trainer. Bitte versuchen Sie es später erneut.');
  }
}
```

#### Direct Service Calls

```typescript
// Get all trainers (cached)
const trainers = this.trainerService.getTrainers();

// Get specific trainer
const trainer = this.trainerService.getTrainerById('hans-mueller');
if (trainer) {
  console.log(`${trainer.firstName} ${trainer.lastName}`);
}

// Get trainers by program
const kidsTrainers = this.trainerService.getTrainersByProgram('kids');
console.log(`${kidsTrainers.length} trainers teach kids`);

// Get trainers by role
const headTrainers = this.trainerService.getTrainersByRole('head-instructor');

// Sort trainers
const sorted = this.trainerService.sortTrainersAlphabetically(trainers);

// Check if trainer has program
if (this.trainerService.hasProgram(trainer, 'competition')) {
  // Show competition badge
}

// Get initials for placeholder
const initials = this.trainerService.getTrainerInitials(trainer); // "HM"

// Get gradient for placeholder
const gradient = this.trainerService.getTrainerGradient(trainer);
```

---

### 4. Creating TrainerCard Component

#### Component Template

```html
<!-- trainer-card.component.html -->
<mat-card class="trainer-card">
  <!-- Photo with lazy loading -->
  <div class="trainer-photo-container">
    <picture *ngIf="!photoError; else placeholder">
      <source 
        [srcset]="getWebPSrcset()" 
        [sizes]="photoSizes"
        type="image/webp">
      <source 
        [srcset]="getJpegSrcset()" 
        [sizes]="photoSizes"
        type="image/jpeg">
      <img 
        [src]="trainer.photoUrl"
        [alt]="getPhotoAlt()"
        [loading]="loading"
        (error)="handlePhotoError()"
        class="trainer-photo">
    </picture>
    
    <ng-template #placeholder>
      <div 
        class="trainer-photo-placeholder" 
        [style.background]="getGradient()">
        <span class="initials">{{ getInitials() }}</span>
      </div>
    </ng-template>
  </div>
  
  <!-- Name and Role -->
  <mat-card-header>
    <mat-card-title>
      {{ trainer.firstName }} {{ trainer.lastName }}
    </mat-card-title>
    <mat-card-subtitle *ngIf="trainer.specialRoles?.length">
      <span *ngFor="let role of trainer.specialRoles; let last = last">
        {{ 'trainers.roles.' + role | translate }}<span *ngIf="!last">, </span>
      </span>
    </mat-card-subtitle>
  </mat-card-header>
  
  <!-- Bio -->
  <mat-card-content *ngIf="trainer.bio">
    <p class="bio">{{ trainer.bio }}</p>
  </mat-card-content>
  
  <!-- Programs -->
  <mat-card-content>
    <div class="programs">
      <span class="label">{{ 'trainers.programs.label' | translate }}:</span>
      <mat-chip-set>
        <mat-chip *ngFor="let program of trainer.programs">
          {{ 'trainers.programs.' + program | translate }}
        </mat-chip>
      </mat-chip-set>
    </div>
  </mat-card-content>
  
  <!-- Certifications -->
  <mat-card-content *ngIf="trainer.certifications?.length">
    <div class="certifications">
      <mat-icon>school</mat-icon>
      <span *ngFor="let cert of trainer.certifications; let last = last">
        {{ 'trainers.certifications.' + cert | translate }}<span *ngIf="!last">, </span>
      </span>
    </div>
  </mat-card-content>
  
  <!-- Contact -->
  <mat-card-actions *ngIf="trainer.email || trainer.phone">
    <a *ngIf="trainer.email" 
       [href]="'mailto:' + trainer.email" 
       mat-button color="primary">
      <mat-icon>email</mat-icon>
      {{ 'trainers.email' | translate }}
    </a>
    <a *ngIf="trainer.phone" 
       [href]="'tel:' + trainer.phone" 
       mat-button color="primary">
      <mat-icon>phone</mat-icon>
      {{ 'trainers.phone' | translate }}
    </a>
  </mat-card-actions>
</mat-card>
```

#### Component TypeScript

```typescript
// trainer-card.component.ts
import { Component, Input } from '@angular/core';
import { Trainer } from './models/trainer';
import { TrainerService } from './services/trainer.service';

@Component({
  selector: 'app-trainer-card',
  templateUrl: './trainer-card.component.html',
  styleUrls: ['./trainer-card.component.scss']
})
export class TrainerCardComponent {
  @Input() trainer!: Trainer;
  @Input() loading: 'eager' | 'lazy' = 'lazy';
  
  photoError = false;
  photoSizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
  
  constructor(private trainerService: TrainerService) {}
  
  getWebPSrcset(): string {
    const basePath = this.trainer.photoUrl.replace('.webp', '');
    return `
      ${basePath}-300w.webp 300w,
      ${basePath}-400w.webp 400w,
      ${basePath}-600w.webp 600w
    `;
  }
  
  getJpegSrcset(): string {
    const basePath = this.trainer.photoUrl.replace('.webp', '').replace('.jpg', '');
    return `
      ${basePath}-300w.jpg 300w,
      ${basePath}-400w.jpg 400w,
      ${basePath}-600w.jpg 600w
    `;
  }
  
  getPhotoAlt(): string {
    return `Profilfoto von ${this.trainer.firstName} ${this.trainer.lastName}`;
  }
  
  handlePhotoError(): void {
    this.photoError = true;
    console.warn(`Failed to load photo for ${this.trainer.firstName} ${this.trainer.lastName}`);
  }
  
  getInitials(): string {
    return this.trainerService.getTrainerInitials(this.trainer);
  }
  
  getGradient(): string {
    return this.trainerService.getTrainerGradient(this.trainer);
  }
}
```

---

### 5. Styling with CSS Grid

#### Responsive Grid Layout

```scss
// trainers.component.scss

.trainers-page {
  padding: 2rem 1rem;
  max-width: 1400px;
  margin: 0 auto;
}

.trainers-grid {
  display: grid;
  
  // Mobile: 1 column
  grid-template-columns: 1fr;
  gap: 2rem;
  
  // Tablet: 2 columns
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  // Desktop: 3 columns
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  // Large desktop: 4 columns
  @media (min-width: 1400px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

// Alternative: Auto-fit approach
.trainers-grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}
```

#### Trainer Card Styling

```scss
// trainer-card.component.scss

.trainer-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--surface-card);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
}

.trainer-photo-container {
  position: relative;
  width: 100%;
  padding-top: 100%; // 1:1 aspect ratio
  overflow: hidden;
  background-color: var(--surface-elevated);
}

.trainer-photo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
}

.trainer-photo-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3f51b5, #5c6bc0);
  
  .initials {
    font-size: 4rem;
    font-weight: 700;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
}

mat-card-header {
  padding: 1rem;
  
  mat-card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  mat-card-subtitle {
    color: var(--primary-main);
    font-weight: 500;
  }
}

mat-card-content {
  padding: 0 1rem 1rem;
  
  .bio {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 1rem;
  }
}

.programs {
  margin-bottom: 1rem;
  
  .label {
    font-weight: 600;
    color: var(--text-secondary);
    font-size: 0.875rem;
    text-transform: uppercase;
    display: block;
    margin-bottom: 0.5rem;
  }
  
  mat-chip-set {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  mat-chip {
    background-color: var(--primary-main);
    color: white;
    font-size: 0.875rem;
  }
}

.certifications {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  
  mat-icon {
    color: var(--accent-main);
    font-size: 1.25rem;
  }
}

mat-card-actions {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 0.5rem;
  
  a {
    min-height: 44px; // Touch target
  }
}

// Mobile optimizations
@media (max-width: 640px) {
  .trainer-photo-placeholder .initials {
    font-size: 3rem;
  }
  
  mat-card-actions {
    flex-direction: column;
    
    a {
      width: 100%;
    }
  }
}
```

---

### 6. Testing

#### Manual Testing Checklist

- [ ] All trainers load and display correctly
- [ ] Photos are lazy-loaded (check Network tab)
- [ ] German alphabetical sorting works (umlauts)
- [ ] Responsive layout: 1 → 2 → 3 → 4 columns
- [ ] Photo placeholders show for missing images
- [ ] Hover effects work on cards
- [ ] Contact links (email/phone) work
- [ ] Programs and certifications display correctly
- [ ] Touch targets ≥44px on mobile
- [ ] Keyboard accessible (Tab navigation)
- [ ] Screen reader announces trainer info

#### Unit Tests

```typescript
// trainer.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TrainerService } from './trainer.service';
import { MOCK_TRAINERS } from './trainer.fixtures';

describe('TrainerService', () => {
  let service: TrainerService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TrainerService]
    });
    
    service = TestBed.inject(TrainerService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    httpMock.verify();
  });
  
  it('should load trainers from JSON', (done) => {
    service.loadTrainers().subscribe(trainers => {
      expect(trainers.length).toBeGreaterThan(0);
      done();
    });
    
    const req = httpMock.expectOne('assets/data/trainers.json');
    expect(req.request.method).toBe('GET');
    req.flush({ version: 1, trainers: MOCK_TRAINERS });
  });
  
  it('should sort trainers alphabetically (German)', () => {
    const unsorted = [
      { lastName: 'Müller' },
      { lastName: 'Schmidt' },
      { lastName: 'Fischer' }
    ] as any[];
    
    const sorted = service.sortTrainersAlphabetically(unsorted);
    expect(sorted[0].lastName).toBe('Fischer');
    expect(sorted[1].lastName).toBe('Müller');
    expect(sorted[2].lastName).toBe('Schmidt');
  });
  
  it('should get trainer by ID', () => {
    service['trainersSubject'].next(MOCK_TRAINERS);
    const trainer = service.getTrainerById('hans-mueller');
    expect(trainer).toBeDefined();
    expect(trainer?.firstName).toBe('Hans');
  });
  
  it('should get trainers by program', () => {
    service['trainersSubject'].next(MOCK_TRAINERS);
    const kidsTrainers = service.getTrainersByProgram('kids');
    expect(kidsTrainers.length).toBeGreaterThan(0);
    expect(kidsTrainers.every(t => t.programs.includes('kids'))).toBe(true);
  });
  
  it('should generate initials', () => {
    const trainer = { firstName: 'Hans', lastName: 'Müller' } as any;
    const initials = service.getTrainerInitials(trainer);
    expect(initials).toBe('HM');
  });
  
  it('should generate deterministic gradient', () => {
    const trainer = { firstName: 'Anna', lastName: 'Schmidt' } as any;
    const gradient1 = service.getTrainerGradient(trainer);
    const gradient2 = service.getTrainerGradient(trainer);
    expect(gradient1).toBe(gradient2); // Same trainer = same gradient
  });
  
  it('should return lazy loading for trainers after index 5', () => {
    expect(service.getLoadingStrategy(0)).toBe('eager');
    expect(service.getLoadingStrategy(5)).toBe('eager');
    expect(service.getLoadingStrategy(6)).toBe('lazy');
    expect(service.getLoadingStrategy(10)).toBe('lazy');
  });
});
```

#### E2E Tests

```typescript
// trainers.e2e.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Trainers Directory', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/trainers');
  });
  
  test('should display trainer cards', async ({ page }) => {
    const cards = await page.locator('.trainer-card').count();
    expect(cards).toBeGreaterThan(0);
  });
  
  test('should sort trainers alphabetically', async ({ page }) => {
    const names = await page.locator('mat-card-title').allTextContents();
    const lastNames = names.map(name => name.split(' ').pop() || '');
    
    // Check sorted order
    const sorted = [...lastNames].sort((a, b) => 
      a.localeCompare(b, 'de-DE')
    );
    expect(lastNames).toEqual(sorted);
  });
  
  test('should lazy load images', async ({ page }) => {
    // Check loading attribute
    const firstImage = page.locator('.trainer-card').first().locator('img');
    await expect(firstImage).toHaveAttribute('loading', 'eager');
    
    const seventhImage = page.locator('.trainer-card').nth(6).locator('img');
    await expect(seventhImage).toHaveAttribute('loading', 'lazy');
  });
  
  test('should show placeholder for missing photo', async ({ page }) => {
    // Intercept image request and fail it
    await page.route('**/trainers/test-trainer.webp', route => 
      route.abort()
    );
    
    await page.reload();
    
    // Should show placeholder
    const placeholder = page.locator('.trainer-photo-placeholder').first();
    await expect(placeholder).toBeVisible();
  });
  
  test('should be responsive', async ({ page }) => {
    // Mobile: 1 column
    await page.setViewportSize({ width: 375, height: 667 });
    const grid = page.locator('.trainers-grid');
    const computed = await grid.evaluate(el => 
      getComputedStyle(el).gridTemplateColumns
    );
    expect(computed.split(' ').length).toBe(1);
    
    // Tablet: 2 columns
    await page.setViewportSize({ width: 768, height: 1024 });
    const computed2 = await grid.evaluate(el => 
      getComputedStyle(el).gridTemplateColumns
    );
    expect(computed2.split(' ').length).toBe(2);
    
    // Desktop: 3 columns
    await page.setViewportSize({ width: 1280, height: 720 });
    const computed3 = await grid.evaluate(el => 
      getComputedStyle(el).gridTemplateColumns
    );
    expect(computed3.split(' ').length).toBe(3);
  });
  
  test('should have clickable contact links', async ({ page }) => {
    const emailLink = page.locator('a[href^="mailto:"]').first();
    if (await emailLink.isVisible()) {
      const href = await emailLink.getAttribute('href');
      expect(href).toContain('mailto:');
    }
  });
});
```

---

### 7. Adding Translation Keys

#### Update German Translations

```json
{
  "trainers": {
    "title": "Unsere Trainer",
    "subtitle": "Erfahrene Instruktoren mit Leidenschaft für Taekwon-do",
    "noData": "Keine Trainerdaten verfügbar",
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
    
    "photoAlt": "Profilfoto von {{name}}",
    "noPhoto": "Kein Foto verfügbar",
    
    "aria": {
      "trainerCard": "Trainerprofil von {{name}}",
      "emailLink": "E-Mail senden an {{name}}",
      "phoneLink": "Anrufen bei {{name}}"
    }
  }
}
```

---

### 8. Troubleshooting

#### Photos Not Loading

**Problem**: Trainer photos show placeholder instead of actual image

**Solution**: Check file paths and names:
1. Verify photo exists: `src/assets/images/trainers/hans-mueller.webp`
2. Check `photoUrl` in JSON matches actual file name
3. Ensure WebP format supported (use JPEG fallback in `<picture>`)
4. Check Network tab for 404 errors

#### Wrong Sort Order

**Problem**: Trainers not sorted correctly, especially with umlauts

**Solution**: Verify German locale:
```typescript
// Use 'de-DE' locale explicitly
trainers.sort((a, b) => 
  a.lastName.localeCompare(b.lastName, 'de-DE')
);

// Verify umlauts sort correctly:
// Müller should come BEFORE Schmidt
```

#### Layout Issues on Mobile

**Problem**: Cards don't resize or overlap on mobile

**Solution**: Check CSS Grid setup:
```scss
.trainers-grid {
  display: grid;
  grid-template-columns: 1fr; // Force 1 column on mobile
  gap: 2rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

#### High Bandwidth Usage

**Problem**: Page loads slowly, lots of image data

**Solution**: Verify lazy loading:
```html
<!-- First 6 should be eager -->
<img [loading]="trainerService.getLoadingStrategy(i)" />

<!-- Check Network tab: only first 6 images load initially -->
```

---

## For Content Editors

### Adding a New Trainer

1. **Prepare Photo**:
   - Square format (1:1 aspect ratio)
   - Minimum 400×400px
   - Save as `firstname-lastname.jpg`

2. **Optimize Photo**:
   - Use online tools (e.g., Squoosh.app)
   - Export as WebP (~40 KB target)
   - Keep JPEG version as fallback

3. **Add to JSON**:
   Open `src/assets/data/trainers.json` and add:
   ```json
   {
     "id": "firstname-lastname",
     "firstName": "First",
     "lastName": "Last",
     "photoUrl": "assets/images/trainers/firstname-lastname.webp",
     "programs": ["adults"],
     "bio": "Kurze Biografie (2-3 Sätze).",
     "certifications": ["dan-3"]
   }
   ```

4. **Upload Photo**:
   - Place in `src/assets/images/trainers/`
   - Name must match `photoUrl` in JSON

5. **Test Locally**:
   - Run `npm start`
   - Navigate to `/trainers`
   - Verify trainer appears and photo loads

### Updating Trainer Information

1. Open `src/assets/data/trainers.json`
2. Find trainer by `id`
3. Update fields (firstName, lastName, bio, programs, etc.)
4. Save file
5. Test changes

### Removing a Trainer

1. Open `src/assets/data/trainers.json`
2. Remove entire trainer object
3. Delete photo files (optional, but recommended)
4. Save file

---

## Implementation Checklist

- [ ] TrainerService created and provided in root
- [ ] Trainer model defined with proper types
- [ ] trainers.json created with sample data
- [ ] Trainer photos added to assets/images/trainers/
- [ ] Photos optimized (WebP + JPEG, responsive breakpoints)
- [ ] TrainerCard component created
- [ ] Responsive CSS Grid layout implemented
- [ ] Lazy loading configured (first 6 eager)
- [ ] Placeholder component for missing photos
- [ ] German locale sorting implemented
- [ ] Translation keys added
- [ ] Unit tests written for TrainerService
- [ ] E2E tests written for directory page
- [ ] Accessibility verified (keyboard, screen reader)
- [ ] Mobile responsive design tested
- [ ] Documentation updated

---

## Performance Targets

- **Initial Load**: <1 second (first 6 images)
- **Full Load**: <3 seconds (all images lazy-loaded)
- **Sorting**: <10ms (20 trainers)
- **Image Size**: <50 KB per trainer (WebP)
- **Total Bandwidth**: <1 MB (vs 9 MB unoptimized)

**Measurement**:
```typescript
console.time('sort-trainers');
const sorted = this.trainerService.sortTrainersAlphabetically(trainers);
console.timeEnd('sort-trainers');
// Should log: sort-trainers: 3ms
```

---

## Related Files

- **Service**: `src/app/services/trainer.service.ts`
- **Component**: `src/app/components/trainers/trainers.component.ts`
- **Card**: `src/app/components/trainer-card/trainer-card.component.ts`
- **Model**: `src/app/models/trainer.ts`
- **Data**: `src/assets/data/trainers.json`
- **Photos**: `src/assets/images/trainers/`
- **Tests**: `src/app/services/trainer.service.spec.ts`
- **E2E**: `e2e/trainers.e2e.spec.ts`
- **Translations**: `src/assets/i18n/de.json`

---

## Support

For questions or issues:
1. Check research.md for technical decisions
2. Review data-model.md for data structures
3. See contracts/trainer-service.interface.ts for API
4. Consult plan.md for architecture overview
