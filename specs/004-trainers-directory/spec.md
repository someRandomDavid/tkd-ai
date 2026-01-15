# Feature Specification: Trainers Directory

**Feature Branch**: `004-trainers-directory`  
**Created**: 2026-01-13  
**Status**: Draft  
**Input**: User description: "Display a directory of approximately 20 trainers/instructors with profile photos, names, programs they teach, and special roles (like Youth Protection Officer). Trainers are organized alphabetically in a simple directory listing without detailed individual pages."

## Constitution Compliance

*(Reference Taekwon-do Ailingen Website Constitution principles)*

- **Mobile-First Design**: Trainers displayed in single-column card layout on mobile (320px+), expanding to 2-column on tablet (768px+) and 3-4 column grid on desktop (1024px+). Touch-optimized with readable text hierarchy.
- **Minimal Dependencies**: Zero new dependencies required. Uses existing Angular Material card components and ngx-translate i18n structure. All trainer data managed through static JSON file.
- **Component-First**: Reusable TrainerCard component displays individual trainer information. TrainersSection orchestrates grid layout and alphabetical sorting. Follows established component patterns from homepage feature.
- **Static-First**: All trainer data pre-rendered from JSON file in assets. No API calls required. Images served as static assets with WebP + fallback formats.
- **Accessibility**: Semantic HTML with proper heading hierarchy, alt text for all trainer photos, sufficient color contrast for text, keyboard navigation, screen reader friendly role/program labels.
- **Performance**: Estimated impact <30KB (component code + template). Trainer images lazy-loaded with responsive srcset. Total of ~20 trainers × ~50KB optimized images = ~1MB assets (loaded progressively).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Complete Trainer Directory (Priority: P1)

A prospective student or parent wants to know who teaches at Taekwon-do Ailingen to assess instructor qualifications and find instructors for specific programs (Taekwon-do, Zumba, deepWORK).

**Why this priority**: Primary use case - builds trust and transparency. Prospective members want to know who will be teaching them or their children before joining.

**Independent Test**: Can be fully tested by navigating to trainers section and verifying all ~20 trainers are displayed with photo, name, programs taught, and special roles visible and readable on mobile device.

**Acceptance Scenarios**:

1. **Given** a user navigates to the trainers section, **When** the page loads, **Then** they see a grid of trainer cards organized alphabetically by last name
2. **Given** a user views a trainer card on mobile, **When** reading the card, **Then** they see the trainer's photo, full name, programs they teach (Taekwon-do/Zumba/deepWORK), and any special roles (e.g., Youth Protection Officer)
3. **Given** a user wants to find trainers for a specific program, **When** scanning the directory, **Then** they can identify which trainers teach Taekwon-do, Zumba, or deepWORK through clear program labels
4. **Given** a user is on desktop, **When** viewing the directory, **Then** trainers are displayed in a multi-column grid (3-4 columns) for efficient scanning
5. **Given** a user wants to identify special roles, **When** viewing trainer cards, **Then** special roles like "Youth Protection Officer" are visually distinguished from regular programs

---

### User Story 2 - Responsive Layout Across Devices (Priority: P2)

A user accesses the trainers directory on different devices (smartphone, tablet, desktop) and needs optimal layout for each screen size.

**Why this priority**: Essential for usability across devices. Mobile-first design ensures all users can browse trainers effectively regardless of device.

**Independent Test**: Can be tested by viewing trainers section on mobile (320px), tablet (768px), and desktop (1024px+) and verifying appropriate column layout (1, 2, 3-4 columns respectively).

**Acceptance Scenarios**:

1. **Given** a user views trainers on mobile (<768px), **When** scrolling, **Then** trainer cards are displayed in single-column layout with full-width cards
2. **Given** a user views trainers on tablet (768px-1023px), **When** viewing, **Then** trainer cards are displayed in 2-column grid
3. **Given** a user views trainers on desktop (≥1024px), **When** viewing, **Then** trainer cards are displayed in 3-4 column grid with consistent card heights
4. **Given** a user rotates device from portrait to landscape, **When** layout adjusts, **Then** trainer cards reflow smoothly to appropriate column count without content jumping
5. **Given** trainer cards have varying content lengths, **When** displayed in grid, **Then** cards maintain consistent height within each row (equal height cards)

