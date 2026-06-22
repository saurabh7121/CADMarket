---
name: Precision Minimalist
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1b1b'
  surface-container: '#1f1f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#303030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b4b4'
  tertiary: '#ffffff'
  on-tertiary: '#303030'
  tertiary-container: '#e4e2e1'
  on-tertiary-container: '#656464'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e4e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Geist
    fontSize: 10px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 24px
  margin: 32px
---

## Brand & Style

This design system is built upon the philosophy of "utility as beauty." It targets professional environments where focus, clarity, and precision are paramount. By stripping away all color-based emotional cues, the interface recedes to let the user's data and tasks take center stage.

The aesthetic is **Minimalist** with a **Precision-Tool** edge. It mimics the high-end industrial design of professional cameras or laboratory equipment—functional, uncompromising, and refined. The emotional response should be one of quiet confidence and technical mastery. Every pixel must serve a purpose, and whitespace is treated as a structural element rather than a void.

## Colors

The palette is strictly monochromatic, utilizing a high-contrast dark foundation.

- **Foundations:** The primary background is a "Pitch Black" (#000000), providing an infinite canvas that maximizes OLED efficiency and minimizes eye strain. 
- **Surface Layers:** Secondary surfaces use "Deep Charcoal" (#171717) and "Carbon" (#262626) to define functional areas without relying on shadows.
- **Accents & Action:** Pure White (#FFFFFF) is reserved for primary actions and critical focus states.
- **Legibility:** All text uses a scale of light greys. Primary content sits at #E5E5E5 for high readability, while metadata and inactive states use #A3A3A3.
- **Rules:** Borders and dividers utilize #404040, creating subtle but clear structural boundaries.

## Typography

This design system utilizes **Geist** for its technical, developer-friendly precision and geometric clarity. 

- **Hierarchy:** Headlines use tighter letter spacing and heavier weights to feel substantial against the dark void. 
- **Readability:** Body text is set with generous line heights to ensure long-form legibility in high-contrast environments.
- **Technical Detail:** Labels utilize uppercase styling and increased letter spacing to mimic the etched markings on hardware tools.
- **Mobile Adaptation:** For screens smaller than 768px, `headline-xl` should scale down to 32px and `headline-lg` to 24px.

## Layout & Spacing

The layout is governed by a strict **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

- **Spacing Rhythm:** All spatial relationships are multiples of 4px. Use `md` (16px) for standard component internal padding and `lg` (24px) for gutter separation.
- **Density:** The design system favors a "High Density" approach. Content should be grouped tightly within functional modules, but modules themselves should be separated by significant whitespace (`xl` or more) to prevent visual clutter.
- **Alignment:** All elements must snap to the grid. Inset padding should be consistent across all container types to maintain a vertical line of sight.

## Elevation & Depth

In this design system, depth is achieved through **Tonal Layering** rather than traditional shadows. This maintains the "Precision Tool" aesthetic.

- **Level 0 (Floor):** Pure Black (#000000). Used for the main application background.
- **Level 1 (Card/Container):** Deep Charcoal (#171717). Used for primary content containers that sit on the floor.
- **Level 2 (Popovers/Modals):** Carbon (#262626). Used for elements that temporarily overlay the UI. These should be paired with a subtle #404040 border to define their edges.
- **Outlines:** Use "Ghost Borders" (#404040 at 50% opacity) for interactive elements like input fields to provide structure without adding visual weight.

## Shapes

The shape language is **Soft** (0.25rem). 

- **Precision:** Corners are slightly softened to make the UI feel modern and approachable, but they remain sharp enough to convey a sense of engineering and technical accuracy.
- **Consistency:** All buttons, input fields, and small containers must use the 4px (`rounded-md`) radius. Larger cards may use 8px (`rounded-lg`) to maintain visual balance, but never exceed this. Pill shapes are strictly prohibited except for notification badges.

## Components

- **Buttons:** 
  - *Primary:* Solid White background with Pure Black text. No border.
  - *Secondary:* Transparent background with a #404040 border and White text.
  - *Tertiary:* Ghost style, no background or border, #A3A3A3 text that shifts to White on hover.
- **Inputs:** Dark backgrounds (#0a0a0a) with a 1px border of #404040. Focus state is indicated by the border turning White (#FFFFFF).
- **Chips/Tags:** Small, subtle rectangles with #171717 background and #A3A3A3 text. Use for metadata or categories.
- **Lists:** Separated by 1px dividers of #171717. Interactive list items should use a subtle background shift to #171717 on hover.
- **Cards:** No shadows. Use #171717 background with a 1px #262626 border for definition.
- **Checkboxes/Radios:** Pure White for the selected state. The "Off" state is a #404040 outline. No inner colors are permitted.