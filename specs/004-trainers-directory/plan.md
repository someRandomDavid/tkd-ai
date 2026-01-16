# Implementation Plan: Trainers Directory

**Branch**: `004-trainers-directory` | **Date**: 2026-01-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-trainers-directory/spec.md`

## Summary

Display directory of ~20 trainers with profile photos, names, programs taught, and special roles. Trainers organized alphabetically by last name in responsive grid (1 column mobile → 2 columns tablet → 3-4 columns desktop). Simple directory listing without individual detail pages. Zero new dependencies - uses Angular Material cards, lazy-loaded images, static JSON data.

## Technical Context

**Language/Version**: TypeScript 5.x, Angular 21.0.5
**Primary Dependencies**: @angular/core, @angular/material (existing - card), ngx-translate (existing), native loading="lazy" for images
**Storage**: Static JSON file in assets (trainers.json), trainer photos in assets/images/trainers/
**Testing**: Jasmine/Karma for unit tests, Playwright for E2E responsive layout and accessibility testing
**Target Platform**: Web (mobile-first responsive, last 2 browser versions)
**Project Type**: Single-page application (static pre-rendered)
**Performance Goals**: Initial render <1s on 3G (excluding images), lazy-load reduces initial load by 80%
**Constraints**: Zero new dependencies, touch-friendly, keyboard accessible, WCAG AA
**Scale/Scope**: ~20 trainer profiles, ~1MB total images (loaded progressively)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Taekwon-do Ailingen Website Constitution:

- **Mobile-First Design**: [x] Mobile breakpoints designed first (single-column cards, responsive grid) [x] Touch targets ≥44px (N/A - cards are view-only, no interactions) [x] Mobile testing planned (E2E tests on mobile viewport)
- **Minimal Dependencies**: [x] New dependencies justified (NONE - uses existing Material card, ngx-translate, native lazy loading) [x] Bundle size impact measured (0KB new dependencies) [x] Angular built-ins preferred (native loading="lazy", Array.sort)
- **Component-First**: [x] Components single-responsibility (TrainerCard displays one trainer, TrainersSection manages grid) [x] Reusable & independently testable (TrainerCard can be used elsewhere) [x] Clear @Input/@Output contracts (@Input trainer data)
- **Static-First**: [x] Content pre-rendered where possible (all trainer data from JSON, no API) [x] API calls minimized (none - static JSON file) [x] No server runtime required (static assets only)
- **Accessibility**: [x] WCAG 2.1 AA compliance planned (alt text, contrast ratios, keyboard nav) [x] Semantic HTML (proper heading hierarchy, figure elements) [x] Keyboard navigation (cards focusable in tab order) [x] Automated a11y tests (Lighthouse CI)
- **Performance**: [x] Performance budget considered (<1s initial render, lazy-load images) [x] Images optimized (WebP + JPEG fallback, responsive srcset)

**GATE STATUS**: ✅ PASS - No constitution violations. Zero new dependencies, uses existing Material card + ngx-translate, mobile-first responsive grid, fully accessible.

## Project Structure

### Documentation (this feature)

```text
specs/004-trainers-directory/
├── plan.md              # This file
├── research.md          # Phase 0 output - German sorting, lazy-loading patterns, grid layouts
├── data-model.md        # Phase 1 output - Trainer interface, validation rules
├── quickstart.md        # Phase 1 output - how to add/update trainers, photo guidelines
├── contracts/           # Phase 1 output - TrainerService API (if needed)
└── checklists/
    └── requirements.md  # Quality checklist (COMPLETE)
```

### Source Code (repository root)

```text
tkd-ailingen-website/src/
├── app/
│   ├── core/
│   │   └── services/
│   │       └── trainer.service.ts            # TrainerService: load trainer data from JSON
│   │       └── trainer.service.spec.ts
│   ├── shared/
│   │   └── components/
│   │       └── trainer-card/
│   │           ├── trainer-card.component.ts      # Individual trainer card
│   │           ├── trainer-card.component.html
│   │           ├── trainer-card.component.scss
│   │           └── trainer-card.component.spec.ts
│   └── pages/
│       └── trainers/
│           └── trainers.component.ts              # Trainers page component (or section if on homepage)
│           └── trainers.component.html
│           └── trainers.component.scss
│           └── trainers.component.spec.ts
├── assets/
│   ├── data/
│   │   └── trainers.json                          # Trainer data (20 profiles)
│   ├── images/
│   │   └── trainers/
│   │       ├── mueller-max.webp                   # Trainer photos (WebP + JPEG)
│   │       ├── mueller-max.jpg
│   │       ├── schmidt-anna.webp
│   │       ├── schmidt-anna.jpg
│   │       └── ...
│   └── i18n/
│       ├── de.json               # German translations (program names, roles, section heading)
│       └── en.json               # English translations
└── styles/
    └── _trainer-cards.scss       # Shared trainer card styling (if needed)

