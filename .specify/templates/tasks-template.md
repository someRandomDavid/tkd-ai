---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

**Angular Project Structure** (align with plan.md):
- **Components**: `src/app/features/[feature-name]/components/`
- **Shared Components**: `src/app/shared/components/`
- **Services**: `src/app/core/services/` or `src/app/features/[feature-name]/services/`
- **Models**: `src/app/features/[feature-name]/models/`
- **Pages**: `src/app/pages/`
- **Tests**: Co-located `*.spec.ts` files, plus `e2e/src/` for E2E tests
- **Assets**: `src/assets/` for images, data, translations

<!-- 
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.
  
  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/
  
  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment
  
  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create Angular project structure per implementation plan (ng new or verify existing)
- [ ] T002 Configure TypeScript, ESLint, Prettier per constitution standards
- [ ] T003 [P] Setup CSS custom properties for theming in src/styles/
- [ ] T004 [P] Configure performance budgets in angular.json (<200KB initial bundle)
- [ ] T005 [P] Setup Lighthouse CI for automated performance/a11y checks

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks for Angular project (adjust based on your feature):

- [ ] T006 Create shared layout components (header, footer, navigation) in src/app/layouts/
- [ ] T007 [P] Setup Angular Router with lazy-loaded feature modules
- [ ] T008 [P] Configure mobile-first responsive breakpoints and CSS mixins
- [ ] T009 Create base service infrastructure (HTTP interceptors, error handling) in src/app/core/
- [ ] T010 Setup accessibility utilities (focus management, ARIA helpers) in src/app/shared/
- [ ] T011 Configure pre-rendering/SSG for static routes
- [ ] T012 [P] Setup E2E testing framework (Playwright/Cypress)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Constitution Checks for User Story 1

- [ ] Mobile-first design verified (test on 320px viewport first)
- [ ] No new dependencies added OR justified in PR
- [ ] Components follow single-responsibility principle
- [ ] Accessibility audit passed (keyboard nav, ARIA, contrast)
- [ ] Performance budget checked (bundle size impact)

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T013 [P] [US1] Unit tests for [Component] in src/app/features/[feature]/components/[component].spec.ts
- [ ] T014 [P] [US1] Unit tests for [Service] in src/app/features/[feature]/services/[service].spec.ts
- [ ] T015 [P] [US1] E2E test for [user journey] in e2e/src/[feature].e2e-spec.ts

### Implementation for User Story 1

- [ ] T016 [P] [US1] Create [Model] interface in src/app/features/[feature]/models/[model].ts
- [ ] T017 [P] [US1] Create presentational [Component] in src/app/features/[feature]/components/[component].component.ts
- [ ] T018 [US1] Implement [Service] in src/app/features/[feature]/services/[service].service.ts
- [ ] T019 [US1] Create smart/container [Component] in src/app/pages/[page]/[page].component.ts
- [ ] T020 [US1] Add route configuration in src/app/app-routing.module.ts
- [ ] T021 [US1] Implement mobile-first responsive styles in component CSS
- [ ] T022 [US1] Add semantic HTML and ARIA labels for accessibility
- [ ] T023 [P] [US1] Optimize images and add to src/assets/images/ (WebP + fallback)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T018 [P] [US2] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T019 [P] [US2] Integration test for [user journey] in tests/integration/test_[name].py

### Implementation for User Story 2

- [ ] T020 [P] [US2] Create [Entity] model in src/models/[entity].py
- [ ] T021 [US2] Implement [Service] in src/services/[service].py
- [ ] T022 [US2] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T023 [US2] Integrate with User Story 1 components (if needed)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T024 [P] [US3] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T025 [P] [US3] Integration test for [user journey] in tests/integration/test_[name].py

### Implementation for User Story 3

- [ ] T026 [P] [US3] Create [Entity] model in src/models/[entity].py
- [ ] T027 [US3] Implement [Service] in src/services/[service].py
- [ ] T028 [US3] Implement [endpoint/feature] in src/[location]/[file].py

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Update README.md with feature documentation
- [ ] TXXX Run final Lighthouse audit (performance, accessibility, SEO, best practices)
- [ ] TXXX Code cleanup and refactoring (reduce duplication, improve readability)
- [ ] TXXX [P] Bundle size optimization (check against <200KB budget)
- [ ] TXXX Security review (CSP headers, dependency audit with npm audit)
- [ ] TXXX Cross-browser testing (Chrome, Firefox, Safari, Edge - last 2 versions)
- [ ] TXXX Mobile device testing (iOS Safari, Android Chrome)
- [ ] TXXX Run quickstart.md validation
- [ ] TXXX [P] Update i18n translations if content changed (src/assets/i18n/)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Unit tests for [Component] in src/app/features/[feature]/components/[component].spec.ts"
Task: "Unit tests for [Service] in src/app/features/[feature]/services/[service].spec.ts"
Task: "E2E test for [user journey] in e2e/src/[feature].e2e-spec.ts"

# Launch all models/interfaces for User Story 1 together:
Task: "Create [Model1] interface in src/app/features/[feature]/models/[model1].ts"
Task: "Create [Model2] interface in src/app/features/[feature]/models/[model2].ts"

# Launch parallel component creation (different developers):
Task: "Create presentational [ComponentA] in src/app/features/[feature]/components/[componentA]/"
Task: "Create presentational [ComponentB] in src/app/features/[feature]/components/[componentB]/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
