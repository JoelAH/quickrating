# Design Document: Travel Agents Landing Page

## Overview

This design document outlines the implementation of a dedicated landing page for independent travel agents at `/landing/travel-agents`. The page will follow Next.js 14 App Router conventions, use Material-UI components with custom SCSS modules for styling, and implement a mobile-first responsive design pattern consistent with the existing QuickRating landing page.

The landing page serves as a conversion-focused marketing tool specifically targeting independent travel agents who sell via Instagram, WhatsApp, and referrals. It demonstrates how QuickRating's review page can help them build trust with leads and close bookings faster.

## Architecture

### File Structure

```
src/
├── app/
│   └── landing/
│       └── travel-agents/
│           ├── page.tsx              # Main landing page component
│           └── page.module.scss      # Component-specific styles
```

### Technology Stack

- **Framework**: Next.js 14.2.5 with App Router
- **UI Library**: Material-UI v5 with Emotion
- **Styling**: SCSS Modules for custom styles
- **Typography**: Lato font (via next/font/google)
- **Image Optimization**: Next.js Image component
- **Metadata**: Next.js Metadata API for SEO

### Design Pattern

The page follows a **Server Component** pattern (default in Next.js App Router) since it contains only static content with no client-side interactivity beyond navigation links. This provides optimal performance through server-side rendering.

## Components and Interfaces

### Main Page Component

**File**: `src/app/landing/travel-agents/page.tsx`

**Type**: React Server Component

**Structure**:
```typescript
export const metadata: Metadata = {
  title: string,
  description: string,
  keywords: string,
  openGraph: OpenGraph,
  twitter: TwitterCard,
  alternates: { canonical: string }
}

export default function TravelAgentsLanding(): JSX.Element
```

**Component Hierarchy**:
```
TravelAgentsLanding
├── AppBar (reused from main landing)
│   ├── Logo Image
│   ├── Brand Typography
│   └── Auth Buttons (Login, Sign Up)
├── Main Content
│   ├── HeroSection
│   │   ├── Headline (h1)
│   │   ├── Subheadline (p)
│   │   └── CTA Buttons (Primary, Secondary)
│   ├── ProblemSection
│   │   ├── Heading (h2)
│   │   └── Bullet List
│   ├── SolutionSection
│   │   ├── Heading (h2)
│   │   ├── Description Paragraph
│   │   └── Benefit Bullets
│   ├── HowItWorksSection
│   │   ├── Heading (h2)
│   │   └── Step Cards (Grid)
│   │       ├── Step Number Icon
│   │       ├── Step Title (h3)
│   │       └── Step Description
│   ├── UseCasesSection
│   │   ├── Heading (h2)
│   │   └── Use Case Bullets
│   └── FinalCTASection
│       ├── Heading (h2)
│       ├── CTA Button
│       └── Subtext
└── Footer (reused from main landing)
    └── Legal Links
```

### Reusable Components

The page will reuse existing components from the main landing page:

1. **AppBar**: Navigation header with logo and auth buttons
2. **Footer**: Legal links and copyright information

These components are already implemented in `src/app/page.tsx` and will be extracted if not already modular.

## Data Models

### Metadata Configuration

```typescript
interface PageMetadata {
  title: string;
  description: string;
  keywords: string;
  openGraph: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    type: string;
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    creator: string;
    images: string[];
  };
  alternates: {
    canonical: string;
  };
}
```

### Structured Data Schema

The page will include JSON-LD structured data for SEO:

```typescript
interface WebPageSchema {
  "@context": "https://schema.org";
  "@type": "WebPage";
  name: string;
  description: string;
  url: string;
  audience: {
    "@type": "Audience";
    audienceType: string;
  };
}
```

## Styling Architecture

### Color Scheme

The travel agents landing page will use a distinct color palette that evokes trust and travel themes while maintaining QuickRating brand consistency:

