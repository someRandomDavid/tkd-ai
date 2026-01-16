# Data Model: Club Homepage

**Feature**: Club Homepage  
**Branch**: `001-homepage`  
**Created**: 2026-01-12

## Overview

The homepage data model defines the structure of static JSON content files that drive the homepage display. All data is stored in `src/assets/data/` and loaded at build time for static rendering. No database or API required.

## Entity Definitions

### ClubInfo

Represents core club information displayed in hero section and throughout the site.

**File**: `src/assets/data/club-info.json`

```typescript
interface ClubInfo {
  name: string;                    // Club name: "Taekwon-do Ailingen"
  tagline: string;                 // Hero section tagline/motto
  description: string;             // Welcome section text (max 200 words)
  foundingYear: number;            // e.g., 1995
  programs: ProgramInfo[];         // Available programs
  contact: ContactInfo;            // Contact details
  socialMedia: SocialMediaLink[];  // Social media accounts
}

interface ProgramInfo {
  name: string;                    // "Taekwon-do" | "Zumba" | "deepWORK"
  description: string;             // Brief program description
  icon?: string;                   // Optional icon name/path
}

interface ContactInfo {
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  phone: string;
  email: string;
}
```

**Example**:
```json
{
  "name": "Taekwon-do Ailingen",
  "tagline": "Traditionelle Kampfkunst für alle Altersgruppen",
  "description": "Herzlich willkommen bei Taekwon-do Ailingen...",
  "foundingYear": 1995,
  "programs": [
    {
      "name": "Taekwon-do",
      "description": "Traditionelle koreanische Kampfkunst",
      "icon": "martial-arts"
    },
    {
      "name": "Zumba",
      "description": "Fitness-Dance-Programm für alle",
      "icon": "dance"
    },
    {
      "name": "deepWORK",
      "description": "Athletisches Funktionstraining",
      "icon": "fitness"
    }
  ],
  "contact": {
    "address": {
      "street": "Musterstraße 123",
      "postalCode": "88690",
      "city": "Uhldingen-Mühlhofen",
      "country": "Deutschland"
    },
    "phone": "+49 7556 123456",
    "email": "info@tkd-ailingen.de"
  },
  "socialMedia": [
    {
      "platform": "facebook",
      "url": "https://facebook.com/tkd-ailingen",
      "icon": "facebook"
    },
    {
      "platform": "instagram",
      "url": "https://instagram.com/tkd-ailingen",
      "icon": "instagram"
    }
  ]
}
```

**Validation Rules**:
- `name` required, max 100 chars
- `tagline` required, max 150 chars
- `description` required, max 1000 chars (≈200 words)
- `programs` must have at least 1 entry
- `contact.email` must be valid email format
- `contact.phone` must be valid phone format

---

### TrainingSession

Represents individual training sessions for each program.

**File**: `src/assets/data/training-sessions.json`

```typescript
interface TrainingSession {
  id: string;                      // Unique identifier
  programType: 'taekwondo' | 'zumba' | 'deepwork';
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;               // Format: "HH:mm" (24-hour)
  endTime: string;                 // Format: "HH:mm" (24-hour)
  location: string;                // Venue name or room
  instructor?: string;             // Optional instructor name
  levelAgeGroup: string;           // e.g., "Kinder 6-10", "Erwachsene", "Fortgeschrittene"
  maxParticipants?: number;        // Optional capacity
  notes?: string;                  // Optional additional info
}

interface TrainingSchedule {
  lastUpdated: string;             // ISO 8601 date
  sessions: TrainingSession[];
}
```

