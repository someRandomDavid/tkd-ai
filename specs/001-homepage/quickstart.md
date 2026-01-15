# Quickstart Guide: Club Homepage

**Feature**: Club Homepage  
**Branch**: `001-homepage`  
**Created**: 2026-01-12

This guide helps developers set up, run, and verify the Taekwon-do Ailingen club homepage implementation.

## Prerequisites

- Node.js 18.x or 20.x (LTS)
- npm 9.x or higher
- Git
- VS Code (recommended) with Angular Language Service extension
- Chrome/Firefox for testing

---

## Initial Setup

### 1. Clone and Install

```bash
# Clone repository (if not already done)
git clone <repository-url>
cd tkd-ai

# Checkout feature branch
git checkout 001-homepage

# Install dependencies
npm install
```

**Expected Dependencies** (from package.json):
- @angular/core, @angular/router, @angular/common (~18.x)
- @angular/material, @angular/cdk (~18.x)
- @ngx-translate/core, @ngx-translate/http-loader (~15.x)
- TypeScript 5.x
- Playwright (for E2E)

### 2. Verify Installation

```bash
# Check Angular CLI version
ng version

# Should show:
# Angular CLI: 18.x.x
# Node: 18.x.x or 20.x.x
# Package Manager: npm 9.x.x
```

---

## Development Workflow

### 1. Start Development Server

```bash
# Run dev server with live reload
ng serve

# App runs at: http://localhost:4200
# Opens automatically in browser
```

**Expected Output**:
```
✔ Browser application bundle generation complete.
Initial Chunk Files | Names         |  Raw Size
main.js             | main          | 250.00 kB |
styles.css          | styles        |  45.00 kB |

Build at: 2026-01-12T10:00:00.000Z - Hash: abc123 - Time: 5000ms
** Angular Live Development Server is listening on localhost:4200 **
```

### 2. Navigate to Homepage

Open http://localhost:4200 in browser. You should see:

✅ **P1 - Essential Info**:
- Club name "Taekwon-do Ailingen" in hero section
- Tagline/motto with hero image
- Welcome section with program descriptions
- Training schedules for Taekwon-do, Zumba, deepWORK
- Footer with contact info

✅ **P2 - Navigation**:
- Hamburger menu on mobile (<768px)
- Inline navigation on desktop (≥768px)
- Navigation links: Training, Zumba, deepWORK, Membership, Events, Downloads, About, Contact
- Smooth scroll to anchors

✅ **P3 - Downloads**:
- Downloads section with 2 PDFs:
  - Mitgliedsantrag (member registration)
  - International Bodensee Cup registration
- File name, description, size/type displayed

✅ **P4 - CTAs**:
- "Kostenloses Probetraining" button (opens mailto)
- "Kontakt aufnehmen" button (navigates to /contact or shows modal)

---

## Testing

### Unit Tests

```bash
# Run all unit tests
ng test

# Run with code coverage
ng test --code-coverage

# Coverage report in: coverage/index.html
```

**Expected Coverage Targets**:
- Overall: ≥80%
- Components: ≥85%
- Services: ≥90%

### E2E Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
ng e2e

# Or run Playwright directly
npx playwright test

# Run specific test file
npx playwright test e2e/src/homepage.e2e-spec.ts

# Run with UI mode (interactive)
npx playwright test --ui
```

**Expected E2E Test Suites**:
- ✅ `homepage.e2e-spec.ts` - P1: Essential info visible
- ✅ `navigation.e2e-spec.ts` - P2: Navigation works
- ✅ `downloads.e2e-spec.ts` - P3: Downloads accessible
- ✅ `cta.e2e-spec.ts` - P4: CTAs functional

### Accessibility Tests

```bash
# E2E tests include axe-core accessibility checks
npx playwright test --grep @a11y

# Manual test with Chrome DevTools:
# 1. Open http://localhost:4200
# 2. DevTools > Lighthouse
# 3. Select "Accessibility" category
# 4. Run audit
# Expected: Score = 100
```

### Performance Tests

```bash
# Lighthouse CI (if configured)
npm run lighthouse

