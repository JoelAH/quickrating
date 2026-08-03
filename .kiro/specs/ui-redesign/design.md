# Design Document

## Overview

This design document outlines the modernization of three key pages in the QuickRating application: the home page, setup page, and dashboard. The redesign focuses on creating a contemporary, visually appealing user experience while maintaining all existing functionality and leveraging the current tech stack (Next.js 14, MUI v5, SCSS Modules, TypeScript).

The home page will be restructured using the StoryBrand 2.0 Framework to create a compelling narrative that guides potential customers through understanding their problem, seeing QuickRating as the solution, and taking action. The setup and dashboard pages will receive visual enhancements focused on improved spacing, typography, and modern UI patterns.

### Design Principles

1. **Maintain Functionality**: All existing features, data flows, and user interactions remain unchanged
2. **Modern Aesthetics**: Clean, spacious layouts with contemporary typography and visual hierarchy
3. **Consistent Branding**: Leverage existing color palette (#FBBC04 primary, #222428 dark) with enhanced usage
4. **Responsive Design**: Maintain and enhance mobile-first responsive patterns
5. **Accessibility**: Ensure WCAG 2.1 AA compliance with proper contrast ratios and semantic HTML
6. **Performance**: No additional dependencies; use existing MUI components and SCSS Modules

## Architecture

### Component Structure

The redesign maintains the existing Next.js App Router architecture with no structural changes to component hierarchy or file organization:

```
src/app/
├── page.tsx (Home Page - major visual redesign)
├── page.module.scss (Home Page styles - comprehensive updates)
├── main/
│   ├── setup/
│   │   └── page.tsx (Setup Page - minor layout enhancements)
│   └── dashboard/
│       ├── page.tsx (Dashboard - layout improvements)
│       └── dashboard.module.scss (Dashboard styles - updates)
src/components/
├── settingsForm.tsx (no changes to logic)
├── settingsForm.module.scss (visual enhancements)
├── header.tsx (no changes to logic)
└── header.module.scss (visual enhancements)
```

### Technology Stack Usage

- **MUI Components**: Box, Grid, Container, Button, TextField, AppBar, Toolbar, Typography, Card, CardContent
- **MUI Icons**: Existing icons plus potential additions for enhanced visual communication
- **SCSS Modules**: All styling changes implemented via scoped SCSS modules
- **Next.js Features**: Image optimization, Link component, font optimization (Lato)
- **Existing Theme**: Leverage theme.ts color palette and typography settings

## Components and Interfaces

### 1. Home Page Redesign

#### Hero Section
**Purpose**: Immediately communicate value proposition using StoryBrand framework

**Visual Design**:
- Full-width container with gradient background (subtle: #FBBC04 to #ffc351)
- Centered content with maximum width of 1200px
- Headline: 56px bold, line-height 1.2, dark text (#222428)
- Subheadline: 24px regular, line-height 1.5, slightly muted (#333)
- Vertical spacing: 80px top/bottom padding on desktop, 40px on mobile
- Two prominent CTAs: Primary button (solid #FBBC04) and secondary (outlined)
- Button styling: 16px font, 48px height, 24px horizontal padding, 8px border-radius

**Layout**:
```
┌─────────────────────────────────────────┐
│         [Logo] QuickRating    [Login]   │
│                              [Sign Up]   │
├─────────────────────────────────────────┤
│                                         │
│         Collect and Display Reviews     │
│      — Even Without Google or Trustpilot│
│                                         │
│   QuickRating gives small online        │
│   businesses a simple page where        │
│   customers can leave real reviews      │
│   you can proudly share.                │
│                                         │
│   [Create Your Free Review Page]        │
│   [Try without signing up]              │
│                                         │
└─────────────────────────────────────────┘
```

#### Problem Section
**Purpose**: Articulate customer pain points

**Content**:
- "Most small online businesses don't have a place for customers to leave reviews."
- "Without reviews, new buyers hesitate — and sales slip away."
- "Collecting social proof shouldn't be this complicated."

**Visual Design**:
- White background with subtle border-top (1px solid #e0e0e0)
- Centered text block, max-width 800px
- Three short statements, each 20px font size
- 60px vertical padding
- Statements styled with left-aligned text and bullet points or icons
- Muted text color (#555) for empathetic tone

#### Guide Section
**Purpose**: Position QuickRating as the understanding solution

**Content**:
- "At QuickRating, we understand how hard it is to build credibility online — especially when you're just starting out. That's why we created an easy, all-in-one review page that helps your business look professional and trustworthy."

**Visual Design**:
- Light background (#f9f9f9)
- Centered paragraph, max-width 900px
- 22px font size, line-height 1.6
- 80px vertical padding
- Warm, conversational tone emphasized through typography

#### Plan Section (How It Works)
**Purpose**: Show simple 3-step process

**Visual Design**:
- White background
- Section heading: "How It Works" - 42px bold, centered
- Three-column grid on desktop, stacked on mobile
- Each step:
  - Large circular icon container (80px diameter, #FBBC04 background)
  - Step number in white, 32px bold
  - Step title: 24px bold
  - Description: 18px regular, line-height 1.5
- 100px vertical padding
- 40px spacing between columns

**Layout**:
```
┌──────────────────────────────────────────┐
│           How It Works                   │
│                                          │
│  ┌────┐    ┌────┐    ┌────┐            │
│  │ 1️⃣ │    │ 2️⃣ │    │ 3️⃣ │            │
│  └────┘    └────┘    └────┘            │
│  Create    Share     Collect            │
│  your      your      and                │
│  page      link      showcase           │
└──────────────────────────────────────────┘
```

#### Success Section
**Purpose**: Show benefits with checkmarks

**Visual Design**:
- Light gradient background (#fffbf0 to white)
- Section heading: "With QuickRating, You Can:" - 38px bold
- Three-column grid (2 columns on tablet, 1 on mobile)
- Each benefit:
  - Green checkmark icon (34C759)
  - Benefit text: 20px, line-height 1.4
- 80px vertical padding
- Card-style presentation with subtle shadows

#### Failure Section
**Purpose**: Show consequences of inaction

**Visual Design**:
- White background with red accent border-left (4px solid #eb445a)
- Max-width 800px, centered
- 22px font size, line-height 1.6
- 60px vertical padding
- Slightly darker text (#333) for emphasis

#### Transformation Section (Before/After)
**Purpose**: Visual comparison of states

**Visual Design**:
- Two-column grid (stacked on mobile)
- "Before" column: Muted colors, red X icons
- "After" column: Vibrant colors, green checkmarks
- Each column has:
  - Heading: 28px bold
  - 4 bullet points: 18px
- 100px vertical padding
- Subtle background colors (before: #fff5f5, after: #f0fff4)

**Layout**:
```
┌──────────────────────────────────────────┐
│  Before QuickRating  │  After QuickRating│
│  ❌ No reviews       │  ✅ Clean page    │
│  ❌ No trust         │  ✅ Real proof    │
│  ❌ Hard to prove    │  ✅ Instant cred  │
│  ❌ Losing customers │  ✅ More sales    │
└──────────────────────────────────────────┘
```

#### Pricing Section
**Purpose**: Display pricing tiers clearly

**Visual Design**:
- White background
- Section heading: "Pricing" - 42px bold, centered
- Two-column grid (stacked on mobile)
- Enhanced card design:
  - White background with 2px border (#e0e0e0)
  - 16px border-radius
  - 24px padding
  - Subtle hover effect (lift + shadow)
  - Standard plan: highlighted with #FBBC04 border
- Maintain existing pricing content and structure
- 100px vertical padding

#### Footer
**Purpose**: Legal links and copyright

**Visual Design**:
- Light gray background (#f4f5f8)
- Three-column grid (centered text on mobile)
- 14px font size
- 40px vertical padding
- Links: #333 color, underline on hover

### 2. Setup Page Redesign

#### Page Container
**Purpose**: Provide clean, focused environment for form completion

**Visual Design**:
- White background
- Maximum width: 800px (increased from 600px for better readability)
- Centered with auto margins
- 40px padding on all sides
- Subtle card effect: 1px border (#e0e0e0), 8px border-radius, soft shadow

#### Header Section
**Visual Design**:
- Page title: 36px bold (increased from default h1)
- Subtitle: 20px regular, line-height 1.5, muted color (#555)
- 60px bottom margin
- Centered text alignment

#### Form Sections
**Visual Design**:
- Each section (1-5) clearly separated with 60px bottom margin
- Section headings: 22px bold, #222428 color
- Required indicator (*): #eb445a color
- Improved TextField styling:
  - 56px height (larger touch targets)
  - 16px font size
  - 12px border-radius
  - Focus state: 2px border, #FBBC04 color
- Color picker: Enhanced container with border and padding
- Image upload: Improved file input styling with custom button
- Contact information: Icon + input pairs with better alignment

#### Submit Button
**Visual Design**:
- Full width
- 56px height
- 18px bold font
- #FBBC04 background
- 8px border-radius
- Hover state: darken to #d18800
- Loading state: spinner with disabled appearance

### 3. Dashboard Redesign

#### Layout Structure
**Purpose**: Organize information into clear, scannable sections

**Visual Design**:
- Header component (existing, minor enhancements)
- Business preview section (existing BizPage component)
- Two-column grid for key information (stacked on mobile):
  - Left: Shareable link section
  - Right: Subscription information
- Full-width reviews section below

#### Shareable Link Section
**Visual Design**:
- Card container:
  - White background
  - 16px border-radius
  - 24px padding
  - Subtle shadow (0 2px 8px rgba(0,0,0,0.1))
- Section title: 24px bold, with "Reviews Page" in #d18800
- Link display:
  - Light gray background (#f5f5f5)
  - 16px padding
  - 8px border-radius
  - Monospace font for URL
  - Copy icon: #FBBC04 color, hover effect
- "View my page" link:
  - 18px font
  - #FBBC04 color
  - Icon animation on hover

#### Subscription Section
**Visual Design**:
- Card container (matching link section)
- Clear visual hierarchy for subscription status
- Feature list with improved spacing:
  - 20px line-height
  - Icons aligned with text
  - Green checkmarks for active features
  - Red X for unavailable features
- CTA buttons:
  - Primary action: 48px height, full width
  - Secondary actions: outlined style

#### Reviews Section
**Visual Design**:
- Section heading: 32px bold, 60px top margin
- "No Reviews Yet" state:
  - Centered text
  - 24px font size
  - Muted color
  - Illustration or icon (optional enhancement)
- Reviews grid (when present):
  - Existing ReviewsContent component
  - Enhanced card spacing
  - Improved hover states

## Data Models

No changes to existing data models. All TypeScript interfaces and types remain unchanged:

- User
- Review
- PageSetting
- PageContact
- Payment
- TrialPage
- TrialReview

## Error Handling

No changes to existing error handling patterns:

- Form validation remains unchanged
- Toast notifications continue using react-toastify
- Server Action error responses unchanged
- Authentication redirects unchanged

## Testing Strategy

### Visual Regression Testing
- Compare before/after screenshots of all three pages
- Test at multiple viewport sizes (320px, 768px, 1024px, 1440px)
- Verify responsive breakpoints function correctly

### Functional Testing
- **Home Page**:
  - Verify all navigation links work
  - Test both CTA buttons (signup and try without signup)
  - Confirm pricing section links to signup
  - Test footer links
- **Setup Page**:
  - Verify form submission works
  - Test username validation
  - Test image upload and cropping
  - Verify color picker functionality
  - Test all contact information inputs
  - Confirm redirect to dashboard after submission
- **Dashboard**:
  - Verify copy link functionality
  - Test "View my page" link opens in new tab
  - Verify subscription actions work
  - Test review management (publish/unpublish)
  - Confirm navigation links in header

### Cross-Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

### Accessibility Testing
- Keyboard navigation through all interactive elements
- Screen reader compatibility (VoiceOver, NVDA)
- Color contrast verification (WCAG AA minimum 4.5:1)
- Focus indicators visible and clear
- Semantic HTML structure maintained

### Performance Testing
- Lighthouse scores should maintain or improve:
  - Performance: 90+
  - Accessibility: 95+
  - Best Practices: 90+
  - SEO: 95+
- No additional bundle size from styling changes
- Image optimization maintained

## Implementation Notes

### Styling Approach
- All styles implemented in SCSS Modules
- Use CSS custom properties for theme colors where beneficial
- Maintain existing class naming conventions (camelCase)
- Leverage MUI's sx prop for component-specific overrides
- Use Grid and Box components for layout (no custom layout components)

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px
- Use MUI's useMediaQuery hook where needed in components
- SCSS media queries for style-only responsive changes

### Animation and Transitions
- Subtle transitions on interactive elements (200ms ease)
- Hover effects on buttons and cards
- No complex animations that could impact performance
- Respect prefers-reduced-motion media query

### Typography Scale
- Heading 1: 56px / 42px mobile
- Heading 2: 42px / 32px mobile
- Heading 3: 32px / 24px mobile
- Heading 4: 24px / 20px mobile
- Body Large: 22px / 20px mobile
- Body: 18px / 16px mobile
- Body Small: 16px / 14px mobile
- Caption: 14px / 12px mobile

### Color Palette
- Primary: #FBBC04 (existing)
- Primary Dark: #d18800 (existing warning color)
- Primary Light: #ffc351 (existing secondary)
- Dark: #222428 (existing info)
- Text Primary: #222428
- Text Secondary: #555
- Text Muted: #777
- Border: #e0e0e0
- Background Light: #f9f9f9
- Success: #34C759 (existing)
- Error: #eb445a (existing)

### Spacing Scale
- xs: 8px
- sm: 16px
- md: 24px
- lg: 40px
- xl: 60px
- xxl: 80px
- xxxl: 100px