**Example**:
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
      "location": "Sporthalle Ailingen",
      "instructor": "Meister Schmidt",
      "levelAgeGroup": "Kinder 6-10 Jahre",
      "maxParticipants": 20,
      "notes": "Bitte Sportkleidung mitbringen"
    },
    {
      "id": "tkd-mon-adults",
      "programType": "taekwondo",
      "dayOfWeek": "monday",
      "startTime": "18:30",
      "endTime": "20:00",
      "location": "Sporthalle Ailingen",
      "instructor": "Meister Schmidt",
      "levelAgeGroup": "Erwachsene (ab 16)",
      "maxParticipants": 25
    },
    {
      "id": "zumba-wed",
      "programType": "zumba",
      "dayOfWeek": "wednesday",
      "startTime": "19:00",
      "endTime": "20:00",
      "location": "Sporthalle Ailingen",
      "instructor": "Maria Weber",
      "levelAgeGroup": "Alle Level",
      "notes": "Getränk mitbringen"
    },
    {
      "id": "deepwork-thu",
      "programType": "deepwork",
      "dayOfWeek": "thursday",
      "startTime": "18:00",
      "endTime": "19:00",
      "location": "Fitness-Raum",
      "instructor": "Thomas Müller",
      "levelAgeGroup": "Fortgeschrittene"
    }
  ]
}
```

**Validation Rules**:
- `id` required, unique across all sessions
- `programType` must match one of the enum values
- `startTime` < `endTime`
- `location` required, max 100 chars
- `levelAgeGroup` required, max 50 chars
- Sessions grouped by `programType` in UI

---

### SocialMediaLink

Represents social media platform links.

**Included in**: `ClubInfo` (see above)

```typescript
interface SocialMediaLink {
  platform: 'facebook' | 'instagram';  // Constrained to these two
  url: string;                         // Full URL to profile
  icon: string;                        // Material icon name or custom
  ariaLabel?: string;                  // Optional a11y label
}
```

**Example**:
```json
{
  "platform": "facebook",
  "url": "https://facebook.com/tkd-ailingen",
  "icon": "facebook",
  "ariaLabel": "Besuchen Sie uns auf Facebook"
}
```

**Validation Rules**:
- `platform` must be 'facebook' or 'instagram' only
- `url` must be valid HTTPS URL
- `icon` maps to Material Icons or custom SVG

---

### DownloadableForm

Represents registration forms and documents available for download.

**File**: `src/assets/data/downloads.json`

```typescript
interface DownloadableForm {
  id: string;                      // Unique identifier
  formName: string;                // Display name
  description: string;             // Brief description of form purpose
  fileUrl: string;                 // Relative path: "/assets/forms/..."
  fileType: 'pdf';                 // Only PDF supported initially
  fileSize: number;                // Size in bytes
  category: 'membership' | 'events' | 'general';
  lastUpdated: string;             // ISO 8601 date
  requiredFor?: string;            // Optional: what this form is for
}

interface DownloadsCollection {
  forms: DownloadableForm[];
}
```

**Example**:
```json
{
  "forms": [
    {
      "id": "member-registration",
      "formName": "Mitgliedsantrag",
      "description": "Formular zur Anmeldung als Vereinsmitglied",
      "fileUrl": "/assets/forms/member-registration.pdf",
      "fileType": "pdf",
      "fileSize": 245760,
      "category": "membership",
      "lastUpdated": "2026-01-01T00:00:00Z",
      "requiredFor": "Neue Mitglieder"
    },
    {
      "id": "bodensee-cup-registration",
      "formName": "Anmeldung International Bodensee Cup",
      "description": "Registrierungsformular für das internationale Turnier am Bodensee",
      "fileUrl": "/assets/forms/bodensee-cup-registration.pdf",
      "fileType": "pdf",
      "fileSize": 312320,
      "category": "events",
      "lastUpdated": "2025-12-15T00:00:00Z",
      "requiredFor": "Turnierteilnahme"
    }
  ]
}
```

**Validation Rules**:
- `id` required, unique
- `formName` required, max 100 chars
- `description` required, max 200 chars
- `fileUrl` must point to existing PDF in `/assets/forms/`
- `fileSize` in bytes, used for display ("245 KB")
- `category` for grouping in UI
- File size displayed as: `Math.round(bytes / 1024) + ' KB'`

---

### CallToAction

Represents action buttons for user engagement.

**File**: `src/assets/data/cta-buttons.json`

```typescript
interface CallToAction {
  id: string;                      // Unique identifier
  label: string;                   // Button text
  actionType: 'mailto' | 'route' | 'external';
  destination: string;             // Email, route path, or URL
  buttonStyle: 'primary' | 'accent' | 'warn';  // Material button theme
  priority: number;                // Display order (lower = higher priority)
  icon?: string;                   // Optional Material icon
  ariaLabel?: string;              // Optional a11y label
}

interface CTACollection {
  actions: CallToAction[];
}
```

**Example**:
```json
{
  "actions": [
    {
      "id": "free-trial",
      "label": "Kostenloses Probetraining",
      "actionType": "mailto",
      "destination": "mailto:info@tkd-ailingen.de?subject=Probetraining%20Anfrage",
      "buttonStyle": "primary",
      "priority": 1,
      "icon": "sports_martial_arts",
      "ariaLabel": "Jetzt kostenloses Probetraining anfragen"
    },
    {
      "id": "contact-us",
      "label": "Kontakt aufnehmen",
      "actionType": "route",
      "destination": "/contact",
      "buttonStyle": "accent",
      "priority": 2,
      "icon": "email",
      "ariaLabel": "Zur Kontaktseite navigieren"
    }
  ]
}
```

**Validation Rules**:
- `id` required, unique
- `label` required, max 50 chars
- `actionType` determines destination format:
  - `mailto`: Must start with "mailto:"
  - `route`: Must start with "/" (internal route)
  - `external`: Must be full HTTPS URL
- `buttonStyle` maps to Angular Material button themes
- `priority` for sorting (ascending order)

---

### NavigationItem

Represents menu links in the navigation header.

**File**: `src/assets/data/navigation.json`

```typescript
interface NavigationItem {
  id: string;                      // Unique identifier
  label: string;                   // Display text
  routeOrAnchor: string;           // Route path or anchor (#section-id)
  icon?: string;                   // Optional Material icon
  order: number;                   // Display order
  subItems?: NavigationItem[];     // Optional submenu items
  externalUrl?: string;            // For future external links
}