**Primary Colors**:
- Hero Background: Linear gradient from `#4A90E2` (sky blue) to `#5BA3F5` (lighter blue)
- Primary CTA: `#2C5F8D` (deep blue)
- Secondary CTA: White with `#2C5F8D` border

**Accent Colors**:
- Success/Trust: `#34C759` (green) for checkmarks and positive elements
- Warning/Attention: `#FF9500` (orange) for emphasis
- Text Primary: `#222428` (dark gray)
- Text Secondary: `#555` (medium gray)

**Section Backgrounds**:
- Hero: Blue gradient
- Problem: White with light gray border
- Solution: `#F0F8FF` (alice blue - light blue tint)
- How It Works: White
- Use Cases: `#FFFBF0` (cream - warm neutral)
- Final CTA: Blue gradient (matching hero)

### Typography Scale

Following the existing landing page pattern:

- **Hero Headline**: 56px (desktop), 32px (mobile), weight 700
- **Section Headings**: 42px (desktop), 28px (mobile), weight 700
- **Subheadlines**: 24px (desktop), 18px (mobile), weight 400
- **Body Text**: 20px (desktop), 16px (mobile), weight 400
- **Step Titles**: 24px (desktop), 20px (mobile), weight 700

### Responsive Breakpoints

```scss
// Mobile: < 768px (default)
// Tablet: 769px - 1024px
// Desktop: > 1024px

@media only screen and (max-width: 768px) { /* Mobile */ }
@media only screen and (max-width: 1024px) and (min-width: 769px) { /* Tablet */ }
```

### SCSS Module Structure

**File**: `src/app/landing/travel-agents/page.module.scss`

```scss
// Hero Section
.heroSection { }
.heroContent { }
.heroHeadline { }
.heroSubheadline { }
.heroButtons { }
.heroPrimaryButton { }
.heroSecondaryButton { }

// Problem Section
.problemSection { }
.problemContent { }
.problemHeading { }
.problemList { }
.problemItem { }

// Solution Section
.solutionSection { }
.solutionContent { }
.solutionHeading { }
.solutionDescription { }
.solutionBenefits { }
.solutionBenefit { }

// How It Works Section
.howItWorksSection { }
.howItWorksHeading { }
.howItWorksGrid { }
.stepCard { }
.stepIconContainer { }
.stepNumber { }
.stepTitle { }
.stepDescription { }

// Use Cases Section
.useCasesSection { }
.useCasesContent { }
.useCasesHeading { }
.useCasesList { }
.useCaseItem { }

// Final CTA Section
.finalCTASection { }
.finalCTAContent { }
.finalCTAHeading { }
.finalCTAButton { }
.finalCTASubtext { }

// Responsive utilities
@media only screen and (max-width: 768px) { /* Mobile overrides */ }
@media only screen and (max-width: 1024px) and (min-width: 769px) { /* Tablet overrides */ }
```

## Layout Specifications

### Hero Section Layout

```
┌─────────────────────────────────────────┐
│         [Blue Gradient Background]       │
│                                          │
│         Close more travel bookings       │
│         with one trusted review link     │
│                                          │
│    QuickRating gives independent travel  │
│    agents a personal reviews page...     │
│                                          │
│  [View example]  [Get free setup]       │
│                                          │
└─────────────────────────────────────────┘
```

**Specifications**:
- Max width: 1200px centered
- Padding: 80px vertical (desktop), 40px (mobile)
- Headline: Center-aligned, max-width 900px
- Button gap: 16px horizontal, stack vertically on mobile

### Problem Section Layout

```
┌─────────────────────────────────────────┐
│                                          │
│    New travel clients don't trust easily │
│                                          │
│    • Leads ask "Are you legit?"         │
│    • Reviews scattered across DMs        │
│    • Screenshots look unprofessional     │
│    • Google Reviews don't work well      │
│                                          │
└─────────────────────────────────────────┘
```

