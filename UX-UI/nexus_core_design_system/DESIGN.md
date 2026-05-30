---
name: Nexus Core Design System
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#37393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c4c6cc'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#8e9196'
  outline-variant: '#44474c'
  surface-tint: '#bac8dc'
  primary: '#bac8dc'
  on-primary: '#243141'
  primary-container: '#0d1b2a'
  on-primary-container: '#768497'
  inverse-primary: '#525f71'
  secondary: '#bdf4ff'
  on-secondary: '#00363d'
  secondary-container: '#00e3fd'
  on-secondary-container: '#00616d'
  tertiary: '#bbc6e2'
  on-tertiary: '#263046'
  tertiary-container: '#0f1a2e'
  on-tertiary-container: '#78839c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d6e4f9'
  primary-fixed-dim: '#bac8dc'
  on-primary-fixed: '#0f1c2c'
  on-primary-fixed-variant: '#3a4859'
  secondary-fixed: '#9cf0ff'
  secondary-fixed-dim: '#00daf3'
  on-secondary-fixed: '#001f24'
  on-secondary-fixed-variant: '#004f58'
  tertiary-fixed: '#d7e2ff'
  tertiary-fixed-dim: '#bbc6e2'
  on-tertiary-fixed: '#101b30'
  on-tertiary-fixed-variant: '#3c475d'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
  midnight-base: '#040911'
  status-pending: '#FFB703'
  status-progress: '#00E5FF'
  status-done: '#06D6A0'
  surface-elevated: '#1B263B'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-tablet: 24px
  container-max: 1024px
---

## Brand & Style

This design system is built for **TaskToGroup**, a high-performance multi-tenant task assignment platform. The brand personality is **authoritative, efficient, and precise**. It targets corporate environments where speed of coordination is critical.

The design style is a blend of **Corporate Modern** and **High-Contrast Minimalism**. It prioritizes extreme legibility and "at-a-glance" information density. The UI utilizes a dark-mode-first approach for focused work, using high-contrast white text against deep navy backgrounds to reduce eye strain during prolonged use. Visual interest is generated through vibrant cyan accents that act as navigational beacons, guiding users toward primary actions like "Claim Task."

## Colors

The palette is rooted in a **Deep Navy & Cyan** hierarchy. 

- **Primary (#0D1B2A):** Used for the main sidebar, header, and structural backgrounds. It provides a stable, professional foundation.
- **Secondary (#00E5FF):** An electric cyan used exclusively for interactive elements, progress indicators, and the "Claim Task" call-to-action.
- **Tertiary (#1B263B):** Used for card surfaces and input backgrounds to create subtle depth against the primary navy.
- **Neutral (#FFFFFF):** Reserved for primary typography and icons to ensure maximum contrast (WCAG AAA compliance).

Status colors (Pending, Progress, Done) are saturated to stand out clearly against the dark background, ensuring users can scan task lists by status instantly.

## Typography

The typography system uses **Inter** exclusively. It is a typeface designed for screens, offering exceptional legibility in data-heavy interfaces.

- **Headlines:** Use Bold weights with slight negative letter-spacing to create a "compact" and professional look.
- **Labels:** Small caps/uppercase styling for category tags and table headers to distinguish functional metadata from content.
- **Hierarchy:** Strict adherence to vertical rhythm is maintained to ensure that even complex multi-tenant dashboards remain readable on mobile and tablet screens.

## Layout & Spacing

The design system utilizes a **Fluid Grid** model optimized for Tablet and Mobile.

- **Grid:** A 12-column grid for tablets (768px+) and a 4-column grid for mobile devices.
- **Rhythm:** An 8px base unit drives all padding and margins. 
- **Reflow:** On mobile, side-by-side card layouts reflow into a single vertical stack. Data tables in the Company Admin view transition to "List Cards" on mobile to maintain usability.
- **Touch Targets:** Minimum touch targets are set to 44x44px to accommodate the "Claim Task" interaction on the move.

## Elevation & Depth

To maintain the minimalist and sharp aesthetic, this design system avoids heavy shadows. Instead, it uses **Tonal Layering**:

1.  **Level 0 (Floor):** Midnight Base (#040911) – used for the background of the entire app.
2.  **Level 1 (Surface):** Deep Navy (#0D1B2A) – used for the primary navigation and container areas.
3.  **Level 2 (Cards):** Surface Elevated (#1B263B) – used for task cards and modal overlays.
4.  **Accents:** Thin 1px borders in a slightly lighter navy (#323F52) are used instead of shadows to define card boundaries, keeping the UI looking "sharp" and modern.

## Shapes

The shape language is **geometric and precise**. 

- **Corners:** A standard radius of `4px` (Soft) is applied to all cards, buttons, and input fields. This provides a professional edge that feels modern without being overly "bubbly" or consumer-oriented.
- **Interactive Elements:** Buttons maintain this slight rounding, while smaller status "chips" may use a full pill-shape (3) to differentiate them from actionable buttons.

## Components

### Buttons
- **Primary (Claim Task):** Solid Cyan (#00E5FF) background with Dark Navy text. Bold, high-visibility.
- **Secondary:** Outline button with Cyan border and text. Used for "View Details" or "Cancel".
- **Ghost:** White text with no background, used for utility actions in the header.

### Task Cards
Cards use the `#1B263B` surface. They feature a top-accent bar that changes color based on the Task Category. The task title uses `headline-sm`. The "Claim Task" button is pinned to the bottom right for easy thumb access on mobile.

### Chips / Tags
Small, low-profile badges used for Categories (e.g., "Engineering", "Urgent"). These use a background tint of the status color with 20% opacity and a solid color label.

### Input Fields
Dark backgrounds with a 1px border. On focus, the border glows with a Cyan (#00E5FF) 2px stroke. Label text is always placed above the field for clarity in mobile forms.

### Notifications
Real-time alerts appear as a persistent "Toast" or a red dot on the Notification Bell. Task-specific notifications in the feed use a high-contrast white text on the elevated surface background.