e2e/
└── src/
    └── trainers-directory.e2e-spec.ts  # E2E tests: responsive layout, sorting, accessibility
```

**Structure Decision**: TrainerService in `core/services` loads trainer data from JSON. TrainerCard component in `shared/components` for potential reuse. Trainers page/section in `pages/trainers` or as section on homepage depending on navigation structure. Follows homepage feature patterns.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - all Constitution principles followed.

---

## Phase 0: Outline & Research

### Unknowns from Technical Context

1. **German Locale Sorting**
   - How to sort names with umlauts (ä, ö, ü) alphabetically?
   - JavaScript localeCompare with German locale ('de-DE')?
   - Should normalize umlauts for sorting (ä→a) or use locale rules?

2. **Lazy Loading Best Practices**
   - Native loading="lazy" vs. Intersection Observer API?
   - How many images to load initially (first 4-6)?
   - Progressive enhancement fallback strategy?

3. **Responsive Grid Layout**
   - CSS Grid vs. Flexbox for responsive columns?
   - Equal height cards technique (flex-grow, grid auto-rows)?
   - Breakpoint strategy for 1→2→3-4 columns?

4. **Image Optimization Pipeline**
   - How to generate WebP + JPEG fallbacks?
   - Responsive srcset breakpoints for trainer photos?
   - Image dimensions and aspect ratios?

5. **Fallback Placeholder Design**
   - How to generate initials from trainer name?
   - Placeholder colors and styling (background, text contrast)?
   - SVG or CSS-based placeholder?

### Research Tasks

1. **German Locale Sorting Research**
   - Task: Research JavaScript localeCompare for German name sorting
   - Focus: Handling umlauts (ä, ö, ü), locale parameter usage, edge cases
   - Expected Output: Sorting algorithm using localeCompare with 'de-DE' locale

2. **Image Lazy Loading Patterns**
   - Task: Research native loading="lazy" vs. custom lazy loading solutions
   - Focus: Browser support, performance characteristics, fallback strategies
   - Expected Output: Decision on lazy loading approach (likely native loading="lazy")

3. **Responsive CSS Grid Layouts**
   - Task: Research CSS Grid patterns for responsive card grids with equal heights
   - Focus: auto-fit vs. auto-fill, minmax(), grid-auto-rows, breakpoint strategies
   - Expected Output: CSS Grid implementation pattern for 1→2→3-4 column responsive layout

4. **Image Optimization Best Practices**
   - Task: Research image optimization workflow for WebP + JPEG with srcset
   - Focus: Responsive image sizes, srcset syntax, picture element usage
   - Expected Output: Image processing guidelines and HTML structure for trainer photos

5. **Placeholder Initials Generation**
   - Task: Research patterns for generating initials placeholders when images fail
   - Focus: String manipulation for initials, accessible fallback design, contrast requirements
   - Expected Output: Function to generate initials + CSS styling for placeholder

---

## Phase 1: Design & Contracts

### Data Model

**Output File**: `data-model.md`

**Entities**:

1. **Trainer** (interface)
   - Properties:
     - `id`: `string` (unique identifier, e.g., "trainer-001")
     - `firstName`: `string` (first name)
     - `lastName`: `string` (last name, used for sorting)
     - `photoUrl`: `string` (relative path to photo, e.g., "/assets/images/trainers/mueller-max.jpg")
     - `programs`: `string[]` (array of program identifiers: "taekwondo" | "zumba" | "deepwork")
     - `specialRoles`: `string[]` (optional, role keys like "youth-protection-officer", "head-instructor")
     - `sortKey?`: `string` (optional computed field for normalized sorting, e.g., "mueller" from "Müller")
   - Description: Trainer profile data
   - Storage: Static JSON file in assets/data/trainers.json

2. **TrainersData** (interface)
   - Properties:
     - `trainers`: `Trainer[]` (array of all trainer profiles)
   - Description: Root structure of trainers.json file

**Validation Rules**:
- `id` must be unique across all trainers
- `firstName` and `lastName` must be non-empty strings
- `photoUrl` must be valid relative path (validation optional, graceful degradation on 404)
- `programs` array must contain at least one value from ["taekwondo", "zumba", "deepwork"]
- `specialRoles` array can be empty
- Sorting uses `lastName` with German locale rules ('de-DE')

**Example JSON**:
```json
{
  "trainers": [
    {
      "id": "trainer-001",
      "firstName": "Max",
      "lastName": "Müller",
      "photoUrl": "/assets/images/trainers/mueller-max.jpg",
      "programs": ["taekwondo"],
      "specialRoles": ["youth-protection-officer"]
    },
    {
      "id": "trainer-002",
      "firstName": "Anna",
      "lastName": "Schmidt",
      "photoUrl": "/assets/images/trainers/schmidt-anna.jpg",
      "programs": ["taekwondo", "zumba", "deepwork"],
      "specialRoles": []
    }
  ]
}
```

### API Contracts

**Output Dir**: `contracts/`

**Contract**: `TrainerService` API (if service needed - may be simple HttpClient call)

```typescript
// contracts/trainer-service.interface.ts

