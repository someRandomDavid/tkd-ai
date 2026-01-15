# Implementation Tasks: Trainers Directory

**Feature**: 004-trainers-directory | **Branch**: `004-trainers-directory` | **Date**: 2026-01-13

## Overview

Break down implementation into granular, testable tasks for trainer directory with lazy-loaded images and German sorting.

**Estimated Total Time**: 11 hours

---

## Phase 0: Setup & Data Model (1.5 hours)

### T001: Create Trainer interface and types
**Estimate**: 20 min | **Priority**: P0 | **Dependencies**: None

Define TypeScript interface for trainer profile data.

**Files**:
- `src/app/core/models/trainer.ts` (new)

**Acceptance**:
- [ ] `Trainer` interface with: id, firstName, lastName, fullName (computed), role, programs[], bio?, photoUrl, photoWebP?, sortKey
- [ ] `TrainerRole` type = "head-instructor" | "instructor" | "assistant" | null
- [ ] `Program` type = "beginner" | "kids" | "adults" | "competition" etc.
- [ ] Export helper function `generateSortKey(lastName, firstName)` for German sorting
- [ ] JSDoc comments for each field

**Test**: Import interface, TypeScript compiles without errors

---

### T002: Create trainers.json with sample data
**Estimate**: 40 min | **Priority**: P0 | **Dependencies**: T001

Populate JSON file with ~5 sample trainers initially.

**Files**:
- `src/assets/data/trainers.json` (new)

**Acceptance**:
- [ ] JSON array with 5 trainer objects
- [ ] Each has all required fields: id, firstName, lastName, role, programs, photoUrl
- [ ] Mix of roles: 1 head-instructor, 2 instructors, 2 assistants
- [ ] Mix of programs taught
- [ ] photoUrl uses placeholder or local test images
- [ ] Valid JSON format (no syntax errors)

**Test**: Load JSON in browser DevTools, verify structure

---

### T003: Add placeholder trainer images
**Estimate**: 30 min | **Priority**: P2 | **Dependencies**: None

Create directory and add placeholder images.

**Files**:
- `src/assets/images/trainers/` (new directory)
- Add 2-3 placeholder images (e.g., `placeholder.jpg`, `placeholder.webp`)

**Acceptance**:
- [ ] Directory exists: `src/assets/images/trainers/`
- [ ] At least 1 placeholder image (300x300px, neutral background)
- [ ] Both JPEG and WebP formats
- [ ] Images optimized (<50KB each)
- [ ] Can be referenced from trainers.json

**Test**: Reference placeholder in JSON, verify image loads in browser

---

## Phase 1: TrainerService (1.5 hours)

### T004: Create TrainerService skeleton
**Estimate**: 15 min | **Priority**: P1 | **Dependencies**: T001

Generate service for trainer data management.

**Files**:
- `src/app/core/services/trainer.service.ts` (new)
- `src/app/core/services/trainer.service.spec.ts` (new)

**Acceptance**:
- [ ] `@Injectable({ providedIn: 'root' })` decorator
- [ ] Inject HttpClient
- [ ] Constructor defined
- [ ] Import Trainer interface from T001
- [ ] Basic unit test file with describe block

**Test**: `ng test` runs, TrainerService can be injected

---

### T005: Implement loadTrainers() method
**Estimate**: 30 min | **Priority**: P1 | **Dependencies**: T004, T002

Load trainers from JSON file.

**Files**:
- `src/app/core/services/trainer.service.ts` (update)
- `src/app/core/services/trainer.service.spec.ts` (update)

**Acceptance**:
- [ ] `loadTrainers(): Observable<Trainer[]>` method
- [ ] Loads `assets/data/trainers.json` via HttpClient
- [ ] Uses shareReplay() to cache result
- [ ] Returns Observable of Trainer array
- [ ] Unit test: mocks HttpClient, verifies observable emits data
- [ ] Unit test: verifies caching (only 1 HTTP call)

**Test**: Call loadTrainers(), check Network tab shows single request