---

### User Story 3 - Accessibility and Performance (Priority: P3)

Users with assistive technologies (screen readers, keyboard navigation) or slow connections need to access trainer information efficiently.

**Why this priority**: Ensures inclusivity and fast loading. Critical for WCAG AA compliance and users on mobile data connections.

**Independent Test**: Can be tested using keyboard-only navigation, screen reader (NVDA/JAWS), and network throttling to 3G to verify full accessibility and acceptable performance.

**Acceptance Scenarios**:

1. **Given** a keyboard user navigates the trainers section, **When** using Tab key, **Then** focus moves through trainer cards in logical alphabetical order
2. **Given** a screen reader user accesses trainer cards, **When** cards are announced, **Then** trainer name, programs taught, and special roles are read in logical sequence
3. **Given** a user on slow connection loads trainers section, **When** page loads, **Then** trainer photos are lazy-loaded as user scrolls (not all 20 loaded upfront)
4. **Given** a user with images disabled views trainers, **When** photos fail to load, **Then** alt text provides trainer names and meaningful fallback appears
5. **Given** a user accesses trainers section, **When** measuring performance, **Then** initial render (without images) occurs within 1 second on 3G connection

---

### Edge Cases

- What happens when a trainer teaches all 3 programs? → Display all 3 program badges, may wrap to multiple lines on mobile
- How does the system handle trainers with very long names? → Text wraps to multiple lines with proper word breaking, no overflow
- What happens if trainer photo is missing or fails to load? → Fallback placeholder with trainer initials displayed with appropriate contrast
- How are special roles displayed if a trainer has multiple roles? → Multiple role badges displayed below programs, separated with commas or individual badges
- What happens on very small screens (<320px)? → Cards maintain minimum width, horizontal scroll if necessary (edge case)
- What if trainer data file is corrupted or empty? → Graceful error message "Trainers information currently unavailable" with contact info
- How does alphabetical sorting handle names with umlauts (ä, ö, ü)? → German locale sorting rules applied (ä=a, ö=o, ü=u for sorting purposes)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Trainers directory MUST display approximately 20 trainer profiles in alphabetically sorted order by last name
- **FR-002**: Each trainer card MUST display: profile photo, full name, list of programs taught (Taekwon-do/Zumba/deepWORK), and any special roles (e.g., Youth Protection Officer)
- **FR-003**: Trainer cards MUST be organized in responsive grid: 1 column on mobile (<768px), 2 columns on tablet (768px-1023px), 3-4 columns on desktop (≥1024px)
- **FR-004**: Program labels MUST be visually distinct (e.g., badges or tags) to quickly identify which trainers teach which programs
- **FR-005**: Special roles (Youth Protection Officer, etc.) MUST be visually distinguished from program labels with different styling
- **FR-006**: Trainer photos MUST be lazy-loaded to optimize initial page load performance
- **FR-007**: Trainer photos MUST have descriptive alt text including trainer name
- **FR-008**: Trainer photos MUST use responsive srcset with WebP format and JPEG fallback
- **FR-009**: If trainer photo fails to load, MUST display fallback placeholder with trainer initials
- **FR-010**: Alphabetical sorting MUST follow German locale rules for umlauts and special characters
- **FR-011**: Trainer cards within grid rows MUST maintain equal height for visual consistency
- **FR-012**: All text on trainer cards MUST meet WCAG 2.1 AA contrast requirements (4.5:1 for normal text, 3:1 for large text)
- **FR-013**: Trainer cards MUST be keyboard navigable with visible focus indicators
- **FR-014**: Section MUST include heading "Unsere Trainer" (German) / "Our Trainers" (English) with proper semantic level (h2)
- **FR-015**: Trainer data MUST be loaded from static JSON file in assets directory
- **FR-016**: If trainer data fails to load, MUST display user-friendly error message with contact information

### Key Entities *(include if feature involves data)*

- **Trainer**: Trainer profile information
  - `id`: Unique identifier (string, e.g., "trainer-001")
  - `firstName`: First name (string)
  - `lastName`: Last name (string, used for alphabetical sorting)
  - `photoUrl`: Relative path to profile photo (string, e.g., "/assets/images/trainers/photo.jpg")
  - `programs`: Array of programs taught (string[], values: "taekwondo" | "zumba" | "deepwork")
  - `specialRoles`: Array of special roles (string[], optional, e.g., ["youth-protection-officer", "head-instructor"])
  - `sortKey`: Computed last name with normalized umlauts for sorting (string, optional)