interface Navigation {
  items: NavigationItem[];
}
```

**Example**:
```json
{
  "items": [
    {
      "id": "training",
      "label": "Training",
      "routeOrAnchor": "#training-section",
      "icon": "fitness_center",
      "order": 1
    },
    {
      "id": "taekwondo",
      "label": "Taekwon-do",
      "routeOrAnchor": "#taekwondo-schedule",
      "order": 2
    },
    {
      "id": "zumba",
      "label": "Zumba",
      "routeOrAnchor": "#zumba-schedule",
      "order": 3
    },
    {
      "id": "deepwork",
      "label": "deepWORK",
      "routeOrAnchor": "#deepwork-schedule",
      "order": 4
    },
    {
      "id": "membership",
      "label": "Mitgliedschaft",
      "routeOrAnchor": "/membership",
      "icon": "card_membership",
      "order": 5
    },
    {
      "id": "events",
      "label": "Veranstaltungen",
      "routeOrAnchor": "/events",
      "icon": "event",
      "order": 6
    },
    {
      "id": "downloads",
      "label": "Downloads",
      "routeOrAnchor": "#downloads-section",
      "icon": "download",
      "order": 7
    },
    {
      "id": "about",
      "label": "Über uns",
      "routeOrAnchor": "/about",
      "order": 8
    },
    {
      "id": "contact",
      "label": "Kontakt",
      "routeOrAnchor": "/contact",
      "icon": "contact_mail",
      "order": 9
    }
  ]
}
```

**Validation Rules**:
- `id` required, unique
- `label` required, max 30 chars
- `routeOrAnchor` required, format:
  - Anchor: starts with "#"
  - Route: starts with "/"
  - Sort by `order` (ascending)
- Items with anchors trigger smooth scroll on same page
- Items with routes trigger Angular Router navigation

---

## Data Loading Strategy

### Build-Time Loading

All JSON files loaded during Angular build and embedded in the bundle:

```typescript
// Example service
export class ContentService {
  private clubInfo = require('../../assets/data/club-info.json');
  private trainingSessions = require('../../assets/data/training-sessions.json');
  
  getClubInfo(): ClubInfo {
    return this.clubInfo;
  }
  
  getTrainingSessions(programType?: string): TrainingSession[] {
    const sessions = this.trainingSessions.sessions;
    return programType 
      ? sessions.filter(s => s.programType === programType)
      : sessions;
  }
}
```

### Benefits

- Zero API calls (static-first principle)
- Fast page load (data embedded in bundle)
- Easy content updates (edit JSON, rebuild)
- Type-safe with TypeScript interfaces
- Pre-rendered with Angular Universal

### Content Update Workflow

1. Edit JSON file in `src/assets/data/`
2. Run `ng build --configuration production`
3. Deploy static files to hosting
4. No server restart required

---

## Validation & Type Safety

### TypeScript Interfaces

All interfaces defined in `src/app/shared/models/` and imported by components:

```typescript
// src/app/shared/models/index.ts
export * from './club-info.model';
export * from './training-session.model';
export * from './downloadable-form.model';
export * from './call-to-action.model';
export * from './navigation-item.model';
```

### JSON Schema Validation (Future)

For enhanced validation, consider JSON Schema files:
- Validates JSON structure at build time
- Prevents invalid data from being deployed
- Can generate TypeScript interfaces automatically

---

## Data Relationships

```
ClubInfo (1)
├── programs[] (many) - ProgramInfo
├── contact (1) - ContactInfo
└── socialMedia[] (many) - SocialMediaLink

TrainingSchedule (1)
└── sessions[] (many) - TrainingSession
    └── programType → relates to ProgramInfo.name

DownloadsCollection (1)
└── forms[] (many) - DownloadableForm
    └── category - groups downloads in UI

CTACollection (1)
└── actions[] (many) - CallToAction
    └── priority - determines display order

Navigation (1)
└── items[] (many) - NavigationItem
    └── order - determines menu order
```

**Note**: No direct foreign key relationships needed - data is denormalized for static rendering. Program names in `TrainingSession.programType` match `ProgramInfo.name` by convention.