---

### T006: Implement getTrainerById() method
**Estimate**: 15 min | **Priority**: P2 | **Dependencies**: T005

Retrieve single trainer by ID.

**Files**:
- `src/app/core/services/trainer.service.ts` (update)
- `src/app/core/services/trainer.service.spec.ts` (update)

**Acceptance**:
- [ ] `getTrainerById(id: string): Observable<Trainer | undefined>`
- [ ] Uses loadTrainers() then map/find
- [ ] Returns undefined if not found
- [ ] Unit test: finds existing trainer
- [ ] Unit test: returns undefined for invalid ID

**Test**: Call with valid/invalid ID, verify result

---

### T007: Implement sortTrainers() with German locale
**Estimate**: 30 min | **Priority**: P1 | **Dependencies**: T005

Sort trainers by last name using German collation.

**Files**:
- `src/app/core/services/trainer.service.ts` (update)
- `src/app/core/services/trainer.service.spec.ts` (update)

**Acceptance**:
- [ ] `sortTrainers(trainers: Trainer[]): Trainer[]` method
- [ ] Uses `String.localeCompare()` with 'de-DE' locale
- [ ] Sorts by lastName, then firstName
- [ ] Handles umlauts correctly (ä, ö, ü sort with a, o, u)
- [ ] Returns new sorted array (does not mutate)
- [ ] Unit test: sorts ["Müller", "Maier", "Özil"] correctly
- [ ] Unit test: handles empty array

**Test**: Sort mock trainers with umlauts, verify German alphabetical order

---

## Phase 2: TrainerCard Component (2 hours)

### T008: Generate TrainerCard component
**Estimate**: 10 min | **Priority**: P1 | **Dependencies**: T001

Create reusable trainer card component.

**Files**:
- `src/app/shared/components/trainer-card/` (new directory)

**Acceptance**:
- [ ] Run `ng generate component shared/components/trainer-card --standalone`
- [ ] Component generated with .ts, .html, .scss, .spec.ts
- [ ] Component is standalone

**Test**: `ng build` succeeds, component can be imported

---

### T009: Implement TrainerCard component logic
**Estimate**: 30 min | **Priority**: P1 | **Dependencies**: T008

Add trainer data input and computed properties.

**Files**:
- `src/app/shared/components/trainer-card/trainer-card.component.ts` (update)
- `src/app/shared/components/trainer-card/trainer-card.component.spec.ts` (update)

**Acceptance**:
- [ ] `@Input({ required: true }) trainer!: Trainer`
- [ ] `imageLoaded = signal(false)` for lazy-load state
- [ ] `hasPhoto(): boolean` computed property
- [ ] `getInitials(): string` returns first letters of first + last name
- [ ] `onImageLoad()` method sets imageLoaded to true
- [ ] `onImageError()` method falls back to initials
- [ ] Unit test: computes initials correctly
- [ ] Unit test: detects photo presence

**Test**: Pass trainer object, verify initials computed

---

### T010: Create TrainerCard template with Material card
**Estimate**: 40 min | **Priority**: P1 | **Dependencies**: T009

Build card UI with image, name, role badge, programs list.

**Files**:
- `src/app/shared/components/trainer-card/trainer-card.component.html` (update)

**Acceptance**:
- [ ] `<mat-card>` wrapper
- [ ] `<mat-card-header>` with trainer name
- [ ] Role badge (if head-instructor or special role)
- [ ] `<figure>` for photo with `<img loading="lazy">`
- [ ] Fallback to initials circle if no photo
- [ ] `<picture>` element with WebP + JPEG sources
- [ ] `<mat-card-content>` with programs taught list
- [ ] Bio paragraph (if available)
- [ ] Alt text: "Foto von [name]" or "Initialen: [XX]"
- [ ] Data attributes for E2E testing

**Test**: View card in browser, image lazy-loads, initials show as fallback

---

### T011: Style TrainerCard component
**Estimate**: 40 min | **Priority**: P1 | **Dependencies**: T010

