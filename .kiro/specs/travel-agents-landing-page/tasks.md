# Implementation Plan: Travel Agents Landing Page

## Overview

This implementation plan breaks down the creation of a dedicated landing page for independent travel agents at `/landing/travel-agents`. The page will be built using Next.js 14 App Router, Material-UI components, and SCSS Modules following the existing landing page patterns. The implementation follows a mobile-first responsive design approach with comprehensive accessibility support.

## Tasks

- [x] 1. Set up page structure and metadata
  - Create directory structure at `src/app/landing/travel-agents/`
  - Create `page.tsx` with Next.js metadata configuration
  - Configure SEO metadata (title, description, keywords, Open Graph, Twitter cards)
  - Add structured data JSON-LD schema for WebPage
  - Set up canonical URL
  - _Requirements: 1.1, 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 2. Create SCSS module with base styles
  - Create `page.module.scss` file
  - Define color variables for travel-inspired theme (blue gradient, trust colors)
  - Set up typography scale (hero, headings, body text)
  - Define responsive breakpoints (mobile < 768px, tablet 769-1024px, desktop > 1024px)
  - Create base section styles (padding, max-width, centering)
  - _Requirements: 1.8, 8.1, 8.2, 8.4, 9.1, 9.6_

- [x] 3. Implement AppBar navigation component
  - Reuse existing AppBar from main landing page (`src/app/page.tsx`)
  - Include QuickRating logo and brand name
  - Add Login and Sign Up buttons with proper routing
  - Ensure responsive behavior (hide brand text on mobile if needed)
  - _Requirements: 1.9_

- [x] 4. Implement Hero Section
  - [x] 4.1 Create Hero Section layout and structure
    - Create hero container with blue gradient background
    - Add headline (h1): "Close more travel bookings with one trusted review link"
    - Add subheadline paragraph with value proposition
    - Implement responsive typography (56px → 32px headline)
    - _Requirements: 2.1, 2.2, 2.6_
  
  - [x] 4.2 Add Hero Section CTA buttons
    - Create primary CTA button: "View example review page" → `/try/setup`
    - Create secondary CTA button: "Get free setup" → `/auth/signup`
    - Style buttons with proper colors and hover states
    - Implement responsive button layout (horizontal → vertical stack)
    - Ensure touch-friendly sizing (44x44px minimum)
    - _Requirements: 2.3, 2.4, 8.3, 8.6_

