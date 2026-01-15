# Feature Specification: Training Schedule Filter

**Feature Branch**: `003-schedule-filter`  
**Created**: 2026-01-13  
**Status**: Draft  
**Input**: User description: "Add a multi-select filter to the training schedule section allowing users to filter sessions by level and age group (e.g., 'Bambini Anfänger 4-6', 'Kinder Fortgeschrittene 7-10'). Users can select multiple filters simultaneously to view only relevant sessions. Filter selections are saved to localStorage and persist across visits. The filter should work across all three programs (Taekwon-do, Zumba, deepWORK)."

## Constitution Compliance

*(Reference Taekwon-do Ailingen Website Constitution principles)*

- **Mobile-First Design**: Filter UI optimized for mobile with collapsible filter panel, large touch targets (≥44px) for checkboxes, clear visual feedback. Filter toggles via accordion/expansion panel to save vertical space. Filtered results display immediately below filter controls.
- **Minimal Dependencies**: No new dependencies required. Uses Angular Material's checkbox and expansion panel components (already installed). localStorage is native browser API.
- **Component-First**: Reusable ScheduleFilter component that can be used with any session list. FilterService manages filter state and persistence, can be reused for other filtered lists (trainers, events).
- **Static-First**: Filter operates entirely client-side on already-loaded session data. No API calls required. Filter criteria stored in localStorage.
- **Accessibility**: Checkboxes with proper labels, keyboard navigation (Tab + Space), clear indication of selected filters, screen reader announcements when filters applied, "Clear all" button accessible.
- **Performance**: Minimal impact - filtering uses JavaScript array methods on existing data. No re-fetching. Filter state stored as small JSON object (~1KB) in localStorage.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Filter Sessions by Level/Age Group (Priority: P1)

A parent wants to see only training sessions suitable for their 5-year-old child (Bambini level), hiding all irrelevant sessions for older children or adults.

**Why this priority**: Core feature value - enables users to quickly find relevant sessions without scanning entire schedule. Essential time-saver for users with specific needs. Demonstrates the feature works.

**Independent Test**: Can be fully tested by selecting one or more filter checkboxes, verifying only matching sessions display, and confirming all three programs respect the filter.

**Acceptance Scenarios**:

1. **Given** a user views the training schedule with all sessions visible, **When** they open the filter panel, **Then** they see checkboxes for all unique level/age combinations available (e.g., "Bambini 4-6", "Kinder 7-10", "Jugendliche 11-14", "Erwachsene")
2. **Given** a user selects one filter (e.g., "Bambini 4-6"), **When** the filter is applied, **Then** only sessions tagged with that level/age are displayed across all programs
3. **Given** a user selects multiple filters (e.g., "Bambini 4-6" AND "Kinder 7-10"), **When** filters are applied, **Then** sessions matching ANY selected filter are displayed (OR logic)
4. **Given** filters are active with some sessions hidden, **When** the user views the schedule, **Then** a clear indicator shows filters are active (e.g., "Filtered: 2 filters active, showing 5 of 12 sessions")
5. **Given** filters are active, **When** no sessions match the criteria, **Then** a message displays "No sessions match your filters. Try adjusting your selection."
6. **Given** multiple filters are selected, **When** the user clicks "Clear all filters", **Then** all filters deselect and all sessions become visible again

---

### User Story 2 - Persistent Filter Preferences (Priority: P2)

A user who regularly checks the schedule for their child's age group wants their filter selection remembered so they don't have to reselect it on every visit.

**Why this priority**: Improves user experience for return visitors and demonstrates localStorage persistence works. Builds on basic filtering (P1) by adding convenience.

**Independent Test**: Can be tested by selecting filters, closing/reopening browser, and verifying filters remain selected with correct sessions filtered.

**Acceptance Scenarios**:

1. **Given** a user selects specific filters (e.g., "Bambini 4-6"), **When** they navigate away or close the browser, **Then** the filter selection is saved to localStorage
2. **Given** a user returns to the website, **When** they view the training schedule, **Then** their previously selected filters are automatically applied
3. **Given** a user has saved filters, **When** the page loads, **Then** the filtered view displays immediately without showing all sessions first
4. **Given** a user clears all filters, **When** they leave and return, **Then** no filters are active and all sessions display (cleared state persists)
5. **Given** localStorage is unavailable (private browsing), **When** user selects filters, **Then** filters work in current session but reset on reload

---

### User Story 3 - Mobile-Optimized Filter UI (Priority: P3)

A mobile user wants to easily access and manipulate filters without the UI taking up excessive screen space or being difficult to tap.

**Why this priority**: Ensures usability on primary device type (mobile-first). Important for user satisfaction but can be tested independently after basic filter logic (P1) works.

**Independent Test**: Can be tested by using filter on mobile viewport (375px), verifying touch targets, collapsible behavior, and visual clarity.

**Acceptance Scenarios**:

1. **Given** a user views the schedule on mobile (320px-768px), **When** they see the filter controls, **Then** the filter panel is collapsed by default with an expand button (e.g., "Filter by level/age")
2. **Given** the filter panel is collapsed, **When** user taps the expand button, **Then** the panel smoothly expands showing all filter checkboxes
3. **Given** filter checkboxes are visible, **When** viewed on mobile, **Then** each checkbox with label has a touch target ≥44x44px
4. **Given** multiple filters are selected on mobile, **When** viewing the active filter indicator, **Then** selected filters display as removable chips/tags (tap to deselect)
5. **Given** a user has applied filters on mobile, **When** they tap outside the filter panel, **Then** the panel collapses automatically (optional behavior)
6. **Given** a desktop user (≥768px) views the schedule, **When** they see the filter controls, **Then** the filter panel can be always-visible or in a sidebar without collapsing

---

### Edge Cases

- What happens when filter criteria don't match any sessions? → Display "No sessions match your filters" message with suggestion to adjust
- What happens when new sessions are added with new level/age values? → Filter dynamically generates checkboxes from available data
- What happens if localStorage quota is exceeded? → Gracefully handle, use session storage or in-memory fallback, notify user
- What happens when a user selects all filters? → Equivalent to no filters selected, all sessions visible
- What happens when filter state is corrupted in localStorage? → Reset to default (no filters), log error
- What happens with very long level/age labels? → Truncate with ellipsis, show full text on hover/focus

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide multi-select checkboxes to filter training sessions by level/age group
- **FR-002**: System MUST dynamically generate filter options from available level/age values in training session data
- **FR-003**: System MUST apply OR logic when multiple filters are selected (show sessions matching ANY selected filter)
- **FR-004**: System MUST filter sessions across all three programs (Taekwon-do, Zumba, deepWORK) simultaneously
- **FR-005**: System MUST display visible indicator when filters are active (e.g., "2 filters active, showing 5 of 12 sessions")
- **FR-006**: System MUST provide "Clear all filters" button to reset all selections
- **FR-007**: System MUST save filter selections to localStorage and persist across browser sessions
- **FR-008**: System MUST apply saved filters automatically on page load
- **FR-009**: System MUST display message "No sessions match your filters" when no results found
- **FR-010**: Filter panel MUST be collapsible on mobile viewports (<768px) with expand/collapse button
- **FR-011**: All filter checkboxes MUST have touch targets ≥44x44px on mobile
- **FR-012**: System MUST update filtered session count in real-time as filters are selected/deselected
- **FR-013**: Filter controls MUST be keyboard accessible (Tab to navigate, Space to toggle checkboxes)
- **FR-014**: Selected filters SHOULD display as removable chips/tags for easy deselection (optional UX enhancement)

### Key Entities

- **FilterCriteria**: User's selected filters (array of level/age values like `["Bambini 4-6", "Kinder 7-10"]`)
- **FilterState**: Complete filter state including selected criteria and collapsed/expanded panel state, stored in localStorage under key `'schedule-filter-state'`
- **LevelAgeOption**: Available filter option (label: `"Bambini Anfänger 4-6"`, value: `"bambini-4-6"`, count: number of sessions matching)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can apply a filter and see filtered results in under 3 seconds (select + view)
- **SC-002**: Filter state persists across 100% of page reloads and browser sessions
- **SC-003**: Filter response time is under 100ms from checkbox toggle to UI update (perceivable as instant)
- **SC-004**: Filter works correctly across all three programs (Taekwon-do, Zumba, deepWORK) with 100% accuracy
- **SC-005**: All filter controls are keyboard accessible with 100% success rate (Tab + Space)
- **SC-006**: Filter panel collapses/expands smoothly on mobile with <300ms transition
- **SC-007**: Touch targets meet 44x44px minimum on mobile (100% compliance)
- **SC-008**: 90% of users can successfully filter schedule to find relevant sessions without assistance

## Assumptions

- Training sessions already have level/age attributes in data structure (from homepage feature)
- Level/age values follow consistent naming convention (e.g., "Bambini 4-6", "Kinder 7-10")
- Users understand their child's age group / appropriate level
- Filter criteria are relatively stable (few unique level/age combinations, <10 options)
- Users primarily filter by one criterion at a time, occasionally combine 2-3 filters
- Mobile users prefer collapsed filter panel to save screen space
- Desktop users can handle always-visible filters or sidebar placement
- No requirement for advanced filter logic (AND, NOT, ranges)
- No requirement to filter by other attributes (instructor, time, location) in this feature

## Out of Scope

- Filtering by instructor, time of day, location, or weekday
- Advanced filter logic (AND operator, NOT operator, complex queries)
- Search by keyword functionality
- Filter presets or saved filter combinations
- Sharing filter URLs (deep linking with filter params)
- Filter analytics (tracking most-used filters)
- Age calculator tool (user enters birthdate, system suggests level)
- Filtering sessions across multiple weeks/dates (currently only weekly schedule shown)

## Dependencies

- Homepage feature with training schedule section (001-homepage)
- Training session data structure includes level/age attributes
- Angular Material checkbox and expansion panel components (already installed)
- localStorage API availability in target browsers

## Risk Assessment

- **Low Risk**: Straightforward feature, client-side filtering on existing data, no external dependencies
- **Potential Issues**:
  - Inconsistent level/age labels in data → Mitigation: Data validation during content entry
  - localStorage unavailable → Mitigation: Fallback to session storage or in-memory state
  - Performance with large number of sessions → Mitigation: Profile and optimize, use virtual scrolling if needed
  - Mobile UX complexity → Mitigation: User testing with parents and members