Add styles for card layout, image, and responsive behavior.

**Files**:
- `src/app/shared/components/trainer-card/trainer-card.component.scss` (update)

**Acceptance**:
- [ ] mat-card background uses `var(--surface-card)`
- [ ] Photo container: 200x200px, border-radius (circular or rounded)
- [ ] Initials placeholder: centered text, 200x200px, background color
- [ ] Role badge: small chip, positioned top-right or below name
- [ ] Programs list: comma-separated or bullet list
- [ ] Smooth fade-in when image loads
- [ ] Card hover state (subtle elevation change)
- [ ] Mobile: card full width, smaller photo (150x150px)

**Test**: View on mobile and desktop, verify responsive styles

---

## Phase 3: Trainers Page/Section (2 hours)

### T012: Generate Trainers component
**Estimate**: 10 min | **Priority**: P1 | **Dependencies**: T004

Create trainers page or section component.

**Files**:
- `src/app/features/home/trainers/` (new directory, if part of homepage)
- OR `src/app/pages/trainers/` (if standalone page)

**Acceptance**:
- [ ] Run `ng generate component features/home/trainers --standalone` (adjust path)
- [ ] Component generated with .ts, .html, .scss, .spec.ts
- [ ] Component is standalone

**Test**: `ng build` succeeds, component can be imported

---

### T013: Implement Trainers component logic
**Estimate**: 30 min | **Priority**: P1 | **Dependencies**: T012, T007

Load and sort trainers on component init.

**Files**:
- `src/app/features/home/trainers/trainers.component.ts` (update)
- `src/app/features/home/trainers/trainers.component.spec.ts` (update)

**Acceptance**:
- [ ] Inject TrainerService and TranslateService
- [ ] `trainers = signal<Trainer[]>([])`
- [ ] `loading = signal(true)`
- [ ] `error = signal<string | null>(null)`
- [ ] `ngOnInit()` calls `trainerService.loadTrainers()`
- [ ] Apply `sortTrainers()` before assigning to signal
- [ ] Handle errors gracefully
- [ ] Unit test: loads and sorts trainers
- [ ] Unit test: handles error state

**Test**: Component loads trainers, logs them to console

---

### T014: Create Trainers template with responsive grid
**Estimate**: 50 min | **Priority**: P1 | **Dependencies**: T013, T011

Build grid layout for trainer cards.

**Files**:
- `src/app/features/home/trainers/trainers.component.html` (update)

**Acceptance**:
- [ ] Section header: `<h2>Unser Trainerteam</h2>`
- [ ] Optional intro paragraph
- [ ] CSS Grid container for cards
- [ ] `@for` loop over trainers signal
- [ ] `<app-trainer-card [trainer]="trainer">`
- [ ] Loading state: skeleton cards or spinner
- [ ] Error state: message with retry button
- [ ] Empty state: "Keine Trainer gefunden" (unlikely)
- [ ] Data attributes for E2E testing

**Test**: View trainers section, grid layout displays cards

---

### T015: Style Trainers grid with responsive columns
**Estimate**: 30 min | **Priority**: P1 | **Dependencies**: T014

Add CSS Grid styles for responsive layout.

**Files**:
- `src/app/features/home/trainers/trainers.component.scss` (update)

**Acceptance**:
- [ ] CSS Grid: `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))`
- [ ] Gap between cards: 24px
- [ ] Mobile (≤600px): 1 column
- [ ] Tablet (600-900px): 2 columns
- [ ] Desktop (>900px): 3-4 columns
- [ ] Section padding: responsive (16px mobile, 32px desktop)
- [ ] Header text centered

**Test**: Resize browser, verify grid adjusts columns

---

## Phase 4: Image Optimization (1.5 hours)

### T016: Add WebP conversion for trainer photos
**Estimate**: 30 min | **Priority**: P2 | **Dependencies**: T003

Convert placeholder and real trainer photos to WebP.

**Files**:
- `src/assets/images/trainers/*.webp` (new files)

