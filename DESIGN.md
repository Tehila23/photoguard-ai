# PhotoGuard AI — Design System

## Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | #2563EB | CTA buttons, active states, links |
| Primary Dark | #1d4ed8 | Button hover |
| Primary Pale | #EFF6FF | Primary backgrounds, badges |
| Primary Border | #BFDBFE | Primary card borders |
| Red | #EF4444 | Destructive actions (Delete) only |
| Red Pale | #FEF2F2 | Red card backgrounds |
| Red Border | #FECACA | Red card borders |
| Background | #F1F5F9 | App background |
| Surface | #FFFFFF | Cards, navbar, bottom nav |
| Text Primary | #0F172A | Headings, main numbers |
| Text Secondary | #64748B | Labels, descriptions |
| Text Tertiary | #94A3B8 | Metadata, hints |
| Divider | #F1F5F9 | Dividers between elements |
| Border | #E8EDF2 | Card borders |

## Typography

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| h1 | 32px | 700 | Main numbers (stat cards) |
| h2 | 18px | 700 | Section titles, status headline |
| h3 | 16px | 600 | Card titles, CTA text |
| body | 13px | 400–500 | Descriptions, labels |
| caption | 11–12px | 400–600 | Metadata, badges, hints |

Font family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif

## Spacing (8px scale)

| Token | Value |
|-------|-------|
| --s1 | 8px |
| --s2 | 16px |
| --s3 | 24px |
| --s4 | 32px |
| --s5 | 40px |

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| --r-card | 16px | Cards |
| --r-sm | 12px | Inner cards, panels |
| --r-btn | 14px | Buttons |
| --r-pill | 20px | Badges, pills |
| --r-badge | 6px | Small badges |
| --r-thumb | 10px | Photo thumbnails |

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| --shadow-card | 0 1px 2px rgba(0,0,0,.04), 0 4px 16px rgba(0,0,0,.06) | Cards |
| --shadow-btn | 0 4px 16px rgba(37,99,235,.32), 0 1px 4px rgba(37,99,235,.2) | Primary button |

## Components

### PrimaryButton
- Background: #2563EB
- Border radius: 14px
- Padding: 15px 24px
- Font: 15px 700
- Color: white
- Shadow: --shadow-btn
- Full width on mobile

### StatCard
- Background: white
- Border: 1px solid --border
- Border radius: 16px
- Padding: 16px
- Shadow: --shadow-card
- Number: 32px 700 --text-primary
- Label: 13px 500 --text-secondary

### AnalysisCard
- Background: white
- Border: 1px solid --border
- Border radius: 12px
- Padding: 12px
- Thumbnail: 52px × 52px, radius 8px
- Score ring: 40px circle, border 2px

### PhotoCard (selected state)
- Border: 2.5px solid #2563EB
- Overlay: brightness 0.85
- Checkbox: 20px circle, background #2563EB

### ConfirmationModal
- Background: white
- Border radius: 24px 24px 44px 44px (bottom sheet)
- Overlay: rgba(15,23,42,.55)
- Confirm button: red background
- Cancel button: border 1px --border
