<!--
SYNC IMPACT REPORT - Constitution Update

Version Change: NEW → 1.0.0
Type: MAJOR (Initial constitution ratification)

Modified Principles: N/A (Initial creation)
Added Sections:
  - Core Principles (5 principles established)
  - Technology Stack
  - Development Standards
  - Governance

Templates Status:
  ✅ plan-template.md - Verified compatible (single project structure aligns)
  ✅ spec-template.md - Verified compatible (user story prioritization supports mobile-first)
  ✅ tasks-template.md - Verified compatible (phase-based approach supports component-first principle)

Follow-up TODOs: None

Rationale:
  - MAJOR bump: Initial constitution establishing governance framework
  - Principles tailored to static Angular website with mobile-first approach
  - Focus on simplicity and maintainability for club website context
-->

# Taekwon-do Ailingen Website Constitution

## Core Principles

### I. Mobile-First Design (NON-NEGOTIABLE)

All features MUST be designed and implemented for mobile devices first, then progressively
enhanced for larger screens. This ensures optimal experience for the primary user base
accessing club information on-the-go.

**Rules**:
- Responsive breakpoints start at mobile (320px) and scale up
- Touch targets MUST be minimum 44x44px
- Performance budgets prioritize mobile networks (3G baseline)
- Testing on mobile devices/emulators required before desktop
- CSS uses mobile-first media queries exclusively

**Rationale**: Club members and prospective students primarily access information via
smartphones. Mobile-first ensures core functionality works for all users while enabling
richer experiences on larger devices.

### II. Minimal Dependencies

External dependencies MUST be minimized and justified. Every added library increases
maintenance burden, security surface, and bundle size. Prefer Angular built-ins and
native web APIs over third-party solutions.

**Rules**:
- New dependencies require documented justification in PR
- Regular dependency audits (monthly) for security and necessity
- Bundle size impact MUST be measured for new dependencies
- Tree-shakeable dependencies preferred
- Remove unused dependencies immediately

**Rationale**: As a club website maintained by volunteers, minimizing dependencies
reduces long-term maintenance effort, security vulnerabilities, and keeps the site fast
and reliable.

### III. Component-First Architecture

Every UI element MUST be built as a standalone, reusable Angular component with clear
inputs, outputs, and single responsibility. Components MUST be independently testable
and documented with usage examples.

**Rules**:
- One component per file following Angular style guide
- Components MUST have defined @Input/@Output contracts
- Shared components documented in Storybook or equivalent
- Component templates kept under 100 lines (split if larger)
- Smart/presentational component separation enforced

**Rationale**: Component-first design ensures maintainability, testability, and enables
volunteers to understand and modify specific features without understanding the entire
codebase.

### IV. Static-First Content Strategy

Content MUST be statically generated or pre-rendered where possible. Dynamic content
limited to essential interactive features (e.g., contact forms). This ensures fast load
times, SEO optimization, and simple hosting requirements.

**Rules**:
- Default to static content in templates/markdown
- Angular pre-rendering configured for all routes
- API calls minimized and only for dynamic features
- Content changes deployable via static build process
- No server-side runtime dependencies required

**Rationale**: Static content provides instant page loads, works offline, requires minimal
hosting infrastructure, and is easier to maintain for a club website context.

### V. Accessibility & Inclusive Design

All features MUST meet WCAG 2.1 Level AA standards. The website serves a diverse
community and must be accessible to members with disabilities, different devices, and
varying technical literacy.

**Rules**:
- Semantic HTML required (proper heading hierarchy, landmarks)
- All images MUST have descriptive alt text
- Color contrast ratios meet WCAG AA (4.5:1 normal text, 3:1 large text)
- Keyboard navigation fully functional for all interactive elements
- ARIA labels provided where semantic HTML insufficient
- Automated accessibility testing in CI pipeline

**Rationale**: Inclusivity is core to martial arts values. Ensuring accessibility
demonstrates respect for all members and expands reach to potential new students.

## Technology Stack

**Framework**: Angular (latest LTS version)
- Leverages TypeScript for type safety
- Component-based architecture aligns with Principle III
- Built-in tools minimize external dependencies (Principle II)
- Pre-rendering supports static-first strategy (Principle IV)

**Styling**: CSS3 with CSS Custom Properties
- Mobile-first responsive design (Principle I)
- No CSS framework required initially (Principle II)
- Scoped component styles via Angular
- Consistent theming via custom properties

**Build & Deployment**:
- Angular CLI for build tooling
- Static hosting (GitHub Pages, Netlify, or similar)
- CI/CD via GitHub Actions
- Performance budgets enforced in build

**Quality Assurance**:
- Angular testing tools (Jasmine/Karma or Jest)
- Playwright/Cypress for E2E testing
- Lighthouse CI for performance/accessibility audits
- ESLint + Prettier for code quality

## Development Standards

**Performance Budget**:
- First Contentful Paint < 1.5s (3G connection)
- Time to Interactive < 3.5s (3G connection)
- Initial JavaScript bundle < 200KB (gzipped)
- Lighthouse Performance score ≥ 90

**Browser Support**:
- Last 2 versions of major browsers (Chrome, Firefox, Safari, Edge)
- iOS Safari 13+, Android Chrome 90+
- Graceful degradation for older browsers

**Content Management**:
- Content stored in structured format (JSON/Markdown)
- Images optimized (WebP with fallbacks, responsive srcset)
- German language primary, with i18n structure for future localization

**Security**:
- No sensitive data stored client-side
- Content Security Policy configured
- Dependency vulnerability scanning automated
- HTTPS enforced

## Governance

This constitution supersedes all other development practices and decisions. Adherence to
these principles ensures the website remains maintainable, performant, and aligned with
the club's mission of accessible martial arts education.

**Amendment Process**:
- Amendments require documented rationale and impact assessment
- Version bump follows semantic versioning (MAJOR for principle changes, MINOR for
  additions, PATCH for clarifications)
- Migration plan required for breaking changes
- All amendments recorded in git history with this document

**Compliance Review**:
- All feature specifications MUST reference constitution principles
- Pull requests MUST verify compliance with applicable principles
- Monthly audits review adherence to mobile-first, dependencies, and performance budgets
- Complexity that violates principles MUST be explicitly justified or refactored

**Living Document**:
- Constitution reviewed quarterly for relevance
- Principle adjustments based on actual maintenance experience
- Community feedback welcomed via GitHub issues

**Version**: 1.0.0 | **Ratified**: 2026-01-09 | **Last Amended**: 2026-01-09