# Manual Lighthouse test:
# 1. Open http://localhost:4200
# 2. DevTools > Lighthouse
# 3. Select "Performance" category
# 4. Throttle to "Slow 3G"
# 5. Run audit
# Expected: Score ≥ 90
```

---

## Content Updates

### Update Club Information

**File**: `src/assets/data/club-info.json`

```json
{
  "name": "Taekwon-do Ailingen",
  "tagline": "Your tagline here",
  "description": "Your club description...",
  ...
}
```

After editing, refresh browser (http://localhost:4200) - changes appear immediately.

### Update Training Schedule

**File**: `src/assets/data/training-sessions.json`

```json
{
  "lastUpdated": "2026-01-12T10:00:00Z",
  "sessions": [
    {
      "id": "tkd-mon-kids",
      "programType": "taekwondo",
      "dayOfWeek": "monday",
      "startTime": "17:00",
      "endTime": "18:00",
      ...
    }
  ]
}
```

### Add Download Form

1. Place PDF in `src/assets/forms/your-form.pdf`
2. Update `src/assets/data/downloads.json`:

```json
{
  "forms": [
    {
      "id": "your-form-id",
      "formName": "Your Form Name",
      "description": "Description of form",
      "fileUrl": "/assets/forms/your-form.pdf",
      "fileType": "pdf",
      "fileSize": 123456,
      "category": "membership",
      "lastUpdated": "2026-01-12T00:00:00Z"
    }
  ]
}
```

---

## Theme Customization

### Update Colors

**File**: `src/styles/_theme.scss`

```scss
// Define custom Material palettes
$tkd-primary: mat.define-palette(mat.$red-palette, 700);
$tkd-accent: mat.define-palette(mat.$grey-palette, 900);
$tkd-warn: mat.define-palette(mat.$red-palette, 900);

// Create theme
$tkd-theme: mat.define-light-theme((
  color: (
    primary: $tkd-primary,
    accent: $tkd-accent,
    warn: $tkd-warn,
  )
));

// Apply theme
@include mat.all-component-themes($tkd-theme);
```

**File**: `src/styles/_variables.scss`

```scss
// Brand colors
$color-primary-red: #c62828;
$color-accent-black: #212121;
$color-background-white: #ffffff;
$color-text-dark: #212121;
$color-text-light: #ffffff;

// Shades
$color-red-light: #ef5350;
$color-red-dark: #b71c1c;
$color-grey-light: #f5f5f5;
$color-grey-dark: #424242;
```

After saving, refresh browser - theme updates immediately.

---

## Translations

### Update German Translations

**File**: `src/assets/i18n/de.json`

```json
{
  "HERO": {
    "TITLE": "Taekwon-do Ailingen",
    "TAGLINE": "Traditionelle Kampfkunst für alle"
  },
  "NAV": {
    "TRAINING": "Training",
    "ZUMBA": "Zumba",
    ...
  }
}
```

### Add English Translations

**File**: `src/assets/i18n/en.json`

```json
{
  "HERO": {
    "TITLE": "Taekwon-do Ailingen",
    "TAGLINE": "Traditional Martial Arts for Everyone"
  },
  "NAV": {
    "TRAINING": "Training",
    "ZUMBA": "Zumba",
    ...
  }
}
```

### Switch Language (Future)

```typescript
// In component
constructor(private translate: TranslateService) {
  translate.use('de'); // or 'en'
}
```

---

## Build for Production

### 1. Production Build

```bash
# Build optimized bundle
ng build --configuration production

# Output in: dist/tkd-ai/
```

**Expected Output**:
```
Initial Chunk Files   | Names         |  Raw Size | Estimated Transfer Size
main.abc123.js        | main          | 180.00 kB |              50.00 kB
styles.def456.css     | styles        |  35.00 kB |               8.00 kB