**Acceptance**:
- [ ] All trainer photos have `.webp` version
- [ ] WebP files are ~30-50% smaller than JPEG
- [ ] Quality: WebP 80-85
- [ ] Use ImageMagick, Squoosh, or similar tool
- [ ] Update trainers.json with photoWebP field

**Test**: Load page, Network tab shows WebP images served (in supported browsers)

---

### T017: Implement responsive image sizes with srcset
**Estimate**: 40 min | **Priority**: P2 | **Dependencies**: T010, T016

Generate multiple image sizes for different viewports.

**Files**:
- `src/app/shared/components/trainer-card/trainer-card.component.html` (update)
- `src/assets/images/trainers/*.jpg` (add 150px, 200px, 300px versions)

**Acceptance**:
- [ ] Generate 3 sizes for each photo: 150px, 200px, 300px
- [ ] Update `<picture>` element with srcset
- [ ] `<source type="image/webp" srcset="...150w, ...200w, ...300w">`
- [ ] `<img>` fallback with srcset for JPEG
- [ ] `sizes` attribute: "(max-width: 600px) 150px, 200px"
- [ ] Browser selects appropriate size

**Test**: Use Network tab, verify smaller images load on mobile

---

### T018: Test lazy loading effectiveness
**Estimate**: 20 min | **Priority**: P2 | **Dependencies**: T010

Verify images only load when scrolled into view.

**Files**:
- N/A (testing)

**Acceptance**:
- [ ] Add 10+ trainers to JSON for testing
- [ ] Load trainers page
- [ ] Network tab: only 2-3 images load initially
- [ ] Scroll down: more images load progressively
- [ ] Lighthouse report: confirms lazy loading

**Test**: Scroll slowly, watch Network tab, verify progressive loading

---

## Phase 5: Translation & Polish (1 hour)

### T019: Add German translations for trainers section
**Estimate**: 15 min | **Priority**: P2 | **Dependencies**: T014

Add all trainer-related translation keys.

**Files**:
- `src/assets/i18n/de.json` (update)

**Acceptance**:
- [ ] `"trainers.title"` = "Unser Trainerteam"
- [ ] `"trainers.intro"` = "Lerne unser erfahrenes Trainerteam kennen"
- [ ] `"trainers.role.headInstructor"` = "Cheftrainer"
- [ ] `"trainers.role.instructor"` = "Trainer"
- [ ] `"trainers.role.assistant"` = "Assistenztrainer"
- [ ] `"trainers.programs.label"` = "Unterrichtet"
- [ ] `"trainers.loading"` = "Lade Trainer..."
- [ ] `"trainers.error"` = "Fehler beim Laden der Trainer"
- [ ] `"trainers.retry"` = "Erneut versuchen"

**Test**: View trainers section in German, all labels show correctly

---

### T020: Add English translations for trainers section
**Estimate**: 10 min | **Priority**: P3 | **Dependencies**: T019

Add English translations.

**Files**:
- `src/assets/i18n/en.json` (update)

**Acceptance**:
- [ ] Same keys as German with English values
- [ ] `"trainers.title"` = "Our Training Team"
- [ ] `"trainers.role.headInstructor"` = "Head Instructor"

**Test**: Switch to English, verify trainer translations

---

### T021: Enhance accessibility with semantic HTML
**Estimate**: 20 min | **Priority**: P2 | **Dependencies**: T014

Add proper semantic elements and ARIA attributes.

**Files**:
- `src/app/shared/components/trainer-card/trainer-card.component.html` (update)
- `src/app/features/home/trainers/trainers.component.html` (update)

**Acceptance**:
- [ ] Use `<article>` for each trainer card
- [ ] Proper heading hierarchy (h2 for section, h3 for names)
- [ ] `<figure>` with `<figcaption>` for photos
- [ ] Alt text descriptive: "Portrait photo of Max Müller" or "Initials MM"
- [ ] Role badge has `role="status"` or `aria-label`
- [ ] Grid has `role="list"` and cards have `role="listitem"` (optional)

