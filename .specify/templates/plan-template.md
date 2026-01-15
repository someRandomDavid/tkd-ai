# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x, Angular 18+ (LTS)
**Primary Dependencies**: @angular/core, @angular/router, @angular/common
**Storage**: Static JSON/Markdown content files
**Testing**: Jasmine/Karma or Jest, Playwright/Cypress for E2E
**Target Platform**: Web (mobile-first responsive, last 2 browser versions)
**Project Type**: Single-page application (static pre-rendered)
**Performance Goals**: FCP <1.5s (3G), TTI <3.5s (3G), Lighthouse ≥90
**Constraints**: <200KB initial JS bundle (gzipped), WCAG 2.1 AA compliance
**Scale/Scope**: Club website (~10-20 pages, 100-500 visitors/month)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Taekwon-do Ailingen Website Constitution:

- **Mobile-First Design**: [ ] Mobile breakpoints designed first? [ ] Touch targets ≥44px? [ ] Mobile testing planned?
- **Minimal Dependencies**: [ ] New dependencies justified? [ ] Bundle size impact measured? [ ] Angular built-ins preferred?
- **Component-First**: [ ] Components single-responsibility? [ ] Reusable & independently testable? [ ] Clear @Input/@Output contracts?
- **Static-First**: [ ] Content pre-rendered where possible? [ ] API calls minimized? [ ] No server runtime required?
- **Accessibility**: [ ] WCAG 2.1 AA compliance planned? [ ] Semantic HTML? [ ] Keyboard navigation? [ ] Automated a11y tests?
- **Performance**: [ ] Performance budget considered (<200KB JS, FCP <1.5s)? [ ] Images optimized?

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Adapt the Angular structure below for the specific feature.
  Add/remove directories as needed based on the feature requirements.
  The structure follows Angular best practices and Component-First principle.
-->

```text
# Angular Project Structure
src/
├── app/
│   ├── core/                  # Singleton services, guards, interceptors
│   │   ├── services/
│   │   ├── guards/
│   │   └── interceptors/
│   ├── shared/                # Reusable components, directives, pipes
│   │   ├── components/
│   │   ├── directives/
│   │   └── pipes/
│   ├── features/              # Feature modules (lazy-loaded where possible)
│   │   └── [feature-name]/
│   │       ├── components/
│   │       ├── services/
│   │       └── models/
│   ├── pages/                 # Routed page components
│   └── layouts/               # Layout components (header, footer, etc.)
├── assets/
│   ├── images/
│   ├── i18n/                  # Translations (German primary)
│   └── data/                  # Static JSON/content files
└── styles/
    ├── _variables.css         # CSS custom properties
    ├── _mixins.css
    └── main.css

# Testing Structure
src/
└── app/
    └── [feature]/
        └── *.spec.ts          # Unit tests co-located with components

e2e/
├── src/
│   └── [feature].e2e-spec.ts # End-to-end tests
└── playwright.config.ts       # or cypress.config.ts
```

**Structure Decision**: Angular single-page application with component-first architecture.
Features organized as modules under `src/app/features/` for clear separation of concerns
and potential lazy-loading. Shared components in `src/app/shared/` for reusability across
features.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
