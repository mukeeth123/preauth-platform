# Healthcare Preauthorization Platform - Design System 2025

## Overview
This design system follows 2025 healthcare UX/UI standards with emphasis on accessibility (WCAG AA), trust-building, and clinical workflow optimization.

---

## Color Palette

### Primary Colors
- **Primary Blue**: `#2C5F8D` - Main brand color, trust-building
- **Primary Light**: `#4A90E2` - Interactive elements, hover states
- **Success Green**: `#28A745` - Positive feedback, approvals
- **Warning Orange**: `#FFA726` - Alerts, missing information
- **Error Red**: `#DC3545` - Errors, denials, critical issues

### Neutral Colors
- **Neutral 50**: `#F8F9FA` - Background, cards
- **Neutral 100**: `#E9ECEF` - Borders, dividers
- **Neutral 600**: `#6C757D` - Secondary text
- **Neutral 900**: `#212529` - Primary text
- **White**: `#FFFFFF` - Card backgrounds

### Gradient Accents
- **Blue Gradient**: `from-blue-50 to-indigo-50` - Upload areas, highlights
- **Success Gradient**: `from-green-50 to-emerald-50` - Success states

---

## Typography

### Font Stack
```css
font-family: 'Inter', 'Roboto', 'Open Sans', 'Source Sans Pro', system-ui, sans-serif;
```

### Font Sizes & Line Heights
- **H1 (Page Title)**: 24px, line-height: 1.4, font-weight: 700
- **H2 (Section Title)**: 20px, line-height: 1.5, font-weight: 700
- **H3 (Subsection)**: 18px, line-height: 1.5, font-weight: 600
- **Body Text**: 16px, line-height: 1.6, font-weight: 400
- **Small Text**: 15px, line-height: 1.6, font-weight: 400
- **Caption**: 14px, line-height: 1.5, font-weight: 500

### Contrast Requirements
- All text meets WCAG AA standards (4.5:1 minimum contrast ratio)
- Large text (18px+) meets 3:1 contrast ratio

---

## Layout & Spacing

### Grid System
- **Desktop**: 3-column grid (2 columns for form, 1 for sidebar)
- **Mobile**: Single column, stacked layout
- **Gap**: 24px (1.5rem) between major sections
- **Padding**: 16-32px within cards