**Test**: Use screen reader, verify proper structure and announcements

---

### T022: Add keyboard focus styling
**Estimate**: 15 min | **Priority**: P2 | **Dependencies**: T011

Ensure cards are keyboard accessible.

**Files**:
- `src/app/shared/components/trainer-card/trainer-card.component.scss` (update)

**Acceptance**:
- [ ] Cards have `tabindex="0"` if focusable
- [ ] Focus state: visible outline (2px solid primary color)
- [ ] Use `:focus-visible` to show outline only on keyboard focus
- [ ] Skip focus if cards are purely presentational (no actions)

**Test**: Tab through trainers grid, verify focus visible on keyboard

---

## Phase 6: Testing & Validation (2.5 hours)

### T023: Write unit tests for TrainerService
**Estimate**: 40 min | **Priority**: P1 | **Dependencies**: T007

Comprehensive unit tests for all service methods.

**Files**:
- `src/app/core/services/trainer.service.spec.ts` (update)

**Acceptance**:
- [ ] Test: loadTrainers() returns observable
- [ ] Test: loadTrainers() caches result (single HTTP call)
- [ ] Test: getTrainerById() finds trainer
- [ ] Test: getTrainerById() returns undefined for invalid ID
- [ ] Test: sortTrainers() sorts by last name (German locale)
- [ ] Test: sortTrainers() handles umlauts (ä, ö, ü)
- [ ] Test: handles HTTP errors gracefully
- [ ] All tests pass, 100% coverage

**Test**: Run `ng test`, verify all TrainerService tests pass

---

### T024: Write unit tests for TrainerCard component
**Estimate**: 30 min | **Priority**: P1 | **Dependencies**: T011

Unit tests for card component behavior.

**Files**:
- `src/app/shared/components/trainer-card/trainer-card.component.spec.ts` (update)

**Acceptance**:
- [ ] Test: component creates successfully
- [ ] Test: displays trainer name
- [ ] Test: shows role badge for head-instructor
- [ ] Test: hides role badge for null role
- [ ] Test: computes initials correctly
- [ ] Test: shows photo if photoUrl provided
- [ ] Test: shows initials if no photo
- [ ] Test: onImageLoad() sets loaded state
- [ ] Test: onImageError() falls back to initials
- [ ] All tests pass

**Test**: Run `ng test`, all TrainerCard tests pass

---

### T025: Write unit tests for Trainers component
**Estimate**: 30 min | **Priority**: P1 | **Dependencies**: T015

Unit tests for trainers page/section.

**Files**:
- `src/app/features/home/trainers/trainers.component.spec.ts` (update)

**Acceptance**:
- [ ] Test: component creates successfully
- [ ] Test: loads trainers on init
- [ ] Test: sorts trainers alphabetically
- [ ] Test: handles loading state
- [ ] Test: handles error state
- [ ] Test: displays trainer cards
- [ ] All tests pass

**Test**: Run `ng test`, all Trainers component tests pass

---

### T026: Create E2E test for trainers directory
**Estimate**: 40 min | **Priority**: P1 | **Dependencies**: T015

End-to-end test for complete trainers flow.

**Files**:
- `e2e/trainers-directory.spec.ts` (new)

**Acceptance**:
- [ ] Test: trainers section visible on page
- [ ] Test: displays correct number of trainers
- [ ] Test: trainers sorted alphabetically
- [ ] Test: images lazy-load when scrolled
- [ ] Test: initials fallback works if image fails
- [ ] Test: responsive grid (1 col mobile, 3 col desktop)
- [ ] Test: keyboard navigation (Tab through cards)
- [ ] All E2E tests pass

**Test**: Run `npx playwright test`, all trainers tests pass

---

### T027: Test with accessibility tools
**Estimate**: 20 min | **Priority**: P2 | **Dependencies**: T026

Run automated accessibility checks.

**Files**:
- N/A (testing)