**Specifications**:
- Max width: 800px centered
- Padding: 60px vertical (desktop), 40px (mobile)
- Bullet list: Left-aligned within centered container
- Icon size: 24px with 12px right margin

### Solution Section Layout

```
┌─────────────────────────────────────────┐
│                                          │
│  One page that proves you're a trusted   │
│  travel agent                            │
│                                          │
│  QuickRating gives you a clean...        │
│                                          │
│  ✓ Public reviews page branded to you   │
│  ✓ Reviews tagged by trip type          │
│  ✓ Easy to share on Instagram           │
│  ✓ You control your reviews              │
│                                          │
└─────────────────────────────────────────┘
```

**Specifications**:
- Max width: 900px centered
- Padding: 80px vertical (desktop), 60px (mobile)
- Background: Light blue tint (#F0F8FF)
- Checkmark color: #34C759

### How It Works Section Layout

```
┌─────────────────────────────────────────┐
│                                          │
│           How It Works                   │
│                                          │
│  ┌──────┐    ┌──────┐    ┌──────┐      │
│  │  1   │    │  2   │    │  3   │      │
│  │Create│    │ Send │    │Share │      │
│  │ your │    │ your │    │ your │      │
│  │ page │    │ link │    │ page │      │
│  └──────┘    └──────┘    └──────┘      │
│                                          │
└─────────────────────────────────────────┘
```

**Specifications**:
- Max width: 1200px centered
- Padding: 100px vertical (desktop), 60px (mobile)
- Grid: 3 columns (desktop), 1 column (mobile)
- Step icon: 80px circle with gradient background
- Card spacing: 40px gap (desktop), 32px (mobile)

### Use Cases Section Layout

```
┌─────────────────────────────────────────┐
│                                          │
│    How travel agents use QuickRating     │
│                                          │
│    → Send link after travel inquiry      │
│    → Add it to Instagram bio             │
│    → Drop into WhatsApp conversations    │
│    → Include in follow-up emails         │
│                                          │
└─────────────────────────────────────────┘
```

**Specifications**:
- Max width: 800px centered
- Padding: 80px vertical (desktop), 60px (mobile)
- Background: Cream (#FFFBF0)
- Arrow icon: 20px with 12px right margin

### Final CTA Section Layout

```
┌─────────────────────────────────────────┐
│         [Blue Gradient Background]       │
│                                          │
│      Start closing more bookings today   │
│                                          │
│       [Get your free review page]        │
│                                          │
│    No credit card required • Free setup  │
│                                          │
└─────────────────────────────────────────┘
```

**Specifications**:
- Max width: 800px centered
- Padding: 100px vertical (desktop), 60px (mobile)
- Button: Large, high contrast, centered
- Subtext: 16px, centered, 50% opacity

## Navigation and Routing

### Internal Links

1. **Primary CTA (Hero)**: `/try/setup` - Example review page
2. **Secondary CTA (Hero)**: `/auth/signup` - Signup page
3. **Final CTA Button**: `/auth/signup` - Signup page
4. **Login Link (AppBar)**: `/auth/login` - Login page
5. **Sign Up Link (AppBar)**: `/auth/signup` - Signup page

### External Links

None required for this page.

## SEO Implementation

### Page Metadata

```typescript
export const metadata: Metadata = {
  title: 'QuickRating for Travel Agents - Close More Bookings with Reviews',
  description: 'Independent travel agents: Build trust instantly with a personal review page. Share one link to prove credibility and close more cruise, honeymoon, and group trip bookings.',
  keywords: 'travel agent reviews, independent travel agent, travel advisor reviews, cruise reviews, honeymoon reviews, travel agent credibility, Instagram travel agent, WhatsApp travel sales',
  openGraph: {
    title: 'QuickRating for Travel Agents - Close More Bookings',
    description: 'Build trust with leads using a personal review page. Perfect for independent travel agents selling via Instagram and WhatsApp.',
    url: 'https://quickrating.page/landing/travel-agents',
    siteName: 'QuickRating',
    type: 'website',
    images: [{
      url: 'https://quickrating.page/travel-agents-og.png',
      width: 1200,
      height: 630,
      alt: 'QuickRating for Travel Agents'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuickRating for Travel Agents',
    description: 'Close more bookings with a personal review page',
    creator: '@QuickRating',
    images: ['https://quickrating.page/travel-agents-og.png']
  },
  alternates: {
    canonical: 'https://quickrating.page/landing/travel-agents'
  }
}
```

### Structured Data

```typescript
const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "QuickRating for Travel Agents",
  "description": "Review management platform for independent travel agents",
  "url": "https://quickrating.page/landing/travel-agents",
  "audience": {
    "@type": "Audience",
    "audienceType": "Independent Travel Agents"
  },
  "provider": {
    "@type": "Organization",
    "name": "QuickRating",
    "url": "https://quickrating.page"
  }
}
```

### Semantic HTML

- Use `<main>` for primary content
- Use `<section>` for each major content block
- Use proper heading hierarchy: h1 (hero), h2 (sections), h3 (subsections)
- Use `<nav>` for AppBar navigation
- Use `<footer>` for legal links

## Accessibility Requirements

### WCAG 2.1 Level AA Compliance

1. **Color Contrast**:
   - Text on blue gradient: Ensure 4.5:1 ratio minimum
   - Button text: White on dark blue (7:1 ratio)
   - All body text: Dark gray on white (12:1 ratio)

2. **Keyboard Navigation**:
   - All buttons and links focusable via Tab key
   - Visible focus indicators (2px outline)
   - Logical tab order following visual flow

3. **Screen Reader Support**:
   - Alt text for all decorative and informative images
   - ARIA labels for icon-only buttons
   - Proper heading hierarchy for navigation
   - Semantic HTML elements

4. **Touch Targets**:
   - Minimum 44x44px for all interactive elements
   - Adequate spacing between touch targets (8px minimum)

### Implementation Details

```typescript
// Button with proper accessibility
<Button
  variant="contained"
  className={classes.heroPrimaryButton}
  aria-label="View example travel agent review page"
>
  View example review page
</Button>

// Image with alt text
<Image
  src="/travel-agent-hero.png"
  alt="Travel agent sharing review link with client"
  width={600}
  height={400}
  priority
/>
```

## Performance Optimization

### Image Optimization

1. Use Next.js `Image` component for all images
2. Specify width and height to prevent layout shift
3. Use `priority` prop for above-the-fold images
4. Use WebP format with fallbacks
5. Lazy load below-the-fold images

### Code Splitting

- Server component (no client-side JavaScript by default)
- Material-UI components tree-shaken automatically
- SCSS modules scoped to component

### Loading Performance

- Target Largest Contentful Paint (LCP): < 2.5s
- Target First Input Delay (FID): < 100ms
- Target Cumulative Layout Shift (CLS): < 0.1

### Optimization Techniques

1. **Font Loading**: Use `next/font/google` with `display: swap`
2. **CSS**: SCSS modules compiled to minimal CSS
3. **No Client JavaScript**: Pure server component (no hydration overhead)
4. **Metadata**: Static generation at build time


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Image Accessibility

*For any* image element rendered on the Landing_Page, that image SHALL include an alt attribute with descriptive text.

**Validates: Requirements 11.3**

**Rationale**: This property ensures that all visual content is accessible to screen reader users. By testing all images universally rather than specific instances, we guarantee comprehensive accessibility coverage.

### Property 2: Keyboard Accessibility

*For any* interactive element (button, link, input) on the Landing_Page, that element SHALL be focusable and operable via keyboard navigation.

**Validates: Requirements 11.5**

**Rationale**: This property ensures that users who cannot use a mouse can still interact with all functionality. Testing this as a universal property across all interactive elements guarantees complete keyboard accessibility.

### Property 3: Color Contrast Compliance

*For any* text element on the Landing_Page, the contrast ratio between the text color and its background color SHALL meet or exceed WCAG 2.1 Level AA requirements (4.5:1 for normal text, 3:1 for large text).

**Validates: Requirements 11.6**

**Rationale**: This property ensures that all text is readable for users with visual impairments. By testing all text/background combinations universally, we guarantee comprehensive visual accessibility.

## Error Handling

### Client-Side Error Handling

Since this is a static landing page with no dynamic data fetching or user input, client-side error handling is minimal:

1. **Navigation Errors**: If navigation links fail (unlikely with Next.js Link component), the browser's default error handling applies
2. **Image Loading Errors**: Next.js Image component handles loading errors gracefully with fallback behavior

### Server-Side Error Handling

The page is server-rendered, so errors would occur at build time or request time:

1. **Build-Time Errors**: TypeScript compilation errors, missing imports, or syntax errors will prevent the build
2. **Runtime Errors**: Component rendering errors will be caught by Next.js error boundaries
3. **404 Handling**: Next.js automatically handles 404s if the route doesn't exist

### Error Boundaries

```typescript
// Next.js provides automatic error boundaries
// If the page fails to render, Next.js will show error.tsx if it exists
// For this landing page, we rely on Next.js default error handling
```

### Graceful Degradation

1. **Images**: If images fail to load, alt text provides context
2. **Fonts**: System fonts serve as fallback if Lato fails to load
3. **Styles**: Inline critical CSS ensures basic layout even if SCSS fails

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests to ensure comprehensive coverage:

- **Unit tests**: Verify specific content, layout, and responsive behavior at defined breakpoints
- **Property tests**: Verify universal accessibility properties across all elements

### Unit Testing

**Framework**: Jest with React Testing Library

**Test Categories**:

1. **Content Verification Tests**:
   - Verify hero section displays correct headline and subheadline
   - Verify all sections render with correct content
   - Verify all bullet points contain expected text
   - Verify CTA buttons have correct labels

2. **Navigation Tests**:
   - Verify primary CTA links to example page
   - Verify secondary CTA links to signup page
   - Verify final CTA links to signup page
   - Verify AppBar login/signup links work correctly

3. **Responsive Behavior Tests**:
   - Verify mobile layout (viewport < 768px) displays single column
   - Verify mobile layout stacks CTA buttons vertically
   - Verify desktop layout (viewport >= 768px) displays multi-column grids
   - Verify font sizes adjust appropriately at different breakpoints

4. **SEO Tests**:
   - Verify page metadata includes correct title and description
   - Verify Open Graph tags are present
   - Verify structured data JSON-LD is present
   - Verify semantic HTML elements are used

5. **Visual Hierarchy Tests**:
   - Verify headline font size is larger than subheadline
   - Verify heading hierarchy follows h1 → h2 → h3 pattern
   - Verify Lato font family is applied

**Example Unit Test**:
```typescript
describe('Travel Agents Landing Page', () => {
  it('should render hero section with correct headline', () => {
    render(<TravelAgentsLanding />);
    expect(screen.getByRole('heading', { level: 1 }))
      .toHaveTextContent('Close more travel bookings with one trusted review link');
  });

  it('should link primary CTA to example page', () => {
    render(<TravelAgentsLanding />);
    const primaryCTA = screen.getByText('View example review page');
    expect(primaryCTA.closest('a')).toHaveAttribute('href', '/try/setup');
  });

  it('should display mobile layout on small screens', () => {
    global.innerWidth = 375;
    render(<TravelAgentsLanding />);
    const heroButtons = screen.getByTestId('hero-buttons');
    expect(heroButtons).toHaveStyle({ flexDirection: 'column' });
  });
});
```

### Property-Based Testing

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**: Minimum 100 iterations per property test

**Property Test Implementation**:

Each correctness property will be implemented as a property-based test that generates random test cases and verifies the property holds for all of them.

**Property Test 1: Image Accessibility**
```typescript
import fc from 'fast-check';

describe('Property: Image Accessibility', () => {
  /**
   * Feature: travel-agents-landing-page
   * Property 1: For any image element, that image SHALL include an alt attribute
   */
  it('should ensure all images have alt text', () => {
    fc.assert(
      fc.property(fc.constantFrom('render'), () => {
        const { container } = render(<TravelAgentsLanding />);
        const images = container.querySelectorAll('img');
        
        images.forEach(img => {
          expect(img).toHaveAttribute('alt');
          expect(img.getAttribute('alt')).not.toBe('');
        });
      }),
      { numRuns: 100 }
    );
  });
});
```

**Property Test 2: Keyboard Accessibility**
```typescript
describe('Property: Keyboard Accessibility', () => {
  /**
   * Feature: travel-agents-landing-page
   * Property 2: For any interactive element, that element SHALL be keyboard accessible
   */
  it('should ensure all interactive elements are keyboard accessible', () => {
    fc.assert(
      fc.property(fc.constantFrom('render'), () => {
        const { container } = render(<TravelAgentsLanding />);
        const interactiveElements = container.querySelectorAll('button, a, input, select, textarea');
        
        interactiveElements.forEach(element => {
          // Element should be focusable (tabIndex >= 0 or naturally focusable)
          const tabIndex = element.getAttribute('tabindex');
          const isFocusable = tabIndex === null || parseInt(tabIndex) >= 0;
          expect(isFocusable).toBe(true);
          
          // Element should not be disabled
          expect(element).not.toBeDisabled();
        });
      }),
      { numRuns: 100 }
    );
  });
});
```

**Property Test 3: Color Contrast Compliance**
```typescript
import { getContrast } from 'polished';

describe('Property: Color Contrast Compliance', () => {
  /**
   * Feature: travel-agents-landing-page
   * Property 3: For any text element, contrast ratio SHALL meet WCAG 2.1 Level AA
   */
  it('should ensure all text meets contrast requirements', () => {
    fc.assert(
      fc.property(fc.constantFrom('render'), () => {
        const { container } = render(<TravelAgentsLanding />);
        const textElements = container.querySelectorAll('h1, h2, h3, p, span, button, a');
        
        textElements.forEach(element => {
          const styles = window.getComputedStyle(element);
          const color = styles.color;
          const backgroundColor = styles.backgroundColor;
          const fontSize = parseFloat(styles.fontSize);
          
          // Calculate contrast ratio
          const contrastRatio = getContrast(color, backgroundColor);
          
          // Large text (18pt+ or 14pt+ bold) needs 3:1, normal text needs 4.5:1
          const isLargeText = fontSize >= 18 || (fontSize >= 14 && styles.fontWeight >= 700);
          const requiredRatio = isLargeText ? 3 : 4.5;
          
          expect(contrastRatio).toBeGreaterThanOrEqual(requiredRatio);
        });
      }),
      { numRuns: 100 }
    );
  });
});
```

### Testing Balance

- **Unit tests**: Focus on specific examples, content verification, and responsive behavior at defined breakpoints
- **Property tests**: Focus on universal accessibility guarantees across all elements
- Together, these approaches provide comprehensive coverage: unit tests catch concrete content and layout bugs, while property tests verify accessibility compliance across the entire page

### Test Execution

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run only property tests
npm test -- --testNamePattern="Property:"
```

### Continuous Integration

Tests should run automatically on:
- Every commit (pre-commit hook)
- Every pull request (CI pipeline)
- Before deployment (pre-deployment check)

### Test Coverage Goals

- **Line coverage**: > 90%
- **Branch coverage**: > 85%
- **Function coverage**: > 90%
- **Property test iterations**: 100 per property (minimum)