### Card Design
- **Border**: 1px solid #E9ECEF
- **Border Radius**: 8-12px (lg rounded)
- **Shadow**: `shadow-md` for elevation
- **Background**: White (#FFFFFF)
- **Padding**: 24-32px

### Section Headers
- **Border Bottom**: 2px solid #2C5F8D (primary blue)
- **Icon Size**: 20px (h-5 w-5)
- **Spacing**: 12px padding bottom

---

## Interactive Elements

### Buttons

#### Primary CTA
```css
min-height: 56px;
min-width: 200px;
padding: 16px 32px;
background: #2C5F8D;
color: white;
font-size: 18px;
font-weight: 600;
border-radius: 8px;
box-shadow: 0 4px 6px rgba(0,0,0,0.1);
transition: all 200ms;
```

**States:**
- Hover: `background: #4A90E2`, `transform: scale(1.05)`
- Active: `background: #1E4A6F`
- Disabled: `background: #E9ECEF`, `cursor: not-allowed`

#### Secondary Button
```css
min-height: 44px;
padding: 12px 24px;
background: white;
border: 2px solid #2C5F8D;
color: #2C5F8D;
font-size: 16px;
border-radius: 8px;
```

**States:**
- Hover: `background: #F8F9FA`, `border-color: #4A90E2`

### Form Inputs

#### Text Input / Select
```css
min-height: 44px;
padding: 12px 16px;
border: 2px solid #E9ECEF;
border-radius: 8px;
font-size: 16px;
transition: all 200ms;
```

**States:**
- Focus: `border-color: #4A90E2`, `ring: 2px #4A90E2`
- Error: `border-color: #DC3545`
- Success: `border-color: #28A745`
- Disabled: `background: #F8F9FA`, `cursor: not-allowed`

#### Textarea
```css
min-height: 200px;
padding: 12px 16px;
border: 2px solid #E9ECEF;
border-radius: 8px;
font-size: 16px;
line-height: 1.6;
resize: vertical;
```

---

## Components

### Security Badge
- **Background**: #F8F9FA
- **Border**: 1px solid #E9ECEF
- **Icon**: Green lock (h-3.5 w-3.5)
- **Text**: "HIPAA Compliant" (12px, font-medium)
- **Padding**: 6px 10px
- **Border Radius**: 9999px (full rounded)

### File Upload Area
- **Background**: Gradient from-blue-50 to-indigo-50
- **Border**: 2px dashed #4A90E2
- **Border Radius**: 12px
- **Padding**: 32px
- **Hover**: `border-color: #2C5F8D`

### Progress Bar
```css
height: 12px;
background: #E9ECEF;
border-radius: 9999px;
overflow: hidden;
```

**Progress Fill:**
```css
background: linear-gradient(to right, #4A90E2, #2C5F8D);
height: 100%;
transition: width 300ms ease-out;
```

### Alert Boxes

#### Success
- Background: #F0FDF4 (green-50)
- Border: 1px solid #86EFAC (green-200)
- Icon: CheckIcon (green-600)

#### Warning
- Background: #FFF7ED (orange-50)
- Border: 1px solid #FED7AA (orange-200)
- Icon: Warning triangle (orange-600)

#### Error
- Background: #FEF2F2 (red-50)
- Border: 1px solid #FECACA (red-200)
- Icon: Error circle (red-600)

### AI Assist Panel

#### Header
- **Badge**: "LIVE" - blue-600 text, blue-50 background
- **Icon**: Lightbulb (h-6 w-6, blue-600)
- **Title**: 20px, font-bold

#### Sections
- Collapsible with smooth animation
- Icons: Emoji or SVG (📋 📄 ✨ 💡)
- Border bottom: 1px solid #F8F9FA

#### Quick Insert Buttons
```css
min-height: 44px;
padding: 12px 16px;
background: white;
border: 2px solid #E9ECEF;
border-radius: 8px;
text-align: left;
transition: all 200ms;
```

**Hover:**
```css
border-color: #4A90E2;
background: #F0F9FF;
```

---

## Accessibility Features

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Tab order follows logical flow
- Focus indicators visible (2px ring)

### ARIA Labels
- All form inputs have proper labels
- Required fields marked with `aria-required="true"`
- Buttons have descriptive `aria-label` when icon-only

### Touch Targets
- Minimum size: 44x44px
- Adequate spacing between targets (8px minimum)

### Screen Reader Support
- Semantic HTML structure
- Proper heading hierarchy (H1 → H2 → H3)
- Alt text for all images/icons
- Status messages announced

---

## Responsive Breakpoints

```css
/* Mobile First */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

### Mobile Adaptations
- Single column layout
- Sticky sidebar becomes bottom sheet
- Larger touch targets (48x48px)
- Simplified navigation
- Collapsible sections default closed

---

## Animation & Transitions

### Standard Transitions
```css
transition: all 200ms ease-in-out;
```

### Hover Effects
```css
transform: scale(1.05);
transition: transform 200ms;
```

### Loading States
- Spinner: Rotating animation (1s linear infinite)
- Progress bars: Smooth width transition (300ms ease-out)
- Skeleton screens for content loading

---

## Icons

### Icon Library
- Heroicons (outline and solid variants)
- Size: 16px (h-4 w-4), 20px (h-5 w-5), 24px (h-6 w-6)
- Stroke width: 2px for outline icons

### Common Icons
- 🔒 Security/HIPAA
- 📋 Policy/Checklist
- 📄 Documents
- ✨ AI Suggestions
- 💡 Tips/Guidance
- ✓ Success/Complete
- ⚠️ Warning
- ❌ Error

---

## Best Practices

### Clinical Workflow
1. Progressive disclosure - show relevant info when needed
2. Clear visual hierarchy - most important actions prominent
3. Inline validation - immediate feedback
4. Contextual help - AI assist always visible
5. Error prevention - validate before submit

### Trust & Security
1. HIPAA badges near sensitive fields
2. Encryption indicators
3. Clear data handling policies
4. Secure connection indicators

### Performance
1. Lazy load images
2. Debounce AI assist calls (750ms)
3. Optimize file uploads
4. Cache policy data

---

## Developer Handoff Notes

### CSS Framework
- Tailwind CSS 3.x
- Custom color palette in tailwind.config.js
- Responsive utilities (sm:, md:, lg:, xl:)

### Component Structure
```
components/
├── common/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Spinner.tsx
│   └── Toast.tsx
├── PreauthForm.tsx
├── DecisionDisplay.tsx
└── PolicyEditor.tsx
```

### State Management
- React hooks (useState, useEffect, useRef)
- Debounced API calls for AI assist
- Form validation on submit

### API Integration
- Mock API service (services/mockApiService.ts)
- Gemini AI integration (services/geminiService.ts)
- File upload with OCR support

---

## Figma Design Tokens

```json
{
  "colors": {
    "primary": "#2C5F8D",
    "primaryLight": "#4A90E2",
    "success": "#28A745",
    "warning": "#FFA726",
    "error": "#DC3545",
    "neutral50": "#F8F9FA",
    "neutral100": "#E9ECEF",
    "neutral600": "#6C757D",
    "neutral900": "#212529",
    "white": "#FFFFFF"
  },
  "typography": {
    "fontFamily": "Inter, Roboto, Open Sans, system-ui",
    "h1": { "size": 24, "weight": 700, "lineHeight": 1.4 },
    "h2": { "size": 20, "weight": 700, "lineHeight": 1.5 },
    "h3": { "size": 18, "weight": 600, "lineHeight": 1.5 },
    "body": { "size": 16, "weight": 400, "lineHeight": 1.6 },
    "small": { "size": 15, "weight": 400, "lineHeight": 1.6 },
    "caption": { "size": 14, "weight": 500, "lineHeight": 1.5 }
  },
  "spacing": {
    "xs": 4,
    "sm": 8,
    "md": 16,
    "lg": 24,
    "xl": 32,
    "2xl": 48
  },
  "borderRadius": {
    "sm": 4,
    "md": 8,
    "lg": 12,
    "full": 9999
  }
}
```

---

## Accessibility Checklist

- [ ] All text meets 4.5:1 contrast ratio
- [ ] All interactive elements are 44x44px minimum
- [ ] Keyboard navigation works throughout
- [ ] Focus indicators are visible
- [ ] ARIA labels on all form inputs
- [ ] Semantic HTML structure
- [ ] Alt text on images
- [ ] Error messages are descriptive
- [ ] Success states are announced
- [ ] Loading states are indicated
- [ ] Forms can be submitted with Enter key
- [ ] Modals trap focus
- [ ] Skip links for navigation

---

## Version History

**v1.0.0** - Initial 2025 Healthcare Design System
- Modern card-based layouts
- WCAG AA compliant
- Mobile-first responsive design
- AI-powered assistance integration
- HIPAA compliance indicators


---

## Results Page (Decision Display) - 2025 Design

### Overview
The results page displays preauthorization validation outcomes with clear visual hierarchy, emphasizing failed criteria for quick action while celebrating successes.

### Layout Structure

#### 1. Status Header Card
- **Border**: 2px solid, color-coded by status
- **Padding**: 24px
- **Elements**:
  - Large status icon (emoji: ✓ ✕ ⚠)
  - Case ID (monospace font)
  - Status headline (28px, bold)
  - Policy name (16px)
  - Quick stats (criteria met/unmet)
  - Circular approval gauge (140x140px)

#### 2. Information Banner (Conditional)
- **Display**: Only when criteria are unmet
- **Background**: Light blue (#EFF6FF)
- **Border Left**: 4px solid #4A90E2
- **Icon**: Information circle (32px)
- **Text**: Clear summary of missing items

#### 3. AI Recommendations Card
- **Display**: Only when not approved
- **Sections**:
  - AI-improved justification (gradient background)
  - Numbered action items (white cards with hover effect)
- **Spacing**: 24px between sections

#### 4. Failed Criteria Section
- **Priority**: Displayed first, above passed criteria
- **Card Style**:
  - Red border (2px, #FECACA)
  - Red background (#FEF2F2)
  - Large X icon in circle
  - Bold criterion text (17px)
  - Warning box for evidence notes
- **Spacing**: 16px between items
- **Accessibility**: role="alert", aria-live="polite"

#### 5. Passed Criteria Section
- **Collapsible**: Default collapsed to reduce cognitive load
- **Toggle Button**: 44px min height, full width
- **Card Style**:
  - Green border (#86EFAC)
  - Green background (#F0FDF4)
  - Checkmark icon in circle
- **Animation**: Smooth expand/collapse

#### 6. Action Buttons (Sticky Footer)
- **Position**: Sticky bottom with z-index
- **Layout**: Responsive flex (column on mobile, row on desktop)
- **Button Hierarchy**:
  1. **Back** (Secondary): White bg, gray border, 48px height
  2. **Apply AI** (Primary): Blue gradient, 48px height
  3. **Submit** (CTA): Green gradient, 52px height, bold
- **Security Notice**: Small text with shield icon

### Color Coding by Status

#### Approved
- **Color**: #28A745 (success green)
- **Background**: #F0FDF4
- **Border**: #86EFAC
- **Icon**: ✓

#### Denied
- **Color**: #DC3545 (error red)
- **Background**: #FEF2F2
- **Border**: #FECACA
- **Icon**: ✕

#### Needs Review
- **Color**: #FFA726 (warning orange)
- **Background**: #FFF7ED
- **Border**: #FED7AA
- **Icon**: ⚠

### Typography Specifications

```css
/* Status Headline */
font-size: 28px;
font-weight: 700;
line-height: 1.3;

/* Section Headers */
font-size: 20px;
font-weight: 700;
line-height: 1.4;

/* Criterion Text */
font-size: 17px;
font-weight: 700;
line-height: 1.5;

/* Body Text */
font-size: 16px;
font-weight: 400;
line-height: 1.6;

/* Evidence Notes */
font-size: 15px;
font-weight: 400;
line-height: 1.6;

/* Small Text */
font-size: 14px;
font-weight: 500;
line-height: 1.5;
```

### Spacing System

```css
/* Between major sections */
gap: 24px (1.5rem);

/* Within cards */
padding: 24px;

/* Between checklist items */
margin-bottom: 16px;

/* Before action buttons */
margin-top: 32px;
```

### Interactive States

#### Buttons
```css
/* Primary CTA (Submit) */
min-height: 52px;
background: linear-gradient(to right, #28A745, #10B981);
hover: scale(1.05), shadow-xl;
focus: ring-2 ring-green-500;

/* Secondary (Apply AI) */
min-height: 48px;
background: linear-gradient(to right, #4A90E2, #6366F1);
hover: scale(1.05), shadow-lg;

/* Tertiary (Back) */
min-height: 48px;
background: white;
border: 2px solid #E9ECEF;
hover: background #F8F9FA;
```

#### Collapsible Section
```css
/* Toggle button */
min-height: 44px;
hover: background green-50;
transition: all 200ms;

/* Chevron icon */
transform: rotate(0deg) | rotate(180deg);
transition: transform 200ms;
```

### Accessibility Features

#### ARIA Labels
```html
<button aria-label="Return to preauthorization form">
<button aria-label="Apply AI suggestions and resubmit case">
<button aria-label="Submit preauthorization to payer">
<button aria-expanded="true|false" aria-controls="passed-criteria-list">
<div role="alert" aria-live="polite">
```

#### Keyboard Navigation
- All buttons: Tab accessible
- Collapsible section: Enter/Space to toggle
- Focus indicators: 2px ring with offset

#### Screen Reader Support
- Status icons have descriptive text
- Error states announced with aria-live
- Button purposes clearly labeled
- Criterion status explicitly stated

### Visual Hierarchy

**Priority Order:**
1. Status header with approval gauge
2. Information banner (if needed)
3. Failed criteria (prominent, red)
4. AI recommendations
5. Passed criteria (collapsible, green)
6. Action buttons (sticky)

### Responsive Behavior

#### Desktop (≥1024px)
- Full width cards (max-width: 1152px)
- Buttons in horizontal row
- Approval gauge on right side of header

#### Tablet (768px - 1023px)
- Stacked layout
- Buttons in horizontal row
- Approval gauge below status text

#### Mobile (<768px)
- Single column
- Buttons stacked vertically
- Larger touch targets (48px minimum)
- Approval gauge centered

### Animation & Transitions

```css
/* Card entrance */
animation: fade-in 300ms ease-in;

/* Collapsible content */
animation: fade-in-sm 200ms ease-out;

/* Button hover */
transition: all 200ms ease-in-out;
transform: scale(1.05);

/* Approval gauge */
transition: stroke-dashoffset 1000ms ease-in-out;
```

### Component States

#### Loading
- Skeleton screens for cards
- Spinner in approval gauge
- Disabled buttons

#### Error
- Red border on failed criteria cards
- Warning icons
- Actionable error messages

#### Success
- Green border on passed criteria
- Checkmark icons
- Positive reinforcement text

### Best Practices

1. **Scan-ability**: Failed items always shown first
2. **Actionability**: Every error has clear next steps
3. **Cognitive Load**: Passed items collapsible by default
4. **Visual Feedback**: Color, icons, and text reinforce status
5. **Accessibility**: WCAG AA compliant, keyboard navigable
6. **Mobile-First**: Touch-friendly, readable on small screens
7. **Performance**: Smooth animations, no jank
8. **Trust**: Security badges, HIPAA compliance notices

---

## Figma Component Library

### Results Page Components

```
Components/
├── StatusHeader/
│   ├── Approved
│   ├── Denied
│   └── NeedsReview
├── ApprovalGauge/
│   ├── Default
│   └── Animated
├── InfoBanner/
│   └── Default
├── CriterionCard/
│   ├── Failed (Red)
│   └── Passed (Green)
├── AIRecommendations/
│   ├── Justification
│   └── ActionList
├── CollapsibleSection/
│   ├── Collapsed
│   └── Expanded
└── ActionButtons/
    ├── Desktop
    ├── Tablet
    └── Mobile
```

### Design Tokens (JSON)

```json
{
  "resultsPage": {
    "colors": {
      "success": "#28A745",
      "successBg": "#F0FDF4",
      "successBorder": "#86EFAC",
      "error": "#DC3545",
      "errorBg": "#FEF2F2",
      "errorBorder": "#FECACA",
      "warning": "#FFA726",
      "warningBg": "#FFF7ED",
      "warningBorder": "#FED7AA",
      "info": "#4A90E2",
      "infoBg": "#EFF6FF",
      "infoBorder": "#BFDBFE"
    },
    "spacing": {
      "sectionGap": 24,
      "cardPadding": 24,
      "itemGap": 16,
      "buttonGap": 12
    },
    "typography": {
      "statusHeadline": { "size": 28, "weight": 700, "lineHeight": 1.3 },
      "sectionHeader": { "size": 20, "weight": 700, "lineHeight": 1.4 },
      "criterionText": { "size": 17, "weight": 700, "lineHeight": 1.5 },
      "bodyText": { "size": 16, "weight": 400, "lineHeight": 1.6 },
      "evidenceNotes": { "size": 15, "weight": 400, "lineHeight": 1.6 }
    },
    "buttons": {
      "primary": { "height": 52, "fontSize": 17 },
      "secondary": { "height": 48, "fontSize": 16 },
      "tertiary": { "height": 48, "fontSize": 16 }
    }
  }
}
```

---

## Version History

**v1.1.0** - Results Page Redesign (2025)
- Redesigned decision display with modern healthcare UX
- Prominent failed criteria display
- Collapsible passed criteria section
- Enhanced AI recommendations layout
- Sticky action buttons with clear hierarchy
- Full WCAG AA accessibility compliance
- Mobile-optimized responsive design