Example JSON structure:
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

See data-model.md for complete TypeScript interfaces and validation rules.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify all trainers for a specific program (e.g., Taekwon-do) within 10 seconds
- **SC-002**: Trainer directory section loads and displays text/layout within 1 second on 3G connection (excluding images)
- **SC-003**: All trainer photos lazy-load as user scrolls, reducing initial page load by at least 80% (load 4-6 visible trainers first)
- **SC-004**: 100% of trainer cards are keyboard accessible with visible focus indicators
- **SC-005**: All text on trainer cards meets WCAG AA contrast requirements (100% pass rate)
- **SC-006**: Screen readers correctly announce trainer name, programs, and roles for 100% of cards
- **SC-007**: Trainers directory renders correctly across 3 breakpoints (mobile 320px+, tablet 768px+, desktop 1024px+) with appropriate column layouts
- **SC-008**: 90% of test users can find trainers teaching a specific program without assistance

## Assumptions

- Club has or will provide high-quality profile photos for all ~20 trainers (minimum 400×400px resolution)
- Trainer information (names, programs, roles) is relatively stable (updates monthly/quarterly, not real-time)
- All trainers have agreed to have their photo and name published on the website (consent obtained)
- Special roles are limited to a small set (e.g., Youth Protection Officer, Head Instructor, Assistant Instructor) - not dozens of unique roles
- Program names use consistent identifiers: "taekwondo", "zumba", "deepwork" (lowercase, no spaces)
- Trainer photos follow consistent format: square aspect ratio, neutral background, professional appearance
- Translation keys for programs and special roles are defined in i18n files (de.json, en.json)
- Youth Protection Officer designation is required for German sports clubs (Jugendschutzbeauftragter)
- No trainers have identical last names requiring secondary sorting (or first name used as tiebreaker)
- Trainer data updates are manual (edited in JSON file), not managed through CMS or admin interface
- No biography, contact information, or certifications displayed (only photo, name, programs, roles)

## Out of Scope

- Individual trainer detail pages with extended biographies
- Filtering trainers by program (user can scan visually; may be added later based on feedback)
- Search functionality for trainers
- Contact buttons or mailto links for individual trainers
- Displaying trainer certifications, ranks, or qualifications
- "Trainer of the Month" or featured trainer functionality
- Trainer availability or schedule integration
- Social media links for individual trainers
- CMS or admin interface for managing trainer data (manual JSON editing)
- Trainer photos upload/management system (photos added to assets manually)
- Historical data (former trainers, archive)
- Testimonials or reviews for trainers

## Dependencies

- Homepage feature (001-homepage) for consistent styling and layout patterns
- Angular Material Card component (already dependency of homepage)
- ngx-translate i18n structure (already dependency of homepage)
- Trainer profile photos (~20 photos, 400×400px minimum, provided by club)
- Trainer data JSON file created in assets directory
- Translation keys for program names and special role labels added to de.json/en.json
- Design system tokens for badge/tag styling (colors, spacing, typography)
- LazyLoadImageModule or native loading="lazy" for image optimization (evaluate which approach)

## Risk Assessment

- **Low Risk**: Simple directory listing with static data, no complex interactions or state management
- **Potential Issues**:
  - Inconsistent photo quality/format across 20 trainers → Mitigation: Photo guidelines provided to club, image optimization pipeline
  - Trainer names too long for card layout → Mitigation: Test with longest name, allow text wrapping, set max-width constraints
  - Many trainers teaching all 3 programs creates cluttered cards → Mitigation: Compact badge design, test layout with edge case
  - Slow image loading on mobile → Mitigation: Lazy loading, aggressive image optimization (WebP, srcset), prioritize visible trainers
  - Trainer data becomes outdated → Mitigation: Clear documentation for updating JSON file, include "last updated" date in UI
  - Special roles multiply beyond expected set → Mitigation: Design badges to wrap gracefully, test with 3-4 roles per trainer