Build at: 2026-01-12T10:00:00.000Z - Hash: abc123
✔ Browser bundle generation complete.
```

### 2. Verify Bundle Size

```bash
# Check bundle sizes
ls -lh dist/tkd-ai/browser/*.js

# Total JS should be < 200KB gzipped
```

### 3. Test Production Build Locally

```bash
# Install simple HTTP server
npm install -g http-server

# Serve production build
cd dist/tkd-ai/browser
http-server -p 8080

# Open http://localhost:8080
```

### 4. Run Lighthouse on Production Build

```bash
# With build running on localhost:8080
lighthouse http://localhost:8080 --view

# Expected scores:
# Performance: ≥ 90
# Accessibility: 100
# Best Practices: ≥ 90
# SEO: ≥ 90
```

---

## Deployment

### Static Hosting Options

**GitHub Pages**:
```bash
# Build with base href
ng build --configuration production --base-href /tkd-ai/

# Deploy to gh-pages branch
npx angular-cli-ghpages --dir=dist/tkd-ai/browser
```

**Netlify**:
```bash
# Build command: ng build --configuration production
# Publish directory: dist/tkd-ai/browser
```

**Vercel**:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

---

## Common Issues & Solutions

### Issue: Module not found errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 4200 already in use

```bash
# Use different port
ng serve --port 4300
```

### Issue: Slow build times

```bash
# Enable Angular build cache
ng config cli.cache.enabled true

# Or use esbuild (faster)
ng build --configuration production --builder @angular-devkit/build-angular:browser-esbuild
```

### Issue: Material styles not loading

```bash
# Ensure Material theme imported in styles.scss
# Check: src/styles/styles.scss includes:
@use '@angular/material' as mat;
@include mat.core();
```

### Issue: Translation files not loading

```bash
# Verify ngx-translate configuration in app.module.ts
# Check: TranslateModule.forRoot() with HttpLoaderFactory
```

---

## Performance Optimization Checklist

Before deploying:

- [ ] Run `ng build --configuration production`
- [ ] Check bundle size < 200KB (gzipped)
- [ ] Lighthouse Performance score ≥ 90
- [ ] Lighthouse Accessibility score = 100
- [ ] Images optimized (WebP + fallback)
- [ ] Lazy loading enabled for Material modules
- [ ] OnPush change detection on all components
- [ ] Service worker configured (optional)
- [ ] GZIP compression enabled on server

---

## Verification Checklist

Use this checklist to verify complete feature implementation:

### Functional Requirements

- [ ] FR-001: Club name + tagline in hero with overlay ✅
- [ ] FR-002: Welcome section with all programs (max 200 words) ✅
- [ ] FR-003: Separate schedules for Taekwon-do, Zumba, deepWORK ✅
- [ ] FR-004: Responsive navigation (hamburger <768px, inline ≥768px) ✅
- [ ] FR-005: Downloads section with 2 forms ✅
- [ ] FR-006: CTA buttons (Free Trial, Contact) ✅
- [ ] FR-007: Download links show name, description, type/size ✅
- [ ] FR-008: PDFs viewable and savable ✅
- [ ] FR-009: Hero image displayed ✅
- [ ] FR-010: Footer with address, phone, email, social (FB, IG) ✅
- [ ] FR-011: Touch targets ≥ 44px ✅
- [ ] FR-012: Semantic HTML5 (header, main, nav, section, footer) ✅
- [ ] FR-013: All images have alt text ✅
- [ ] FR-014: WCAG 2.1 AA contrast (4.5:1 normal, 3:1 large) ✅
- [ ] FR-015: Keyboard navigation works ✅
- [ ] FR-016: Current section highlighted in nav ✅
- [ ] FR-017: Critical content loads < 1.5s (3G) ✅
- [ ] FR-018: Responsive (320px+, 768px+, 1024px+) ✅

### Success Criteria

- [ ] SC-001: Users find info within 5 seconds ✅
- [ ] SC-002: Lighthouse Performance ≥ 90 ✅
- [ ] SC-003: Lighthouse Accessibility = 100 ✅
- [ ] SC-004: FCP < 1.5s (3G) ✅
- [ ] SC-005: TTI < 3.5s (3G) ✅
- [ ] SC-006: 100% keyboard accessible ✅
- [ ] SC-007: 100% WCAG AA contrast ✅
- [ ] SC-008: Bundle < 50KB (homepage only) ✅
- [ ] SC-009: Keyboard navigation to all sections ✅
- [ ] SC-010: 90% users find schedule easily ✅

### User Stories

- [ ] P1: View Essential Info - Tested ✅
- [ ] P2: Navigate & Check Schedule - Tested ✅
- [ ] P3: Access Downloads - Tested ✅
- [ ] P4: Take Action (CTAs) - Tested ✅

---

## Next Steps

After homepage is complete:

1. **Create additional pages** (referenced in navigation):
   - `/membership` - Membership info and pricing
   - `/events` - Events calendar
   - `/about` - Club history and team
   - `/contact` - Contact form

2. **Enhance homepage**:
   - Add image gallery section
   - Add news/announcements section
   - Add testimonials/reviews
   - Add embedded Google Maps for location

3. **Advanced features**:
   - Member login portal
   - Online registration forms
   - Event RSVP system
   - Newsletter signup

---

## Support & Documentation

- **Angular Docs**: https://angular.dev/
- **Material Docs**: https://material.angular.io/
- **ngx-translate Docs**: https://github.com/ngx-translate/core
- **Playwright Docs**: https://playwright.dev/
- **Constitution**: `.specify/memory/constitution.md`
- **Spec**: `specs/001-homepage/spec.md`
- **Plan**: `specs/001-homepage/plan.md`
- **Data Model**: `specs/001-homepage/data-model.md`

For questions or issues, refer to the project documentation or create a GitHub issue.