export interface ITrainerService {
  /**
   * Load all trainers from static JSON file
   * @returns Observable of sorted trainer array (alphabetical by last name)
   */
  getTrainers(): Observable<Trainer[]>;

  /**
   * Get trainers teaching a specific program
   * @param program Program identifier ("taekwondo" | "zumba" | "deepwork")
   * @returns Observable of filtered trainer array
   */
  getTrainersByProgram(program: string): Observable<Trainer[]>;

  /**
   * Sort trainers alphabetically by last name using German locale
   * @param trainers Array of trainers to sort
   * @returns Sorted array
   */
  sortTrainersAlphabetically(trainers: Trainer[]): Trainer[];
}
```

**Note**: Service may be optional if TrainersComponent directly uses HttpClient to load JSON and sorts inline.

### Agent Context Update

**Action**: Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType copilot`

**New Technology to Add**:
- CSS Grid for responsive card layout (native CSS, document pattern for auto-fit columns)
- Native image lazy loading with loading="lazy" attribute (document usage)
- JavaScript localeCompare with German locale for name sorting (document 'de-DE' parameter)
- Picture element with srcset for responsive images (already used, reinforce pattern)

**Manual Additions to Preserve**: Any existing project structure notes, component patterns, or testing strategies between markers.

### Quickstart Guide

**Output File**: `quickstart.md`

**Content**:
- How to add a new trainer to trainers.json
- Photo guidelines (dimensions, format, file naming convention)
- How to add new program types or special roles
- How to update trainer information
- How to test trainer directory locally
- Translation key structure for programs and roles

---

## Phase 2: NOT EXECUTED (Command stops after Phase 1)

**Note**: Phase 2 (task breakdown) is handled by `/speckit.tasks` command, not `/speckit.plan`.

---

## Implementation Notes

### Key Architecture Decisions

1. **Data Loading**: TrainerService loads trainers.json via HttpClient, sorts alphabetically using German locale
2. **Sorting Strategy**: Use `Array.sort()` with `localeCompare('de-DE')` for proper German umlaut handling
3. **Grid Layout**: CSS Grid with `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))` for responsive columns
4. **Image Strategy**: Native loading="lazy", picture element with WebP + JPEG fallback, responsive srcset
5. **Component Structure**: TrainerCard presentational component, TrainersSection/Component orchestrates layout

### Risk Mitigations

1. **Inconsistent Photos**: Provide photo guidelines to club (400×400px min, square crop, neutral background, WebP + JPEG)
2. **Long Trainer Names**: Test with longest name (e.g., "Dr. Wolfgang Müller-Schmidt"), allow wrapping, set reasonable max-width
3. **Image Load Failures**: Fallback placeholder with initials (first letter firstName + first letter lastName), contrasting background
4. **Slow Image Loading**: Lazy loading ensures only visible images load initially, prioritize above-the-fold trainers

### Dependencies on Other Features

- **Homepage (001-homepage)**: Follows same styling patterns, card design, badge styling as other sections
- **Theme Toggle (002-theme-toggle)**: Trainer cards must support both dark/light themes using CSS custom properties
- **i18n Structure**: Requires translation keys for program names (taekwondo, zumba, deepwork) and special roles

### Post-Design Constitution Re-Check

**After Phase 1 Design Complete**:
- [ ] Mobile-first: Single-column cards on mobile, responsive grid with proper breakpoints
- [ ] Minimal deps: Confirmed zero new dependencies (uses existing Material, ngx-translate, native lazy loading)
- [ ] Component-first: TrainerCard reusable, TrainersSection orchestrates layout
- [ ] Static-first: All data from static JSON, images from assets, no API calls
- [ ] Accessibility: Alt text on images, keyboard nav, proper heading hierarchy, WCAG AA contrast
- [ ] Performance: Lazy-loaded images, <1s initial render, 80% load reduction