**Acceptance**:
- [ ] Run Lighthouse CI on trainers page
- [ ] Accessibility score ≥90
- [ ] Run axe DevTools
- [ ] No critical accessibility violations
- [ ] Verify heading hierarchy
- [ ] Verify alt text on all images

**Test**: All accessibility checks pass, no violations

---

### T028: Manual cross-device testing
**Estimate**: 10 min | **Priority**: P2 | **Dependencies**: T026

Verify trainers directory works on different devices.

**Files**:
- N/A (manual testing)

**Acceptance**:
- [ ] Desktop: 3-4 column grid
- [ ] Tablet: 2 column grid
- [ ] Mobile: 1 column, cards full width
- [ ] Images lazy-load on all devices
- [ ] Touch targets ≥44px (if cards interactive)

**Test**: Test on 3+ viewport sizes, verify responsive behavior

---

## Phase 7: Documentation & Cleanup (30 min)

### T029: Update trainers.json with all 20 profiles
**Estimate**: 45 min | **Priority**: P1 | **Dependencies**: T002

Populate JSON with complete trainer data.

**Files**:
- `src/assets/data/trainers.json` (update)

**Acceptance**:
- [ ] 20 trainer profiles (approximate club size)
- [ ] All required fields populated
- [ ] Mix of roles (1 head, 5-7 instructors, rest assistants)
- [ ] Realistic programs taught
- [ ] Photo URLs point to real or placeholder images
- [ ] Valid JSON format

**Test**: Load trainers page, verify all 20 trainers display

---

### T030: Create trainer photo guidelines document
**Estimate**: 20 min | **Priority**: P3 | **Dependencies**: T017

Document photo requirements for future additions.

**Files**:
- `docs/trainer-photos.md` (new)

**Acceptance**:
- [ ] Photo size requirements: 300x300px minimum
- [ ] Format: JPEG + WebP, 3 sizes (150, 200, 300px)
- [ ] Background: neutral, consistent lighting
- [ ] File naming convention: `lastname-firstname.jpg`
- [ ] Optimization: <50KB per image
- [ ] Instructions for adding new trainer

**Test**: Read document, verify instructions are clear

---

### T031: Update README with trainers feature
**Estimate**: 10 min | **Priority**: P3 | **Dependencies**: T030

Document the trainers directory feature.

**Files**:
- `README.md` (update)

**Acceptance**:
- [ ] Add "Trainers Directory" to features list
- [ ] Brief description: "Alphabetical directory with photos and programs"
- [ ] Link to quickstart.md for usage
- [ ] Link to trainer-photos.md for photo guidelines

**Test**: Read README, verify information is accurate

---

### T032: Create PR and merge checklist
**Estimate**: 10 min | **Priority**: P3 | **Dependencies**: T031

Prepare for code review.

**Files**:
- GitHub PR (create)

**Acceptance**:
- [ ] PR title: "Feature: Trainers Directory"
- [ ] Description references feature spec
- [ ] Checklist: All unit tests pass
- [ ] Checklist: All E2E tests pass
- [ ] Checklist: Images optimized (WebP + responsive)
- [ ] Checklist: German sorting works
- [ ] Checklist: Lazy loading tested
- [ ] Checklist: Keyboard accessible
- [ ] Request review

**Test**: Create PR, verify CI/CD runs successfully

---

## Summary

**Total Tasks**: 32
**Estimated Time**: 11 hours
**Critical Path**: T001 → T002 → T004 → T005 → T007 → T008 → T009 → T010 → T012 → T013 → T014 → T023 → T026

**Priorities**:
- **P0 (Must-have)**: Data model setup (T001-T002)
- **P1 (Critical)**: Core functionality (T004-T015, T023-T026, T029)
- **P2 (Important)**: Polish & optimization (T003, T016-T018, T019, T021-T022, T027-T028)
- **P3 (Nice-to-have)**: Documentation (T020, T030-T032)

**Quick Start**: Begin with T001 to define Trainer interface, then create sample data (T002). Build TrainerService (T004-T007) before UI components. Test image lazy-loading early (T018).