- [x] 5. Implement Problem Section
  - Create Problem Section with white background
  - Add heading (h2): "New travel clients don't trust easily"
  - Create bullet list with four trust challenge items
  - Add bullet: "Leads ask 'Are you legit?' before paying"
  - Add bullet: "Your reviews are scattered across DMs, WhatsApp chats, and Facebook comments"
  - Add bullet: "Screenshots look unprofessional and are easy to fake"
  - Add bullet: "Google Reviews don't work well for independent agents"
  - Style with proper spacing and max-width (800px)
  - _Requirements: 1.3, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 6. Implement Solution Section
  - Create Solution Section with light blue background (#F0F8FF)
  - Add heading (h2): "One page that proves you're a trusted travel agent"
  - Add description paragraph explaining Review_Page concept
  - Create benefit bullets list with checkmark icons
  - Add bullet: "Public reviews page branded to you"
  - Add bullet: "Reviews tagged by trip type (cruise, group trip, honeymoon, etc.)"
  - Add bullet: "Easy to share on Instagram, WhatsApp, and email"
  - Add bullet: "You control your reviews — not a third-party platform"
  - Style checkmarks with green color (#34C759)
  - _Requirements: 1.4, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [x] 7. Implement How It Works Section
  - Create How It Works Section with white background
  - Add heading (h2) centered at top
  - Create Material-UI Grid layout for three step cards
  - Implement Step 1 card with number icon (1) and title "Create your personal travel agent review page"
  - Implement Step 2 card with number icon (2) and title "Send your review link to past or recent clients"
  - Implement Step 3 card with number icon (3) and title "Share your review page with new leads to build trust and close bookings"
  - Style step number icons (80px circles with gradient background)
  - Ensure responsive grid (3 columns → 1 column on mobile)
  - Maintain consistent spacing between steps
  - _Requirements: 1.5, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 8. Implement Use Cases Section
  - Create Use Cases Section with cream background (#FFFBF0)
  - Add heading (h2): "How travel agents use QuickRating"
  - Create bullet list with arrow icons
  - Add bullet: "Send your review link right after a travel inquiry"
  - Add bullet: "Add it to your Instagram bio"
  - Add bullet: "Drop it into WhatsApp conversations"
  - Add bullet: "Include it in follow-up emails before payment"
  - Style with proper spacing and max-width (800px)
  - _Requirements: 1.6, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 9. Implement Final CTA Section
  - Create Final CTA Section with blue gradient background (matching hero)
  - Add heading (h2): "Start closing more bookings today"
  - Create primary CTA button: "Get your free review page" → `/auth/signup`
  - Add subtext: "No credit card required • Free setup"
  - Style button with high contrast colors
  - Center all content
  - _Requirements: 1.7, 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 10. Implement Footer component
  - Reuse existing footer from main landing page
  - Include copyright notice with current year
  - Add links to Privacy Policy and Terms & Conditions
  - Ensure responsive layout
  - _Requirements: 1.10_

- [x] 11. Implement responsive design refinements
  - Test and refine mobile layout (< 768px)
  - Test and refine tablet layout (769-1024px)
  - Test and refine desktop layout (> 1024px)
  - Verify font size adjustments across breakpoints
  - Verify spacing and padding across breakpoints
  - Verify all sections display correctly at all sizes
  - _Requirements: 1.8, 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 12. Implement accessibility features
  - Add alt text to all images (if any images are added)
  - Verify semantic HTML structure (main, section, header, footer)
  - Verify heading hierarchy (h1 → h2 → h3)
  - Add ARIA labels to icon-only elements
  - Ensure all interactive elements have visible focus indicators
  - Test keyboard navigation through all interactive elements
  - Verify color contrast ratios meet WCAG 2.1 Level AA
  - _Requirements: 10.6, 11.3, 11.4, 11.5, 11.6, 11.7_

- [x] 13. Checkpoint - Manual testing and review
  - Ensure all tests pass, ask the user if questions arise.
  - Manually test the page at different viewport sizes
  - Verify all links navigate to correct destinations
  - Check visual appearance matches design specifications
  - Test keyboard navigation
  - Test with screen reader (if available)

- [ ]* 14. Write unit tests for content and layout
  - [ ]* 14.1 Write tests for Hero Section content
    - Test headline text is correct
    - Test subheadline text is correct
    - Test primary CTA links to `/try/setup`
    - Test secondary CTA links to `/auth/signup`
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [ ]* 14.2 Write tests for Problem Section content
    - Test heading text is correct
    - Test all four bullet points are present
    - Test each bullet contains expected text
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  
  - [ ]* 14.3 Write tests for Solution Section content
    - Test heading text is correct
    - Test description paragraph is present
    - Test all four benefit bullets are present
    - Test each benefit contains expected text
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_
  
  - [ ]* 14.4 Write tests for How It Works Section
    - Test three step cards are present
    - Test each step has correct title text
    - Test step numbers are displayed
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ]* 14.5 Write tests for Use Cases Section
    - Test heading text is correct
    - Test all four use case bullets are present
    - Test each use case contains expected text
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_
  
  - [ ]* 14.6 Write tests for Final CTA Section
    - Test heading text is correct
    - Test CTA button text is correct
    - Test CTA button links to `/auth/signup`
    - Test subtext is present
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [ ]* 14.7 Write tests for responsive behavior
    - Test mobile layout displays single column
    - Test mobile layout stacks CTA buttons vertically
    - Test desktop layout displays multi-column grids
    - Test font sizes adjust at different breakpoints
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [ ]* 14.8 Write tests for SEO metadata
    - Test page title is present and correct
    - Test meta description is present
    - Test Open Graph tags are present
    - Test structured data JSON-LD is present
    - Test semantic HTML elements are used
    - _Requirements: 10.1, 10.2, 10.4, 10.5, 10.6_
  
  - [ ]* 14.9 Write tests for visual hierarchy
    - Test headline font size is larger than subheadline
    - Test heading hierarchy follows h1 → h2 → h3
    - Test Lato font family is applied
    - _Requirements: 2.6, 9.4, 9.6, 11.4_

- [ ]* 15. Write property-based tests for accessibility
  - [ ]* 15.1 Write property test for image accessibility
    - **Property 1: Image Accessibility**
    - Test that all image elements have alt attributes
    - Configure test to run 100 iterations
    - **Validates: Requirements 11.3**
  
  - [ ]* 15.2 Write property test for keyboard accessibility
    - **Property 2: Keyboard Accessibility**
    - Test that all interactive elements are keyboard accessible
    - Test that all buttons, links, and inputs are focusable
    - Configure test to run 100 iterations
    - **Validates: Requirements 11.5**
  
  - [ ]* 15.3 Write property test for color contrast
    - **Property 3: Color Contrast Compliance**
    - Test that all text meets WCAG 2.1 Level AA contrast ratios
    - Test normal text has 4.5:1 ratio minimum
    - Test large text has 3:1 ratio minimum
    - Configure test to run 100 iterations
    - **Validates: Requirements 11.6**

- [x] 16. Final checkpoint - Complete testing and deployment readiness
  - Ensure all tests pass, ask the user if questions arise.
  - Run full test suite with coverage report
  - Verify all property tests pass with 100 iterations
  - Perform final manual testing across devices
  - Verify page loads quickly (< 3 seconds)
  - Confirm page is ready for deployment

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal accessibility properties
- Unit tests validate specific content and responsive behavior
- The page is a server component with no client-side JavaScript, ensuring optimal performance
- All styling follows the existing landing page patterns for consistency
- Accessibility is a core requirement, not an afterthought
